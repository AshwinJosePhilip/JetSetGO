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
    const [uploadProgress, setUploadProgress] = useState(0);

    const API_BASE_URL = process.env.NODE_ENV === 'production' 
        ? '' 
        : 'http://localhost:5000';

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
            const { data } = await axios.get(`${API_BASE_URL}/api/bookings`, config);
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
                `${API_BASE_URL}/api/profile`,
                { name, email, password: password || undefined },
                config
            );

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

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            setMessage('File size must be less than 5MB');
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
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(percentCompleted);
                }
            };

            const { data } = await axios.post(
                `${API_BASE_URL}/api/profile/upload`,
                formData,
                config
            );

            updateUser({ profilePicture: data.profilePicture });
            setMessage('Profile picture updated successfully');
            setUploadProgress(0);
        } catch (error) {
            const errorMessage = error.response?.data?.message || 
                               error.message || 
                               'Error uploading picture';
            setMessage(errorMessage);
            setUploadProgress(0);
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

            await axios.delete(`${API_BASE_URL}/api/profile/picture`, config);
            updateUser({ profilePicture: null });
            setMessage('Profile picture removed successfully');
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error removing picture');
        }
    };

    const getProfilePictureUrl = (profilePicture) => {
        if (!profilePicture) return defaultAvatar;
        return `${API_BASE_URL}${profilePicture}`;
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
                        src={getProfilePictureUrl(user?.profilePicture)}
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
                        accept="image/jpeg,image/jpg,image/png"
                        onChange={handlePictureUpload}
                        className="file-input"
                    />
                    {uploadProgress > 0 && uploadProgress < 100 && (
                        <div className="upload-progress">
                            Uploading: {uploadProgress}%
                        </div>
                    )}
                    {user?.profilePicture && (
                        <button 
                            type="button" 
                            onClick={handleDeletePicture}
                            className="delete-btn"
                        >
                            Delete Picture
                        </button>
                    )}
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
                                <h4>Booking ID: {booking._id}</h4>
                                <p>Flight: {booking.flight?.flightNumber || 'N/A'}</p>
                                <p>From: {booking.flight?.origin || 'N/A'}</p>
                                <p>To: {booking.flight?.destination || 'N/A'}</p>
                                <p>Date: {new Date(booking.flight?.departureDate).toLocaleDateString() || 'N/A'}</p>
                                <p>Status: {booking.status}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;