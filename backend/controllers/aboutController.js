import About from '../models/aboutModel.js';
import asyncHandler from 'express-async-handler';

// @desc    Get latest about content
// @route   GET /api/about
// @access  Public
export const getAboutContent = asyncHandler(async (req, res) => {
    const content = await About.findOne({ isActive: true });
    
    if (!content) {
        // Create default content if none exists
        const defaultContent = await About.create({
            title: 'About JetSetGo',
            content: 'Your premier flight booking platform.',
            isActive: true
        });
        return res.json(defaultContent);
    }
    
    res.json(content);
});

// @desc    Get all about content entries
// @route   GET /api/about/all
// @access  Private/Admin
export const getAllContent = asyncHandler(async (req, res) => {
    const contents = await About.find().sort({ createdAt: -1 });
    res.json(contents);
});

// @desc    Create new about content
// @route   POST /api/about
// @access  Private/Admin
export const createContent = asyncHandler(async (req, res) => {
    const { title, content, image } = req.body;

    if (!title || !content) {
        res.status(400);
        throw new Error('Title and content are required');
    }

    const newContent = await About.create({
        title,
        content,
        image,
        isActive: false
    });

    res.status(201).json(newContent);
});

// @desc    Update about content
// @route   PUT /api/about/:id
// @access  Private/Admin
export const updateContent = asyncHandler(async (req, res) => {
    const { title, content, image } = req.body;
    const aboutContent = await About.findById(req.params.id);

    if (!aboutContent) {
        res.status(404);
        throw new Error('Content not found');
    }

    aboutContent.title = title || aboutContent.title;
    aboutContent.content = content || aboutContent.content;
    if (image !== undefined) {
        aboutContent.image = image;
    }

    const updatedContent = await aboutContent.save();
    res.json(updatedContent);
});

// @desc    Delete about content
// @route   DELETE /api/about/:id
// @access  Private/Admin
export const deleteContent = asyncHandler(async (req, res) => {
    const aboutContent = await About.findById(req.params.id);

    if (!aboutContent) {
        res.status(404);
        throw new Error('Content not found');
    }

    await aboutContent.deleteOne();
    res.json({ message: 'Content removed' });
});

// @desc    Set content as active
// @route   PUT /api/about/:id/set-active
// @access  Private/Admin
export const setActiveContent = asyncHandler(async (req, res) => {
    const contentToActivate = await About.findById(req.params.id);

    if (!contentToActivate) {
        res.status(404);
        throw new Error('Content not found');
    }

    // Deactivate all other content
    await About.updateMany({}, { isActive: false });

    // Set the selected content as active
    contentToActivate.isActive = true;
    const updatedContent = await contentToActivate.save();
    res.json(updatedContent);
});