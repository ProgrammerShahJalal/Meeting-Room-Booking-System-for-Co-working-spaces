import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { TSlot } from './slot.interface';
import Slot from './slot.model';
import { Room } from '../room/room.model';

interface CreateSlotParams {
  room: string;
  date: string;
  startTime: string;
  endTime: string;
}

const validateRoomExists = async (roomId: string) => {
  const roomExists = await Room.exists({ _id: roomId });
  if (!roomExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Room not found');
  }
};

const createSlot = async (slotData: CreateSlotParams): Promise<TSlot[]> => {
  const { room, date, startTime, endTime } = slotData;

  // Validate room ID
  await validateRoomExists(room);

  // Convert times to minutes since midnight
  const startMinutes =
    parseInt(startTime.split(':')[0]) * 60 + parseInt(startTime.split(':')[1]);
  const endMinutes =
    parseInt(endTime.split(':')[0]) * 60 + parseInt(endTime.split(':')[1]);
  const slotDuration = 60; // in minutes

  // Calculate the number of slots
  const totalDuration = endMinutes - startMinutes;
  if (totalDuration % slotDuration !== 0) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid time range for slots');
  }
  const numSlots = totalDuration / slotDuration;

  const slots: TSlot[] = [];
  for (let i = 0; i < numSlots; i++) {
    const slotStartTime = new Date(`${date}T00:00:00.000Z`);
    slotStartTime.setMinutes(startMinutes + i * slotDuration);

    const slotEndTime = new Date(`${date}T00:00:00.000Z`);
    slotEndTime.setMinutes(startMinutes + (i + 1) * slotDuration);

    const newSlot = new Slot({
      room,
      date,
      startTime: slotStartTime.toISOString().substr(11, 5),
      endTime: slotEndTime.toISOString().substr(11, 5),
      isBooked: false,
    });

    await newSlot.save();
    slots.push(newSlot);
  }

  return slots;
};

const getAvailableSlots = async (
  date?: string,
  roomId?: string,
): Promise<TSlot[]> => {
  const query: { isBooked: boolean; date?: string; room?: string } = {
    isBooked: false,
  };
  if (date) query.date = date;
  if (roomId) query.room = roomId;

  const slots = await Slot.find(query).populate('room');

  if (!slots.length) {
    throw new AppError(httpStatus.NOT_FOUND, 'No available slots found');
  }

  return slots;
};
// get slot by id
const getSlotById = async (id: string): Promise<TSlot> => {
  const slot = await Slot.findById(id).populate('room');
  if (!slot) {
    throw new AppError(httpStatus.NOT_FOUND, 'Slot not found');
  }
  return slot;
};

const updateSlot = async (
  id: string,
  updateData: Partial<TSlot>,
): Promise<TSlot | null> => {
  const slot = await Slot.findByIdAndUpdate(id, updateData, { new: true });
  if (!slot) {
    throw new AppError(httpStatus.NOT_FOUND, 'Slot not found');
  }
  return slot;
};

const deleteSlot = async (id: string): Promise<TSlot | null> => {
  const slot = await Slot.findByIdAndDelete(id);
  if (!slot) {
    throw new AppError(httpStatus.NOT_FOUND, 'Slot not found');
  }
  return slot;
};

export const SlotServices = {
  createSlot,
  getAvailableSlots,
  getSlotById,
  updateSlot,
  deleteSlot,
};
