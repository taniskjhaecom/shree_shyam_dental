const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware');
const {
  uploadImage,
  uploadMultipleImages,
  deleteImage,
} = require('../controllers/uploadController');

router.post('/', protect, upload.single('image'), uploadImage);
router.post('/multiple', protect, upload.array('images', 10), uploadMultipleImages);
router.delete('/', protect, deleteImage);

module.exports = router;
