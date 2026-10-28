const mongoose = require('mongoose');

const admissionSchema = new mongoose.Schema({
  // Unique Application Reference ID (e.g., CKP-2025-48192)
  applicationNumber: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
    uppercase: true
  },

  // Section A: Student Details
  childName: {
    type: String,
    required: [true, 'Student full name is required'],
    trim: true,
    maxlength: 100
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Date of birth is required']
  },
  gender: {
    type: String,
    required: [true, 'Gender is required'],
    enum: ['Male', 'Female', 'Other']
  },
  program: {
    type: String,
    required: [true, 'Program is required'],
    enum: ['Playgroup', 'Nursery', 'LKG', 'UKG']
  },
  academicYear: {
    type: String,
    default: () => {
      const now = new Date();
      const year = now.getMonth() >= 2 ? now.getFullYear() : now.getFullYear() - 1;
      return `${year}-${year + 1}`;
    }
  },
  preferredStartDate: {
    type: Date
  },
  bloodGroup: {
    type: String,
    trim: true,
    uppercase: true
  },
  allergies: {
    type: String,
    trim: true
  },

  // Section B: Parent / Guardian Details
  fatherName: {
    type: String,
    trim: true,
    maxlength: 100
  },
  motherName: {
    type: String,
    trim: true,
    maxlength: 100
  },
  primaryContactName: {
    type: String,
    trim: true,
    maxlength: 100
  },
  relationship: {
    type: String,
    enum: ['Father', 'Mother', 'Guardian', 'Other'],
    default: 'Father'
  },
  guardianPhone: {
    type: String,
    required: [true, 'Primary contact number is required'],
    match: [/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number']
  },
  guardianEmail: {
    type: String,
    required: [true, 'Email address is required'],
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    lowercase: true,
    trim: true
  },
  alternatePhone: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    required: [true, 'Residential address is required'],
    trim: true,
    maxlength: 500
  },
  city: {
    type: String,
    trim: true,
    default: 'Tiruppur'
  },
  pincode: {
    type: String,
    trim: true
  },

  // Section C: Additional Information
  previousSchool: {
    type: String,
    trim: true,
    maxlength: 150
  },
  specialConsiderations: {
    type: String,
    trim: true
  },
  preferredContactMethod: {
    type: String,
    enum: ['Phone Call', 'Email', 'WhatsApp'],
    default: 'Phone Call'
  },
  additionalComments: {
    type: String,
    trim: true
  },

  // Section D: Uploaded Documents
  documents: [{
    name: String,
    path: String,
    mimetype: String,
    size: Number,
    uploadedAt: { type: Date, default: Date.now }
  }],

  // Section E: Admission Lifecycle & Workflow
  status: {
    type: String,
    enum: ['submitted', 'pending', 'under_review', 'reviewed', 'shortlisted', 'approved', 'rejected', 'waitlisted'],
    default: 'submitted'
  },
  adminNotes: {
    type: String,
    trim: true
  },
  statusHistory: [{
    status: String,
    note: String,
    changedAt: { type: Date, default: Date.now },
    changedBy: String
  }],
  notificationStatus: {
    adminNotified: { type: Boolean, default: false },
    parentAcknowledged: { type: Boolean, default: false },
    lastAttemptAt: Date,
    deliveryError: String
  }
}, {
  timestamps: true
});

// Auto-generate unique application number if not present
admissionSchema.pre('save', function (next) {
  if (!this.applicationNumber) {
    const year = new Date().getFullYear();
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    this.applicationNumber = `CKP-${year}-${randomSuffix}`;
  }
  // Fill primaryContactName fallback if only father/mother name supplied
  if (!this.primaryContactName) {
    this.primaryContactName = this.fatherName || this.motherName || 'Parent / Guardian';
  }
  next();
});

admissionSchema.index({ status: 1, createdAt: -1 });
admissionSchema.index({ guardianEmail: 1 });
admissionSchema.index({ guardianPhone: 1 });
admissionSchema.index({ applicationNumber: 1 });

module.exports = mongoose.model('Admission', admissionSchema);
