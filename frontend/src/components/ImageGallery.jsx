import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, Typography, Grid } from '@mui/material';
import axios from 'axios';

const ImageGallery = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await axios.get('/api/images');
                setImages(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to load images');
                setLoading(false);
            }
        };

        fetchImages();
    }, []);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress sx={{ color: '#FF8000' }} />
            </Box>
        );
    }

    if (error) {
        return (
            <Typography color="error" align="center">
                {error}
            </Typography>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ mb: 3, color: '#FF8000' }}>
                Image Gallery
            </Typography>
            <Grid container spacing={3}>
                {images.map((image) => (
                    <Grid item xs={12} sm={6} md={4} key={image._id}>
                        <Box
                            sx={{
                                p: 2,
                                border: '1px solid #FF8000',
                                borderRadius: 2,
                                bgcolor: '#000000'
                            }}
                        >
                            <Typography sx={{ color: '#FF8000', mb: 1 }}>
                                {image.name}
                            </Typography>
                            <Box
                                component="img"
                                src={image.data}
                                alt={image.name}
                                sx={{
                                    width: '100%',
                                    height: 'auto',
                                    borderRadius: 1
                                }}
                            />
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default ImageGallery;