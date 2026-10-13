const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema(
  {
    patientName: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      default: '',
    },
    rating: {
      type: Number,
      default: 5,
      min: 1,
      max: 5,
    },
    treatmentTaken: {
      type: String,
      default: 'Dental Implants',
    },
    review: {
      type: String,
      required: true,
    },
    avatar: {
      public_id: { type: String, default: '' },
      secure_url: { type: String, default: '' },
      alt: { type: String, default: 'Patient portrait' },
    },
    isVerified: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: true,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

testimonialSchema.index({ isPublished: 1, isFeatured: 1, order: 1 });

module.exports = mongoose.model('Testimonial', testimonialSchema);
