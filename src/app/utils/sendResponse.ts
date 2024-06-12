import { Response } from 'express';

type TResponse<T> = {
  statusCode: number;
  success: boolean;
  message?: string;
  token?: string;
  data: T;
};

const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  const { statusCode, success, message, token, data: responseData } = data;
  const responseBody: Record<string, unknown> = {
    success,
    statusCode,
    message,
    data: responseData,
  };

  if (token) {
    responseBody.token = token;
  }

  res.status(statusCode).json(responseBody);
};

export default sendResponse;
