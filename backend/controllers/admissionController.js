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
    const rawPhone = (req.body.guardianPhone || req.body.mobile || '').toString().trim();
    const cleanDigits = rawPhone.replace(/\D/g, '');
    const standardPhone = cleanDigits.length >= 10 ? cleanDigits.slice(-10) : cleanDigits;
    const program = req.body.program || req.body.category || 'Playgroup';
    const location = (req.body.location || req.body.address || '').trim();
    const guardianEmail = (req.body.guardianEmail || req.body.email || '').trim().toLowerCase();
    const hasPreviousSchool = req.body.hasPreviousSchool || 'No';
    const previousSchoolName = (req.body.previousSchoolName || req.body.previousSchool || '').trim();
    const timing = req.body.timing || '9:00-12:30';
    const additionalComments = (req.body.additionalComments || '').trim();

    // 2a. Validate mobile number: Must be 10 digits starting with 6, 7, 8, or 9
    if (!standardPhone || !/^[6-9]\d{9}$/.test(standardPhone)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid 10-digit Indian mobile number (starting with 6, 7, 8, or 9).'
      });
    }

    // 2b. Prevent duplicate submissions with the same phone number
    let existingAdmission = null;

    // Check in Firestore
    if (isFirebaseConnected()) {
      try {
        const docSnap = await admissionsRepo.col.doc(standardPhone).get();
        if (docSnap.exists) {
          existingAdmission = admissionsRepo._normalizeDoc(docSnap);
        } else {
          const querySnap = await admissionsRepo.col.where('guardianPhone', '==', standardPhone).limit(1).get();
          if (!querySnap.empty) {
            existingAdmission = admissionsRepo._normalizeDoc(querySnap.docs[0]);
          }
        }
      } catch (fErr) {
        console.warn('Firestore duplicate check warning:', fErr.message);
      }
    }

    // Check in local cache / storage
    if (!existingAdmission && typeof storageService.findAdmissionsByPhone === 'function') {
      const localMatches = storageService.findAdmissionsByPhone(standardPhone);
      if (localMatches && localMatches.length > 0) {
        existingAdmission = localMatches[0];
      }
    }

    // Check in MongoDB if connected
    if (!existingAdmission && storageService.isMongoConnected()) {
      try {
        existingAdmission = await Admission.findOne({
          $or: [
            { guardianPhone: standardPhone },
            { mobile: standardPhone },
            { _id: standardPhone }
          ]
        });
      } catch (mErr) {
        console.warn('MongoDB duplicate check warning:', mErr.message);
      }
    }

    // If already registered, return HTTP 409 Conflict error
    if (existingAdmission) {
      return res.status(409).json({
        success: false,
        message: `An admission application has already been submitted with mobile number ${standardPhone} for ${existingAdmission.childName || 'this student'}. You cannot register the same mobile number twice. Please use Track Admission to check status.`
      });
    }

    const admissionData = {
      ...req.body,
      id: standardPhone,
      _id: standardPhone,
      childName,
      dateOfBirth,
      age,
      parentName,
      primaryContactName: parentName,
      guardianPhone: standardPhone,
      mobile: standardPhone,
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
    admissionData.id = admissionData.applicationNumber;
    admissionData._id = admissionData.applicationNumber;

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

    // 3. PERSISTENCE: Primary database is Firebase Firestore (Stored directly with phone number as Document ID)
    if (isFirebaseConnected()) {
      try {
        console.log(`📝 Persisting admission application for mobile ${standardPhone} to Firebase Firestore...`);
        savedAdmission = await admissionsRepo.create(admissionData, admissionData.applicationNumber);
        console.log(`✅ Successfully saved admission ${standardPhone} to Firestore (Doc ID: ${savedAdmission.id})`);
      } catch (firestoreErr) {
        console.error(`🔴 Firestore write failed for admission ${standardPhone}:`, firestoreErr);
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
      storageService.syncToMemoryOnly(savedAdmission || admissionData);
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

// @desc    Track admission status for parents by phone number (or email / reference number)
// @route   POST /api/admissions/track or GET /api/admissions/track
// @access  Public
exports.trackAdmission = async (req, res) => {
  try {
    const rawInput = (
      req.body?.phone ||
      req.body?.mobile ||
      req.body?.contact ||
      req.query?.phone ||
      req.query?.mobile ||
      req.query?.contact ||
      req.body?.applicationNumber ||
      req.query?.applicationNumber ||
      ''
    ).toString().trim();

    if (!rawInput) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your registered 10-digit mobile number to track admission status.'
      });
    }

    const cleanDigits = rawInput.replace(/\D/g, '');
    const standardPhone = cleanDigits.length >= 10 ? cleanDigits.slice(-10) : cleanDigits;
    const cleanEmail = rawInput.toLowerCase();
    const cleanAppNo = rawInput.toUpperCase();

    // If input is digits, validate 10-digit Indian phone format
    if (cleanDigits.length > 0 && (cleanDigits.length !== 10 || !/^[6-9]\d{9}$/.test(standardPhone))) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid 10-digit mobile number (starting with 6, 7, 8, or 9).'
      });
    }

    let matchingAdmissions = [];

    // Helper to format safe response data for parent
    const formatAdmissionForParent = (adm) => ({
      id: adm.id || adm._id || adm.guardianPhone,
      _id: adm._id || adm.id || adm.guardianPhone,
      applicationNumber: adm.applicationNumber || `CKP-${adm.guardianPhone}`,
      childName: adm.childName,
      dateOfBirth: adm.dateOfBirth,
      age: adm.age,
      parentName: adm.parentName || adm.primaryContactName || adm.fatherName || adm.motherName,
      guardianPhone: adm.guardianPhone || adm.phone || adm.mobile,
      program: adm.program || adm.category,
      timing: adm.timing,
      location: adm.location || adm.address,
      guardianEmail: adm.guardianEmail || adm.email,
      hasPreviousSchool: adm.hasPreviousSchool || (adm.previousSchool && adm.previousSchool !== 'None' ? 'Yes' : 'No'),
      previousSchoolName: adm.previousSchoolName || adm.previousSchool || '',
      previousSchool: adm.previousSchool || adm.previousSchoolName || 'None',
      additionalComments: adm.additionalComments || adm.comments || '',
      academicYear: adm.academicYear || '2026-2027',
      status: adm.status || 'submitted',
      submissionDate: adm.createdAt,
      createdAt: adm.createdAt,
      updatedAt: adm.updatedAt,
      statusHistory: adm.statusHistory || []
    });

    // 1. FAST FIRESTORE DIRECT LOOKUP (Retrieves using phone number as doc key)
    if (isFirebaseConnected()) {
      try {
        if (standardPhone && /^[6-9]\d{9}$/.test(standardPhone) && admissionsRepo.col) {
          // Direct O(1) Document read by phone number ID
          const docSnap = await admissionsRepo.col.doc(standardPhone).get();
          if (docSnap.exists) {
            matchingAdmissions.push(admissionsRepo._normalizeDoc(docSnap));
          } else {
            // Also check guardianPhone or mobile fields for docs created earlier
            const byPhoneSnap = await admissionsRepo.col.where('guardianPhone', '==', standardPhone).limit(5).get();
            if (!byPhoneSnap.empty) {
              byPhoneSnap.docs.forEach(d => matchingAdmissions.push(admissionsRepo._normalizeDoc(d)));
            } else {
              const byMobileSnap = await admissionsRepo.col.where('mobile', '==', standardPhone).limit(5).get();
              if (!byMobileSnap.empty) {
                byMobileSnap.docs.forEach(d => matchingAdmissions.push(admissionsRepo._normalizeDoc(d)));
              }
            }
          }
        }
      } catch (fErr) {
        console.warn('Firestore direct phone lookup error:', fErr.message);
      }
    }

    // 2. FAST LOCAL STORAGE CHECK (Reliable and instantaneous)
    try {
      if (typeof storageService.findAdmissionsByPhone === 'function') {
        const localMatches = storageService.findAdmissionsByPhone(standardPhone || rawInput);
        if (localMatches && localMatches.length > 0) {
          matchingAdmissions.push(...localMatches);
        }
      }
    } catch (localErr) {
      console.warn('Local storage track error:', localErr.message);
    }

    // 3. Try MongoDB if connected and no matches yet
    if (matchingAdmissions.length === 0 && storageService.isMongoConnected()) {
      try {
        const queryOr = [];
        if (standardPhone) {
          queryOr.push({ guardianPhone: standardPhone });
          queryOr.push({ mobile: standardPhone });
          queryOr.push({ _id: standardPhone });
        }
        if (rawInput.includes('@')) {
          queryOr.push({ guardianEmail: cleanEmail });
        }
        if (rawInput.startsWith('CKP-')) {
          queryOr.push({ applicationNumber: cleanAppNo });
        }

        if (queryOr.length > 0) {
          const mongoDocs = await Admission.find({ $or: queryOr })
            .select('-documents.path -adminNotes')
            .sort({ createdAt: -1 });
          if (mongoDocs && mongoDocs.length > 0) {
            matchingAdmissions.push(...mongoDocs);
          }
        }
      } catch (dbErr) {
        console.warn('MongoDB track error:', dbErr.message);
      }
    }

    if (matchingAdmissions.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No admission record found for mobile number ${standardPhone || rawInput}. Please verify the 10-digit number or submit a new admission application.`
      });
    }

    // De-duplicate matching admissions
    const uniqueMap = new Map();
    matchingAdmissions.forEach(adm => {
      const key = adm.applicationNumber || adm._id || adm.id;
      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, formatAdmissionForParent(adm));
      }
    });

    const uniqueList = Array.from(uniqueMap.values());

    return res.status(200).json({
      success: true,
      message: 'Admission details retrieved successfully',
      data: uniqueList[0],
      applications: uniqueList,
      totalFound: uniqueList.length
    });
  } catch (error) {
    console.error('Track admission error:', error);
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

      const seen = new Set();
      const uniqueData = [];
      (result.data || []).forEach(item => {
        const key = item.applicationNumber || item.guardianPhone || item.id || item._id;
        if (!key || !seen.has(key)) {
          if (key) seen.add(key);
          uniqueData.push(item);
        }
      });

      return res.status(200).json({
        success: true,
        data: uniqueData,
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

    const seenExport = new Set();
    admissions = (admissions || []).filter(item => {
      const key = item.applicationNumber || item.guardianPhone || item.id || item._id;
      if (!key) return true;
      if (seenExport.has(key)) return false;
      seenExport.add(key);
      return true;
    });

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
