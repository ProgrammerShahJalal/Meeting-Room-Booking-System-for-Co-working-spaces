import { Request, Response, NextFunction } from 'express';
import Booking from './booking.model';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { Room } from '../room/room.model';
import AppError from '../../errors/AppError';
import Slot from '../slot/slot.model';

const createBooking = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { date, slots, room, user } = req.body;
    console.log('reqInfo', req.body);
    // Calculate total amount
    const roomData = await Room.findById(room);
    if (!roomData) {
      return next(new AppError(httpStatus.NOT_FOUND, 'Room not found'));
    }
    const totalAmount = roomData.pricePerSlot * slots.length;

    // Create booking
    const newBooking = await Booking.create({
      date,
      slots,
      room,
      user,
      totalAmount,
      isConfirmed: 'unconfirmed',
    });

    newBooking.populate('room');
    newBooking.populate('slots');
    newBooking.populate('user');

    // Update slot statuses
    await Slot.updateMany({ _id: { $in: slots } }, { isBooked: true });

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Booking created successfully',
      data: newBooking,
    });
  },
);

const getAllBookings = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const bookings = await Booking.find({ isDeleted: false })
      .populate('room')
      .populate('slots')
      .populate('user');

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'All bookings retrieved successfully',
      data: bookings,
    });
  },
);

const getUserBookings = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user.id;

    const bookings = await Booking.find({ user: userId, isDeleted: false })
      .populate('room')
      .populate('slots');

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User bookings retrieved successfully',
      data: bookings,
    });
  },
);

const updateBooking = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { isConfirmed } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      id,
      { isConfirmed },
      { new: true },
    );

    if (!booking) {
      return next(new AppError(httpStatus.NOT_FOUND, 'Booking not found'));
    }

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Booking updated successfully',
      data: booking,
    });
  },
);

const deleteBooking = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const booking = await Booking.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true },
    );

    if (!booking) {
      return next(new AppError(httpStatus.NOT_FOUND, 'Booking not found'));
    }

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Booking deleted successfully',
      data: booking,
    });
  },
);

export const BookingController = {
  createBooking,
  getAllBookings,
  getUserBookings,
  updateBooking,
  deleteBooking,
};
