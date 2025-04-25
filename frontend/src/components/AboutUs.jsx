import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, CircularProgress, Snackbar, Alert } from '@mui/material';
import axios from 'axios';

const AboutUs = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'error'
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await axios.get('/api/about');
        setContent(response.data);
        setLoading(false);
      } catch (err) {
        setSnackbar({
          open: true,
          message: 'Failed to load content. Please try again later.',
          severity: 'error'
        });
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '400px' 
        }}
      >
        <CircularProgress sx={{ color: '#FF8000' }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        bgcolor: '#000000',
        py: 8
      }}
    >
      <Container maxWidth="md">
        <Typography
          component="h2"
          variant="h3"
          sx={{
            color: '#FF8000',
            fontWeight: 'bold',
            mb: 4,
            textAlign: 'center'
          }}
        >
          {content?.title || 'About JetSetGo'}
        </Typography>
        
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            gap: 4
          }}
        >
          {content?.image ? (
            <Box
              component="img"
              sx={{
                width: { xs: '100%', md: '50%' },
                maxWidth: '500px',
                height: 'auto',
                borderRadius: 2,
                border: '2px solid #FF8000'
              }}
              src={content.image || 'https://placehold.co/600x400/000000/FF8000?text=About+Us'}
              alt={content.title}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://placehold.co/600x400/000000/FF8000?text=About+Us';
              }}
            />
          ) : null}
          
          <Typography 
            variant="body1" 
            sx={{ 
              color: 'white',
              flex: 1,
              textAlign: { xs: 'center', md: content?.image ? 'left' : 'center' },
              whiteSpace: 'pre-line',
              fontSize: '1.1rem',
              lineHeight: 1.8
            }}
          >
            {content?.content || 'Content loading...'}
          </Typography>
        </Box>

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
    </Box>
  );
};

export default AboutUs;