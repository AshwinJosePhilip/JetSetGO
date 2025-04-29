import express from 'express';
import { 
    getFlights,
    createFlight, 
    updateFlight, 
    deleteFlight,
    searchFlights,
    getSampleFlights 
} from '../controllers/flightController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/search', searchFlights);
router.get('/', getFlights);
router.get('/initialize-sample', getSampleFlights);

// Admin routes
router.post('/', protect, admin, createFlight);
router.put('/:id', protect, admin, updateFlight);
router.delete('/:id', protect, admin, deleteFlight);

export default router;