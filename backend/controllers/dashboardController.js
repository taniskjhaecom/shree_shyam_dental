const Appointment = require('../models/Appointment');
const Treatment = require('../models/Treatment');
const Blog = require('../models/Blog');
const Testimonial = require('../models/Testimonial');
const Gallery = require('../models/Gallery');
const BeforeAfterResult = require('../models/BeforeAfterResult');
const ContactMessage = require('../models/ContactMessage');

// @desc   Get admin dashboard analytics & metrics
// @route  GET /api/dashboard/stats
// @access Private (Admin)
const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalAppointments,
      pendingAppointments,
      confirmedAppointments,
      completedAppointments,
      totalTreatments,
      totalBlogs,
      publishedBlogs,
      totalTestimonials,
      totalGallery,
      totalBeforeAfter,
      totalMessages,
      recentAppointments,
      recentMessages,
    ] = await Promise.all([
      Appointment.countDocuments(),
      Appointment.countDocuments({ status: 'Pending' }),
      Appointment.countDocuments({ status: 'Confirmed' }),
      Appointment.countDocuments({ status: 'Completed' }),
      Treatment.countDocuments(),
      Blog.countDocuments(),
      Blog.countDocuments({ isPublished: true }),
      Testimonial.countDocuments(),
      Gallery.countDocuments(),
      BeforeAfterResult.countDocuments(),
      ContactMessage.countDocuments({ isRead: false }),
      Appointment.find().sort({ createdAt: -1 }).limit(6),
      ContactMessage.find().sort({ createdAt: -1 }).limit(6),
    ]);

    res.json({
      success: true,
      data: {
        stats: {
          totalAppointments,
          pendingAppointments,
          confirmedAppointments,
          completedAppointments,
          totalTreatments,
          totalBlogs,
          publishedBlogs,
          totalTestimonials,
          totalGallery,
          totalBeforeAfter,
          unreadMessages: totalMessages,
        },
        recentAppointments,
        recentMessages,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
};
