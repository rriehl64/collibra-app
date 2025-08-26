import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid,
  Card,
  CardContent,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import CategoryIcon from '@mui/icons-material/Category';
import { useAccessibility } from '../../contexts/AccessibilityContext';

const CategoryReferenceSection: React.FC = () => {
  const { settings } = useAccessibility();
  const highContrast = settings.highContrast;
  const largeText = settings.fontSize === 'large' || settings.fontSize === 'x-large';

  const textSizeProps = largeText ? { fontSize: '1.1rem' } : {};
  const headingProps = largeText ? { fontSize: '1.6rem' } : {};
  const contrastProps = highContrast ? { bgcolor: '#ffffff', color: '#000000' } : {};
  const tableHeaderBg = highContrast ? '#000000' : '#003366';

  // Sample classification codes data
  const classificationCodes = [
    { code: 'E21', description: 'Spouse of EB-1 immigrant (priority worker)', related: 'Primary applicant has E11, E12, or E13 classification' },
    { code: 'E22', description: 'Spouse of EB-2 immigrant (advanced degree professional or exceptional ability)', related: 'Primary applicant has E21 classification' },
    { code: 'E23', description: 'Child of EB-2 immigrant (advanced degree professional or exceptional ability)', related: 'Primary applicant has E21 classification' },
    { code: 'E31', description: 'Spouse of EB-3 immigrant (skilled worker or professional)', related: 'Primary applicant has E31 or E32 classification' },
    { code: 'E32', description: 'Child of EB-3 immigrant (skilled worker or professional)', related: 'Primary applicant has E31 or E32 classification' },
  ];

  // Sample EB-2 subcategories
  const eb2Subcategories = [
    { code: 'E21', description: 'Primary EB-2 immigrant (advanced degree professional or exceptional ability)', keyFeatures: 'Requires advanced degree or exceptional ability in sciences, arts, or business' },
    { code: 'E22', description: 'Spouse of EB-2 immigrant', keyFeatures: 'Must be legally married to E21 principal at time of application' },
    { code: 'E23', description: 'Child of EB-2 immigrant', keyFeatures: 'Must be under 21 and unmarried at time of application' },
  ];

  // Sample forms data
  const relatedForms = [
    { formNumber: 'I-140', name: 'Immigrant Petition for Alien Worker', relevance: 'Filed by employer for principal EB-2 applicant (E21)' },
    { formNumber: 'I-485', name: 'Application to Register Permanent Residence or Adjust Status', relevance: 'Filed by E22 spouse if in the United States' },
    { formNumber: 'I-824', name: 'Application for Action on an Approved Application or Petition', relevance: 'Used for "follow to join" cases for E22 spouses' },
    { formNumber: 'DS-260', name: 'Immigrant Visa Application', relevance: 'Filed by E22 spouse if applying from outside the U.S.' },
    { formNumber: 'I-693', name: 'Report of Medical Examination and Vaccination Record', relevance: 'Required for all E22 applicants adjusting status in the U.S.' },
  ];

  return (
    <Box>
      <Typography 
        variant="h5" 
        component="h2" 
        gutterBottom 
        sx={{ 
          color: highContrast ? '#000000' : '#003366',
          fontWeight: 'bold',
          ...headingProps
        }}
      >
        Category Reference
      </Typography>

      <Paper 
        elevation={2} 
        sx={{ 
          p: 3, 
          mb: 3,
          ...contrastProps
        }}
      >
        <Typography 
          variant="body1" 
          paragraph
          sx={{ ...textSizeProps }}
        >
          This section provides reference information about E22 classification in relation to other immigration categories, subcategories, and associated forms and documents.
        </Typography>

        <Typography 
          variant="h6" 
          gutterBottom
          sx={{ 
            color: highContrast ? '#000000' : '#003366',
            fontWeight: 'bold',
            mt: 3,
            ...textSizeProps
          }}
        >
          Related Classification Codes
        </Typography>

        <TableContainer component={Paper} sx={{ mb: 4, border: highContrast ? '1px solid #000000' : 'none' }}>
          <Table aria-label="classification codes table">
            <TableHead>
              <TableRow sx={{ bgcolor: tableHeaderBg }}>
                <TableCell sx={{ 
                  color: '#ffffff', 
                  fontWeight: 'bold',
                  ...textSizeProps 
                }}>
                  Code
                </TableCell>
                <TableCell sx={{ 
                  color: '#ffffff', 
                  fontWeight: 'bold',
                  ...textSizeProps 
                }}>
                  Description
                </TableCell>
                <TableCell sx={{ 
                  color: '#ffffff', 
                  fontWeight: 'bold',
                  ...textSizeProps 
                }}>
                  Relationship to E22
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {classificationCodes.map((row, index) => (
                <TableRow 
                  key={index}
                  sx={{ 
                    '&:nth-of-type(odd)': { 
                      bgcolor: highContrast ? '#f5f5f5' : 'rgba(0, 51, 102, 0.05)' 
                    },
                    '&:hover': {
                      bgcolor: highContrast ? '#e0e0e0' : 'rgba(0, 51, 102, 0.1)'
                    }
                  }}
                >
                  <TableCell sx={{ 
                    fontWeight: row.code === 'E22' ? 'bold' : 'normal',
                    ...textSizeProps 
                  }}>
                    {row.code}
                  </TableCell>
                  <TableCell sx={{ ...textSizeProps }}>
                    {row.description}
                  </TableCell>
                  <TableCell sx={{ ...textSizeProps }}>
                    {row.related}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Divider sx={{ my: 4 }} />
        
        <Typography 
          variant="h6" 
          gutterBottom
          sx={{ 
            color: highContrast ? '#000000' : '#003366',
            fontWeight: 'bold',
            ...textSizeProps
          }}
        >
          EB-2 Subcategories
        </Typography>

        <Grid container spacing={3} sx={{ mt: 1 }}>
          {eb2Subcategories.map((category, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card 
                variant="outlined"
                sx={{ 
                  height: '100%',
                  border: highContrast ? '1px solid #000000' : '1px solid #ccc',
                  bgcolor: category.code === 'E22' ? (highContrast ? '#f5f5f5' : 'rgba(0, 51, 102, 0.05)') : 'transparent'
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CategoryIcon sx={{ 
                      color: highContrast ? '#000000' : '#003366',
                      mr: 1
                    }} />
                    <Typography 
                      variant="h6" 
                      component="h3" 
                      sx={{ 
                        color: highContrast ? '#000000' : '#003366',
                        fontSize: largeText ? '1.3rem' : '1.15rem',
                        fontWeight: 'bold'
                      }}
                    >
                      {category.code}
                    </Typography>
                  </Box>
                  <Typography variant="body2" paragraph sx={{ ...textSizeProps }}>
                    {category.description}
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="body2" sx={{ ...textSizeProps }}>
                    <strong>Key Features:</strong> {category.keyFeatures}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 4 }} />
        
        <Typography 
          variant="h6" 
          gutterBottom
          sx={{ 
            color: highContrast ? '#000000' : '#003366',
            fontWeight: 'bold',
            ...textSizeProps
          }}
        >
          Related Forms
        </Typography>

        <TableContainer component={Paper} sx={{ border: highContrast ? '1px solid #000000' : 'none' }}>
          <Table aria-label="related forms table">
            <TableHead>
              <TableRow sx={{ bgcolor: tableHeaderBg }}>
                <TableCell sx={{ 
                  color: '#ffffff', 
                  fontWeight: 'bold',
                  ...textSizeProps 
                }}>
                  Form Number
                </TableCell>
                <TableCell sx={{ 
                  color: '#ffffff', 
                  fontWeight: 'bold',
                  ...textSizeProps 
                }}>
                  Form Name
                </TableCell>
                <TableCell sx={{ 
                  color: '#ffffff', 
                  fontWeight: 'bold',
                  ...textSizeProps 
                }}>
                  Relevance to E22
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {relatedForms.map((row, index) => (
                <TableRow 
                  key={index}
                  sx={{ 
                    '&:nth-of-type(odd)': { 
                      bgcolor: highContrast ? '#f5f5f5' : 'rgba(0, 51, 102, 0.05)' 
                    },
                    '&:hover': {
                      bgcolor: highContrast ? '#e0e0e0' : 'rgba(0, 51, 102, 0.1)'
                    }
                  }}
                >
                  <TableCell sx={{ 
                    fontWeight: 'medium',
                    ...textSizeProps 
                  }}>
                    {row.formNumber.startsWith('I-') ? (
                      <a 
                        href={`https://www.uscis.gov/${row.formNumber.toLowerCase()}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ 
                          color: highContrast ? '#000000' : '#0066cc',
                          textDecoration: 'underline'
                        }}
                        aria-label={`Form ${row.formNumber}, ${row.name} (opens in a new tab)`}
                      >
                        {row.formNumber}
                      </a>
                    ) : row.formNumber === 'DS-260' ? (
                      <a 
                        href="https://travel.state.gov/content/travel/en/us-visas/immigrate/the-immigrant-visa-process/step-1-submit-a-petition/ds-260-online-application.html" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ 
                          color: highContrast ? '#000000' : '#0066cc',
                          textDecoration: 'underline'
                        }}
                        aria-label={`Form ${row.formNumber}, ${row.name} (opens in a new tab)`}
                      >
                        {row.formNumber}
                      </a>
                    ) : (
                      row.formNumber
                    )}
                  </TableCell>
                  <TableCell sx={{ ...textSizeProps }}>
                    {row.formNumber.startsWith('I-') ? (
                      <span>
                        <a 
                          href={`https://www.uscis.gov/${row.formNumber.toLowerCase()}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{ 
                            color: highContrast ? '#000000' : '#0066cc',
                            textDecoration: 'underline'
                          }}
                          aria-label={`Form ${row.formNumber}, ${row.name} (opens in a new tab)`}
                        >
                          {row.name}
                        </a>
                      </span>
                    ) : row.formNumber === 'DS-260' ? (
                      <span>
                        <a 
                          href="https://travel.state.gov/content/travel/en/us-visas/immigrate/the-immigrant-visa-process/step-1-submit-a-petition/ds-260-online-application.html" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{ 
                            color: highContrast ? '#000000' : '#0066cc',
                            textDecoration: 'underline'
                          }}
                          aria-label={`Form ${row.formNumber}, ${row.name} (opens in a new tab)`}
                        >
                          {row.name}
                        </a>
                      </span>
                    ) : (
                      row.name
                    )}
                  </TableCell>
                  <TableCell sx={{ ...textSizeProps }}>
                    {row.relevance}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Typography 
        variant="h5" 
        component="h2" 
        gutterBottom 
        sx={{ 
          color: highContrast ? '#000000' : '#003366',
          fontWeight: 'bold',
          mt: 4,
          ...headingProps
        }}
      >
        USCIS Classification Hierarchy
      </Typography>

      <Paper 
        elevation={2} 
        sx={{ 
          p: 3,
          ...contrastProps
        }}
      >
        <Typography 
          variant="body1" 
          paragraph
          sx={{ ...textSizeProps }}
        >
          E22 classification fits within the broader hierarchy of USCIS immigrant classifications:
        </Typography>
        
        <Box 
          sx={{ 
            p: 3, 
            border: '1px solid',
            borderColor: highContrast ? '#000000' : '#ccc',
            borderRadius: 1,
            bgcolor: highContrast ? '#f5f5f5' : 'rgba(0, 51, 102, 0.03)'
          }}
        >
          <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1, ...textSizeProps }}>
            Employment-Based Preferences
          </Typography>
          <Box sx={{ pl: 3 }}>
            <Typography variant="body1" sx={{ mb: 1, ...textSizeProps }}>
              ├── EB-1: Priority Workers
            </Typography>
            <Typography variant="body1" sx={{ mb: 1, ...textSizeProps }}>
              ├── EB-2: Advanced Degree Professionals and Persons of Exceptional Ability
            </Typography>
            <Box sx={{ pl: 3 }}>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: 'bold', ...textSizeProps }}>
                │   ├── E21: Principal Applicant
              </Typography>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: 'bold', color: highContrast ? '#000000' : '#003366', ...textSizeProps }}>
                │   ├── E22: Spouse of Principal Applicant
              </Typography>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: 'bold', ...textSizeProps }}>
                │   └── E23: Child of Principal Applicant
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ mb: 1, ...textSizeProps }}>
              ├── EB-3: Skilled Workers, Professionals, and Other Workers
            </Typography>
            <Typography variant="body1" sx={{ mb: 1, ...textSizeProps }}>
              ├── EB-4: Special Immigrants
            </Typography>
            <Typography variant="body1" sx={{ ...textSizeProps }}>
              └── EB-5: Immigrant Investors
            </Typography>
          </Box>
        </Box>

        <Typography 
          variant="body1" 
          sx={{ 
            mt: 3,
            fontStyle: 'italic',
            ...textSizeProps 
          }}
        >
          Note: This reference section is intended as a general guide. Always refer to current USCIS policy guidance for the most up-to-date information on immigration classification codes and related requirements.
        </Typography>
      </Paper>
    </Box>
  );
};

export default CategoryReferenceSection;
