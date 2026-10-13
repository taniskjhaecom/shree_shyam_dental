const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      default: 'Dr. Jitendra Saini',
      trim: true,
    },
    degrees: {
      type: [String],
      default: ['B.D.S.'],
    },
    title: {
      type: String,
      default: 'Chief Dental Surgeon',
    },
    experienceYears: {
      type: Number,
      default: 6,
    },
    implantsPlacedCount: {
      type: String,
      default: '2,500+',
    },
    bio: {
      type: String,
      default:
        'Dr. Jitendra Saini is an experienced Dental Surgeon (B.D.S.) with over 6+ years of clinical excellence in dental implants, restorative procedures, and aesthetic smile transformations. He is recognized for bringing gentle, painless and cutting-edge aesthetic dental care to patients across the region.',
    },
    quote: {
      type: String,
      default: '“My goal is simple — to give every patient a smile they’re proud of, with the comfort and care they deserve.”',
    },
    image: {
      public_id: { type: String, default: '' },
      secure_url: {
        type: String,
        default: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80',
      },
      alt: { type: String, default: 'Dr. Jitendra Saini - Senior Dental Surgeon' },
    },
    specializations: {
      type: [String],
      default: [
        'Immediate Loading Dental Implants',
        'Digital Smile Designing & Porcelain Veneers',
        'Full Mouth Rehabilitation & Fixed Zirconia Bridges',
        'Rotary Single-Sitting Micro-Endodontics',
        'Laser Assisted Cosmetic Gum Architecture',
      ],
    },
    memberships: {
      type: [String],
      default: [
        'Indian Dental Association (IDA)',
        'International Congress of Oral Implantologists (ICOI)',
      ],
    },
    isFeatured: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Doctor', doctorSchema);
