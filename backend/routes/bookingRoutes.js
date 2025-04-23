import express from 'express';
import { getUserBookings, createBooking, cancelBooking } from '../controllers/bookingController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(protect, getUserBookings)
    .post(protect, createBooking);

router.put('/:id/cancel', protect, cancelBooking);

export default router;