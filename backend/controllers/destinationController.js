import Destination from '../models/destinationModel.js';
import asyncHandler from 'express-async-handler';

// @desc    Get all destinations
// @route   GET /api/destinations
// @access  Public
export const getDestinations = asyncHandler(async (req, res) => {
    const destinations = await Destination.find({});
    res.json(destinations);
});

// @desc    Create a new destination
// @route   POST /api/destinations
// @access  Private/Admin
export const createDestination = asyncHandler(async (req, res) => {
    const { name, image, description, price, location } = req.body;

    if (!name || !description || !price || !location) {
        res.status(400);
        throw new Error('Please provide all required fields');
    }

    // Validate and ensure image is in base64 format
    if (image) {
        if (!image.startsWith('data:image')) {
            res.status(400);
            throw new Error('Invalid image format. Image must be in base64 format');
        }
    }

    const destination = await Destination.create({
        name,
        image,
        description,
        price,
        location
    });

    if (!destination) {
        res.status(500);
        throw new Error('Failed to create destination');
    }

    res.status(201).json(destination);
});

// @desc    Update a destination
// @route   PUT /api/destinations/:id
// @access  Private/Admin
export const updateDestination = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        console.log('Updating destination with ID:', id);
        console.log('Update data:', req.body);
        
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            res.status(400);
            throw new Error('Invalid destination ID format');
        }

        const destination = await Destination.findById(id);

        if (!destination) {
            res.status(404);
            throw new Error('Destination not found');
        }

        // Update individual fields
        destination.name = req.body.name || destination.name;
        destination.location = req.body.location || destination.location;
        destination.description = req.body.description || destination.description;
        destination.price = req.body.price || destination.price;
        
        // Validate base64 image if provided
        if (req.body.image !== undefined) {
            if (req.body.image && !req.body.image.startsWith('data:image')) {
                res.status(400);
                throw new Error('Invalid image format. Please provide a valid base64 image.');
            }
            destination.image = req.body.image;
        }

        const updatedDestination = await destination.save();
        console.log('Destination updated successfully:', updatedDestination);
        
        if (!updatedDestination) {
            res.status(500);
            throw new Error('Failed to update destination');
        }

        res.json(updatedDestination);
    } catch (error) {
        console.error('Update destination error:', error);
        res.status(error.status || 500).json({
            message: error.message || 'Error updating destination',
            error: process.env.NODE_ENV === 'development' ? error : undefined,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// @desc    Delete a destination
// @route   DELETE /api/destinations/:id
// @access  Private/Admin
export const deleteDestination = asyncHandler(async (req, res) => {
    const destination = await Destination.findById(req.params.id);

    if (!destination) {
        res.status(404);
        throw new Error('Destination not found');
    }

    await destination.deleteOne();
    res.json({ message: 'Destination removed' });
});