const express = require('express');
const router = express.Router();
const {
  getGallery,
  getAdminGallery,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
} = require('../controllers/galleryController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(getGallery)
  .post(protect, createGalleryItem);

router.get('/admin/all', protect, getAdminGallery);

router.route('/:id')
  .put(protect, updateGalleryItem)
  .delete(protect, deleteGalleryItem);

module.exports = router;
