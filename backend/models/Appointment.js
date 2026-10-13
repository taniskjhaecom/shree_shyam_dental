const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
    },
    treatmentRequired: {
      type: String,
      default: 'General Consultation',
    },
    preferredDate: {
      type: String,
      required: [true, 'Preferred appointment date is required'],
    },
    preferredSlot: {
      type: String,
      default: 'Morning (10:00 AM - 01:00 PM)',
      enum: [
        'Morning (10:00 AM - 01:00 PM)',
        'Afternoon (02:00 PM - 05:00 PM)',
        'Evening (05:00 PM - 08:30 PM)',
        'Any Available Slot',
      ],
    },
    notes: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
      default: 'Pending',
    },
    adminNotes: {
      type: String,
      default: '',
    },
    source: {
      type: String,
      default: 'Website Form',
    },
  },
  {
    timestamps: true,
  }
);

appointmentSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Appointment', appointmentSchema);
