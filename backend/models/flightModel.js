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
        premiumEconomy: {
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
            required: true,
            default: 150
        },
        premiumEconomy: {
            type: Number,
            required: true,
            default: 50
        },
        business: {
            type: Number,
            required: true,
            default: 30
        },
        firstClass: {
            type: Number,
            required: true,
            default: 10
        }
    }
}, {
    timestamps: true
});

const Flight = mongoose.model('Flight', flightSchema);
export default Flight;