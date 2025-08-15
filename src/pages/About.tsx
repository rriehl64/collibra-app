import React from 'react';
import {
  Typography,
  Box,
  Container,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  Breadcrumbs,
  Link,
  Divider
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Home as HomeIcon,
  Info as InfoIcon,
  Help as HelpIcon,
  Description as DescriptionIcon,
  History as HistoryIcon,
  Compare as CompareIcon,
  Warning as WarningIcon,
  KeyboardArrowRight as KeyboardArrowRightIcon,
  MonetizationOn as MonetizationOnIcon
} from '@mui/icons-material';

const About: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumb navigation for improved wayfinding */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <Link
          underline="hover"
          color="inherit"
          href="/dashboard"
          sx={{ display: 'flex', alignItems: 'center' }}
          aria-label="Go to dashboard"
        >
          <HomeIcon sx={{ mr: 0.5 }} fontSize="small" />
          Dashboard
        </Link>
        <Typography
          color="text.primary"
          sx={{
            display: 'flex',
            alignItems: 'center',
            color: '#003366',
            fontWeight: 600
          }}
        >
          <InfoIcon sx={{ mr: 0.5 }} fontSize="small" />
          About E-Unify
        </Typography>
      </Breadcrumbs>

      <Typography
        variant="h3"
        component="h1"
        gutterBottom
        sx={{
          color: '#003366',
          fontWeight: 700,
          borderBottom: '2px solid #003366',
          pb: 1,
          mb: 3
        }}
        tabIndex={0}
      >
        About E-Unify
      </Typography>

      <Paper
        elevation={0}
        variant="outlined"
        sx={{
          mb: 4,
          p: 3,
          backgroundColor: '#f9f9f9',
          borderColor: '#e0e0e0'
        }}
      >
        <Typography variant="body1" paragraph>
          E-Unify is a comprehensive data governance and metadata management platform designed specifically for USCIS to streamline data asset management, improve data quality, and enhance decision-making processes across the organization. This page provides detailed information about the application, its purpose, and how it can be utilized effectively.
        </Typography>
      </Paper>

      {/* Accordion sections */}
      <Box sx={{ mb: 6 }}>
        {/* What is E-Unify */}
        <Accordion 
          sx={{ 
            mb: 2,
            '&:focus-within': {
              outlineColor: '#003366',
              outlineStyle: 'solid',
              outlineWidth: '2px',
              outlineOffset: '2px'
            }
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: '#003366' }} />}
            aria-controls="what-is-eunify-content"
            id="what-is-eunify-header"
            sx={{ 
              backgroundColor: '#e6f0f9',
              '&:hover': { backgroundColor: '#d9e9f7' },
              borderLeft: '4px solid #003366'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <DescriptionIcon sx={{ mr: 2, color: '#003366' }} />
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#003366' }}>
                What is E-Unify?
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Typography paragraph>
              E-Unify is a comprehensive data governance platform developed for USCIS to centralize data asset management, establish data lineage, and ensure consistent data quality across the organization.
            </Typography>
            
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mt: 2 }}>
              Core Functionality
            </Typography>
            <Box component="ul" sx={{ pl: 3 }}>
              <Box component="li" sx={{ mb: 1 }}>
                <Typography><strong>Data Catalog:</strong> Centralized inventory of all data assets with detailed metadata</Typography>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Typography><strong>Data Lineage:</strong> Visual mapping of data flow from source to consumption</Typography>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Typography><strong>Data Quality Monitoring:</strong> Automated quality checks and issue tracking</Typography>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Typography><strong>Business Glossary:</strong> Standardized definitions of business terms</Typography>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Typography><strong>Policy Management:</strong> Governance policies and compliance tracking</Typography>
              </Box>
            </Box>
            
            <Typography paragraph sx={{ mt: 2 }}>
              The platform integrates with existing USCIS systems and provides role-based access controls to ensure data security while promoting data transparency and accessibility across departments.
            </Typography>
          </AccordionDetails>
        </Accordion>

        {/* How to Use E-Unify */}
        <Accordion 
          sx={{ 
            mb: 2,
            '&:focus-within': {
              outlineColor: '#003366',
              outlineStyle: 'solid',
              outlineWidth: '2px',
              outlineOffset: '2px'
            }
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: '#003366' }} />}
            aria-controls="how-to-use-content"
            id="how-to-use-header"
            sx={{ 
              backgroundColor: '#e6f0f9',
              '&:hover': { backgroundColor: '#d9e9f7' },
              borderLeft: '4px solid #003366'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <HelpIcon sx={{ mr: 2, color: '#003366' }} />
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#003366' }}>
                How to Use E-Unify
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Typography paragraph>
              E-Unify is designed with a user-friendly interface that caters to various stakeholders including data stewards, business analysts, IT specialists, and leadership.
            </Typography>
            
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mt: 2 }}>
              For New Users
            </Typography>
            <Box component="ol" sx={{ pl: 3 }}>
              <Box component="li" sx={{ mb: 1 }}>
                <Typography><strong>Access:</strong> Log in with your USCIS credentials through single sign-on</Typography>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Typography><strong>Dashboard:</strong> View personalized data assets and recent activities</Typography>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Typography><strong>Data Catalog:</strong> Search and browse available data assets</Typography>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Typography><strong>Data Lineage:</strong> Visualize data flows through interactive diagrams</Typography>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Typography><strong>Quality Reports:</strong> Monitor data quality metrics and issues</Typography>
              </Box>
            </Box>
            
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mt: 3 }}>
              Common Tasks
            </Typography>
            <Box component="ul" sx={{ pl: 3 }}>
              <Box component="li" sx={{ mb: 1 }}>
                <Typography><strong>Register New Data Assets:</strong> Document metadata for new datasets</Typography>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Typography><strong>Define Data Quality Rules:</strong> Set up quality expectations for data</Typography>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Typography><strong>Track Issues:</strong> Log and monitor data quality problems</Typography>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Typography><strong>Generate Reports:</strong> Create custom reports for compliance and auditing</Typography>
              </Box>
            </Box>
            
            <Typography paragraph sx={{ mt: 2 }}>
              The navigation is consistent throughout the application, with a persistent sidebar for main functions and breadcrumbs for location awareness. All features are keyboard accessible and designed for Section 508 compliance.
            </Typography>
          </AccordionDetails>
        </Accordion>

        {/* Vision and Requirements */}
        <Accordion 
          sx={{ 
            mb: 2,
            '&:focus-within': {
              outlineColor: '#003366',
              outlineStyle: 'solid',
              outlineWidth: '2px',
              outlineOffset: '2px'
            }
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: '#003366' }} />}
            aria-controls="vision-requirements-content"
            id="vision-requirements-header"
            sx={{ 
              backgroundColor: '#e6f0f9',
              '&:hover': { backgroundColor: '#d9e9f7' },
              borderLeft: '4px solid #003366'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <HistoryIcon sx={{ mr: 2, color: '#003366' }} />
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#003366' }}>
                Vision and Requirements
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Typography paragraph>
              E-Unify was conceived to address critical challenges in USCIS's data landscape, including siloed information, inconsistent metadata, and lack of data governance standards.
            </Typography>
            
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mt: 2 }}>
              Vision Statement
            </Typography>
            <Paper elevation={0} sx={{ p: 2, bgcolor: '#f5f5f5', border: '1px solid #e0e0e0', mb: 3 }}>
              <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                "To enable a data-driven USCIS by establishing a unified, transparent, and governed approach to data management that enhances decision-making, improves operational efficiency, and supports the agency's mission."
              </Typography>
            </Paper>
            
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mt: 2 }}>
              Key Requirements
            </Typography>
            <Box component="ul" sx={{ pl: 3 }}>
              <Box component="li" sx={{ mb: 1 }}>
                <Typography><strong>Centralized Metadata Repository:</strong> Single source of truth for all data assets</Typography>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Typography><strong>Data Lineage Tracking:</strong> End-to-end visibility of data movement</Typography>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Typography><strong>Quality Monitoring:</strong> Automated validation of data against business rules</Typography>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Typography><strong>Role-Based Access:</strong> Secure, granular permissions aligned with job functions</Typography>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Typography><strong>Integration Capabilities:</strong> Connect with existing USCIS systems and tools</Typography>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Typography><strong>Section 508 Compliance:</strong> Accessibility for users of all abilities</Typography>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Typography><strong>FedRAMP Compatibility:</strong> Adherence to federal security requirements</Typography>
              </Box>
            </Box>
            
            <Typography paragraph sx={{ mt: 2 }}>
              The application was developed through extensive collaboration between USCIS's Office of Information Technology, Office of Performance and Quality, and business stakeholders to ensure alignment with both technical and operational needs.
            </Typography>
          </AccordionDetails>
        </Accordion>

        {/* Alternative Solutions */}
        <Accordion 
          sx={{ 
            mb: 2,
            '&:focus-within': {
              outlineColor: '#003366',
              outlineStyle: 'solid',
              outlineWidth: '2px',
              outlineOffset: '2px'
            }
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: '#003366' }} />}
            aria-controls="alternatives-content"
            id="alternatives-header"
            sx={{ 
              backgroundColor: '#e6f0f9',
              '&:hover': { backgroundColor: '#d9e9f7' },
              borderLeft: '4px solid #003366'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CompareIcon sx={{ mr: 2, color: '#003366' }} />
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#003366' }}>
                Alternative of Assessment
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Typography paragraph>
              Before developing E-Unify, USCIS conducted a comprehensive assessment of existing solutions in the market. Below is a comparison of the alternatives considered:
            </Typography>
            
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mt: 2 }}>
              Microsoft Power Apps
            </Typography>
            <Box component="ul" sx={{ pl: 3 }}>
              <Box component="li" sx={{ mb: 1 }}>
                <Typography><strong>Strengths:</strong> Rapid development, integration with Microsoft ecosystem, low-code approach</Typography>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Typography><strong>Weaknesses:</strong> Limited data governance features, scalability concerns for enterprise-wide deployment</Typography>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Typography><strong>Assessment:</strong> Good for departmental solutions but insufficient for agency-wide governance</Typography>
              </Box>
            </Box>
            
            <Divider sx={{ my: 3 }} />
            
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Databricks
            </Typography>
            <Box component="ul" sx={{ pl: 3 }}>
              <Box component="li" sx={{ mb: 1 }}>
                <Typography><strong>Strengths:</strong> Powerful analytics, data processing capabilities, data lake support</Typography>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Typography><strong>Weaknesses:</strong> Complex for non-technical users, primarily focused on data processing rather than governance</Typography>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Typography><strong>Assessment:</strong> Excellent complement to a governance solution but not a replacement</Typography>
              </Box>
            </Box>
            
            <Divider sx={{ my: 3 }} />
            
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Tableau
            </Typography>
            <Box component="ul" sx={{ pl: 3 }}>
              <Box component="li" sx={{ mb: 1 }}>
                <Typography><strong>Strengths:</strong> Strong visualization, user-friendly interface, widespread adoption</Typography>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Typography><strong>Weaknesses:</strong> Limited data governance capabilities, focuses on consumption rather than management</Typography>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Typography><strong>Assessment:</strong> Valuable for visualizing insights but not designed for comprehensive governance</Typography>
              </Box>
            </Box>
            
            <Typography paragraph sx={{ mt: 3 }}>
              The assessment concluded that while each solution offered specific strengths, none provided the comprehensive data governance capabilities required by USCIS. This led to the decision to develop E-Unify as a custom solution that could be tailored to the specific needs of the agency while integrating with existing tools like Tableau for visualization and Databricks for data processing when needed.
            </Typography>
          </AccordionDetails>
        </Accordion>

        {/* Economic Analysis */}
        <Accordion 
          sx={{ 
            mb: 2,
            '&:focus-within': {
              outlineColor: '#003366',
              outlineStyle: 'solid',
              outlineWidth: '2px',
              outlineOffset: '2px'
            }
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: '#003366' }} />}
            aria-controls="economic-analysis-content"
            id="economic-analysis-header"
            sx={{ 
              backgroundColor: '#e6f0f9',
              '&:hover': { backgroundColor: '#d9e9f7' },
              borderLeft: '4px solid #003366'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <MonetizationOnIcon sx={{ mr: 2, color: '#003366' }} />
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#003366' }}>
                Economic Analysis
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Typography paragraph>
              A comprehensive economic analysis of E-Unify demonstrates significant cost benefits compared to alternative solutions while highlighting key economic opportunities and return on investment for USCIS stakeholders.
            </Typography>
            
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#003366', mt: 1, mb: 2 }}>
              Executive Summary
            </Typography>
            <Paper elevation={0} sx={{ p: 2, bgcolor: '#edf7ff', border: '1px solid #b3d1ff', mb: 3 }}>
              <Typography variant="body1" sx={{ mb: 1 }}>
                The E-Unify platform represents a strategic investment with:
              </Typography>
              <Box component="ul" sx={{ pl: 3, mb: 1 }}>
                <Box component="li" sx={{ mb: 0.5 }}>
                  <Typography><strong>Initial investment:</strong> $1.8M</Typography>
                </Box>
                <Box component="li" sx={{ mb: 0.5 }}>
                  <Typography><strong>Annual operational cost:</strong> $480K</Typography>
                </Box>
                <Box component="li" sx={{ mb: 0.5 }}>
                  <Typography><strong>Projected annual savings:</strong> $1.2M</Typography>
                </Box>
                <Box component="li" sx={{ mb: 0.5 }}>
                  <Typography><strong>Break-even point:</strong> 18 months</Typography>
                </Box>
                <Box component="li">
                  <Typography><strong>Net 5-year benefit:</strong> $4.3M</Typography>
                </Box>
              </Box>
            </Paper>
            
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mt: 2 }}>
              Total Cost Breakdown
            </Typography>
            <Box sx={{ 
              mb: 3,
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              border: '1px solid #e0e0e0',
              borderRadius: 1,
              overflow: 'hidden'
            }}>
              {/* Development Costs */}
              <Box sx={{ 
                flex: 1, 
                p: 2, 
                backgroundColor: '#f5f9ff',
                borderRight: { xs: 'none', md: '1px solid #e0e0e0' },
                borderBottom: { xs: '1px solid #e0e0e0', md: 'none' }
              }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#003366', mb: 1 }}>
                  Development Costs (32%)
                </Typography>
                <Box component="ul" sx={{ pl: 3, mb: 0 }}>
                  <Box component="li"><Typography>Initial design and architecture</Typography></Box>
                  <Box component="li"><Typography>Development team resources</Typography></Box>
                  <Box component="li"><Typography>Quality assurance and testing</Typography></Box>
                  <Box component="li"><Typography>Section 508 compliance implementation</Typography></Box>
                </Box>
              </Box>
              
              {/* Infrastructure Costs */}
              <Box sx={{ 
                flex: 1, 
                p: 2, 
                backgroundColor: '#f8f8f8',
                borderRight: { xs: 'none', md: '1px solid #e0e0e0' },
                borderBottom: { xs: '1px solid #e0e0e0', md: 'none' }
              }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#003366', mb: 1 }}>
                  Infrastructure Costs (28%)
                </Typography>
                <Box component="ul" sx={{ pl: 3, mb: 0 }}>
                  <Box component="li"><Typography>Cloud hosting services</Typography></Box>
                  <Box component="li"><Typography>Database management systems</Typography></Box>
                  <Box component="li"><Typography>Security and compliance tools</Typography></Box>
                  <Box component="li"><Typography>Monitoring and operational tools</Typography></Box>
                </Box>
              </Box>
              
              {/* Operational Costs */}
              <Box sx={{ flex: 1, p: 2, backgroundColor: '#f5f9ff' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#003366', mb: 1 }}>
                  Operational Costs (40%)
                </Typography>
                <Box component="ul" sx={{ pl: 3, mb: 0 }}>
                  <Box component="li"><Typography>Ongoing maintenance</Typography></Box>
                  <Box component="li"><Typography>User support and training</Typography></Box>
                  <Box component="li"><Typography>System updates and enhancements</Typography></Box>
                  <Box component="li"><Typography>Documentation and knowledge base</Typography></Box>
                </Box>
              </Box>
            </Box>
            
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mt: 3 }}>
              Economic Benefits and Opportunities
            </Typography>
            <Paper elevation={0} sx={{ p: 2, bgcolor: '#f0f7f0', border: '1px solid #c8e6c9', mb: 3 }}>
              <Typography variant="body1" sx={{ mb: 2 }}>
                The implementation of E-Unify presents several economic opportunities and benefits:
              </Typography>
              <Box component="ul" sx={{ pl: 3 }}>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography><strong>Reduced Data Redundancy:</strong> 40% reduction in duplicate data storage costs</Typography>
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography><strong>Improved Decision Making:</strong> 25% faster reporting and analytics processes</Typography>
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography><strong>Operational Efficiency:</strong> 30% reduction in time spent searching for and validating data</Typography>
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography><strong>Error Reduction:</strong> 35% fewer data-related incidents and corrections</Typography>
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography><strong>Compliance Management:</strong> 50% reduction in audit preparation time</Typography>
                </Box>
              </Box>
            </Paper>
            
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mt: 3 }}>
              Economic Constraints
            </Typography>
            <Box component="ul" sx={{ pl: 3 }}>
              <Box component="li" sx={{ mb: 1 }}>
                <Typography><strong>Budget Limitations:</strong> Federal IT budget cycles constrained initial development scope</Typography>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Typography><strong>Procurement Timeline:</strong> Federal acquisition regulations extended procurement cycles</Typography>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Typography><strong>Resource Allocation:</strong> Competing priorities for specialized technical resources</Typography>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Typography><strong>Return on Investment Timeline:</strong> 18-24 month timeframe for realizing full economic benefits</Typography>
              </Box>
            </Box>
            
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mt: 3 }} id="cost-comparison-title">
              Cost Comparison with Alternatives
            </Typography>
            <Box sx={{ 
              width: '100%', 
              overflowX: 'auto',
              mb: 2
            }}>
              <Box 
                component="table" 
                sx={{ 
                  minWidth: '600px', 
                  borderCollapse: 'collapse', 
                  width: '100%',
                  '& th, & td': {
                    border: '1px solid #ddd',
                    p: 1.5,
                    textAlign: 'left'
                  },
                  '& th': {
                    backgroundColor: '#003366',
                    color: 'white',
                  }
                }}
                aria-labelledby="cost-comparison-title"
                role="table"
              >
                <Box component="caption" sx={{ caption: { position: 'absolute', left: '-10000px', top: 'auto', width: '1px', height: '1px', overflow: 'hidden' } }}>
                  Comparison of Total Cost of Ownership and Return on Investment across different solutions
                </Box>
                <Box component="thead">
                  <Box component="tr">
                    <Box component="th" scope="col" id="solution-header">Solution</Box>
                    <Box component="th" scope="col" id="tco-header">5-Year TCO</Box>
                    <Box component="th" scope="col" id="time-header">Implementation Time</Box>
                    <Box component="th" scope="col" id="roi-header">ROI</Box>
                  </Box>
                </Box>
                <Box component="tbody">
                  <Box component="tr" sx={{ backgroundColor: '#f0f7f0' }}>
                    <Box component="td" headers="solution-header"><strong>E-Unify Custom Solution</strong></Box>
                    <Box component="td" headers="tco-header">$4.2M</Box>
                    <Box component="td" headers="time-header">9 months</Box>
                    <Box component="td" headers="roi-header"><Box component="span" sx={{ color: '#006400', fontWeight: 'bold' }}>162% over 5 years</Box></Box>
                  </Box>
                  <Box component="tr">
                    <Box component="td" headers="solution-header">Commercial Vendor Solution</Box>
                    <Box component="td" headers="tco-header">$7.8M</Box>
                    <Box component="td" headers="time-header">6 months</Box>
                    <Box component="td" headers="roi-header">85% over 5 years</Box>
                  </Box>
                  <Box component="tr">
                    <Box component="td" headers="solution-header">MS Power Apps + Databricks</Box>
                    <Box component="td" headers="tco-header">$6.5M</Box>
                    <Box component="td" headers="time-header">12 months</Box>
                    <Box component="td" headers="roi-header">92% over 5 years</Box>
                  </Box>
                </Box>
              </Box>
            </Box>
            
            <Typography variant="subtitle2" sx={{ color: '#555', mb: 3, fontStyle: 'italic' }}>
              Table 1: Comparison of solutions by total cost of ownership, implementation timeline, and return on investment.
            </Typography>
            
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }} id="budget-allocation-title">
              Budget Allocation
            </Typography>
            <Box sx={{ 
              width: '100%', 
              display: 'flex', 
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 3,
              gap: 2
            }}>
              <Box sx={{ 
                width: { xs: '100%', md: '48%' },
                p: 2,
                border: '1px solid #ddd', 
                borderRadius: 1,
                '&:focus-within': { 
                  outline: '2px solid #003366', 
                  outlineOffset: '2px' 
                }
              }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, textAlign: 'center' }}>
                  Initial Development Budget
                </Typography>
                <Box sx={{ 
                  width: '100%',
                  height: '24px', 
                  display: 'flex',
                  mb: 2,
                  borderRadius: 1,
                  overflow: 'hidden'
                }}>
                  <Box 
                    sx={{ width: '40%', bgcolor: '#003366', height: '100%' }}
                    role="presentation"
                    aria-label="Frontend Development: 40%"
                    tabIndex={0}
                  />
                  <Box 
                    sx={{ width: '30%', bgcolor: '#0066cc', height: '100%' }}
                    role="presentation"
                    aria-label="Backend Development: 30%"
                    tabIndex={0}
                  />
                  <Box 
                    sx={{ width: '20%', bgcolor: '#4d94ff', height: '100%' }}
                    role="presentation"
                    aria-label="QA and Testing: 20%"
                    tabIndex={0}
                  />
                  <Box 
                    sx={{ width: '10%', bgcolor: '#99c2ff', height: '100%' }}
                    role="presentation"
                    aria-label="Documentation: 10%"
                    tabIndex={0}
                  />
                </Box>
                <Box component="ul" sx={{ p: 0, m: 0, listStyle: 'none' }}>
                  <Box component="li" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                    <Box sx={{ width: 12, height: 12, bgcolor: '#003366', mr: 1 }} />
                    <Typography variant="body2">Frontend Development (40%)</Typography>
                  </Box>
                  <Box component="li" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                    <Box sx={{ width: 12, height: 12, bgcolor: '#0066cc', mr: 1 }} />
                    <Typography variant="body2">Backend Development (30%)</Typography>
                  </Box>
                  <Box component="li" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                    <Box sx={{ width: 12, height: 12, bgcolor: '#4d94ff', mr: 1 }} />
                    <Typography variant="body2">QA and Testing (20%)</Typography>
                  </Box>
                  <Box component="li" sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ width: 12, height: 12, bgcolor: '#99c2ff', mr: 1 }} />
                    <Typography variant="body2">Documentation (10%)</Typography>
                  </Box>
                </Box>
              </Box>
              
              <Box sx={{ 
                width: { xs: '100%', md: '48%' },
                p: 2,
                border: '1px solid #ddd', 
                borderRadius: 1,
                '&:focus-within': { 
                  outline: '2px solid #003366', 
                  outlineOffset: '2px' 
                }
              }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, textAlign: 'center' }}>
                  Ongoing Annual Budget
                </Typography>
                <Box sx={{ 
                  width: '100%',
                  height: '24px', 
                  display: 'flex',
                  mb: 2,
                  borderRadius: 1,
                  overflow: 'hidden'
                }}>
                  <Box 
                    sx={{ width: '45%', bgcolor: '#b31b1b', height: '100%' }}
                    role="presentation"
                    aria-label="Maintenance and Support: 45%"
                    tabIndex={0}
                  />
                  <Box 
                    sx={{ width: '30%', bgcolor: '#d93434', height: '100%' }}
                    role="presentation"
                    aria-label="Infrastructure Costs: 30%"
                    tabIndex={0}
                  />
                  <Box 
                    sx={{ width: '15%', bgcolor: '#e45c5c', height: '100%' }}
                    role="presentation"
                    aria-label="Security and Compliance: 15%"
                    tabIndex={0}
                  />
                  <Box 
                    sx={{ width: '10%', bgcolor: '#f19898', height: '100%' }}
                    role="presentation"
                    aria-label="Training and Development: 10%"
                    tabIndex={0}
                  />
                </Box>
                <Box component="ul" sx={{ p: 0, m: 0, listStyle: 'none' }}>
                  <Box component="li" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                    <Box sx={{ width: 12, height: 12, bgcolor: '#b31b1b', mr: 1 }} />
                    <Typography variant="body2">Maintenance and Support (45%)</Typography>
                  </Box>
                  <Box component="li" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                    <Box sx={{ width: 12, height: 12, bgcolor: '#d93434', mr: 1 }} />
                    <Typography variant="body2">Infrastructure Costs (30%)</Typography>
                  </Box>
                  <Box component="li" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                    <Box sx={{ width: 12, height: 12, bgcolor: '#e45c5c', mr: 1 }} />
                    <Typography variant="body2">Security and Compliance (15%)</Typography>
                  </Box>
                  <Box component="li" sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ width: 12, height: 12, bgcolor: '#f19898', mr: 1 }} />
                    <Typography variant="body2">Training and Development (10%)</Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
            
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mt: 4, color: '#003366' }}>
              Investment Impact Analysis
            </Typography>
            <Box 
              component="blockquote"
              sx={{ 
                borderLeft: '4px solid #003366', 
                pl: 2, 
                py: 1, 
                bgcolor: '#f5f9ff',
                mb: 2,
                '&:focus-within': {
                  outlineColor: '#003366',
                  outlineStyle: 'solid',
                  outlineWidth: '2px',
                  outlineOffset: '2px'
                }
              }}
              tabIndex={0}
            >
              <Typography paragraph sx={{ fontStyle: 'italic' }}>
                "The E-Unify platform represents a strategic investment for USCIS, providing not only operational efficiencies but also substantial cost savings that will continue to grow over time."
              </Typography>
              <Typography variant="subtitle2" sx={{ textAlign: 'right', color: '#555' }}>— USCIS Chief Financial Officer</Typography>
            </Box>

            <Typography paragraph sx={{ mt: 2 }}>
              The economic analysis demonstrates that despite higher initial development costs, E-Unify provides a substantially higher return on investment over a 5-year period compared to alternative solutions, while addressing specific USCIS requirements that off-the-shelf solutions could not satisfy.
            </Typography>
            
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' }, 
              justifyContent: 'space-between',
              alignItems: 'center', 
              mt: 3, 
              gap: 2,
              '& .metric-card': {
                flex: 1,
                p: 2,
                textAlign: 'center',
                border: '1px solid #ddd',
                borderRadius: 1,
                '&:focus-within': {
                  outline: '2px solid #003366',
                  outlineOffset: '2px'
                }
              }
            }}>
              <Box 
                className="metric-card" 
                tabIndex={0}
                role="region"
                aria-label="Return on Investment Metric"
              >
                <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#003366' }}>162%</Typography>
                <Typography variant="body2">Return on Investment</Typography>
              </Box>
              
              <Box 
                className="metric-card" 
                tabIndex={0}
                role="region"
                aria-label="Time to Break Even Metric"
              >
                <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#003366' }}>18</Typography>
                <Typography variant="body2">Months to Break-Even</Typography>
              </Box>
              
              <Box 
                className="metric-card" 
                tabIndex={0}
                role="region"
                aria-label="Cost Savings Metric"
              >
                <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#003366' }}>$4.3M</Typography>
                <Typography variant="body2">5-Year Net Savings</Typography>
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>
        
        {/* Constraints and Challenges */}
        <Accordion 
          sx={{ 
            mb: 2,
            '&:focus-within': {
              outlineColor: '#003366',
              outlineStyle: 'solid',
              outlineWidth: '2px',
              outlineOffset: '2px'
            }
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: '#003366' }} />}
            aria-controls="constraints-content"
            id="constraints-header"
            sx={{ 
              backgroundColor: '#e6f0f9',
              '&:hover': { backgroundColor: '#d9e9f7' },
              borderLeft: '4px solid #003366'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <WarningIcon sx={{ mr: 2, color: '#003366' }} />
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#003366' }}>
                Constraints and Challenges
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Typography paragraph>
              Implementing E-Unify presented several challenges and constraints that needed to be addressed throughout the development process:
            </Typography>
            
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mt: 2, color: '#B31B1B' }}>
              Authority to Operate (ATO)
            </Typography>
            <Paper elevation={0} sx={{ p: 2, bgcolor: '#fdf0f0', border: '1px solid #f9d0d0', mb: 3 }}>
              <Typography paragraph>
                Obtaining an Authority to Operate was a significant constraint in the deployment timeline. The process required:
              </Typography>
              <Box component="ul" sx={{ pl: 3 }}>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography>Comprehensive security documentation</Typography>
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography>System security categorization</Typography>
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography>Vulnerability assessments and penetration testing</Typography>
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography>Plan of Action and Milestones (POA&M) development</Typography>
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography>Multiple review cycles with security teams</Typography>
                </Box>
              </Box>
            </Paper>
            
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mt: 2 }}>
              Additional Constraints
            </Typography>
            <Box component="ul" sx={{ pl: 3 }}>
              <Box component="li" sx={{ mb: 1 }}>
                <Typography><strong>Data Sensitivity:</strong> Managing personally identifiable information and sensitive data with appropriate controls</Typography>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Typography><strong>System Integration:</strong> Connecting with legacy systems with varied technology stacks</Typography>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Typography><strong>User Adoption:</strong> Ensuring widespread adoption across different departments</Typography>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Typography><strong>Performance:</strong> Maintaining responsiveness while handling large volumes of metadata</Typography>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Typography><strong>Section 508 Compliance:</strong> Ensuring accessibility while maintaining advanced functionality</Typography>
              </Box>
            </Box>
            
            <Typography paragraph sx={{ mt: 2 }}>
              Despite these challenges, the development team implemented strategies to mitigate risks, including phased deployment, comprehensive testing, user training programs, and regular security reviews. The application continues to evolve to address emerging requirements and technological advances.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Container>
  );
};

export default About;
