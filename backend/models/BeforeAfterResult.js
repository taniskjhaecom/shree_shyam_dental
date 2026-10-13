const mongoose = require('mongoose');

const beforeAfterResultSchema = new mongoose.Schema(
  {
    patientName: {
      type: String,
      required: true,
      default: 'Anonymous Patient',
      trim: true,
    },
    age: {
      type: String,
      default: '',
    },
    treatmentName: {
      type: String,
      required: true,
      trim: true,
    },
    treatmentCategory: {
      type: String,
      default: 'Cosmetic Dentistry',
    },
    beforeImage: {
      public_id: { type: String, default: '' },
      secure_url: { type: String, default: '' },
      alt: { type: String, default: 'Dental case before treatment' },
    },
    afterImage: {
      public_id: { type: String, default: '' },
      secure_url: { type: String, default: '' },
      alt: { type: String, default: 'Dental case after treatment' },
    },
    treatmentDuration: {
      type: String,
      default: '2 Sessions (3 Weeks)',
    },
    description: {
      type: String,
      default: 'Full smile enhancement with digital smile design, porcelain veneers, and laser gingival contouring.',
    },
    doctorNotes: {
      type: String,
      default: 'Restored tooth proportions and bite alignment with life-like E-max aesthetics.',
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

beforeAfterResultSchema.index({ isPublished: 1, order: 1 });

module.exports = mongoose.model('BeforeAfterResult', beforeAfterResultSchema);
