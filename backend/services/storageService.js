const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const { isFirebaseConnected, admissionsRepo } = require('../database/firestoreRepository');

const dataDir = path.join(__dirname, '..', 'database', 'fallback');
const dataFilePath = path.join(dataDir, 'admissions.json');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  try {
    fs.mkdirSync(dataDir, { recursive: true });
  } catch (e) {
    console.error('Could not create data dir:', e);
  }
}

// Initial demo seed data matching real preschool applications
const initialAdmissions = [
  {
    _id: 'adm-demo-001',
    applicationNumber: 'CKP-2026-48192',
    childName: 'Aadhya Sharma',
    dateOfBirth: '2022-04-15',
    gender: 'Female',
    program: 'Nursery',
    academicYear: '2026-2027',
    preferredStartDate: '2026-06-01',
    bloodGroup: 'B+',
    allergies: 'None',
    previousSchool: 'Little Stars Playgroup',
    primaryContactName: 'Vikram Sharma',
    relationship: 'Father',
    guardianPhone: '9876543210',
    guardianEmail: 'parent@example.com',
    alternatePhone: '9876543211',
    address: '42, Green Avenue, Avinashi Road',
    city: 'Tiruppur',
    pincode: '641602',
    preferredContactMethod: 'Phone Call',
    comments: 'Looking forward to the child-centric curriculum.',
    documents: [
      { name: 'Birth_Certificate_Aadhya.pdf', path: 'uploads/demo-birth-cert.pdf', size: 145000, uploadedAt: new Date(Date.now() - 86400000 * 2) }
    ],
    status: 'under_review',
    adminNotes: 'Application documents verified. Scheduled for parent-child interaction next week.',
    statusHistory: [
      {
        status: 'submitted',
        note: 'Online admission application submitted by parent',
        changedAt: new Date(Date.now() - 86400000 * 2),
        changedBy: 'Parent / Applicant'
      },
      {
        status: 'under_review',
        note: 'Documents verified. Application currently being evaluated by admissions coordinator.',
        changedAt: new Date(Date.now() - 86400000),
        changedBy: 'Admissions Officer'
      }
    ],
    notificationStatus: {
      parentAcknowledged: true,
      adminNotified: true,
      lastAttemptAt: new Date(Date.now() - 86400000 * 2)
    },
    createdAt: new Date(Date.now() - 86400000 * 2),
    updatedAt: new Date(Date.now() - 86400000)
  },
  {
    _id: 'adm-demo-002',
    applicationNumber: 'CKP-2026-10294',
    childName: 'Kabir Patel',
    dateOfBirth: '2023-01-20',
    gender: 'Male',
    program: 'Playgroup',
    academicYear: '2026-2027',
    preferredStartDate: '2026-06-01',
    bloodGroup: 'O+',
    allergies: 'Peanut allergy',
    previousSchool: 'None',
    primaryContactName: 'Meera Patel',
    relationship: 'Mother',
    guardianPhone: '9944112233',
    guardianEmail: 'meera.patel@example.com',
    alternatePhone: '9944112234',
    address: '15, Kumaran Road',
    city: 'Tiruppur',
    pincode: '641601',
    preferredContactMethod: 'WhatsApp',
    comments: 'Interested in sensory play activities.',
    documents: [],
    status: 'approved',
    adminNotes: 'Admission approved for Playgroup Batch A. Welcome kit sent.',
    statusHistory: [
      {
        status: 'submitted',
        note: 'Online admission application submitted by parent',
        changedAt: new Date(Date.now() - 86400000 * 5),
        changedBy: 'Parent / Applicant'
      },
      {
        status: 'approved',
        note: 'Application accepted. Seat reserved in Playgroup Morning session.',
        changedAt: new Date(Date.now() - 86400000 * 3),
        changedBy: 'Principal'
      }
    ],
    notificationStatus: {
      parentAcknowledged: true,
      adminNotified: true,
      lastAttemptAt: new Date(Date.now() - 86400000 * 5)
    },
    createdAt: new Date(Date.now() - 86400000 * 5),
    updatedAt: new Date(Date.now() - 86400000 * 3)
  }
];

// Load persisted data or default
let memoryAdmissions = [];
try {
  if (fs.existsSync(dataFilePath)) {
    const raw = fs.readFileSync(dataFilePath, 'utf8');
    memoryAdmissions = JSON.parse(raw);
  }
} catch (err) {
  console.warn('Could not read admissions.json, using seed defaults:', err.message);
}

if (!memoryAdmissions || memoryAdmissions.length === 0) {
  memoryAdmissions = [...initialAdmissions];
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(memoryAdmissions, null, 2), 'utf8');
  } catch (e) {
    // ignore
  }
}

const persistToFile = () => {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(memoryAdmissions, null, 2), 'utf8');
  } catch (e) {
    console.error('Failed to write admissions file:', e.message);
  }
};

const isMongoConnected = () => {
  return mongoose.connection && mongoose.connection.readyState === 1;
};

const isDbConnected = () => {
  return isMongoConnected() || isFirebaseConnected();
};

// Export storage operations
module.exports = {
  isDbConnected,
  isMongoConnected,

  findAdmissionsByPhone: (phoneOrContact) => {
    const raw = String(phoneOrContact || '').trim();
    const digits = raw.replace(/\D/g, '');
    const last10 = digits.length >= 10 ? digits.slice(-10) : digits;
    const email = raw.toLowerCase();
    const appNo = raw.toUpperCase();

    return memoryAdmissions.filter(a => {
      const aPhone = String(a.guardianPhone || a.phone || a.mobile || '').replace(/\D/g, '');
      const aEmail = String(a.guardianEmail || a.email || '').toLowerCase();
      const aAppNo = String(a.applicationNumber || '').toUpperCase();

      if (last10 && last10.length >= 6) {
        if (aPhone === digits || (last10.length === 10 && aPhone.endsWith(last10)) || aPhone.includes(digits) || digits.includes(aPhone)) {
          return true;
        }
      }
      if (raw.includes('@') && aEmail === email) return true;
      if (raw.startsWith('CKP-') && aAppNo === appNo) return true;
      return false;
    });
  },

  findTrackAdmission: (applicationNumber, contact) => {
    const cleanApp = applicationNumber.trim().toUpperCase();
    const cleanContact = contact.trim().toLowerCase();

    return memoryAdmissions.find(a => {
      const matchApp = (a.applicationNumber || '').toUpperCase() === cleanApp || (a._id || '') === cleanApp;
      const matchContact = (a.guardianEmail || '').toLowerCase() === cleanContact ||
                           (a.guardianPhone || '').replace(/\D/g, '') === cleanContact.replace(/\D/g, '');
      return matchApp && matchContact;
    });
  },

  getAllAdmissions: ({ search, status, program, academicYear, page = 1, limit = 20 }) => {
    let filtered = [...memoryAdmissions];

    // Deduplicate in memory to prevent duplicate cards
    const seen = new Set();
    filtered = filtered.filter(a => {
      const key = a.applicationNumber || a.guardianPhone || a._id;
      if (!key) return true;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    if (search) {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter(a =>
        (a.childName || '').toLowerCase().includes(q) ||
        (a.applicationNumber || '').toLowerCase().includes(q) ||
        (a.guardianEmail || '').toLowerCase().includes(q) ||
        (a.guardianPhone || '').includes(q) ||
        (a.primaryContactName || '').toLowerCase().includes(q)
      );
    }

    if (status) {
      filtered = filtered.filter(a => a.status === status);
    }
    if (program) {
      filtered = filtered.filter(a => a.program === program);
    }
    if (academicYear) {
      filtered = filtered.filter(a => a.academicYear === academicYear);
    }

    // Sort newest first
    filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    const total = filtered.length;
    const pages = Math.ceil(total / limit) || 1;
    const offset = (page - 1) * limit;
    const data = filtered.slice(offset, offset + limit);

    return { data, total, pages, page };
  },

  getAdmissionById: (id) => {
    return memoryAdmissions.find(a => a._id === id || a.applicationNumber === id);
  },

  syncToMemoryOnly: (item) => {
    if (!item) return null;
    const appNo = item.applicationNumber;
    const phone = (item.guardianPhone || item.mobile || item.phone || '').replace(/\D/g, '');
    const cleanPhone = phone.length >= 10 ? phone.slice(-10) : phone;

    const existingIdx = memoryAdmissions.findIndex(a => {
      if (appNo && a.applicationNumber === appNo) return true;
      if (cleanPhone) {
        const aPhone = (a.guardianPhone || a.mobile || a.phone || '').replace(/\D/g, '');
        if (aPhone.endsWith(cleanPhone) || cleanPhone.endsWith(aPhone)) return true;
      }
      if (item.id && (a.id === item.id || a._id === item.id)) return true;
      if (item._id && (a._id === item._id || a.id === item._id)) return true;
      return false;
    });

    const newAdm = {
      _id: item.applicationNumber || item._id || item.id || (existingIdx !== -1 ? memoryAdmissions[existingIdx]._id : `adm-${Date.now()}`),
      id: item.applicationNumber || item.id || item._id || (existingIdx !== -1 ? memoryAdmissions[existingIdx].id : `adm-${Date.now()}`),
      ...item,
      updatedAt: new Date().toISOString()
    };

    if (existingIdx !== -1) {
      memoryAdmissions[existingIdx] = { ...memoryAdmissions[existingIdx], ...newAdm };
    } else {
      memoryAdmissions.unshift(newAdm);
    }

    persistToFile();
    return newAdm;
  },

  addAdmission: (item) => {
    if (!item) return null;
    const appNo = item.applicationNumber;
    const phone = (item.guardianPhone || item.mobile || item.phone || '').replace(/\D/g, '');
    const cleanPhone = phone.length >= 10 ? phone.slice(-10) : phone;

    const existingIdx = memoryAdmissions.findIndex(a => {
      if (appNo && a.applicationNumber === appNo) return true;
      if (cleanPhone) {
        const aPhone = (a.guardianPhone || a.mobile || a.phone || '').replace(/\D/g, '');
        if (aPhone.endsWith(cleanPhone) || cleanPhone.endsWith(aPhone)) return true;
      }
      return false;
    });

    const newAdm = {
      _id: item.applicationNumber || item._id || item.id || `adm-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      id: item.applicationNumber || item.id || item._id || `adm-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: item.createdAt || new Date(),
      updatedAt: new Date(),
      ...item
    };

    if (existingIdx !== -1) {
      memoryAdmissions[existingIdx] = { ...memoryAdmissions[existingIdx], ...newAdm };
    } else {
      memoryAdmissions.unshift(newAdm);
    }
    persistToFile();

    return newAdm;
  },

  updateAdmission: (id, updates) => {
    const idx = memoryAdmissions.findIndex(a => a._id === id || a.applicationNumber === id);
    if (idx === -1) return null;

    const current = memoryAdmissions[idx];
    const updated = {
      ...current,
      ...updates,
      updatedAt: new Date()
    };

    if (updates.status && updates.status !== current.status) {
      updated.statusHistory = updated.statusHistory || [];
      updated.statusHistory.unshift({
        status: updates.status,
        note: updates.adminNotes || `Status updated to ${updates.status} by administration`,
        changedAt: new Date(),
        changedBy: 'School Administrator'
      });
    }

    memoryAdmissions[idx] = updated;
    persistToFile();

    if (isFirebaseConnected()) {
      admissionsRepo.findByIdAndUpdate(updated.applicationNumber || updated._id, updated).catch(e => {
        console.warn('Firestore admission update notice:', e.message);
      });
    }

    return updated;
  }
};
