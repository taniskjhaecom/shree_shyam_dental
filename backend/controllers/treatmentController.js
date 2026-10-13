const Treatment = require('../models/Treatment');
const slugify = require('slugify');
const { invalidateSitemapCache } = require('../utils/sitemapGenerator');

// @desc   Get all published treatments
// @route  GET /api/treatments
// @access Public
const getTreatments = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    let query = { isPublished: true };

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } },
      ];
    }

    const treatments = await Treatment.find(query).sort({ order: 1, createdAt: 1 });

    res.json({
      success: true,
      count: treatments.length,
      data: treatments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Get single treatment by slug
// @route  GET /api/treatments/:slug
// @access Public
const getTreatmentBySlug = async (req, res, next) => {
  try {
    const treatment = await Treatment.findOne({
      slug: req.params.slug.toLowerCase(),
      isPublished: true,
    });

    if (!treatment) {
      return res.status(404).json({ success: false, message: 'Treatment not found' });
    }

    // Related treatments
    const related = await Treatment.find({
      _id: { $ne: treatment._id },
      isPublished: true,
    })
      .limit(4)
      .select('title slug shortDescription heroImage category');

    res.json({
      success: true,
      data: treatment,
      related,
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Admin get all treatments (published & unpublished)
// @route  GET /api/treatments/admin/all
// @access Private (Admin)
const getAdminTreatments = async (req, res, next) => {
  try {
    const treatments = await Treatment.find().sort({ order: 1, createdAt: 1 });
    res.json({
      success: true,
      count: treatments.length,
      data: treatments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Create new treatment
// @route  POST /api/treatments
// @access Private (Admin)
const createTreatment = async (req, res, next) => {
  try {
    let { title, slug } = req.body;

    if (!slug && title) {
      slug = slugify(title, { lower: true, strict: true });
    }

    const existingSlug = await Treatment.findOne({ slug });
    if (existingSlug) {
      slug = `${slug}-${Date.now()}`;
    }

    const treatment = await Treatment.create({
      ...req.body,
      slug,
    });

    invalidateSitemapCache();

    res.status(201).json({
      success: true,
      message: 'Treatment created successfully',
      data: treatment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Update treatment
// @route  PUT /api/treatments/:id
// @access Private (Admin)
const updateTreatment = async (req, res, next) => {
  try {
    let treatment = await Treatment.findById(req.params.id);

    if (!treatment) {
      return res.status(404).json({ success: false, message: 'Treatment not found' });
    }

    if (req.body.title && (!req.body.slug || req.body.slug === treatment.slug)) {
      // Keep existing slug unless explicitly altered
    }

    treatment = await Treatment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    invalidateSitemapCache();

    res.json({
      success: true,
      message: 'Treatment updated successfully',
      data: treatment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Delete treatment
// @route  DELETE /api/treatments/:id
// @access Private (Admin)
const deleteTreatment = async (req, res, next) => {
  try {
    const treatment = await Treatment.findById(req.params.id);

    if (!treatment) {
      return res.status(404).json({ success: false, message: 'Treatment not found' });
    }

    await treatment.deleteOne();
    invalidateSitemapCache();

    res.json({
      success: true,
      message: 'Treatment deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTreatments,
  getTreatmentBySlug,
  getAdminTreatments,
  createTreatment,
  updateTreatment,
  deleteTreatment,
};
