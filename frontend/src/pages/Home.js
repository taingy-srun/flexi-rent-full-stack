import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Box, Grid, Card, CardContent, Fade, Slide, Grow } from '@mui/material';
import { Link } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import HomeIcon from '@mui/icons-material/Home';
import StarIcon from '@mui/icons-material/Star';
import { keyframes } from '@mui/system';

// Animation keyframes
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const slideInLeft = keyframes`
  0% { transform: translateX(-100px); opacity: 0; }
  100% { transform: translateX(0); opacity: 1; }
`;

const slideInRight = keyframes`
  0% { transform: translateX(100px); opacity: 0; }
  100% { transform: translateX(0); opacity: 1; }
`;

const fadeInUp = keyframes`
  0% { transform: translateY(30px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
`;

const Home = () => {
  const [showContent, setShowContent] = useState(false);
  const [showFeatures, setShowFeatures] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setShowContent(true), 300);
    const timer2 = setTimeout(() => setShowFeatures(true), 800);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <Box>
      {/* Hero Banner Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #0bc708 0%, #0a5f07 100%)',
          color: 'white',
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200") center/cover',
            opacity: 0.1,
            zIndex: 0,
          }
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Fade in={showContent} timeout={1000}>
                <Box>
                  <Typography
                    variant="h1"
                    component="h1"
                    gutterBottom
                    sx={{
                      fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
                      fontWeight: 'bold',
                      animation: `${slideInLeft} 1s ease-out`,
                      textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                    }}
                  >
                    Find Your Perfect Room
                  </Typography>
                  <Typography
                    variant="h5"
                    component="h2"
                    gutterBottom
                    sx={{
                      mb: 4,
                      animation: `${slideInLeft} 1s ease-out 0.2s both`,
                      opacity: 0.9
                    }}
                  >
                    Discover comfortable and affordable rooms for rent in your area
                  </Typography>
                  <Box
                    sx={{
                      animation: `${fadeInUp} 1s ease-out 0.4s both`,
                      display: 'flex',
                      flexDirection: { xs: 'column', sm: 'row' },
                      gap: 2
                    }}
                  >
                    <Button
                      variant="contained"
                      size="large"
                      component={Link}
                      to="/properties"
                      sx={{
                        bgcolor: 'white',
                        color: 'primary.main',
                        px: 4,
                        py: 1.5,
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        '&:hover': {
                          bgcolor: 'grey.100',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 25px rgba(0,0,0,0.2)'
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      Browse Properties
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      component={Link}
                      to="/register"
                      sx={{
                        borderColor: 'white',
                        color: 'white',
                        px: 4,
                        py: 1.5,
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        '&:hover': {
                          borderColor: 'white',
                          bgcolor: 'rgba(255,255,255,0.1)',
                          transform: 'translateY(-2px)'
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      Get Started
                    </Button>
                  </Box>
                </Box>
              </Fade>
            </Grid>
            <Grid item xs={12} md={6}>
              <Fade in={showContent} timeout={1500}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    animation: `${float} 3s ease-in-out infinite`,
                  }}
                >
                  <Box
                    component="img"
                    src="/house-heart-icon.svg"
                    alt="FlexiRent"
                    sx={{
                      width: { xs: 150, md: 200, lg: 250 },
                      height: { xs: 150, md: 200, lg: 250 },
                      opacity: 0.8,
                      filter: 'invert(1) drop-shadow(0 10px 20px rgba(0,0,0,0.3))'
                    }}
                  />
                </Box>
              </Fade>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg">
        <Box sx={{ py: { xs: 6, md: 10 } }}>
          <Fade in={showFeatures} timeout={1000}>
            <Typography
              variant="h3"
              component="h2"
              textAlign="center"
              gutterBottom
              sx={{
                mb: 6,
                fontWeight: 'bold',
                color: 'primary.main'
              }}
            >
              Why Choose FlexiRent?
            </Typography>
          </Fade>

          <Grid container spacing={4}>
            {[
              {
                icon: SearchIcon,
                title: 'Easy Search',
                description: 'Find rooms that match your preferences with our advanced search filters',
                delay: 0
              },
              {
                icon: HomeIcon,
                title: 'Quality Properties',
                description: 'All properties are verified and come with detailed descriptions and photos',
                delay: 0.2
              },
              {
                icon: StarIcon,
                title: 'Trusted Reviews',
                description: 'Read reviews from previous tenants to make informed decisions',
                delay: 0.4
              }
            ].map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Grow in={showFeatures} timeout={1000} style={{ transitionDelay: `${feature.delay * 1000}ms` }}>
                  <Card
                    sx={{
                      height: '100%',
                      textAlign: 'center',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-10px)',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                        '& .feature-icon': {
                          animation: `${pulse} 1s ease-in-out`
                        }
                      }
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <feature.icon
                        className="feature-icon"
                        sx={{
                          fontSize: 60,
                          color: 'primary.main',
                          mb: 3,
                          transition: 'all 0.3s ease'
                        }}
                      />
                      <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grow>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Call to Action Section */}
        <Fade in={showFeatures} timeout={1500}>
          <Box
            sx={{
              textAlign: 'center',
              py: { xs: 6, md: 8 },
              px: 4,
              background: 'linear-gradient(45deg, #f5f5f5 0%, #e8f5e8 100%)',
              borderRadius: 4,
              mb: 4
            }}
          >
            <Typography
              variant="h4"
              component="h2"
              gutterBottom
              sx={{ fontWeight: 'bold', color: 'primary.main' }}
            >
              Ready to Find Your Next Home?
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
              Join thousands of satisfied tenants who found their perfect room through our platform
            </Typography>
            <Button
              variant="contained"
              size="large"
              component={Link}
              to="/properties"
              sx={{
                px: 6,
                py: 2,
                fontSize: '1.2rem',
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #0bc708 30%, #0a5f07 90%)',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: '0 10px 30px rgba(11, 199, 8, 0.3)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Start Your Search Now
            </Button>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default Home;