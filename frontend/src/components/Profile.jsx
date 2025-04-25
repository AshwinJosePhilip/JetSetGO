import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './Profile.css';
import defaultAvatar from '../assets/default-avatar.svg';

const Profile = () => {
    const { user, isAuthenticated, updateUser } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [bookings, setBookings] = useState([]);
    const [bookingsLoading, setBookingsLoading] = useState(true);

    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setEmail(user.email || '');
            fetchBookings();
        }
    }, [user]);

    const fetchBookings = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            const { data } = await axios.get('http://localhost:5000/api/bookings', config);
            setBookings(data);
            setBookingsLoading(false);
        } catch (error) {
            console.error('Error fetching bookings:', error);
            setBookingsLoading(false);
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            };

            const { data } = await axios.put(
                'http://localhost:5000/api/profile',
                { name, email, password: password || undefined },
                config
            );

            // Update the user state with the updated profile information
            updateUser(data);

            setMessage('Profile updated successfully');
            setPassword('');
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error updating profile');
        }
    };

    const handlePictureUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) {
            setMessage('Please select a file');
            return;
        }

        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!validTypes.includes(file.type)) {
            setMessage('Only JPEG, JPG and PNG images are allowed');
            return;
        }

        const formData = new FormData();
        formData.append('profilePicture', file);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setMessage('Authentication required. Please log in again.');
                return;
            }

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            };

            const { data } = await axios.post(
                'http://localhost:5000/api/profile/upload',
                formData,
                config
            );

            // Update the user state with the new profile picture
            updateUser({ profilePicture: data.profilePicture });
            setMessage('Profile picture updated successfully');
        } catch (error) {
            const errorMessage = error.response?.data?.message || 
                               error.message || 
                               'Error uploading picture';
            setMessage(errorMessage);
            console.error('Upload error:', error);
        }
    };

    const handleDeletePicture = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            await axios.delete('http://localhost:5000/api/profile/picture', config);

            // Update the user state with the removed profile picture
            updateUser({ profilePicture: null });

            setMessage('Profile picture removed successfully');
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error removing picture');
        }
    };

    if (!isAuthenticated) {
        return <div className="profile-container">Please log in to view your profile.</div>;
    }

    return (
        <div className="profile-container">
            <h2>Profile Management</h2>
            {message && <div className="message">{message}</div>}
            
            <div className="profile-picture-section">
                <div className="profile-picture">
                    <img 
                        src={user?.profilePicture 
                            ? `${process.env.NODE_ENV === 'production' 
                                ? '' 
                                : 'http://localhost:5000'}${user.profilePicture}` 
                            : defaultAvatar
                        } 
                        alt="Profile" 
                        onError={(e) => {
                            console.log('Image load error:', e);
                            e.target.onerror = null;
                            e.target.src = defaultAvatar;
                        }}
                    />
                </div>
                <div className="profile-picture-actions">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handlePictureUpload}
                        className="file-input"
                    />
                    <button 
                        type="button" 
                        onClick={handleDeletePicture}
                        className="delete-btn"
                    >
                        Delete Picture
                    </button>
                </div>
            </div>

            <form onSubmit={handleProfileUpdate} className="profile-form">
                <div className="form-group">
                    <label>Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>New Password (leave blank to keep current):</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <button type="submit" className="update-btn">
                    Update Profile
                </button>
            </form>

            <div className="bookings-section">
                <h3>My Bookings</h3>
                {bookingsLoading ? (
                    <div className="loading">Loading bookings...</div>
                ) : bookings.length === 0 ? (
                    <div className="no-bookings">No bookings found</div>
                ) : (
                    <div className="bookings-list">
                        {bookings.map((booking) => (
                            <div key={booking._id} className="booking-card">
                                <div className="booking-header">
                                    <h4>Flight {booking.flight.flightNumber}</h4>
                                    <span className={`status ${booking.status}`}>{booking.status}</span>
                                </div>
                                <div className="booking-details">
                                    <div>
                                        <strong>From:</strong> {booking.flight.departureAirport}
                                    </div>
                                    <div>
                                        <strong>To:</strong> {booking.flight.arrivalAirport}
                                    </div>
                                    <div>
                                        <strong>Date:</strong> {new Date(booking.flight.departureTime).toLocaleString()}
                                    </div>
                                    <div>
                                        <strong>Class:</strong> {booking.cabinClass}
                                    </div>
                                    <div>
                                        <strong>Passengers:</strong> {booking.passengers.adults + booking.passengers.children}
                                    </div>
                                    <div className="booking-price">
                                        <strong>Total Price:</strong> ${booking.totalPrice}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;