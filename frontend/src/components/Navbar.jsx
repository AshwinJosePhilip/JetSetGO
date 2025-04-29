import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Modal, TextField, Alert, Avatar, Menu, MenuItem, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import defaultAvatar from '../assets/default-avatar.svg';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 450, // Increased from 400
  bgcolor: '#000000',
  border: '2px solid #FF8000',
  borderRadius: '15px',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3 // Increased from 2 for more spacing
};

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout, login, register, user } = useAuth();
  const [openLogin, setOpenLogin] = useState(false);
  const [openSignup, setOpenSignup] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [anchorEl, setAnchorEl] = useState(null);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSignupInputChange = (e) => {
    setSignupData({
      ...signupData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await login(formData.email, formData.password);
    if (result.success) {
      setOpenLogin(false);
      setFormData({ email: '', password: '' });
    } else {
      setError(result.error);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const result = await register(signupData.name, signupData.email, signupData.password);
    if (result.success) {
      setOpenSignup(false);
      setSignupData({ name: '', email: '', password: '' });
    } else {
      setError(result.error);
    }
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    handleProfileMenuClose();
    navigate('/profile');
  };

  const handleLogout = () => {
    handleProfileMenuClose();
    logout();
    navigate('/');
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#000000' }}>
      <Toolbar>
        <FlightTakeoffIcon 
          sx={{ mr: 2, color: '#FF8000', cursor: 'pointer' }} 
          onClick={() => navigate('/')}
        />
        <Typography 
          variant="h5" 
          component="div" 
          sx={{ 
            flexGrow: 1, 
            color: '#FF8000', 
            fontWeight: 'bold', 
            cursor: 'pointer',
            fontSize: '1.8rem',
            letterSpacing: '1px',
            textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
          }}
          onClick={() => navigate('/')}
        >
          JetSetGo
        </Typography>
        <Box>
          {isAuthenticated ? (
            <>
              <Button 
                color="inherit" 
                sx={{ 
                  color: '#FF8000',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 128, 0, 0.1)'
                  }
                }}
                onClick={() => navigate('/search')}
              >
                Search Flights
              </Button>
              <IconButton
                onClick={handleProfileMenuOpen}
                sx={{ ml: 2 }}
              >
                <Avatar 
                  src={user?.profilePicture 
                    ? `${process.env.NODE_ENV === 'production' 
                        ? '' 
                        : 'http://localhost:5000'}${user.profilePicture}` 
                    : defaultAvatar}
                  sx={{ 
                    bgcolor: '#FF8000',
                    color: '#000000',
                    width: 40,
                    height: 40,
                    border: '2px solid #FF8000'
                  }}
                  onError={(e) => {
                    console.log('Image load error:', e);
                    e.target.onerror = null;
                    e.target.src = defaultAvatar;
                  }}
                >
                  {user?.name ? user.name[0].toUpperCase() : 'U'}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleProfileMenuClose}
                PaperProps={{
                  sx: {
                    bgcolor: '#000000',
                    border: '1px solid #FF8000',
                    '& .MuiMenuItem-root': {
                      color: '#FF8000',
                      '&:hover': {
                        bgcolor: 'rgba(255, 128, 0, 0.1)'
                      }
                    }
                  }
                }}
              >
                <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
                {user?.isAdmin && [
                  <MenuItem key="about" onClick={() => {
                    handleProfileMenuClose();
                    navigate('/admin/about');
                  }}>Manage About Us</MenuItem>,
                  <MenuItem key="destinations" onClick={() => {
                    handleProfileMenuClose();
                    navigate('/admin/destinations');
                  }}>Manage Destinations</MenuItem>,
                  <MenuItem key="flights" onClick={() => {
                    handleProfileMenuClose();
                    navigate('/admin/flights');
                  }}>Manage Flights</MenuItem>
                ]}
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button 
                color="inherit" 
                sx={{ 
                  color: '#FF8000',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 128, 0, 0.1)'
                  }
                }}
                onClick={() => setOpenLogin(true)}
              >
                Login
              </Button>
              <Button 
                variant="contained" 
                sx={{ 
                  ml: 2, 
                  backgroundColor: '#FF8000',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  padding: '6px 20px',
                  '&:hover': {
                    backgroundColor: '#e67300'
                  }
                }}
                onClick={() => setOpenSignup(true)}
              >
                Sign Up
              </Button>
            </>
          )}
        </Box>
      </Toolbar>

      {/* Login Modal */}
      <Modal
        open={openLogin}
        onClose={() => {
          setOpenLogin(false);
          setError('');
          setFormData({ email: '', password: '' });
        }}
        sx={{
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          backdropFilter: 'blur(5px)'
        }}
      >
        <Box sx={{
          ...modalStyle,
          '& .MuiTextField-root': {
            marginBottom: 3,
            width: '100%',
            '& .MuiOutlinedInput-root': {
              borderRadius: '10px',
              '& fieldset': { 
                borderColor: '#FF8000',
                borderRadius: '10px'
              },
              '&:hover fieldset': { borderColor: '#FF8000' },
              '&.Mui-focused fieldset': {
                borderColor: '#FF8000',
                borderWidth: '2px'
              }
            },
            '& .MuiInputLabel-root': { 
              color: '#FF8000',
              '&.Mui-focused': {
                color: '#FF8000'
              }
            },
            '& .MuiOutlinedInput-input': { 
              color: 'white',
              backgroundColor: 'rgba(255, 128, 0, 0.1)',
              padding: '14px'
            }
          }
        }}>
          <Typography variant="h6" sx={{ color: '#FF8000', mb: 3 }}>
            Login
          </Typography>
          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
          <form onSubmit={handleLogin}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                backgroundColor: '#FF8000',
                '&:hover': { backgroundColor: '#e67300' },
                mt: 2,
                py: 1.5
              }}
            >
              Login
            </Button>
          </form>
        </Box>
      </Modal>

      {/* Signup Modal */}
      <Modal
        open={openSignup}
        onClose={() => {
          setOpenSignup(false);
          setError('');
          setSignupData({ name: '', email: '', password: '' });
        }}
        sx={{
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          backdropFilter: 'blur(5px)'
        }}
      >
        <Box sx={{
          ...modalStyle,
          '& .MuiTextField-root': {
            marginBottom: 3,  // Increased spacing between fields
            width: '100%',    // Ensure full width
            '& .MuiOutlinedInput-root': {
              borderRadius: '10px',
              '& fieldset': { 
                borderColor: '#FF8000',
                borderRadius: '10px'
              },
              '&:hover fieldset': { borderColor: '#FF8000' },
              '&.Mui-focused fieldset': {
                borderColor: '#FF8000',
                borderWidth: '2px'
              }
            },
            '& .MuiInputLabel-root': { 
              color: '#FF8000',
              '&.Mui-focused': {
                color: '#FF8000'
              }
            },
            '& .MuiOutlinedInput-input': { 
              color: 'white',
              backgroundColor: 'rgba(255, 128, 0, 0.1)',
              padding: '16px',  // Increased padding from 14px to 16px
              '&[name="name"]': {
                padding: '20px 16px' // Additional height specifically for the name field
              }
            }
          }
        }}>
          <Typography variant="h6" sx={{ color: '#FF8000', mb: 3 }}>
            Sign Up
          </Typography>
          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
          <form onSubmit={handleSignup}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={signupData.name}
              onChange={handleSignupInputChange}
              required
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={signupData.email}
              onChange={handleSignupInputChange}
              required
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={signupData.password}
              onChange={handleSignupInputChange}
              required
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                backgroundColor: '#FF8000',
                '&:hover': { backgroundColor: '#e67300' },
                mt: 2,  // Added top margin to the button
                py: 1.5  // Increased button padding
              }}
            >
              Sign Up
            </Button>
          </form>
        </Box>
      </Modal>
    </AppBar>
  );
};

export default Navbar;