const express = require('express');
const router = express.Router();
const {
  createEnquiry, getEnquiries, updateEnquiry, deleteEnquiry
} = require('../controllers/enquiryController');
const { protect } = require('../middleware/auth');

// Public
router.post('/', createEnquiry);

// Admin
router.get('/', protect, getEnquiries);
router.patch('/:id', protect, updateEnquiry);
router.delete('/:id', protect, deleteEnquiry);

module.exports = router;
