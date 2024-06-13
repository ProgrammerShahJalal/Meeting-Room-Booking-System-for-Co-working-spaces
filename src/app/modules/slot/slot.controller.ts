import { Request, Response, NextFunction } from 'express';
import { createSlotValidationSchema } from './slot.validation';

import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import Slot from './slot.model';
import sendResponse from '../../utils/sendResponse';

const createSlots = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { room, date, startTime, endTime } = req.body;

    // Validate the request body
    await createSlotValidationSchema.parseAsync(req.body);

    // Convert times to minutes since midnight
    const startMinutes =
      parseInt(startTime.split(':')[0]) * 60 +
      parseInt(startTime.split(':')[1]);
    const endMinutes =
      parseInt(endTime.split(':')[0]) * 60 + parseInt(endTime.split(':')[1]);
    const slotDuration = 60; // in minutes

    // Calculate the number of slots
    const totalDuration = endMinutes - startMinutes;
    const numSlots = totalDuration / slotDuration;

    const slots = [];
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

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Slots created successfully',
      data: slots,
    });
  },
);

const getAvailableSlots = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { date, roomId } = req.query;

    const query: any = { isBooked: false };
    if (date) query.date = date;
    if (roomId) query.room = roomId;

    const slots = await Slot.find(query).populate('room');

    if (slots.length === 0) {
      return sendResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        success: false,
        message: 'No Data Found',
        data: [],
      });
    }

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Available slots retrieved successfully',
      data: slots,
    });
  },
);

export const SlotController = {
  createSlots,
  getAvailableSlots,
};
