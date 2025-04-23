import { useState, useEffect } from 'react';
import axios from 'axios';
import './PopularDestinations.css';

const PopularDestinations = () => {
    const [destinations, setDestinations] = useState([]);

    useEffect(() => {
        const fetchDestinations = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/destinations');
                setDestinations(data);
            } catch (error) {
                console.error('Error fetching destinations:', error);
            }
        };

        fetchDestinations();
    }, []);

    return (
        <section className="popular-destinations">
            <h2>Popular Destinations</h2>
            <div className="destinations-grid">
                {destinations.map((destination) => (
                    <div key={destination._id} className="destination-card">
                        <img src={destination.image} alt={destination.name} />
                        <div className="destination-info">
                            <h3>{destination.name}</h3>
                            <p className="location">{destination.location}</p>
                            <p className="description">{destination.description}</p>
                            <p className="price">Starting from ${destination.price}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default PopularDestinations;