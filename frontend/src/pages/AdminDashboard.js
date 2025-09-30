import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
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
  Alert,
  CircularProgress,
  Tooltip
} from '@mui/material';
import {
  People,
  Home,
  BookOnline,
  TrendingUp,
  Edit,
  Delete,
  Block,
  CheckCircle,
  Cancel
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { userAPI, propertyAPI, bookingAPI } from '../services/api';

const AdminDashboard = () => {
  const [tabValue, setTabValue] = useState(0);
  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProperties: 0,
    totalBookings: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Dialog states
  const [editUserDialog, setEditUserDialog] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteType, setDeleteType] = useState('');

  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated && user && user.role === 'ADMIN') {
      fetchAdminData();
    }
  }, [isAuthenticated, user]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [usersResponse, propertiesResponse, bookingsResponse] = await Promise.all([
        userAPI.getAllUsers(),
        propertyAPI.getAllProperties(),
        bookingAPI.getAllBookings()
      ]);

      setUsers(usersResponse.data);
      setProperties(propertiesResponse.data);
      setBookings(bookingsResponse.data);

      // Calculate stats
      const totalRevenue = bookingsResponse.data
        .filter(b => b.status === 'CONFIRMED' || b.status === 'COMPLETED')
        .reduce((sum, b) => sum + b.totalAmount, 0);

      setStats({
        totalUsers: usersResponse.data.length,
        totalProperties: propertiesResponse.data.length,
        totalBookings: bookingsResponse.data.length,
        totalRevenue
      });
    } catch (error) {
      setError('Failed to fetch admin data');
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      await userAPI.updateUserRole(userId, newRole);
      setSuccess('User role updated successfully');
      fetchAdminData();
    } catch (error) {
      setError('Failed to update user role');
    }
  };

  const handleDeleteUser = async () => {
    try {
      await userAPI.deleteUser(itemToDelete.id);
      setSuccess('User deleted successfully');
      setDeleteConfirmDialog(false);
      setItemToDelete(null);
      fetchAdminData();
    } catch (error) {
      setError('Failed to delete user');
    }
  };

  const handleDeleteProperty = async () => {
    try {
      await propertyAPI.deleteProperty(itemToDelete.id);
      setSuccess('Property deleted successfully');
      setDeleteConfirmDialog(false);
      setItemToDelete(null);
      fetchAdminData();
    } catch (error) {
      setError('Failed to delete property');
    }
  };

  const handleUpdateBookingStatus = async (bookingId, status) => {
    try {
      await bookingAPI.updateBookingStatus(bookingId, status);
      setSuccess('Booking status updated successfully');
      fetchAdminData();
    } catch (error) {
      setError('Failed to update booking status');
    }
  };

  const openDeleteDialog = (item, type) => {
    setItemToDelete(item);
    setDeleteType(type);
    setDeleteConfirmDialog(true);
  };

  const handleDeleteConfirm = () => {
    if (deleteType === 'user') {
      handleDeleteUser();
    } else if (deleteType === 'property') {
      handleDeleteProperty();
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'ADMIN': return 'error';
      case 'LANDLORD': return 'warning';
      case 'TENANT': return 'info';
      default: return 'default';
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

  if (!user || user.role !== 'ADMIN') {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">
          Access denied. This page is only available for administrators.
        </Alert>
      </Container>
    );
  }

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
        Admin Dashboard
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <People sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
              <Box>
                <Typography variant="h4">{stats.totalUsers}</Typography>
                <Typography color="text.secondary">Total Users</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <Home sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
              <Box>
                <Typography variant="h4">{stats.totalProperties}</Typography>
                <Typography color="text.secondary">Total Properties</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <BookOnline sx={{ fontSize: 40, color: 'info.main', mr: 2 }} />
              <Box>
                <Typography variant="h4">{stats.totalBookings}</Typography>
                <Typography color="text.secondary">Total Bookings</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <TrendingUp sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
              <Box>
                <Typography variant="h4">${stats.totalRevenue.toLocaleString()}</Typography>
                <Typography color="text.secondary">Total Revenue</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab label="Users" />
          <Tab label="Properties" />
          <Tab label="Bookings" />
        </Tabs>
      </Box>

      {/* Users Tab */}
      {tabValue === 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            User Management
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Username</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Created Date</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.role}
                        color={getRoleColor(user.role)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Change Role">
                        <IconButton
                          onClick={() => {
                            setEditingUser(user);
                            setEditUserDialog(true);
                          }}
                          color="primary"
                          size="small"
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      {user.role !== 'ADMIN' && (
                        <Tooltip title="Delete User">
                          <IconButton
                            onClick={() => openDeleteDialog(user, 'user')}
                            color="error"
                            size="small"
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* Properties Tab */}
      {tabValue === 1 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Property Management
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Landlord</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {properties.map((property) => (
                  <TableRow key={property.id}>
                    <TableCell>{property.id}</TableCell>
                    <TableCell>{property.title}</TableCell>
                    <TableCell>{property.city}, {property.state}</TableCell>
                    <TableCell>${property.pricePerMonth}/month</TableCell>
                    <TableCell>ID: {property.landlordId}</TableCell>
                    <TableCell>
                      <Chip
                        label={property.available ? 'Available' : 'Not Available'}
                        color={property.available ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Delete Property">
                        <IconButton
                          onClick={() => openDeleteDialog(property, 'property')}
                          color="error"
                          size="small"
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* Bookings Tab */}
      {tabValue === 2 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Booking Management
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Property ID</TableCell>
                  <TableCell>Tenant ID</TableCell>
                  <TableCell>Dates</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>{booking.id}</TableCell>
                    <TableCell>{booking.propertyId}</TableCell>
                    <TableCell>{booking.tenantId}</TableCell>
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
                    <TableCell>
                      {booking.status === 'PENDING' && (
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <Tooltip title="Confirm">
                            <IconButton
                              onClick={() => handleUpdateBookingStatus(booking.id, 'CONFIRMED')}
                              color="success"
                              size="small"
                            >
                              <CheckCircle />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Cancel">
                            <IconButton
                              onClick={() => handleUpdateBookingStatus(booking.id, 'CANCELLED')}
                              color="error"
                              size="small"
                            >
                              <Cancel />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* Edit User Dialog */}
      <Dialog open={editUserDialog} onClose={() => setEditUserDialog(false)}>
        <DialogTitle>Edit User Role</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Role</InputLabel>
            <Select
              value={editingUser?.role || ''}
              label="Role"
              onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
            >
              <MenuItem value="TENANT">Tenant</MenuItem>
              <MenuItem value="LANDLORD">Landlord</MenuItem>
              <MenuItem value="ADMIN">Admin</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditUserDialog(false)}>Cancel</Button>
          <Button
            onClick={() => {
              handleUpdateUserRole(editingUser.id, editingUser.role);
              setEditUserDialog(false);
              setEditingUser(null);
            }}
            variant="contained"
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmDialog} onClose={() => setDeleteConfirmDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this {deleteType}? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmDialog(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminDashboard;