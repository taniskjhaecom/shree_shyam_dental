const ClinicSettings = require('../models/ClinicSettings');
const { invalidateSitemapCache } = require('../utils/sitemapGenerator');

// @desc   Get public clinic settings
// @route  GET /api/settings
// @access Public
const getSettings = async (req, res, next) => {
  try {
    let settings = await ClinicSettings.findOne();

    if (!settings) {
      settings = await ClinicSettings.create({});
    }

    res.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Update clinic settings
// @route  PUT /api/settings
// @access Private (Admin)
const updateSettings = async (req, res, next) => {
  try {
    const { _id, createdAt, updatedAt, __v, ...updateData } = req.body;

    if (updateData.seoDefaults && Array.isArray(updateData.seoDefaults.keywords)) {
      updateData.seoDefaults.keywords = updateData.seoDefaults.keywords.join(', ');
    }

    let settings = await ClinicSettings.findOne();

    if (!settings) {
      settings = await ClinicSettings.create(updateData);
    } else {
      settings = await ClinicSettings.findByIdAndUpdate(
        settings._id,
        { $set: updateData },
        { new: true, runValidators: true }
      );
    }

    invalidateSitemapCache();

    res.json({
      success: true,
      message: 'Clinic settings updated successfully',
      data: settings,
    });
  } catch (error) {
    console.error('[SettingsController Update Error]:', error);
    next(error);
  }
};

module.exports = {
  getSettings,
  updateSettings,
};
