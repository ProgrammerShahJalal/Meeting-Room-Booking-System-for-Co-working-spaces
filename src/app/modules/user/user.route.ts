import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { UserControllers } from './user.controller';
import {
  userLoginValidationSchema,
  userSignUpValidationSchema,
} from './user.validation';

const router = express.Router();

// User Sign Up Route
router.post(
  '/signup',
  validateRequest(userSignUpValidationSchema),
  UserControllers.signUp,
);

// User Login Route
router.post(
  '/login',
  validateRequest(userLoginValidationSchema),
  UserControllers.login,
);

export const UserRoutes = router;
