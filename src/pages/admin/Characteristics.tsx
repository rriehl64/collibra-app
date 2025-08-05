import React, { useState, useEffect, useCallback } from 'react';
import { 
  Container, 
  Typography, 
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid
} from '@mui/material';
import { 
  Search as SearchIcon, 
  Clear as ClearIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

// Characteristic type definition
interface Characteristic {
  id: string;
  name: string;
  category: string;
  description: string;
  dataType: 'string' | 'number' | 'boolean' | 'date' | 'enum';
  mandatory: boolean;
  defaultValue?: string;
  options?: string[];
  usageCount: number;
}

// Simple debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

const Characteristics: React.FC = () => {
  // State
  const [characteristics, setCharacteristics] = useState<Characteristic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentCharacteristic, setCurrentCharacteristic] = useState<Characteristic | null>(null);
  
  // Auth context
  const { user } = useAuth();
  
  // Debounced search
  const debouncedSearchText = useDebounce(searchText, 500);
  
  // Sample data
  const sampleCharacteristics: Characteristic[] = [
    {
      id: 'ch-001',
      name: 'Data Owner',
      category: 'Ownership',
      description: 'The person or group responsible for the data asset',
      dataType: 'string',
      mandatory: true,
      usageCount: 87
    },
    {
      id: 'ch-002',
      name: 'Sensitivity Level',
      category: 'Security',
      description: 'Data classification level indicating sensitivity',
      dataType: 'enum',
      mandatory: true,
      options: ['Public', 'Internal', 'Confidential', 'Restricted'],
      defaultValue: 'Internal',
      usageCount: 92
    },
    {
      id: 'ch-003',
      name: 'Retention Period',
      category: 'Compliance',
      description: 'How long the data should be retained',
      dataType: 'string',
      mandatory: false,
      usageCount: 45
    },
    {
      id: 'ch-004',
      name: 'Last Review Date',
      category: 'Governance',
      description: 'When the asset was last reviewed',
      dataType: 'date',
      mandatory: false,
      usageCount: 38
    },
    {
      id: 'ch-005',
      name: 'Data Quality Score',
      category: 'Quality',
      description: 'Numeric score indicating data quality',
      dataType: 'number',
      mandatory: false,
      usageCount: 72
    },
    {
      id: 'ch-006',
      name: 'Source System',
      category: 'Technical',
      description: 'The system where the data originates',
      dataType: 'string',
      mandatory: true,
      usageCount: 91
    },
    {
      id: 'ch-007',
      name: 'Is PII',
      category: 'Security',
      description: 'Whether the data contains personally identifiable information',
      dataType: 'boolean',
      mandatory: true,
      defaultValue: 'false',
      usageCount: 83
    },
    {
      id: 'ch-008',
      name: 'Data Steward',
      category: 'Ownership',
      description: 'Person responsible for data quality and standards',
      dataType: 'string',
      mandatory: false,
      usageCount: 56
    }
  ];
  
  // Load characteristics
  const fetchCharacteristics = useCallback(() => {
    setLoading(true);
    setError(null);
    
    try {
      // Filter based on search and category
      let filtered = [...sampleCharacteristics];
      
      if (debouncedSearchText) {
        const searchLower = debouncedSearchText.toLowerCase();
        filtered = filtered.filter(char => 
          char.name.toLowerCase().includes(searchLower) ||
          char.description.toLowerCase().includes(searchLower) ||
          char.category.toLowerCase().includes(searchLower)
        );
      }
      
      if (categoryFilter !== 'all') {
        filtered = filtered.filter(char => char.category === categoryFilter);
      }
      
      setCharacteristics(filtered);
    } catch (err) {
      console.error("Error fetching characteristics:", err);
      setError("Failed to load characteristics. Please try again later.");
      setCharacteristics([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchText, categoryFilter]);
  
  // Fetch on mount and when filters change
  useEffect(() => {
    fetchCharacteristics();
  }, [fetchCharacteristics]);
  
  // Get all unique categories
  const categories = Array.from(
    new Set(sampleCharacteristics.map(char => char.category))
  );
  
  // Handle edit characteristic
  const handleEdit = (char: Characteristic) => {
    setCurrentCharacteristic(char);
    setDialogOpen(true);
  };
  
  // Get chip color for data type
  const getDataTypeColor = (type: string) => {
    switch (type) {
      case 'string':
        return { bg: '#E3F2FD', color: '#1976D2' };  // Blue
      case 'number':
        return { bg: '#E8F5E9', color: '#2E7D32' };  // Green
      case 'boolean':
        return { bg: '#F3E5F5', color: '#7B1FA2' };  // Purple
      case 'date':
        return { bg: '#FFF3E0', color: '#E65100' };  // Orange
      case 'enum':
        return { bg: '#E8EAF6', color: '#3F51B5' };  // Indigo
      default:
        return { bg: '#ECEFF1', color: '#546E7A' };  // Blue Grey
    }
  };
  
  return (
    <Container sx={{ py: 4 }} className="characteristics-page">
      <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#003366', fontWeight: 700 }} tabIndex={-1}>
        Data Characteristics Administration
      </Typography>
      <Typography variant="body1" paragraph>
        Manage data characteristics and attributes that can be applied to data assets.
      </Typography>
      
      {/* Controls */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            placeholder="Search characteristics..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchText ? (
                <InputAdornment position="end">
                  <IconButton 
                    aria-label="Clear search" 
                    onClick={() => setSearchText('')}
                    edge="end"
                    size="small"
                  >
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ) : null
            }}
            aria-label="Search characteristics"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel id="category-filter-label">Category</InputLabel>
            <Select
              labelId="category-filter-label"
              value={categoryFilter}
              label="Category"
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <MenuItem value="all">All Categories</MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={3} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => {
              setCurrentCharacteristic(null);
              setDialogOpen(true);
            }}
            aria-label="Add new characteristic"
          >
            Add Characteristic
          </Button>
        </Grid>
      </Grid>
      
      {/* Loading state */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }} aria-live="polite">
          <CircularProgress aria-label="Loading characteristics" />
        </Box>
      )}
      
      {/* Error state */}
      {error && (
        <Alert severity="error" sx={{ my: 2 }} aria-live="assertive">
          {error}
        </Alert>
      )}
      
      {/* Results count */}
      {!loading && !error && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {characteristics.length === 0
              ? 'No characteristics found matching your criteria.'
              : `Showing ${characteristics.length} characteristic${characteristics.length !== 1 ? 's' : ''}.`}
          </Typography>
        </Box>
      )}
      
      {/* Characteristics table */}
      {!loading && !error && characteristics.length > 0 && (
        <TableContainer component={Paper} sx={{ mb: 4 }}>
          <Table aria-label="Characteristics table">
            <TableHead sx={{ backgroundColor: '#F5F6F7' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', color: '#0C1F3F' }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#0C1F3F' }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#0C1F3F' }}>Data Type</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#0C1F3F' }}>Mandatory</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#0C1F3F' }}>Usage</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#0C1F3F' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {characteristics.map((char) => {
                const typeColors = getDataTypeColor(char.dataType);
                
                return (
                  <TableRow key={char.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight={500}>{char.name}</Typography>
                      <Typography variant="caption" color="text.secondary">{char.description}</Typography>
                    </TableCell>
                    <TableCell>{char.category}</TableCell>
                    <TableCell>
                      <Chip 
                        label={char.dataType} 
                        size="small" 
                        sx={{ backgroundColor: typeColors.bg, color: typeColors.color }}
                      />
                    </TableCell>
                    <TableCell>
                      {char.mandatory ? (
                        <Chip label="Required" size="small" color="primary" variant="outlined" />
                      ) : (
                        <Chip label="Optional" size="small" variant="outlined" />
                      )}
                    </TableCell>
                    <TableCell>{char.usageCount}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton 
                          size="small" 
                          color="primary" 
                          onClick={() => handleEdit(char)}
                          aria-label={`Edit ${char.name} characteristic`}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          color="error" 
                          disabled={char.usageCount > 0}
                          aria-label={`Delete ${char.name} characteristic`}
                          title={char.usageCount > 0 ? 
                            "Cannot delete a characteristic that is in use" : 
                            `Delete ${char.name} characteristic`}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      
      {/* Edit/Create Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)}
        aria-labelledby="characteristic-dialog-title"
        maxWidth="md"
        fullWidth
      >
        <DialogTitle id="characteristic-dialog-title">
          {currentCharacteristic ? 'Edit Characteristic' : 'Create New Characteristic'}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {currentCharacteristic ? 
              'Update the characteristic details below.' : 
              'Fill in the details to create a new characteristic.'}
          </Typography>
          <Typography variant="body2" color="primary" sx={{ mb: 2 }}>
            The full form implementation would be added here in a production environment.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => setDialogOpen(false)}
          >
            {currentCharacteristic ? 'Save Changes' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Characteristics;
