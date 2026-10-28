const mongoose = require('mongoose');

const galleryItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: 200
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  type: {
    type: String,
    enum: ['photo', 'video'],
    default: 'photo'
  },
  url: {
    type: String,
    required: [true, 'File URL is required']
  },
  thumbnailUrl: {
    type: String
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

galleryItemSchema.index({ category: 1, createdAt: -1 });

module.exports = mongoose.model('GalleryItem', galleryItemSchema);
