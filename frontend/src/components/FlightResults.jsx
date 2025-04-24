import React, { useState } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  Grid
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const FlightResults = ({ flights, searchParams }) => {
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleBooking = async () => {
    if (!isAuthenticated) {
      setSnackbar({
        open: true,
        message: 'Please login to book a flight',
        severity: 'warning'
      });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const bookingData = {
        flight: selectedFlight._id,
        passengers: {
          adults: parseInt(searchParams.adults),
          children: parseInt(searchParams.children)
        },
        cabinClass: searchParams.cabinClass.toLowerCase().replace(' ', ''),
        totalPrice: calculateTotalPrice()
      };

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      };

      const { data } = await axios.post('/api/bookings', bookingData, config);
      setOpenDialog(false);
      setSnackbar({
        open: true,
        message: 'Flight booked successfully!',
        severity: 'success'
      });
      
      // Navigate to profile page to see bookings
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Error booking flight',
        severity: 'error'
      });
    }
  };

  const calculateTotalPrice = () => {
    if (!selectedFlight || !searchParams) return 0;
    const basePrice = selectedFlight.price[searchParams.cabinClass.toLowerCase().replace(' ', '')];
    return basePrice * (parseInt(searchParams.adults) + parseInt(searchParams.children));
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Box sx={{ p: 3, bgcolor: '#000000', minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ mb: 3, color: '#FF8000' }}>
        Available Flights
      </Typography>

      {flights.length === 0 ? (
        <Alert severity="info">No flights found for your search criteria.</Alert>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {flights.map((flight) => (
            <Card 
              key={flight._id}
              sx={{ 
                bgcolor: '#1a1a1a',
                border: '1px solid #FF8000',
                '&:hover': { borderColor: '#ff9933' }
              }}
            >
              <CardContent>
                <Box>
                  <Typography variant="h6" sx={{ color: '#FF8000', mb: 2 }}>
                    {flight.airline} - Flight {flight.flightNumber}
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography sx={{ color: 'white' }}>
                        From: {flight.departureAirport}
                      </Typography>
                      <Typography sx={{ color: 'white' }}>
                        To: {flight.arrivalAirport}
                      </Typography>
                      <Typography sx={{ color: 'white', mt: 1 }}>
                        Departure: {formatDateTime(flight.departureTime)}
                      </Typography>
                      <Typography sx={{ color: 'white' }}>
                        Arrival: {formatDateTime(flight.arrivalTime)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography sx={{ color: '#FF8000', mb: 1 }}>
                        Available Fares:
                      </Typography>
                      <Typography sx={{ color: 'white' }}>
                        Economy: ${flight.price.economy}
                      </Typography>
                      <Typography sx={{ color: 'white' }}>
                        Premium Economy: ${flight.price.premiumEconomy}
                      </Typography>
                      <Typography sx={{ color: 'white' }}>
                        Business: ${flight.price.business}
                      </Typography>
                      <Typography sx={{ color: 'white' }}>
                        First Class: ${flight.price.firstClass}
                      </Typography>
                      <Button 
                        variant="contained"
                        sx={{ 
                          bgcolor: '#FF8000',
                          '&:hover': { bgcolor: '#e67300' },
                          mt: 2
                        }}
                        onClick={() => {
                          setSelectedFlight(flight);
                          setOpenDialog(true);
                        }}
                      >
                        Book Now
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {/* Booking Confirmation Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        PaperProps={{
          sx: {
            bgcolor: '#1a1a1a',
            border: '1px solid #FF8000'
          }
        }}
      >
        <DialogTitle sx={{ color: '#FF8000' }}>Confirm Booking</DialogTitle>
        <DialogContent>
          {selectedFlight && (
            <Box sx={{ color: 'white' }}>
              <Typography variant="h6" sx={{ color: '#FF8000', mb: 2 }}>
                Flight Details
              </Typography>
              <Typography>Flight Number: {selectedFlight.flightNumber}</Typography>
              <Typography>From: {selectedFlight.departureAirport}</Typography>
              <Typography>To: {selectedFlight.arrivalAirport}</Typography>
              <Typography>Departure: {formatDateTime(selectedFlight.departureTime)}</Typography>
              <Typography>Class: {searchParams.cabinClass}</Typography>
              <Typography>Passengers: {parseInt(searchParams.adults) + parseInt(searchParams.children)}</Typography>
              <Typography sx={{ color: '#FF8000', mt: 2, fontWeight: 'bold' }}>
                Total Price: ${calculateTotalPrice()}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenDialog(false)}
            sx={{ color: '#FF8000' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleBooking}
            variant="contained"
            sx={{ 
              bgcolor: '#FF8000',
              '&:hover': { bgcolor: '#e67300' }
            }}
          >
            Confirm Booking
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FlightResults;