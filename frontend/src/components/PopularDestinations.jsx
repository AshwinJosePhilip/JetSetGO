import { useState, useEffect } from 'react';
import axios from 'axios';
import { CircularProgress, Alert } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import './PopularDestinations.css';

const PopularDestinations = () => {
    const [destinations, setDestinations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDestinations = async () => {
            try {
                const { data } = await axios.get('/api/destinations');
                setDestinations(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching destinations:', error);
                setError('Failed to load destinations. Please try again later.');
                setLoading(false);
            }
        };

        fetchDestinations();
    }, []);

    const getImageUrl = (imageData) => {
        if (!imageData) {
            return 'https://placehold.co/600x400/000000/FF8000?text=No+Image';
        }
        // Handle base64 images and file paths
        if (imageData.startsWith('data:image')) {
            return imageData;
        }
        return imageData;
    };

    if (loading) {
        return (
            <section className="popular-destinations">
                <h2>Popular Destinations</h2>
                <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
                    <CircularProgress sx={{ color: '#FF8000' }} />
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="popular-destinations">
                <h2>Popular Destinations</h2>
                <Alert severity="error" sx={{ 
                    maxWidth: '600px', 
                    margin: '0 auto',
                    '& .MuiAlert-icon': { color: '#FF8000' },
                    '& .MuiAlert-message': { color: '#FF8000' }
                }}>
                    {error}
                </Alert>
            </section>
        );
    }

    if (destinations.length === 0) {
        return (
            <section className="popular-destinations">
                <h2>Popular Destinations</h2>
                <Alert severity="info" sx={{ 
                    maxWidth: '600px', 
                    margin: '0 auto',
                    '& .MuiAlert-icon': { color: '#FF8000' },
                    '& .MuiAlert-message': { color: '#FF8000' }
                }}>
                    No destinations available at the moment.
                </Alert>
            </section>
        );
    }

    return (
        <section className="popular-destinations">
            <h2>Popular Destinations</h2>
            <div className="destinations-grid">
                {destinations.map((destination) => (
                    <div key={destination._id} className="destination-card">
                        <img 
                            src={getImageUrl(destination.image)}
                            alt={destination.name} 
                            onError={(e) => {
                                console.error('Image load error:', e);
                                e.target.onerror = null;
                                e.target.src = 'https://placehold.co/600x400/000000/FF8000?text=No+Image';
                            }}
                        />
                        <div className="destination-info">
                            <h3>{destination.name}</h3>
                            <p className="location">
                                <LocationOnIcon sx={{ mr: 1, color: '#FFA64D' }} />
                                {destination.location}
                            </p>
                            <p className="description">{destination.description}</p>
                            <p className="price">
                                Starting from ${destination.price}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default PopularDestinations;