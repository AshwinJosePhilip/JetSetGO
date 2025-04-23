import express from 'express';
import { updateProfile, uploadProfilePicture, upload } from '../controllers/profileController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.put('/', protect, updateProfile);
router.post('/upload', protect, upload.single('profilePicture'), uploadProfilePicture);

export default router;