import express from 'express';
import { getAboutContent, updateAboutContent } from '../controllers/aboutController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAboutContent);
router.put('/', protect, updateAboutContent);

export default router;