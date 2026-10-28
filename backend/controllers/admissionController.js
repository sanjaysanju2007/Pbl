const Admission = require('../database/models/Admission');
const { sendAdmissionAcknowledgment, sendAdminNotification } = require('../services/emailService');
const storageService = require('../services/storageService');

// @desc    Submit admission application (public)
// @route   POST /api/admissions
// @access  Public
exports.createAdmission = async (req, res) => {
  try {
    // 1. Process uploaded files if any
    const documents = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        documents.push({
          name: file.originalname,
          path: file.path.replace(/\\/g, '/'),
          mimetype: file.mimetype,
          size: file.size,
          uploadedAt: new Date()
        });
      });
    }

    // 2. Build admission payload
    const admissionData = {
      ...req.body,
      documents
    };

    // Auto-generate reference number if not created yet
    if (!admissionData.applicationNumber) {
      const year = new Date().getFullYear();
      const randomSuffix = Math.floor(10000 + Math.random() * 90000);
      admissionData.applicationNumber = `CKP-${year}-${randomSuffix}`;
    }

    // Default status is 'submitted'
    if (!admissionData.status) {
      admissionData.status = 'submitted';
    }

    // Initial timeline record
    admissionData.statusHistory = [{
      status: admissionData.status,
      note: 'Online admission application submitted by parent',
      changedAt: new Date(),
      changedBy: 'Parent / Applicant'
    }];

    // Always store in resilient storage
    const savedFallback = storageService.addAdmission(admissionData);

    let dbAdmission = null;
    if (storageService.isDbConnected()) {
      try {
        dbAdmission = await Admission.create(admissionData);
      } catch (dbErr) {
        console.warn('MongoDB save failed, using memory record:', dbErr.message);
      }
    }

    const admission = dbAdmission || savedFallback;

    // 3. Dispatch Email Notifications asynchronously
    (async () => {
      try {
        const [parentResult, adminResult] = await Promise.allSettled([
          sendAdmissionAcknowledgment(admission),
          sendAdminNotification('admission', admission)
        ]);

        const parentSuccess = parentResult.status === 'fulfilled' && parentResult.value?.success;
        const adminSuccess = adminResult.status === 'fulfilled' && adminResult.value?.success;

        if (dbAdmission && storageService.isDbConnected()) {
          await Admission.findByIdAndUpdate(admission._id, {
            'notificationStatus.parentAcknowledged': Boolean(parentSuccess),
            'notificationStatus.adminNotified': Boolean(adminSuccess),
            'notificationStatus.lastAttemptAt': new Date(),
            'notificationStatus.deliveryError': !parentSuccess || !adminSuccess ? 'Email delivery pending or simulated' : null
          }).catch(() => {});
        }
      } catch (emailErr) {
        console.error('Email logging update notice:', emailErr.message);
      }
    })();

    res.status(201).json({
      success: true,
      message: 'Admission application submitted successfully! Your application reference number is ' + admission.applicationNumber,
      applicationNumber: admission.applicationNumber,
      data: {
        id: admission._id,
        applicationNumber: admission.applicationNumber,
        childName: admission.childName,
        program: admission.program,
        status: admission.status,
        guardianEmail: admission.guardianEmail,
        createdAt: admission.createdAt
      }
    });
  } catch (error) {
    console.error('Admission creation error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: 'Server error processing application', error: error.message });
  }
};

// @desc    Track single admission status for parents
// @route   POST /api/admissions/track or GET /api/admissions/track
// @access  Public
exports.trackAdmission = async (req, res) => {
  try {
    const applicationNumber = req.body?.applicationNumber || req.query?.applicationNumber;
    const contact = req.body?.contact || req.query?.contact;

    if (!applicationNumber || !contact) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both Application Reference Number and registered Phone or Email.'
      });
    }

    const cleanAppNo = applicationNumber.trim().toUpperCase();
    const cleanContact = contact.trim().toLowerCase();

    let admission = null;

    // 1. Try DB first if connected
    if (storageService.isDbConnected()) {
      try {
        admission = await Admission.findOne({
          applicationNumber: cleanAppNo,
          $or: [
            { guardianEmail: cleanContact },
            { guardianPhone: cleanContact }
          ]
        }).select('-documents.path -adminNotes');
      } catch (dbErr) {
        console.warn('DB lookup failed, checking resilient memory store:', dbErr.message);
      }
    }

    // 2. Fallback to resilient storage
    if (!admission) {
      admission = storageService.findTrackAdmission(cleanAppNo, cleanContact);
    }

    if (!admission) {
      return res.status(404).json({
        success: false,
        message: 'No matching application found. Please verify your Application Number (e.g. CKP-2026-48192) and registered Phone or Email.'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        applicationNumber: admission.applicationNumber,
        childName: admission.childName,
        program: admission.program,
        academicYear: admission.academicYear,
        status: admission.status,
        submissionDate: admission.createdAt,
        updatedAt: admission.updatedAt,
        statusHistory: admission.statusHistory || []
      }
    });
  } catch (error) {
    console.error('Track error:', error);
    res.status(500).json({ success: false, message: 'Server error tracking admission', error: error.message });
  }
};

// @desc    Get all admissions (admin)
// @route   GET /api/admissions
// @access  Private
exports.getAdmissions = async (req, res) => {
  try {
    const { status, program, academicYear, search, page = 1, limit = 25 } = req.query;

    if (storageService.isDbConnected()) {
      try {
        const query = {};

        if (status) {
          if (status === 'submitted') {
            query.status = { $in: ['submitted', 'pending'] };
          } else if (status === 'under_review') {
            query.status = { $in: ['under_review', 'reviewed'] };
          } else {
            query.status = status;
          }
        }

        if (program) query.program = program;
        if (academicYear) query.academicYear = academicYear;

        if (search) {
          query.$or = [
            { applicationNumber: { $regex: search, $options: 'i' } },
            { childName: { $regex: search, $options: 'i' } },
            { fatherName: { $regex: search, $options: 'i' } },
            { motherName: { $regex: search, $options: 'i' } },
            { primaryContactName: { $regex: search, $options: 'i' } },
            { guardianEmail: { $regex: search, $options: 'i' } },
            { guardianPhone: { $regex: search, $options: 'i' } }
          ];
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const total = await Admission.countDocuments(query);
        const admissions = await Admission.find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(parseInt(limit));

        return res.status(200).json({
          success: true,
          data: admissions,
          pagination: {
            total,
            page: parseInt(page),
            pages: Math.ceil(total / parseInt(limit))
          }
        });
      } catch (dbErr) {
        console.warn('MongoDB getAdmissions failed, using fallback storage:', dbErr.message);
      }
    }

    // Fallback store
    const result = storageService.getAllAdmissions({
      status,
      program,
      academicYear,
      search,
      page: parseInt(page),
      limit: parseInt(limit)
    });

    res.status(200).json({
      success: true,
      data: result.data,
      pagination: {
        total: result.total,
        page: result.page,
        pages: result.pages
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get single admission
// @route   GET /api/admissions/:id
// @access  Private
exports.getAdmission = async (req, res) => {
  try {
    let admission = null;
    if (storageService.isDbConnected()) {
      try {
        admission = await Admission.findById(req.params.id);
      } catch (err) {}
    }

    if (!admission) {
      admission = storageService.getAdmissionById(req.params.id);
    }

    if (!admission) {
      return res.status(404).json({ success: false, message: 'Admission not found' });
    }
    res.status(200).json({ success: true, data: admission });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Update admission status and admin notes (admin)
// @route   PATCH /api/admissions/:id
// @access  Private
exports.updateAdmission = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;

    // Update in fallback storage first
    let updated = storageService.updateAdmission(req.params.id, { status, adminNotes });

    if (storageService.isDbConnected()) {
      try {
        const admission = await Admission.findById(req.params.id);
        if (admission) {
          if (status && status !== admission.status) {
            admission.status = status;
            if (!admission.statusHistory) admission.statusHistory = [];
            admission.statusHistory.push({
              status,
              note: adminNotes || `Status updated to ${status}`,
              changedAt: new Date(),
              changedBy: req.user ? req.user.name : 'Administrator'
            });
          }
          if (adminNotes !== undefined) {
            admission.adminNotes = adminNotes;
          }
          await admission.save();
          updated = admission;
        }
      } catch (err) {
        console.warn('DB update failed, memory updated:', err.message);
      }
    }

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Admission record not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Admission status updated successfully',
      data: updated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error updating admission', error: error.message });
  }
};

// @desc    Export applications as CSV format
// @route   GET /api/admissions/export/csv
// @access  Private
exports.exportCSV = async (req, res) => {
  try {
    const { status, program } = req.query;
    let admissions = [];

    if (storageService.isDbConnected()) {
      try {
        const query = {};
        if (status) query.status = status;
        if (program) query.program = program;
        admissions = await Admission.find(query).sort({ createdAt: -1 });
      } catch (e) {}
    }

    if (!admissions || admissions.length === 0) {
      admissions = storageService.getAllAdmissions({ status, program, limit: 1000 }).data;
    }

    const headers = [
      'Application Number',
      'Child Name',
      'DOB',
      'Gender',
      'Program',
      'Academic Year',
      'Father Name',
      'Mother Name',
      'Primary Phone',
      'Email',
      'Address',
      'City',
      'Pincode',
      'Status',
      'Submission Date',
      'Admin Notes'
    ];

    const rows = admissions.map(a => [
      `"${a.applicationNumber || a._id}"`,
      `"${(a.childName || '').replace(/"/g, '""')}"`,
      `"${a.dateOfBirth ? new Date(a.dateOfBirth).toISOString().split('T')[0] : ''}"`,
      `"${a.gender || ''}"`,
      `"${a.program || ''}"`,
      `"${a.academicYear || ''}"`,
      `"${(a.fatherName || a.primaryContactName || '').replace(/"/g, '""')}"`,
      `"${(a.motherName || '').replace(/"/g, '""')}"`,
      `"${a.guardianPhone || ''}"`,
      `"${a.guardianEmail || ''}"`,
      `"${(a.address || '').replace(/"/g, '""')}"`,
      `"${a.city || ''}"`,
      `"${a.pincode || ''}"`,
      `"${a.status || ''}"`,
      `"${a.createdAt ? new Date(a.createdAt).toISOString() : ''}"`,
      `"${(a.adminNotes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=admissions-export-${new Date().toISOString().split('T')[0]}.csv`);
    return res.status(200).send(csvContent);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error exporting CSV', error: error.message });
  }
};

// @desc    Delete admission (admin)
// @route   DELETE /api/admissions/:id
// @access  Private
exports.deleteAdmission = async (req, res) => {
  try {
    if (storageService.isDbConnected()) {
      await Admission.findByIdAndDelete(req.params.id).catch(() => {});
    }
    res.status(200).json({ success: true, message: 'Admission record deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
