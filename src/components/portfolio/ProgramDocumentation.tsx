import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Card,
  CardContent,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  IconButton,
  TextField
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Description as DocumentIcon,
  GpsFixed as TargetIcon,
  Assignment as SOPIcon,
  Help as JobAidIcon,
  LocalShipping as DeliverableIcon,
  Analytics as AnalyticsIcon,
  HighQuality as QualityIcon,
  Storage as DataManagementIcon,
  Security as GovernanceIcon,
  Assessment as ReportIcon,
  Edit as EditIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { Project } from '../../services/portfolioService';
import programDocumentationService, { 
  ProgramDocumentation as ProgramDocumentationType, 
  DocumentationSection 
} from '../../services/programDocumentationService';

interface ProgramDocumentationProps {
  open: boolean;
  project: Project | null;
  onClose: () => void;
}



export const ProgramDocumentation: React.FC<ProgramDocumentationProps> = ({
  open,
  project,
  onClose
}) => {
  const [expandedSection, setExpandedSection] = useState<string | false>(false);
  const [documentation, setDocumentation] = useState<ProgramDocumentationType | null>(null);
  const [loading, setLoading] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editContent, setEditContent] = useState<string[]>([]);

  // Load documentation when project changes
  useEffect(() => {
    const loadDocumentation = async () => {
      if (!project || !open) return;
      
      setLoading(true);
      try {
        const docs = await programDocumentationService.getProgramDocumentation(project.id);
        setDocumentation(docs);
      } catch (error) {
        // If documentation doesn't exist, create default
        console.log('Creating default documentation for project:', project.name);
        const defaultDocs = programDocumentationService.getDefaultDocumentation(
          project.id,
          project.name,
          'portfolio-data-governance' // Correct portfolio ID for data governance projects
        );
        try {
          const createdDocs = await programDocumentationService.createProgramDocumentation(defaultDocs);
          setDocumentation(createdDocs);
        } catch (createError) {
          console.error('Error creating documentation:', createError);
          setDocumentation(defaultDocs);
        }
      } finally {
        setLoading(false);
      }
    };

    loadDocumentation();
  }, [project, open]);

  const handleAccordionChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedSection(isExpanded ? panel : false);
  };

  const handleSectionEdit = (sectionId: string, content: string[]) => {
    setEditingSection(sectionId);
    setEditContent([...content]);
  };

  const handleSaveSection = async () => {
    if (!editingSection || !project || !documentation) return;

    try {
      setLoading(true);
      await programDocumentationService.updateDocumentationSection(
        project.id,
        editingSection,
        { content: editContent }
      );
      
      // Update local state
      const updatedDocs = {
        ...documentation,
        sections: documentation.sections.map(section =>
          section.id === editingSection
            ? { ...section, content: editContent }
            : section
        )
      };
      setDocumentation(updatedDocs);
      setEditingSection(null);
      setEditContent([]);
    } catch (error) {
      console.error('Error updating section:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingSection(null);
    setEditContent([]);
  };

  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      'GpsFixed': <TargetIcon />,
      'Analytics': <AnalyticsIcon />,
      'Assignment': <SOPIcon />,
      'Help': <JobAidIcon />,
      'LocalShipping': <DeliverableIcon />,
      'HighQuality': <QualityIcon />,
      'Storage': <DataManagementIcon />,
      'Security': <GovernanceIcon />,
      'Assessment': <ReportIcon />
    };
    return iconMap[iconName] || <TargetIcon />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Complete': return 'success';
      case 'In Progress': return 'warning';
      case 'Not Started': return 'error';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'error';
      case 'Medium': return 'warning';
      case 'Low': return 'success';
      default: return 'default';
    }
  };

  if (!project) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      aria-labelledby="program-documentation-title"
    >
      <DialogTitle id="program-documentation-title">
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <DocumentIcon sx={{ mr: 1, color: '#003366' }} />
            <Typography variant="h6" component="span">
              {project.name} - Program Documentation
            </Typography>
          </Box>
          <IconButton onClick={onClose} aria-label="Close documentation">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Comprehensive documentation package for {project.name} including goals, procedures, 
            deliverables, and governance frameworks aligned with USCIS requirements and federal compliance standards.
          </Typography>
        </Box>

{loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <Typography>Loading documentation...</Typography>
          </Box>
        ) : documentation?.sections.map((section: DocumentationSection) => (
          <Accordion
            key={section.id}
            expanded={expandedSection === section.id}
            onChange={handleAccordionChange(section.id)}
            sx={{ mb: 1 }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`${section.id}-content`}
              id={`${section.id}-header`}
              sx={{
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: '#f5f5f5'
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                  {getIconComponent(section.icon)}
                  <Typography variant="h6" sx={{ ml: 1, color: '#003366' }}>
                    {section.title}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, mr: 2 }}>
                  <Chip
                    size="small"
                    label={section.status}
                    color={getStatusColor(section.status) as any}
                  />
                  <Chip
                    size="small"
                    label={`${section.priority} Priority`}
                    color={getPriorityColor(section.priority) as any}
                    variant="outlined"
                  />
                </Box>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ position: 'relative' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Click anywhere to edit this section
                  </Typography>
                  <Button
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => handleSectionEdit(section.id, section.content)}
                    sx={{ color: '#003366' }}
                  >
                    Edit Section
                  </Button>
                </Box>
                
                {editingSection === section.id ? (
                  <Box>
                    {editContent.map((item: string, index: number) => (
                      <TextField
                        key={index}
                        fullWidth
                        multiline
                        rows={2}
                        value={item}
                        onChange={(e) => {
                          const newContent = [...editContent];
                          newContent[index] = e.target.value;
                          setEditContent(newContent);
                        }}
                        sx={{ mb: 1 }}
                        variant="outlined"
                      />
                    ))}
                    <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                      <Button
                        variant="contained"
                        onClick={handleSaveSection}
                        disabled={loading}
                        sx={{ bgcolor: '#003366' }}
                      >
                        Save Changes
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={handleCancelEdit}
                        disabled={loading}
                      >
                        Cancel
                      </Button>
                    </Box>
                  </Box>
                ) : (
                  <Box
                    onClick={() => handleSectionEdit(section.id, section.content)}
                    sx={{
                      cursor: 'pointer',
                      p: 1,
                      borderRadius: 1,
                      '&:hover': {
                        backgroundColor: '#f8f9fa',
                        border: '1px dashed #003366'
                      }
                    }}
                  >
                    <List dense>
                      {section.content.map((item: string, index: number) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <Box
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                bgcolor: '#003366'
                              }}
                            />
                          </ListItemIcon>
                          <ListItemText
                            primary={item}
                            primaryTypographyProps={{
                              variant: 'body2'
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}
              </Box>
            </AccordionDetails>
          </Accordion>
        ))}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="contained" sx={{ bgcolor: '#003366' }}>
          Close Documentation
        </Button>
      </DialogActions>
    </Dialog>
  );
};
