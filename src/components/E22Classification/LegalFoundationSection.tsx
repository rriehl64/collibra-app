import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import GavelIcon from '@mui/icons-material/Gavel';
import CheckIcon from '@mui/icons-material/Check';
import ArticleIcon from '@mui/icons-material/Article';
import { useAccessibility } from '../../contexts/AccessibilityContext';

const LegalFoundationSection: React.FC = () => {
  const { settings } = useAccessibility();
  const highContrast = settings.highContrast;
  const largeText = settings.fontSize === 'large' || settings.fontSize === 'x-large';

  const textSizeProps = largeText ? { fontSize: '1.1rem' } : {};
  const headingProps = largeText ? { fontSize: '1.6rem' } : {};
  const contrastProps = highContrast ? { bgcolor: '#ffffff', color: '#000000' } : {};

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
        Legal Foundation
      </Typography>

      <Paper 
        elevation={2} 
        sx={{ 
          p: 3, 
          mb: 3,
          ...contrastProps
        }}
      >
        <Grid container spacing={4}>
          <Grid item xs={12} md={7}>
            <Typography 
              variant="h6" 
              gutterBottom
              sx={{ 
                color: highContrast ? '#000000' : '#003366',
                fontWeight: 'bold',
                ...textSizeProps
              }}
            >
              Section 203(d) of the Immigration and Nationality Act (INA)
            </Typography>
            
            <Typography 
              variant="body1" 
              paragraph
              sx={{ ...textSizeProps }}
            >
              The legal foundation for the E22 classification is established in Section 203(d) of the Immigration and Nationality Act, which provides:
            </Typography>
            
            <Card 
              variant="outlined" 
              sx={{ 
                my: 2, 
                p: 2,
                bgcolor: highContrast ? '#ffffff' : '#f8f8f8',
                border: highContrast ? '1px solid #000000' : '1px solid #ccc'
              }}
            >
              <Typography 
                variant="body1" 
                component="blockquote"
                sx={{ 
                  fontStyle: 'italic',
                  pl: 2,
                  borderLeft: highContrast ? '4px solid #000000' : '4px solid #003366',
                  ...textSizeProps
                }}
              >
                "A spouse or child... shall, if not otherwise entitled to an immigrant status and the immediate issuance of a visa under subsection (a), (b), or (c), be entitled to the same status, and the same order of consideration provided in the respective subsection, if accompanying or following to join, the spouse or parent."
              </Typography>
            </Card>
            
            <Typography 
              variant="body1" 
              sx={{ ...textSizeProps }}
            >
              This provision is the cornerstone that enables spouses (E22) and children (E23) of EB-2 principal applicants to immigrate together or "follow to join" the principal, using a shared priority date and streamlined processing.
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={5}>
            <Card 
              elevation={3}
              sx={{ 
                height: '100%',
                bgcolor: highContrast ? '#ffffff' : '#f5f7fa',
                border: highContrast ? '1px solid #000000' : 'none'
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <GavelIcon sx={{ 
                    color: highContrast ? '#000000' : '#003366',
                    mr: 1,
                    fontSize: '2rem'
                  }} />
                  <Typography 
                    variant="h6"
                    sx={{ 
                      color: highContrast ? '#000000' : '#003366',
                      fontWeight: 'bold',
                      ...textSizeProps
                    }}
                  >
                    Key Legal Principles
                  </Typography>
                </Box>
                
                <List>
                  {[
                    "Derivative status through qualifying relationship",
                    "Same priority date as principal applicant",
                    "Equal consideration for visa number allocation",
                    "Ability to 'follow to join' after principal's admission"
                  ].map((item, index) => (
                    <ListItem key={index} sx={{ py: 1 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckIcon sx={{ color: highContrast ? '#000000' : '#003366' }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary={item} 
                        primaryTypographyProps={{ ...textSizeProps }}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
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
          Supporting Regulations and Policy Guidance
        </Typography>

        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} md={4}>
            <Card 
              variant="outlined"
              sx={{ 
                height: '100%',
                border: highContrast ? '1px solid #000000' : '1px solid #ccc' 
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <ArticleIcon sx={{ 
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
                    8 CFR § 204.5
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ ...textSizeProps }}>
                  Outlines employment-based petition requirements and addresses derivative beneficiaries of employment petitions.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card 
              variant="outlined"
              sx={{ 
                height: '100%',
                border: highContrast ? '1px solid #000000' : '1px solid #ccc' 
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <ArticleIcon sx={{ 
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
                    9 FAM 502.1
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ ...textSizeProps }}>
                  Foreign Affairs Manual guidance on immigrant visas for spouses and children as derivatives of principal applicants.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card 
              variant="outlined"
              sx={{ 
                height: '100%',
                border: highContrast ? '1px solid #000000' : '1px solid #ccc' 
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <ArticleIcon sx={{ 
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
                    USCIS Policy Manual
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ ...textSizeProps }}>
                  Comprehensive guidance on employment-based immigration, including derivative status determination and processing.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
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
        Purpose and Intent
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
          The E22 classification serves several key purposes in U.S. immigration policy:
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <List>
              <ListItem>
                <ListItemIcon>
                  <CheckIcon sx={{ color: highContrast ? '#000000' : '#003366' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Promoting family unity by allowing spouses to immigrate together" 
                  primaryTypographyProps={{ ...textSizeProps }}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckIcon sx={{ color: highContrast ? '#000000' : '#003366' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Supporting U.S. employers in attracting global talent" 
                  primaryTypographyProps={{ ...textSizeProps }}
                />
              </ListItem>
            </List>
          </Grid>
          <Grid item xs={12} md={6}>
            <List>
              <ListItem>
                <ListItemIcon>
                  <CheckIcon sx={{ color: highContrast ? '#000000' : '#003366' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Providing efficient immigration pathways for families" 
                  primaryTypographyProps={{ ...textSizeProps }}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckIcon sx={{ color: highContrast ? '#000000' : '#003366' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Ensuring fair and equal treatment of immediate family members" 
                  primaryTypographyProps={{ ...textSizeProps }}
                />
              </ListItem>
            </List>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default LegalFoundationSection;
