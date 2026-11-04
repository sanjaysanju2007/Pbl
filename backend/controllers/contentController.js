const PageContent = require('../database/models/PageContent');
const { isFirebaseConnected, pageContentRepo } = require('../database/firestoreRepository');

// @desc    Get page content by slug (public)
// @route   GET /api/content/:pageSlug
// @access  Public
exports.getPageContent = async (req, res) => {
  try {
    if (isFirebaseConnected()) {
      const content = await pageContentRepo.findOne('pageSlug', req.params.pageSlug);
      return res.status(200).json({ success: true, data: content || null });
    }

    const content = await PageContent.findOne({ pageSlug: req.params.pageSlug });
    if (!content) {
      return res.status(200).json({ success: true, data: null });
    }
    return res.status(200).json({ success: true, data: content });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get all page content (admin)
// @route   GET /api/content
// @access  Private
exports.getAllContent = async (req, res) => {
  try {
    if (isFirebaseConnected()) {
      const result = await pageContentRepo.find({ limit: 100 });
      return res.status(200).json({ success: true, data: result.data });
    }

    const content = await PageContent.find().sort({ pageSlug: 1 });
    return res.status(200).json({ success: true, data: content });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Update or create page content (admin)
// @route   PUT /api/content/:pageSlug
// @access  Private
exports.updatePageContent = async (req, res) => {
  try {
    const slug = req.params.pageSlug;

    if (isFirebaseConnected()) {
      const existing = await pageContentRepo.findOne('pageSlug', slug);
      let updated = null;
      if (existing) {
        updated = await pageContentRepo.findByIdAndUpdate(existing.id, {
          ...req.body,
          pageSlug: slug,
          updatedBy: req.user ? req.user._id : 'admin'
        });
      } else {
        updated = await pageContentRepo.create({
          ...req.body,
          pageSlug: slug,
          updatedBy: req.user ? req.user._id : 'admin'
        }, `content-${slug}`);
      }
      return res.status(200).json({ success: true, data: updated });
    }

    const content = await PageContent.findOneAndUpdate(
      { pageSlug: req.params.pageSlug },
      { ...req.body, pageSlug: req.params.pageSlug, updatedBy: req.user._id },
      { new: true, upsert: true, runValidators: true }
    );
    return res.status(200).json({ success: true, data: content });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
