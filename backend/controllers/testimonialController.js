const Testimonial = require('../models/Testimonial');

// @desc   Get published testimonials
// @route  GET /api/testimonials
// @access Public
const getTestimonials = async (req, res, next) => {
  try {
    const testimonials = await Testimonial.find({ isPublished: true }).sort({ order: 1, createdAt: -1 });
    res.json({
      success: true,
      count: testimonials.length,
      data: testimonials,
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Admin get all testimonials
// @route  GET /api/testimonials/admin/all
// @access Private (Admin)
const getAdminTestimonials = async (req, res, next) => {
  try {
    const testimonials = await Testimonial.find().sort({ order: 1, createdAt: -1 });
    res.json({
      success: true,
      count: testimonials.length,
      data: testimonials,
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Create testimonial
// @route  POST /api/testimonials
// @access Private (Admin)
const createTestimonial = async (req, res, next) => {
  try {
    const item = await Testimonial.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Testimonial added successfully',
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Update testimonial
// @route  PUT /api/testimonials/:id
// @access Private (Admin)
const updateTestimonial = async (req, res, next) => {
  try {
    const item = await Testimonial.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!item) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }

    res.json({
      success: true,
      message: 'Testimonial updated successfully',
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Delete testimonial
// @route  DELETE /api/testimonials/:id
// @access Private (Admin)
const deleteTestimonial = async (req, res, next) => {
  try {
    const item = await Testimonial.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }

    await item.deleteOne();

    res.json({
      success: true,
      message: 'Testimonial deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTestimonials,
  getAdminTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
};
