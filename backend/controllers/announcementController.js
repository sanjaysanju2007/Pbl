const Announcement = require('../database/models/Announcement');
const { isFirebaseConnected, announcementsRepo } = require('../database/firestoreRepository');

// @desc    Get published announcements (public)
// @route   GET /api/announcements
// @access  Public
exports.getAnnouncements = async (req, res) => {
  try {
    const { category, page = 1, limit = 10 } = req.query;

    if (isFirebaseConnected()) {
      const filter = { isPublished: true };
      if (category) filter.category = category;
      const result = await announcementsRepo.find({
        filter,
        sortField: 'publishDate',
        sortDirection: 'desc',
        page: parseInt(page),
        limit: parseInt(limit)
      });
      return res.status(200).json({
        success: true,
        data: result.data,
        pagination: { total: result.total, page: result.page, pages: result.pages }
      });
    }

    const query = { isPublished: true };
    if (category) query.category = category;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Announcement.countDocuments(query);
    const announcements = await Announcement.find(query)
      .sort({ publishDate: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      data: announcements,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get all announcements including unpublished (admin)
// @route   GET /api/announcements/all
// @access  Private
exports.getAllAnnouncements = async (req, res) => {
  try {
    if (isFirebaseConnected()) {
      const result = await announcementsRepo.find({
        filter: {},
        sortField: 'createdAt',
        sortDirection: 'desc',
        limit: 100
      });
      return res.status(200).json({ success: true, data: result.data });
    }

    const announcements = await Announcement.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: announcements });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Create announcement (admin)
// @route   POST /api/announcements
// @access  Private
exports.createAnnouncement = async (req, res) => {
  try {
    let announcement = null;
    if (isFirebaseConnected()) {
      announcement = await announcementsRepo.create(req.body);
    } else {
      announcement = await Announcement.create(req.body);
    }
    res.status(201).json({ success: true, data: announcement });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Update announcement (admin)
// @route   PUT /api/announcements/:id
// @access  Private
exports.updateAnnouncement = async (req, res) => {
  try {
    let announcement = null;
    if (isFirebaseConnected()) {
      announcement = await announcementsRepo.findByIdAndUpdate(req.params.id, req.body);
    } else {
      announcement = await Announcement.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
      });
    }

    if (!announcement) {
      return res.status(404).json({ success: false, message: 'Announcement not found' });
    }
    res.status(200).json({ success: true, data: announcement });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Delete announcement (admin)
// @route   DELETE /api/announcements/:id
// @access  Private
exports.deleteAnnouncement = async (req, res) => {
  try {
    let announcement = null;
    if (isFirebaseConnected()) {
      announcement = await announcementsRepo.findByIdAndDelete(req.params.id);
    } else {
      announcement = await Announcement.findByIdAndDelete(req.params.id);
    }

    if (!announcement) {
      return res.status(404).json({ success: false, message: 'Announcement not found' });
    }
    res.status(200).json({ success: true, message: 'Announcement deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
