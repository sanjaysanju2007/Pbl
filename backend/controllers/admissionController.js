const Admission = require('../database/models/Admission');
const { sendAdmissionAcknowledgment, sendAdminNotification } = require('../services/emailService');
const storageService = require('../services/storageService');
const { isFirebaseConnected, admissionsRepo } = require('../database/firestoreRepository');

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
          uploadedAt: new Date().toISOString()
        });
      });
    }

    // 2. Build admission payload
    const childName = (req.body.childName || '').trim();
    const dateOfBirth = req.body.dateOfBirth;
    const age = (req.body.age || '').trim();
    const parentName = (req.body.parentName || req.body.primaryContactName || req.body.fatherName || req.body.motherName || '').trim();
    const guardianPhone = (req.body.guardianPhone || req.body.mobile || '').trim();
    const program = req.body.program || req.body.category || 'Playgroup';
    const location = (req.body.location || req.body.address || '').trim();
    const guardianEmail = (req.body.guardianEmail || req.body.email || '').trim().toLowerCase();
    const hasPreviousSchool = req.body.hasPreviousSchool || 'No';
    const previousSchoolName = (req.body.previousSchoolName || req.body.previousSchool || '').trim();
    const timing = req.body.timing || '9:00-12:30';
    const additionalComments = (req.body.additionalComments || '').trim();

    const admissionData = {
      ...req.body,
      childName,
      dateOfBirth,
      age,
      parentName,
      primaryContactName: parentName,
      guardianPhone,
      program,
      location,
      address: location,
      guardianEmail,
      hasPreviousSchool,
      previousSchool: hasPreviousSchool === 'Yes' ? previousSchoolName : 'None',
      previousSchoolName: hasPreviousSchool === 'Yes' ? previousSchoolName : '',
      timing,
      additionalComments,
      gender: req.body.gender || 'Not Specified',
      academicYear: req.body.academicYear || '2026-2027',
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

    const submissionTime = new Date().toISOString();

    // Initial timeline record
    admissionData.statusHistory = [{
      status: admissionData.status,
      note: 'Online admission application submitted by parent',
      changedAt: submissionTime,
      changedBy: 'Parent / Applicant'
    }];
    admissionData.createdAt = submissionTime;
    admissionData.updatedAt = submissionTime;

    let savedAdmission = null;

    // 3. PERSISTENCE: Primary database is Firebase Firestore
    if (isFirebaseConnected()) {
      try {
        console.log(`📝 Persisting admission application ${admissionData.applicationNumber} to Firebase Firestore...`);
        savedAdmission = await admissionsRepo.create(admissionData, admissionData.applicationNumber);
        console.log(`✅ Successfully saved admission ${admissionData.applicationNumber} to Firestore (Doc ID: ${savedAdmission.id})`);
      } catch (firestoreErr) {
        console.error(`🔴 Firestore write failed for admission ${admissionData.applicationNumber}:`, firestoreErr);
        return res.status(500).json({
          success: false,
          message: 'Failed to save admission application to Firestore cloud database. Please try again.',
          error: firestoreErr.message
        });
      }
    } else if (storageService.isMongoConnected()) {
      try {
        savedAdmission = await Admission.create(admissionData);
        console.log(`✅ Stored admission in MongoDB (ID: ${savedAdmission._id})`);
      } catch (dbErr) {
        console.error('🔴 MongoDB save failed:', dbErr.message);
        return res.status(500).json({
          success: false,
          message: 'Failed to save admission application to database. Please try again.',
          error: dbErr.message
        });
      }
    } else {
      console.warn('⚠️ Neither Firestore nor MongoDB is connected. Falling back to local storage.');
      savedAdmission = storageService.addAdmission(admissionData);
    }

    // Also sync to memory cache for fast offline retrieval/backup
    try {
      storageService.addAdmission(savedAdmission || admissionData);
    } catch (e) {
      // Non-blocking cache sync
    }

    const admission = savedAdmission || admissionData;

    // 4. Dispatch Email Notifications asynchronously
    (async () => {
      try {
        const [parentResult, adminResult] = await Promise.allSettled([
          sendAdmissionAcknowledgment(admission),
          sendAdminNotification('admission', admission)
        ]);

        const parentSuccess = parentResult.status === 'fulfilled' && parentResult.value?.success;
        const adminSuccess = adminResult.status === 'fulfilled' && adminResult.value?.success;

        if (isFirebaseConnected()) {
          await admissionsRepo.findByIdAndUpdate(admission.applicationNumber, {
            'notificationStatus.parentAcknowledged': Boolean(parentSuccess),
            'notificationStatus.adminNotified': Boolean(adminSuccess),
            'notificationStatus.lastAttemptAt': new Date().toISOString()
          }).catch(() => {});
        } else if (storageService.isMongoConnected()) {
          await Admission.findByIdAndUpdate(admission._id, {
            'notificationStatus.parentAcknowledged': Boolean(parentSuccess),
            'notificationStatus.adminNotified': Boolean(adminSuccess),
            'notificationStatus.lastAttemptAt': new Date()
          }).catch(() => {});
        }
      } catch (emailErr) {
        console.error('Email notification background error:', emailErr.message);
      }
    })();

    return res.status(201).json({
      success: true,
      message: `Admission application submitted successfully! Your application reference number is ${admission.applicationNumber}`,
      applicationNumber: admission.applicationNumber,
      data: {
        id: admission.id || admission._id,
        _id: admission.id || admission._id,
        applicationNumber: admission.applicationNumber,
        childName: admission.childName,
        age: admission.age,
        dateOfBirth: admission.dateOfBirth,
        parentName: admission.parentName || admission.primaryContactName,
        program: admission.program,
        timing: admission.timing,
        location: admission.location,
        status: admission.status,
        guardianEmail: admission.guardianEmail,
        guardianPhone: admission.guardianPhone,
        createdAt: admission.createdAt
      }
    });
  } catch (error) {
    console.error('🔴 Admission creation unexpected error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    return res.status(500).json({
      success: false,
      message: 'Server error processing application',
      error: error.message
    });
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
    const cleanPhoneDigits = contact.replace(/\D/g, '');

    let admission = null;

    // 1. Try Firestore first if connected
    if (isFirebaseConnected()) {
      try {
        admission = await admissionsRepo.findById(cleanAppNo);
        if (!admission) {
          admission = await admissionsRepo.findOne('applicationNumber', cleanAppNo);
        }
      } catch (fErr) {
        console.warn('Firestore track lookup error:', fErr.message);
      }
    }

    // 2. Try MongoDB if connected and not found in Firestore
    if (!admission && storageService.isMongoConnected()) {
      try {
        admission = await Admission.findOne({
          applicationNumber: cleanAppNo
        }).select('-documents.path -adminNotes');
      } catch (dbErr) {
        console.warn('MongoDB track lookup error:', dbErr.message);
      }
    }

    // 3. Fallback to storageService
    if (!admission) {
      admission = storageService.findTrackAdmission(cleanAppNo, cleanContact);
    }

    // Verify parent contact matches for privacy
    if (admission) {
      const emailMatch = (admission.guardianEmail || '').trim().toLowerCase() === cleanContact;
      const phoneDigits = (admission.guardianPhone || '').replace(/\D/g, '');
      const phoneMatch = cleanPhoneDigits && (phoneDigits === cleanPhoneDigits || phoneDigits.endsWith(cleanPhoneDigits) || cleanPhoneDigits.endsWith(phoneDigits));

      if (!emailMatch && !phoneMatch) {
        admission = null;
      }
    }

    if (!admission) {
      return res.status(404).json({
        success: false,
        message: 'No matching application found. Please verify your Application Number (e.g. CKP-2026-48192) and registered Phone or Email.'
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        applicationNumber: admission.applicationNumber,
        childName: admission.childName,
        age: admission.age,
        program: admission.program,
        timing: admission.timing,
        location: admission.location || admission.address,
        academicYear: admission.academicYear,
        status: admission.status,
        submissionDate: admission.createdAt,
        updatedAt: admission.updatedAt,
        statusHistory: admission.statusHistory || []
      }
    });
  } catch (error) {
    console.error('Track error:', error);
    return res.status(500).json({ success: false, message: 'Server error tracking admission', error: error.message });
  }
};

// @desc    Get all admissions (admin)
// @route   GET /api/admissions
// @access  Private
exports.getAdmissions = async (req, res) => {
  try {
    const { status, program, academicYear, search, page = 1, limit = 25 } = req.query;

    // 1. Primary: Firebase Firestore
    if (isFirebaseConnected()) {
      const filter = {};
      if (status) filter.status = status;
      if (program) filter.program = program;
      if (academicYear) filter.academicYear = academicYear;

      const result = await admissionsRepo.find({
        filter,
        search,
        searchFields: ['childName', 'applicationNumber', 'parentName', 'primaryContactName', 'fatherName', 'motherName', 'guardianEmail', 'guardianPhone', 'location', 'timing'],
        sortField: 'createdAt',
        sortDirection: 'desc',
        page: parseInt(page),
        limit: parseInt(limit)
      });

      return res.status(200).json({
        success: true,
        data: result.data,
        pagination: {
          total: result.total,
          page: result.page,
          pages: result.pages
        }
      });
    }

    // 2. Secondary: MongoDB
    if (storageService.isMongoConnected()) {
      try {
        const query = {};
        if (status) query.status = status;
        if (program) query.program = program;
        if (academicYear) query.academicYear = academicYear;

        if (search) {
          query.$or = [
            { applicationNumber: { $regex: search, $options: 'i' } },
            { childName: { $regex: search, $options: 'i' } },
            { parentName: { $regex: search, $options: 'i' } },
            { primaryContactName: { $regex: search, $options: 'i' } },
            { guardianEmail: { $regex: search, $options: 'i' } },
            { guardianPhone: { $regex: search, $options: 'i' } },
            { location: { $regex: search, $options: 'i' } }
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
        console.warn('MongoDB getAdmissions failed, falling back:', dbErr.message);
      }
    }

    // 3. Fallback: Local storage
    const result = storageService.getAllAdmissions({
      status,
      program,
      academicYear,
      search,
      page: parseInt(page),
      limit: parseInt(limit)
    });

    return res.status(200).json({
      success: true,
      data: result.data,
      pagination: {
        total: result.total,
        page: result.page,
        pages: result.pages
      }
    });
  } catch (error) {
    console.error('getAdmissions error:', error);
    return res.status(500).json({ success: false, message: 'Server error retrieving admissions', error: error.message });
  }
};

// @desc    Get single admission by ID (admin)
// @route   GET /api/admissions/:id
// @access  Private
exports.getAdmission = async (req, res) => {
  try {
    let admission = null;

    if (isFirebaseConnected()) {
      admission = await admissionsRepo.findById(req.params.id);
      if (!admission) {
        admission = await admissionsRepo.findOne('applicationNumber', req.params.id);
      }
    }

    if (!admission && storageService.isMongoConnected()) {
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

    return res.status(200).json({ success: true, data: admission });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Update admission status and admin notes (admin)
// @route   PATCH /api/admissions/:id
// @access  Private
exports.updateAdmission = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    let updated = null;

    if (isFirebaseConnected()) {
      const current = await admissionsRepo.findById(req.params.id) || await admissionsRepo.findOne('applicationNumber', req.params.id);
      if (current) {
        const updateData = {};
        if (adminNotes !== undefined) updateData.adminNotes = adminNotes;
        if (status && status !== current.status) {
          updateData.status = status;
          const history = Array.isArray(current.statusHistory) ? [...current.statusHistory] : [];
          history.unshift({
            status,
            note: adminNotes || `Status updated to ${status} by administration`,
            changedAt: new Date().toISOString(),
            changedBy: req.user ? req.user.name : 'Administrator'
          });
          updateData.statusHistory = history;
        }

        updated = await admissionsRepo.findByIdAndUpdate(current.id || current.applicationNumber, updateData);
        // Also update local cache
        storageService.updateAdmission(req.params.id, updateData);
      }
    }

    if (!updated && storageService.isMongoConnected()) {
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
        console.warn('MongoDB update failed:', err.message);
      }
    }

    if (!updated) {
      updated = storageService.updateAdmission(req.params.id, { status, adminNotes });
    }

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Admission record not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Admission status updated successfully',
      data: updated
    });
  } catch (error) {
    console.error('updateAdmission error:', error);
    return res.status(500).json({ success: false, message: 'Server error updating admission', error: error.message });
  }
};

// @desc    Export applications as CSV format
// @route   GET /api/admissions/export/csv
// @access  Private
exports.exportCSV = async (req, res) => {
  try {
    const { status, program } = req.query;
    let admissions = [];

    if (isFirebaseConnected()) {
      const filter = {};
      if (status) filter.status = status;
      if (program) filter.program = program;
      const result = await admissionsRepo.find({ filter, limit: 1000 });
      admissions = result.data;
    } else if (storageService.isMongoConnected()) {
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
      'Kid Name',
      'DOB',
      'Age',
      'Parents Name',
      'Mobile',
      'Category / Program',
      'Location',
      'Mail ID',
      'Previous School/Daycare Attended',
      'Previous School Name',
      'Timing',
      'Additional Comments',
      'Status',
      'Submission Date',
      'Admin Notes'
    ];

    const rows = admissions.map(a => [
      `"${a.applicationNumber || a._id || ''}"`,
      `"${(a.childName || '').replace(/"/g, '""')}"`,
      `"${a.dateOfBirth ? (typeof a.dateOfBirth === 'string' ? a.dateOfBirth : new Date(a.dateOfBirth).toISOString().split('T')[0]) : ''}"`,
      `"${(a.age || '').replace(/"/g, '""')}"`,
      `"${(a.parentName || a.primaryContactName || a.fatherName || '').replace(/"/g, '""')}"`,
      `"${a.guardianPhone || ''}"`,
      `"${a.program || ''}"`,
      `"${(a.location || a.address || a.city || '').replace(/"/g, '""')}"`,
      `"${a.guardianEmail || ''}"`,
      `"${a.hasPreviousSchool || (a.previousSchool ? 'Yes' : 'No')}"`,
      `"${(a.previousSchoolName || a.previousSchool || '').replace(/"/g, '""')}"`,
      `"${a.timing || ''}"`,
      `"${(a.additionalComments || '').replace(/"/g, '""')}"`,
      `"${a.status || ''}"`,
      `"${a.createdAt ? (typeof a.createdAt === 'string' ? a.createdAt : new Date(a.createdAt).toISOString()) : ''}"`,
      `"${(a.adminNotes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=admissions-export-${new Date().toISOString().split('T')[0]}.csv`);
    return res.status(200).send(csvContent);
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error exporting CSV', error: error.message });
  }
};

// @desc    Delete admission (admin)
// @route   DELETE /api/admissions/:id
// @access  Private
exports.deleteAdmission = async (req, res) => {
  try {
    if (isFirebaseConnected()) {
      await admissionsRepo.findByIdAndDelete(req.params.id);
    }
    if (storageService.isMongoConnected()) {
      await Admission.findByIdAndDelete(req.params.id).catch(() => {});
    }
    storageService.deleteAdmission?.(req.params.id);
    return res.status(200).json({ success: true, message: 'Admission record deleted' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
