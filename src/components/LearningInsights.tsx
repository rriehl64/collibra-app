import React from 'react';
import { Box, Typography, Paper, Tooltip, Grid } from '@mui/material';
import { 
  TrendingUp as TrendingUpIcon, 
  EmojiEvents as EmojiEventsIcon,
  Insights as InsightsIcon,
  Star as StarIcon,
  Construction as ConstructionIcon
} from '@mui/icons-material';

interface LearningInsightsProps {
  strengths: string[];
  areasForImprovement: string[];
  learningStreak: number;
  completionPercentage: number;
  totalLessons: number;
  completedLessons: number[];
}

const LearningInsights: React.FC<LearningInsightsProps> = ({
  strengths,
  areasForImprovement,
  learningStreak,
  completionPercentage,
  totalLessons,
  completedLessons
}) => {
  // Calculate stats for accessibility
  const completedCount = completedLessons.length;
  const remainingCount = totalLessons - completedCount;
  const strengthsList = strengths.join(', ');
  const improvementsList = areasForImprovement.join(', ');
  
  return (
    <Paper 
      elevation={2} 
      sx={{ 
        p: 3, 
        mb: 4, 
        border: '1px solid #e0e0e0',
        borderRadius: '8px'
      }}
      role="region"
      aria-label="Learning Insights"
    >
      <Typography 
        variant="h5" 
        component="h2" 
        sx={{ 
          mb: 2, 
          color: '#003366', 
          display: 'flex', 
          alignItems: 'center',
          gap: 1
        }}
        id="insights-heading"
      >
        <InsightsIcon /> Learning Insights
      </Typography>
      
      <Grid container spacing={3}>
        {/* Learning Streak */}
        <Grid item xs={12} md={4}>
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center',
              p: 2,
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              height: '100%',
              '&:hover, &:focus-within': {
                boxShadow: '0 4px 12px rgba(0, 51, 102, 0.15)'
              }
            }}
            tabIndex={0}
            aria-labelledby="streak-title"
          >
            <TrendingUpIcon 
              sx={{ fontSize: 48, color: '#003366', mb: 1 }}
              aria-hidden="true"
            />
            <Typography 
              variant="h6" 
              component="h3" 
              align="center"
              id="streak-title"
            >
              Current Streak
            </Typography>
            <Typography 
              variant="h3" 
              align="center" 
              sx={{ fontWeight: 'bold', color: '#003366' }}
              aria-live="polite"
            >
              {learningStreak} days
            </Typography>
            <Typography variant="body2" align="center" color="text.secondary">
              {learningStreak > 5 ? 
                'Excellent consistency! Keep it up!' : 
                'Building good learning habits'}
            </Typography>
          </Box>
        </Grid>
        
        {/* Strengths */}
        <Grid item xs={12} md={4}>
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              p: 2,
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              height: '100%',
              '&:hover, &:focus-within': {
                boxShadow: '0 4px 12px rgba(0, 51, 102, 0.15)'
              }
            }}
            tabIndex={0}
            aria-labelledby="strengths-title"
          >
            <StarIcon 
              sx={{ fontSize: 48, color: '#003366', mb: 1, alignSelf: 'center' }}
              aria-hidden="true"
            />
            <Typography 
              variant="h6" 
              component="h3"
              align="center"
              id="strengths-title"
            >
              Your Strengths
            </Typography>
            <Box 
              sx={{ 
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                mt: 2
              }}
            >
              {strengths.map((strength, index) => (
                <Tooltip title={`You excel in ${strength}`} key={index}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      p: 1,
                      borderRadius: '4px',
                      bgcolor: 'rgba(0, 51, 102, 0.05)',
                      '&:focus-visible': {
                        outline: '2px solid #003366',
                        outlineOffset: '2px'
                      }
                    }}
                    tabIndex={0}
                  >
                    <EmojiEventsIcon 
                      sx={{ color: '#003366' }} 
                      fontSize="small"
                      aria-hidden="true"  
                    />
                    <Typography>{strength}</Typography>
                  </Box>
                </Tooltip>
              ))}
            </Box>
            <Typography 
              variant="body2" 
              align="center" 
              color="text.secondary" 
              sx={{ mt: 'auto', pt: 2 }}
              aria-live="polite"
            >
              Based on your quiz performance
            </Typography>
          </Box>
        </Grid>
        
        {/* Areas for Improvement */}
        <Grid item xs={12} md={4}>
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              p: 2,
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              height: '100%',
              '&:hover, &:focus-within': {
                boxShadow: '0 4px 12px rgba(0, 51, 102, 0.15)'
              }
            }}
            tabIndex={0}
            aria-labelledby="improvement-title"
          >
            <ConstructionIcon 
              sx={{ fontSize: 48, color: '#003366', mb: 1, alignSelf: 'center' }}
              aria-hidden="true"
            />
            <Typography 
              variant="h6" 
              component="h3"
              align="center"
              id="improvement-title"
            >
              Growth Areas
            </Typography>
            <Box 
              sx={{ 
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                mt: 2
              }}
            >
              {areasForImprovement.map((area, index) => (
                <Tooltip title={`Focus on improving your ${area} skills`} key={index}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      p: 1,
                      borderRadius: '4px',
                      bgcolor: 'rgba(179, 27, 27, 0.05)',
                      '&:focus-visible': {
                        outline: '2px solid #B31B1B',
                        outlineOffset: '2px'
                      }
                    }}
                    tabIndex={0}
                  >
                    <InsightsIcon 
                      sx={{ color: '#B31B1B' }} 
                      fontSize="small"
                      aria-hidden="true"
                    />
                    <Typography>{area}</Typography>
                  </Box>
                </Tooltip>
              ))}
            </Box>
            <Typography 
              variant="body2" 
              align="center" 
              color="text.secondary"
              sx={{ mt: 'auto', pt: 2 }}
              aria-live="polite"
            >
              Recommended focus areas
            </Typography>
          </Box>
        </Grid>
      </Grid>
      
      {/* Hidden text for screen readers with complete summary */}
      <Typography 
        sx={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }}
        aria-live="polite"
      >
        Your learning insights summary: You have a {learningStreak} day streak. 
        Your strengths are: {strengthsList}. 
        Your areas for improvement are: {improvementsList}.
        You've completed {completedCount} out of {totalLessons} lessons, 
        which is {completionPercentage}% of the total curriculum.
        You have {remainingCount} lessons remaining.
      </Typography>
    </Paper>
  );
};

export default LearningInsights;
