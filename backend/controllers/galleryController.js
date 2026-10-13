const Gallery = require('../models/Gallery');

const getYouTubeId = (url) => {
  if (!url) return '';
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
  return match ? match[1] : '';
};

// @desc   Get published gallery items (photos and/or videos)
// @route  GET /api/gallery
// @access Public
const getGallery = async (req, res, next) => {
  try {
    const { category, mediaType } = req.query;
    let query = { isPublished: true };

    if (category && category !== 'All') {
      query.category = category;
    }

    if (mediaType && mediaType !== 'all') {
      query.mediaType = mediaType;
    }

    const items = await Gallery.find(query).sort({ order: 1, createdAt: -1 });

    res.json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Admin get all gallery items
// @route  GET /api/gallery/admin/all
// @access Private (Admin)
const getAdminGallery = async (req, res, next) => {
  try {
    const { mediaType } = req.query;
    let query = {};

    if (mediaType && mediaType !== 'all') {
      query.mediaType = mediaType;
    }

    const items = await Gallery.find(query).sort({ order: 1, createdAt: -1 });
    res.json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Create gallery item
// @route  POST /api/gallery
// @access Private (Admin)
const createGalleryItem = async (req, res, next) => {
  try {
    const data = { ...req.body };

    // Auto-generate YouTube thumbnail if video has no uploaded image
    if (data.mediaType === 'video' && data.youtubeUrl && (!data.image || !data.image.secure_url)) {
      const ytId = getYouTubeId(data.youtubeUrl);
      if (ytId) {
        data.image = {
          public_id: `yt_${ytId}`,
          secure_url: `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`,
          alt: data.title || 'YouTube Dental Video',
        };
      }
    }

    const item = await Gallery.create(data);
    res.status(201).json({
      success: true,
      message: 'Gallery item created successfully',
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Update gallery item
// @route  PUT /api/gallery/:id
// @access Private (Admin)
const updateGalleryItem = async (req, res, next) => {
  try {
    const data = { ...req.body };

    if (data.mediaType === 'video' && data.youtubeUrl && (!data.image || !data.image.secure_url)) {
      const ytId = getYouTubeId(data.youtubeUrl);
      if (ytId) {
        data.image = {
          public_id: `yt_${ytId}`,
          secure_url: `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`,
          alt: data.title || 'YouTube Dental Video',
        };
      }
    }

    const item = await Gallery.findByIdAndUpdate(req.params.id, data, {
      returnDocument: 'after',
      runValidators: true,
    });

    if (!item) {
      return res.status(404).json({ success: false, message: 'Gallery item not found' });
    }

    res.json({
      success: true,
      message: 'Gallery item updated successfully',
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Delete gallery item
// @route  DELETE /api/gallery/:id
// @access Private (Admin)
const deleteGalleryItem = async (req, res, next) => {
  try {
    const item = await Gallery.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Gallery item not found' });
    }

    await item.deleteOne();

    res.json({
      success: true,
      message: 'Gallery item deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getGallery,
  getAdminGallery,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
};
