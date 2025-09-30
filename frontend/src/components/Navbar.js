import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <IconButton
            component={Link}
            to="/"
            sx={{ color: 'white', mr: 1 }}
            edge="start"
          >
            <Box
              component="img"
              src="/house-heart-icon.svg"
              alt="FlexiRent Logo"
              sx={{
                width: 28,
                height: 28,
                filter: 'invert(1)' // Makes the icon white
              }}
            />
          </IconButton>
          <Typography variant="h6" component="div">
            <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
              FlexiRent
            </Link>
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button color="inherit" component={Link} to="/properties">
            Properties
          </Button>
          {isAuthenticated ? (
            <>
              <Button color="inherit" component={Link} to="/dashboard">
                Dashboard
              </Button>
              {user?.role === 'LANDLORD' && (
                <Button color="inherit" component={Link} to="/manage-properties">
                  Manage Properties
                </Button>
              )}
              {user?.role === 'ADMIN' && (
                <Button color="inherit" component={Link} to="/admin">
                  Admin Panel
                </Button>
              )}
              <Button color="inherit" onClick={handleLogout}>
                Logout ({user?.username})
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
              <Button color="inherit" component={Link} to="/register">
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;