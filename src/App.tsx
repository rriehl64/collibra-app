import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import ScrollToTop from './components/common/ScrollToTop';
import { CssBaseline } from '@mui/material';
import ThemeProvider from './contexts/ThemeContext';
import { AccessibilityProvider } from './contexts/AccessibilityContext';
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
import E22Classification from './pages/E22Classification';
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
import Help from './pages/Help';
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
import Compliance from './pages/Compliance';
import Settings from './pages/Settings';
import About from './pages/About';
import TestPage from './pages/TestPage';
import DataStrategySupport from './pages/DataStrategySupport';
import ProjectCharter from './pages/ProjectCharter';
import KpiDictionary from './pages/KpiDictionary';
import KpisBrowser from './pages/KpisBrowser';
import ProcessingCategories from './pages/processing/ProcessingCategories';
import ProcessingMeasures from './pages/processing/ProcessingMeasures';
import ProcessingMigration from './pages/processing/ProcessingMigration';
import GDPRPolicy from './pages/policy/GDPRPolicy';
import PolicyIndex from './pages/policy/PolicyIndex';
import Standards from './pages/policy/Standards';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import DevLogin from './pages/DevLogin';
import StudyAidsBusinessAnalytics from './pages/StudyAidsBusinessAnalytics';
import WeeklyStatusList from './pages/WeeklyStatusList';
import MonthlyStatusList from './pages/MonthlyStatusList';
import DataGovernanceQuality from './pages/DataGovernanceQuality';
import DataQuality from './pages/DataQuality';
import UserManagement from './pages/UserManagement';
import DataLineage from './pages/DataLineage';
import DataStewardCenter from './pages/DataStewardCenter';
import AdminMenuManagement from './pages/AdminMenuManagement';
import DataStrategyPlanning from './pages/DataStrategyPlanning';
import TeamRoster from './pages/TeamRoster';
import OpenTasks from './pages/OpenTasks';
import FederalDataStrategy from './pages/FederalDataStrategy';
import USCISApplicationTracking from './pages/USCISApplicationTracking';
import DataStrategyOperationsCenter from './pages/DataStrategyOperationsCenter';
import ProjectDetails from './pages/ProjectDetails';
import TeamUtilizationDetails from './pages/TeamUtilizationDetails';
import ComplianceDetails from './pages/ComplianceDetails';
import AutomatedProcesses from './pages/AutomatedProcesses';
import ScheduledProcessesPage from './pages/ScheduledProcessesPage';
import ProcessMonitoring from './components/ProcessMonitoring';

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
      <AccessibilityProvider>
        <AuthProvider>
          <SnackbarProvider>
          <BrowserRouter>
            {/* ScrollToTop component ensures the page starts at the top when navigating */}
            <ScrollToTop />
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
              <Route path="/e22-classification" element={<E22Classification isAdmin={true} />} />
              <Route path="/dgvsmdm" element={<DGvsMDMLesson />} />
              <Route path="/data-steward-lesson" element={<DataStewardLesson />} />
              <Route path="/about" element={<About />} />
              <Route path="/data-strategy-support" element={<DataStrategySupport />} />
              <Route path="/help" element={<Help />} />
              
              {/* Protected Routes - Require Authentication */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/data-catalog" element={<DataCatalog />} />
                <Route path="/data-assets" element={<DataAssetDemo />} />
                <Route path="/project-charter" element={<ProjectCharter />} />
                <Route path="/templates/kpi-dictionary" element={<KpiDictionary />} />
                <Route path="/templates/kpi-dictionary/:id" element={<KpiDictionary />} />
                <Route path="/templates/kpis" element={<KpisBrowser />} />
                <Route path="/assets/business-processes" element={<BusinessProcesses />} />
                <Route path="/assets/data-categories" element={<DataCategories />} />
                <Route path="/assets/data-concepts" element={<DataConcepts />} />
                <Route path="/assets/data-domains" element={<DataDomains />} />
                <Route path="/assets/subject-categories" element={<SubjectCategories />} />
                <Route path="/assets/line-of-business" element={<LineOfBusiness />} />
                <Route path="/context/business-terms" element={<BusinessTerms />} />
                <Route path="/context/acronyms" element={<Acronyms />} />
                <Route path="/context/kpis" element={<Navigate to="/templates/kpis" replace />} />
                <Route path="/context/reports" element={<Reports />} />
                <Route path="/context/bi-reports" element={<BIReports />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/integration" element={<Integration />} />
                <Route path="/study-aids/business-analytics" element={<StudyAidsBusinessAnalytics />} />
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
                <Route path="/weekly-status" element={<WeeklyStatusList />} />
                <Route path="/monthly-status" element={<MonthlyStatusList />} />
                <Route path="/data-governance-quality" element={<DataGovernanceQuality />} />
                <Route path="/data-quality" element={<DataQuality />} />
                <Route path="/compliance" element={<Compliance />} />
                <Route path="/tasks" element={<OpenTasks />} />
                <Route path="/federal-data-strategy" element={<FederalDataStrategy />} />
              </Route>
              
              {/* Data Steward Only Routes */}
              <Route element={<DataStewardRoute />}>
                <Route path="/data-governance" element={<DataGovernance />} />
              </Route>
              
              {/* Data Steward Routes - Direct access for testing */}
              <Route path="/data-steward" element={<DataStewardCenter />} />

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
                
                {/* Data Management Routes */}
                <Route path="/data-quality" element={<DataQuality />} />
                <Route path="/data-lineage" element={<DataLineage />} />
                
                {/* Access Management Routes */}
                <Route path="/access" element={<Outlet />}>
                  <Route path="user-management" element={<UserManagement />} />
                  <Route path="roles" element={<Roles />} />
                  <Route path="permissions" element={<Permissions />} />
                  <Route path="jurisdictions" element={<Jurisdictions />} />
                </Route>
                
                {/* Admin Menu Management */}
                <Route path="/admin/menu-management" element={<AdminMenuManagement />} />
                
                {/* Data Strategy Planning */}
                <Route path="/admin/data-strategy-planning" element={<DataStrategyPlanning />} />
                
                {/* USCIS Application Tracking */}
                <Route path="/admin/uscis-application-tracking" element={<USCISApplicationTracking />} />
                
                {/* Data Strategy Operations Center */}
                <Route path="/admin/data-strategy-operations-center" element={<DataStrategyOperationsCenter />} />
            <Route path="/admin/project-details" element={<ProjectDetails />} />
            <Route path="/admin/team-utilization-details" element={<TeamUtilizationDetails />} />
            <Route path="/admin/compliance-details" element={<ComplianceDetails />} />
                
                {/* Automated Processes */}
                <Route path="/admin/automated-processes" element={<AutomatedProcesses />} />
                
                {/* Scheduled Processes (standalone access) */}
                <Route path="/admin/scheduled-processes" element={<ScheduledProcessesPage />} />
                
                {/* Process Monitoring */}
                <Route path="/admin/process-monitoring" element={<ProcessMonitoring />} />
                
                {/* Team Roster */}
                <Route path="/admin/team-roster" element={<TeamRoster />} />
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
      </AccessibilityProvider>
    </ThemeProvider>
  );
}

export default App;
