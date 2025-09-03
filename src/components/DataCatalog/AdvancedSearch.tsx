/**
 * AdvancedSearch Component
 * 
 * Provides advanced search capabilities with auto-complete, suggestions, and faceted search.
 * Fully compliant with Section 508 requirements and WCAG 2.0 guidelines.
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  TextField,
  Autocomplete,
  Chip,
  Paper,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Collapse,
  IconButton,
  Divider,
  Badge,
  Tooltip,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  FilterList as FilterIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  History as HistoryIcon,
  TrendingUp as TrendingIcon,
  Bookmark as BookmarkIcon,
  Save as SaveIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { DataAsset } from '../../types/DataAsset';

interface SearchSuggestion {
  type: 'recent' | 'popular' | 'saved' | 'asset' | 'tag' | 'owner';
  value: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

interface SavedSearch {
  id: string;
  name: string;
  query: string;
  filters: Record<string, any>;
  createdAt: Date;
}

interface AdvancedSearchProps {
  onSearch: (query: string, filters: Record<string, any>) => void;
  searchHistory: string[];
  availableFilters: {
    types: string[];
    domains: string[];
    owners: string[];
    tags: string[];
    statuses: string[];
    certifications: string[];
  };
  totalResults?: number;
  isLoading?: boolean;
}

export const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  onSearch,
  searchHistory = [],
  availableFilters,
  totalResults = 0,
  isLoading = false
}) => {
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Filter state
  const [filters, setFilters] = useState<Record<string, any>>({
    types: [],
    domains: [],
    owners: [],
    tags: [],
    statuses: [],
    certifications: [],
    dateRange: '',
    qualityScore: ''
  });
  
  // UI state
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [saveSearchDialogOpen, setSaveSearchDialogOpen] = useState(false);
  const [searchName, setSearchName] = useState('');

  // Load saved searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('savedSearches');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSavedSearches(parsed.map((s: any) => ({
          ...s,
          createdAt: new Date(s.createdAt)
        })));
      } catch (e) {
        console.error('Error loading saved searches:', e);
      }
    }
  }, []);

  // Generate search suggestions
  const generateSuggestions = useCallback((query: string): SearchSuggestion[] => {
    const suggestions: SearchSuggestion[] = [];
    
    if (!query.trim()) {
      // Show recent searches when no query
      searchHistory.slice(-5).forEach(recent => {
        suggestions.push({
          type: 'recent',
          value: recent,
          label: recent,
          icon: <HistoryIcon fontSize="small" />
        });
      });
      
      // Show saved searches
      savedSearches.slice(0, 3).forEach(saved => {
        suggestions.push({
          type: 'saved',
          value: saved.query,
          label: `${saved.name}: ${saved.query}`,
          icon: <BookmarkIcon fontSize="small" />
        });
      });
      
      return suggestions;
    }

    const lowerQuery = query.toLowerCase();
    
    // Asset type suggestions
    availableFilters.types
      .filter(type => type.toLowerCase().includes(lowerQuery))
      .slice(0, 3)
      .forEach(type => {
        suggestions.push({
          type: 'asset',
          value: `type:"${type}"`,
          label: `Asset Type: ${type}`,
          icon: <span>📋</span>
        });
      });

    // Domain suggestions
    availableFilters.domains
      .filter(domain => domain.toLowerCase().includes(lowerQuery))
      .slice(0, 3)
      .forEach(domain => {
        suggestions.push({
          type: 'asset',
          value: `domain:"${domain}"`,
          label: `Domain: ${domain}`,
          icon: <span>🏢</span>
        });
      });

    // Owner suggestions
    availableFilters.owners
      .filter(owner => owner.toLowerCase().includes(lowerQuery))
      .slice(0, 3)
      .forEach(owner => {
        suggestions.push({
          type: 'owner',
          value: `owner:"${owner}"`,
          label: `Owner: ${owner}`,
          icon: <span>👤</span>
        });
      });

    // Tag suggestions
    availableFilters.tags
      .filter(tag => tag.toLowerCase().includes(lowerQuery))
      .slice(0, 3)
      .forEach(tag => {
        suggestions.push({
          type: 'tag',
          value: `tag:"${tag}"`,
          label: `Tag: ${tag}`,
          icon: <span>🏷️</span>
        });
      });

    return suggestions.slice(0, 8); // Limit to 8 suggestions
  }, [searchHistory, savedSearches, availableFilters]);

  // Update suggestions when query changes
  useEffect(() => {
    const newSuggestions = generateSuggestions(searchQuery);
    setSuggestions(newSuggestions);
  }, [searchQuery, generateSuggestions]);

  // Handle search execution
  const handleSearch = useCallback(() => {
    onSearch(searchQuery, filters);
    setShowSuggestions(false);
  }, [searchQuery, filters, onSearch]);

  // Handle filter changes
  const handleFilterChange = useCallback((filterKey: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: value
    }));
  }, []);

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setFilters({
      types: [],
      domains: [],
      owners: [],
      tags: [],
      statuses: [],
      certifications: [],
      dateRange: '',
      qualityScore: ''
    });
  }, []);

  // Save current search
  const handleSaveSearch = useCallback(() => {
    if (!searchName.trim()) return;
    
    const newSearch: SavedSearch = {
      id: Date.now().toString(),
      name: searchName.trim(),
      query: searchQuery,
      filters: { ...filters },
      createdAt: new Date()
    };
    
    const updatedSavedSearches = [...savedSearches, newSearch];
    setSavedSearches(updatedSavedSearches);
    localStorage.setItem('savedSearches', JSON.stringify(updatedSavedSearches));
    
    setSearchName('');
    setSaveSearchDialogOpen(false);
  }, [searchName, searchQuery, filters, savedSearches]);

  // Load saved search
  const handleLoadSavedSearch = useCallback((savedSearch: SavedSearch) => {
    setSearchQuery(savedSearch.query);
    setFilters(savedSearch.filters);
    setShowSuggestions(false);
    onSearch(savedSearch.query, savedSearch.filters);
  }, [onSearch]);

  // Delete saved search
  const handleDeleteSavedSearch = useCallback((searchId: string) => {
    const updatedSavedSearches = savedSearches.filter(s => s.id !== searchId);
    setSavedSearches(updatedSavedSearches);
    localStorage.setItem('savedSearches', JSON.stringify(updatedSavedSearches));
  }, [savedSearches]);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    return Object.values(filters).reduce((count, value) => {
      if (Array.isArray(value)) {
        return count + value.length;
      }
      return count + (value ? 1 : 0);
    }, 0);
  }, [filters]);

  return (
    <Paper 
      elevation={2} 
      sx={{ p: 3, mb: 3, border: '1px solid #e0e0e0' }}
      role="search"
      aria-label="Advanced search interface"
    >
      {/* Main Search Bar */}
      <Box sx={{ position: 'relative', mb: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search assets... Try 'type:Table domain:Finance' or 'certified production data'"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                {searchQuery && (
                  <IconButton 
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search"
                    size="small"
                  >
                    <ClearIcon />
                  </IconButton>
                )}
                <Button
                  variant="contained"
                  onClick={handleSearch}
                  disabled={isLoading}
                  sx={{ ml: 1, minWidth: 'auto' }}
                  aria-label="Execute search"
                >
                  {isLoading ? 'Searching...' : 'Search'}
                </Button>
              </InputAdornment>
            )
          }}
          aria-label="Search query input"
          aria-describedby="search-help"
        />
        
        {/* Search Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <Paper
            sx={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              zIndex: 1000,
              maxHeight: 300,
              overflow: 'auto',
              mt: 1,
              border: '1px solid #e0e0e0'
            }}
            elevation={4}
          >
            <List dense>
              {suggestions.map((suggestion, index) => (
                <ListItem
                  key={`${suggestion.type}-${index}`}
                  component="button"
                  onClick={() => {
                    setSearchQuery(suggestion.value);
                    setShowSuggestions(false);
                  }}
                  sx={{
                    '&:hover': { bgcolor: '#f5f5f5' },
                    borderBottom: index < suggestions.length - 1 ? '1px solid #f0f0f0' : 'none',
                    cursor: 'pointer',
                    border: 'none',
                    width: '100%',
                    textAlign: 'left',
                    padding: '8px 16px'
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    {suggestion.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={suggestion.label}
                    secondary={suggestion.type === 'recent' ? 'Recent search' : 
                             suggestion.type === 'saved' ? 'Saved search' : 
                             suggestion.type === 'popular' ? 'Popular search' : ''}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        )}
      </Box>

      {/* Search Help Text */}
      <Typography 
        variant="caption" 
        color="text.secondary" 
        id="search-help"
        sx={{ display: 'block', mb: 2 }}
      >
        💡 Use quotes for exact matches, operators like type:, domain:, owner:, or tag: for precise filtering
      </Typography>

      {/* Filter Toggle and Quick Actions */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Button
          variant="outlined"
          startIcon={filtersExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          endIcon={activeFilterCount > 0 && (
            <Badge badgeContent={activeFilterCount} color="primary" />
          )}
          onClick={() => setFiltersExpanded(!filtersExpanded)}
          aria-expanded={filtersExpanded}
          aria-controls="advanced-filters"
        >
          Advanced Filters
        </Button>
        
        {activeFilterCount > 0 && (
          <Button
            variant="text"
            startIcon={<ClearIcon />}
            onClick={clearAllFilters}
            size="small"
          >
            Clear All
          </Button>
        )}
        
        <Button
          variant="text"
          startIcon={<SaveIcon />}
          onClick={() => setSaveSearchDialogOpen(true)}
          size="small"
          disabled={!searchQuery && activeFilterCount === 0}
        >
          Save Search
        </Button>
        
        {totalResults > 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
            {totalResults.toLocaleString()} results found
          </Typography>
        )}
      </Box>

      {/* Advanced Filters */}
      <Collapse in={filtersExpanded} timeout="auto">
        <Box id="advanced-filters" sx={{ pt: 2, borderTop: '1px solid #e0e0e0' }}>
          <Grid container spacing={3}>
            {/* Asset Types */}
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Asset Types</InputLabel>
                <Select
                  multiple
                  value={filters.types}
                  onChange={(e) => handleFilterChange('types', e.target.value)}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {(selected as string[]).map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {availableFilters.types.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Domains */}
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Domains</InputLabel>
                <Select
                  multiple
                  value={filters.domains}
                  onChange={(e) => handleFilterChange('domains', e.target.value)}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {(selected as string[]).map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {availableFilters.domains.map((domain) => (
                    <MenuItem key={domain} value={domain}>
                      {domain}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Status */}
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  multiple
                  value={filters.statuses}
                  onChange={(e) => handleFilterChange('statuses', e.target.value)}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {(selected as string[]).map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {availableFilters.statuses.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Certification */}
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Certification</InputLabel>
                <Select
                  multiple
                  value={filters.certifications}
                  onChange={(e) => handleFilterChange('certifications', e.target.value)}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {(selected as string[]).map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {availableFilters.certifications.map((cert) => (
                    <MenuItem key={cert} value={cert}>
                      {cert}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Owners */}
            <Grid item xs={12} sm={6} md={4}>
              <Autocomplete
                multiple
                options={availableFilters.owners}
                value={filters.owners}
                onChange={(_, newValue) => handleFilterChange('owners', newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Owners"
                    size="small"
                    placeholder="Select owners..."
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      variant="outlined"
                      label={option}
                      size="small"
                      {...getTagProps({ index })}
                      key={option}
                    />
                  ))
                }
              />
            </Grid>

            {/* Tags */}
            <Grid item xs={12} sm={6} md={4}>
              <Autocomplete
                multiple
                options={availableFilters.tags}
                value={filters.tags}
                onChange={(_, newValue) => handleFilterChange('tags', newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Tags"
                    size="small"
                    placeholder="Select tags..."
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      variant="outlined"
                      label={option}
                      size="small"
                      {...getTagProps({ index })}
                      key={option}
                    />
                  ))
                }
              />
            </Grid>
          </Grid>
        </Box>
      </Collapse>

      {/* Saved Searches */}
      {savedSearches.length > 0 && (
        <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #e0e0e0' }}>
          <Typography variant="subtitle2" gutterBottom>
            Saved Searches
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {savedSearches.slice(0, 5).map((savedSearch) => (
              <Chip
                key={savedSearch.id}
                label={savedSearch.name}
                variant="outlined"
                clickable
                onClick={() => handleLoadSavedSearch(savedSearch)}
                onDelete={() => handleDeleteSavedSearch(savedSearch.id)}
                deleteIcon={<DeleteIcon />}
                sx={{ mb: 1 }}
              />
            ))}
          </Box>
        </Box>
      )}

      {/* Save Search Dialog */}
      {saveSearchDialogOpen && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1300
          }}
          onClick={() => setSaveSearchDialogOpen(false)}
        >
          <Paper
            sx={{ p: 3, minWidth: 300, m: 2 }}
            onClick={(e) => e.stopPropagation()}
          >
            <Typography variant="h6" gutterBottom>
              Save Search
            </Typography>
            <TextField
              fullWidth
              label="Search Name"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSaveSearch()}
              sx={{ mb: 2 }}
              autoFocus
            />
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <Button onClick={() => setSaveSearchDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleSaveSearch}
                disabled={!searchName.trim()}
              >
                Save
              </Button>
            </Box>
          </Paper>
        </Box>
      )}
    </Paper>
  );
};

export default AdvancedSearch;
