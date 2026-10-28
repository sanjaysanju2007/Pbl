const express = require('express');
const router = express.Router();
const {
  getGalleryItems, getCategories, createGalleryItem,
  updateGalleryItem, deleteGalleryItem
} = require('../controllers/galleryController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public
router.get('/', getGalleryItems);
router.get('/categories', getCategories);

// Admin
router.post('/', protect, upload.single('file'), createGalleryItem);
router.put('/:id', protect, updateGalleryItem);
router.delete('/:id', protect, deleteGalleryItem);

module.exports = router;
