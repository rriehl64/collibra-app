import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Chip,
  Alert,
  CircularProgress,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab,
  LinearProgress
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Assignment as ProjectIcon,
  Timeline as EpicIcon,
  Task as TaskIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import projectService, { ProjectMetrics } from '../services/projectService';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`project-tabpanel-${index}`}
      aria-labelledby={`project-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const ProjectDetails: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [projectMetrics, setProjectMetrics] = useState<ProjectMetrics | null>(null);
  const [projectBreakdown, setProjectBreakdown] = useState<any>(null);
  const [domainBreakdown, setDomainBreakdown] = useState<any[]>([]);

  useEffect(() => {
    loadProjectData();
  }, []);

  const loadProjectData = async () => {
    try {
      setLoading(true);
      
      // Load all project data
      const [metrics, breakdown, domains] = await Promise.all([
        projectService.getActiveProjects(),
        projectService.getProjectBreakdown(),
        projectService.getProjectsByDomain()
      ]);

      setProjectMetrics(metrics);
      setProjectBreakdown(breakdown);
      setDomainBreakdown(domains);
    } catch (error) {
      console.error('Error loading project data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleBack = () => {
    navigate('/admin/data-strategy-operations-center');
  };

  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'done':
        return '#4caf50';
      case 'in progress':
        return '#2196f3';
      case 'planning':
        return '#ff9800';
      case 'open':
        return '#f44336';
      default:
        return '#757575';
    }
  };

  const getPriorityColor = (priority: string): string => {
    switch (priority.toLowerCase()) {
      case 'high':
      case 'urgent':
        return '#f44336';
      case 'medium':
        return '#ff9800';
      case 'low':
        return '#4caf50';
      default:
        return '#757575';
    }
  };

  // Access control
  if (!user || (user.role !== 'admin' && user.role !== 'data-steward')) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          <Typography variant="h6">Access Denied</Typography>
          <Typography variant="body2">
            You need admin or data steward privileges to access project details.
          </Typography>
        </Alert>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading project details...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mr: 2 }}
          aria-label="Back to Data Strategy Operations Center"
        >
          Back
        </Button>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" sx={{ color: '#003366', fontWeight: 'bold' }}>
            Active Projects Details
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Comprehensive breakdown of all active projects and initiatives
          </Typography>
        </Box>
        <Button
          startIcon={<RefreshIcon />}
          onClick={loadProjectData}
          variant="outlined"
        >
          Refresh
        </Button>
      </Box>

      {/* Summary Cards */}
      {projectMetrics && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <ProjectIcon sx={{ mr: 1, color: '#003366' }} />
                  <Typography variant="h6">Total Active</Typography>
                </Box>
                <Typography variant="h3" sx={{ color: '#1976d2', fontWeight: 'bold' }}>
                  {projectMetrics.totalActiveProjects}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  All active projects
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <TaskIcon sx={{ mr: 1, color: '#4caf50' }} />
                  <Typography variant="h6">Tasks</Typography>
                </Box>
                <Typography variant="h3" sx={{ color: '#4caf50', fontWeight: 'bold' }}>
                  {projectMetrics.taskProjects}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Active tasks
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <EpicIcon sx={{ mr: 1, color: '#9c27b0' }} />
                  <Typography variant="h6">Epics</Typography>
                </Box>
                <Typography variant="h3" sx={{ color: '#9c27b0', fontWeight: 'bold' }}>
                  {projectMetrics.strategicEpics}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Strategic epics
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <ProjectIcon sx={{ mr: 1, color: '#f57c00' }} />
                  <Typography variant="h6">Priorities</Typography>
                </Box>
                <Typography variant="h3" sx={{ color: '#f57c00', fontWeight: 'bold' }}>
                  {projectMetrics.strategicPriorities}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Strategic priorities
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Status Breakdown */}
      {projectMetrics && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ color: '#003366' }}>
              Project Status Distribution
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ color: '#2196f3', fontWeight: 'bold' }}>
                    {projectMetrics.projectsByStatus.inProgress}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">In Progress</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ color: '#ff9800', fontWeight: 'bold' }}>
                    {projectMetrics.projectsByStatus.pending}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">Planning/Open</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ color: '#4caf50', fontWeight: 'bold' }}>
                    {projectMetrics.projectsByStatus.completed}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">Completed</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ color: '#757575', fontWeight: 'bold' }}>
                    {projectMetrics.projectsByStatus.active}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">Other Active</Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Detailed Breakdown Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={currentTab} onChange={handleTabChange} aria-label="project details tabs">
            <Tab label="All Projects" />
            <Tab label="Tasks" />
            <Tab label="Strategic Epics" />
            <Tab label="By Domain" />
          </Tabs>
        </Box>

        <TabPanel value={currentTab} index={0}>
          {/* All Projects Combined */}
          <Typography variant="h6" gutterBottom>All Active Projects</Typography>
          {projectBreakdown && (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Priority</TableCell>
                    <TableCell>Created</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[...projectBreakdown.tasks, ...projectBreakdown.epics, ...projectBreakdown.priorities]
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .map((project, index) => (
                      <TableRow key={`${project.type}-${project.id}-${index}`}>
                        <TableCell>{project.title}</TableCell>
                        <TableCell>
                          <Chip 
                            label={project.type} 
                            size="small"
                            color={project.type === 'Task' ? 'success' : project.type === 'Epic' ? 'secondary' : 'warning'}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={project.status} 
                            size="small"
                            sx={{ 
                              backgroundColor: getStatusColor(project.status),
                              color: 'white'
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={project.priority} 
                            size="small"
                            sx={{ 
                              backgroundColor: getPriorityColor(project.priority),
                              color: 'white'
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          {new Date(project.createdAt).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </TabPanel>

        <TabPanel value={currentTab} index={1}>
          {/* Tasks Only */}
          <Typography variant="h6" gutterBottom>Active Tasks</Typography>
          {projectBreakdown?.tasks && (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Priority</TableCell>
                    <TableCell>Assigned To</TableCell>
                    <TableCell>Due Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {projectBreakdown.tasks.map((task: any) => (
                    <TableRow key={task.id}>
                      <TableCell>{task.title}</TableCell>
                      <TableCell>
                        <Chip 
                          label={task.status} 
                          size="small"
                          sx={{ 
                            backgroundColor: getStatusColor(task.status),
                            color: 'white'
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={task.priority} 
                          size="small"
                          sx={{ 
                            backgroundColor: getPriorityColor(task.priority),
                            color: 'white'
                          }}
                        />
                      </TableCell>
                      <TableCell>{task.assignedTo || 'Unassigned'}</TableCell>
                      <TableCell>
                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </TabPanel>

        <TabPanel value={currentTab} index={2}>
          {/* Strategic Epics Only */}
          <Typography variant="h6" gutterBottom>Strategic Epics</Typography>
          {projectBreakdown?.epics && (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Priority</TableCell>
                    <TableCell>Domain</TableCell>
                    <TableCell>Estimated LOE</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {projectBreakdown.epics.map((epic: any) => (
                    <TableRow key={epic.id}>
                      <TableCell>{epic.title}</TableCell>
                      <TableCell>
                        <Chip 
                          label={epic.status} 
                          size="small"
                          sx={{ 
                            backgroundColor: getStatusColor(epic.status),
                            color: 'white'
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={epic.priority} 
                          size="small"
                          sx={{ 
                            backgroundColor: getPriorityColor(epic.priority),
                            color: 'white'
                          }}
                        />
                      </TableCell>
                      <TableCell>{epic.domain || 'Not specified'}</TableCell>
                      <TableCell>{epic.estimatedLOE || 'Not estimated'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </TabPanel>

        <TabPanel value={currentTab} index={3}>
          {/* By Domain */}
          <Typography variant="h6" gutterBottom>Projects by Domain</Typography>
          {domainBreakdown.length > 0 ? (
            <Grid container spacing={3}>
              {domainBreakdown.map((domain, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {domain.domain || 'Unspecified Domain'}
                      </Typography>
                      <Typography variant="h4" sx={{ color: '#1976d2', fontWeight: 'bold', mb: 2 }}>
                        {domain.totalProjects}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Active projects in this domain
                      </Typography>
                      {domain.projects && domain.projects.length > 0 && (
                        <Box>
                          <Typography variant="subtitle2" gutterBottom>Recent Projects:</Typography>
                          {domain.projects.slice(0, 3).map((project: any, idx: number) => (
                            <Box key={idx} sx={{ mb: 1 }}>
                              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                {project.title}
                              </Typography>
                              <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                                <Chip 
                                  label={project.status} 
                                  size="small"
                                  sx={{ 
                                    backgroundColor: getStatusColor(project.status),
                                    color: 'white'
                                  }}
                                />
                                <Chip 
                                  label={project.priority} 
                                  size="small"
                                  sx={{ 
                                    backgroundColor: getPriorityColor(project.priority),
                                    color: 'white'
                                  }}
                                />
                              </Box>
                            </Box>
                          ))}
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Alert severity="info">
              No domain-specific project data available. Projects may not have domain assignments.
            </Alert>
          )}
        </TabPanel>
      </Card>
    </Container>
  );
};

export default ProjectDetails;
