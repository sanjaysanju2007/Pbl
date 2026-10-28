const GalleryItem = require('../database/models/GalleryItem');

// @desc    Get all gallery items (public)
// @route   GET /api/gallery
// @access  Public
exports.getGalleryItems = async (req, res) => {
  try {
    const { category, type } = req.query;
    const query = {};
    if (category) query.category = category;
    if (type) query.type = type;

    const items = await GalleryItem.find(query).sort({ order: 1, createdAt: -1 });
    res.status(200).json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get gallery categories (public)
// @route   GET /api/gallery/categories
// @access  Public
exports.getCategories = async (req, res) => {
  try {
    const categories = await GalleryItem.distinct('category');
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Add gallery item (admin)
// @route   POST /api/gallery
// @access  Private
exports.createGalleryItem = async (req, res) => {
  try {
    let url = req.body.url;
    if (req.file) {
      url = `/uploads/gallery/${req.file.filename}`;
    }

    const item = await GalleryItem.create({ ...req.body, url });
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Update gallery item (admin)
// @route   PUT /api/gallery/:id
// @access  Private
exports.updateGalleryItem = async (req, res) => {
  try {
    const item = await GalleryItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Gallery item not found' });
    }
    res.status(200).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Delete gallery item (admin)
// @route   DELETE /api/gallery/:id
// @access  Private
exports.deleteGalleryItem = async (req, res) => {
  try {
    const item = await GalleryItem.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Gallery item not found' });
    }
    res.status(200).json({ success: true, message: 'Gallery item deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
