const express = require('express');
const router = express.Router();
const {
  getFAQs,
  getAdminFAQs,
  createFAQ,
  updateFAQ,
  deleteFAQ,
} = require('../controllers/faqController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(getFAQs)
  .post(protect, createFAQ);

router.get('/admin/all', protect, getAdminFAQs);

router.route('/:id')
  .put(protect, updateFAQ)
  .delete(protect, deleteFAQ);

module.exports = router;
