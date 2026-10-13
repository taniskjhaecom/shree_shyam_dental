import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  User,
  ArrowLeft,
  Share2,
  Bookmark,
  CheckCircle2,
} from 'lucide-react';
import apiClient from '../../api/apiClient';
import { useSettings } from '../../context/SettingsContext';
import { useAppointmentModal } from '../../context/AppointmentModalContext';
import SEO from '../../components/common/SEO';
import BlogCard from '../../components/common/BlogCard';
import Loader from '../../components/common/Loader';
import { BlogDetailSkeleton } from '../../components/common/Skeleton';

const BlogDetailPage = () => {
  const { slug } = useParams();
  const { settings } = useSettings();
  const { openModal } = useAppointmentModal();

  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        setError(false);
        const res = await apiClient.get(`/blogs/${slug}`);
        if (res.data.success) {
          setBlog(res.data.data);
          setRelatedBlogs(res.data.related || []);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Error fetching blog article:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return <BlogDetailSkeleton />;
  }

  if (error || !blog) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 space-y-4 text-center">
        <h2 className="font-heading font-bold text-2xl text-slate-800">Article Not Found</h2>
        <p className="text-sm text-slate-500">The dental blog post could not be found.</p>
        <Link
          to="/blogs"
          className="inline-flex items-center gap-2 bg-teal-600 text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Articles</span>
        </Link>
      </div>
    );
  }

  const clinicName = settings?.clinicName || 'Shree Shyam Dental Hospital';
  const heroImg =
    blog.featuredImage?.secure_url ||
    'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=1200&q=80';

  const formattedDate = blog.publishedAt
    ? new Date(blog.publishedAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Recent Post';

  // Article JSON-LD Structured Data
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: blog.excerpt,
    image: heroImg,
    datePublished: blog.publishedAt || new Date().toISOString(),
    author: {
      '@type': 'Person',
      name: blog.author?.name || 'Dr. Jitendra Saini',
    },
    publisher: {
      '@type': 'Organization',
      name: clinicName,
      logo: {
        '@type': 'ImageObject',
        url: settings?.logo?.secure_url || heroImg,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': typeof window !== 'undefined' ? window.location.href : '',
    },
  };

  return (
    <>
      <SEO
        title={blog.seoTitle || blog.title}
        description={blog.metaDescription || blog.excerpt}
        ogImage={heroImg}
        ogType="article"
        schema={articleSchema}
      />

      <article className="pt-8 pb-16 bg-white min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Breadcrumb & Navigation */}
          <div className="flex items-center justify-between text-xs text-slate-500">
            <Link
              to="/blogs"
              className="inline-flex items-center gap-1.5 font-semibold text-teal-700 hover:text-teal-800"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Articles</span>
            </Link>

            <span className="px-3 py-1 rounded-full bg-teal-50 text-teal-800 font-semibold">
              {blog.category || 'Dental Health'}
            </span>
          </div>

          {/* Title & Metadata */}
          <div className="space-y-4 text-left">
            <h1 className="font-heading font-extrabold text-2xl sm:text-4xl lg:text-5xl text-slate-900 tracking-tight leading-tight">
              {blog.title}
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              {blog.excerpt}
            </p>

            {/* Author info bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-slate-100 text-xs text-slate-500">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-sm">
                  {blog.author?.name ? blog.author.name.charAt(0) : 'D'}
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">{blog.author?.name || 'Dr. Jitendra Saini'}</span>
                  <span className="text-[11px] text-teal-700">{blog.author?.title || 'Chief Dental Surgeon (BDS)'}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {formattedDate}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {blog.readTime || '4 min read'}
                </span>
              </div>
            </div>
          </div>

          {/* Featured Hero Image */}
          <div className="aspect-[16/9] rounded-3xl overflow-hidden shadow-xl border border-slate-100 bg-slate-100">
            <img
              src={heroImg}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Article Body Content */}
          <div className="prose prose-lg prose-slate max-w-none text-slate-700 leading-relaxed text-left space-y-6 pt-4 whitespace-pre-line">
            {blog.content}
          </div>

          {/* Tags */}
          {blog.tags?.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-6 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-500 mr-2">Tags:</span>
              {blog.tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Consultation CTA Banner */}
          <div className="p-8 rounded-3xl bg-gradient-to-r from-teal-700 to-cyan-900 text-white text-center space-y-4 my-8">
            <h3 className="font-heading font-bold text-2xl">
              Have Questions About This Dental Topic?
            </h3>
            <p className="text-xs sm:text-sm text-teal-100 max-w-md mx-auto">
              Our clinical specialists at {clinicName} are here to help you make informed decisions about your oral wellness.
            </p>
            <button
              onClick={() => openModal()}
              className="inline-flex items-center gap-2 bg-white text-teal-900 font-bold px-6 py-3 rounded-xl shadow-lg hover:bg-slate-100 transition-all cursor-pointer text-xs sm:text-sm"
            >
              <Calendar className="w-4 h-4 text-teal-700" />
              <span>Book Priority Consultation</span>
            </button>
          </div>

          {/* Related Articles */}
          {relatedBlogs.length > 0 && (
            <div className="pt-12 border-t border-slate-100 space-y-6">
              <h3 className="font-heading font-bold text-2xl text-slate-900 text-left">
                Related Articles
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedBlogs.map((rel, idx) => (
                  <BlogCard key={rel.slug || idx} blog={rel} index={idx} />
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
    </>
  );
};

export default BlogDetailPage;
