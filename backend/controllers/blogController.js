const Blog = require('../models/Blog');
const slugify = require('slugify');
const { invalidateSitemapCache } = require('../utils/sitemapGenerator');

// @desc   Get published blogs
// @route  GET /api/blogs
// @access Public
const getBlogs = async (req, res, next) => {
  try {
    const { category, search, tag, limit } = req.query;
    let query = { isPublished: true };

    if (category && category !== 'All') {
      query.category = category;
    }

    if (tag) {
      query.tags = tag;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }

    let blogQuery = Blog.find(query).sort({ publishedAt: -1, createdAt: -1 });

    if (limit) {
      blogQuery = blogQuery.limit(parseInt(limit, 10));
    }

    const blogs = await blogQuery;

    res.json({
      success: true,
      count: blogs.length,
      data: blogs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Get single blog by slug
// @route  GET /api/blogs/:slug
// @access Public
const getBlogBySlug = async (req, res, next) => {
  try {
    const blog = await Blog.findOne({
      slug: req.params.slug.toLowerCase(),
      isPublished: true,
    });

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    // Related blogs
    const related = await Blog.find({
      _id: { $ne: blog._id },
      isPublished: true,
    })
      .limit(3)
      .select('title slug excerpt featuredImage publishedAt readTime category');

    res.json({
      success: true,
      data: blog,
      related,
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Admin get all blogs
// @route  GET /api/blogs/admin/all
// @access Private (Admin)
const getAdminBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: blogs.length,
      data: blogs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Create blog
// @route  POST /api/blogs
// @access Private (Admin)
const createBlog = async (req, res, next) => {
  try {
    let { title, slug } = req.body;

    if (!slug && title) {
      slug = slugify(title, { lower: true, strict: true });
    }

    const existingSlug = await Blog.findOne({ slug });
    if (existingSlug) {
      slug = `${slug}-${Date.now()}`;
    }

    const blog = await Blog.create({
      ...req.body,
      slug,
      publishedAt: req.body.isPublished ? (req.body.publishedAt || Date.now()) : null,
    });

    invalidateSitemapCache();

    res.status(201).json({
      success: true,
      message: 'Article created successfully',
      data: blog,
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Update blog
// @route  PUT /api/blogs/:id
// @access Private (Admin)
const updateBlog = async (req, res, next) => {
  try {
    let blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    invalidateSitemapCache();

    res.json({
      success: true,
      message: 'Article updated successfully',
      data: blog,
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Delete blog
// @route  DELETE /api/blogs/:id
// @access Private (Admin)
const deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    await blog.deleteOne();
    invalidateSitemapCache();

    res.json({
      success: true,
      message: 'Article deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBlogs,
  getBlogBySlug,
  getAdminBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
};
