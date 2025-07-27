import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import Layout from './components/Layout/Layout';
import Navbar from './components/Layout/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import DataCatalog from './pages/DataCatalog';
import DataGovernance from './pages/DataGovernance';
import Analytics from './pages/Analytics';
import Integration from './pages/Integration';
import Learn101 from './pages/Learn101';
import DGvsMDMLesson from './components/Learn/DGvsMDMLesson';
import DataStewardLesson from './components/Learn/DataStewardLesson';
import AssetTypes from './pages/AssetTypes';
import PolicyManager from './pages/PolicyManager';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';

// Import Auth Provider Context
import { AuthProvider, useAuth } from './contexts/AuthContext';
import DevTools from './components/DevTools/DevTools';

const theme = createTheme({
  palette: {
    primary: {
      main: '#7BC144', // Collibra green
      dark: '#6CAD3D',
    },
    secondary: {
      main: '#1785FB', // Collibra blue
      dark: '#1476E0',
    },
    background: {
      default: '#FFFFFF',
      paper: '#F5F6F7',
    },
    text: {
      primary: '#0C1F3F', // Collibra dark blue
      secondary: '#2D3436',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontWeight: 600,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '4px',
          padding: '12px 24px',
          fontSize: '16px',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          color: '#0C1F3F',
          boxShadow: '0 2px 4px rgba(12, 31, 63, 0.08)',
        },
      },
    },
  },
});

// Protected Route Component
const ProtectedRoute: React.FC = () => {
  const { user, loading } = useAuth();
  
  // If authentication is loading, don't redirect yet
  if (loading) {
    return null;
  }
  
  // If user is not logged in, redirect to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // If user is logged in, render the child routes
  return <Outlet />;
};

// Data Steward Protected Route
const DataStewardRoute: React.FC = () => {
  const { user, loading } = useAuth();
  
  // If authentication is loading, don't redirect yet
  if (loading) {
    return null;
  }
  
  // If user is not logged in or not a data steward or admin, redirect
  if (!user || (user.role !== 'data-steward' && user.role !== 'admin')) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  // If user is authorized, render the child routes
  return <Outlet />;
};

// Admin Protected Route
const AdminRoute: React.FC = () => {
  const { user, loading } = useAuth();
  
  // If authentication is loading, don't redirect yet
  if (loading) {
    return null;
  }
  
  // If user is not logged in or not an admin, redirect
  if (!user || user.role !== 'admin') {
    return <Navigate to="/unauthorized" replace />;
  }
  
  // If user is authorized, render the child routes
  return <Outlet />;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          {/* DevTools component for development only */}
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Routes with Layout (which already includes Navbar) */}
            <Route element={<Layout>{<Outlet />}</Layout>}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/learn101" element={<Learn101 />} />
              <Route path="/dgvsmdm" element={<DGvsMDMLesson />} />
              <Route path="/data-steward" element={<DataStewardLesson />} />
              
              {/* Protected Routes - Require Authentication */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/data-catalog" element={<DataCatalog />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/integration" element={<Integration />} />
                <Route path="/asset-types" element={<AssetTypes />} />
              </Route>
              
              {/* Data Steward Only Routes */}
              <Route element={<DataStewardRoute />}>
                <Route path="/data-governance" element={<DataGovernance />} />
              </Route>
              
              {/* Admin Only Routes */}
              <Route element={<AdminRoute />}>
                <Route path="/policy" element={<PolicyManager />}>
                  <Route path="gdpr" element={<PolicyManager />} />
                  <Route path="standards" element={<PolicyManager />} />
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
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
