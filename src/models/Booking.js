import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
    status: { type: String, enum: ['booked', 'canceled'], default: 'booked' },
  },
  { timestamps: true }
);

export default mongoose.model('Booking', bookingSchema);
