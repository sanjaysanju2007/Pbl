const express = require('express');
const router = express.Router();
const {
  getTestimonials, getAllTestimonials,
  createTestimonial, updateTestimonial, deleteTestimonial
} = require('../controllers/testimonialController');
const { protect } = require('../middleware/auth');

// Public (approved only)
router.get('/', getTestimonials);

// Admin
router.get('/all', protect, getAllTestimonials);
router.post('/', protect, createTestimonial);
router.put('/:id', protect, updateTestimonial);
router.delete('/:id', protect, deleteTestimonial);

module.exports = router;
