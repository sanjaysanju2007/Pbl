const mongoose = require('mongoose');

const pageContentSchema = new mongoose.Schema({
  pageSlug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  title: {
    type: String,
    trim: true
  },
  sections: [{
    sectionKey: { type: String, required: true },
    heading: String,
    content: String, // Rich text / HTML content
    image: String,
    order: { type: Number, default: 0 }
  }],
  metaTitle: String,
  metaDescription: String,
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AdminUser'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('PageContent', pageContentSchema);
