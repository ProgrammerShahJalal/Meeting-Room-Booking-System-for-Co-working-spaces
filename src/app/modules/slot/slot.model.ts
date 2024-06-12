import { model, Schema } from 'mongoose';
import { TSlot } from './slot.interface';

const slotSchema = new Schema<TSlot>({
  room: { type: Schema.Types.ObjectId, ref: 'Room', required: true },
  date: { type: String, required: true }, // We store date as a string in "YYYY-MM-DD" format
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  isBooked: { type: Boolean, default: false },
});

const Slot = model<TSlot>('Slot', slotSchema);

export default Slot;
