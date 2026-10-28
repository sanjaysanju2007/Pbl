const express = require('express');
const router = express.Router();
const {
  createAdmission,
  trackAdmission,
  getAdmissions,
  getAdmission,
  updateAdmission,
  exportCSV,
  deleteAdmission
} = require('../controllers/admissionController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public endpoints
router.post('/', upload.array('documents', 5), createAdmission);
router.post('/track', trackAdmission);
router.get('/track', trackAdmission);

// Admin endpoints
router.get('/export/csv', protect, exportCSV);
router.get('/', protect, getAdmissions);
router.get('/:id', protect, getAdmission);
router.patch('/:id', protect, updateAdmission);
router.delete('/:id', protect, deleteAdmission);

module.exports = router;
