import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    flight: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Flight'
    },
    bookingDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    passengers: {
        adults: {
            type: Number,
            required: true
        },
        children: {
            type: Number,
            required: true,
            default: 0
        }
    },
    cabinClass: {
        type: String,
        required: true,
        enum: ['economy', 'business', 'firstClass']
    },
    totalPrice: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: 'confirmed',
        enum: ['confirmed', 'cancelled', 'completed']
    }
}, {
    timestamps: true
});

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;