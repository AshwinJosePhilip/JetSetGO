const express = require('express');
const router = express.Router();
const AboutUs = require('../models/AboutUs');
const { protect, admin } = require('../middleware/authMiddleware');

// Public route to get the latest about us content
router.get('/', async (req, res) => {
    try {
        const content = await AboutUs.findOne().sort({ createdAt: -1 });
        if (!content) {
            return res.status(404).json({ message: 'No content found' });
        }
        res.json(content);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Protected admin routes
// Create new about us content
router.post('/', protect, admin, async (req, res) => {
    try {
        const { title, content } = req.body;
        if (!title || !content) {
            return res.status(400).json({ message: 'Title and content are required' });
        }

        const newAboutUs = await AboutUs.create({
            title,
            content
        });

        res.status(201).json(newAboutUs);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Update about us content
router.put('/:id', protect, admin, async (req, res) => {
    try {
        const { title, content } = req.body;
        const aboutUs = await AboutUs.findById(req.params.id);

        if (!aboutUs) {
            return res.status(404).json({ message: 'Content not found' });
        }

        aboutUs.title = title || aboutUs.title;
        aboutUs.content = content || aboutUs.content;

        const updatedAboutUs = await aboutUs.save();
        res.json(updatedAboutUs);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Delete about us content
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const aboutUs = await AboutUs.findById(req.params.id);

        if (!aboutUs) {
            return res.status(404).json({ message: 'Content not found' });
        }

        await aboutUs.remove();
        res.json({ message: 'Content deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get all about us content (for admin dashboard)
router.get('/all', protect, admin, async (req, res) => {
    try {
        const contents = await AboutUs.find().sort({ createdAt: -1 });
        res.json(contents);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;