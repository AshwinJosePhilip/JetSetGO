import React from 'react';
import { Box, Typography, Container } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: '#000000',
        borderTop: '1px solid #FF8000'
      }}
    >
      <Container maxWidth="sm">
        <Typography
          variant="body2"
          align="center"
          sx={{ color: '#FF8000' }}
        >
          © {new Date().getFullYear()} JetSetGo. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;