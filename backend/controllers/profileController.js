import User from '../models/userModel.js';
import asyncHandler from 'express-async-handler';
import multer from 'multer';
import path from 'path';

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: 'uploads/profiles/',
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

export const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        }
        cb(new Error('Images only!'));
    }
});

// @desc    Update user profile
// @route   PUT /api/profile
// @access  Private
export const updateProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    
    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        
        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            profilePicture: updatedUser.profilePicture
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Upload profile picture
// @route   POST /api/profile/upload
// @access  Private
export const uploadProfilePicture = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    
    if (user) {
        if (req.file) {
            user.profilePicture = `/uploads/profiles/${req.file.filename}`;
            const updatedUser = await user.save();
            res.json({
                _id: updatedUser._id,
                profilePicture: updatedUser.profilePicture
            });
        } else {
            res.status(400);
            throw new Error('No file uploaded');
        }
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});