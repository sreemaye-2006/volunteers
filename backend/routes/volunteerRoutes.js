import express from 'express';
import {
  registerVolunteer,
  getVolunteers,
  updateVolunteerStatus,
  deleteVolunteer,
} from '../controllers/volunteerController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route to register
router.post('/', registerVolunteer);

// Protected admin routes
router.get('/', protect, getVolunteers);
router.patch('/:id/status', protect, updateVolunteerStatus);
router.delete('/:id', protect, deleteVolunteer);

export default router;
