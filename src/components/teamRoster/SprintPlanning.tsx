import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  Avatar,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
  Paper,
  Tooltip
} from '@mui/material';
import {
  Person,
  CalendarToday,
  Info,
  ExpandMore,
  ExpandLess
} from '@mui/icons-material';

interface TeamMember {
  _id: string;
  name: string;
  email: string;
  personalPhone?: string;
  role: string;
  branch: string;
  currentUtilization: number;
  availableCapacity: number;
  isActive: boolean;
  skills: Array<{
    skillName: string;
    proficiency: string;
    certified: boolean;
  }>;
  assignments?: Array<{
    priorityId?: string;
    priorityName: string;
    allocation: number;
    startDate: string;
    endDate: string;
    hoursAllocated: number;
  }>;
}

interface SprintInfo {
  number: number;
  startDate: Date;
  endDate: Date;
}

interface SprintPlanningProps {
  teamMembers: TeamMember[];
  filteredMembers: TeamMember[];
  currentSprint: SprintInfo;
  nextSprint: SprintInfo;
  calculateSprintUtilization: (member: TeamMember, sprint: SprintInfo) => number;
  getUtilizationColor: (utilization: number) => string;
  handleCardClick: (member: TeamMember) => void;
  onOpenSprintInfo: () => void;
}

const SPRINT_DURATION_DAYS = 10;

const SprintPlanning: React.FC<SprintPlanningProps> = ({
  teamMembers,
  filteredMembers,
  currentSprint,
  nextSprint,
  calculateSprintUtilization,
  getUtilizationColor,
  handleCardClick,
  onOpenSprintInfo
}) => {
  const [sprintTimelineExpanded, setSprintTimelineExpanded] = useState(true);
  const [selectedSprintView, setSelectedSprintView] = useState<'current' | 'next' | 'both'>('both');

  const exportSprintReport = () => {
    const activeMembers = teamMembers.filter(m => m.isActive !== false);
    const currentUtil = Math.round(
      activeMembers.reduce((sum, m) => sum + calculateSprintUtilization(m, currentSprint), 0) /
      Math.max(1, activeMembers.length)
    );
    const nextUtil = Math.round(
      activeMembers.reduce((sum, m) => sum + calculateSprintUtilization(m, nextSprint), 0) /
      Math.max(1, activeMembers.length)
    );
    const report = `Sprint Capacity Report\n\nCurrent Sprint ${currentSprint.number}:\n- Dates: ${currentSprint.startDate.toLocaleDateString()} - ${currentSprint.endDate.toLocaleDateString()}\n- Avg Utilization: ${currentUtil}%\n- Available: ${activeMembers.filter(m => calculateSprintUtilization(m, currentSprint) < 80).length}\n- At Capacity: ${activeMembers.filter(m => calculateSprintUtilization(m, currentSprint) >= 80).length}\n\nNext Sprint ${nextSprint.number}:\n- Dates: ${nextSprint.startDate.toLocaleDateString()} - ${nextSprint.endDate.toLocaleDateString()}\n- Avg Planned: ${nextUtil}%\n- Available: ${activeMembers.filter(m => calculateSprintUtilization(m, nextSprint) < 80).length}\n- Planned Full: ${activeMembers.filter(m => calculateSprintUtilization(m, nextSprint) >= 80).length}\n\nTeam Members:\n${activeMembers.map(m => `- ${m.name}: Current ${calculateSprintUtilization(m, currentSprint)}%, Next ${calculateSprintUtilization(m, nextSprint)}%`).join('\n')}`;
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sprint-capacity-report-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Tooltip title="View Sprint Calendar">
          <IconButton 
            onClick={onOpenSprintInfo}
            sx={{ color: '#003366' }}
            aria-label="View sprint calendar and information"
          >
            <Info />
          </IconButton>
        </Tooltip>
        <Typography variant="h5" sx={{ color: '#003366', fontWeight: 'bold' }}>
          Sprint Planning & Capacity Management
        </Typography>
      </Box>

      {/* Sprint Timeline Banner */}
      <Paper 
        sx={{ 
          p: 2, 
          mb: 3, 
          backgroundColor: '#e3f2fd',
          border: '2px solid #1976d2',
          borderRadius: 2
        }}
      >
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            cursor: 'pointer'
          }}
          onClick={() => setSprintTimelineExpanded(!sprintTimelineExpanded)}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <CalendarToday sx={{ color: '#1976d2', fontSize: 28 }} />
            <Box>
              <Typography variant="h6" sx={{ color: '#003366', fontWeight: 'bold' }}>
                Sprint Timeline - 10 Day Cycles
              </Typography>
              <Typography variant="body2" sx={{ color: '#666' }}>
                Current: Sprint {currentSprint.number} ({currentSprint.startDate.toLocaleDateString()} - {currentSprint.endDate.toLocaleDateString()})
              </Typography>
            </Box>
          </Box>
          <IconButton size="small">
            {sprintTimelineExpanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Box>
        
        {sprintTimelineExpanded && (
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              {/* Current Sprint */}
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ backgroundColor: '#fff', border: '2px solid #1976d2' }}>
                  <CardContent>
                    <Typography variant="subtitle2" sx={{ color: '#1976d2', fontWeight: 'bold', mb: 1 }}>
                      ⭐ CURRENT SPRINT
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#003366', mb: 0.5 }}>
                      Sprint {currentSprint.number}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      {currentSprint.startDate.toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      {currentSprint.endDate.toLocaleDateString()}
                    </Typography>
                    <Chip 
                      label="10 Days" 
                      size="small" 
                      sx={{ mt: 1, backgroundColor: '#1976d2', color: 'white' }}
                    />
                  </CardContent>
                </Card>
              </Grid>
              
              {/* Next Sprint */}
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ backgroundColor: '#fff' }}>
                  <CardContent>
                    <Typography variant="subtitle2" sx={{ color: '#666', fontWeight: 'bold', mb: 1 }}>
                      NEXT SPRINT
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#003366', mb: 0.5 }}>
                      Sprint {nextSprint.number}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      {nextSprint.startDate.toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      {nextSprint.endDate.toLocaleDateString()}
                    </Typography>
                    <Chip 
                      label="10 Days" 
                      size="small" 
                      sx={{ mt: 1, backgroundColor: '#666', color: 'white' }}
                    />
                  </CardContent>
                </Card>
              </Grid>
              
              {/* Sprint +2 */}
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ backgroundColor: '#f5f5f5' }}>
                  <CardContent>
                    <Typography variant="subtitle2" sx={{ color: '#999', fontWeight: 'bold', mb: 1 }}>
                      SPRINT +2
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#666', mb: 0.5 }}>
                      Sprint {nextSprint.number + 1}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#999' }}>
                      {new Date(nextSprint.endDate.getTime() + 86400000).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#999' }}>
                      {new Date(nextSprint.endDate.getTime() + 86400000 * 10).toLocaleDateString()}
                    </Typography>
                    <Chip 
                      label="10 Days" 
                      size="small" 
                      sx={{ mt: 1, backgroundColor: '#999', color: 'white' }}
                    />
                  </CardContent>
                </Card>
              </Grid>
              
              {/* Sprint +3 */}
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ backgroundColor: '#f5f5f5' }}>
                  <CardContent>
                    <Typography variant="subtitle2" sx={{ color: '#999', fontWeight: 'bold', mb: 1 }}>
                      SPRINT +3
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#666', mb: 0.5 }}>
                      Sprint {nextSprint.number + 2}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#999' }}>
                      {new Date(nextSprint.endDate.getTime() + 86400000 * 11).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#999' }}>
                      {new Date(nextSprint.endDate.getTime() + 86400000 * 20).toLocaleDateString()}
                    </Typography>
                    <Chip 
                      label="10 Days" 
                      size="small" 
                      sx={{ mt: 1, backgroundColor: '#999', color: 'white' }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button 
                size="small" 
                startIcon={<Info />}
                onClick={onOpenSprintInfo}
                sx={{ color: '#1976d2' }}
              >
                View Full Sprint Calendar
              </Button>
            </Box>
          </Box>
        )}
      </Paper>

      {/* Sprint Capacity Summary */}
      <Paper sx={{ p: 2, mb: 3, backgroundColor: '#f5f5f5', border: '1px solid #e0e0e0' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ color: '#003366' }}>
            Sprint Capacity Overview
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>View</InputLabel>
              <Select
                value={selectedSprintView}
                onChange={(e) => setSelectedSprintView(e.target.value as 'current' | 'next' | 'both')}
                label="View"
              >
                <MenuItem value="current">Current Sprint Only</MenuItem>
                <MenuItem value="next">Next Sprint Only</MenuItem>
                <MenuItem value="both">Both Sprints</MenuItem>
              </Select>
            </FormControl>
            <Button
              size="small"
              variant="outlined"
              startIcon={<CalendarToday />}
              onClick={exportSprintReport}
              sx={{ color: '#003366', borderColor: '#003366' }}
            >
              Export Report
            </Button>
          </Box>
        </Box>
        
        <Grid container spacing={2}>
          {/* Current Sprint Summary */}
          {(selectedSprintView === 'current' || selectedSprintView === 'both') && (
          <Grid item xs={12} md={selectedSprintView === 'both' ? 6 : 12}>
            <Card sx={{ border: '2px solid #1976d2', backgroundColor: '#e3f2fd' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                    Current Sprint {currentSprint.number}
                  </Typography>
                  <Chip 
                    label="ACTIVE" 
                    size="small" 
                    sx={{ backgroundColor: '#1976d2', color: 'white' }}
                  />
                </Box>
                <Typography variant="caption" display="block" sx={{ mb: 2, color: '#666' }}>
                  {currentSprint.startDate.toLocaleDateString()} - {currentSprint.endDate.toLocaleDateString()}
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Typography variant="caption" sx={{ color: '#666' }}>Avg Utilization</Typography>
                    <Typography variant="h5" sx={{ color: '#003366' }}>
                      {Math.round(
                        teamMembers
                          .filter(m => m.isActive !== false)
                          .reduce((sum, m) => sum + calculateSprintUtilization(m, currentSprint), 0) /
                        Math.max(1, teamMembers.filter(m => m.isActive !== false).length)
                      )}%
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="caption" sx={{ color: '#666' }}>Available</Typography>
                    <Typography variant="h5" sx={{ color: '#4caf50' }}>
                      {teamMembers.filter(m => m.isActive !== false && calculateSprintUtilization(m, currentSprint) < 80).length}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="caption" sx={{ color: '#666' }}>At Capacity</Typography>
                    <Typography variant="h5" sx={{ color: '#ff9800' }}>
                      {teamMembers.filter(m => m.isActive !== false && calculateSprintUtilization(m, currentSprint) >= 80).length}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          )}

          {/* Next Sprint Summary */}
          {(selectedSprintView === 'next' || selectedSprintView === 'both') && (
          <Grid item xs={12} md={selectedSprintView === 'both' ? 6 : 12}>
            <Card sx={{ border: '1px solid #666' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#666' }}>
                    Next Sprint {nextSprint.number}
                  </Typography>
                  <Chip 
                    label="UPCOMING" 
                    size="small" 
                    sx={{ backgroundColor: '#666', color: 'white' }}
                  />
                </Box>
                <Typography variant="caption" display="block" sx={{ mb: 2, color: '#888' }}>
                  {nextSprint.startDate.toLocaleDateString()} - {nextSprint.endDate.toLocaleDateString()}
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Typography variant="caption" sx={{ color: '#666' }}>Avg Planned</Typography>
                    <Typography variant="h5" sx={{ color: '#003366' }}>
                      {Math.round(
                        teamMembers
                          .filter(m => m.isActive !== false)
                          .reduce((sum, m) => sum + calculateSprintUtilization(m, nextSprint), 0) /
                        Math.max(1, teamMembers.filter(m => m.isActive !== false).length)
                      )}%
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="caption" sx={{ color: '#666' }}>Available</Typography>
                    <Typography variant="h5" sx={{ color: '#4caf50' }}>
                      {teamMembers.filter(m => m.isActive !== false && calculateSprintUtilization(m, nextSprint) < 80).length}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="caption" sx={{ color: '#666' }}>Planned Full</Typography>
                    <Typography variant="h5" sx={{ color: '#ff9800' }}>
                      {teamMembers.filter(m => m.isActive !== false && calculateSprintUtilization(m, nextSprint) >= 80).length}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          )}
        </Grid>

        {/* Sprint Capacity Trend */}
        {selectedSprintView === 'both' && (
          <Box sx={{ mt: 3, p: 2, backgroundColor: 'white', borderRadius: 1, border: '1px solid #e0e0e0' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#003366', mb: 2 }}>
              Capacity Trend Analysis
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#e3f2fd', borderRadius: 1 }}>
                  <Typography variant="caption" sx={{ color: '#666' }}>Capacity Change</Typography>
                  <Typography variant="h4" sx={{ color: Math.round(
                    teamMembers.filter(m => m.isActive !== false).reduce((sum, m) => sum + calculateSprintUtilization(m, nextSprint), 0) /
                    Math.max(1, teamMembers.filter(m => m.isActive !== false).length)
                  ) - Math.round(
                    teamMembers.filter(m => m.isActive !== false).reduce((sum, m) => sum + calculateSprintUtilization(m, currentSprint), 0) /
                    Math.max(1, teamMembers.filter(m => m.isActive !== false).length)
                  ) < 0 ? '#4caf50' : '#ff9800' }}>
                    {Math.round(
                      teamMembers.filter(m => m.isActive !== false).reduce((sum, m) => sum + calculateSprintUtilization(m, nextSprint), 0) /
                      Math.max(1, teamMembers.filter(m => m.isActive !== false).length)
                    ) - Math.round(
                      teamMembers.filter(m => m.isActive !== false).reduce((sum, m) => sum + calculateSprintUtilization(m, currentSprint), 0) /
                      Math.max(1, teamMembers.filter(m => m.isActive !== false).length)
                    )}%
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#666' }}>Current → Next</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#f1f8e9', borderRadius: 1 }}>
                  <Typography variant="caption" sx={{ color: '#666' }}>Availability Trend</Typography>
                  <Typography variant="h4" sx={{ color: '#4caf50' }}>
                    {teamMembers.filter(m => m.isActive !== false && calculateSprintUtilization(m, nextSprint) < 80).length -
                     teamMembers.filter(m => m.isActive !== false && calculateSprintUtilization(m, currentSprint) < 80).length > 0 ? '+' : ''}
                    {teamMembers.filter(m => m.isActive !== false && calculateSprintUtilization(m, nextSprint) < 80).length -
                     teamMembers.filter(m => m.isActive !== false && calculateSprintUtilization(m, currentSprint) < 80).length}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#666' }}>More Available</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#fff3e0', borderRadius: 1 }}>
                  <Typography variant="caption" sx={{ color: '#666' }}>Planning Status</Typography>
                  <Typography variant="h4" sx={{ color: '#003366' }}>
                    {Math.round(
                      teamMembers.filter(m => m.isActive !== false).reduce((sum, m) => sum + calculateSprintUtilization(m, nextSprint), 0) /
                      Math.max(1, teamMembers.filter(m => m.isActive !== false).length)
                    ) < 60 ? '✅' : Math.round(
                      teamMembers.filter(m => m.isActive !== false).reduce((sum, m) => sum + calculateSprintUtilization(m, nextSprint), 0) /
                      Math.max(1, teamMembers.filter(m => m.isActive !== false).length)
                    ) < 85 ? '⚠️' : '🔴'}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#666' }}>
                    {Math.round(
                      teamMembers.filter(m => m.isActive !== false).reduce((sum, m) => sum + calculateSprintUtilization(m, nextSprint), 0) /
                      Math.max(1, teamMembers.filter(m => m.isActive !== false).length)
                    ) < 60 ? 'Good Capacity' : Math.round(
                      teamMembers.filter(m => m.isActive !== false).reduce((sum, m) => sum + calculateSprintUtilization(m, nextSprint), 0) /
                      Math.max(1, teamMembers.filter(m => m.isActive !== false).length)
                    ) < 85 ? 'Near Capacity' : 'Overallocated'}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>

      {/* Sprint-Based Team View */}
      <Typography variant="h6" sx={{ color: '#003366', mb: 2 }}>
        Team Sprint Utilization
      </Typography>
      <Grid container spacing={2}>
        {filteredMembers.map((member) => (
          <Grid item xs={12} md={6} lg={4} key={member._id}>
            <Card 
              sx={{ 
                height: '100%',
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 3
                }
              }}
              onClick={() => handleCardClick(member)}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: '#003366', mr: 2 }}>
                    <Person />
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" noWrap>{member.name}</Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {member.role}
                    </Typography>
                  </Box>
                </Box>

                {/* Current Sprint */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" gutterBottom sx={{ fontWeight: 'bold', color: '#003366' }}>
                    Current Sprint (Sprint {currentSprint.number})
                  </Typography>
                  <Typography variant="caption" display="block" sx={{ mb: 1, color: '#666' }}>
                    {currentSprint.startDate.toLocaleDateString()} - {currentSprint.endDate.toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    Utilization: {calculateSprintUtilization(member, currentSprint)}%
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(calculateSprintUtilization(member, currentSprint), 100)}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: getUtilizationColor(calculateSprintUtilization(member, currentSprint))
                      }
                    }}
                  />
                </Box>

                {/* Next Sprint */}
                <Box sx={{ p: 1.5, backgroundColor: '#f5f5f5', borderRadius: 1, border: '1px solid #e0e0e0' }}>
                  <Typography variant="body2" gutterBottom sx={{ fontWeight: 'bold', color: '#666' }}>
                    Next Sprint (Sprint {nextSprint.number})
                  </Typography>
                  <Typography variant="caption" display="block" sx={{ mb: 1, color: '#888' }}>
                    {nextSprint.startDate.toLocaleDateString()} - {nextSprint.endDate.toLocaleDateString()}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      Planned: {calculateSprintUtilization(member, nextSprint)}%
                    </Typography>
                    <Chip 
                      label={`${100 - calculateSprintUtilization(member, nextSprint)}% Available`}
                      size="small"
                      sx={{ 
                        backgroundColor: calculateSprintUtilization(member, nextSprint) < 80 ? '#4caf50' : '#ff9800',
                        color: 'white',
                        fontSize: '0.7rem',
                        height: '20px'
                      }}
                    />
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(calculateSprintUtilization(member, nextSprint), 100)}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      mt: 1,
                      backgroundColor: '#e0e0e0',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: getUtilizationColor(calculateSprintUtilization(member, nextSprint))
                      }
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default SprintPlanning;
