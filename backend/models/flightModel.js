import mongoose from 'mongoose';

const flightSchema = new mongoose.Schema({
    flightNumber: {
        type: String,
        required: true,
        unique: true
    },
    airline: {
        type: String,
        required: true
    },
    departureAirport: {
        type: String,
        required: true
    },
    arrivalAirport: {
        type: String,
        required: true
    },
    departureTime: {
        type: Date,
        required: true
    },
    arrivalTime: {
        type: Date,
        required: true
    },
    price: {
        economy: {
            type: Number,
            required: true
        },
        business: {
            type: Number,
            required: true
        },
        firstClass: {
            type: Number,
            required: true
        }
    },
    seatsAvailable: {
        economy: {
            type: Number,
            required: true
        },
        business: {
            type: Number,
            required: true
        },
        firstClass: {
            type: Number,
            required: true
        }
    }
});

const Flight = mongoose.model('Flight', flightSchema);
export default Flight;