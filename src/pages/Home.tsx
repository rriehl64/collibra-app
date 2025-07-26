import React from 'react';
import { Container, Typography, Grid, Paper, Box, Button } from '@mui/material';
import { StorageRounded, SecurityRounded, AnalyticsRounded, IntegrationInstructionsRounded } from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';

const features = [
  {
    title: 'Data Catalog',
    description: 'Comprehensive data asset discovery and metadata management',
    icon: StorageRounded,
    path: '/data-catalog'
  },
  {
    title: 'Data Governance',
    description: 'Centralized policy management and automated workflows',
    icon: SecurityRounded,
    path: '/data-governance'
  },
  {
    title: 'Analytics & Reporting',
    description: 'Advanced data visualization and business glossary tools',
    icon: AnalyticsRounded,
    path: '/analytics'
  },
  {
    title: 'Integration & Scalability',
    description: 'API-first architecture with cloud-native scalability',
    icon: IntegrationInstructionsRounded,
    path: '/integration'
  },
];

const Home = () => {
  const navigate = useNavigate();
  return (
    <Box sx={{
      background: 'linear-gradient(135deg, #1785FB, #00A8B3)',
      minHeight: '100vh',
      pt: 8,
    }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8, color: 'white' }}>
          <Typography 
            variant="h1" 
            component="h1" 
            gutterBottom 
            sx={{ 
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              fontWeight: 600,
              mb: 3
            }}
          >
            Unified governance for data and AI
          </Typography>
          <Typography 
            variant="h5" 
            sx={{ 
              mb: 4,
              maxWidth: '800px',
              mx: 'auto',
              opacity: 0.9
            }}
          >
            Discover, understand, and trust your data with Collibra's intelligent data governance solution
          </Typography>
          <Box sx={{ mt: 4 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              sx={{ mr: 2 }}
            >
              Take a tour
            </Button>
            <Button
              variant="outlined"
              sx={{
                backgroundColor: 'transparent',
                borderColor: 'white',
                color: 'white',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                }
              }}
              size="large"
            >
              Request a demo
            </Button>
          </Box>
        </Box>

        <Grid container spacing={4} sx={{ mb: 8 }}>
          {features.map((feature) => (
            <Grid item xs={12} sm={6} md={3} key={feature.title}>
              {feature.path ? (
                <Link 
                  to={feature.path}
                  style={{ textDecoration: 'none' }}
                >
                  <Paper
                    sx={{
                      p: 3,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      transition: 'all 0.2s ease-in-out',
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                        backgroundColor: 'white',
                      }
                    }}
                  >
                    <Box
                      sx={{
                        backgroundColor: 'primary.main',
                        borderRadius: '50%',
                        p: 2,
                        mb: 2,
                        color: 'white',
                      }}
                    >
                      <feature.icon sx={{ fontSize: 40 }} />
                    </Box>
                    <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </Paper>
                </Link>
              ) : (
                <Paper
                  sx={{
                    p: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: 'primary.main',
                      borderRadius: '50%',
                      p: 2,
                      mb: 2,
                      color: 'white',
                    }}
                  >
                    <feature.icon sx={{ fontSize: 40 }} />
                  </Box>
                  <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </Paper>
              )}
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Home;
