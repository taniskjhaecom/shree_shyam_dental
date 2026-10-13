const ContactMessage = require('../models/ContactMessage');

// @desc   Submit contact form
// @route  POST /api/contact
// @access Public
const submitContactForm = async (req, res, next) => {
  try {
    const { fullName, name, email, phone, subject, message } = req.body;
    const finalFullName = fullName || name;

    if (!finalFullName || !phone || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your name, phone number, and message.',
      });
    }

    const newMessage = await ContactMessage.create({
      fullName: finalFullName,
      email: email ? email.trim().toLowerCase() : '',
      phone,
      subject: subject || 'General Inquiry',
      message,
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for reaching out! We have received your message and will respond promptly.',
      data: newMessage,
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Admin get contact messages
// @route  GET /api/contact
// @access Private (Admin)
const getContactMessages = async (req, res, next) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: messages.length,
      data: messages,
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Admin update message status
// @route  PUT /api/contact/:id
// @access Private (Admin)
const updateContactMessage = async (req, res, next) => {
  try {
    const message = await ContactMessage.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    res.json({
      success: true,
      message: 'Message status updated',
      data: message,
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Admin delete message
// @route  DELETE /api/contact/:id
// @access Private (Admin)
const deleteContactMessage = async (req, res, next) => {
  try {
    const message = await ContactMessage.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }
    await message.deleteOne();
    res.json({ success: true, message: 'Message deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitContactForm,
  getContactMessages,
  updateContactMessage,
  deleteContactMessage,
};
