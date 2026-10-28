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

const isDbConnected = () => {
  return (mongoose.connection && mongoose.connection.readyState === 1) || isFirebaseConnected();
};

// Export storage operations
module.exports = {
  isDbConnected,

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

  addAdmission: (item) => {
    const newAdm = {
      _id: item._id || `adm-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: item.createdAt || new Date(),
      updatedAt: new Date(),
      ...item
    };
    memoryAdmissions.unshift(newAdm);
    persistToFile();

    if (isFirebaseConnected()) {
      admissionsRepo.create(newAdm, newAdm.applicationNumber || newAdm._id).catch(e => {
        console.warn('Firestore admission sync notice:', e.message);
      });
    }

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
