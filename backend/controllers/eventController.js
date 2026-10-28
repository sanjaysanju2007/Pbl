const Event = require('../database/models/Event');
const { isFirebaseConnected, eventsRepo } = require('../database/firestoreRepository');

// @desc    Get published events (public)
// @route   GET /api/events
// @access  Public
exports.getEvents = async (req, res) => {
  try {
    const { type } = req.query;

    if (isFirebaseConnected()) {
      const filter = { isPublished: true };
      if (type) filter.type = type;
      const result = await eventsRepo.find({
        filter,
        sortField: 'date',
        sortDirection: 'desc',
        limit: 50
      });
      return res.status(200).json({ success: true, data: result.data });
    }

    const { upcoming } = req.query;
    const query = { isPublished: true };
    if (type) query.type = type;
    if (upcoming === 'true') {
      query.date = { $gte: new Date() };
    } else if (upcoming === 'false') {
      query.date = { $lt: new Date() };
    }

    const events = await Event.find(query).sort({ date: -1 });
    res.status(200).json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get all events (admin)
// @route   GET /api/events/all
// @access  Private
exports.getAllEvents = async (req, res) => {
  try {
    if (isFirebaseConnected()) {
      const result = await eventsRepo.find({
        filter: {},
        sortField: 'date',
        sortDirection: 'desc',
        limit: 100
      });
      return res.status(200).json({ success: true, data: result.data });
    }

    const events = await Event.find().sort({ date: -1 });
    res.status(200).json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Create event (admin)
// @route   POST /api/events
// @access  Private
exports.createEvent = async (req, res) => {
  try {
    let event = null;
    if (isFirebaseConnected()) {
      event = await eventsRepo.create(req.body);
    } else {
      event = await Event.create(req.body);
    }
    res.status(201).json({ success: true, data: event });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Update event (admin)
// @route   PUT /api/events/:id
// @access  Private
exports.updateEvent = async (req, res) => {
  try {
    let event = null;
    if (isFirebaseConnected()) {
      event = await eventsRepo.findByIdAndUpdate(req.params.id, req.body);
    } else {
      event = await Event.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
      });
    }

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    res.status(200).json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Delete event (admin)
// @route   DELETE /api/events/:id
// @access  Private
exports.deleteEvent = async (req, res) => {
  try {
    let event = null;
    if (isFirebaseConnected()) {
      event = await eventsRepo.findByIdAndDelete(req.params.id);
    } else {
      event = await Event.findByIdAndDelete(req.params.id);
    }

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    res.status(200).json({ success: true, message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
