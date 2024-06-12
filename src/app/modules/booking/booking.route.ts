import { Router } from 'express';
import { BookingController } from './booking.controller';
import validateRequest from '../../middlewares/validateRequest';
import {
  createBookingValidationSchema,
  updateBookingValidationSchema,
} from './booking.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = Router();

// Route for creating a booking (Only accessible by authenticated users)
router.post(
  '/bookings',
  auth(USER_ROLE.admin, USER_ROLE.user),
  validateRequest(createBookingValidationSchema),
  BookingController.createBooking,
);

// Route for getting all bookings (Only accessible by admin)
router.get(
  '/bookings',
  auth(USER_ROLE.admin),
  BookingController.getAllBookings,
);

// Route for getting the authenticated user's bookings
router.get(
  '/my-bookings',
  auth(USER_ROLE.admin, USER_ROLE.user),
  BookingController.getUserBookings,
);

// Route for updating a booking (Only accessible by admin)
router.put(
  '/bookings/:id',
  auth(USER_ROLE.admin),
  validateRequest(updateBookingValidationSchema),
  BookingController.updateBooking,
);

// Route for deleting a booking (Soft delete, only accessible by admin)
router.delete(
  '/bookings/:id',
  auth(USER_ROLE.admin),
  BookingController.deleteBooking,
);

export const bookingRouters = router;
