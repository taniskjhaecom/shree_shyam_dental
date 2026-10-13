const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },
    answer: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['General', 'Dental Implants', 'Cosmetic Dentistry', 'Root Canal & Surgery', 'Appointments & Insurance', 'Children & Orthodontics'],
      default: 'General',
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

faqSchema.index({ category: 1, isPublished: 1, order: 1 });

module.exports = mongoose.model('FAQ', faqSchema);
