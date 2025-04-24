import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, CircularProgress, Snackbar, Alert } from '@mui/material';
import axios from 'axios';

const AboutUs = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'error'
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/about');
        if (response.data) {
          setContent(response.data);
        } else {
          // Fallback content if no content is found
          setContent({
            title: 'About JetSetGo',
            content: 'JetSetGo is your ultimate flight booking companion. We make travel planning seamless and enjoyable, offering the best deals on flights worldwide.'
          });
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to load content. Please try again later.');
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

  // If content is null, provide default content
  if (!content) {
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
            About JetSetGo
          </Typography>
          
          <Typography 
            variant="body1" 
            sx={{ 
              color: 'white',
              textAlign: 'center',
              whiteSpace: 'pre-line'
            }}
          >
            JetSetGo is your ultimate flight booking companion. We make travel planning seamless and enjoyable, offering the best deals on flights worldwide.
          </Typography>
        </Container>
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
          {content.title}
        </Typography>
        
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            gap: 4
          }}
         >
          {content.image ? (
            <Box
              component="img"
              sx={{
                width: { xs: '100%', md: '50%' },
                maxWidth: '500px',
                height: 'auto',
                borderRadius: 2
              }}
              src={content.image}
              alt="About JetSetGo"
            />
          ) : (
            <Box
              sx={{
                width: { xs: '100%', md: '50%' },
                maxWidth: '500px',
                height: '300px',
                borderRadius: 2,
                bgcolor: '#333',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Typography variant="body1" sx={{ color: '#FF8000' }}>
                No image available
              </Typography>
            </Box>
          )}
          
          <Typography 
            variant="body1" 
            sx={{ 
              color: 'white',
              flex: 1,
              textAlign: { xs: 'center', md: 'left' },
              whiteSpace: 'pre-line'
            }}
          >
            {content.content}
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