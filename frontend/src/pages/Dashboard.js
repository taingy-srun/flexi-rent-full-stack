import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  CircularProgress
} from '@mui/material';
import { useSelector } from 'react-redux';
import { Navigate, Link } from 'react-router-dom';
import { bookingAPI, propertyAPI } from '../services/api';

const Dashboard = () => {
  const [tabValue, setTabValue] = useState(0);
  const [bookings, setBookings] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchUserData();
    } else if (isAuthenticated) {
      // If authenticated but no user data, stop loading
      setLoading(false);
    }
  }, [isAuthenticated, user]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchUserData = async () => {
    if (!user || !user.role || !user.id) {
      console.warn('User data is incomplete:', user);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      if (user.role === 'TENANT') {
        const bookingsResponse = await bookingAPI.getBookingsByTenant(user.id);
        setBookings(bookingsResponse.data);
      } else if (user.role === 'LANDLORD') {
        const [bookingsResponse, propertiesResponse] = await Promise.all([
          bookingAPI.getBookingsByLandlord(user.id),
          propertyAPI.getAllProperties()
        ]);
        setBookings(bookingsResponse.data);
        setProperties(propertiesResponse.data.filter(p => p.landlordId === user.id));
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId, status) => {
    try {
      await bookingAPI.updateBookingStatus(bookingId, status);
      fetchUserData(); // Refresh data
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'warning';
      case 'CONFIRMED': return 'success';
      case 'CANCELLED': return 'error';
      case 'REJECTED': return 'error';
      case 'COMPLETED': return 'info';
      default: return 'default';
    }
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!user || !user.role) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h6" color="error">
          Unable to load user data. Please try logging in again.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab label="My Bookings" />
          {user.role === 'LANDLORD' && <Tab label="My Properties" />}
        </Tabs>
      </Box>

      {tabValue === 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            {user.role === 'TENANT' ? 'My Bookings' : 'Booking Requests'}
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Property</TableCell>
                  <TableCell>Dates</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Status</TableCell>
                  {user.role === 'LANDLORD' && <TableCell>Actions</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>Property ID: {booking.propertyId}</TableCell>
                    <TableCell>
                      {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>${booking.totalAmount}</TableCell>
                    <TableCell>
                      <Chip
                        label={booking.status}
                        color={getStatusColor(booking.status)}
                        size="small"
                      />
                    </TableCell>
                    {user.role === 'LANDLORD' && (
                      <TableCell>
                        {booking.status === 'PENDING' && (
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                              size="small"
                              variant="contained"
                              color="success"
                              onClick={() => handleStatusUpdate(booking.id, 'CONFIRMED')}
                            >
                              Accept
                            </Button>
                            <Button
                              size="small"
                              variant="contained"
                              color="error"
                              onClick={() => handleStatusUpdate(booking.id, 'REJECTED')}
                            >
                              Reject
                            </Button>
                          </Box>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {bookings.length === 0 && (
            <Typography variant="body1" sx={{ mt: 2, textAlign: 'center' }}>
              No bookings found
            </Typography>
          )}
        </Box>
      )}

      {tabValue === 1 && user.role === 'LANDLORD' && (
        <Box sx={{ mt: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              My Properties
            </Typography>
            <Button
              variant="contained"
              component={Link}
              to="/manage-properties"
              sx={{ ml: 2 }}
            >
              Manage Properties
            </Button>
          </Box>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {properties.map((property) => (
                  <TableRow key={property.id}>
                    <TableCell>{property.title}</TableCell>
                    <TableCell>{property.city}, {property.state}</TableCell>
                    <TableCell>${property.pricePerMonth}/month</TableCell>
                    <TableCell>
                      <Chip
                        label={property.available ? 'Available' : 'Not Available'}
                        color={property.available ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {properties.length === 0 && (
            <Typography variant="body1" sx={{ mt: 2, textAlign: 'center' }}>
              No properties found
            </Typography>
          )}
        </Box>
      )}
    </Container>
  );
};

export default Dashboard;