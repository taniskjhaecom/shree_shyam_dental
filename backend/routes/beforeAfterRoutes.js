const express = require('express');
const router = express.Router();
const {
  getBeforeAfterResults,
  getAdminBeforeAfter,
  createBeforeAfter,
  updateBeforeAfter,
  deleteBeforeAfter,
} = require('../controllers/beforeAfterController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(getBeforeAfterResults)
  .post(protect, createBeforeAfter);

router.get('/admin/all', protect, getAdminBeforeAfter);

router.route('/:id')
  .put(protect, updateBeforeAfter)
  .delete(protect, deleteBeforeAfter);

module.exports = router;
