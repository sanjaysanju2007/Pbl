const mongoose = require('mongoose');
const Enquiry = require('../database/models/Enquiry');
const { isFirebaseConnected, enquiriesRepo } = require('../database/firestoreRepository');
const { sendEnquiryConfirmation, sendAdminNotification } = require('../services/emailService');

// @desc    Submit enquiry (public)
// @route   POST /api/enquiries
// @access  Public
exports.createEnquiry = async (req, res) => {
  try {
    const { name, phone, email, message } = req.body;

    if (!name || !phone || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, phone, email, and message.'
      });
    }

    let enquiry = null;

    if (isFirebaseConnected()) {
      try {
        console.log(`📝 Persisting enquiry from ${email} to Firebase Firestore...`);
        enquiry = await enquiriesRepo.create({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim().toLowerCase(),
          childAge: req.body.childAge || '',
          programInterest: req.body.programInterest || '',
          message: message.trim(),
          status: req.body.status || 'new'
        });

        if (!enquiry || (!enquiry.id && !enquiry._id)) {
          throw new Error('Firestore returned empty record upon creation.');
        }

        console.log(`✅ Successfully saved enquiry to Firestore (Doc ID: ${enquiry.id})`);
      } catch (firestoreErr) {
        console.error('🔴 Firestore write failed for enquiry:', firestoreErr);
        return res.status(500).json({
          success: false,
          message: 'Failed to save enquiry to Firestore cloud database. Please try again.',
          error: firestoreErr.message
        });
      }
    } else if (mongoose.connection && mongoose.connection.readyState === 1) {
      try {
        enquiry = await Enquiry.create(req.body);
        console.log(`✅ Saved enquiry to MongoDB (ID: ${enquiry._id})`);
      } catch (mongoErr) {
        console.error('🔴 MongoDB write failed for enquiry:', mongoErr);
        return res.status(500).json({
          success: false,
          message: 'Failed to save enquiry to database. Please try again.',
          error: mongoErr.message
        });
      }
    } else {
      console.error('🔴 Database connection unavailable for enquiry submission.');
      return res.status(503).json({
        success: false,
        message: 'Database service is currently unavailable. Please contact the school directly.'
      });
    }

    // Send emails asynchronously
    sendEnquiryConfirmation(enquiry);
    sendAdminNotification('enquiry', enquiry);

    return res.status(201).json({
      success: true,
      message: 'Thank you for your enquiry! We will get back to you within 24-48 hours.',
      data: enquiry
    });
  } catch (error) {
    console.error('🔴 createEnquiry unexpected error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    return res.status(500).json({ success: false, message: 'Server error processing enquiry', error: error.message });
  }
};

// @desc    Get all enquiries (admin)
// @route   GET /api/enquiries
// @access  Private
exports.getEnquiries = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;

    if (isFirebaseConnected()) {
      const filter = {};
      if (status) filter.status = status;
      const result = await enquiriesRepo.find({
        filter,
        search,
        searchFields: ['name', 'email', 'phone', 'message', 'programInterest'],
        sortField: 'createdAt',
        sortDirection: 'desc',
        page: parseInt(page),
        limit: parseInt(limit)
      });
      return res.status(200).json({
        success: true,
        data: result.data,
        pagination: { total: result.total, page: result.page, pages: result.pages }
      });
    }

    const query = {};
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Enquiry.countDocuments(query);
    const enquiries = await Enquiry.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    return res.status(200).json({
      success: true,
      data: enquiries,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Update enquiry status (admin)
// @route   PATCH /api/enquiries/:id
// @access  Private
exports.updateEnquiry = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    let enquiry = null;

    if (isFirebaseConnected()) {
      enquiry = await enquiriesRepo.findByIdAndUpdate(req.params.id, { status, adminNotes });
    } else {
      enquiry = await Enquiry.findByIdAndUpdate(
        req.params.id,
        { status, adminNotes },
        { new: true, runValidators: true }
      );
    }

    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Enquiry not found' });
    }

    return res.status(200).json({ success: true, data: enquiry });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Delete enquiry (admin)
// @route   DELETE /api/enquiries/:id
// @access  Private
exports.deleteEnquiry = async (req, res) => {
  try {
    let enquiry = null;

    if (isFirebaseConnected()) {
      enquiry = await enquiriesRepo.findByIdAndDelete(req.params.id);
    } else {
      enquiry = await Enquiry.findByIdAndDelete(req.params.id);
    }

    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Enquiry not found' });
    }

    return res.status(200).json({ success: true, message: 'Enquiry deleted' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
