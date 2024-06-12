import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { Room } from './room.model';
import { TRoom } from './room.interface';

const createRoom = async (roomData: TRoom) => {
  const room = await Room.create(roomData);
  return room;
};

const getRoomById = async (id: string) => {
  const room = await Room.findById(id);
  if (!room) {
    throw new AppError(httpStatus.NOT_FOUND, 'Room not found');
  }
  return room;
};

const getAllRooms = async () => {
  return await Room.find({ isDeleted: false });
};

const updateRoom = async (id: string, updateData: Partial<TRoom>) => {
  const room = await Room.findByIdAndUpdate(id, updateData, { new: true });
  if (!room) {
    throw new AppError(httpStatus.NOT_FOUND, 'Room not found');
  }
  return room;
};

const deleteRoom = async (id: string) => {
  const room = await Room.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  if (!room) {
    throw new AppError(httpStatus.NOT_FOUND, 'Room not found');
  }
  return room;
};

export const RoomServices = {
  createRoom,
  getRoomById,
  getAllRooms,
  updateRoom,
  deleteRoom,
};
