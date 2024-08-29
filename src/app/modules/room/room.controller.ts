import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { TRoom } from './room.interface';
import { RoomServices } from './room.service';
import sendResponse from '../../utils/sendResponse';

const createRoom = catchAsync(async (req: Request, res: Response) => {
  const roomData: TRoom = req.body;
  const newRoom = await RoomServices.createRoom(roomData);

  sendResponse<TRoom>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Room added successfully',
    data: newRoom,
  });
});

const getRoom = catchAsync(async (req: Request, res: Response) => {
  const roomId = req.params.id;
  const room = await RoomServices.getRoomById(roomId);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Room retrieved successfully',
    data: room,
  });
});

const getAllRooms = catchAsync(async (req: Request, res: Response) => {
  const rooms = await RoomServices.getAllRooms();

  if (rooms.length === 0) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'No Data Found',
      data: [],
    });
  }

  sendResponse<TRoom[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Rooms retrieved successfully',
    data: rooms,
  });
});

const updateRoom = catchAsync(async (req: Request, res: Response) => {
  const roomId = req.params.id;
  const roomData: Partial<TRoom> = req.body;
  const updatedRoom = await RoomServices.updateRoom(roomId, roomData);

  if (!updatedRoom) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'Room not found',
      data: null,
    });
  }

  sendResponse<TRoom>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Room updated successfully',
    data: updatedRoom,
  });
});

const deleteRoom = catchAsync(async (req: Request, res: Response) => {
  const roomId = req.params.id;
  const deletedRoom = await RoomServices.deleteRoom(roomId);

  if (!deletedRoom) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'Room not found',
      data: null,
    });
  }

  sendResponse<TRoom>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Room deleted successfully',
    data: deletedRoom,
  });
});

export const RoomControllers = {
  createRoom,
  getRoom,
  getAllRooms,
  updateRoom,
  deleteRoom,
};
