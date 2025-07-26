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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  PlayCircleOutline as PlayIcon,
  Book as BookIcon,
  Link as LinkIcon,
  Group as GroupIcon,
  Translate as TranslateIcon,
  FormatListBulleted as ListIcon,
  AccountTree as TreeIcon,
} from '@mui/icons-material';

interface LessonContentProps {
  onBack: () => void;
  onComplete: () => void;
  isCompleted: boolean;
}

const BusinessGlossaryLesson: React.FC<LessonContentProps> = ({
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
          Working with Business Glossary
        </Typography>
        
        <Typography variant="body1" paragraph>
          A Business Glossary is essential for establishing a common language across your 
          organization. Learn how to create, maintain, and effectively use a business glossary 
          to improve data understanding and collaboration.
        </Typography>

        <Alert severity="info" sx={{ my: 3 }}>
          A well-maintained Business Glossary helps eliminate confusion, ensures consistency, 
          and promotes better communication between business and technical teams.
        </Alert>

        <Typography variant="h5" sx={{ mt: 4, mb: 3 }}>
          Anatomy of a Business Term
        </Typography>

        <TableContainer component={Paper} sx={{ mb: 4 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'primary.light' }}>
                <TableCell sx={{ color: 'primary.contrastText' }}>Component</TableCell>
                <TableCell sx={{ color: 'primary.contrastText' }}>Description</TableCell>
                <TableCell sx={{ color: 'primary.contrastText' }}>Example</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Unique identifier for the term</TableCell>
                <TableCell>Customer Lifetime Value</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Definition</TableCell>
                <TableCell>Clear, concise explanation</TableCell>
                <TableCell>The predicted net profit from entire future relationship with a customer</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Status</TableCell>
                <TableCell>Current state in workflow</TableCell>
                <TableCell>Approved, Draft, Under Review</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Steward</TableCell>
                <TableCell>Person responsible for the term</TableCell>
                <TableCell>Data Governance Team</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <Typography variant="h5" sx={{ mt: 4, mb: 3 }}>
          Key Features of a Business Glossary
        </Typography>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TreeIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">
                    Hierarchical Structure
                  </Typography>
                </Box>
                <Typography variant="body2">
                  Organize terms in a logical hierarchy with parent-child relationships 
                  and categories for easy navigation.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LinkIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">
                    Term Relationships
                  </Typography>
                </Box>
                <Typography variant="body2">
                  Define relationships between terms: synonyms, related terms, 
                  broader/narrower terms, and more.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <GroupIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">
                    Collaboration
                  </Typography>
                </Box>
                <Typography variant="body2">
                  Enable comments, discussions, and workflows for term review 
                  and approval processes.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Typography variant="h5" sx={{ mt: 4, mb: 3 }}>
          Best Practices for Term Creation
        </Typography>

        <List>
          <ListItem>
            <ListItemIcon>
              <BookIcon color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="Be Clear and Concise" 
              secondary="Write definitions that are easy to understand and avoid jargon when possible"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <TranslateIcon color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="Use Standard Language" 
              secondary="Maintain consistency in terminology and formatting across all definitions"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <ListIcon color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="Include Examples" 
              secondary="Provide real-world examples to illustrate term usage and context"
            />
          </ListItem>
        </List>

        <Typography variant="h5" sx={{ mt: 4, mb: 3 }}>
          Governance and Maintenance
        </Typography>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%', backgroundColor: 'success.light' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="success.contrastText">
                  Regular Activities
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon sx={{ color: 'success.contrastText' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Review terms periodically"
                      secondary="Ensure definitions remain accurate and relevant"
                      sx={{ 
                        '& .MuiListItemText-primary': { color: 'success.contrastText' },
                        '& .MuiListItemText-secondary': { color: 'success.contrastText' }
                      }}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon sx={{ color: 'success.contrastText' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Update relationships"
                      secondary="Maintain term connections and hierarchies"
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
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%', backgroundColor: 'error.light' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="error.contrastText">
                  Common Pitfalls
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon sx={{ color: 'error.contrastText' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Neglecting updates"
                      secondary="Outdated terms lead to confusion"
                      sx={{ 
                        '& .MuiListItemText-primary': { color: 'error.contrastText' },
                        '& .MuiListItemText-secondary': { color: 'error.contrastText' }
                      }}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleIcon sx={{ color: 'error.contrastText' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Inconsistent formatting"
                      secondary="Reduces glossary effectiveness"
                      sx={{ 
                        '& .MuiListItemText-primary': { color: 'error.contrastText' },
                        '& .MuiListItemText-secondary': { color: 'error.contrastText' }
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
          Practical Tips for Success
        </Typography>

        <List>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon color="success" />
            </ListItemIcon>
            <ListItemText 
              primary="Start Small and Scale"
              secondary="Begin with key terms in one business area before expanding"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon color="success" />
            </ListItemIcon>
            <ListItemText 
              primary="Engage Stakeholders"
              secondary="Involve business users in term definition and review"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon color="success" />
            </ListItemIcon>
            <ListItemText 
              primary="Measure Usage"
              secondary="Track term usage and user engagement to identify areas for improvement"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon color="success" />
            </ListItemIcon>
            <ListItemText 
              primary="Promote Adoption"
              secondary="Make the glossary easily accessible and integrate it into daily workflows"
            />
          </ListItem>
        </List>
      </Paper>
    </Box>
  );
};

export default BusinessGlossaryLesson;
