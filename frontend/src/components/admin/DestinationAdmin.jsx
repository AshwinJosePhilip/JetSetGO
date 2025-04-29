import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  Paper,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Snackbar,
  Alert
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const DestinationAdmin = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingDestination, setEditingDestination] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
    price: '',
    image: ''
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate('/');
      return;
    }
    fetchDestinations();
  }, [isAuthenticated, isAdmin, navigate]);

  const fetchDestinations = async () => {
    try {
      const { data } = await axios.get('/api/destinations');
      setDestinations(data);
    } catch (error) {
      showSnackbar('Failed to fetch destinations', 'error');
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        showSnackbar('Please upload an image file', 'error');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showSnackbar('Image size should be less than 5MB', 'error');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        // Make sure we're using a valid base64 image string
        if (base64String.startsWith('data:image')) {
          setFormData({
            ...formData,
            image: base64String
          });
        } else {
          showSnackbar('Invalid image format', 'error');
        }
      };
      reader.onerror = () => {
        showSnackbar('Error reading file', 'error');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        showSnackbar('Not authorized - no token found', 'error');
        return;
      }

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      };

      console.log('Submitting with data:', formData);
      console.log('Config:', config);

      if (editingDestination) {
        console.log('Updating destination:', editingDestination._id);
        // Fix: Add proper base URL for the API endpoint
        const response = await axios.put(`${process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000'}/api/destinations/${editingDestination._id}`, formData, config);
        console.log('Update response:', response);
        showSnackbar('Destination updated successfully', 'success');
      } else {
        const response = await axios.post('/api/destinations', formData, config);
        console.log('Create response:', response);
        showSnackbar('Destination created successfully', 'success');
      }
      
      setOpenDialog(false);
      setEditingDestination(null);
      setFormData({ name: '', location: '', description: '', price: '', image: '' });
      fetchDestinations();
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to save destination';
      showSnackbar(errorMessage, 'error');
    }
  };

  const handleEdit = (destination) => {
    setEditingDestination(destination);
    setFormData({
      name: destination.name,
      location: destination.location,
      description: destination.description,
      price: destination.price,
      image: destination.image
    });
    setOpenDialog(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this destination?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/destinations/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        showSnackbar('Destination deleted successfully', 'success');
        fetchDestinations();
      } catch (error) {
        showSnackbar('Failed to delete destination', 'error');
      }
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return 'https://placehold.co/600x400/000000/FF8000?text=No+Image';
    return imageUrl.startsWith('data:') ? imageUrl : `${process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000'}${imageUrl}`;
  };

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <Container sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ color: '#FF8000' }}>
          Manage Popular Destinations
        </Typography>
        <Button
          variant="contained"
          sx={{
            bgcolor: '#FF8000',
            '&:hover': { bgcolor: '#e67300' }
          }}
          onClick={() => {
            setEditingDestination(null);
            setFormData({ name: '', location: '', description: '', price: '', image: '' });
            setOpenDialog(true);
          }}
        >
          Add New Destination
        </Button>
      </Box>

      <Grid container spacing={3}>
        {destinations.map((destination) => (
          <Grid xs={12} lg={4} md={4} sm={6} key={destination._id}>
            <Card sx={{ 
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              bgcolor: '#1a1a1a',
              border: '1px solid #FF8000'
            }}>
              <CardMedia
                component="img"
                height="200"
                image={getImageUrl(destination.image)}
                alt={destination.name}
                sx={{ objectFit: 'cover' }}
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://placehold.co/600x400/000000/FF8000?text=No+Image';
                }}
              />
              <CardContent sx={{ flexGrow: 1, color: 'white' }}>
                <Typography variant="h6" sx={{ color: '#FF8000' }}>
                  {destination.name}
                </Typography>
                <Typography sx={{ mb: 1 }}>
                  {destination.location}
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {destination.description}
                </Typography>
                <Typography sx={{ color: '#FF8000', fontWeight: 'bold' }}>
                  ${destination.price}
                </Typography>
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                  <IconButton 
                    onClick={() => handleEdit(destination)}
                    sx={{ color: '#FF8000' }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    onClick={() => handleDelete(destination._id)}
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
          {editingDestination ? 'Edit Destination' : 'Add New Destination'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
              InputLabelProps={{ sx: { color: '#FF8000' } }}
              InputProps={{ sx: { color: 'white' } }}
            />
            <TextField
              fullWidth
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
              InputLabelProps={{ sx: { color: '#FF8000' } }}
              InputProps={{ sx: { color: 'white' } }}
            />
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              multiline
              rows={4}
              sx={{ mb: 2 }}
              InputLabelProps={{ sx: { color: '#FF8000' } }}
              InputProps={{ sx: { color: 'white' } }}
            />
            <TextField
              fullWidth
              label="Price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
              InputLabelProps={{ sx: { color: '#FF8000' } }}
              InputProps={{ sx: { color: 'white' } }}
            />
            <input
              accept="image/*"
              type="file"
              onChange={handleImageChange}
              style={{ color: 'white' }}
            />
            {formData.image && (
              <Box sx={{ mt: 2 }}>
                <img 
                  src={formData.image} 
                  alt="Preview" 
                  style={{ maxWidth: '100%', maxHeight: '200px' }} 
                />
              </Box>
            )}
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
            {editingDestination ? 'Update' : 'Create'}
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

export default DestinationAdmin;