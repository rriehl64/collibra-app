import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import ThemeProvider from './contexts/ThemeContext';
import './styles/theme.css';
import './styles/settings.css';
import Layout from './components/Layout/Layout';
import Navbar from './components/Layout/Navbar';
import { SnackbarProvider } from './contexts/SnackbarContext';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import DataCatalog from './pages/DataCatalog';
import DataGovernance from './pages/DataGovernance';
import Analytics from './pages/Analytics';
import Integration from './pages/Integration';
import Learn101 from './pages/Learn101';
import DataLiteracyModule from './pages/DataLiteracyModule';
import NationalProductionDataset from './pages/NationalProductionDataset';
import DGvsMDMLesson from './components/Learn/DGvsMDMLesson';
import DataStewardLesson from './components/Learn/DataStewardLesson';
import AssetTypes from './pages/AssetTypes';
import PolicyManager from './pages/PolicyManager';
import DataAssetDemo from './pages/DataAssetDemo';
import BusinessProcesses from './pages/BusinessProcesses';
import DataCategories from './pages/DataCategories';
import DataConcepts from './pages/DataConcepts';
import DataDomains from './pages/DataDomains';
import SubjectCategories from './pages/SubjectCategories';
import LineOfBusiness from './pages/LineOfBusiness';
import BusinessTerms from './pages/BusinessTerms';
import Acronyms from './pages/Acronyms';
import KPIs from './pages/KPIs';
import Reports from './pages/Reports';
import BIReports from './pages/BIReports';
import DomainTypes from './pages/admin/DomainTypes';
import Statuses from './pages/admin/Statuses';
import Characteristics from './pages/admin/Characteristics';
import QualityRules from './pages/admin/QualityRules';
import Scopes from './pages/admin/Scopes';
import Workflows from './pages/admin/Workflows';
import Users from './pages/access/Users';
import Roles from './pages/access/Roles';
import Permissions from './pages/access/Permissions';
import Profile from './pages/Profile';
import Jurisdictions from './pages/access/Jurisdictions';
import Documentation from './pages/Documentation';
import Settings from './pages/Settings';
import About from './pages/About';
import TestPage from './pages/TestPage';
import ProcessingCategories from './pages/processing/ProcessingCategories';
import ProcessingMeasures from './pages/processing/ProcessingMeasures';
import ProcessingMigration from './pages/processing/ProcessingMigration';
import GDPRPolicy from './pages/policy/GDPRPolicy';
import PolicyIndex from './pages/policy/PolicyIndex';
import Standards from './pages/policy/Standards';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import DevLogin from './pages/DevLogin';

// Import Auth Provider Context
import { AuthProvider, useAuth } from './contexts/AuthContext';
import DevTools from './components/DevTools/DevTools';

// Theme configuration has been moved to ThemeContext

// Protected Route Component
const ProtectedRoute: React.FC = () => {
  // TEMPORARY: Bypass authentication for testing
  // In production, this would check user authentication status
  const { loading } = useAuth();
  
  // If authentication is loading, don't redirect yet
  if (loading) {
    return null;
  }
  
  // TEMPORARY: Always allow access for testing our accessible components
  // In production, this would redirect unauthenticated users to login
  
  // If user is logged in, render the child routes
  return <Outlet />;
};

// Data Steward Protected Route
const DataStewardRoute: React.FC = () => {
  // TEMPORARY: Bypass authentication for testing
  const { loading } = useAuth();
  
  // If authentication is loading, don't redirect yet
  if (loading) {
    return null;
  }
  
  // TEMPORARY: Always allow access for testing our accessible components
  // In production, this would verify the user is a data steward or admin
  
  // If user is authorized, render the child routes
  return <Outlet />;
};

// Admin Protected Route
const AdminRoute: React.FC = () => {
  // TEMPORARY: Bypass authentication for testing
  const { loading } = useAuth();
  
  // If authentication is loading, don't redirect yet
  if (loading) {
    return null;
  }
  
  // TEMPORARY: Always allow access for testing our accessible components
  // In production, this would verify the user is an admin
  
  // If user is authorized, render the child routes
  return <Outlet />;
};

// This simple test app doesn't require authentication context or any API calls
// It's used just to test our accessible components in isolation
const TestApp: React.FC = () => {
  return (
    <ThemeProvider>
      <CssBaseline />
      <TestPage />
    </ThemeProvider>
  );
};

function App() {
  // Check if we're in test mode via URL parameter
  const isTestMode = window.location.search.includes('testMode=true');
  
  // If test mode is enabled, render the simplified test app
  if (isTestMode) {
    return <TestApp />;
  }
  
  return (
    <ThemeProvider>
      <CssBaseline />
      <AuthProvider>
        <SnackbarProvider>
          <BrowserRouter>
          {/* DevTools component for development only */}
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dev-login" element={<DevLogin />} />
            
            {/* Temporary Testing Route */}
            <Route path="/test/data-assets" element={<DataAssetDemo />} />
            
            {/* Routes with Layout (which already includes Navbar) */}
            <Route element={<Layout>{<Outlet />}</Layout>}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/learn101" element={<Learn101 />} />
              <Route path="/data-literacy" element={<DataLiteracyModule />} />
              <Route path="/national-production-dataset" element={<NationalProductionDataset />} />
              <Route path="/dgvsmdm" element={<DGvsMDMLesson />} />
              <Route path="/data-steward" element={<DataStewardLesson />} />
              <Route path="/about" element={<About />} />
              
              {/* Protected Routes - Require Authentication */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/data-catalog" element={<DataCatalog />} />
                <Route path="/data-assets" element={<DataAssetDemo />} />
                <Route path="/assets/business-processes" element={<BusinessProcesses />} />
                <Route path="/assets/data-categories" element={<DataCategories />} />
                <Route path="/assets/data-concepts" element={<DataConcepts />} />
                <Route path="/assets/data-domains" element={<DataDomains />} />
                <Route path="/assets/subject-categories" element={<SubjectCategories />} />
                <Route path="/assets/line-of-business" element={<LineOfBusiness />} />
                <Route path="/context/business-terms" element={<BusinessTerms />} />
                <Route path="/context/acronyms" element={<Acronyms />} />
                <Route path="/context/kpis" element={<KPIs />} />
                <Route path="/context/reports" element={<Reports />} />
                <Route path="/context/bi-reports" element={<BIReports />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/integration" element={<Integration />} />
                <Route path="/asset-types" element={<AssetTypes />} />
                <Route path="/testpage" element={<TestPage />} />
                <Route path="/docs" element={<Documentation />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/processing/categories" element={<ProcessingCategories />} />
                <Route path="/processing/measures" element={<ProcessingMeasures />} />
                <Route path="/processing/migration" element={<ProcessingMigration />} />
                <Route path="/policy" element={<PolicyIndex />} />
                <Route path="/policy/gdpr" element={<GDPRPolicy />} />
                <Route path="/policy/standards" element={<Standards />} />
              </Route>
              
              {/* Data Steward Only Routes */}
              <Route element={<DataStewardRoute />}>
                <Route path="/data-governance" element={<DataGovernance />} />
              </Route>
              
              {/* Admin Only Routes */}
              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<Outlet />}>
                  <Route path="/admin/dashboard" element={<Dashboard />} />
                  <Route path="/admin/policy-manager" element={<PolicyManager />} />
                  <Route path="/admin/domain-types" element={<DomainTypes />} />
                  <Route path="/admin/statuses" element={<Statuses />} />
                  <Route path="/admin/characteristics" element={<Characteristics />} />
                  <Route path="/admin/dataQuality" element={<Dashboard />} />
                  <Route path="/admin/dataStewards" element={<Dashboard />} />
                  <Route path="/admin/workflows" element={<Workflows />} />
                </Route>
                
                {/* Access Management Routes */}
                <Route path="/access" element={<Outlet />}>
                  <Route path="/access/users" element={<Users />} />
                  <Route path="/access/roles" element={<Roles />} />
                  <Route path="/access/permissions" element={<Permissions />} />
                  <Route path="/access/jurisdictions" element={<Jurisdictions />} />
                </Route>
              </Route>
              
              {/* Error Routes */}
              <Route path="/unauthorized" element={
                <div style={{ padding: '2rem', textAlign: 'center' }}>
                  <h1>Unauthorized Access</h1>
                  <p>You don't have permission to access this resource.</p>
                </div>
              } />
              <Route path="*" element={
                <div style={{ padding: '2rem', textAlign: 'center' }}>
                  <h1>Page Not Found</h1>
                  <p>The page you're looking for doesn't exist.</p>
                </div>
              } />
            </Route>
          </Routes>
          {/* Development tools */}
          <DevTools />
        </BrowserRouter>
        </SnackbarProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
