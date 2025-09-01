import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  CircularProgress,
  Alert,
  IconButton,
  Collapse,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  Edit as EditIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  CalendarMonth as CalendarIcon
} from '@mui/icons-material';
import { monthlyStatusService, MonthlyStatusItem } from '../services/api';

const MonthlyStatusList: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [monthlyStatuses, setMonthlyStatuses] = useState<MonthlyStatusItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [teamFilter, setTeamFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [monthFilter, setMonthFilter] = useState('');
  const [total, setTotal] = useState(0);
  const [editingItem, setEditingItem] = useState<MonthlyStatusItem | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  const fetchMonthlyStatuses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params: Record<string, any> = {
        limit: 40,
        page: 1,
        sort: '-year -month'
      };
      
      if (searchQuery.trim()) params.q = searchQuery.trim();
      if (teamFilter) params.team = teamFilter;
      if (yearFilter) params.year = yearFilter;
      if (monthFilter) params.month = monthFilter;
      
      const response = await monthlyStatusService.list(params);
      setMonthlyStatuses(response.items);
      setTotal(response.total);
    } catch (err) {
      console.error('Error fetching monthly statuses:', err);
      setError('Failed to load monthly status reports');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, teamFilter, yearFilter, monthFilter]);

  useEffect(() => {
    // Only fetch data when authentication is complete and user is available
    if (!authLoading && user) {
      fetchMonthlyStatuses();
    }
  }, [fetchMonthlyStatuses, authLoading, user]);

  const handleSearch = () => {
    fetchMonthlyStatuses();
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setTeamFilter('');
    setYearFilter('');
    setMonthFilter('');
  };

  const handleCardClick = (item: MonthlyStatusItem) => {
    setEditingItem({ ...item });
    setEditDialogOpen(true);
  };

  const handleSave = async () => {
    if (!editingItem?._id) return;
    
    try {
      setSaving(true);
      await monthlyStatusService.update(editingItem._id, editingItem);
      setEditDialogOpen(false);
      setEditingItem(null);
      fetchMonthlyStatuses();
    } catch (err) {
      console.error('Error saving monthly status:', err);
      setError('Failed to save monthly status');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditDialogOpen(false);
    setEditingItem(null);
  };

  const toggleCardExpansion = (cardId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(cardId)) {
      newExpanded.delete(cardId);
    } else {
      newExpanded.add(cardId);
    }
    setExpandedCards(newExpanded);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'green': return '#4caf50';
      case 'yellow': return '#ff9800';
      case 'red': return '#f44336';
      default: return '#757575';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'green': return 'On Track';
      case 'yellow': return 'At Risk';
      case 'red': return 'Critical';
      default: return 'Unknown';
    }
  };

  const uniqueTeams = Array.from(new Set(monthlyStatuses.map(item => item.team))).filter(Boolean);
  const uniqueYears = Array.from(new Set(monthlyStatuses.map(item => item.year))).sort((a, b) => b - a);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#003366', fontWeight: 'bold' }}>
        Monthly Status Reports
      </Typography>

      {/* Search and Filters */}
      <Card sx={{ mb: 3, p: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Search monthly reports"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />,
              }}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Team</InputLabel>
              <Select
                value={teamFilter}
                label="Team"
                onChange={(e) => setTeamFilter(e.target.value)}
              >
                <MenuItem value="">All Teams</MenuItem>
                {uniqueTeams.map(team => (
                  <MenuItem key={team} value={team}>{team}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Year</InputLabel>
              <Select
                value={yearFilter}
                label="Year"
                onChange={(e) => setYearFilter(e.target.value)}
              >
                <MenuItem value="">All Years</MenuItem>
                {uniqueYears.map(year => (
                  <MenuItem key={year} value={year}>{year}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Month</InputLabel>
              <Select
                value={monthFilter}
                label="Month"
                onChange={(e) => setMonthFilter(e.target.value)}
              >
                <MenuItem value="">All Months</MenuItem>
                {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                  <MenuItem key={month} value={month}>
                    {new Date(2024, month - 1).toLocaleString('default', { month: 'long' })}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                onClick={handleSearch}
                sx={{ bgcolor: '#003366', '&:hover': { bgcolor: '#002244' } }}
              >
                Search
              </Button>
              <Button
                variant="outlined"
                onClick={handleClearSearch}
                startIcon={<ClearIcon />}
              >
                Clear
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Card>

      {/* Results Summary */}
      <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
        {loading ? 'Loading...' : `${monthlyStatuses.length} of ${total} records shown`}
      </Typography>

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Monthly Status Cards */}
      {!loading && (
        <Grid container spacing={2}>
          {monthlyStatuses.map((item) => {
            const isExpanded = expandedCards.has(item._id || '');
            return (
              <Grid item xs={12} md={6} lg={4} key={item._id}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 4,
                      bgcolor: '#f8f9fa'
                    },
                    '&:focus-within': {
                      outline: '2px solid #003366',
                      outlineOffset: '2px'
                    },
                    border: '1px solid #e0e0e0'
                  }}
                  onClick={() => handleCardClick(item)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Edit monthly status for ${item.name} - ${item.monthName} ${item.year}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleCardClick(item);
                    }
                  }}
                >
                  <CardContent>
                    {/* Header */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold', color: '#003366' }}>
                          {item.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.team}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip
                          label={getStatusLabel(item.overallStatus)}
                          sx={{
                            bgcolor: getStatusColor(item.overallStatus),
                            color: 'white',
                            fontWeight: 'bold'
                          }}
                        />
                        <IconButton
                          size="small"
                          onClick={(e) => toggleCardExpansion(item._id || '', e)}
                          aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
                        >
                          {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                      </Box>
                    </Box>

                    {/* Period Info */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <CalendarIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        {item.monthName} {item.year}
                      </Typography>
                    </Box>

                    {/* Summary Stats */}
                    <Grid container spacing={1} sx={{ mb: 2 }}>
                      <Grid item xs={4}>
                        <Typography variant="caption" color="text.secondary">Hours</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {item.totalHoursWorked}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="caption" color="text.secondary">Avg/Week</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {item.averageHoursPerWeek?.toFixed(1)}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="caption" color="text.secondary">Weeks</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {item.weeksReported}
                        </Typography>
                      </Grid>
                    </Grid>

                    {/* Executive Summary Preview */}
                    {item.executiveSummary && (
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'text.secondary',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          mb: 1
                        }}
                      >
                        {item.executiveSummary}
                      </Typography>
                    )}

                    {/* Expanded Details */}
                    <Collapse in={isExpanded}>
                      <Divider sx={{ my: 2 }} />
                      
                      {/* Weekly Status Breakdown */}
                      {item.weeklyStatuses && item.weeklyStatuses.length > 0 && (
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                            Weekly Status Breakdown
                          </Typography>
                          <List dense>
                            {item.weeklyStatuses.map((weekly, index) => (
                              <ListItem key={index} sx={{ py: 0.5 }}>
                                <ListItemText
                                  primary={
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                      <Typography variant="body2">
                                        Week of {new Date(weekly.weekStart).toLocaleDateString()}
                                      </Typography>
                                      <Chip
                                        size="small"
                                        label={getStatusLabel(weekly.status)}
                                        sx={{
                                          bgcolor: getStatusColor(weekly.status),
                                          color: 'white',
                                          fontSize: '0.75rem'
                                        }}
                                      />
                                    </Box>
                                  }
                                />
                              </ListItem>
                            ))}
                          </List>
                        </Box>
                      )}

                      {/* Monthly Accomplishments */}
                      {item.monthlyAccomplishments && (
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                            Key Accomplishments
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {item.monthlyAccomplishments}
                          </Typography>
                        </Box>
                      )}
                    </Collapse>

                    {/* Edit Indicator */}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                      <EditIcon sx={{ color: 'text.disabled', fontSize: 16 }} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* No Results */}
      {!loading && monthlyStatuses.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No monthly status reports found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search criteria or filters
          </Typography>
        </Box>
      )}

      {/* Edit Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={handleCancel}
        maxWidth="md"
        fullWidth
        aria-labelledby="edit-monthly-status-title"
      >
        <DialogTitle id="edit-monthly-status-title">
          Edit Monthly Status - {editingItem?.name} ({editingItem?.monthName} {editingItem?.year})
        </DialogTitle>
        <DialogContent>
          {editingItem && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Overall Status</InputLabel>
                  <Select
                    value={editingItem.overallStatus}
                    label="Overall Status"
                    onChange={(e) => setEditingItem({
                      ...editingItem,
                      overallStatus: e.target.value as 'green' | 'yellow' | 'red'
                    })}
                  >
                    <MenuItem value="green">On Track</MenuItem>
                    <MenuItem value="yellow">At Risk</MenuItem>
                    <MenuItem value="red">Critical</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Team"
                  value={editingItem.team}
                  onChange={(e) => setEditingItem({ ...editingItem, team: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Executive Summary"
                  value={editingItem.executiveSummary || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, executiveSummary: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Monthly Accomplishments"
                  value={editingItem.monthlyAccomplishments || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, monthlyAccomplishments: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Monthly Tasks Status"
                  value={editingItem.monthlyTasksStatus || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, monthlyTasksStatus: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Monthly Issues & Needs"
                  value={editingItem.monthlyIssuesNeeds || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, monthlyIssuesNeeds: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Monthly Next Steps"
                  value={editingItem.monthlyNextSteps || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, monthlyNextSteps: e.target.value })}
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} disabled={saving}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={saving}
            sx={{ bgcolor: '#003366', '&:hover': { bgcolor: '#002244' } }}
          >
            {saving ? <CircularProgress size={20} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MonthlyStatusList;
