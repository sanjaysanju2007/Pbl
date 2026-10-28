const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  date: {
    type: Date,
    required: [true, 'Event date is required']
  },
  endDate: {
    type: Date
  },
  type: {
    type: String,
    enum: ['celebration', 'competition', 'workshop', 'field-trip', 'holiday', 'other'],
    default: 'celebration'
  },
  images: [{
    url: String,
    caption: String
  }],
  isPublished: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

eventSchema.index({ date: -1, isPublished: 1 });

module.exports = mongoose.model('Event', eventSchema);
