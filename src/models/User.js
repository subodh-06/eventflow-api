import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'organizer'], default: 'user' },
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
