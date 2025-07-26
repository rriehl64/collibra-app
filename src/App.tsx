import React from 'react';
import * as ReactRouter from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import Layout from './components/Layout/Layout';
import Navbar from './components/Layout/Navbar';
import Home from './pages/Home';
import DataCatalog from './pages/DataCatalog';
import DataGovernance from './pages/DataGovernance';
import Analytics from './pages/Analytics';
import Integration from './pages/Integration';
import Learn101 from './pages/Learn101';
import DGvsMDMLesson from './components/Learn/DGvsMDMLesson';
import DataStewardLesson from './components/Learn/DataStewardLesson';
import AssetTypes from './pages/AssetTypes';
import PolicyManager from './pages/PolicyManager';

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

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ReactRouter.BrowserRouter>
        <Layout>
          <Navbar />
          <ReactRouter.Routes>
            <ReactRouter.Route path="/" element={<Home />} />
            <ReactRouter.Route path="/data-catalog" element={<DataCatalog />} />
            <ReactRouter.Route path="/data-governance" element={<DataGovernance />} />
            <ReactRouter.Route path="/analytics" element={<Analytics />} />
            <ReactRouter.Route path="/integration" element={<Integration />} />
            <ReactRouter.Route path="/learn101" element={<Learn101 />} />
            <ReactRouter.Route path="/dgvsmdm" element={<DGvsMDMLesson />} />
            <ReactRouter.Route path="/data-steward" element={<DataStewardLesson />} />
            <ReactRouter.Route path="/asset-types" element={<AssetTypes />} />
            <ReactRouter.Route path="/policy" element={<PolicyManager />}>
              <ReactRouter.Route path="gdpr" element={<PolicyManager />} />
              <ReactRouter.Route path="standards" element={<PolicyManager />} />
            </ReactRouter.Route>
            {/* Additional routes will be added here */}
          </ReactRouter.Routes>
        </Layout>
      </ReactRouter.BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
