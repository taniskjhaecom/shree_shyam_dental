const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'shree_shyam_super_secret_jwt_key_2026_modern_dental_hospital',
    {
      expiresIn: process.env.JWT_EXPIRE || '7d',
    }
  );
};

// @desc   Admin login
// @route  POST /api/auth/login
// @access Public
const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() });

    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    admin.lastLogin = new Date();
    await admin.save();

    res.json({
      success: true,
      data: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        phone: admin.phone || '',
        avatar: admin.avatar?.secure_url || '',
        avatarObj: admin.avatar,
        token: generateToken(admin._id),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Get current logged-in admin
// @route  GET /api/auth/me
// @access Private (Admin)
const getAdminProfile = async (req, res) => {
  res.json({
    success: true,
    data: {
      _id: req.admin._id,
      name: req.admin.name,
      email: req.admin.email,
      role: req.admin.role,
      phone: req.admin.phone || '',
      avatar: req.admin.avatar?.secure_url || '',
      avatarObj: req.admin.avatar,
      lastLogin: req.admin.lastLogin,
      createdAt: req.admin.createdAt,
    },
  });
};

// @desc   Update admin profile / password
// @route  PUT /api/auth/profile
// @access Private (Admin)
const updateAdminProfile = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.admin._id);
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin account not found' });
    }

    // 1. Update Profile Name
    if (req.body.name && req.body.name.trim()) {
      admin.name = req.body.name.trim();
    }

    // 2. Update Email (with duplicate check)
    if (req.body.email && req.body.email.toLowerCase().trim() !== admin.email) {
      const emailCandidate = req.body.email.toLowerCase().trim();
      const existing = await Admin.findOne({ email: emailCandidate, _id: { $ne: admin._id } });
      if (existing) {
        return res.status(400).json({ success: false, message: 'This email is already in use by another account' });
      }
      admin.email = emailCandidate;
    }

    // 3. Update Phone Number
    if (req.body.phone !== undefined) {
      admin.phone = req.body.phone.trim();
    }

    // 4. Update Display Profile / Avatar
    if (req.body.avatar !== undefined) {
      if (typeof req.body.avatar === 'object' && req.body.avatar !== null) {
        admin.avatar = {
          public_id: req.body.avatar.public_id || '',
          secure_url: req.body.avatar.secure_url || '',
        };
      } else if (typeof req.body.avatar === 'string') {
        admin.avatar = {
          public_id: admin.avatar?.public_id || '',
          secure_url: req.body.avatar.trim(),
        };
      } else if (req.body.avatar === null) {
        admin.avatar = { public_id: '', secure_url: '' };
      }
    }

    // 5. Update Password (if provided)
    const newPasswordCandidate = req.body.newPassword || req.body.password;
    if (newPasswordCandidate) {
      // Require current password for security verification
      if (!req.body.currentPassword) {
        return res.status(400).json({
          success: false,
          message: 'Please enter your current password to verify this change',
        });
      }

      const isCurrentMatch = await admin.matchPassword(req.body.currentPassword);
      if (!isCurrentMatch) {
        return res.status(400).json({
          success: false,
          message: 'Current password is incorrect. Please try again.',
        });
      }

      if (newPasswordCandidate.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'New password must be at least 6 characters long',
        });
      }

      admin.password = newPasswordCandidate;
    }

    const updatedAdmin = await admin.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        _id: updatedAdmin._id,
        name: updatedAdmin.name,
        email: updatedAdmin.email,
        role: updatedAdmin.role,
        phone: updatedAdmin.phone || '',
        avatar: updatedAdmin.avatar?.secure_url || '',
        avatarObj: updatedAdmin.avatar,
        token: generateToken(updatedAdmin._id),
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  loginAdmin,
  getAdminProfile,
  updateAdminProfile,
};
