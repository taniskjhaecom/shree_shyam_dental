const Doctor = require('../models/Doctor');

// @desc   Get featured doctor profile
// @route  GET /api/doctor
// @access Public
const getDoctor = async (req, res, next) => {
  try {
    let doctor = await Doctor.findOne({ isFeatured: true });

    if (!doctor) {
      doctor = await Doctor.findOne();
    }

    if (!doctor) {
      doctor = await Doctor.create({});
    }

    res.json({
      success: true,
      data: doctor,
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Update doctor profile
// @route  PUT /api/doctor
// @access Private (Admin)
const updateDoctor = async (req, res, next) => {
  try {
    const { _id, createdAt, updatedAt, __v, ...updateData } = req.body;

    let doctor = await Doctor.findOne();

    if (!doctor) {
      doctor = await Doctor.create(updateData);
    } else {
      doctor = await Doctor.findByIdAndUpdate(
        doctor._id,
        { $set: updateData },
        { new: true, runValidators: true }
      );
    }

    res.json({
      success: true,
      message: 'Doctor profile updated successfully',
      data: doctor,
    });
  } catch (error) {
    console.error('[DoctorController Update Error]:', error);
    next(error);
  }
};

module.exports = {
  getDoctor,
  updateDoctor,
};
