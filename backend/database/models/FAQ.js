const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'Question is required'],
    trim: true,
    maxlength: 500
  },
  answer: {
    type: String,
    required: [true, 'Answer is required'],
    trim: true,
    maxlength: 2000
  },
  category: {
    type: String,
    enum: ['admissions', 'fees', 'timings', 'policies', 'general'],
    default: 'general'
  },
  order: {
    type: Number,
    default: 0
  },
  isPublished: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

faqSchema.index({ isPublished: 1, order: 1 });

module.exports = mongoose.model('FAQ', faqSchema);
