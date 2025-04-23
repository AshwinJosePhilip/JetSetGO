import Image from '../models/imageModel.js';

// @desc    Get an image by ID
// @route   GET /api/images/:id
// @access  Public
export const getImage = async (req, res) => {
    try {
        const image = await Image.findById(req.params.id);
        if (!image) {
            return res.status(404).json({ message: 'Image not found' });
        }
        res.json(image);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all images
// @route   GET /api/images
// @access  Public
export const getAllImages = async (req, res) => {
    try {
        const images = await Image.find({});
        res.json(images);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new image
// @route   POST /api/images
// @access  Private
export const createImage = async (req, res) => {
    try {
        const { name, data, contentType } = req.body;
        const image = await Image.create({
            name,
            data,
            contentType
        });
        res.status(201).json(image);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};