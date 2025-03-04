import express from 'express';
import Booking from '../models/Booking.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Book an event
router.post('/', authMiddleware(['user']), async (req, res) => {
  const booking = new Booking({ user: req.user.id, event: req.body.event });
  await booking.save();
  res.status(201).json(booking);
});

// View all bookings
router.get('/', authMiddleware(['user', 'organizer']), async (req, res) => {
  const bookings = await Booking.find({ user: req.user.id }).populate('event');
  res.json(bookings);
});

// Cancel booking
router.patch('/:id/cancel', authMiddleware(['user']), async (req, res) => {
  const booking = await Booking.findByIdAndUpdate(req.params.id, { status: 'canceled' }, { new: true });
  res.json(booking);
});

export default router;
