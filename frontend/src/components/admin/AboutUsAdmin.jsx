import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AboutUsAdmin = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [contents, setContents] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingContent, setEditingContent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
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
    fetchContents();
  }, [isAuthenticated, isAdmin, navigate]);

  const fetchContents = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get('/api/about/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setContents(data);
    } catch (error) {
      showSnackbar('Failed to fetch content', 'error');
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
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          image: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = (content) => {
    setEditingContent(content);
    setFormData({
      title: content.title,
      content: content.content,
      image: content.image || ''
    });
    setOpenDialog(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this content?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/about/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        showSnackbar('Content deleted successfully', 'success');
        fetchContents();
      } catch (error) {
        showSnackbar('Failed to delete content', 'error');
      }
    }
  };

  const handleSetActive = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        showSnackbar('Authorization token not found', 'error');
        return;
      }
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await axios.put(`/api/about/${id}/set-active`, null, config);
      
      if (response.data) {
        showSnackbar('Content set as active successfully', 'success');
        await fetchContents();
      }
    } catch (error) {
      console.error('Error setting content as active:', error);
      const errorMessage = error.response?.data?.message || 'Failed to set content as active';
      showSnackbar(errorMessage, 'error');
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

      if (editingContent) {
        await axios.put(`/api/about/${editingContent._id}`, formData, config);
        showSnackbar('Content updated successfully', 'success');
      } else {
        await axios.post('/api/about', formData, config);
        showSnackbar('Content created successfully', 'success');
      }
      setOpenDialog(false);
      setEditingContent(null);
      setFormData({ title: '', content: '', image: '' });
      fetchContents();
    } catch (error) {
      showSnackbar(error.response?.data?.message || 'Failed to save content', 'error');
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <Container sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" sx={{ color: '#FF8000' }}>
          Manage About Us Content
        </Typography>
        <Button
          variant="contained"
          sx={{
            bgcolor: '#FF8000',
            '&:hover': { bgcolor: '#e67300' }
          }}
          onClick={() => {
            setEditingContent(null);
            setFormData({ title: '', content: '', image: '' });
            setOpenDialog(true);
          }}
        >
          Add New Content
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ bgcolor: '#1a1a1a', color: 'white' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: '#FF8000' }}>Title</TableCell>
              <TableCell sx={{ color: '#FF8000' }}>Content</TableCell>
              <TableCell sx={{ color: '#FF8000' }}>Created At</TableCell>
              <TableCell sx={{ color: '#FF8000' }}>Status</TableCell>
              <TableCell sx={{ color: '#FF8000' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contents.map((content) => (
              <TableRow key={content._id}>
                <TableCell sx={{ color: 'white' }}>{content.title}</TableCell>
                <TableCell sx={{ color: 'white' }}>
                  {content.content ? content.content.substring(0, 100) + '...' : ''}
                </TableCell>
                <TableCell sx={{ color: 'white' }}>
                  {new Date(content.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell sx={{ color: 'white' }}>
                  {content.isActive ? (
                    <Typography sx={{ color: '#4CAF50' }}>Active</Typography>
                  ) : (
                    <Typography sx={{ color: '#9e9e9e' }}>Inactive</Typography>
                  )}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(content)} sx={{ color: '#FF8000' }}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(content._id)} sx={{ color: '#FF8000' }}>
                    <DeleteIcon />
                  </IconButton>
                  {!content.isActive && (
                    <Button
                      onClick={() => handleSetActive(content._id)}
                      sx={{
                        ml: 1,
                        color: '#4CAF50',
                        borderColor: '#4CAF50',
                        '&:hover': {
                          borderColor: '#45a049',
                          backgroundColor: 'rgba(76, 175, 80, 0.1)'
                        }
                      }}
                      variant="outlined"
                      size="small"
                    >
                      Set Active
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ bgcolor: '#000000', color: '#FF8000' }}>
          {editingContent ? 'Edit Content' : 'Add New Content'}
        </DialogTitle>
        <DialogContent sx={{ bgcolor: '#000000', pt: 2 }}>
          <TextField
            fullWidth
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
            InputLabelProps={{ sx: { color: '#FF8000' } }}
            InputProps={{ sx: { color: 'white' } }}
          />
          <TextField
            fullWidth
            label="Content"
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            multiline
            rows={4}
            sx={{ mb: 2 }}
            InputLabelProps={{ sx: { color: '#FF8000' } }}
            InputProps={{ sx: { color: 'white' } }}
          />
          <input
            accept="image/*"
            type="file"
            onChange={handleImageChange}
            style={{ color: 'white', marginTop: '1rem' }}
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
        </DialogContent>
        <DialogActions sx={{ bgcolor: '#000000', p: 2 }}>
          <Button onClick={() => setOpenDialog(false)} sx={{ color: '#FF8000' }}>
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
            {editingContent ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AboutUsAdmin;