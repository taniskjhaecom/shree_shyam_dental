const mongoose = require('mongoose');

const treatmentSchema = new mongoose.Schema(
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
    shortDescription: {
      type: String,
      required: true,
    },
    detailedContent: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['Implants', 'Cosmetic', 'Restorative', 'General', 'Orthodontics', 'Pediatric', 'Surgical'],
      default: 'General',
    },
    iconName: {
      type: String,
      default: 'Sparkles',
    },
    heroImage: {
      public_id: { type: String, default: '' },
      secure_url: { type: String, default: '' },
      alt: { type: String, default: 'Dental Treatment' },
    },
    galleryImages: [
      {
        public_id: { type: String, default: '' },
        secure_url: { type: String, default: '' },
        alt: { type: String, default: 'Treatment photo' },
      },
    ],
    benefits: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
      },
    ],
    process: [
      {
        step: { type: Number, required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
      },
    ],
    faqs: [
      {
        question: { type: String, required: true },
        answer: { type: String, required: true },
      },
    ],
    duration: {
      type: String,
      default: '30-60 mins',
    },
    recoveryTime: {
      type: String,
      default: 'Immediate to 24 hours',
    },
    anesthesia: {
      type: String,
      default: 'Local / Painless computer-controlled',
    },
    priceRange: {
      type: String,
      default: 'Consultation required for custom quote',
    },
    isPopular: {
      type: Boolean,
      default: false,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    seoTitle: {
      type: String,
      default: '',
    },
    seoDescription: {
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

treatmentSchema.index({ slug: 1, isPublished: 1, order: 1 });

module.exports = mongoose.model('Treatment', treatmentSchema);
