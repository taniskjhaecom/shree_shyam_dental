const express = require('express');
const router = express.Router();
const {
  getTreatments,
  getTreatmentBySlug,
  getAdminTreatments,
  createTreatment,
  updateTreatment,
  deleteTreatment,
} = require('../controllers/treatmentController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(getTreatments)
  .post(protect, createTreatment);

router.get('/admin/all', protect, getAdminTreatments);
router.get('/:slug', getTreatmentBySlug);

router.route('/:id')
  .put(protect, updateTreatment)
  .delete(protect, deleteTreatment);

module.exports = router;
