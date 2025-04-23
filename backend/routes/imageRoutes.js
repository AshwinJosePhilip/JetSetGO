import express from 'express';
import { getImage, getAllImages, createImage } from '../controllers/imageController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllImages);
router.get('/:id', getImage);
router.post('/', protect, createImage);

export default router;