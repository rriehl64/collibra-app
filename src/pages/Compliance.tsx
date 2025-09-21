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
  LinearProgress,
  Button,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Assessment as AssessmentIcon,
  Policy as PolicyIcon,
  Security as SecurityIcon,
  Visibility as VisibilityIcon,
  GetApp as GetAppIcon
} from '@mui/icons-material';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend } from 'recharts';
import DashboardService from '../services/dashboardService';
import { dataAssetService } from '../services/api';

interface ComplianceMetrics {
  overallPercentage: number;
  totalAssets: number;
  compliantAssets: number;
  nonCompliantAssets: number;
  pendingReview: number;
  byDomain: Array<{
    domain: string;
    compliant: number;
    total: number;
    percentage: number;
  }>;
  byType: Array<{
    type: string;
    compliant: number;
    total: number;
    percentage: number;
  }>;
  trends: Array<{
    month: string;
    percentage: number;
  }>;
}

interface ComplianceAsset {
  id: string;
  name: string;
  domain: string;
  type: string;
  complianceStatus: 'Compliant' | 'Non-Compliant' | 'Pending Review' | 'Exempt';
  lastReviewed: string;
  reviewedBy: string;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  issues: string[];
}

const Compliance: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<ComplianceMetrics | null>(null);
  const [assets, setAssets] = useState<ComplianceAsset[]>([]);
  const [filteredAssets, setFilteredAssets] = useState<ComplianceAsset[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [domainFilter, setDomainFilter] = useState<string>('all');
  const [riskFilter, setRiskFilter] = useState<string>('all');

  useEffect(() => {
    fetchComplianceData();
  }, []);

  useEffect(() => {
    filterAssets();
  }, [assets, searchTerm, statusFilter, domainFilter, riskFilter]);

  const fetchComplianceData = async () => {
    try {
      setLoading(true);
      
      // Fetch dashboard metrics for compliance data
      const dashboardData = await DashboardService.getDashboardMetrics();
      
      // Fetch all data assets for detailed compliance view
      const assetsResponse = await dataAssetService.getDataAssets();
      
      // Transform data for compliance view
      const complianceAssets: ComplianceAsset[] = assetsResponse.assets.map((asset: any) => ({
        id: asset._id,
        name: asset.name,
        domain: asset.domain || 'Unassigned',
        type: asset.type || 'Unknown',
        complianceStatus: asset.complianceStatus || 'Pending Review',
        lastReviewed: asset.lastReviewed || 'Never',
        reviewedBy: asset.reviewedBy || 'N/A',
        riskLevel: asset.riskLevel || 'Medium',
        issues: asset.complianceIssues || []
      }));

      // Calculate detailed metrics
      const totalAssets = complianceAssets.length;
      const compliantAssets = complianceAssets.filter(a => a.complianceStatus === 'Compliant').length;
      const nonCompliantAssets = complianceAssets.filter(a => a.complianceStatus === 'Non-Compliant').length;
      const pendingReview = complianceAssets.filter(a => a.complianceStatus === 'Pending Review').length;

      // Group by domain
      const domainGroups = complianceAssets.reduce((acc, asset) => {
        if (!acc[asset.domain]) {
          acc[asset.domain] = { compliant: 0, total: 0 };
        }
        acc[asset.domain].total++;
        if (asset.complianceStatus === 'Compliant') {
          acc[asset.domain].compliant++;
        }
        return acc;
      }, {} as Record<string, { compliant: number; total: number }>);

      const byDomain = Object.entries(domainGroups).map(([domain, data]) => ({
        domain,
        compliant: data.compliant,
        total: data.total,
        percentage: Math.round((data.compliant / data.total) * 100)
      }));

      // Group by type
      const typeGroups = complianceAssets.reduce((acc, asset) => {
        if (!acc[asset.type]) {
          acc[asset.type] = { compliant: 0, total: 0 };
        }
        acc[asset.type].total++;
        if (asset.complianceStatus === 'Compliant') {
          acc[asset.type].compliant++;
        }
        return acc;
      }, {} as Record<string, { compliant: number; total: number }>);

      const byType = Object.entries(typeGroups).map(([type, data]) => ({
        type,
        compliant: data.compliant,
        total: data.total,
        percentage: Math.round((data.compliant / data.total) * 100)
      }));

      // Mock trend data (would come from historical data in production)
      const trends = [
        { month: 'Jan', percentage: 15 },
        { month: 'Feb', percentage: 18 },
        { month: 'Mar', percentage: 22 },
        { month: 'Apr', percentage: 25 },
        { month: 'May', percentage: 28 },
        { month: 'Jun', percentage: dashboardData.compliance.percentage }
      ];

      const complianceMetrics: ComplianceMetrics = {
        overallPercentage: dashboardData.compliance.percentage,
        totalAssets,
        compliantAssets,
        nonCompliantAssets,
        pendingReview,
        byDomain,
        byType,
        trends
      };

      setMetrics(complianceMetrics);
      setAssets(complianceAssets);
    } catch (error) {
      console.error('Error fetching compliance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAssets = () => {
    let filtered = assets;

    if (searchTerm) {
      filtered = filtered.filter(asset =>
        asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.domain.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(asset => asset.complianceStatus === statusFilter);
    }

    if (domainFilter !== 'all') {
      filtered = filtered.filter(asset => asset.domain === domainFilter);
    }

    if (riskFilter !== 'all') {
      filtered = filtered.filter(asset => asset.riskLevel === riskFilter);
    }

    setFilteredAssets(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Compliant': return 'success';
      case 'Non-Compliant': return 'error';
      case 'Pending Review': return 'warning';
      case 'Exempt': return 'info';
      default: return 'default';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Critical': return '#d32f2f';
      case 'High': return '#f57c00';
      case 'Medium': return '#fbc02d';
      case 'Low': return '#388e3c';
      default: return '#757575';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Compliant': return <CheckCircleIcon color="success" />;
      case 'Non-Compliant': return <ErrorIcon color="error" />;
      case 'Pending Review': return <WarningIcon color="warning" />;
      default: return <VisibilityIcon color="action" />;
    }
  };

  const pieChartData = metrics ? [
    { name: 'Compliant', value: metrics.compliantAssets, color: '#4caf50' },
    { name: 'Non-Compliant', value: metrics.nonCompliantAssets, color: '#f44336' },
    { name: 'Pending Review', value: metrics.pendingReview, color: '#ff9800' }
  ] : [];

  const uniqueDomains = Array.from(new Set(assets.map(a => a.domain)));
  const uniqueRiskLevels = ['Low', 'Medium', 'High', 'Critical'];

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
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#003366' }}>
          <SecurityIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
          E-Unify Data Compliance Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Monitor and manage data asset compliance across your organization
        </Typography>
      </Box>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ backgroundColor: '#E3F2FD', height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Overall Compliance
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                {metrics?.overallPercentage || 0}%
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={metrics?.overallPercentage || 0} 
                sx={{ mt: 1, height: 8, borderRadius: 4 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ backgroundColor: '#E8F5E9', height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Compliant Assets
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#388e3c' }}>
                {metrics?.compliantAssets || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                of {metrics?.totalAssets || 0} total assets
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ backgroundColor: '#FFF3E0', height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Pending Review
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#f57c00' }}>
                {metrics?.pendingReview || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                require attention
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ backgroundColor: '#FFEBEE', height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Non-Compliant
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#d32f2f' }}>
                {metrics?.nonCompliantAssets || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                need remediation
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Compliance Status Distribution
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  dataKey="value"
                  label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Compliance by Domain
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics?.byDomain || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="domain" />
                <YAxis />
                <RechartsTooltip />
                <Bar dataKey="percentage" fill="#1976d2" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Filters and Search */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Asset Compliance Details
        </Typography>
        
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              placeholder="Search assets..."
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

          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">All Statuses</MenuItem>
                <MenuItem value="Compliant">Compliant</MenuItem>
                <MenuItem value="Non-Compliant">Non-Compliant</MenuItem>
                <MenuItem value="Pending Review">Pending Review</MenuItem>
                <MenuItem value="Exempt">Exempt</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Domain</InputLabel>
              <Select
                value={domainFilter}
                label="Domain"
                onChange={(e) => setDomainFilter(e.target.value)}
              >
                <MenuItem value="all">All Domains</MenuItem>
                {uniqueDomains.map(domain => (
                  <MenuItem key={domain} value={domain}>{domain}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Risk Level</InputLabel>
              <Select
                value={riskFilter}
                label="Risk Level"
                onChange={(e) => setRiskFilter(e.target.value)}
              >
                <MenuItem value="all">All Risk Levels</MenuItem>
                {uniqueRiskLevels.map(risk => (
                  <MenuItem key={risk} value={risk}>{risk}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Assets Table */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Asset Name</TableCell>
                <TableCell>Domain</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Risk Level</TableCell>
                <TableCell>Last Reviewed</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAssets.map((asset) => (
                <TableRow key={asset.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {getStatusIcon(asset.complianceStatus)}
                      <Typography sx={{ ml: 1 }}>{asset.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{asset.domain}</TableCell>
                  <TableCell>{asset.type}</TableCell>
                  <TableCell>
                    <Chip
                      label={asset.complianceStatus}
                      color={getStatusColor(asset.complianceStatus) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={asset.riskLevel}
                      size="small"
                      sx={{ 
                        backgroundColor: getRiskColor(asset.riskLevel),
                        color: 'white'
                      }}
                    />
                  </TableCell>
                  <TableCell>{asset.lastReviewed}</TableCell>
                  <TableCell>
                    <IconButton 
                      size="small" 
                      aria-label="View asset details"
                      onClick={() => {/* Navigate to asset details */}}
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      aria-label="Generate compliance report"
                      onClick={() => {/* Generate report */}}
                    >
                      <GetAppIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {filteredAssets.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              No assets match the current filters
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Quick Actions */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Quick Actions
        </Typography>
        <Grid container spacing={2}>
          <Grid item>
            <Button
              variant="contained"
              startIcon={<AssessmentIcon />}
              onClick={() => {/* Generate compliance report */}}
            >
              Generate Report
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              startIcon={<PolicyIcon />}
              onClick={() => {/* Navigate to policies */}}
            >
              View Policies
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              startIcon={<GetAppIcon />}
              onClick={() => {/* Export data */}}
            >
              Export Data
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Compliance;
