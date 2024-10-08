import { Model } from 'mongoose';

export interface TRoom {
  name: string;
  roomNo: number;
  floorNo: number;
  capacity: number;
  pricePerSlot: number;
  amenities: string[];
  imageUrl?: string;
  isDeleted: boolean;
}

export interface RoomModel extends Model<TRoom> {}
