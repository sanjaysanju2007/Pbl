const PageContent = require('../database/models/PageContent');

// @desc    Get page content by slug (public)
// @route   GET /api/content/:pageSlug
// @access  Public
exports.getPageContent = async (req, res) => {
  try {
    const content = await PageContent.findOne({ pageSlug: req.params.pageSlug });
    if (!content) {
      return res.status(200).json({ success: true, data: null });
    }
    res.status(200).json({ success: true, data: content });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get all page content (admin)
// @route   GET /api/content
// @access  Private
exports.getAllContent = async (req, res) => {
  try {
    const content = await PageContent.find().sort({ pageSlug: 1 });
    res.status(200).json({ success: true, data: content });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Update or create page content (admin)
// @route   PUT /api/content/:pageSlug
// @access  Private
exports.updatePageContent = async (req, res) => {
  try {
    const content = await PageContent.findOneAndUpdate(
      { pageSlug: req.params.pageSlug },
      { ...req.body, pageSlug: req.params.pageSlug, updatedBy: req.user._id },
      { new: true, upsert: true, runValidators: true }
    );
    res.status(200).json({ success: true, data: content });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
