import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Paper,
  Button,
  Alert,
  Snackbar 
} from '@mui/material';
import { MenuBook as MenuBookIcon } from '@mui/icons-material';
import HandbookViewer from './HandbookViewer';
import { handbookContent } from '../../data/handbookContent';
import { UserProgress } from '../../pages/DataLiteracyModule'; // Import UserProgress type

interface HandbookTabProps {
  userProgress: UserProgress;
  updateUserProgress: (progress: UserProgress) => void;
}

const HandbookTab: React.FC<HandbookTabProps> = ({ userProgress, updateUserProgress }) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'info' | 'warning' | 'error'>('success');

  // Initialize handbook user progress if it doesn't exist
  useEffect(() => {
    if (!userProgress.handbookProgress) {
      updateUserProgress({
        ...userProgress,
        handbookProgress: {
          lastVisitedChapter: handbookContent.chapters[0].id,
          lastVisitedSection: handbookContent.chapters[0].sections[0].id,
          bookmarks: [],
          completedSections: [],
          readTime: 0
        }
      });
    }
  }, [userProgress, updateUserProgress]);

  // Handler for section completion
  const handleProgressUpdate = (sectionId: string, completed: boolean) => {
    if (!userProgress.handbookProgress) return;

    const updatedProgress = { ...userProgress };
    // Initialize default values if handbookProgress is undefined
    const handbookProgress = updatedProgress.handbookProgress || {
      lastVisitedChapter: handbookContent.chapters[0].id,
      lastVisitedSection: handbookContent.chapters[0].sections[0].id,
      bookmarks: [],
      completedSections: [],
      readTime: 0
    };
    const completedSections = [...handbookProgress.completedSections];

    if (completed && !completedSections.includes(sectionId)) {
      completedSections.push(sectionId);
      setSnackbarMessage('Section marked as complete!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } else if (!completed && completedSections.includes(sectionId)) {
      const index = completedSections.indexOf(sectionId);
      completedSections.splice(index, 1);
      setSnackbarMessage('Section marked as incomplete');
      setSnackbarSeverity('info');
      setSnackbarOpen(true);
    }

    updatedProgress.handbookProgress = {
      lastVisitedChapter: handbookProgress.lastVisitedChapter,
      lastVisitedSection: handbookProgress.lastVisitedSection,
      bookmarks: handbookProgress.bookmarks,
      completedSections,
      readTime: handbookProgress.readTime,
      lastActivityDate: new Date().toISOString()
    };

    updateUserProgress(updatedProgress);
  };

  // Handler for bookmarks
  const handleBookmarkToggle = (chapterId: string, sectionId: string, bookmarked: boolean) => {
    if (!userProgress.handbookProgress) return;

    const updatedProgress = { ...userProgress };
    // Initialize default values if handbookProgress is undefined
    const handbookProgress = updatedProgress.handbookProgress || {
      lastVisitedChapter: handbookContent.chapters[0].id,
      lastVisitedSection: handbookContent.chapters[0].sections[0].id,
      bookmarks: [],
      completedSections: [],
      readTime: 0
    };
    const bookmarks = [...handbookProgress.bookmarks];
    
    if (bookmarked) {
      // Find the section info
      const chapter = handbookContent.chapters.find(ch => ch.id === chapterId);
      const section = chapter?.sections.find(sec => sec.id === sectionId);
      
      if (chapter && section) {
        bookmarks.push({
          chapterId,
          sectionId,
          dateAdded: new Date().toISOString()
        });
        setSnackbarMessage(`Bookmark added: ${section.title}`);
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      }
    } else {
      const index = bookmarks.findIndex(bookmark => bookmark.sectionId === sectionId);
      if (index !== -1) {
        bookmarks.splice(index, 1);
        setSnackbarMessage('Bookmark removed');
        setSnackbarSeverity('info');
        setSnackbarOpen(true);
      }
    }
    
    updatedProgress.handbookProgress = {
      lastVisitedChapter: handbookProgress.lastVisitedChapter,
      lastVisitedSection: handbookProgress.lastVisitedSection,
      bookmarks,
      completedSections: handbookProgress.completedSections,
      readTime: handbookProgress.readTime,
      lastActivityDate: new Date().toISOString()
    };
    
    updateUserProgress(updatedProgress);
  };

  // Handler for tracking section visits
  const handleSectionVisit = (chapterId: string, sectionId: string) => {
    if (!userProgress.handbookProgress) return;
    
    const updatedProgress = { ...userProgress };
    // Initialize default values if handbookProgress is undefined
    const handbookProgress = updatedProgress.handbookProgress || {
      lastVisitedChapter: '',
      lastVisitedSection: '',
      bookmarks: [],
      completedSections: [],
      readTime: 0
    };
    
    updatedProgress.handbookProgress = {
      lastVisitedChapter: chapterId,
      lastVisitedSection: sectionId,
      bookmarks: handbookProgress.bookmarks,
      completedSections: handbookProgress.completedSections,
      readTime: handbookProgress.readTime,
      lastActivityDate: new Date().toISOString()
    };
    
    updateUserProgress(updatedProgress);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const getTotalSections = () => {
    return handbookContent.chapters.reduce((total, chapter) => 
      total + chapter.sections.length, 0);
  };

  const getCompletionPercentage = () => {
    if (!userProgress.handbookProgress) return 0;
    const completedCount = userProgress.handbookProgress.completedSections.length;
    const totalSections = getTotalSections();
    return Math.round((completedCount / totalSections) * 100);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            mb: 2, 
            color: '#003366',
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}
        >
          <MenuBookIcon fontSize="large" /> USCIS Data Literacy Handbook
        </Typography>
        
        <Typography 
          variant="body1" 
          paragraph
          sx={{ maxWidth: '900px' }}
        >
          This comprehensive handbook serves as your official guide to data literacy at USCIS. 
          Explore key concepts, best practices, and agency-specific data contexts to enhance your 
          data skills and contribute to our data-driven culture.
        </Typography>
        
        <Paper 
          elevation={1} 
          sx={{ 
            p: 2, 
            mb: 4, 
            bgcolor: 'rgba(0, 51, 102, 0.05)', 
            borderLeft: '4px solid #003366',
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: 2
          }}
        >
          <Box>
            <Typography variant="h6" component="h2" gutterBottom>
              Your Handbook Progress
            </Typography>
            <Typography variant="body2">
              {userProgress.handbookProgress?.completedSections.length || 0} of {getTotalSections()} sections completed ({getCompletionPercentage()}%)
            </Typography>
            {userProgress.handbookProgress?.bookmarks.length ? (
              <Typography variant="body2">
                {userProgress.handbookProgress.bookmarks.length} bookmark{userProgress.handbookProgress.bookmarks.length !== 1 ? 's' : ''}
              </Typography>
            ) : null}
          </Box>
          
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              if (userProgress.handbookProgress?.lastVisitedSection) {
                // Logic to open the last visited section would go here
                // For now, we'll just show a message
                setSnackbarMessage('Resuming from your last visited section');
                setSnackbarSeverity('info');
                setSnackbarOpen(true);
              }
            }}
            sx={{ 
              backgroundColor: '#003366',
              '&:hover': {
                backgroundColor: '#002244',
              },
              '&:focus-visible': {
                outline: '2px solid #003366',
                outlineOffset: '2px'
              }
            }}
          >
            Resume Reading
          </Button>
        </Paper>
      </Box>
      
      <Box sx={{ mb: 6 }}>
        <HandbookViewer
          handbook={handbookContent}
          userProgress={userProgress.handbookProgress ? {
            userId: userProgress.userId,
            lastVisitedChapter: userProgress.handbookProgress.lastVisitedChapter,
            lastVisitedSection: userProgress.handbookProgress.lastVisitedSection,
            bookmarks: userProgress.handbookProgress.bookmarks,
            completedSections: userProgress.handbookProgress.completedSections,
            readTime: userProgress.handbookProgress.readTime
          } : undefined}
          onProgressUpdate={handleProgressUpdate}
          onBookmarkToggle={handleBookmarkToggle}
        />
      </Box>
      
      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={4000} 
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbarSeverity} 
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default HandbookTab;
