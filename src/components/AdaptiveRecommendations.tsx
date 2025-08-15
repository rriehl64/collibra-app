import React from 'react';
import { Box, Typography, Paper, Grid, Button, List, ListItem, ListItemIcon, ListItemText, Chip } from '@mui/material';
import { 
  Recommend as RecommendIcon,
  AutoStories as AutoStoriesIcon,
  Article as ArticleIcon,
  School as SchoolIcon,
  VideoLibrary as VideoLibraryIcon
} from '@mui/icons-material';

interface AdaptiveRecommendationsProps {
  recommendedResources: { id: string; title: string; type: string; url?: string }[];
  strengths: string[];
  areasForImprovement: string[];
  roleBasedPath: string;
}

const AdaptiveRecommendations: React.FC<AdaptiveRecommendationsProps> = ({
  recommendedResources,
  strengths,
  areasForImprovement,
  roleBasedPath
}) => {
  // Map resource types to their appropriate icons for accessibility
  const getResourceIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'course':
        return <SchoolIcon fontSize="small" aria-hidden="true" />;
      case 'article':
        return <ArticleIcon fontSize="small" aria-hidden="true" />;
      case 'workshop':
        return <AutoStoriesIcon fontSize="small" aria-hidden="true" />;
      case 'video':
        return <VideoLibraryIcon fontSize="small" aria-hidden="true" />;
      default:
        return <RecommendIcon fontSize="small" aria-hidden="true" />;
    }
  };

  // Get resource type for screen readers
  const getResourceTypeText = (type: string) => {
    return `${type}. `;
  };
  
  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        mb: 4,
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        borderLeft: 5,
        borderColor: '#B31B1B'
      }}
      role="region"
      aria-labelledby="recommendations-heading"
    >
      <Typography
        variant="h6"
        component="h2"
        id="recommendations-heading"
        sx={{
          mb: 2,
          color: '#003366',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}
      >
        <RecommendIcon /> Personalized Learning Recommendations
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Typography
            variant="subtitle1"
            gutterBottom
            sx={{ fontWeight: 'medium' }}
          >
            Based on your progress, we recommend:
          </Typography>
          
          <List sx={{ mb: 2 }} aria-label="Recommended learning resources">
            {recommendedResources.map((resource) => (
              <ListItem
                key={resource.id}
                sx={{
                  border: '1px solid #e0e0e0',
                  borderRadius: '4px',
                  mb: 1,
                  '&:hover': {
                    backgroundColor: 'rgba(0, 51, 102, 0.05)'
                  },
                  '&:focus-within': {
                    outline: '2px solid #003366',
                    outlineOffset: '2px'
                  }
                }}
                component="div"
              >
                <ListItemIcon sx={{ minWidth: '40px' }}>
                  {getResourceIcon(resource.type)}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <>
                      <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {resource.title}
                        <Chip
                          label={resource.type}
                          size="small"
                          sx={{
                            fontSize: '0.7rem',
                            height: '20px',
                            bgcolor: 'rgba(0, 51, 102, 0.1)',
                            color: '#003366'
                          }}
                        />
                      </Box>
                    </>
                  }
                  primaryTypographyProps={{
                    variant: 'body1',
                    component: 'div',
                    sx: { fontWeight: 'medium' }
                  }}
                />
                <Button
                  variant="outlined"
                  size="small"
                  sx={{
                    ml: 1,
                    color: '#003366',
                    borderColor: '#003366',
                    '&:hover': {
                      borderColor: '#002244',
                      backgroundColor: 'rgba(0, 51, 102, 0.05)'
                    },
                    '&:focus': {
                      boxShadow: '0 0 0 2px rgba(0, 51, 102, 0.2)'
                    }
                  }}
                  href={resource.url || '#'}
                  aria-label={`Access ${getResourceTypeText(resource.type)}${resource.title}`}
                >
                  Access
                </Button>
              </ListItem>
            ))}
          </List>
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button
              variant="text"
              color="primary"
              size="small"
              endIcon={<RecommendIcon />}
              sx={{ color: '#003366' }}
              aria-label="View all learning recommendations"
            >
              View all recommendations
            </Button>
          </Box>
        </Grid>
        
        <Grid item xs={12} md={5}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              backgroundColor: 'rgba(0, 51, 102, 0.05)',
              borderRadius: '8px'
            }}
          >
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium' }}>
              Your {roleBasedPath} Learning Path
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" gutterBottom color="text.secondary">
                Focus areas based on your progress:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                {areasForImprovement.map((area, index) => (
                  <Chip
                    key={index}
                    label={area}
                    size="small"
                    sx={{
                      bgcolor: 'rgba(179, 27, 27, 0.1)',
                      color: '#B31B1B',
                      fontSize: '0.75rem',
                      '&:focus': {
                        boxShadow: '0 0 0 2px rgba(179, 27, 27, 0.2)'
                      }
                    }}
                  />
                ))}
              </Box>
            </Box>
            
            <Box>
              <Typography variant="body2" gutterBottom color="text.secondary">
                Your strengths:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                {strengths.map((strength, index) => (
                  <Chip
                    key={index}
                    label={strength}
                    size="small"
                    sx={{
                      bgcolor: 'rgba(0, 51, 102, 0.1)',
                      color: '#003366',
                      fontSize: '0.75rem',
                      '&:focus': {
                        boxShadow: '0 0 0 2px rgba(0, 51, 102, 0.2)'
                      }
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Hidden screen reader text for improved accessibility */}
      <Typography 
        sx={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }}
        aria-live="polite"
      >
        Personalized learning recommendations based on your {roleBasedPath} role. 
        We recommend focusing on {areasForImprovement.join(', ')}. 
        You show strengths in {strengths.join(', ')}. 
        We have {recommendedResources.length} recommended resources for you to explore.
      </Typography>
    </Paper>
  );
};

export default AdaptiveRecommendations;
