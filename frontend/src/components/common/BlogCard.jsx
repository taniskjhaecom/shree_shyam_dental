import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight, User } from 'lucide-react';

const BlogCard = ({ blog, index = 0 }) => {
  const imageUrl =
    blog.featuredImage?.secure_url ||
    'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80';

  const formattedDate = blog.publishedAt
    ? new Date(blog.publishedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Recent Post';

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: (index % 3) * 0.08 }}
      whileHover={{ y: -6 }}
      className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group"
    >
      {/* Thumbnail */}
      <Link to={`/blogs/${blog.slug}`} className="relative aspect-[16/10] overflow-hidden bg-slate-100 block">
        <img
          src={imageUrl}
          alt={blog.featuredImage?.alt || blog.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white/95 text-teal-800 backdrop-blur-md shadow-xs">
            {blog.category || 'Dental Health'}
          </span>
        </div>
      </Link>

      {/* Body */}
      <div className="p-5 sm:p-6 flex flex-col flex-grow justify-between space-y-4">
        <div className="space-y-2.5">
          <div className="flex items-center gap-3 text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {formattedDate}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {blog.readTime || '4 min read'}
            </span>
          </div>

          <h3 className="font-heading font-bold text-lg text-slate-900 group-hover:text-teal-600 transition-colors line-clamp-2 leading-snug">
            <Link to={`/blogs/${blog.slug}`}>{blog.title}</Link>
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
            {blog.excerpt}
          </p>
        </div>

        {/* Footer info & CTA */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium truncate max-w-[150px]">
            By {blog.author?.name || 'Dr. Jitendra Saini'}
          </span>

          <Link
            to={`/blogs/${blog.slug}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-teal-600 group-hover:text-teal-700 transition-colors"
          >
            <span>Read Article</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
};

export default BlogCard;
