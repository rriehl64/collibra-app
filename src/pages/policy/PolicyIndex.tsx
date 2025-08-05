import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Divider,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Breadcrumbs,
  Link
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  Security as SecurityIcon,
  PrivacyTip as PrivacyTipIcon,
  Gavel as GavelIcon,
  AccountBalance as AccountBalanceIcon,
  CloudDownload as CloudDownloadIcon,
  AssignmentLate as AssignmentLateIcon,
  Psychology as PsychologyIcon,
  Policy as PolicyIcon,
  AccessibilityNew as AccessibilityNewIcon,
  Handshake as HandshakeIcon
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import debounce from 'lodash/debounce';

interface PolicyItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  lastUpdated: string;
  path: string;
  status: 'active' | 'draft' | 'under-review';
  requiredAcknowledgment: boolean;
  compliance: string;
}

const PolicyIndex: React.FC = () => {
  const [searchText, setSearchText] = useState<string>('');
  const [filteredPolicies, setFilteredPolicies] = useState<PolicyItem[]>([]);
  
  // Sample policy data
  const policies: PolicyItem[] = [
    {
      id: '1',
      title: 'General Data Protection Regulation (GDPR)',
      description: 'Policy on the protection of natural persons with regard to the processing of personal data and rules relating to the free movement of personal data.',
      icon: <SecurityIcon fontSize="large" />,
      category: 'Data Privacy',
      lastUpdated: '2025-08-01',
      path: '/policy/gdpr',
      status: 'active',
      requiredAcknowledgment: true,
      compliance: 'EU GDPR'
    },
    {
      id: '2',
      title: 'Data Breach Response Policy',
      description: 'Procedures for identifying, reporting, and responding to suspected or known security incidents involving personal information.',
      icon: <AssignmentLateIcon fontSize="large" />,
      category: 'Security',
      lastUpdated: '2025-07-15',
      path: '/policy/data-breach',
      status: 'active',
      requiredAcknowledgment: true,
      compliance: 'GDPR, CCPA, ISO 27001'
    },
    {
      id: '3',
      title: 'Data Retention Policy',
      description: 'Guidelines for retaining and disposing of company records in accordance with legal and business requirements.',
      icon: <CloudDownloadIcon fontSize="large" />,
      category: 'Data Management',
      lastUpdated: '2025-06-22',
      path: '/policy/data-retention',
      status: 'active',
      requiredAcknowledgment: false,
      compliance: 'GDPR, SOX'
    },
    {
      id: '4',
      title: 'California Consumer Privacy Act (CCPA)',
      description: 'Policy regarding the collection, use, and protection of California residents\'s personal information.',
      icon: <GavelIcon fontSize="large" />,
      category: 'Data Privacy',
      lastUpdated: '2025-05-30',
      path: '/policy/ccpa',
      status: 'active',
      requiredAcknowledgment: true,
      compliance: 'CCPA'
    },
    {
      id: '5',
      title: 'Acceptable Use Policy',
      description: 'Rules and guidelines for the proper use of company computing resources, networks, and data.',
      icon: <PolicyIcon fontSize="large" />,
      category: 'IT',
      lastUpdated: '2025-07-10',
      path: '/policy/acceptable-use',
      status: 'active',
      requiredAcknowledgment: true,
      compliance: 'ISO 27001'
    },
    {
      id: '6',
      title: 'Third-Party Risk Management Policy',
      description: 'Guidelines for assessing and mitigating risks associated with third-party vendors and service providers.',
      icon: <HandshakeIcon fontSize="large" />,
      category: 'Risk Management',
      lastUpdated: '2025-06-05',
      path: '/policy/third-party-risk',
      status: 'active',
      requiredAcknowledgment: false,
      compliance: 'NIST SP 800-53'
    },
    {
      id: '7',
      title: 'Cookie Policy',
      description: 'Information about how cookies and similar technologies are used on our websites.',
      icon: <PrivacyTipIcon fontSize="large" />,
      category: 'Data Privacy',
      lastUpdated: '2025-04-20',
      path: '/policy/cookie',
      status: 'under-review',
      requiredAcknowledgment: false,
      compliance: 'GDPR, ePrivacy'
    },
    {
      id: '8',
      title: 'Accessibility Policy',
      description: 'Our commitment to making our websites and applications accessible to people of all abilities.',
      icon: <AccessibilityNewIcon fontSize="large" />,
      category: 'Compliance',
      lastUpdated: '2025-03-15',
      path: '/policy/accessibility',
      status: 'draft',
      requiredAcknowledgment: false,
      compliance: 'WCAG 2.1, Section 508'
    },
    {
      id: '9',
      title: 'Information Classification Policy',
      description: 'Guidelines for classifying information based on sensitivity and implementing appropriate controls.',
      icon: <PsychologyIcon fontSize="large" />,
      category: 'Data Management',
      lastUpdated: '2025-05-18',
      path: '/policy/info-classification',
      status: 'active',
      requiredAcknowledgment: true,
      compliance: 'ISO 27001'
    }
  ];

  // Handle search input change with debounce
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchText(value);
    debouncedSearch(value);
  };

  // Debounced search function
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = React.useCallback(
    debounce((value: string) => {
      if (!value.trim()) {
        setFilteredPolicies([]);
        return;
      }
      
      const searchLower = value.toLowerCase();
      const filtered = policies.filter((policy: PolicyItem) => 
        policy.title.toLowerCase().includes(searchLower) ||
        policy.description.toLowerCase().includes(searchLower) ||
        policy.category.toLowerCase().includes(searchLower) ||
        policy.compliance.toLowerCase().includes(searchLower)
      );
      
      setFilteredPolicies(filtered);
    }, 300),
    [policies]
  );

  // Clear search
  const handleClearSearch = () => {
    setSearchText('');
    setFilteredPolicies([]);
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'draft':
        return 'info';
      case 'under-review':
        return 'warning';
      default:
        return 'default';
    }
  };

  // Get policies to display based on search
  const displayPolicies = searchText ? filteredPolicies : policies;

  // Get categorized policies
  const policyCategories = Array.from(new Set(policies.map(policy => policy.category)));
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs Navigation */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Link component={RouterLink} to="/" color="inherit">
          Home
        </Link>
        <Typography color="text.primary">Policies</Typography>
      </Breadcrumbs>
      
      {/* Main Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
        <PolicyIcon sx={{ fontSize: 40, mr: 2, color: '#003366' }} />
        <Typography variant="h4" component="h1" sx={{ color: '#003366', fontWeight: 700 }}>
          Policy Center
        </Typography>
      </Box>
      
      <Typography variant="body1" paragraph>
        Access all company policies, standards, and compliance documentation. Required acknowledgments are highlighted.
      </Typography>
      
      {/* Search and Filters */}
      <Paper sx={{ p: 3, mb: 4 }} elevation={2}>
        <TextField
          fullWidth
          placeholder="Search policies by title, description, category, or compliance standard..."
          value={searchText}
          onChange={handleSearchChange}
          aria-label="Search policies"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: searchText && (
              <InputAdornment position="end">
                <IconButton 
                  onClick={handleClearSearch}
                  size="small"
                  aria-label="Clear search"
                >
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
        {searchText && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              {filteredPolicies.length === 0 
                ? 'No policies found matching your search.' 
                : `Found ${filteredPolicies.length} ${filteredPolicies.length === 1 ? 'policy' : 'policies'} matching your search.`}
            </Typography>
          </Box>
        )}
      </Paper>
      
      {searchText ? (
        // Search Results View
        <>
          <Typography variant="h6" gutterBottom>
            Search Results
          </Typography>
          <Grid container spacing={3}>
            {filteredPolicies.map((policy: PolicyItem) => (
              <Grid item xs={12} md={6} key={policy.id}>
                <Card 
                  elevation={2} 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    '&:hover': {
                      boxShadow: 6
                    },
                    position: 'relative',
                    transition: 'box-shadow 0.3s ease-in-out'
                  }}
                >
                  <Box sx={{ position: 'absolute', top: 12, right: 12, zIndex: 1 }}>
                    <Chip
                      label={policy.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      color={getStatusColor(policy.status) as any}
                      size="small"
                    />
                  </Box>
                  <CardContent sx={{ pt: 4, pb: 2, flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                      <Box sx={{ mr: 2, color: '#003366' }}>
                        {policy.icon}
                      </Box>
                      <Box>
                        <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
                          {policy.title}
                        </Typography>
                        <Chip 
                          label={policy.category} 
                          size="small" 
                          variant="outlined"
                          sx={{ mt: 0.5 }}
                        />
                      </Box>
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 2 }}>
                      {policy.description}
                    </Typography>
                    
                    <Divider sx={{ my: 1.5 }} />
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        Last Updated: {policy.lastUpdated}
                      </Typography>
                      {policy.requiredAcknowledgment && (
                        <Chip 
                          label="Acknowledgment Required" 
                          size="small"
                          color="primary"
                        />
                      )}
                    </Box>
                  </CardContent>
                  
                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button 
                      component={RouterLink} 
                      to={policy.path} 
                      size="small"
                      variant="contained"
                      sx={{
                        backgroundColor: '#003366',
                        '&:hover': {
                          backgroundColor: '#00264d'
                        }
                      }}
                    >
                      View Policy
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      ) : (
        // Regular Categorized View
        <>
          {policyCategories.map((category) => (
            <Box key={category} sx={{ mb: 4 }}>
              <Typography variant="h5" component="h2" sx={{ mb: 3, color: '#003366', fontWeight: 600 }}>
                {category}
              </Typography>
              
              <Grid container spacing={3}>
                {policies
                  .filter((policy: PolicyItem) => policy.category === category)
                  .map((policy: PolicyItem) => (
                    <Grid item xs={12} md={6} lg={4} key={policy.id}>
                      <Card 
                        elevation={2} 
                        sx={{ 
                          height: '100%', 
                          display: 'flex', 
                          flexDirection: 'column',
                          '&:hover': {
                            boxShadow: 6
                          },
                          position: 'relative',
                          transition: 'box-shadow 0.3s ease-in-out'
                        }}
                      >
                        <Box sx={{ position: 'absolute', top: 12, right: 12, zIndex: 1 }}>
                          <Chip
                            label={policy.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            color={getStatusColor(policy.status) as any}
                            size="small"
                          />
                        </Box>
                        <CardContent sx={{ pt: 4, pb: 2, flexGrow: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Box sx={{ mr: 1.5, color: '#003366' }}>
                              {policy.icon}
                            </Box>
                            <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                              {policy.title}
                            </Typography>
                          </Box>
                          
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {policy.description}
                          </Typography>
                          
                          <Box sx={{ mt: 'auto' }}>
                            <Divider sx={{ my: 1.5 }} />
                            
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="caption" color="text.secondary">
                                Last Updated: {policy.lastUpdated}
                              </Typography>
                              {policy.requiredAcknowledgment && (
                                <Chip 
                                  label="Acknowledgment Required" 
                                  size="small"
                                  color="primary"
                                />
                              )}
                            </Box>
                          </Box>
                        </CardContent>
                        
                        <CardActions sx={{ p: 2, pt: 0 }}>
                          <Button 
                            component={RouterLink} 
                            to={policy.path} 
                            size="small"
                            variant="contained"
                            sx={{
                              backgroundColor: '#003366',
                              '&:hover': {
                                backgroundColor: '#00264d'
                              }
                            }}
                          >
                            View Policy
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
              </Grid>
            </Box>
          ))}
        </>
      )}
      
      {/* Compliance Standards Summary */}
      <Paper sx={{ p: 3, mt: 4, backgroundColor: '#f8f9fa' }} elevation={1}>
        <Typography variant="h6" gutterBottom sx={{ color: '#003366' }}>
          Compliance Standards
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <AccountBalanceIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="GDPR" 
                  secondary="General Data Protection Regulation" 
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <AccountBalanceIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="CCPA" 
                  secondary="California Consumer Privacy Act" 
                />
              </ListItem>
            </List>
          </Grid>
          <Grid item xs={12} md={4}>
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <AccountBalanceIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="ISO 27001" 
                  secondary="Information Security Management" 
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <AccountBalanceIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="SOX" 
                  secondary="Sarbanes-Oxley Act" 
                />
              </ListItem>
            </List>
          </Grid>
          <Grid item xs={12} md={4}>
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <AccountBalanceIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="NIST SP 800-53" 
                  secondary="Security and Privacy Controls" 
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <AccountBalanceIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Section 508" 
                  secondary="Accessibility Requirements" 
                />
              </ListItem>
            </List>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default PolicyIndex;
