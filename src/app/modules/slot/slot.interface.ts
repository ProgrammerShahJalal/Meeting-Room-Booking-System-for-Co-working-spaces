import { Document, Schema } from 'mongoose';

export interface TSlot extends Document {
  room: Schema.Types.ObjectId;
  date: string; //we take it string for getting YYYY-MM-DD" format
  startTime: string;
  endTime: string;
  isBooked: boolean;
}
