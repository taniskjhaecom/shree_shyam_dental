const express = require('express');
const router = express.Router();
const {
  getTestimonials,
  getAdminTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} = require('../controllers/testimonialController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(getTestimonials)
  .post(protect, createTestimonial);

router.get('/admin/all', protect, getAdminTestimonials);

router.route('/:id')
  .put(protect, updateTestimonial)
  .delete(protect, deleteTestimonial);

module.exports = router;
