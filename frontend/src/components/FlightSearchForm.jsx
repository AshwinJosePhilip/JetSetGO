import React, { useState, useRef, useEffect } from 'react';
import './FlightSearchForm.css';

const FlightSearchForm = () => {
  // Separate dropdown states for different selectors
  const [fromDropdownOpen, setFromDropdownOpen] = useState(false);
  const [toDropdownOpen, setToDropdownOpen] = useState(false);
  const [travelerDropdownOpen, setTravelerDropdownOpen] = useState(false);
  
  // Form data states
  const [cabinClass, setCabinClass] = useState('Economy');
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [fromAirport, setFromAirport] = useState('');
  const [toAirport, setToAirport] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [tripType, setTripType] = useState('roundTrip');

  // Separate refs for each dropdown
  const fromDropdownRef = useRef(null);
  const toDropdownRef = useRef(null);
  const travelerDropdownRef = useRef(null);

  // Handle outside clicks to close dropdowns
  useEffect(() => {
    const handleClickOutside = (e) => {
      // Close from dropdown if clicked outside
      if (fromDropdownRef.current && !fromDropdownRef.current.contains(e.target)) {
        setFromDropdownOpen(false);
      }
      
      // Close to dropdown if clicked outside
      if (toDropdownRef.current && !toDropdownRef.current.contains(e.target)) {
        setToDropdownOpen(false);
      }
      
      // Close traveler dropdown if clicked outside
      if (travelerDropdownRef.current && !travelerDropdownRef.current.contains(e.target)) {
        setTravelerDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Airport options
  const airports = [
    'John F. Kennedy International Airport (JFK)',
    'Los Angeles International Airport (LAX)',
    'San Francisco International Airport (SFO)',
    'Chicago O\'Hare International Airport (ORD)',
    'Denver International Airport (DEN)',
    'Seattle-Tacoma International Airport (SEA)',
    'Miami International Airport (MIA)',
    'Dallas/Fort Worth International Airport (DFW)',
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Form submission logic
    console.log({
      fromAirport,
      toAirport,
      departureDate,
      returnDate,
      cabinClass,
      adults,
      children,
      tripType,
    });
    
    // Here you would normally send data to backend or context
    alert('Search submitted! Check console for details.');
  };

  // Get today's date in YYYY-MM-DD format for min date validation
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="flight-search-page">
      <div className="flight-search-wrapper">
        <h1 className="form-title">Find Your Flight</h1>
        <form className="flight-search-form" onSubmit={handleSubmit}>
          {/* Trip Type Selection */}
          <div className="form-group trip-type-group">
            <label>Trip Type</label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="tripType"
                  value="roundTrip"
                  checked={tripType === 'roundTrip'}
                  onChange={(e) => setTripType(e.target.value)}
                />
                Round Trip
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="tripType"
                  value="oneWay"
                  checked={tripType === 'oneWay'}
                  onChange={(e) => setTripType(e.target.value)}
                />
                One Way
              </label>
            </div>
          </div>

          {/* From Airport field */}
          <div className="form-group" ref={fromDropdownRef}>
            <label>From</label>
            <input 
              type="text" 
              placeholder="Departure Airport" 
              value={fromAirport} 
              onClick={() => setFromDropdownOpen(!fromDropdownOpen)} 
              readOnly
              required 
            />
            {fromDropdownOpen && (
              <div className="airport-dropdown">
                {airports.map((airport, index) => (
                  <div 
                    key={index} 
                    className="airport-option" 
                    onClick={() => {
                      setFromAirport(airport);
                      setFromDropdownOpen(false);
                    }}
                  >
                    {airport}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* To Airport field */}
          <div className="form-group" ref={toDropdownRef}>
            <label>To</label>
            <input 
              type="text" 
              placeholder="Destination Airport" 
              value={toAirport} 
              onClick={() => setToDropdownOpen(!toDropdownOpen)} 
              readOnly
              required 
            />
            {toDropdownOpen && (
              <div className="airport-dropdown">
                {airports.filter(airport => airport !== fromAirport).map((airport, index) => (
                  <div 
                    key={index} 
                    className="airport-option" 
                    onClick={() => {
                      setToAirport(airport);
                      setToDropdownOpen(false);
                    }}
                  >
                    {airport}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Date Inputs */}
          <div className="form-group">
            <label>Departure</label>
            <input 
              type="date" 
              value={departureDate}
              min={today}
              onChange={(e) => {
                setDepartureDate(e.target.value);
                // Optionally set return date to be at least departure date
                if (returnDate && e.target.value > returnDate) {
                  setReturnDate(e.target.value);
                }
              }} 
              required 
            />
          </div>
          
          {tripType === 'roundTrip' && (
            <div className="form-group">
              <label>Return</label>
              <input 
                type="date" 
                value={returnDate}
                min={departureDate || today}
                onChange={(e) => setReturnDate(e.target.value)} 
                required={tripType === 'roundTrip'}
              />
            </div>
          )}

          {/* Passengers and Cabin Class Section */}
          <div className="passengers-wrapper" ref={travelerDropdownRef}>
            <label>Travelers & Class</label>
            <div className="traveler-trigger" onClick={() => setTravelerDropdownOpen(!travelerDropdownOpen)}>
              {`${adults + children} Traveler${adults + children > 1 ? 's' : ''}, ${cabinClass}`}
            </div>

            {travelerDropdownOpen && (
              <div className="dropdown-form">
                <div className="form-section">
                  <label>Cabin Class</label>
                  <select 
                    value={cabinClass}
                    onChange={(e) => setCabinClass(e.target.value)}
                  >
                    <option value="Economy">Economy</option>
                    <option value="Premium Economy">Premium Economy</option>
                    <option value="Business">Business</option>
                    <option value="First Class">First Class</option>
                  </select>
                </div>

                <div className="form-section">
                  <label>Adults (Aged 18+)</label>
                  <div className="counter">
                    <button 
                      type="button" 
                      onClick={() => setAdults(adults > 1 ? adults - 1 : 1)}
                      disabled={adults <= 1}
                    >
                      -
                    </button>
                    <span>{adults}</span>
                    <button 
                      type="button" 
                      onClick={() => setAdults(adults < 9 ? adults + 1 : 9)}
                      disabled={adults >= 9}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="form-section">
                  <label>Children (Aged 0-17)</label>
                  <div className="counter">
                    <button 
                      type="button" 
                      onClick={() => setChildren(children > 0 ? children - 1 : 0)}
                      disabled={children <= 0}
                    >
                      -
                    </button>
                    <span>{children}</span>
                    <button 
                      type="button" 
                      onClick={() => setChildren(children < 8 ? children + 1 : 8)}
                      disabled={children >= 8}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button type="submit" className="search-btn">Search Flights</button>
        </form>
      </div>
    </div>
  );
};

export default FlightSearchForm;