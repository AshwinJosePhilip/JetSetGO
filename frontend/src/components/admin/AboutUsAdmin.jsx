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

const AboutUsAdmin = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const [contents, setContents] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingContent, setEditingContent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    if (isAuthenticated) {
      fetchContents();
    }
  }, [isAuthenticated]);

  const fetchContents = async () => {
    try {
      const { data } = await axios.get('/api/about/all');
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

  const handleEdit = (content) => {
    setEditingContent(content);
    setFormData({
      title: content.title,
      content: content.content
    });
    setOpenDialog(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this content?')) {
      try {
        await axios.delete(`/api/about/${id}`);
        showSnackbar('Content deleted successfully', 'success');
        fetchContents();
      } catch (error) {
        showSnackbar('Failed to delete content', 'error');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingContent) {
        await axios.put(`/api/about/${editingContent._id}`, formData);
        showSnackbar('Content updated successfully', 'success');
      } else {
        await axios.post('/api/about', formData);
        showSnackbar('Content created successfully', 'success');
      }
      setOpenDialog(false);
      setEditingContent(null);
      setFormData({ title: '', content: '' });
      fetchContents();
    } catch (error) {
      showSnackbar('Failed to save content', 'error');
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
    return (
      <Container>
        <Typography sx={{ color: '#FF8000', mt: 4, textAlign: 'center' }}>
          Please log in as an admin to manage content.
        </Typography>
      </Container>
    );
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
            setFormData({ title: '', content: '' });
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
              <TableCell sx={{ color: '#FF8000' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contents.map((content) => (
              <TableRow key={content._id}>
                <TableCell sx={{ color: 'white' }}>{content.title}</TableCell>
                <TableCell sx={{ color: 'white' }}>
                  {content.content.substring(0, 100)}...
                </TableCell>
                <TableCell sx={{ color: 'white' }}>
                  {new Date(content.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(content)} sx={{ color: '#FF8000' }}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(content._id)} sx={{ color: '#FF8000' }}>
                    <DeleteIcon />
                  </IconButton>
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
            InputLabelProps={{ sx: { color: '#FF8000' } }}
            InputProps={{ sx: { color: 'white' } }}
          />
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