const BeforeAfterResult = require('../models/BeforeAfterResult');

// @desc   Get all published before/after transformations
// @route  GET /api/before-after
// @access Public
const getBeforeAfterResults = async (req, res, next) => {
  try {
    const results = await BeforeAfterResult.find({ isPublished: true }).sort({ order: 1, createdAt: -1 });
    res.json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Admin get all before/after results
// @route  GET /api/before-after/admin/all
// @access Private (Admin)
const getAdminBeforeAfter = async (req, res, next) => {
  try {
    const results = await BeforeAfterResult.find().sort({ order: 1, createdAt: -1 });
    res.json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Create before/after transformation
// @route  POST /api/before-after
// @access Private (Admin)
const createBeforeAfter = async (req, res, next) => {
  try {
    const item = await BeforeAfterResult.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Before & After case created successfully',
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Update before/after result
// @route  PUT /api/before-after/:id
// @access Private (Admin)
const updateBeforeAfter = async (req, res, next) => {
  try {
    const item = await BeforeAfterResult.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!item) {
      return res.status(404).json({ success: false, message: 'Case not found' });
    }

    res.json({
      success: true,
      message: 'Case updated successfully',
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Delete before/after result
// @route  DELETE /api/before-after/:id
// @access Private (Admin)
const deleteBeforeAfter = async (req, res, next) => {
  try {
    const item = await BeforeAfterResult.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Case not found' });
    }

    await item.deleteOne();

    res.json({
      success: true,
      message: 'Case deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBeforeAfterResults,
  getAdminBeforeAfter,
  createBeforeAfter,
  updateBeforeAfter,
  deleteBeforeAfter,
};
