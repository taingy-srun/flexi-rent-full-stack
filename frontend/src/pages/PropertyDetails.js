import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Alert
} from '@mui/material';
import { useParams, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { propertyAPI, bookingAPI } from '../services/api';
import { createBookingStart, createBookingSuccess, createBookingFailure } from '../store/bookingSlice';
import ImageSlideshow from '../components/ImageSlideshow';

const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [bookingData, setBookingData] = useState({
    startDate: '',
    endDate: '',
    specialRequests: '',
  });

  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { loading: bookingLoading, error: bookingError } = useSelector((state) => state.bookings);

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      const response = await propertyAPI.getPropertyById(id);
      setProperty(response.data);
    } catch (error) {
      console.error('Error fetching property:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookingSubmit = async () => {
    if (!isAuthenticated) {
      return;
    }

    dispatch(createBookingStart());

    try {
      const startDate = new Date(bookingData.startDate);
      const endDate = new Date(bookingData.endDate);
      const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
      const totalAmount = days * property.pricePerMonth / 30; // Rough calculation

      const booking = {
        propertyId: property.id,
        tenantId: user.id,
        landlordId: property.landlordId,
        startDate: bookingData.startDate,
        endDate: bookingData.endDate,
        totalAmount: totalAmount,
        specialRequests: bookingData.specialRequests,
      };

      const response = await bookingAPI.createBooking(booking);
      dispatch(createBookingSuccess(response.data));
      setBookingDialogOpen(false);
      setBookingData({ startDate: '', endDate: '', specialRequests: '' });
    } catch (error) {
      dispatch(createBookingFailure(error.response?.data || 'Booking failed'));
    }
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (loading) {
    return <Container>Loading...</Container>;
  }

  if (!property) {
    return <Container>Property not found</Container>;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Typography variant="h4" component="h1" gutterBottom>
            {property.title}
          </Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {property.address}, {property.city}, {property.state}
          </Typography>

          <Box sx={{ mb: 3, borderRadius: 2, overflow: 'hidden' }}>
            <ImageSlideshow
              images={property.imageUrls}
              height={400}
              alt={property.title}
            />
          </Box>

          <Typography variant="body1" paragraph>
            {property.description}
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Property Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <Chip label={`${property.bedrooms} Bedrooms`} />
              </Grid>
              <Grid item xs={6} sm={3}>
                <Chip label={`${property.bathrooms} Bathrooms`} />
              </Grid>
              <Grid item xs={6} sm={3}>
                <Chip label={`${property.areaSqft} sqft`} />
              </Grid>
              <Grid item xs={6} sm={3}>
                <Chip label={property.propertyType} />
              </Grid>
            </Grid>
          </Box>

          {property.amenities && property.amenities.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Amenities
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {property.amenities.map((amenity, index) => (
                  <Chip key={index} label={amenity.replace('_', ' ')} variant="outlined" />
                ))}
              </Box>
            </Box>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ position: 'sticky', top: 20 }}>
            <CardContent>
              <Typography variant="h5" color="primary" gutterBottom>
                ${property.pricePerMonth}/month
              </Typography>
              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={() => setBookingDialogOpen(true)}
                disabled={!property.available}
              >
                {property.available ? 'Book Now' : 'Not Available'}
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog open={bookingDialogOpen} onClose={() => setBookingDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Book Property</DialogTitle>
        <DialogContent>
          {bookingError && <Alert severity="error" sx={{ mb: 2 }}>{bookingError}</Alert>}
          <TextField
            autoFocus
            margin="dense"
            label="Start Date"
            type="date"
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            value={bookingData.startDate}
            onChange={(e) => setBookingData({ ...bookingData, startDate: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="End Date"
            type="date"
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            value={bookingData.endDate}
            onChange={(e) => setBookingData({ ...bookingData, endDate: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Special Requests"
            multiline
            rows={3}
            fullWidth
            variant="outlined"
            value={bookingData.specialRequests}
            onChange={(e) => setBookingData({ ...bookingData, specialRequests: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBookingDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleBookingSubmit} disabled={bookingLoading}>
            {bookingLoading ? 'Booking...' : 'Book'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PropertyDetails;