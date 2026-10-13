const express = require('express');
const router = express.Router();
const { getDoctor, updateDoctor } = require('../controllers/doctorController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(getDoctor)
  .put(protect, updateDoctor);

module.exports = router;
