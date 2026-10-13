import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useSettings } from '../../context/SettingsContext';

const DEFAULT_SEO = {
  metaTitle: 'Shree Shyam Dental Hospital | Advanced Dental & Implant Center',
  metaDescription: 'Shree Shyam Dental Hospital in Jhunjhunu offers painless dental implants, cosmetic dentistry, root canal treatments, and comprehensive dental care with hospital-grade sterilization.',
  keywords: 'dental hospital, dental clinic, dental implants, cosmetic dentistry, root canal, teeth whitening, veneers, dentist near me, dentist in jhunjhunu, dental hospital jhunjhunu',
  ogImage: '/hero-smile.jpg',
};

const SEO = ({
  title,
  description,
  keywords,
  canonical,
  ogImage,
  ogType = 'website',
  schema,
  noindex = false,
}) => {
  const { settings } = useSettings();

  const siteName = settings?.clinicName || 'Shree Shyam Dental Hospital';
  const defaultDesc = DEFAULT_SEO.metaDescription;
  const defaultOgImage = DEFAULT_SEO.ogImage;
  const defaultKeywords = DEFAULT_SEO.keywords;

  const finalTitle = title ? `${title} | ${siteName}` : DEFAULT_SEO.metaTitle;
  const finalDesc = description || defaultDesc;
  const finalKeywords = keywords ? (Array.isArray(keywords) ? keywords.join(', ') : keywords) : defaultKeywords;
  const finalImage = ogImage || defaultOgImage;

  // Compute canonical URL
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173';
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
  const finalCanonical = canonical || `${currentOrigin}${currentPath}`;

  // Default MedicalBusiness / Dentist JSON-LD schema
  const defaultBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'Dentist',
    name: siteName,
    image: finalImage,
    url: currentOrigin,
    telephone: settings?.phone || '+91 98765 43210',
    priceRange: '₹₹',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Shanti Nagar, Newari Road, Chofuliya',
      addressLocality: 'Jhunjhunu',
      addressRegion: 'Rajasthan',
      postalCode: '333053',
      addressCountry: 'IN',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '09:00',
        closes: '20:30',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Sunday'],
        opens: '10:00',
        closes: '14:00',
      },
    ],
    sameAs: [
      settings?.socialLinks?.instagram,
      settings?.socialLinks?.facebook,
      settings?.socialLinks?.youtube,
      settings?.socialLinks?.linkedin,
    ].filter(Boolean),
  };

  const finalSchema = schema || defaultBusinessSchema;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{finalTitle}</title>
      <meta name="description" content={finalDesc} />
      {finalKeywords && <meta name="keywords" content={finalKeywords} />}
      <link rel="canonical" href={finalCanonical} />

      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDesc} />
      <meta property="og:image" content={finalImage} />
      <meta property="og:url" content={finalCanonical} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDesc} />
      <meta name="twitter:image" content={finalImage} />

      {/* Dynamic JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(finalSchema)}
      </script>
    </Helmet>
  );
};

export default SEO;
