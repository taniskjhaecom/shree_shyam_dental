const cloudinary = require('../config/cloudinary');

/**
 * Upload buffer to Cloudinary with automatic optimization & WebP/AVIF delivery
 */
const uploadToCloudinary = (fileBuffer, folder = 'shree_shyam_dental', options = {}) => {
  return new Promise((resolve, reject) => {
    // If credentials are demo or not configured, generate a reliable high-res unsplash/data fallback
    if (!process.env.CLOUDINARY_API_KEY || process.env.CLOUDINARY_API_KEY === '123456789012345') {
      const base64Data = fileBuffer.toString('base64');
      const dataUri = `data:image/jpeg;base64,${base64Data}`;
      return resolve({
        public_id: `local_upload_${Date.now()}`,
        secure_url: dataUri,
        format: 'jpeg',
        bytes: fileBuffer.length,
      });
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        fetch_format: 'auto',
        quality: 'auto',
        ...options,
      },
      (error, result) => {
        if (error) {
          console.error('[Cloudinary Upload Error]:', error);
          return reject(error);
        }
        resolve({
          public_id: result.public_id,
          secure_url: result.secure_url,
          format: result.format,
          width: result.width,
          height: result.height,
        });
      }
    );

    uploadStream.end(fileBuffer);
  });
};

/**
 * Delete asset from Cloudinary
 */
const deleteFromCloudinary = async (public_id) => {
  if (!public_id || public_id.startsWith('local_upload_')) {
    return { result: 'ok' };
  }
  try {
    return await cloudinary.uploader.destroy(public_id);
  } catch (error) {
    console.warn('[Cloudinary Delete Warning]:', error.message);
    return { result: 'error', error: error.message };
  }
};

/**
 * Generate optimized Cloudinary image URL with responsive transforms
 */
const getOptimizedImageUrl = (url, { width = 800, quality = 'auto', format = 'auto' } = {}) => {
  if (!url) return '';
  if (!url.includes('cloudinary.com')) return url;
  return url.replace('/upload/', `/upload/w_${width},q_${quality},f_${format}/`);
};

module.exports = {
  uploadToCloudinary,
  deleteFromCloudinary,
  getOptimizedImageUrl,
};
