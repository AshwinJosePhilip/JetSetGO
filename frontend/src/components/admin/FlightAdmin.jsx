import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Snackbar,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const FlightAdmin = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [flights, setFlights] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingFlight, setEditingFlight] = useState(null);
  const [formData, setFormData] = useState({
    flightNumber: '',
    airline: '',
    departureAirport: '',
    arrivalAirport: '',
    departureTime: '',
    arrivalTime: '',
    price: {
      economy: '',
      business: '',
      firstClass: ''
    },
    seatsAvailable: {
      economy: '',
      business: '',
      firstClass: ''
    }
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const airports = [
    'John F. Kennedy International Airport (JFK)',
    'Los Angeles International Airport (LAX)',
    'San Francisco International Airport (SFO)',
    'Chicago O\'Hare International Airport (ORD)',
    'Miami International Airport (MIA)'
  ];

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate('/');
      return;
    }
    fetchFlights();
  }, [isAuthenticated, isAdmin, navigate]);

  const fetchFlights = async () => {
    try {
      const { data } = await axios.get('/api/flights');
      setFlights(data);
    } catch (error) {
      showSnackbar('Failed to fetch flights', 'error');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [category, field] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [category]: {
          ...prev[category],
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      };

      // Convert string prices and seats to numbers
      const processedData = {
        ...formData,
        price: {
          economy: Number(formData.price.economy),
          business: Number(formData.price.business),
          firstClass: Number(formData.price.firstClass)
        },
        seatsAvailable: {
          economy: Number(formData.seatsAvailable.economy),
          business: Number(formData.seatsAvailable.business),
          firstClass: Number(formData.seatsAvailable.firstClass)
        }
      };

      if (editingFlight) {
        await axios.put(`/api/flights/${editingFlight._id}`, processedData, config);
        showSnackbar('Flight updated successfully', 'success');
      } else {
        await axios.post('/api/flights', processedData, config);
        showSnackbar('Flight created successfully', 'success');
      }
      
      setOpenDialog(false);
      setEditingFlight(null);
      resetForm();
      fetchFlights();
    } catch (error) {
      showSnackbar(error.response?.data?.message || 'Failed to save flight', 'error');
    }
  };

  const handleEdit = (flight) => {
    setEditingFlight(flight);
    setFormData({
      flightNumber: flight.flightNumber,
      airline: flight.airline,
      departureAirport: flight.departureAirport,
      arrivalAirport: flight.arrivalAirport,
      departureTime: new Date(flight.departureTime).toISOString().slice(0, 16),
      arrivalTime: new Date(flight.arrivalTime).toISOString().slice(0, 16),
      price: {
        economy: flight.price.economy,
        business: flight.price.business,
        firstClass: flight.price.firstClass
      },
      seatsAvailable: {
        economy: flight.seatsAvailable.economy,
        business: flight.seatsAvailable.business,
        firstClass: flight.seatsAvailable.firstClass
      }
    });
    setOpenDialog(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this flight?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/flights/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        showSnackbar('Flight deleted successfully', 'success');
        fetchFlights();
      } catch (error) {
        showSnackbar('Failed to delete flight', 'error');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      flightNumber: '',
      airline: '',
      departureAirport: '',
      arrivalAirport: '',
      departureTime: '',
      arrivalTime: '',
      price: {
        economy: '',
        business: '',
        firstClass: ''
      },
      seatsAvailable: {
        economy: '',
        business: '',
        firstClass: ''
      }
    });
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <Container sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ color: '#FF8000' }}>
          Manage Flights
        </Typography>
        <Button
          variant="contained"
          sx={{
            bgcolor: '#FF8000',
            '&:hover': { bgcolor: '#e67300' }
          }}
          onClick={() => {
            setEditingFlight(null);
            resetForm();
            setOpenDialog(true);
          }}
        >
          Add New Flight
        </Button>
      </Box>

      <Grid container spacing={3}>
        {flights.map((flight) => (
          <Grid item xs={12} md={6} key={flight._id}>
            <Card sx={{ 
              height: '100%',
              bgcolor: '#1a1a1a',
              border: '1px solid #FF8000'
            }}>
              <CardContent sx={{ color: 'white' }}>
                <Typography variant="h6" sx={{ color: '#FF8000', mb: 2 }}>
                  {flight.airline} - Flight {flight.flightNumber}
                </Typography>
                <Typography>From: {flight.departureAirport}</Typography>
                <Typography>To: {flight.arrivalAirport}</Typography>
                <Typography>
                  Departure: {new Date(flight.departureTime).toLocaleString()}
                </Typography>
                <Typography>
                  Arrival: {new Date(flight.arrivalTime).toLocaleString()}
                </Typography>
                
                <Box sx={{ mt: 2 }}>
                  <Typography sx={{ color: '#FF8000' }}>Prices:</Typography>
                  <Typography>Economy: ${flight.price.economy}</Typography>
                  <Typography>Business: ${flight.price.business}</Typography>
                  <Typography>First Class: ${flight.price.firstClass}</Typography>
                </Box>

                <Box sx={{ mt: 2 }}>
                  <Typography sx={{ color: '#FF8000' }}>Available Seats:</Typography>
                  <Typography>Economy: {flight.seatsAvailable.economy}</Typography>
                  <Typography>Business: {flight.seatsAvailable.business}</Typography>
                  <Typography>First Class: {flight.seatsAvailable.firstClass}</Typography>
                </Box>

                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                  <IconButton 
                    onClick={() => handleEdit(flight)}
                    sx={{ color: '#FF8000' }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    onClick={() => handleDelete(flight._id)}
                    sx={{ color: '#FF8000' }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: '#1a1a1a',
            border: '1px solid #FF8000'
          }
        }}
      >
        <DialogTitle sx={{ color: '#FF8000' }}>
          {editingFlight ? 'Edit Flight' : 'Add New Flight'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Flight Number"
                  name="flightNumber"
                  value={formData.flightNumber}
                  onChange={handleInputChange}
                  InputLabelProps={{ sx: { color: '#FF8000' } }}
                  InputProps={{ sx: { color: 'white' } }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Airline"
                  name="airline"
                  value={formData.airline}
                  onChange={handleInputChange}
                  InputLabelProps={{ sx: { color: '#FF8000' } }}
                  InputProps={{ sx: { color: 'white' } }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: '#FF8000' }}>Departure Airport</InputLabel>
                  <Select
                    name="departureAirport"
                    value={formData.departureAirport}
                    onChange={handleInputChange}
                    sx={{ color: 'white' }}
                  >
                    {airports.map((airport) => (
                      <MenuItem key={airport} value={airport}>
                        {airport}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: '#FF8000' }}>Arrival Airport</InputLabel>
                  <Select
                    name="arrivalAirport"
                    value={formData.arrivalAirport}
                    onChange={handleInputChange}
                    sx={{ color: 'white' }}
                  >
                    {airports.filter(airport => airport !== formData.departureAirport).map((airport) => (
                      <MenuItem key={airport} value={airport}>
                        {airport}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Departure Time"
                  name="departureTime"
                  type="datetime-local"
                  value={formData.departureTime}
                  onChange={handleInputChange}
                  InputLabelProps={{ sx: { color: '#FF8000' }, shrink: true }}
                  InputProps={{ sx: { color: 'white' } }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Arrival Time"
                  name="arrivalTime"
                  type="datetime-local"
                  value={formData.arrivalTime}
                  onChange={handleInputChange}
                  InputLabelProps={{ sx: { color: '#FF8000' }, shrink: true }}
                  InputProps={{ sx: { color: 'white' } }}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography sx={{ color: '#FF8000', mt: 2, mb: 1 }}>Prices</Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Economy Price"
                  name="price.economy"
                  type="number"
                  value={formData.price.economy}
                  onChange={handleInputChange}
                  InputLabelProps={{ sx: { color: '#FF8000' } }}
                  InputProps={{ sx: { color: 'white' } }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Business Price"
                  name="price.business"
                  type="number"
                  value={formData.price.business}
                  onChange={handleInputChange}
                  InputLabelProps={{ sx: { color: '#FF8000' } }}
                  InputProps={{ sx: { color: 'white' } }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="First Class Price"
                  name="price.firstClass"
                  type="number"
                  value={formData.price.firstClass}
                  onChange={handleInputChange}
                  InputLabelProps={{ sx: { color: '#FF8000' } }}
                  InputProps={{ sx: { color: 'white' } }}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography sx={{ color: '#FF8000', mt: 2, mb: 1 }}>Available Seats</Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Economy Seats"
                  name="seatsAvailable.economy"
                  type="number"
                  value={formData.seatsAvailable.economy}
                  onChange={handleInputChange}
                  InputLabelProps={{ sx: { color: '#FF8000' } }}
                  InputProps={{ sx: { color: 'white' } }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Business Seats"
                  name="seatsAvailable.business"
                  type="number"
                  value={formData.seatsAvailable.business}
                  onChange={handleInputChange}
                  InputLabelProps={{ sx: { color: '#FF8000' } }}
                  InputProps={{ sx: { color: 'white' } }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="First Class Seats"
                  name="seatsAvailable.firstClass"
                  type="number"
                  value={formData.seatsAvailable.firstClass}
                  onChange={handleInputChange}
                  InputLabelProps={{ sx: { color: '#FF8000' } }}
                  InputProps={{ sx: { color: 'white' } }}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenDialog(false)}
            sx={{ color: '#FF8000' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{
              bgcolor: '#FF8000',
              '&:hover': { bgcolor: '#e67300' }
            }}
          >
            {editingFlight ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default FlightAdmin;