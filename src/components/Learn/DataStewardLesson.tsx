import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Storage as StorageIcon,
  Security as SecurityIcon,
  Assessment as AssessmentIcon,
  People as PeopleIcon,
  Task as TaskIcon,
  BugReport as BugReportIcon,
  Architecture as ArchitectureIcon,
} from '@mui/icons-material';
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

const DataStewardLesson: React.FC = () => {
  const sections = [
    {
      title: 'Data Management and Quality Assurance',
      items: [
        {
          icon: <StorageIcon />,
          text: 'Oversee the entire data lifecycle including collection, storage, and processing',
        },
        {
          icon: <AssessmentIcon />,
          text: 'Monitor data quality and integrity to reduce inconsistencies',
        },
        {
          icon: <SecurityIcon />,
          text: 'Conduct regular audits to maintain data accuracy and quality standards',
        },
        {
          icon: <AssessmentIcon />,
          text: 'Implement and maintain data quality rules for critical data elements',
        },
      ],
    },
    {
      title: 'Governance and Compliance',
      items: [
        {
          icon: <SecurityIcon />,
          text: 'Ensure adherence to data governance frameworks within Collibra',
        },
        {
          icon: <SecurityIcon />,
          text: 'Handle data privacy, ethics, and regulatory requirements',
        },
        {
          icon: <PeopleIcon />,
          text: 'Review and approve access requests on behalf of data owners',
        },
      ],
    },
    {
      title: 'Communication and Collaboration',
      items: [
        {
          icon: <PeopleIcon />,
          text: 'Act as intermediary between technical teams and business users',
        },
        {
          icon: <PeopleIcon />,
          text: 'Facilitate cross-organizational discussions to define data and build context',
        },
        {
          icon: <PeopleIcon />,
          text: 'Clarify roles and ownership in the data governance ecosystem',
        },
      ],
    },
    {
      title: 'Task and Issue Management',
      items: [
        {
          icon: <TaskIcon />,
          text: 'Manage daily tasks efficiently using Collibra Stewardship application',
        },
        {
          icon: <BugReportIcon />,
          text: 'Triage and escalate data issues when necessary',
        },
        {
          icon: <AssessmentIcon />,
          text: 'Prioritize data quality activities based on business impact',
        },
      ],
    },
    {
      title: 'Data Model Governance',
      items: [
        {
          icon: <ArchitectureIcon />,
          text: 'Govern data model changes within assigned data domains',
        },
        {
          icon: <AssessmentIcon />,
          text: 'Assess impact of changes on critical business processes',
        },
        {
          icon: <StorageIcon />,
          text: 'Maintain data models within Collibra Data Intelligence Platform',
        },
      ],
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Data Steward Role in Collibra
      </Typography>
      <Typography variant="subtitle1" paragraph>
        In Collibra, data stewards play a crucial role in managing and maintaining an organization's data assets. 
        The Collibra Stewardship application is specifically designed to help data stewards fulfill their 
        responsibilities effectively while ensuring data quality and governance across the enterprise.
      </Typography>

      {sections.map((section, index) => (
        <Box key={section.title} sx={{ mb: 4 }}>
          <SectionTitle variant="h5">{section.title}</SectionTitle>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <StyledPaper elevation={3}>
                <List>
                  {section.items.map((item, i) => (
                    <React.Fragment key={i}>
                      <ListItem>
                        <ListItemIcon sx={{ color: 'primary.main' }}>
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText primary={item.text} />
                      </ListItem>
                      {i < section.items.length - 1 && (
                        <Divider variant="inset" component="li" />
                      )}
                    </React.Fragment>
                  ))}
                </List>
              </StyledPaper>
            </Grid>
          </Grid>
        </Box>
      ))}
    </Box>
  );
};

export default DataStewardLesson;
