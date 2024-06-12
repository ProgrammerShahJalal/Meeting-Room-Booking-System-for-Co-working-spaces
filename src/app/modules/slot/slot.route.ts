import { Router } from 'express';
import { SlotController } from './slot.controller';
import { USER_ROLE } from '../user/user.constant';
import auth from '../../middlewares/auth';

const router = Router();

router.post('/', auth(USER_ROLE.admin), SlotController.createSlots);
router.get('/availability', SlotController.getAvailableSlots);

export const SlotRoutes = router;
