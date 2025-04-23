import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, CircularProgress } from '@mui/material';
import axios from 'axios';

const AboutUs = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await axios.get('/api/about');
        setContent(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load content. Please try again later.');
        setLoading(false);
        // Fallback content in case API fails
        setContent({
          title: 'About JetSetGo',
          description: 'JetSetGo is your ultimate flight booking companion. We make travel planning seamless and enjoyable, offering the best deals on flights worldwide.',
          image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=600&h=400&q=80'
        });
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
          
          <Typography 
            variant="body1" 
            sx={{ 
              color: 'white',
              flex: 1,
              textAlign: { xs: 'center', md: 'left' }
            }}
          >
            {content.description}
          </Typography>
        </Box>

        {error && (
          <Typography 
            color="error" 
            sx={{ mt: 2, textAlign: 'center' }}
          >
            {error}
          </Typography>
        )}
      </Container>
    </Box>
  );
};

export default AboutUs;