const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinaryUpload');

// @desc   Upload single image to Cloudinary
// @route  POST /api/upload
// @access Private (Admin)
const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please attach an image file' });
    }

    const folder = req.body.folder || 'shree_shyam_dental';
    const result = await uploadToCloudinary(req.file.buffer, folder);

    res.json({
      success: true,
      message: 'Image uploaded successfully to Cloudinary',
      data: {
        public_id: result.public_id,
        secure_url: result.secure_url,
        alt: req.body.alt || 'Uploaded image',
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Upload multiple images to Cloudinary
// @route  POST /api/upload/multiple
// @access Private (Admin)
const uploadMultipleImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'Please attach image files' });
    }

    const folder = req.body.folder || 'shree_shyam_dental';
    const uploadPromises = req.files.map((file) => uploadToCloudinary(file.buffer, folder));
    const results = await Promise.all(uploadPromises);

    res.json({
      success: true,
      message: 'Images uploaded successfully',
      data: results.map((r) => ({
        public_id: r.public_id,
        secure_url: r.secure_url,
        alt: 'Gallery photo',
      })),
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Delete image from Cloudinary
// @route  DELETE /api/upload
// @access Private (Admin)
const deleteImage = async (req, res, next) => {
  try {
    const { public_id } = req.body;
    if (!public_id) {
      return res.status(400).json({ success: false, message: 'public_id is required' });
    }

    const result = await deleteFromCloudinary(public_id);
    res.json({
      success: true,
      message: 'Image removed from Cloudinary',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadImage,
  uploadMultipleImages,
  deleteImage,
};
