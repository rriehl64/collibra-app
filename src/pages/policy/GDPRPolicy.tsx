import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Breadcrumbs,
  Link,
  Divider,
  Button,
  Snackbar,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Security as SecurityIcon,
  Assignment as AssignmentIcon,
  PersonOutline as PersonOutlineIcon,
  Gavel as GavelIcon,
  Timeline as TimelineIcon,
  Block as BlockIcon,
  CheckCircleOutline as CheckCircleIcon
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const GDPRPolicy: React.FC = () => {
  const [expandedSection, setExpandedSection] = useState<string | false>('panel1');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Function to handle accordion change
  const handleAccordionChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedSection(isExpanded ? panel : false);
  };

  // Function to handle policy acknowledgment
  const handleAcknowledge = () => {
    setSnackbarMessage('GDPR Policy acknowledgment recorded. Thank you!');
    setSnackbarOpen(true);
    // In a real application, this would also send an API request to record the acknowledgment
  };

  // Function to handle policy download
  const handleDownload = () => {
    setSnackbarMessage('GDPR Policy PDF download started.');
    setSnackbarOpen(true);
    // In a real application, this would trigger a file download
  };

  // Current date for policy version
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Style for section headers
  const sectionHeaderStyle = {
    color: '#003366',
    fontWeight: 600,
    mb: 2
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
        <Typography color="text.primary">GDPR Policy</Typography>
      </Breadcrumbs>
      
      {/* Main Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
        <SecurityIcon sx={{ fontSize: 40, mr: 2, color: '#003366' }} />
        <Typography variant="h4" component="h1" sx={{ color: '#003366', fontWeight: 700 }}>
          General Data Protection Regulation (GDPR) Policy
        </Typography>
      </Box>
      
      {/* Policy metadata */}
      <Paper sx={{ p: 3, mb: 4 }} elevation={2}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Typography variant="body1" paragraph>
              This policy outlines our commitment to protecting the personal data of individuals in accordance with the General Data Protection Regulation (EU) 2016/679. It explains the rights of data subjects and our procedures for ensuring compliance.
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  Policy Version: 2.1
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  Last Updated: {currentDate}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  Review Due: August 4, 2026
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  Policy Owner: Data Protection Officer
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Policy Content in Accordions */}
      <Accordion 
        expanded={expandedSection === 'panel1'} 
        onChange={handleAccordionChange('panel1')}
        elevation={1}
        sx={{ mb: 2 }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
          sx={{ backgroundColor: '#f5f5f5' }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <GavelIcon sx={{ mr: 1, color: '#003366' }} />
            <Typography variant="h6">1. Introduction and Legal Framework</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="h6" sx={sectionHeaderStyle}>
            1.1 Purpose
          </Typography>
          <Typography variant="body1" paragraph>
            This policy establishes the organization's approach to compliance with the General Data Protection Regulation (GDPR) and related data protection laws. It provides a framework for ensuring that personal data is handled in accordance with legal requirements and best practices.
          </Typography>
          
          <Typography variant="h6" sx={sectionHeaderStyle}>
            1.2 Scope
          </Typography>
          <Typography variant="body1" paragraph>
            This policy applies to all personal data processed by the organization regardless of the format in which that data is processed. It covers processing carried out by employees, contractors, and other data processors acting on behalf of the organization.
          </Typography>
          
          <Typography variant="h6" sx={sectionHeaderStyle}>
            1.3 Regulatory Framework
          </Typography>
          <Typography variant="body1" paragraph>
            Our GDPR compliance efforts are based on the following legal frameworks:
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="General Data Protection Regulation (EU) 2016/679" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="EU Member State implementing laws and regulations" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="European Data Protection Board guidelines and recommendations" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Relevant case law and regulatory decisions" />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>
      
      <Accordion 
        expanded={expandedSection === 'panel2'} 
        onChange={handleAccordionChange('panel2')}
        elevation={1}
        sx={{ mb: 2 }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2-content"
          id="panel2-header"
          sx={{ backgroundColor: '#f5f5f5' }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AssignmentIcon sx={{ mr: 1, color: '#003366' }} />
            <Typography variant="h6">2. Key Principles</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1" paragraph>
            All personal data processing activities conducted by the organization must adhere to the following GDPR principles:
          </Typography>
          
          <Typography variant="h6" sx={sectionHeaderStyle}>
            2.1 Lawfulness, Fairness, and Transparency
          </Typography>
          <Typography variant="body1" paragraph>
            Personal data shall be processed lawfully, fairly, and in a transparent manner in relation to the data subject. This means:
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="We identify and document the legal basis for all data processing activities"
                secondary="Such as consent, contractual necessity, legal obligation, vital interests, public interest, or legitimate interests"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="We provide clear privacy notices at data collection points"
                secondary="Explaining what data is collected and how it will be used"
              />
            </ListItem>
          </List>
          
          <Typography variant="h6" sx={sectionHeaderStyle}>
            2.2 Purpose Limitation
          </Typography>
          <Typography variant="body1" paragraph>
            Personal data shall be collected for specified, explicit, and legitimate purposes and not further processed in a manner incompatible with those purposes.
          </Typography>
          
          <Typography variant="h6" sx={sectionHeaderStyle}>
            2.3 Data Minimization
          </Typography>
          <Typography variant="body1" paragraph>
            Personal data shall be adequate, relevant, and limited to what is necessary in relation to the purposes for which they are processed.
          </Typography>
          
          <Typography variant="h6" sx={sectionHeaderStyle}>
            2.4 Accuracy
          </Typography>
          <Typography variant="body1" paragraph>
            Personal data shall be accurate and, where necessary, kept up to date; every reasonable step must be taken to ensure that inaccurate data is erased or rectified without delay.
          </Typography>
          
          <Typography variant="h6" sx={sectionHeaderStyle}>
            2.5 Storage Limitation
          </Typography>
          <Typography variant="body1" paragraph>
            Personal data shall be kept in a form which permits identification of data subjects for no longer than is necessary for the purposes for which the personal data are processed.
          </Typography>
          
          <Typography variant="h6" sx={sectionHeaderStyle}>
            2.6 Integrity and Confidentiality
          </Typography>
          <Typography variant="body1" paragraph>
            Personal data shall be processed in a manner that ensures appropriate security of the personal data, including protection against unauthorized or unlawful processing and against accidental loss, destruction, or damage.
          </Typography>
          
          <Typography variant="h6" sx={sectionHeaderStyle}>
            2.7 Accountability
          </Typography>
          <Typography variant="body1" paragraph>
            The organization shall be responsible for, and be able to demonstrate compliance with, all the above principles.
          </Typography>
        </AccordionDetails>
      </Accordion>
      
      <Accordion 
        expanded={expandedSection === 'panel3'} 
        onChange={handleAccordionChange('panel3')}
        elevation={1}
        sx={{ mb: 2 }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3-content"
          id="panel3-header"
          sx={{ backgroundColor: '#f5f5f5' }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <PersonOutlineIcon sx={{ mr: 1, color: '#003366' }} />
            <Typography variant="h6">3. Rights of Data Subjects</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1" paragraph>
            The organization recognizes and upholds the rights of data subjects under the GDPR. These include:
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ mb: 2, height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" sx={sectionHeaderStyle}>
                    Right to Information
                  </Typography>
                  <Typography variant="body2">
                    Data subjects have the right to be informed about the collection and use of their personal data. This includes information about the purposes of processing, retention periods, and who the data will be shared with.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ mb: 2, height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" sx={sectionHeaderStyle}>
                    Right of Access
                  </Typography>
                  <Typography variant="body2">
                    Data subjects have the right to request a copy of any personal data the organization holds about them and supplementary information about how it is processed.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ mb: 2, height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" sx={sectionHeaderStyle}>
                    Right to Rectification
                  </Typography>
                  <Typography variant="body2">
                    Data subjects have the right to have inaccurate personal data rectified or completed if it is incomplete.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ mb: 2, height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" sx={sectionHeaderStyle}>
                    Right to Erasure
                  </Typography>
                  <Typography variant="body2">
                    Also known as the 'right to be forgotten', this right allows data subjects to request the deletion of their personal data in specific circumstances.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ mb: 2, height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" sx={sectionHeaderStyle}>
                    Right to Restriction of Processing
                  </Typography>
                  <Typography variant="body2">
                    Data subjects have the right to request the restriction or suppression of their personal data in certain circumstances.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ mb: 2, height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" sx={sectionHeaderStyle}>
                    Right to Data Portability
                  </Typography>
                  <Typography variant="body2">
                    Data subjects have the right to obtain and reuse their personal data for their own purposes across different services.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ mb: 2, height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" sx={sectionHeaderStyle}>
                    Right to Object
                  </Typography>
                  <Typography variant="body2">
                    Data subjects have the right to object to the processing of their personal data in certain circumstances, including direct marketing.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ mb: 2, height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" sx={sectionHeaderStyle}>
                    Rights Related to Automated Decision Making
                  </Typography>
                  <Typography variant="body2">
                    Data subjects have rights related to automated individual decision-making and profiling, including the right not to be subject to decisions based solely on automated processing.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
      
      <Accordion 
        expanded={expandedSection === 'panel4'} 
        onChange={handleAccordionChange('panel4')}
        elevation={1}
        sx={{ mb: 2 }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel4-content"
          id="panel4-header"
          sx={{ backgroundColor: '#f5f5f5' }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TimelineIcon sx={{ mr: 1, color: '#003366' }} />
            <Typography variant="h6">4. Data Protection Impact Assessments</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1" paragraph>
            A Data Protection Impact Assessment (DPIA) is a process to help identify and minimize the data protection risks of a project. The organization will conduct DPIAs for processing that is likely to result in a high risk to individuals, including:
          </Typography>
          
          <List>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Systematic and extensive profiling with significant effects"
                secondary="Such as automated processing that significantly affects individuals"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Processing of special category data or criminal offense data on a large scale"
                secondary="Including data about health, ethnicity, biometric data, etc."
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Systematic monitoring of a publicly accessible area on a large scale"
                secondary="Such as surveillance systems in public spaces"
              />
            </ListItem>
          </List>
          
          <Typography variant="body1" paragraph>
            The DPIA process will:
          </Typography>
          
          <List>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Describe the nature, scope, context, and purposes of the processing" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Assess necessity, proportionality, and compliance measures" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Identify and assess risks to individuals" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Identify any additional measures to mitigate those risks" />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>
      
      <Accordion 
        expanded={expandedSection === 'panel5'} 
        onChange={handleAccordionChange('panel5')}
        elevation={1}
        sx={{ mb: 2 }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel5-content"
          id="panel5-header"
          sx={{ backgroundColor: '#f5f5f5' }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <BlockIcon sx={{ mr: 1, color: '#003366' }} />
            <Typography variant="h6">5. Data Breach Response Plan</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1" paragraph>
            A personal data breach is a breach of security leading to the accidental or unlawful destruction, loss, alteration, unauthorized disclosure of, or access to, personal data. The organization has implemented a comprehensive data breach response plan to ensure that any breaches are handled appropriately.
          </Typography>
          
          <Typography variant="h6" sx={sectionHeaderStyle}>
            5.1 Breach Detection and Containment
          </Typography>
          <Typography variant="body1" paragraph>
            All staff are trained to recognize and report suspected data breaches to the Data Protection Officer immediately. Upon detection of a breach, immediate steps will be taken to:
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Contain the breach and prevent further unauthorized access" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Recover lost data where possible" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Assess the potential adverse consequences for individuals" />
            </ListItem>
          </List>
          
          <Typography variant="h6" sx={sectionHeaderStyle}>
            5.2 Notification to Authorities
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: '#B31B1B' }}>
            Under the GDPR, certain types of personal data breaches must be reported to the relevant supervisory authority within 72 hours of becoming aware of the breach. The Data Protection Officer will assess whether notification is required and will coordinate the notification process.
          </Typography>
          
          <Typography variant="h6" sx={sectionHeaderStyle}>
            5.3 Notification to Affected Individuals
          </Typography>
          <Typography variant="body1" paragraph>
            When a personal data breach is likely to result in a high risk to the rights and freedoms of individuals, the organization will notify those individuals without undue delay. The notification will include:
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="A description of the nature of the breach" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="The name and contact details of the Data Protection Officer" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="A description of the likely consequences of the breach" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="A description of the measures taken or proposed to address the breach" />
            </ListItem>
          </List>
          
          <Typography variant="h6" sx={sectionHeaderStyle}>
            5.4 Documentation
          </Typography>
          <Typography variant="body1" paragraph>
            The organization will document all breaches, regardless of whether they are reported to a supervisory authority. This documentation includes:
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Facts relating to the breach" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Effects of the breach" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Remedial action taken" />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>
      
      {/* Policy Actions */}
      <Box sx={{ mt: 4, display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<CheckCircleIcon />}
          onClick={handleAcknowledge}
          sx={{
            backgroundColor: '#003366',
            '&:hover': {
              backgroundColor: '#00264d'
            }
          }}
        >
          Acknowledge Policy
        </Button>
        
        <Button
          variant="outlined"
          color="primary"
          onClick={handleDownload}
        >
          Download PDF
        </Button>
        
        <Button
          variant="text"
          color="primary"
          component={RouterLink}
          to="/policy"
        >
          View All Policies
        </Button>
      </Box>
      
      {/* Footer with additional info */}
      <Paper sx={{ p: 3, mt: 4, bgcolor: '#f5f5f5' }} elevation={0}>
        <Typography variant="body2" color="text.secondary" align="center">
          For questions or concerns about this policy, please contact the Data Protection Officer at dpo@example.com or +1 (555) 123-4567.
        </Typography>
      </Paper>
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity="success"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default GDPRPolicy;
