const mongoose = require('mongoose');

const admissionSchema = new mongoose.Schema({
  // Unique Application Reference ID (e.g., CKP-2026-48192)
  applicationNumber: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
    uppercase: true
  },

  // Kid details
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
  age: {
    type: String,
    trim: true
  },
  gender: {
    type: String,
    default: 'Not Specified'
  },
  program: {
    type: String,
    required: [true, 'Category / Program is required']
  },
  academicYear: {
    type: String,
    default: () => {
      const now = new Date();
      const year = now.getMonth() >= 2 ? now.getFullYear() : now.getFullYear() - 1;
      return `${year}-${year + 1}`;
    }
  },

  // Parents / Guardian details
  parentName: {
    type: String,
    trim: true,
    maxlength: 100
  },
  primaryContactName: {
    type: String,
    trim: true,
    maxlength: 100
  },
  guardianPhone: {
    type: String,
    required: [true, 'Mobile number is required'],
    match: [/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number']
  },
  guardianEmail: {
    type: String,
    required: [true, 'Email address is required'],
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    lowercase: true,
    trim: true
  },
  location: {
    type: String,
    trim: true,
    maxlength: 500
  },
  address: {
    type: String,
    trim: true,
    maxlength: 500,
    default: function () {
      return this.location || 'Tiruppur';
    }
  },
  city: {
    type: String,
    trim: true,
    default: 'Tiruppur'
  },

  // Previous school / daycare
  hasPreviousSchool: {
    type: String,
    enum: ['Yes', 'No', 'yes', 'no', ''],
    default: 'No'
  },
  previousSchoolName: {
    type: String,
    trim: true,
    maxlength: 150
  },
  previousSchool: {
    type: String,
    trim: true,
    maxlength: 150,
    default: function () {
      return this.previousSchoolName || '';
    }
  },

  // Timing
  timing: {
    type: String,
    trim: true,
    default: '9:00-12:30'
  },

  // Additional comments or questions
  additionalComments: {
    type: String,
    trim: true
  },

  // Uploaded Documents (optional / backward compatibility)
  documents: [{
    name: String,
    path: String,
    mimetype: String,
    size: Number,
    uploadedAt: { type: Date, default: Date.now }
  }],

  // Admission Lifecycle & Workflow
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
  if (!this.primaryContactName) {
    this.primaryContactName = this.parentName || 'Parent / Guardian';
  }
  if (!this.address) {
    this.address = this.location || 'Tiruppur';
  }
  next();
});

admissionSchema.index({ status: 1, createdAt: -1 });
admissionSchema.index({ guardianEmail: 1 });
admissionSchema.index({ guardianPhone: 1 });

module.exports = mongoose.model('Admission', admissionSchema);
