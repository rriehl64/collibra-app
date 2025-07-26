import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Card,
  CardContent,
  Grid,
  Alert,
  Chip,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  PlayCircleOutline as PlayIcon,
  Storage as StorageIcon,
  Search as SearchIcon,
  Timeline as TimelineIcon,
  Category as CategoryIcon,
  Visibility as VisibilityIcon,
  AccountTree as AccountTreeIcon,
} from '@mui/icons-material';

interface LessonContentProps {
  onBack: () => void;
  onComplete: () => void;
  isCompleted: boolean;
}

const DataCatalogLesson: React.FC<LessonContentProps> = ({
  onBack,
  onComplete,
  isCompleted,
}) => {
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={onBack}
          sx={{ mr: 2 }}
        >
          Back to Lessons
        </Button>
        <Button
          variant={isCompleted ? "outlined" : "contained"}
          color={isCompleted ? "success" : "primary"}
          onClick={onComplete}
          startIcon={isCompleted ? <CheckCircleIcon /> : <PlayIcon />}
        >
          {isCompleted ? "Completed" : "Mark as Complete"}
        </Button>
      </Box>

      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Data Catalog Fundamentals
        </Typography>
        
        <Typography variant="body1" paragraph>
          A Data Catalog is your organization's single source of truth for data discovery, 
          understanding, and access. Learn how it helps teams find, understand, and use data effectively.
        </Typography>

        <Alert severity="info" sx={{ my: 3 }}>
          A Data Catalog combines metadata, business context, and collaboration features 
          to help organizations make the most of their data assets.
        </Alert>

        <Typography variant="h5" sx={{ mt: 4, mb: 3 }}>
          Key Components of a Data Catalog
        </Typography>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <StorageIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">
                    Metadata Repository
                  </Typography>
                </Box>
                <Typography variant="body2" paragraph>
                  Stores technical and business metadata about data assets:
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip label="Column definitions" size="small" />
                  <Chip label="Data types" size="small" />
                  <Chip label="Source systems" size="small" />
                  <Chip label="Update frequency" size="small" />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <SearchIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">
                    Search & Discovery
                  </Typography>
                </Box>
                <Typography variant="body2" paragraph>
                  Powerful search capabilities:
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip label="Full-text search" size="small" />
                  <Chip label="Faceted navigation" size="small" />
                  <Chip label="Tag-based filtering" size="small" />
                  <Chip label="Natural language" size="small" />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Typography variant="h5" sx={{ mt: 4, mb: 3 }}>
          Core Features & Capabilities
        </Typography>

        <List>
          <ListItem>
            <ListItemIcon>
              <TimelineIcon color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="Data Lineage" 
              secondary="Track data flow and dependencies across systems, helping understand data origin and transformations"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CategoryIcon color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="Business Glossary" 
              secondary="Define and maintain standard business terms and their relationships to data assets"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <VisibilityIcon color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="Data Preview" 
              secondary="View sample data and profile information without accessing the actual data"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <AccountTreeIcon color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="Data Classification" 
              secondary="Automatically classify and tag data based on content and usage patterns"
            />
          </ListItem>
        </List>

        <Typography variant="h5" sx={{ mt: 4, mb: 3 }}>
          Benefits of Using a Data Catalog
        </Typography>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', backgroundColor: 'primary.light' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary.contrastText">
                  Increased Efficiency
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon sx={{ color: 'primary.contrastText' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Faster data discovery"
                      secondary="Reduce time spent searching for data"
                      sx={{ 
                        '& .MuiListItemText-primary': { color: 'primary.contrastText' },
                        '& .MuiListItemText-secondary': { color: 'primary.contrastText' }
                      }}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', backgroundColor: 'secondary.light' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="secondary.contrastText">
                  Better Collaboration
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon sx={{ color: 'secondary.contrastText' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Shared understanding"
                      secondary="Common language for data assets"
                      sx={{ 
                        '& .MuiListItemText-primary': { color: 'secondary.contrastText' },
                        '& .MuiListItemText-secondary': { color: 'secondary.contrastText' }
                      }}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', backgroundColor: 'success.light' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="success.contrastText">
                  Improved Governance
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon sx={{ color: 'success.contrastText' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Better compliance"
                      secondary="Track and manage data usage"
                      sx={{ 
                        '& .MuiListItemText-primary': { color: 'success.contrastText' },
                        '& .MuiListItemText-secondary': { color: 'success.contrastText' }
                      }}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Typography variant="h5" gutterBottom>
          Best Practices for Data Catalog Implementation
        </Typography>

        <List>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon color="success" />
            </ListItemIcon>
            <ListItemText 
              primary="Start with High-Value Data"
              secondary="Focus on the most important and frequently used data assets first"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon color="success" />
            </ListItemIcon>
            <ListItemText 
              primary="Ensure Data Quality"
              secondary="Implement data quality checks and validation processes"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon color="success" />
            </ListItemIcon>
            <ListItemText 
              primary="Maintain Active Curation"
              secondary="Regularly update and validate catalog entries to maintain accuracy"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon color="success" />
            </ListItemIcon>
            <ListItemText 
              primary="Promote User Adoption"
              secondary="Provide training and encourage user feedback to drive adoption"
            />
          </ListItem>
        </List>
      </Paper>
    </Box>
  );
};

export default DataCatalogLesson;
