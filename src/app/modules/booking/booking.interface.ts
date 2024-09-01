import { Document, Types } from 'mongoose';

export interface TBooking extends Document {
  room: Types.ObjectId;
  slots: Types.ObjectId[];
  user: Types.ObjectId;
  date: string; // We take it string for getting the "YYYY-MM-DD" format
  totalAmount: number;
  isConfirmed: string;
  isDeleted: boolean;
  paymentOption: string; // Payment option (e.g., 'stripe', 'cash')
}
