const Treatment = require('../models/Treatment');
const Blog = require('../models/Blog');
const ClinicSettings = require('../models/ClinicSettings');

// In-memory 1-hour cache
let cachedSitemapXml = null;
let lastCacheTimestamp = 0;
const CACHE_DURATION_MS = 60 * 60 * 1000; // 1 hour

/**
 * Invalidate sitemap cache immediately whenever CMS content changes
 */
const invalidateSitemapCache = () => {
  cachedSitemapXml = null;
  lastCacheTimestamp = 0;
  console.log('[Sitemap] Cache invalidated due to content update.');
};

/**
 * Generate XML string for sitemap
 */
const generateSitemapXml = async (siteUrl) => {
  const baseUrl = (siteUrl || process.env.SITE_URL || 'http://localhost:5173').replace(/\/$/, '');
  const nowIso = new Date().toISOString().split('T')[0];

  // Fetch settings for latest timestamp
  let latestSettingsDate = nowIso;
  try {
    const settings = await ClinicSettings.findOne().sort({ updatedAt: -1 }).select('updatedAt');
    if (settings && settings.updatedAt) {
      latestSettingsDate = new Date(settings.updatedAt).toISOString().split('T')[0];
    }
  } catch (err) {
    // fallback to nowIso
  }

  // Core public static routes
  const staticRoutes = [
    { url: `${baseUrl}/`, priority: '1.0', changefreq: 'daily', lastmod: latestSettingsDate },
    { url: `${baseUrl}/about`, priority: '0.9', changefreq: 'weekly', lastmod: latestSettingsDate },
    { url: `${baseUrl}/treatments`, priority: '0.9', changefreq: 'weekly', lastmod: latestSettingsDate },
    { url: `${baseUrl}/results`, priority: '0.8', changefreq: 'weekly', lastmod: latestSettingsDate },
    { url: `${baseUrl}/gallery`, priority: '0.8', changefreq: 'weekly', lastmod: latestSettingsDate },
    { url: `${baseUrl}/blogs`, priority: '0.8', changefreq: 'daily', lastmod: latestSettingsDate },
    { url: `${baseUrl}/faqs`, priority: '0.7', changefreq: 'weekly', lastmod: latestSettingsDate },
    { url: `${baseUrl}/contact`, priority: '0.8', changefreq: 'monthly', lastmod: latestSettingsDate },
    { url: `${baseUrl}/book-appointment`, priority: '0.9', changefreq: 'monthly', lastmod: latestSettingsDate },
    { url: `${baseUrl}/privacy-policy`, priority: '0.3', changefreq: 'yearly', lastmod: latestSettingsDate },
    { url: `${baseUrl}/terms`, priority: '0.3', changefreq: 'yearly', lastmod: latestSettingsDate },
  ];

  // Fetch published treatments only
  const treatments = await Treatment.find({ isPublished: true })
    .select('slug updatedAt')
    .sort({ order: 1 });

  const treatmentRoutes = treatments.map((t) => ({
    url: `${baseUrl}/treatments/${t.slug}`,
    priority: '0.85',
    changefreq: 'weekly',
    lastmod: t.updatedAt ? new Date(t.updatedAt).toISOString().split('T')[0] : nowIso,
  }));

  // Fetch published blogs only
  const blogs = await Blog.find({ isPublished: true })
    .select('slug updatedAt')
    .sort({ publishedAt: -1 });

  const blogRoutes = blogs.map((b) => ({
    url: `${baseUrl}/blogs/${b.slug}`,
    priority: '0.75',
    changefreq: 'weekly',
    lastmod: b.updatedAt ? new Date(b.updatedAt).toISOString().split('T')[0] : nowIso,
  }));

  const allUrls = [...staticRoutes, ...treatmentRoutes, ...blogRoutes];

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  allUrls.forEach((item) => {
    xml += '  <url>\n';
    xml += `    <loc>${item.url}</loc>\n`;
    xml += `    <lastmod>${item.lastmod}</lastmod>\n`;
    xml += `    <changefreq>${item.changefreq}</changefreq>\n`;
    xml += `    <priority>${item.priority}</priority>\n`;
    xml += '  </url>\n';
  });

  xml += '</urlset>';
  return xml;
};

/**
 * Controller / Handler for /sitemap.xml
 */
const getSitemap = async (req, res) => {
  try {
    const now = Date.now();
    const siteUrl = process.env.SITE_URL || `${req.protocol}://${req.get('host')}`;

    if (cachedSitemapXml && now - lastCacheTimestamp < CACHE_DURATION_MS) {
      res.header('Content-Type', 'application/xml');
      res.header('Cache-Control', 'public, max-age=3600');
      return res.send(cachedSitemapXml);
    }

    const xml = await generateSitemapXml(siteUrl);
    cachedSitemapXml = xml;
    lastCacheTimestamp = now;

    res.header('Content-Type', 'application/xml');
    res.header('Cache-Control', 'public, max-age=3600');
    return res.send(xml);
  } catch (error) {
    console.error('[Sitemap Generation Error]:', error);
    res.status(500).send('Error generating sitemap');
  }
};

module.exports = {
  getSitemap,
  invalidateSitemapCache,
  generateSitemapXml,
};
