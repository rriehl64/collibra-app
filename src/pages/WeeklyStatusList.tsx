import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Button, Paper, Stack, TextField, MenuItem, Chip, Dialog, DialogTitle, DialogContent, DialogActions, Grid, Card, CardContent, IconButton } from '@mui/material';
import { Edit as EditIcon, Close as CloseIcon } from '@mui/icons-material';
import dayjs from 'dayjs';
import { weeklyStatusService, WeeklyStatusItem } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const toIsoMonday = (input?: string | Date) => {
  const base = input ? new Date(input) : new Date();
  if (isNaN(base.getTime())) return '';
  const day = base.getUTCDay();
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(Date.UTC(base.getUTCFullYear(), base.getUTCMonth(), base.getUTCDate(), 0, 0, 0, 0));
  monday.setUTCDate(monday.getUTCDate() + diff);
  return monday.toISOString();
};

const WeeklyStatusList: React.FC = () => {
  const { user } = useAuth();
  const [rows, setRows] = useState<WeeklyStatusItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [team, setTeam] = useState<string>('');
  const [week, setWeek] = useState<string>(toIsoMonday());
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [q, setQ] = useState('');
  const [editingItem, setEditingItem] = useState<WeeklyStatusItem | null>(null);
  const [editForm, setEditForm] = useState<Partial<WeeklyStatusItem>>({});
  const [totalCount, setTotalCount] = useState<number>(0);

  const handleEditClick = (item: WeeklyStatusItem) => {
    setEditingItem(item);
    setEditForm({ ...item });
  };

  const handleEditClose = () => {
    setEditingItem(null);
    setEditForm({});
  };

  const handleEditSave = async () => {
    if (!editingItem || !editForm) return;
    
    try {
      setLoading(true);
      await weeklyStatusService.update(editingItem._id as string, editForm);
      await load(); // Refresh data
      handleEditClose();
    } catch (e) {
      console.error('Failed to update weekly status:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (field: keyof WeeklyStatusItem, value: any) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  const load = async () => {
    setLoading(true);
    try {
      // Request most recent 40 regardless of week (avoid empty from/to causing 404)
      const params: Record<string, any> = { limit: 40, page: 1, sort: '-weekStart' };
      if (team) params.team = team;
      if (q) params.q = q;

      const { items, total } = await weeklyStatusService.list(params);
      const filtered = statusFilter ? items.filter((i) => i.status === statusFilter) : items;
      setRows(filtered);
      setTotalCount(total);
    } catch (e) {
      console.error('Failed to load weekly status:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [team, statusFilter, q]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <main id="main-content" tabIndex={-1} aria-label="Weekly Status main content">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
              Weekly Status
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {loading ? 'Loading...' : `${rows.length} of ${totalCount} records shown`}
            </Typography>
          </Box>
          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => { /* TODO: open create/edit drawer */ }}
              aria-label="Create a new weekly status"
            >
              New Weekly Status
            </Button>
            <Button
              variant="outlined"
              onClick={load}
              aria-label="Refresh weekly status list"
            >
              Refresh
            </Button>
          </Stack>
        </Box>

        <Paper role="region" aria-label="Weekly Status controls" sx={{ p: 2, mb: 2 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
            <TextField
              label="Week (Monday)"
              type="date"
              value={week ? dayjs(week).format('YYYY-MM-DD') : ''}
              onChange={(e) => {
                const v = e.target.value;
                if (!v) { return; }
                const iso = toIsoMonday(v);
                if (!iso) return;
                setWeek(iso);
              }}
              inputProps={{ 'aria-label': 'Select ISO week Monday' }}
              sx={{ width: 220 }}
            />
            <TextField
              label="Team"
              value={team}
              onChange={(e) => setTeam(e.target.value)}
              placeholder="e.g., USCIS-DSSS"
              inputProps={{ 'aria-label': 'Filter by team' }}
              sx={{ minWidth: 220 }}
            />
            <TextField
              label="Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              select
              sx={{ width: 160 }}
              inputProps={{ 'aria-label': 'Filter by status' }}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="green">Green</MenuItem>
              <MenuItem value="yellow">Yellow</MenuItem>
              <MenuItem value="red">Red</MenuItem>
            </TextField>
            <TextField
              label="Search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search text fields"
              inputProps={{ 'aria-label': 'Search weekly status text' }}
              sx={{ flex: 1, minWidth: 220 }}
            />
          </Stack>
        </Paper>

        <Paper role="region" aria-label="Weekly Status list" sx={{ p: 2 }}>
          <Grid container spacing={2}>
            {rows.map((item) => {
              const statusColor = item.status === 'red' ? 'error' : item.status === 'yellow' ? 'warning' : 'success';
              return (
                <Grid item xs={12} sm={6} md={4} key={item._id}>
                  <Card
                    sx={{
                      cursor: 'pointer',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 3,
                        borderColor: '#003366'
                      },
                      '&:focus-within': {
                        outline: '2px solid #003366',
                        outlineOffset: '2px'
                      },
                      border: '1px solid #e0e0e0',
                      height: '100%'
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`Edit weekly status for ${item.name}, week of ${dayjs(item.weekStart).format('YYYY-MM-DD')}`}
                    onClick={() => handleEditClick(item)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleEditClick(item);
                      }
                    }}
                  >
                    <CardContent sx={{ pb: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Typography variant="h6" component="h3" sx={{ fontWeight: 600, color: '#003366' }}>
                          {item.name}
                        </Typography>
                        <Chip
                          size="small"
                          color={statusColor}
                          label={item.status?.toUpperCase() || 'GREEN'}
                          sx={{ fontWeight: 700 }}
                        />
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        <strong>Team:</strong> {item.team}
                      </Typography>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        <strong>Week:</strong> {dayjs(item.weekStart).format('YYYY-MM-DD')}
                      </Typography>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        <strong>Hours:</strong> {item.hoursWorked || 0}
                      </Typography>
                      
                      {item.summary && (
                        <Typography variant="body2" sx={{ 
                          mt: 1, 
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}>
                          {item.summary}
                        </Typography>
                      )}
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                        <Typography variant="caption" color="text.secondary">
                          Updated: {dayjs(item.updatedAt).format('MM/DD HH:mm')}
                        </Typography>
                        <EditIcon sx={{ color: '#003366', fontSize: 18 }} />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
          
          {rows.length === 0 && !loading && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="text.secondary">
                No weekly status records found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Try adjusting your filters or create a new weekly status report
              </Typography>
            </Box>
          )}
        </Paper>
        {/* Edit Dialog */}
        <Dialog
          open={!!editingItem}
          onClose={handleEditClose}
          maxWidth="md"
          fullWidth
          aria-labelledby="edit-dialog-title"
        >
          <DialogTitle id="edit-dialog-title" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" component="h2">
              Edit Weekly Status - {editingItem?.name}
            </Typography>
            <IconButton
              onClick={handleEditClose}
              aria-label="Close edit dialog"
              sx={{ color: '#003366' }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Name"
                  value={editForm.name || ''}
                  onChange={(e) => handleFormChange('name', e.target.value)}
                  inputProps={{ 'aria-label': 'Employee name' }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Team"
                  value={editForm.team || ''}
                  onChange={(e) => handleFormChange('team', e.target.value)}
                  inputProps={{ 'aria-label': 'Team name' }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Status"
                  select
                  value={editForm.status || 'green'}
                  onChange={(e) => handleFormChange('status', e.target.value)}
                  inputProps={{ 'aria-label': 'Project status' }}
                >
                  <MenuItem value="green">Green</MenuItem>
                  <MenuItem value="yellow">Yellow</MenuItem>
                  <MenuItem value="red">Red</MenuItem>
                </TextField>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Hours Worked"
                  type="number"
                  value={editForm.hoursWorked || 0}
                  onChange={(e) => handleFormChange('hoursWorked', Number(e.target.value))}
                  inputProps={{ 'aria-label': 'Hours worked this week', min: 0, max: 100 }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Summary"
                  multiline
                  rows={3}
                  value={editForm.summary || ''}
                  onChange={(e) => handleFormChange('summary', e.target.value)}
                  inputProps={{ 'aria-label': 'Weekly summary' }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Accomplishments"
                  multiline
                  rows={3}
                  value={editForm.accomplishments || ''}
                  onChange={(e) => handleFormChange('accomplishments', e.target.value)}
                  inputProps={{ 'aria-label': 'Weekly accomplishments' }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Tasks Status"
                  multiline
                  rows={3}
                  value={editForm.tasksStatus || ''}
                  onChange={(e) => handleFormChange('tasksStatus', e.target.value)}
                  inputProps={{ 'aria-label': 'Current tasks status' }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Issues & Needs"
                  multiline
                  rows={3}
                  value={editForm.issuesNeeds || ''}
                  onChange={(e) => handleFormChange('issuesNeeds', e.target.value)}
                  inputProps={{ 'aria-label': 'Issues and needs' }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Next Steps"
                  multiline
                  rows={3}
                  value={editForm.nextSteps || ''}
                  onChange={(e) => handleFormChange('nextSteps', e.target.value)}
                  inputProps={{ 'aria-label': 'Next steps planned' }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Communications"
                  multiline
                  rows={3}
                  value={editForm.communications || ''}
                  onChange={(e) => handleFormChange('communications', e.target.value)}
                  inputProps={{ 'aria-label': 'Communications and meetings' }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          
          <DialogActions sx={{ p: 3 }}>
            <Button
              onClick={handleEditClose}
              variant="outlined"
              aria-label="Cancel editing"
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditSave}
              variant="contained"
              disabled={loading}
              sx={{ 
                bgcolor: '#003366',
                '&:hover': { bgcolor: '#002244' }
              }}
              aria-label="Save changes"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogActions>
        </Dialog>
      </main>
    </Container>
  );
};

export default WeeklyStatusList;
