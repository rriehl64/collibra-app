import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Alert,
  CircularProgress,
  Menu,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Assignment as TaskIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CompleteIcon,
  PlayArrow as StartIcon,
  Pause as PauseIcon,
  MoreVert as MoreVertIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Flag as PriorityIcon
} from '@mui/icons-material';
import taskService, { Task, CreateTaskData, UpdateTaskData } from '../services/taskService';
import { useAuth } from '../contexts/AuthContext';

interface TaskMetrics {
  total: number;
  open: number;
  inProgress: number;
  completed: number;
  overdue: number;
}

const OpenTasks: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [metrics, setMetrics] = useState<TaskMetrics>({
    total: 0,
    open: 0,
    inProgress: 0,
    completed: 0,
    overdue: 0
  });
  
  // Filters and search
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all');
  
  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  
  // Form states
  const [formData, setFormData] = useState<CreateTaskData>({
    title: '',
    description: '',
    dueDate: '',
    priority: 'Medium',
    taskType: 'Other'
  });
  
  // Menu state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuTask, setMenuTask] = useState<Task | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    filterTasks();
  }, [tasks, searchTerm, statusFilter, priorityFilter, typeFilter, assigneeFilter]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await taskService.getTasks();
      const tasksData = response.data || [];
      setTasks(tasksData);
      calculateMetrics(tasksData);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateMetrics = (tasksData: Task[]) => {
    const now = new Date();
    const metrics: TaskMetrics = {
      total: tasksData.length,
      open: tasksData.filter(t => t.status === 'Open').length,
      inProgress: tasksData.filter(t => t.status === 'In Progress').length,
      completed: tasksData.filter(t => t.status === 'Completed').length,
      overdue: tasksData.filter(t => 
        t.status !== 'Completed' && new Date(t.dueDate) < now
      ).length
    };
    setMetrics(metrics);
  };

  const filterTasks = () => {
    let filtered = tasks;

    if (searchTerm) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(task => task.status === statusFilter);
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(task => task.priority === priorityFilter);
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(task => task.taskType === typeFilter);
    }

    if (assigneeFilter !== 'all') {
      if (assigneeFilter === 'me') {
        filtered = filtered.filter(task => task.assignee?._id === user?.id);
      } else {
        filtered = filtered.filter(task => task.assignee?._id === assigneeFilter);
      }
    }

    setFilteredTasks(filtered);
  };

  const handleCreateTask = async () => {
    try {
      await taskService.createTask(formData);
      setCreateDialogOpen(false);
      setFormData({
        title: '',
        description: '',
        dueDate: '',
        priority: 'Medium',
        taskType: 'Other'
      });
      fetchTasks();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleUpdateTask = async () => {
    if (!selectedTask) return;
    
    try {
      await taskService.updateTask(selectedTask._id, formData);
      setEditDialogOpen(false);
      setSelectedTask(null);
      fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    try {
      await taskService.updateTaskStatus(taskId, newStatus);
      fetchTasks();
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await taskService.deleteTask(taskId);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const openEditDialog = (task: Task) => {
    setSelectedTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      priority: task.priority,
      taskType: task.taskType,
      assignee: task.assignee?._id
    });
    setEditDialogOpen(true);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, task: Task) => {
    setAnchorEl(event.currentTarget);
    setMenuTask(task);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuTask(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'info';
      case 'In Progress': return 'warning';
      case 'Completed': return 'success';
      case 'On Hold': return 'default';
      case 'Cancelled': return 'error';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Urgent': return '#d32f2f';
      case 'High': return '#f57c00';
      case 'Medium': return '#fbc02d';
      case 'Low': return '#388e3c';
      default: return '#757575';
    }
  };

  const isOverdue = (dueDate: string, status: string) => {
    return status !== 'Completed' && new Date(dueDate) < new Date();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#003366' }}>
            <TaskIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
            Task Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage and track tasks across your organization
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateDialogOpen(true)}
          sx={{ backgroundColor: '#003366' }}
        >
          Create Task
        </Button>
      </Box>

      {/* Metrics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card elevation={0} sx={{ backgroundColor: '#E3F2FD', height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Total Tasks</Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                {metrics.total}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card elevation={0} sx={{ backgroundColor: '#E8F5E9', height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Open</Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#388e3c' }}>
                {metrics.open}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card elevation={0} sx={{ backgroundColor: '#FFF3E0', height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>In Progress</Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#f57c00' }}>
                {metrics.inProgress}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card elevation={0} sx={{ backgroundColor: '#E8F5E9', height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Completed</Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                {metrics.completed}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card elevation={0} sx={{ backgroundColor: '#FFEBEE', height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Overdue</Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#d32f2f' }}>
                {metrics.overdue}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          <FilterListIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Filters & Search
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">All Statuses</MenuItem>
                <MenuItem value="Open">Open</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="On Hold">On Hold</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
                <MenuItem value="Cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={priorityFilter}
                label="Priority"
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <MenuItem value="all">All Priorities</MenuItem>
                <MenuItem value="Urgent">Urgent</MenuItem>
                <MenuItem value="High">High</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="Low">Low</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                value={typeFilter}
                label="Type"
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <MenuItem value="all">All Types</MenuItem>
                <MenuItem value="Data Quality">Data Quality</MenuItem>
                <MenuItem value="Governance">Governance</MenuItem>
                <MenuItem value="Compliance">Compliance</MenuItem>
                <MenuItem value="Review">Review</MenuItem>
                <MenuItem value="Documentation">Documentation</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Assignee</InputLabel>
              <Select
                value={assigneeFilter}
                label="Assignee"
                onChange={(e) => setAssigneeFilter(e.target.value)}
              >
                <MenuItem value="all">All Assignees</MenuItem>
                <MenuItem value="me">My Tasks</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Tasks Table */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Tasks ({filteredTasks.length})
        </Typography>
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Task</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Assignee</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTasks.map((task) => (
                <TableRow key={task._id} hover>
                  <TableCell>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                        {task.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {task.description}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={task.status}
                      color={getStatusColor(task.status) as any}
                      size="small"
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
                  <TableCell>{task.taskType}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <PersonIcon sx={{ mr: 1, fontSize: 16 }} />
                      {task.assignee?.name || 'Unassigned'}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CalendarIcon sx={{ mr: 1, fontSize: 16 }} />
                      <Typography 
                        variant="body2" 
                        color={isOverdue(task.dueDate, task.status) ? 'error' : 'inherit'}
                      >
                        {formatDate(task.dueDate)}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuClick(e, task)}
                      aria-label="Task actions"
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {filteredTasks.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              No tasks match the current filters
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => {
          if (menuTask) openEditDialog(menuTask);
          handleMenuClose();
        }}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        
        {menuTask?.status === 'Open' && (
          <MenuItem onClick={() => {
            if (menuTask) handleStatusChange(menuTask._id, 'In Progress');
            handleMenuClose();
          }}>
            <ListItemIcon>
              <StartIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Start</ListItemText>
          </MenuItem>
        )}
        
        {menuTask?.status === 'In Progress' && (
          <>
            <MenuItem onClick={() => {
              if (menuTask) handleStatusChange(menuTask._id, 'Completed');
              handleMenuClose();
            }}>
              <ListItemIcon>
                <CompleteIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Complete</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => {
              if (menuTask) handleStatusChange(menuTask._id, 'On Hold');
              handleMenuClose();
            }}>
              <ListItemIcon>
                <PauseIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Put on Hold</ListItemText>
            </MenuItem>
          </>
        )}
        
        <MenuItem onClick={() => {
          if (menuTask) handleDeleteTask(menuTask._id);
          handleMenuClose();
        }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

      {/* Create Task Dialog */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Task</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Task Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={formData.priority}
                    label="Priority"
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                  >
                    <MenuItem value="Low">Low</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="High">High</MenuItem>
                    <MenuItem value="Urgent">Urgent</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={formData.taskType}
                    label="Type"
                    onChange={(e) => setFormData({ ...formData, taskType: e.target.value as any })}
                  >
                    <MenuItem value="Data Quality">Data Quality</MenuItem>
                    <MenuItem value="Governance">Governance</MenuItem>
                    <MenuItem value="Compliance">Compliance</MenuItem>
                    <MenuItem value="Review">Review</MenuItem>
                    <MenuItem value="Documentation">Documentation</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Due Date"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleCreateTask} 
            variant="contained"
            disabled={!formData.title || !formData.dueDate}
          >
            Create Task
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Task Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Task</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Task Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={formData.priority}
                    label="Priority"
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                  >
                    <MenuItem value="Low">Low</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="High">High</MenuItem>
                    <MenuItem value="Urgent">Urgent</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={formData.taskType}
                    label="Type"
                    onChange={(e) => setFormData({ ...formData, taskType: e.target.value as any })}
                  >
                    <MenuItem value="Data Quality">Data Quality</MenuItem>
                    <MenuItem value="Governance">Governance</MenuItem>
                    <MenuItem value="Compliance">Compliance</MenuItem>
                    <MenuItem value="Review">Review</MenuItem>
                    <MenuItem value="Documentation">Documentation</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Due Date"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleUpdateTask} 
            variant="contained"
            disabled={!formData.title || !formData.dueDate}
          >
            Update Task
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OpenTasks;
