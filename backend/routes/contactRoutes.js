const express = require('express');
const router = express.Router();
const {
  submitContactForm,
  getContactMessages,
  updateContactMessage,
  deleteContactMessage,
} = require('../controllers/contactController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(submitContactForm)
  .get(protect, getContactMessages);

router.route('/:id')
  .put(protect, updateContactMessage)
  .delete(protect, deleteContactMessage);

module.exports = router;
