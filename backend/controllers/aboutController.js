import About from '../models/aboutModel.js';

// @desc    Get latest about content
// @route   GET /api/about
// @access  Public
export const getAboutContent = async (req, res) => {
    try {
        let content = await About.findOne().sort({ createdAt: -1 });
        
        if (!content) {
            content = await About.create({
                title: 'About JetSetGo',
                content: 'JetSetGo is your ultimate flight booking companion. We make travel planning seamless and enjoyable, offering the best deals on flights worldwide.'
            });
        }
        
        res.json(content);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all about content entries
// @route   GET /api/about/all
// @access  Private (admin only)
export const getAllContent = async (req, res) => {
    try {
        const contents = await About.find().sort({ createdAt: -1 });
        res.json(contents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new about content
// @route   POST /api/about
// @access  Private (admin only)
export const createContent = async (req, res) => {
    try {
        const { title, content } = req.body;
        const newContent = await About.create({ title, content });
        res.status(201).json(newContent);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update about content
// @route   PUT /api/about/:id
// @access  Private (admin only)
export const updateContent = async (req, res) => {
    try {
        const { title, content } = req.body;
        const updatedContent = await About.findByIdAndUpdate(
            req.params.id,
            { title, content },
            { new: true }
        );
        
        if (!updatedContent) {
            return res.status(404).json({ message: 'Content not found' });
        }
        
        res.json(updatedContent);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete about content
// @route   DELETE /api/about/:id
// @access  Private (admin only)
export const deleteContent = async (req, res) => {
    try {
        const content = await About.findByIdAndDelete(req.params.id);
        
        if (!content) {
            return res.status(404).json({ message: 'Content not found' });
        }
        
        res.json({ message: 'Content deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};