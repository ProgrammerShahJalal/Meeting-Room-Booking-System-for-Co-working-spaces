import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import Slot from '../slot/slot.model';
import { TBooking } from './booking.interface';
import { Room } from '../room/room.model';
import Booking from './booking.model';

interface CreateBookingParams {
  date: string;
  slots: string[];
  room: string;
  user: string;
  paymentOption: string;
}

const createBooking = async (
  params: CreateBookingParams,
): Promise<TBooking> => {
  const { date, slots, room, user, paymentOption } = params;

  // Validate room ID
  const roomData = await Room.findById(room);
  if (!roomData) {
    throw new AppError(httpStatus.NOT_FOUND, 'Room not found');
  }

  // Calculate total amount
  const totalAmount = roomData.pricePerSlot * slots.length;

  // Create booking
  const newBooking = await Booking.create({
    date,
    slots,
    room,
    user,
    totalAmount,
    isConfirmed: 'unconfirmed',
    paymentOption,
  });

  await newBooking.populate('room');
  await newBooking.populate('slots');
  await newBooking.populate('user');

  // Update slot statuses
  await Slot.updateMany({ _id: { $in: slots } }, { isBooked: true });

  return newBooking;
};

const getAllBookings = async (): Promise<TBooking[]> => {
  const bookings = await Booking.find({ isDeleted: false })
    .populate('room')
    .populate('slots')
    .populate('user');

  if (bookings.length === 0) {
    throw new AppError(httpStatus.NOT_FOUND, 'No bookings found');
  }

  return bookings;
};

const getUserBookings = async (userId: string): Promise<TBooking[]> => {
  const bookings = await Booking.find({ user: userId, isDeleted: false })
    .populate('room')
    .populate('slots');

  if (bookings.length === 0) {
    throw new AppError(httpStatus.NOT_FOUND, 'No bookings found');
  }

  return bookings;
};

const updateBooking = async (
  id: string,
  isConfirmed: string,
): Promise<TBooking | null> => {
  const booking = await Booking.findByIdAndUpdate(
    id,
    { isConfirmed },
    { new: true },
  );

  if (!booking) {
    throw new AppError(httpStatus.NOT_FOUND, 'Booking not found');
  }

  return booking;
};

const deleteBooking = async (id: string): Promise<TBooking | null> => {
  const booking = await Booking.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );

  if (!booking) {
    throw new AppError(httpStatus.NOT_FOUND, 'Booking not found');
  }

  return booking;
};

export const BookingServices = {
  createBooking,
  getAllBookings,
  getUserBookings,
  updateBooking,
  deleteBooking,
};
