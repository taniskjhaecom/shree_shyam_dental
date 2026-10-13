import React, { useEffect, useState } from 'react';
import { Search, BookOpen } from 'lucide-react';
import apiClient from '../../api/apiClient';
import { useSettings } from '../../context/SettingsContext';
import SEO from '../../components/common/SEO';
import SectionHeading from '../../components/common/SectionHeading';
import BlogCard from '../../components/common/BlogCard';
import Loader from '../../components/common/Loader';
import { CardSkeleton } from '../../components/common/Skeleton';

const BlogsPage = () => {
  const { settings } = useSettings();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get('/blogs');
        if (res.data.success) {
          setBlogs(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching blogs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const clinicName = settings?.clinicName || 'Shree Shyam Dental Hospital';
  const categories = ['All', ...new Set(blogs.map((b) => b.category).filter(Boolean))];

  const filteredBlogs = blogs.filter((b) => {
    const matchesCategory =
      selectedCategory === 'All' || b.category === selectedCategory;
    const matchesSearch =
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <SEO
        title="Dental Health Blogs & Oral Hygiene Articles"
        description={`Read professional dental care tips, guides on dental implants, root canal treatments, porcelain veneers, and teeth whitening from specialists at ${clinicName}.`}
      />

      {/* Hero Header */}
      <section className="pt-12 pb-14 bg-gradient-to-b from-teal-50/50 via-white to-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-teal-100 text-teal-800 text-xs font-semibold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5 text-teal-600" />
            Patient Education & Insights
          </span>
          <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-slate-900 tracking-tight max-w-3xl mx-auto">
            Dental Health Blogs & Clinical Guides
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Evidence-based advice on implants, smile design, preventive checkups, and children's dentistry.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Filters & Search */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
            {categories.length > 2 && (
              <div className="flex flex-wrap items-center gap-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-teal-600 text-white shadow-xs'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}

            <div className="relative w-full md:w-72 shrink-0">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search articles & tips..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all"
              />
            </div>
          </div>

          {/* Blogs Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : filteredBlogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBlogs.map((blog, idx) => (
                <BlogCard key={blog.slug || idx} blog={blog} index={idx} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 text-sm">
              <BookOpen className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p>No articles found matching "{searchQuery}".</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default BlogsPage;
