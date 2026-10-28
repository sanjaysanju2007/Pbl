const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  parentName: {
    type: String,
    required: [true, 'Parent name is required'],
    trim: true,
    maxlength: 100
  },
  childName: {
    type: String,
    trim: true,
    maxlength: 100
  },
  program: {
    type: String,
    enum: ['Playgroup', 'Nursery', 'LKG', 'UKG', ''],
    default: ''
  },
  message: {
    type: String,
    required: [true, 'Testimonial message is required'],
    trim: true,
    maxlength: 1000
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 5
  },
  isApproved: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

testimonialSchema.index({ isApproved: 1, createdAt: -1 });

module.exports = mongoose.model('Testimonial', testimonialSchema);
