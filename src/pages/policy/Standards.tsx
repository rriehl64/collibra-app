import React from 'react';
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
  Breadcrumbs,
  Link,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  VerifiedUser as VerifiedUserIcon,
  CheckCircle as CheckCircleIcon,
  AccountBalance as AccountBalanceIcon,
  Security as SecurityIcon,
  Timeline as TimelineIcon,
  FactCheck as FactCheckIcon,
  Assignment as AssignmentIcon,
  Code as CodeIcon,
  SettingsEthernet as SettingsEthernetIcon,
  Policy as PolicyIcon
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

interface StandardItem {
  id: string;
  name: string;
  fullName: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  status: 'compliant' | 'in-progress' | 'planned';
  lastAudit: string;
  nextAudit: string;
  requirements: string[];
  owner: string;
  implementationLevel: 'full' | 'partial' | 'planned';
}

const Standards: React.FC = () => {
  // Sample standards data
  const standards: StandardItem[] = [
    {
      id: 'gdpr',
      name: 'GDPR',
      fullName: 'General Data Protection Regulation',
      description: 'EU regulation on data protection and privacy for all individuals within the European Union and the European Economic Area.',
      category: 'Privacy',
      icon: <SecurityIcon />,
      status: 'compliant',
      lastAudit: '2025-06-15',
      nextAudit: '2026-06-15',
      requirements: [
        'Lawful basis for processing',
        'Consent management',
        'Data subject rights',
        'Data breach notification',
        'Privacy by design and by default',
        'Data Protection Impact Assessments',
        'Records of processing activities',
        'Data Protection Officer'
      ],
      owner: 'Jane Smith, DPO',
      implementationLevel: 'full'
    },
    {
      id: 'iso27001',
      name: 'ISO 27001',
      fullName: 'Information Security Management System',
      description: 'International standard for managing information security that specifies requirements for establishing, implementing, maintaining and continually improving an information security management system.',
      category: 'Security',
      icon: <VerifiedUserIcon />,
      status: 'compliant',
      lastAudit: '2025-05-20',
      nextAudit: '2026-05-20',
      requirements: [
        'Information security policies',
        'Organization of information security',
        'Human resources security',
        'Asset management',
        'Access control',
        'Cryptography',
        'Physical and environmental security',
        'Operations security',
        'Communications security',
        'System acquisition, development and maintenance',
        'Supplier relationships',
        'Information security incident management',
        'Business continuity management',
        'Compliance'
      ],
      owner: 'Robert Chen, CISO',
      implementationLevel: 'full'
    },
    {
      id: 'pci-dss',
      name: 'PCI DSS',
      fullName: 'Payment Card Industry Data Security Standard',
      description: 'Information security standard for organizations that handle branded credit cards from the major card schemes.',
      category: 'Security',
      icon: <FactCheckIcon />,
      status: 'compliant',
      lastAudit: '2025-03-10',
      nextAudit: '2026-03-10',
      requirements: [
        'Build and maintain a secure network',
        'Protect cardholder data',
        'Maintain a vulnerability management program',
        'Implement strong access control measures',
        'Regularly monitor and test networks',
        'Maintain an information security policy'
      ],
      owner: 'Michael Johnson, Security Director',
      implementationLevel: 'full'
    },
    {
      id: 'ccpa',
      name: 'CCPA',
      fullName: 'California Consumer Privacy Act',
      description: 'State statute intended to enhance privacy rights and consumer protection for residents of California.',
      category: 'Privacy',
      icon: <AccountBalanceIcon />,
      status: 'compliant',
      lastAudit: '2025-04-30',
      nextAudit: '2026-04-30',
      requirements: [
        'Right to know what personal information is collected',
        'Right to know if personal information is sold or disclosed',
        'Right to say no to the sale of personal information',
        'Right to access personal information',
        'Right to equal service and price',
        'Right to deletion of personal information'
      ],
      owner: 'Jane Smith, DPO',
      implementationLevel: 'full'
    },
    {
      id: 'sox',
      name: 'SOX',
      fullName: 'Sarbanes-Oxley Act',
      description: 'Federal law that established sweeping auditing and financial regulations for public companies.',
      category: 'Financial',
      icon: <TimelineIcon />,
      status: 'compliant',
      lastAudit: '2025-02-15',
      nextAudit: '2026-02-15',
      requirements: [
        'Section 302: Corporate responsibility for financial reports',
        'Section 404: Management assessment of internal controls',
        'Section 409: Real-time issuer disclosures',
        'Section 802: Criminal penalties for altering documents',
        'Section 906: Corporate responsibility for financial reports'
      ],
      owner: 'Emily Garcia, CFO',
      implementationLevel: 'full'
    },
    {
      id: 'hipaa',
      name: 'HIPAA',
      fullName: 'Health Insurance Portability and Accountability Act',
      description: 'US legislation that provides data privacy and security provisions for safeguarding medical information.',
      category: 'Privacy',
      icon: <AssignmentIcon />,
      status: 'in-progress',
      lastAudit: '2025-01-20',
      nextAudit: '2025-07-20',
      requirements: [
        'Privacy Rule',
        'Security Rule',
        'Breach Notification Rule',
        'Enforcement Rule',
        'HITECH Act'
      ],
      owner: 'Sarah Williams, Compliance Manager',
      implementationLevel: 'partial'
    },
    {
      id: 'nist',
      name: 'NIST 800-53',
      fullName: 'NIST Special Publication 800-53',
      description: 'Security and privacy controls for federal information systems and organizations.',
      category: 'Security',
      icon: <SecurityIcon />,
      status: 'in-progress',
      lastAudit: '2024-12-10',
      nextAudit: '2025-12-10',
      requirements: [
        'Access Control',
        'Awareness and Training',
        'Audit and Accountability',
        'Security Assessment and Authorization',
        'Configuration Management',
        'Contingency Planning',
        'Identification and Authentication',
        'Incident Response',
        'Maintenance',
        'Media Protection',
        'Physical and Environmental Protection',
        'Planning',
        'Personnel Security',
        'Risk Assessment',
        'System and Services Acquisition',
        'System and Communications Protection',
        'System and Information Integrity'
      ],
      owner: 'Robert Chen, CISO',
      implementationLevel: 'partial'
    },
    {
      id: 'wcag',
      name: 'WCAG 2.1',
      fullName: 'Web Content Accessibility Guidelines',
      description: 'Guidelines for making web content more accessible to people with disabilities.',
      category: 'Accessibility',
      icon: <CodeIcon />,
      status: 'planned',
      lastAudit: 'N/A',
      nextAudit: '2025-10-15',
      requirements: [
        'Perceivable',
        'Operable',
        'Understandable',
        'Robust'
      ],
      owner: 'Alex Turner, UI/UX Lead',
      implementationLevel: 'planned'
    },
    {
      id: 'fedramp',
      name: 'FedRAMP',
      fullName: 'Federal Risk and Authorization Management Program',
      description: 'US government-wide program that provides a standardized approach to security assessment, authorization, and continuous monitoring for cloud products and services.',
      category: 'Security',
      icon: <SettingsEthernetIcon />,
      status: 'planned',
      lastAudit: 'N/A',
      nextAudit: '2026-01-20',
      requirements: [
        'Security Control Implementation',
        'Documentation',
        'Security Assessment',
        'Authorization',
        'Continuous Monitoring'
      ],
      owner: 'David Lopez, Cloud Security Architect',
      implementationLevel: 'planned'
    }
  ];

  // Get categorized standards
  const categories = Array.from(new Set(standards.map(standard => standard.category)));

  // Function to get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant':
        return 'success';
      case 'in-progress':
        return 'warning';
      case 'planned':
        return 'info';
      default:
        return 'default';
    }
  };

  const getImplementationColor = (level: string) => {
    switch (level) {
      case 'full':
        return 'success';
      case 'partial':
        return 'warning';
      case 'planned':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs Navigation */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Link component={RouterLink} to="/" color="inherit">
          Home
        </Link>
        <Link component={RouterLink} to="/policy" color="inherit">
          Policies
        </Link>
        <Typography color="text.primary">Standards & Compliance</Typography>
      </Breadcrumbs>
      
      {/* Main Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
        <PolicyIcon sx={{ fontSize: 40, mr: 2, color: '#003366' }} />
        <Typography variant="h4" component="h1" sx={{ color: '#003366', fontWeight: 700 }}>
          Standards & Compliance
        </Typography>
      </Box>
      
      <Typography variant="body1" paragraph>
        This page provides information about the standards and regulations our organization complies with. 
        Each standard includes implementation status, requirements, responsible owners, and audit timelines.
      </Typography>
      
      {/* Compliance Overview */}
      <Card sx={{ mb: 4 }} elevation={2}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ color: '#003366' }}>
            Compliance Status Summary
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <CheckCircleIcon sx={{ color: 'success.main', mr: 1 }} />
                <Typography variant="body1">
                  <strong>Compliant: </strong> 
                  {standards.filter(s => s.status === 'compliant').length} standards
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TimelineIcon sx={{ color: 'warning.main', mr: 1 }} />
                <Typography variant="body1">
                  <strong>In Progress: </strong> 
                  {standards.filter(s => s.status === 'in-progress').length} standards
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <AssignmentIcon sx={{ color: 'info.main', mr: 1 }} />
                <Typography variant="body1">
                  <strong>Planned: </strong> 
                  {standards.filter(s => s.status === 'planned').length} standards
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      
      {/* Standards by Category */}
      {categories.map((category) => (
        <Box key={category} sx={{ mb: 4 }}>
          <Typography variant="h5" component="h2" sx={{ mb: 3, color: '#003366', fontWeight: 600 }}>
            {category} Standards
          </Typography>
          
          <Grid container spacing={3}>
            {standards
              .filter((standard: StandardItem) => standard.category === category)
              .map((standard: StandardItem) => (
                <Grid item xs={12} key={standard.id}>
                  <Accordion 
                    defaultExpanded={standard.status === 'compliant'}
                    sx={{ 
                      '&.MuiPaper-root': { 
                        borderLeft: `4px solid ${
                          standard.status === 'compliant' ? 'success.main' : 
                          standard.status === 'in-progress' ? 'warning.main' : 'info.main'
                        }`,
                      }
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls={`${standard.id}-content`}
                      id={`${standard.id}-header`}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                        <Box sx={{ pr: 2, color: '#003366' }}>
                          {standard.icon}
                        </Box>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="h6">
                            {standard.name}: {standard.fullName}
                          </Typography>
                          <Box sx={{ display: 'flex', mt: 0.5 }}>
                            <Chip 
                              label={standard.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} 
                              color={getStatusColor(standard.status) as any}
                              size="small"
                              sx={{ mr: 1 }}
                            />
                            <Chip 
                              label={`Implementation: ${standard.implementationLevel.replace(/\b\w/g, l => l.toUpperCase())}`} 
                              color={getImplementationColor(standard.implementationLevel) as any}
                              size="small"
                              variant="outlined"
                            />
                          </Box>
                        </Box>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={3}>
                        <Grid item xs={12}>
                          <Typography variant="body1" paragraph>
                            {standard.description}
                          </Typography>
                        </Grid>
                        
                        <Grid item xs={12} md={4}>
                          <Card variant="outlined">
                            <CardContent>
                              <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                                Audit Information
                              </Typography>
                              <Box sx={{ mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                  Last Audit: {standard.lastAudit === 'N/A' ? 'Not yet audited' : standard.lastAudit}
                                </Typography>
                              </Box>
                              <Box sx={{ mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                  Next Audit: {standard.nextAudit}
                                </Typography>
                              </Box>
                              <Box sx={{ mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                  Owner: {standard.owner}
                                </Typography>
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid>
                        
                        <Grid item xs={12} md={8}>
                          <Card variant="outlined">
                            <CardContent>
                              <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                                Key Requirements
                              </Typography>
                              <TableContainer>
                                <Table size="small" aria-label={`${standard.name} requirements`}>
                                  <TableHead>
                                    <TableRow>
                                      <TableCell>Requirement</TableCell>
                                      <TableCell align="right">Status</TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {standard.requirements.map((req, index) => (
                                      <TableRow key={index}>
                                        <TableCell component="th" scope="row">
                                          {req}
                                        </TableCell>
                                        <TableCell align="right">
                                          {standard.status === 'planned' ? (
                                            <Chip size="small" label="Planned" color="info" variant="outlined" />
                                          ) : standard.status === 'in-progress' ? (
                                            index % 3 === 0 ? (
                                              <Chip size="small" label="Complete" color="success" variant="outlined" />
                                            ) : (
                                              <Chip size="small" label="In Progress" color="warning" variant="outlined" />
                                            )
                                          ) : (
                                            <Chip size="small" label="Complete" color="success" variant="outlined" />
                                          )}
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </TableContainer>
                            </CardContent>
                            <CardActions>
                              <Button size="small" color="primary">
                                View Detailed Documentation
                              </Button>
                              <Button size="small" color="primary">
                                View Audit History
                              </Button>
                            </CardActions>
                          </Card>
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                </Grid>
              ))}
          </Grid>
        </Box>
      ))}
      
      {/* Compliance Resources */}
      <Paper sx={{ p: 3, mt: 4, backgroundColor: '#f8f9fa' }} elevation={1}>
        <Typography variant="h6" gutterBottom sx={{ color: '#003366' }}>
          Compliance Resources
        </Typography>
        <List dense>
          <ListItem component={RouterLink} to="/policy">
            <ListItemIcon>
              <PolicyIcon color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="View Related Policies" 
              secondary="Access company policies related to these standards" 
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <AssignmentIcon color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="Compliance Calendar" 
              secondary="View upcoming compliance deadlines and audit dates" 
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <FactCheckIcon color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="Audit Documentation" 
              secondary="Access documentation for compliance audits" 
            />
          </ListItem>
        </List>
      </Paper>
    </Container>
  );
};

export default Standards;
