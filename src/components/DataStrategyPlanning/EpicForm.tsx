import React, { useState, useEffect } from 'react';
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box,
  Typography,
  Chip,
  IconButton,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { DataStrategyEpic } from '../../services/dataStrategyPlanningService';

interface EpicFormProps {
  epic?: DataStrategyEpic | null;
  mode: 'create' | 'edit' | 'view';
  onSave: (epic: Partial<DataStrategyEpic>) => void;
  onClose?: () => void;
}

const statusOptions = ['Planning', 'In Progress', 'Completed', 'On Hold', 'Cancelled'];
const priorityOptions = ['Low', 'Medium', 'High', 'Critical'];
const areaOptions = [
  'Data Management',
  'Data Engineering',
  'Data Science',
  'Business Intelligence',
  'Data Governance',
  'Analytics',
  'Infrastructure'
];

const EpicForm: React.FC<EpicFormProps> = ({ epic, mode, onSave, onClose }) => {
  const [formData, setFormData] = useState<Partial<DataStrategyEpic>>({
    title: '',
    description: '',
    businessValue: '',
    area: '',
    status: 'Planning',
    priority: 'Medium',
    targetQuarter: '',
    completionPercentage: 0,
    stories: []
  });

  const [newStoryTitle, setNewStoryTitle] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (epic && mode !== 'create') {
      setFormData(epic);
    } else {
      // Reset form for create mode
      setFormData({
        title: '',
        description: '',
        businessValue: '',
        area: '',
        status: 'Planning',
        priority: 'Medium',
        targetQuarter: '',
        completionPercentage: 0,
        stories: []
      });
    }
  }, [epic, mode]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const addStory = () => {
    if (newStoryTitle.trim()) {
      const newStory = {
        storyId: `story-${Date.now()}`,
        title: newStoryTitle.trim(),
        description: 'Story description to be added',
        businessValue: 'Business value to be defined',
        storyPoints: 1,
        priority: 'Medium' as const,
        status: 'Backlog' as const,
        assignee: '',
        estimatedHours: 0,
        actualHours: 0
      };
      
      setFormData(prev => ({
        ...prev,
        stories: [...(prev.stories || []), newStory]
      }));
      setNewStoryTitle('');
    }
  };

  const removeStory = (index: number) => {
    setFormData(prev => ({
      ...prev,
      stories: prev.stories?.filter((_, i) => i !== index) || []
    }));
  };

  const updateStory = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      stories: prev.stories?.map((story, i) => 
        i === index ? { ...story, [field]: value } : story
      ) || []
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title?.trim()) {
      newErrors.title = 'Epic title is required';
    }
    if (!formData.description?.trim()) {
      newErrors.description = 'Epic description is required';
    }
    if (!formData.businessValue?.trim()) {
      newErrors.businessValue = 'Business value is required';
    }
    if (!formData.area) {
      newErrors.area = 'Area is required';
    }
    if (!formData.targetQuarter?.trim()) {
      newErrors.targetQuarter = 'Target quarter is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(formData);
    }
  };

  const isReadOnly = mode === 'view';

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={3}>
        {/* Basic Information */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom color="#003366">
            Epic Information
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Epic Title"
            value={formData.title || ''}
            onChange={(e) => handleInputChange('title', e.target.value)}
            error={!!errors.title}
            helperText={errors.title}
            required
            disabled={isReadOnly}
            inputProps={{ 'aria-label': 'Epic title' }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Description"
            value={formData.description || ''}
            onChange={(e) => handleInputChange('description', e.target.value)}
            error={!!errors.description}
            helperText={errors.description}
            required
            disabled={isReadOnly}
            inputProps={{ 'aria-label': 'Epic description' }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={2}
            label="Business Value"
            value={formData.businessValue || ''}
            onChange={(e) => handleInputChange('businessValue', e.target.value)}
            error={!!errors.businessValue}
            helperText={errors.businessValue || 'Describe the business value this epic provides'}
            required
            disabled={isReadOnly}
            inputProps={{ 'aria-label': 'Epic business value' }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth required error={!!errors.area}>
            <InputLabel>Area</InputLabel>
            <Select
              value={formData.area || ''}
              onChange={(e) => handleInputChange('area', e.target.value)}
              disabled={isReadOnly}
              label="Area"
            >
              {areaOptions.map((area) => (
                <MenuItem key={area} value={area}>
                  {area}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Target Quarter"
            placeholder="e.g., Q1 2026"
            value={formData.targetQuarter || ''}
            onChange={(e) => handleInputChange('targetQuarter', e.target.value)}
            error={!!errors.targetQuarter}
            helperText={errors.targetQuarter}
            required
            disabled={isReadOnly}
            inputProps={{ 'aria-label': 'Target quarter' }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={formData.status || 'Planning'}
              onChange={(e) => handleInputChange('status', e.target.value)}
              disabled={isReadOnly}
              label="Status"
            >
              {statusOptions.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Priority</InputLabel>
            <Select
              value={formData.priority || 'Medium'}
              onChange={(e) => handleInputChange('priority', e.target.value)}
              disabled={isReadOnly}
              label="Priority"
            >
              {priorityOptions.map((priority) => (
                <MenuItem key={priority} value={priority}>
                  {priority}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            type="number"
            label="Completion Percentage"
            value={formData.completionPercentage || 0}
            onChange={(e) => handleInputChange('completionPercentage', parseInt(e.target.value) || 0)}
            disabled={isReadOnly}
            inputProps={{ min: 0, max: 100, 'aria-label': 'Completion percentage' }}
            helperText="Enter completion percentage (0-100)"
          />
        </Grid>

        {/* Stories Section */}
        <Grid item xs={12}>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" gutterBottom color="#003366">
            Stories
          </Typography>
        </Grid>

        {!isReadOnly && (
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <TextField
                fullWidth
                label="Add New Story"
                value={newStoryTitle}
                onChange={(e) => setNewStoryTitle(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    addStory();
                  }
                }}
                placeholder="Enter story title"
              />
              <Button
                variant="contained"
                onClick={addStory}
                disabled={!newStoryTitle.trim()}
                sx={{ 
                  backgroundColor: '#003366',
                  '&:hover': { backgroundColor: '#002244' }
                }}
              >
                <AddIcon />
              </Button>
            </Box>
          </Grid>
        )}

        <Grid item xs={12}>
          {formData.stories && formData.stories.length > 0 ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {formData.stories.map((story, index) => (
                <Box 
                  key={index}
                  sx={{ 
                    p: 2, 
                    border: '1px solid #e0e0e0', 
                    borderRadius: 1,
                    backgroundColor: '#f9f9f9'
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle2" color="#003366">
                      Story {index + 1}
                    </Typography>
                    {!isReadOnly && (
                      <IconButton 
                        size="small" 
                        onClick={() => removeStory(index)}
                        color="error"
                      >
                        <RemoveIcon />
                      </IconButton>
                    )}
                  </Box>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Story Title"
                        value={story.title}
                        onChange={(e) => updateStory(index, 'title', e.target.value)}
                        disabled={isReadOnly}
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        multiline
                        rows={2}
                        label="Description"
                        value={story.description || ''}
                        onChange={(e) => updateStory(index, 'description', e.target.value)}
                        disabled={isReadOnly}
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Business Value"
                        value={story.businessValue || ''}
                        onChange={(e) => updateStory(index, 'businessValue', e.target.value)}
                        disabled={isReadOnly}
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Story Points"
                        value={story.storyPoints || 1}
                        onChange={(e) => updateStory(index, 'storyPoints', parseInt(e.target.value) || 1)}
                        disabled={isReadOnly}
                        size="small"
                        inputProps={{ min: 1, max: 21 }}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Assignee"
                        value={story.assignee || ''}
                        onChange={(e) => updateStory(index, 'assignee', e.target.value)}
                        disabled={isReadOnly}
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Estimated Hours"
                        value={story.estimatedHours || 0}
                        onChange={(e) => updateStory(index, 'estimatedHours', parseInt(e.target.value) || 0)}
                        disabled={isReadOnly}
                        size="small"
                        inputProps={{ min: 0 }}
                      />
                    </Grid>
                  </Grid>
                </Box>
              ))}
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
              No stories added yet
            </Typography>
          )}
        </Grid>

        {/* Action Buttons */}
        {!isReadOnly && (
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
              {onClose && (
                <Button
                  variant="outlined"
                  startIcon={<CancelIcon />}
                  onClick={onClose}
                >
                  Cancel
                </Button>
              )}
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSave}
                sx={{ 
                  backgroundColor: '#003366',
                  '&:hover': { backgroundColor: '#002244' }
                }}
              >
                {mode === 'create' ? 'Create Epic' : 'Update Epic'}
              </Button>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default EpicForm;
