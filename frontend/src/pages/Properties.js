import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  CircularProgress
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPropertiesStart, fetchPropertiesSuccess, fetchPropertiesFailure } from '../store/propertySlice';
import { propertyAPI } from '../services/api';
import ImageSlideshow from '../components/ImageSlideshow';

const Properties = () => {
  const [searchFilters, setSearchFilters] = useState({
    city: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    propertyType: '',
  });

  const dispatch = useDispatch();
  const { properties, loading, error } = useSelector((state) => state.properties);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async (filters = {}) => {
    dispatch(fetchPropertiesStart());
    try {
      let response;
      if (Object.values(filters).some(value => value !== '')) {
        response = await propertyAPI.searchProperties(filters);
        dispatch(fetchPropertiesSuccess(response.data.content || response.data));
      } else {
        response = await propertyAPI.getAllProperties();
        dispatch(fetchPropertiesSuccess(response.data));
      }
    } catch (error) {
      dispatch(fetchPropertiesFailure(error.message));
    }
  };

  const handleFilterChange = (e) => {
    setSearchFilters({
      ...searchFilters,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearch = () => {
    fetchProperties(searchFilters);
  };

  const handleClearFilters = () => {
    setSearchFilters({
      city: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      propertyType: '',
    });
    fetchProperties();
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Properties
      </Typography>

      <Box sx={{ mb: 4, p: 3, bgcolor: 'grey.100', borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          Search Filters
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="City"
              name="city"
              value={searchFilters.city}
              onChange={handleFilterChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              label="Min Price"
              name="minPrice"
              type="number"
              value={searchFilters.minPrice}
              onChange={handleFilterChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              label="Max Price"
              name="maxPrice"
              type="number"
              value={searchFilters.maxPrice}
              onChange={handleFilterChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth>
              <InputLabel>Bedrooms</InputLabel>
              <Select
                name="bedrooms"
                value={searchFilters.bedrooms}
                label="Bedrooms"
                onChange={handleFilterChange}
              >
                <MenuItem value="">Any</MenuItem>
                <MenuItem value={1}>1+</MenuItem>
                <MenuItem value={2}>2+</MenuItem>
                <MenuItem value={3}>3+</MenuItem>
                <MenuItem value={4}>4+</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                name="propertyType"
                value={searchFilters.propertyType}
                label="Type"
                onChange={handleFilterChange}
              >
                <MenuItem value="">Any</MenuItem>
                <MenuItem value="APARTMENT">Apartment</MenuItem>
                <MenuItem value="HOUSE">House</MenuItem>
                <MenuItem value="CONDO">Condo</MenuItem>
                <MenuItem value="STUDIO">Studio</MenuItem>
                <MenuItem value="ROOM">Room</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={1}>
            <Button variant="contained" fullWidth onClick={handleSearch}>
              Search
            </Button>
          </Grid>
        </Grid>
        <Box sx={{ mt: 2 }}>
          <Button variant="outlined" onClick={handleClearFilters}>
            Clear Filters
          </Button>
        </Box>
      </Box>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

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
                    label={`${property.bedrooms} bed`}
                    size="small"
                    sx={{ mr: 1, mb: 1 }}
                  />
                  <Chip
                    label={`${property.bathrooms} bath`}
                    size="small"
                    sx={{ mr: 1, mb: 1 }}
                  />
                  <Chip
                    label={`${property.areaSqft} sqft`}
                    size="small"
                    sx={{ mr: 1, mb: 1 }}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {property.description?.substring(0, 100)}...
                </Typography>
              </CardContent>
              <Box sx={{ p: 2 }}>
                <Button
                  variant="contained"
                  fullWidth
                  component={Link}
                  to={`/properties/${property.id}`}
                >
                  View Details
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {properties.length === 0 && !loading && (
        <Typography variant="h6" textAlign="center" sx={{ mt: 4 }}>
          No properties found
        </Typography>
      )}
    </Container>
  );
};

export default Properties;