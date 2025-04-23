import React from 'react';
import { Box, Typography, Container } from '@mui/material';

const Header = () => {
  return (
    <Box
      sx={{
        bgcolor: '#000000',
        pt: 8,
        pb: 6,
        textAlign: 'center'
      }}
    >
      <Container maxWidth="sm">
        <Typography
          component="h1"
          variant="h2"
          sx={{
            color: '#FF8000',
            fontWeight: 'bold',
            mb: 2
          }}
        >
          Welcome to JetSetGo
        </Typography>
        <Typography 
          variant="h5" 
          paragraph
          sx={{ color: 'white' }}
        >
          Your journey begins here. Discover amazing flight deals and travel the world with ease and comfort.
        </Typography>
      </Container>
    </Box>
  );
};

export default Header;