import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  backgroundColor: theme.palette.background.default,
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(2),
}));

const DGvsMDMLesson: React.FC = () => {
  const sections = [
    {
      title: 'Scope and Focus',
      governance: [
        'Sets the overall strategy and framework for data usage',
        'Defines policies, procedures, and standards',
        'Focuses on the "why" and "what" of data handling',
      ],
      management: [
        'Implements technical solutions and actions',
        'Handles day-to-day data processes',
        'Focuses on the "how" of data handling',
      ],
    },
    {
      title: 'Roles and Responsibilities',
      governance: [
        'Led by Chief Data Officer or equivalent',
        'Involves business leaders and stakeholders',
        'Includes domain data owners',
      ],
      management: [
        'Controlled by IT teams',
        'Involves data engineers and architects',
        'Includes database administrators',
      ],
    },
    {
      title: 'Metrics and Measurement',
      governance: [
        'Measured by high-level KPIs',
        'Focuses on value creation',
        'Tracks compliance and data usage',
      ],
      management: [
        'Evaluated through technical metrics',
        'Measures data availability',
        'Tracks processing speed and throughput',
      ],
    },
    {
      title: 'Tools and Technology',
      governance: [
        'Documentation tools',
        'Data dictionaries and glossaries',
        'Quality monitoring systems',
      ],
      management: [
        'Data storage solutions',
        'Processing tools',
        'Data exploration platforms',
      ],
    },
    {
      title: 'Implementation',
      governance: [
        'Develops strategic policies',
        'Sets vision for data usage',
        'Works with data stewards',
      ],
      management: [
        'Implements technical solutions',
        'Executes policies',
        'Manages day-to-day operations',
      ],
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Data Governance vs Data Management
      </Typography>
      <Typography variant="subtitle1" paragraph>
        While data governance and data management work together to ensure effective use of data,
        they have several key differences in their approach and focus.
      </Typography>

      {sections.map((section, index) => (
        <Box key={section.title} sx={{ mb: 4 }}>
          <SectionTitle variant="h5">{section.title}</SectionTitle>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <StyledPaper elevation={3}>
                <Typography variant="h6" gutterBottom color="primary">
                  Data Governance
                </Typography>
                <List>
                  {section.governance.map((item, i) => (
                    <ListItem key={i}>
                      <ListItemText primary={item} />
                    </ListItem>
                  ))}
                </List>
              </StyledPaper>
            </Grid>
            <Grid item xs={12} md={6}>
              <StyledPaper elevation={3}>
                <Typography variant="h6" gutterBottom color="primary">
                  Data Management
                </Typography>
                <List>
                  {section.management.map((item, i) => (
                    <ListItem key={i}>
                      <ListItemText primary={item} />
                    </ListItem>
                  ))}
                </List>
              </StyledPaper>
            </Grid>
          </Grid>
          {index < sections.length - 1 && <Divider sx={{ my: 4 }} />}
        </Box>
      ))}
    </Box>
  );
};

export default DGvsMDMLesson;
