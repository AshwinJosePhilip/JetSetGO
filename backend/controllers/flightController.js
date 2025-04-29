import Flight from '../models/flightModel.js';
import asyncHandler from 'express-async-handler';

// @desc    Get all flights
// @route   GET /api/flights
// @access  Public
export const getFlights = asyncHandler(async (req, res) => {
    const flights = await Flight.find({}).sort({ departureTime: 1 });
    res.json(flights);
});

// @desc    Create a new flight
// @route   POST /api/flights
// @access  Private/Admin
export const createFlight = asyncHandler(async (req, res) => {
    const {
        flightNumber,
        airline,
        departureAirport,
        arrivalAirport,
        departureTime,
        arrivalTime,
        price,
        seatsAvailable
    } = req.body;

    // Basic validation
    if (!flightNumber || !airline || !departureAirport || !arrivalAirport || 
        !departureTime || !arrivalTime || !price || !seatsAvailable) {
        res.status(400);
        throw new Error('Please provide all required fields');
    }

    const flightExists = await Flight.findOne({ flightNumber });
    if (flightExists) {
        res.status(400);
        throw new Error('Flight number already exists');
    }

    const flight = await Flight.create({
        flightNumber,
        airline,
        departureAirport,
        arrivalAirport,
        departureTime,
        arrivalTime,
        price,
        seatsAvailable
    });

    if (flight) {
        res.status(201).json(flight);
    } else {
        res.status(400);
        throw new Error('Invalid flight data');
    }
});

// @desc    Update a flight
// @route   PUT /api/flights/:id
// @access  Private/Admin
export const updateFlight = asyncHandler(async (req, res) => {
    const flight = await Flight.findById(req.params.id);

    if (!flight) {
        res.status(404);
        throw new Error('Flight not found');
    }

    // If updating flight number, check if new number already exists
    if (req.body.flightNumber && req.body.flightNumber !== flight.flightNumber) {
        const flightExists = await Flight.findOne({ flightNumber: req.body.flightNumber });
        if (flightExists) {
            res.status(400);
            throw new Error('Flight number already exists');
        }
    }

    const updatedFlight = await Flight.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );

    res.json(updatedFlight);
});

// @desc    Delete a flight
// @route   DELETE /api/flights/:id
// @access  Private/Admin
export const deleteFlight = asyncHandler(async (req, res) => {
    const flight = await Flight.findById(req.params.id);

    if (!flight) {
        res.status(404);
        throw new Error('Flight not found');
    }

    await flight.deleteOne();
    res.json({ message: 'Flight removed' });
});

// @desc    Search flights
// @route   GET /api/flights/search
// @access  Public
export const searchFlights = async (req, res) => {
    try {
        const {
            departureAirport,
            arrivalAirport,
            departureDate,
            returnDate,
            cabinClass = 'Economy',
            passengers = 1
        } = req.query;

        // Validate required parameters
        if (!departureAirport || !arrivalAirport || !departureDate) {
            return res.status(400).json({ 
                message: 'Please provide departureAirport, arrivalAirport, and departureDate' 
            });
        }

        // Create date range for departure (entire day)
        const startDate = new Date(departureDate);
        startDate.setUTCHours(0, 0, 0, 0);
        
        const endDate = new Date(departureDate);
        endDate.setUTCHours(23, 59, 59, 999);

        // Base query
        const query = {
            departureTime: {
                $gte: startDate,
                $lte: endDate
            },
            departureAirport: departureAirport,
            arrivalAirport: arrivalAirport
        };

        // Map the frontend cabin class names to the database format
        const cabinClassMap = {
            'Economy': 'economy',
            'Business': 'business',
            'First Class': 'firstClass'
        };

        // Get the correct cabin class key
        const dbCabinClass = cabinClassMap[cabinClass];
        if (!dbCabinClass) {
            return res.status(400).json({ 
                message: 'Invalid cabin class. Must be one of: Economy, Business, First Class' 
            });
        }

        // Add seats availability check based on cabin class
        query[`seatsAvailable.${dbCabinClass}`] = { $gte: parseInt(passengers) || 1 };

        const flights = await Flight.find(query).sort('departureTime');
        res.json(flights);
    } catch (error) {
        console.error('Flight search error:', error);
        res.status(500).json({ message: error.message });
    }
};

// Get sample flights data
export const getSampleFlights = async (req, res) => {
    try {
        const sampleFlights = [
            {
                flightNumber: "JG301",
                airline: "JetSetGo Airways",
                departureAirport: "John F. Kennedy International Airport (JFK)",
                arrivalAirport: "Los Angeles International Airport (LAX)",
                departureTime: new Date("2025-07-05T09:00:00Z"),
                arrivalTime: new Date("2025-07-05T12:30:00Z"),
                price: {
                    economy: 155,
                    business: 365,
                    firstClass: 610
                },
                seatsAvailable: {
                    economy: 48,
                    business: 22,
                    firstClass: 9
                }
            },
            {
                flightNumber: "JG302",
                airline: "JetSetGo Airways",
                departureAirport: "Los Angeles International Airport (LAX)",
                arrivalAirport: "John F. Kennedy International Airport (JFK)",
                departureTime: new Date("2025-07-05T16:00:00Z"),
                arrivalTime: new Date("2025-07-05T23:00:00Z"),
                price: {
                    economy: 165,
                    business: 375,
                    firstClass: 630
                },
                seatsAvailable: {
                    economy: 58,
                    business: 24,
                    firstClass: 11
                }
            },
            {
                flightNumber: "JG303",
                airline: "JetSetGo Airways",
                departureAirport: "Chicago O'Hare International Airport (ORD)",
                arrivalAirport: "Miami International Airport (MIA)",
                departureTime: new Date("2025-07-07T11:30:00Z"),
                arrivalTime: new Date("2025-07-07T15:30:00Z"),
                price: {
                    economy: 150,
                    business: 340,
                    firstClass: 590
                },
                seatsAvailable: {
                    economy: 53,
                    business: 21,
                    firstClass: 10
                }
            },
            {
                flightNumber: "JG304",
                airline: "JetSetGo Airways",
                departureAirport: "San Francisco International Airport (SFO)",
                arrivalAirport: "Chicago O'Hare International Airport (ORD)",
                departureTime: new Date("2025-07-08T08:00:00Z"),
                arrivalTime: new Date("2025-07-08T12:00:00Z"),
                price: {
                    economy: 160,
                    business: 350,
                    firstClass: 605
                },
                seatsAvailable: {
                    economy: 50,
                    business: 20,
                    firstClass: 9
                }
            },
            {
                flightNumber: "JG305",
                airline: "JetSetGo Airways",
                departureAirport: "Miami International Airport (MIA)",
                arrivalAirport: "Los Angeles International Airport (LAX)",
                departureTime: new Date("2025-07-09T13:00:00Z"),
                arrivalTime: new Date("2025-07-09T18:30:00Z"),
                price: {
                    economy: 150,
                    business: 330,
                    firstClass: 570
                },
                seatsAvailable: {
                    economy: 62,
                    business: 25,
                    firstClass: 12
                }
            }
        ];

        // Check if flights already exist
        const existingFlights = await Flight.find({});
        if (existingFlights.length === 0) {
            await Flight.insertMany(sampleFlights);
            res.json({ 
                message: 'Sample flights data initialized successfully',
                count: sampleFlights.length
            });
        } else {
            res.json({ 
                message: 'Flights data already exists',
                count: existingFlights.length
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};