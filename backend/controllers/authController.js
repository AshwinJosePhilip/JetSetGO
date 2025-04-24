import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// @desc    Initialize admin user
// @route   POST /api/auth/init-admin
// @access  Public (should be removed in production)
export const initializeAdmin = async (req, res) => {
    try {
        const adminEmail = 'admin@jetsetgo.com';
        const adminExists = await User.findOne({ email: adminEmail });

        if (adminExists) {
            return res.status(400).json({ message: 'Admin user already exists' });
        }

        const admin = await User.create({
            name: 'Admin',
            email: adminEmail,
            password: 'admin123',
            isAdmin: true
        });

        res.status(201).json({
            message: 'Admin user created successfully',
            admin: {
                _id: admin._id,
                name: admin.name,
                email: admin.email,
                isAdmin: admin.isAdmin
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id)
            });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });

        // Check if user exists and password matches
        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};