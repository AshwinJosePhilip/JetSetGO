import express from 'express';
import { updateProfile, uploadProfilePicture, deleteProfilePicture, upload } from '../controllers/profileController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.put('/', protect, updateProfile);
router.post('/upload', protect, upload.single('profilePicture'), uploadProfilePicture);
router.delete('/picture', protect, deleteProfilePicture);

export default router;