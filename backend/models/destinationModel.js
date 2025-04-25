import mongoose from 'mongoose';

const destinationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,        // Will store base64 string
        required: false      // Making it optional
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

// Add a validation for base64 image format
destinationSchema.path('image').validate(function(value) {
    if (!value) return true; // Allow empty values
    return value.startsWith('data:image');
}, 'Image must be in base64 format starting with "data:image"');

const Destination = mongoose.model('Destination', destinationSchema);
export default Destination;