const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    trim: true
  },
  category: {
    type: String,
    enum: ['news', 'update', 'notice', 'holiday'],
    default: 'news'
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  publishDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

announcementSchema.index({ isPublished: 1, publishDate: -1 });

module.exports = mongoose.model('Announcement', announcementSchema);
