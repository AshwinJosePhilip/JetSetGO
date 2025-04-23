import About from '../models/aboutModel.js';

// @desc    Get about content
// @route   GET /api/about
// @access  Public
export const getAboutContent = async (req, res) => {
    try {
        let content = await About.findOne();
        
        // If no content exists, create default content
        if (!content) {
            content = await About.create({
                title: 'About JetSetGo',
                description: 'JetSetGo is your ultimate flight booking companion. We make travel planning seamless and enjoyable, offering the best deals on flights worldwide.',
                image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=600&h=400&q=80'
            });
        }
        
        res.json(content);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update about content
// @route   PUT /api/about
// @access  Private (admin only)
export const updateAboutContent = async (req, res) => {
    try {
        const { title, description, image } = req.body;
        
        let content = await About.findOne();
        
        if (content) {
            content.title = title;
            content.description = description;
            content.image = image;
            await content.save();
        } else {
            content = await About.create({
                title,
                description,
                image
            });
        }
        
        res.json(content);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};