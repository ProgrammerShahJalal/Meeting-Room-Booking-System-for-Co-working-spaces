import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { SlotServices } from './slot.service';
import { Request, Response } from 'express';

const createSlots = catchAsync(async (req: Request, res: Response) => {
  const slots = await SlotServices.createSlot(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Slots created successfully',
    data: slots,
  });
});

const getAvailableSlots = catchAsync(async (req: Request, res: Response) => {
  const { date, roomId } = req.query;

  const slots = await SlotServices.getAvailableSlots(
    date as string,
    roomId as string,
  );

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
});

const updateSlot = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updatedSlot = await SlotServices.updateSlot(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Slot updated successfully',
    data: updatedSlot,
  });
});

const deleteSlot = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const deletedSlot = await SlotServices.deleteSlot(id);

  if (!deletedSlot) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'Slot not found',
      data: null,
    });
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Slot deleted successfully',
    data: deletedSlot,
  });
});

export const SlotController = {
  createSlots,
  getAvailableSlots,
  updateSlot,
  deleteSlot,
};
