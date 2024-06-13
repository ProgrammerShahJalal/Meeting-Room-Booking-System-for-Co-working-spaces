import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { UserServices } from './user.service';
import { TUser } from './user.interface';
import sendResponse from '../../utils/sendResponse';
import { Request, Response } from 'express';

const signUp = catchAsync(async (req: Request, res: Response) => {
  const { name, email, password, phone, address, role } = req.body as TUser;

  const result = await UserServices.createUser({
    name,
    email,
    password,
    phone,
    address,
    role,
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User registered successfully',
    data: result,
  });
});

const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const result = await UserServices.loginUser({ email, password });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User logged in successfully',
    data: result.user,
    token: result.token,
  });
});

export const UserControllers = {
  signUp,
  login,
};
