import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  CircularProgress
} from '@mui/material';
import { Add, Edit, Delete, Visibility } from '@mui/icons-material';
import { Link, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { propertyAPI } from '../services/api';
import ImageSlideshow from '../components/ImageSlideshow';

const ManageProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA',
    pricePerMonth: '',
    bedrooms: '',
    bathrooms: '',
    areaSqft: '',
    propertyType: 'APARTMENT',
    available: true,
    latitude: '',
    longitude: '',
    amenities: [],
    imageUrls: []
  });

  const amenityOptions = [
    'WIFI', 'PARKING', 'LAUNDRY', 'AIR_CONDITIONING', 'HEATING',
    'POOL', 'GYM', 'ELEVATOR', 'SECURITY', 'BALCONY', 'GARDEN',
    'PET_FRIENDLY', 'FURNISHED', 'DISHWASHER'
  ];

  const propertyTypes = [
    'APARTMENT', 'HOUSE', 'CONDO', 'STUDIO', 'ROOM', 'SHARED_ROOM'
  ];

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchProperties();
    }
  }, [isAuthenticated, user]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await propertyAPI.getAllProperties();
      // Filter properties for current landlord
      const landlordProperties = response.data.filter(p => p.landlordId === user.id);
      setProperties(landlordProperties);
    } catch (error) {
      setError('Failed to fetch properties');
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAmenitiesChange = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleImageUrlsChange = (e) => {
    const urls = e.target.value.split('\n').filter(url => url.trim());
    setFormData(prev => ({
      ...prev,
      imageUrls: urls
    }));
  };

  const handleSubmit = async () => {
    try {
      setError('');
      const dataToSubmit = {
        ...formData,
        pricePerMonth: parseFloat(formData.pricePerMonth),
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        areaSqft: parseInt(formData.areaSqft),
        latitude: parseFloat(formData.latitude) || 0,
        longitude: parseFloat(formData.longitude) || 0,
        landlordId: user.id
      };

      if (editingProperty) {
        await propertyAPI.updateProperty(editingProperty.id, dataToSubmit);
        setSuccess('Property updated successfully!');
      } else {
        await propertyAPI.createProperty(dataToSubmit);
        setSuccess('Property created successfully!');
      }

      handleCloseDialog();
      fetchProperties();
    } catch (error) {
      setError('Failed to save property: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleEdit = (property) => {
    setEditingProperty(property);
    setFormData({
      title: property.title,
      description: property.description,
      address: property.address,
      city: property.city,
      state: property.state,
      zipCode: property.zipCode,
      country: property.country,
      pricePerMonth: property.pricePerMonth.toString(),
      bedrooms: property.bedrooms.toString(),
      bathrooms: property.bathrooms.toString(),
      areaSqft: property.areaSqft.toString(),
      propertyType: property.propertyType,
      available: property.available,
      latitude: property.latitude.toString(),
      longitude: property.longitude.toString(),
      amenities: property.amenities || [],
      imageUrls: property.imageUrls || []
    });
    setDialogOpen(true);
  };

  const handleDelete = async () => {
    try {
      await propertyAPI.deleteProperty(propertyToDelete.id);
      setSuccess('Property deleted successfully!');
      setDeleteDialogOpen(false);
      setPropertyToDelete(null);
      fetchProperties();
    } catch (error) {
      setError('Failed to delete property');
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingProperty(null);
    setFormData({
      title: '',
      description: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'USA',
      pricePerMonth: '',
      bedrooms: '',
      bathrooms: '',
      areaSqft: '',
      propertyType: 'APARTMENT',
      available: true,
      latitude: '',
      longitude: '',
      amenities: [],
      imageUrls: []
    });
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!user || user.role !== 'LANDLORD') {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="warning">
          Access denied. This page is only available for landlords.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Manage Properties
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setDialogOpen(true)}
        >
          Add Property
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {properties.map((property) => (
            <Grid item xs={12} sm={6} md={4} key={property.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <ImageSlideshow
                  images={property.imageUrls}
                  height={200}
                  alt={property.title}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="h2">
                    {property.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {property.address}, {property.city}
                  </Typography>
                  <Typography variant="h6" color="primary" gutterBottom>
                    ${property.pricePerMonth}/month
                  </Typography>
                  <Box sx={{ mb: 1 }}>
                    <Chip
                      label={property.available ? 'Available' : 'Not Available'}
                      color={property.available ? 'success' : 'error'}
                      size="small"
                    />
                  </Box>
                </CardContent>
                <Box sx={{ p: 2, display: 'flex', gap: 1 }}>
                  <IconButton
                    component={Link}
                    to={`/properties/${property.id}`}
                    color="primary"
                    size="small"
                  >
                    <Visibility />
                  </IconButton>
                  <IconButton
                    onClick={() => handleEdit(property)}
                    color="primary"
                    size="small"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      setPropertyToDelete(property);
                      setDeleteDialogOpen(true);
                    }}
                    color="error"
                    size="small"
                  >
                    <Delete />
                  </IconButton>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {properties.length === 0 && !loading && (
        <Typography variant="h6" textAlign="center" sx={{ mt: 4 }}>
          No properties found. Click "Add Property" to create your first listing.
        </Typography>
      )}

      {/* Add/Edit Property Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingProperty ? 'Edit Property' : 'Add New Property'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleFormChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                multiline
                rows={3}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleFormChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="City"
                name="city"
                value={formData.city}
                onChange={handleFormChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="State"
                name="state"
                value={formData.state}
                onChange={handleFormChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Zip Code"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleFormChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Country"
                name="country"
                value={formData.country}
                onChange={handleFormChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Price/Month"
                name="pricePerMonth"
                type="number"
                value={formData.pricePerMonth}
                onChange={handleFormChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Bedrooms"
                name="bedrooms"
                type="number"
                value={formData.bedrooms}
                onChange={handleFormChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Bathrooms"
                name="bathrooms"
                type="number"
                value={formData.bathrooms}
                onChange={handleFormChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Area (sqft)"
                name="areaSqft"
                type="number"
                value={formData.areaSqft}
                onChange={handleFormChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Property Type</InputLabel>
                <Select
                  name="propertyType"
                  value={formData.propertyType}
                  label="Property Type"
                  onChange={handleFormChange}
                >
                  {propertyTypes.map(type => (
                    <MenuItem key={type} value={type}>
                      {type.replace('_', ' ')}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Latitude"
                name="latitude"
                type="number"
                value={formData.latitude}
                onChange={handleFormChange}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Longitude"
                name="longitude"
                type="number"
                value={formData.longitude}
                onChange={handleFormChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Amenities
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {amenityOptions.map(amenity => (
                  <Chip
                    key={amenity}
                    label={amenity.replace('_', ' ')}
                    onClick={() => handleAmenitiesChange(amenity)}
                    color={formData.amenities.includes(amenity) ? 'primary' : 'default'}
                    variant={formData.amenities.includes(amenity) ? 'filled' : 'outlined'}
                  />
                ))}
              </Box>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Image URLs (one per line)"
                multiline
                rows={4}
                value={formData.imageUrls.join('\n')}
                onChange={handleImageUrlsChange}
                placeholder="https://example.com/image1.jpg
https://example.com/image2.jpg"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingProperty ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{propertyToDelete?.title}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ManageProperties;