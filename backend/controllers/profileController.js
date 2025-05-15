import User from '../models/userModel.js';
import asyncHandler from 'express-async-handler';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure upload directory exists
const uploadDir = 'uploads/profiles';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Create a unique filename with user ID and timestamp
        const uniqueSuffix = `${req.user._id}-${Date.now()}`;
        const extension = path.extname(file.originalname);
        cb(null, `profile-${uniqueSuffix}${extension}`);
    }
});

export const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        }
        cb(new Error('Only JPEG, JPG and PNG images are allowed'));
    }
});

// Helper function to delete old profile picture
const deleteOldProfilePicture = async (filePath) => {
    if (!filePath) return;
    
    const absolutePath = path.join(process.cwd(), filePath.replace(/^\//, ''));
    try {
        if (fs.existsSync(absolutePath)) {
            await fs.promises.unlink(absolutePath);
        }
    } catch (error) {
        console.error('Error deleting old profile picture:', error);
    }
};

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
            // Delete old profile picture if it exists
            if (user.profilePicture) {
                await deleteOldProfilePicture(user.profilePicture);
            }

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

// @desc    Delete profile picture
// @route   DELETE /api/profile/picture
// @access  Private
export const deleteProfilePicture = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    
    if (user) {
        if (user.profilePicture) {
            await deleteOldProfilePicture(user.profilePicture);
        }
        
        user.profilePicture = null;
        const updatedUser = await user.save();
        res.json({
            _id: updatedUser._id,
            profilePicture: updatedUser.profilePicture
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});