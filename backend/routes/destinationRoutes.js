import express from 'express';
import { getDestinations, createDestination } from '../controllers/destinationController.js';

const router = express.Router();

router.route('/').get(getDestinations).post(createDestination);

export default router;