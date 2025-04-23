import express from 'express';
import { searchFlights, getSampleFlights } from '../controllers/flightController.js';

const router = express.Router();

router.get('/search', searchFlights);
router.get('/initialize-sample', getSampleFlights);

export default router;