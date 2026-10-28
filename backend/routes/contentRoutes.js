const express = require('express');
const router = express.Router();
const {
  getPageContent, getAllContent, updatePageContent
} = require('../controllers/contentController');
const { protect } = require('../middleware/auth');

// Public
router.get('/:pageSlug', getPageContent);

// Admin
router.get('/', protect, getAllContent);
router.put('/:pageSlug', protect, updatePageContent);

module.exports = router;
