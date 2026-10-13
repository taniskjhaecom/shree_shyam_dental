const Appointment = require('../models/Appointment');

// @desc   Submit appointment request
// @route  POST /api/appointments
// @access Public
const createAppointment = async (req, res, next) => {
  try {
    const { fullName, phone, email, treatmentRequired, preferredDate, preferredSlot, notes } = req.body;

    if (!fullName || !phone || !preferredDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide full name, phone number, and preferred appointment date.',
      });
    }

    const appointment = await Appointment.create({
      fullName,
      phone,
      email: email ? email.trim().toLowerCase() : '',
      treatmentRequired: treatmentRequired || 'General Consultation',
      preferredDate,
      preferredSlot: preferredSlot || 'Morning (10:00 AM - 01:00 PM)',
      notes: notes || '',
      status: 'Pending',
    });

    res.status(201).json({
      success: true,
      message: 'Appointment request submitted successfully! Our clinic desk will contact you to confirm your slot.',
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Admin get all appointments
// @route  GET /api/appointments
// @access Private (Admin)
const getAppointments = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    let query = {};

    if (status && status !== 'All') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { treatmentRequired: { $regex: search, $options: 'i' } },
      ];
    }

    const appointments = await Appointment.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Update appointment status and admin notes
// @route  PUT /api/appointments/:id
// @access Private (Admin)
const updateAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    res.json({
      success: true,
      message: 'Appointment updated successfully',
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Delete appointment
// @route  DELETE /api/appointments/:id
// @access Private (Admin)
const deleteAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    await appointment.deleteOne();

    res.json({
      success: true,
      message: 'Appointment record deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAppointment,
  getAppointments,
  updateAppointment,
  deleteAppointment,
};
