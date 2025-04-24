import express from 'express';
import {
    getAboutContent,
    getAllContent,
    createContent,
    updateContent,
    deleteContent
} from '../controllers/aboutController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getAboutContent);

// Admin routes
router.get('/all', protect, admin, getAllContent);
router.post('/', protect, admin, createContent);
router.put('/:id', protect, admin, updateContent);
router.delete('/:id', protect, admin, deleteContent);

export default router;