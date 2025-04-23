import Destination from '../models/destinationModel.js';

// Get all destinations
const getDestinations = async (req, res) => {
    try {
        const destinations = await Destination.find({});
        res.json(destinations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a destination
const createDestination = async (req, res) => {
    try {
        const { name, image, description, price, location } = req.body;
        const destination = await Destination.create({
            name,
            image,
            description,
            price,
            location
        });
        res.status(201).json(destination);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export { getDestinations, createDestination };