import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Divider, 
  Tabs, 
  Tab, 
  List, 
  ListItem,
  ListItemText,
  ListItemIcon,
  Collapse,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  Alert,
  Chip,
  Tooltip,
  useTheme,
  useMediaQuery 
} from '@mui/material';
import { 
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Search as SearchIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Print as PrintIcon,
  GetApp as DownloadIcon,
  Share as ShareIcon,
  MenuBook as MenuBookIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import { HandbookChapter, HandbookSection, HandbookContentElement } from '../../types/handbook';

interface HandbookViewerProps {
  handbook: {
    id: string;
    title: string;
    version: string;
    lastUpdated: string;
    chapters: HandbookChapter[];
    metadata: {
      author: string;
      department: string;
      contactEmail?: string;
      approvalDate: string;
      reviewDate: string;
    };
  };
  userProgress?: {
    userId: string;
    lastVisitedChapter: string;
    lastVisitedSection: string;
    bookmarks: {
      chapterId: string;
      sectionId: string;
      note?: string;
      dateAdded: string;
    }[];
    completedSections: string[];
    readTime: number;
  };
  onProgressUpdate?: (sectionId: string, completed: boolean) => void;
  onBookmarkToggle?: (chapterId: string, sectionId: string, bookmarked: boolean) => void;
}

const HandbookViewer: React.FC<HandbookViewerProps> = ({
  handbook,
  userProgress,
  onProgressUpdate,
  onBookmarkToggle
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeChapter, setActiveChapter] = useState<string>(
    userProgress?.lastVisitedChapter || handbook.chapters[0]?.id || ''
  );
  const [activeSection, setActiveSection] = useState<string>(
    userProgress?.lastVisitedSection || handbook.chapters[0]?.sections[0]?.id || ''
  );
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Array<{chapterId: string, sectionId: string, title: string}>>([]);
  const [showTableOfContents, setShowTableOfContents] = useState<boolean>(!isMobile);
  const contentRef = useRef<HTMLDivElement>(null);

  // Find the current chapter and section objects
  const currentChapter = handbook.chapters.find(chapter => chapter.id === activeChapter);
  const allSections = handbook.chapters.flatMap(chapter => 
    chapter.sections.flatMap(section => 
      [section, ...(section.subsections || [])]
    )
  );
  const currentSection = allSections.find(section => section.id === activeSection);

  useEffect(() => {
    // Scroll to top when changing sections
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }

    // Update last visited for accessibility - announce section change
    const sectionTitle = currentSection?.title || '';
    const chapterTitle = currentChapter?.title || '';
    
    // Set page title for screen readers
    document.title = `${sectionTitle} - ${chapterTitle} | USCIS Data Literacy Handbook`;
  }, [activeChapter, activeSection, currentChapter, currentSection]);

  // Handle search functionality
  useEffect(() => {
    if (searchQuery.trim().length > 2) {
      const query = searchQuery.toLowerCase();
      const results = handbook.chapters.flatMap(chapter => 
        chapter.sections.map(section => ({
          chapterId: chapter.id,
          sectionId: section.id,
          title: section.title,
          matches: 
            section.title.toLowerCase().includes(query) || 
            section.keywords.some(keyword => keyword.toLowerCase().includes(query))
        }))
      ).filter(item => item.matches);
      
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, handbook.chapters]);

  // Check if a section is bookmarked
  const isBookmarked = (sectionId: string) => {
    if (!userProgress || !userProgress.bookmarks) return false;
    return userProgress.bookmarks.some(bookmark => bookmark.sectionId === sectionId);
  };

  // Check if a section is completed
  const isCompleted = (sectionId: string) => {
    if (!userProgress || !userProgress.completedSections) return false;
    return userProgress.completedSections.includes(sectionId);
  };

  // Handle toggling a bookmark
  const handleBookmarkToggle = (chapterId: string, sectionId: string) => {
    if (!onBookmarkToggle) return;
    
    const isCurrentlyBookmarked = isBookmarked(sectionId);
    onBookmarkToggle(chapterId, sectionId, !isCurrentlyBookmarked);
  };

  // Handle marking a section as completed
  const handleSectionComplete = (sectionId: string) => {
    if (onProgressUpdate) {
      onProgressUpdate(sectionId, !isCompleted(sectionId));
    }
  };

  // Handle search
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  // Render the table of contents
  const renderTableOfContents = () => {
    return (
      <Box
        component="nav"
        aria-label="Handbook table of contents"
        sx={{
          width: isMobile ? '100%' : '280px',
          borderRight: isMobile ? 'none' : `1px solid ${theme.palette.divider}`,
          height: isMobile ? 'auto' : '100%',
          overflowY: 'auto',
          p: 2,
          bgcolor: 'background.paper'
        }}
      >
        <Typography
          variant="h6"
          component="h2"
          sx={{ 
            mb: 2, 
            color: '#003366',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <MenuBookIcon /> Table of Contents
        </Typography>
        
        {/* Search field */}
        <TextField
          fullWidth
          size="small"
          placeholder="Search handbook..."
          value={searchQuery}
          onChange={handleSearchChange}
          sx={{ mb: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
          aria-label="Search the handbook"
        />
        
        {/* Search results */}
        {searchResults.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Search Results ({searchResults.length})
            </Typography>
            <List dense disablePadding>
              {searchResults.map((result) => (
                <ListItem 
                  component="div"
                  key={result.sectionId}
                  onClick={() => {
                    setActiveChapter(result.chapterId);
                    setActiveSection(result.sectionId);
                    setSearchQuery('');
                    if (isMobile) {
                      setShowTableOfContents(false);
                    }
                  }}
                  sx={{
                    borderLeft: '3px solid',
                    borderLeftColor: activeSection === result.sectionId ? '#B31B1B' : 'transparent',
                    bgcolor: activeSection === result.sectionId ? 'rgba(0, 51, 102, 0.05)' : 'transparent',
                    '&:hover': {
                      bgcolor: 'rgba(0, 51, 102, 0.1)',
                      cursor: 'pointer'
                    },
                    '&:focus-visible': {
                      outline: '2px solid #003366',
                      outlineOffset: '-2px',
                    }
                  }}
                >
                  <ListItemText 
                    primary={result.title}
                    primaryTypographyProps={{
                      noWrap: true,
                      variant: 'body2'
                    }}
                  />
                </ListItem>
              ))}
            </List>
            <Divider sx={{ my: 2 }} />
          </Box>
        )}
        
        {/* Table of contents accordion */}
        <List
          component="nav"
          aria-label="handbook chapters"
          dense
          sx={{ 
            '& .MuiListItem-root': {
              borderRadius: 1,
              mb: 0.5,
              '&:focus-visible': {
                outline: '2px solid #003366',
                outlineOffset: '-2px'
              }
            }
          }}
        >
          {handbook.chapters.map((chapter) => {
            const isActive = activeChapter === chapter.id;
            return (
              <React.Fragment key={chapter.id}>
                <ListItem
                  component="div"
                  onClick={() => setActiveChapter(isActive ? '' : chapter.id)}
                  sx={{
                    bgcolor: isActive ? 'rgba(0, 51, 102, 0.05)' : 'transparent',
                    '&:hover': {
                      bgcolor: 'rgba(0, 51, 102, 0.1)',
                      cursor: 'pointer'
                    }
                  }}
                >
                  <ListItemText 
                    primary={`${chapter.order}. ${chapter.title}`}
                    primaryTypographyProps={{
                      fontWeight: isActive ? 'medium' : 'regular'
                    }}
                  />
                  {isActive ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </ListItem>
                
                <Collapse in={isActive} timeout="auto" unmountOnExit>
                  <List component="div" dense disablePadding>
                    {chapter.sections.map((section) => (
                      <ListItem
                        key={section.id}
                        onClick={() => {
                          setActiveSection(section.id);
                          if (isMobile) {
                            setShowTableOfContents(false);
                          }
                        }}
                        sx={{
                          pl: 4,
                          borderLeft: '3px solid',
                          borderLeftColor: activeSection === section.id ? '#B31B1B' : 'transparent',
                          bgcolor: activeSection === section.id ? 'rgba(0, 51, 102, 0.05)' : 'transparent',
                          '&:hover': {
                            bgcolor: 'rgba(0, 51, 102, 0.1)',
                            cursor: 'pointer'
                          }
                        }}
                      >
                        <ListItemText 
                          primary={section.title}
                          primaryTypographyProps={{
                            variant: 'body2',
                          }}
                        />
                        {isCompleted(section.id) && (
                          <CheckCircleIcon 
                            fontSize="small" 
                            color="success" 
                            aria-label="Completed"
                          />
                        )}
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              </React.Fragment>
            );
          })}
        </List>
      </Box>
    );
  };

  // Render handbook content
  const renderContent = () => {
    if (!currentSection) {
      return (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="textSecondary">
            Select a section from the table of contents to begin reading.
          </Typography>
        </Box>
      );
    }

    return (
      <Box sx={{ p: 3 }}>
        {/* Section header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{ color: '#003366' }}
          >
            {currentSection.title}
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {currentSection.keywords && currentSection.keywords.map((keyword, index) => (
                <Chip 
                  key={index} 
                  label={keyword}
                  size="small"
                  sx={{ 
                    bgcolor: 'rgba(0, 51, 102, 0.1)',
                    color: '#003366',
                    '&:focus': {
                      boxShadow: '0 0 0 2px rgba(0, 51, 102, 0.2)'
                    }
                  }}
                />
              ))}
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title={currentSection ? (isBookmarked(currentSection.id) ? "Remove bookmark" : "Add bookmark") : ""}>
                <IconButton 
                  size="small"
                  onClick={() => handleBookmarkToggle(currentChapter?.id || '', currentSection?.id || '')}
                  aria-label={isBookmarked(currentSection?.id || '') ? "Remove bookmark" : "Add bookmark"}
                  sx={{ 
                    color: isBookmarked(currentSection?.id || '') ? '#B31B1B' : 'action.active',
                    '&:focus-visible': {
                      outline: '2px solid #003366',
                      outlineOffset: '2px'
                    }
                  }}
                >
                  {isBookmarked(currentSection.id) ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Print this section">
                <IconButton 
                  size="small"
                  onClick={() => window.print()}
                  aria-label="Print this section"
                  sx={{ 
                    '&:focus-visible': {
                      outline: '2px solid #003366',
                      outlineOffset: '2px'
                    }
                  }}
                >
                  <PrintIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
          
          <Divider sx={{ mb: 3 }} />
        </Box>
        
        {/* Section content */}
        <Box sx={{ mb: 4 }}>
          {currentSection.content.map((element) => renderContentElement(element))}
        </Box>
        
        {/* Navigation and completion */}
        <Box sx={{ mt: 6, pt: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <Button
                variant="outlined"
                size="small"
                color="primary"
                startIcon={<CheckCircleIcon />}
                onClick={() => onProgressUpdate && currentSection && onProgressUpdate(currentSection.id, !isCompleted(currentSection.id))}
                aria-label={currentSection ? (isCompleted(currentSection.id) ? "Mark as incomplete" : "Mark as complete") : ""}
                sx={{ 
                  textTransform: 'none',
                  '&:focus-visible': {
                    outline: '2px solid #003366',
                    outlineOffset: '-2px'
                  } 
                }}
              >
                {currentSection && isCompleted(currentSection.id) ? "Completed" : "Mark as completed"}
              </Button>
            </Grid>
            
            <Grid item xs={12} md={6} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
              <Typography variant="caption" display="block" gutterBottom>
                Last updated: {handbook.lastUpdated}
              </Typography>
              <Typography variant="caption" display="block">
                Version: {handbook.version}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Box>
    );
  };

  // Render different content element types
  const renderContentElement = (element: HandbookContentElement) => {
    switch (element.type) {
      case 'paragraph':
        return (
          <Typography 
            key={element.id} 
            paragraph
            sx={{ mb: 2 }}
            aria-label={element.ariaLabel}
          >
            {element.content}
          </Typography>
        );
      
      case 'heading':
        const HeadingComponent = `h${(element as any).level}` as React.ElementType;
        return (
          <Typography 
            key={element.id} 
            component={HeadingComponent}
            variant={`h${Math.min((element as any).level + 3, 6)}` as any}
            gutterBottom
            sx={{ 
              color: '#003366',
              mt: 3, 
              mb: 2 
            }}
          >
            {(element as any).content}
          </Typography>
        );
      
      case 'list':
        const listElement = element as any;
        return (
          <Box key={element.id} sx={{ mb: 3 }}>
            {listElement.ordered ? (
              <ol aria-label={listElement.ariaLabel}>
                {listElement.items.map((item: string, index: number) => (
                  <li key={index}>
                    <Typography paragraph sx={{ mb: 1 }}>
                      {item}
                    </Typography>
                  </li>
                ))}
              </ol>
            ) : (
              <ul aria-label={listElement.ariaLabel}>
                {listElement.items.map((item: string, index: number) => (
                  <li key={index}>
                    <Typography paragraph sx={{ mb: 1 }}>
                      {item}
                    </Typography>
                  </li>
                ))}
              </ul>
            )}
          </Box>
        );
      
      case 'image':
        const imgElement = element as any;
        return (
          <Box 
            key={element.id} 
            sx={{ 
              my: 3,
              textAlign: 'center' 
            }}
          >
            <Box
              component="img"
              src={imgElement.src}
              alt={imgElement.altText || ''}
              sx={{
                maxWidth: '100%',
                height: 'auto',
                borderRadius: 1,
                boxShadow: 1,
                width: imgElement.width || 'auto'
              }}
            />
            {imgElement.caption && (
              <Typography 
                variant="caption" 
                display="block" 
                sx={{ 
                  mt: 1,
                  fontStyle: 'italic',
                  color: 'text.secondary'
                }}
              >
                {imgElement.caption}
              </Typography>
            )}
          </Box>
        );
      
      case 'table':
        const tableElement = element as any;
        return (
          <Box 
            key={element.id} 
            sx={{ 
              my: 4,
              overflowX: 'auto'
            }}
          >
            <table
              style={{ 
                width: '100%',
                borderCollapse: 'collapse',
                border: '1px solid #e0e0e0',
              }}
              aria-label={tableElement.caption}
              summary={tableElement.summary}
            >
              <caption style={{ 
                captionSide: 'top',
                fontWeight: 'bold',
                padding: '8px',
                backgroundColor: 'rgba(0, 51, 102, 0.05)',
                borderBottom: '1px solid #e0e0e0',
              }}>
                {tableElement.caption}
              </caption>
              <thead>
                <tr style={{ backgroundColor: '#003366' }}>
                  {tableElement.headers.map((header: string, index: number) => (
                    <th 
                      key={index}
                      style={{ 
                        padding: '12px 16px',
                        textAlign: 'left',
                        color: 'white',
                        borderBottom: '2px solid #002244'
                      }}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableElement.rows.map((row: string[], rowIndex: number) => (
                  <tr 
                    key={rowIndex}
                    style={{ 
                      backgroundColor: rowIndex % 2 === 0 ? 'white' : 'rgba(0, 51, 102, 0.05)'
                    }}
                  >
                    {row.map((cell: string, cellIndex: number) => (
                      <td 
                        key={cellIndex}
                        style={{ 
                          padding: '8px 16px',
                          borderBottom: '1px solid #e0e0e0',
                        }}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        );
      
      case 'callout':
        const calloutElement = element as any;
        // Define callout types and their styles
        const calloutTypes = {
          info: { bg: 'rgba(0, 51, 102, 0.1)', icon: <InfoIcon color="primary" /> },
          warning: { bg: 'rgba(255, 152, 0, 0.1)', icon: <WarningIcon sx={{ color: 'warning.main' }} /> },
          success: { bg: 'rgba(76, 175, 80, 0.1)', icon: <CheckCircleIcon color="success" /> },
          error: { bg: 'rgba(211, 47, 47, 0.1)', icon: <ErrorIcon color="error" /> },
        };
        
        // Get the severity from callout element with type safety
        const severity = calloutElement.severity as keyof typeof calloutTypes;
        const calloutColor = calloutTypes[severity] || calloutTypes.info; // Default to info if invalid
        
        return (
          <Alert
            key={element.id}
            severity={calloutElement.severity as any}
            icon={calloutColor.icon}
            sx={{ 
              my: 3,
              p: 2,
              bgcolor: calloutColor.bg,
              '& .MuiAlert-message': {
                width: '100%'
              }
            }}
          >
            {calloutElement.title && (
              <Typography 
                variant="subtitle1" 
                component="h3" 
                gutterBottom
                sx={{ 
                  fontWeight: 'medium'
                }}
              >
                {calloutElement.title}
              </Typography>
            )}
            <Typography variant="body2">
              {calloutElement.content}
            </Typography>
          </Alert>
        );
      
      case 'interactive':
        // Interactive elements would need custom implementation based on type
        // Here's a placeholder structure
        const interactiveElement = element as any;
        return (
          <Paper
            key={element.id}
            elevation={2}
            sx={{ 
              p: 3,
              my: 4,
              border: '1px solid #e0e0e0',
              borderRadius: 2,
              borderLeft: 4,
              borderLeftColor: '#003366'
            }}
          >
            <Typography 
              variant="subtitle1" 
              component="h3" 
              gutterBottom
              sx={{ fontWeight: 'medium' }}
            >
              Interactive Exercise: {interactiveElement.interactiveType}
            </Typography>
            <Typography paragraph sx={{ mb: 2 }}>
              {interactiveElement.instructions}
            </Typography>
            <Box sx={{ 
              p: 2, 
              bgcolor: 'rgba(0, 51, 102, 0.05)',
              borderRadius: 1,
              my: 2
            }}>
              <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                Interactive content would be rendered here based on the type.
              </Typography>
            </Box>
            
            {/* Screen reader only text */}
            <Typography 
              sx={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }}
            >
              {interactiveElement.ariaInstructions}
            </Typography>
          </Paper>
        );
        
      default:
        return null;
    }
  };

  return (
    <Paper
      elevation={2}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '800px',
        width: '100%',
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      {/* Handbook header */}
      <Box
        sx={{
          p: 2,
          bgcolor: '#003366',
          color: 'white',
          borderBottom: '1px solid',
          borderBottomColor: 'divider',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Typography variant="h6" component="h1">
          {handbook.title} <Typography component="span" variant="caption">(v{handbook.version})</Typography>
        </Typography>
        
        {isMobile && (
          <IconButton 
            size="small" 
            sx={{ color: 'white' }}
            onClick={() => setShowTableOfContents(prev => !prev)}
            aria-label={showTableOfContents ? "Hide table of contents" : "Show table of contents"}
          >
            <MenuBookIcon />
          </IconButton>
        )}
      </Box>
      
      {/* Main content area */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          flexGrow: 1,
          overflow: 'hidden'
        }}
      >
        {/* Table of contents sidebar */}
        {(showTableOfContents || !isMobile) && renderTableOfContents()}
        
        {/* Content area */}
        <Box
          ref={contentRef}
          sx={{
            flexGrow: 1,
            overflowY: 'auto',
            bgcolor: 'background.default'
          }}
          role="region"
          aria-label={`${currentSection?.title || 'Handbook content'} section content`}
        >
          {renderContent()}
        </Box>
      </Box>
    </Paper>
  );
};

export default HandbookViewer;
