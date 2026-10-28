const express = require('express');
const router = express.Router();
const {
  getAnnouncements, getAllAnnouncements,
  createAnnouncement, updateAnnouncement, deleteAnnouncement
} = require('../controllers/announcementController');
const { protect } = require('../middleware/auth');

// Public
router.get('/', getAnnouncements);

// Admin
router.get('/all', protect, getAllAnnouncements);
router.post('/', protect, createAnnouncement);
router.put('/:id', protect, updateAnnouncement);
router.delete('/:id', protect, deleteAnnouncement);

module.exports = router;
