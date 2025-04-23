import Booking from '../models/bookingModel.js';
import asyncHandler from 'express-async-handler';

// @desc    Get user's bookings
// @route   GET /api/bookings
// @access  Private
export const getUserBookings = asyncHandler(async (req, res) => {
    const bookings = await Booking.find({ user: req.user._id })
        .populate('flight')
        .sort('-bookingDate');
    res.json(bookings);
});

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
export const createBooking = asyncHandler(async (req, res) => {
    const { flight, passengers, cabinClass, totalPrice } = req.body;

    const booking = await Booking.create({
        user: req.user._id,
        flight,
        passengers,
        cabinClass,
        totalPrice
    });

    const populatedBooking = await booking.populate('flight');
    res.status(201).json(populatedBooking);
});

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
export const cancelBooking = asyncHandler(async (req, res) => {
    const booking = await Booking.findOne({
        _id: req.params.id,
        user: req.user._id
    });

    if (!booking) {
        res.status(404);
        throw new Error('Booking not found');
    }

    if (booking.status === 'cancelled') {
        res.status(400);
        throw new Error('Booking is already cancelled');
    }

    booking.status = 'cancelled';
    const updatedBooking = await booking.save();
    const populatedBooking = await updatedBooking.populate('flight');
    
    res.json(populatedBooking);
});