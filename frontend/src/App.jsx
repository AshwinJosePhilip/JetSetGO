import { Box, CssBaseline } from '@mui/material';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Header from './components/Header';
import FlightSearchForm from './components/FlightSearchForm';
import AboutUs from './components/AboutUs';
import Footer from './components/Footer';
import Profile from './components/Profile';
import AboutUsAdmin from './components/admin/AboutUsAdmin';
import DestinationAdmin from './components/admin/DestinationAdmin';
import PopularDestinations from './components/PopularDestinations';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  const { isAuthenticated, isAdmin } = useAuth();
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        bgcolor: '#000000'
      }}
    >
      <CssBaseline />
      <Navbar />
      <Routes>
        <Route path="/" element={
          <Box sx={{ flex: 1 }}>
            <Header />
            <FlightSearchForm />
            <ErrorBoundary>
              <PopularDestinations />
            </ErrorBoundary>
            <Box sx={{ mt: 4 }}>
              <AboutUs />
            </Box>
          </Box>
        } />
        <Route path="/search" element={
          isAuthenticated ? <FlightSearchForm /> : <Navigate to="/" />
        } />
        <Route 
          path="/profile" 
          element={isAuthenticated ? <Profile /> : <Navigate to="/" />}
        />
        <Route
          path="/admin/about"
          element={isAuthenticated && isAdmin ? <AboutUsAdmin /> : <Navigate to="/" />}
        />
        <Route
          path="/admin/destinations"
          element={isAuthenticated && isAdmin ? <DestinationAdmin /> : <Navigate to="/" />}
        />
      </Routes>
      <Footer />
    </Box>
  );
}

export default App;
