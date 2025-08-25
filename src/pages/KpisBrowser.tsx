import React, { useEffect, useMemo, useState, KeyboardEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  IconButton,
  ToggleButtonGroup,
  ToggleButton,
  Chip,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Divider
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewListIcon from '@mui/icons-material/ViewList';
import { kpiService, Kpi } from '../services/kpiService';

// helpers
const useDebounce = <T,>(value: T, delay = 400) => {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
};

const USCIS_BLUE = '#003366';
const CATEGORY_PALETTE = ['#003366', '#005A9C', '#2E7D32', '#0277BD', '#6A1B9A', '#B31B1B', '#6D4C41', '#455A64', '#0B6E4F', '#7B1FA2'];
const getCategoryColors = (category?: string) => {
  if (!category) return { bg: '#e0e0e0', fg: '#000' };
  const hash = Array.from(category).reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const bg = CATEGORY_PALETTE[hash % CATEGORY_PALETTE.length];
  const fg = '#fff';
  return { bg, fg };
};

const KpisBrowser: React.FC = () => {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();

  const initialQ = params.get('q') || '';
  const initialCategory = params.get('category') || '';
  const initialPage = parseInt(params.get('page') || '1', 10) || 1;
  const limit = 12;

  const [q, setQ] = useState(initialQ);
  const [category, setCategory] = useState(initialCategory);
  const [page, setPage] = useState(initialPage);
  const [view, setView] = useState<'grid' | 'list'>(
    (params.get('view') as 'grid' | 'list') || 'grid'
  );

  const [items, setItems] = useState<Kpi[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const derivedCategories = useMemo(() => {
    const set = new Set<string>();
    items.forEach((k) => {
      const c = (k.category || '').trim();
      if (c) set.add(c);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [items]);
  const effectiveCategories = categories.length > 0 ? categories : derivedCategories;

  const debouncedQ = useDebounce(q, 400);
  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / limit)), [total]);

  // Sync URL params
  useEffect(() => {
    const next = new URLSearchParams();
    if (debouncedQ) next.set('q', debouncedQ);
    if (category) next.set('category', category);
    if (page > 1) next.set('page', String(page));
    if (view !== 'grid') next.set('view', view);
    navigate({ search: next.toString() }, { replace: true });
  }, [debouncedQ, category, page, view, navigate]);

  // Fetch KPIs
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const params: Record<string, string | number | boolean> = {
          page,
          limit,
          sort: '-updatedAt',
        };
        if (debouncedQ) params.q = debouncedQ;
        if (category) params.category = category;
        const { items, total } = await kpiService.list(params);
        setItems(items || []);
        setTotal(total || 0);
      } catch (e) {
        console.error(e);
        setError('Failed to load KPIs.');
        setItems([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [debouncedQ, category, page]);

  // Fetch distinct categories once
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const cats = await kpiService.getCategories();
        if (mounted) setCategories(cats);
      } catch (e) {
        // Non-fatal; keep default empty list
        console.warn('Failed to load KPI categories');
      }
    })();
    return () => { mounted = false; };
  }, []);

  const handleActivate = (id?: string) => {
    if (!id) return;
    navigate(`/templates/kpi-dictionary/${id}`);
  };

  const handleKeyActivate = (e: KeyboardEvent, id?: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleActivate(id);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ color: USCIS_BLUE, fontWeight: 700 }} gutterBottom>
        KPI Catalog
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Browse KPIs. Use search and filters. Click any card to open the dictionary. Fully 508-compliant.
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center', mb: 2 }}>
        <TextField
          label="Search"
          placeholder="Search by name, definition, tags"
          value={q}
          onChange={(e) => {
            setPage(1);
            setQ(e.target.value);
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: q ? (
              <InputAdornment position="end">
                <IconButton aria-label="Clear search" onClick={() => setQ('')}>
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ) : undefined
          }}
          aria-label="Search KPIs"
          size="small"
          sx={{ minWidth: 280 }}
        />

        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel id="category-label">Category</InputLabel>
          <Select
            labelId="category-label"
            label="Category"
            value={category}
            onChange={(e) => {
              setPage(1);
              setCategory(e.target.value);
            }}
          >
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            {effectiveCategories.map((c) => (
              <MenuItem key={c} value={c}>{c}</MenuItem>
            ))}
            {/* Ensure currently-selected category remains visible even if not in list */}
            {category && !effectiveCategories.includes(category) && (
              <MenuItem key={category} value={category}>{category}</MenuItem>
            )}
          </Select>
        </FormControl>

        <ToggleButtonGroup
          size="small"
          value={view}
          exclusive
          onChange={(_, val) => val && setView(val)}
          aria-label="Toggle view"
        >
          <ToggleButton value="grid" aria-label="Grid view">
            <ViewModuleIcon />
          </ToggleButton>
          <ToggleButton value="list" aria-label="List view">
            <ViewListIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }} aria-live="polite">
          <CircularProgress aria-label="Loading KPIs" />
        </Box>
      )}
      {error && (
        <Alert severity="error" sx={{ my: 2 }} aria-live="assertive">{error}</Alert>
      )}

      {!loading && !error && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {total} total KPIs
          </Typography>
        </Box>
      )}

      {!loading && !error && items.length === 0 && (
        <Alert severity="info">No KPIs found.</Alert>
      )}

      {!loading && !error && items.length > 0 && (
        <>
          {view === 'grid' ? (
            <Grid container spacing={2}>
              {items.map((k) => (
                <Grid item xs={12} sm={6} md={4} key={k._id}>
                  <Card
                    role="button"
                    tabIndex={0}
                    aria-label={`Open KPI ${k.name}`}
                    onClick={() => handleActivate(k._id)}
                    onKeyDown={(e) => handleKeyActivate(e, k._id)}
                    sx={{
                      height: '100%',
                      cursor: 'pointer',
                      '&:focus-visible': {
                        outline: `3px solid ${USCIS_BLUE}`,
                        outlineOffset: 2
                      }
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6" sx={{ color: '#1785FB', fontWeight: 700 }}>
                        {k.name}
                      </Typography>
                      {k.category && (() => { const { bg, fg } = getCategoryColors(k.category); return (
                        <Chip size="small" label={k.category} sx={{ mt: 0.5, bgcolor: bg, color: fg }} />
                      ); })()}
                      {k.definition && (
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          {k.definition.length > 150 ? `${k.definition.slice(0, 150)}…` : k.definition}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box>
              {items.map((k, idx) => (
                <Box
                  key={k._id}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleActivate(k._id)}
                  onKeyDown={(e) => handleKeyActivate(e, k._id)}
                  aria-label={`Open KPI ${k.name}`}
                  sx={{
                    p: 2,
                    borderLeft: `4px solid ${USCIS_BLUE}`,
                    '&:hover': { backgroundColor: 'rgba(0,0,0,0.03)' },
                    '&:focus-visible': {
                      outline: `3px solid ${USCIS_BLUE}`,
                      outlineOffset: 2
                    }
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1785FB' }}>
                    {k.name}
                  </Typography>
                  <Typography variant="body2" sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
                    {k.category ? (
                      (() => { const { bg, fg } = getCategoryColors(k.category); return (
                        <Chip size="small" label={k.category} sx={{ bgcolor: bg, color: fg }} />
                      ); })()
                    ) : 'Uncategorized'}
                  </Typography>
                  {k.definition && (
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      {k.definition.length > 220 ? `${k.definition.slice(0, 220)}…` : k.definition}
                    </Typography>
                  )}
                </Box>
              ))}
              <Divider sx={{ my: 1 }} />
            </Box>
          )}

          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, p) => setPage(p)}
                color="primary"
                showFirstButton
                showLastButton
                aria-label="KPI pagination"
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default KpisBrowser;
