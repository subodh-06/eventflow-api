import express from 'express';
import Event from '../models/Event.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all events
router.get('/', async (req, res) => {
  const events = await Event.find();
  res.json(events);
});

// Get event details
router.get('/:id', async (req, res) => {
  const event = await Event.findById(req.params.id);
  res.json(event);
});

// Create event (Organizer only)
router.post('/', authMiddleware(['organizer']), async (req, res) => {
  const event = new Event({ ...req.body, organizer: req.user.id });
  await event.save();
  res.status(201).json(event);
});

// Update event
router.patch('/:id', authMiddleware(['organizer']), async (req, res) => {
  const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(event);
});

// Delete event
router.delete('/:id', authMiddleware(['organizer']), async (req, res) => {
  await Event.findByIdAndDelete(req.params.id);
  res.json({ message: 'Event deleted' });
});

export default router;
