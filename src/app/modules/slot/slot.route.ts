import { Router } from 'express';
import { SlotController } from './slot.controller';
import { USER_ROLE } from '../user/user.constant';
import auth from '../../middlewares/auth';

const router = Router();

router.post('/', auth(USER_ROLE.admin), SlotController.createSlots);
router.get('/availability', SlotController.getAvailableSlots);
router.get('/:id', SlotController.getSlotById);
router.put('/:id', auth(USER_ROLE.admin), SlotController.updateSlot);
router.delete('/:id', auth(USER_ROLE.admin), SlotController.deleteSlot);

export const SlotRoutes = router;
