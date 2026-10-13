const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    excerpt: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    featuredImage: {
      public_id: { type: String, default: '' },
      secure_url: { type: String, default: '' },
      alt: { type: String, default: 'Dental Health Blog' },
    },
    author: {
      name: { type: String, default: 'Dr. Jitendra Saini' },
      title: { type: String, default: 'Chief Dental Surgeon (BDS)' },
      avatar: { type: String, default: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&q=80' },
    },
    category: {
      type: String,
      default: 'Oral Health Tips',
    },
    tags: {
      type: [String],
      default: ['Dental Implants', 'Oral Hygiene', 'Smile Design'],
    },
    readTime: {
      type: String,
      default: '4 min read',
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
    seoTitle: {
      type: String,
      default: '',
    },
    metaDescription: {
      type: String,
      default: '',
    },
    ogImage: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

blogSchema.index({ slug: 1, isPublished: 1, publishedAt: -1 });

module.exports = mongoose.model('Blog', blogSchema);
