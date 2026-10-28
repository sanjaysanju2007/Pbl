const express = require('express');
const router = express.Router();
const { getFAQs, getAllFAQs, createFAQ, updateFAQ, deleteFAQ } = require('../controllers/faqController');
const { protect } = require('../middleware/auth');

// Public
router.get('/', getFAQs);

// Admin
router.get('/all', protect, getAllFAQs);
router.post('/', protect, createFAQ);
router.put('/:id', protect, updateFAQ);
router.delete('/:id', protect, deleteFAQ);

module.exports = router;
