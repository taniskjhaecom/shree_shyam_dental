const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    caption: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      default: 'Hospital Infrastructure',
    },
    mediaType: {
      type: String,
      enum: ['photo', 'video'],
      default: 'photo',
    },
    youtubeUrl: {
      type: String,
      default: '',
      trim: true,
    },
    image: {
      public_id: { type: String, default: '' },
      secure_url: { type: String, default: '' },
      alt: { type: String, default: 'Shree Shyam Dental Hospital' },
    },
    order: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

gallerySchema.index({ mediaType: 1, category: 1, isPublished: 1, order: 1 });

module.exports = mongoose.model('Gallery', gallerySchema);
