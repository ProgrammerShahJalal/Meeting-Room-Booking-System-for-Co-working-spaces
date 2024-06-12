import { model, Schema } from 'mongoose';
import { TBooking } from './booking.interface';

const bookingSchema = new Schema<TBooking>({
  room: { type: Schema.Types.ObjectId, ref: 'Room', required: true },
  slots: [{ type: Schema.Types.ObjectId, ref: 'Slot', required: true }],
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true }, // "YYYY-MM-DD"
  totalAmount: { type: Number, required: true },
  isConfirmed: {
    type: String,
    enum: ['confirmed', 'unconfirmed', 'canceled'],
    default: 'unconfirmed',
  },
  isDeleted: { type: Boolean, default: false },
});

const Booking = model<TBooking>('Booking', bookingSchema);

export default Booking;
