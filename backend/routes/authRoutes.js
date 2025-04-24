import express from 'express';
import { registerUser, loginUser, initializeAdmin } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/init-admin', initializeAdmin);

export default router;