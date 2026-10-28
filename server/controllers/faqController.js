const FAQ = require('../models/FAQ');

// @desc    Get published FAQs (public)
// @route   GET /api/faqs
// @access  Public
exports.getFAQs = async (req, res) => {
  try {
    const { category } = req.query;
    const query = { isPublished: true };
    if (category) query.category = category;

    const faqs = await FAQ.find(query).sort({ order: 1, createdAt: -1 });
    res.status(200).json({ success: true, data: faqs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get all FAQs (admin)
// @route   GET /api/faqs/all
// @access  Private
exports.getAllFAQs = async (req, res) => {
  try {
    const faqs = await FAQ.find().sort({ order: 1 });
    res.status(200).json({ success: true, data: faqs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Create FAQ (admin)
// @route   POST /api/faqs
// @access  Private
exports.createFAQ = async (req, res) => {
  try {
    const faq = await FAQ.create(req.body);
    res.status(201).json({ success: true, data: faq });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Update FAQ (admin)
// @route   PUT /api/faqs/:id
// @access  Private
exports.updateFAQ = async (req, res) => {
  try {
    const faq = await FAQ.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!faq) {
      return res.status(404).json({ success: false, message: 'FAQ not found' });
    }
    res.status(200).json({ success: true, data: faq });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Delete FAQ (admin)
// @route   DELETE /api/faqs/:id
// @access  Private
exports.deleteFAQ = async (req, res) => {
  try {
    const faq = await FAQ.findByIdAndDelete(req.params.id);
    if (!faq) {
      return res.status(404).json({ success: false, message: 'FAQ not found' });
    }
    res.status(200).json({ success: true, message: 'FAQ deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
