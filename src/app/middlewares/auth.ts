import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';
import AppError from '../errors/AppError';
import httpStatus from 'http-status';
import { USER_ROLE, UserRole } from '../modules/user/user.constant';

const auth =
  (...allowedRoles: UserRole[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new AppError(httpStatus.UNAUTHORIZED, 'No token provided'));
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(
        token,
        config.jwt_access_secret as string,
      ) as any;
      req.user = decoded;

      if (!allowedRoles.includes(req.user.role)) {
        return next(
          new AppError(httpStatus.FORBIDDEN, 'Insufficient permissions'),
        );
      }

      next();
    } catch (err) {
      return next(new AppError(httpStatus.UNAUTHORIZED, 'Invalid token'));
    }
  };

export default auth;
