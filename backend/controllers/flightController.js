import Flight from '../models/flightModel.js';

// Search flights based on criteria
export const searchFlights = async (req, res) => {
    try {
        const {
            departureAirport,
            arrivalAirport,
            departureDate,
            returnDate,
            cabinClass,
            passengers
        } = req.query;

        // Create date range for departure (entire day)
        const startDate = new Date(departureDate);
        const endDate = new Date(departureDate);
        endDate.setHours(23, 59, 59);

        // Base query
        const query = {
            departureAirport,
            arrivalAirport,
            departureTime: {
                $gte: startDate,
                $lte: endDate
            }
        };

        // Add seats availability check
        const cabinClassLower = cabinClass.toLowerCase().replace(' ', '');
        query[`seatsAvailable.${cabinClassLower}`] = { $gte: parseInt(passengers) };

        const flights = await Flight.find(query);
        res.json(flights);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get sample flights data
export const getSampleFlights = async (req, res) => {
    try {
        const sampleFlights = [
            {
                flightNumber: "JG101",
                airline: "JetSetGo Airways",
                departureAirport: "John F. Kennedy International Airport (JFK)",
                arrivalAirport: "Los Angeles International Airport (LAX)",
                departureTime: new Date("2025-04-24T10:00:00Z"),
                arrivalTime: new Date("2025-04-24T13:30:00Z"),
                price: {
                    economy: 300,
                    premiumEconomy: 450,
                    business: 800,
                    firstClass: 1200
                },
                seatsAvailable: {
                    economy: 150,
                    premiumEconomy: 50,
                    business: 30,
                    firstClass: 10
                }
            },
            {
                flightNumber: "JG102",
                airline: "JetSetGo Airways",
                departureAirport: "Los Angeles International Airport (LAX)",
                arrivalAirport: "John F. Kennedy International Airport (JFK)",
                departureTime: new Date("2025-04-24T15:00:00Z"),
                arrivalTime: new Date("2025-04-24T23:30:00Z"),
                price: {
                    economy: 320,
                    premiumEconomy: 470,
                    business: 850,
                    firstClass: 1300
                },
                seatsAvailable: {
                    economy: 150,
                    premiumEconomy: 50,
                    business: 30,
                    firstClass: 10
                }
            }
        ];

        // Check if flights already exist
        const existingFlights = await Flight.find({});
        if (existingFlights.length === 0) {
            await Flight.insertMany(sampleFlights);
        }

        res.json({ message: 'Sample flights data initialized successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};