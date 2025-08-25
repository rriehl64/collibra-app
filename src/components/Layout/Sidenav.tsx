import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Box,
  Divider,
} from '@mui/material';
import {
  Storage as StorageIcon,
  Security as SecurityIcon,
  Analytics as AnalyticsIcon,
  IntegrationInstructions as IntegrationIcon,
  Dashboard as DashboardIcon,
  Description as DescriptionIcon,
  Settings as SettingsIcon,
  School as SchoolIcon,
  Business as BusinessIcon,
  Category as CategoryIcon,
  Book as BookIcon,
  Domain as DomainIcon,
  Class as SubjectIcon,
  Info as InfoIcon,
  AssignmentInd as AssignmentIndIcon,
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';

const DRAWER_WIDTH = 240;

const menuItems = [
  { text: 'Dashboard', icon: DashboardIcon, path: '/' },
  { text: 'E-Unify 101', icon: SchoolIcon, path: '/learn101' },
  { text: 'Data Literacy Module', icon: SchoolIcon, path: '/data-literacy' },
  { text: 'National Production Dataset', icon: StorageIcon, path: '/national-production-dataset' },
  { text: 'E-Unify E22 Classification', icon: AssignmentIndIcon, path: '/e22-classification' },
  { text: 'Data Catalog', icon: StorageIcon, path: '/data-catalog' },
  { text: 'Data Assets', icon: StorageIcon, path: '/data-assets' },
  { text: 'Business Processes', icon: BusinessIcon, path: '/assets/business-processes' },
  { text: 'Data Categories', icon: CategoryIcon, path: '/assets/data-categories' },
  { text: 'Data Concepts', icon: BookIcon, path: '/assets/data-concepts' },
  { text: 'Data Domains', icon: DomainIcon, path: '/assets/data-domains' },
  { text: 'Subject Categories', icon: SubjectIcon, path: '/assets/subject-categories' },
  { text: 'Asset Types', icon: StorageIcon, path: '/asset-types' },
  { text: 'Data Governance', icon: SecurityIcon, path: '/data-governance' },
  { text: 'DG vs MDM', icon: SecurityIcon, path: '/dgvsmdm' },
  { text: 'Data Steward', icon: SecurityIcon, path: '/data-steward' },
  { text: 'Analytics', icon: AnalyticsIcon, path: '/analytics' },
  { text: 'Study Aids: Business Analytics', icon: AnalyticsIcon, path: '/study-aids/business-analytics' },
  { text: 'Integration', icon: IntegrationIcon, path: '/integration' },
];

const secondaryMenuItems = [
  { text: 'About E-Unify', icon: InfoIcon, path: '/about' },
  { text: 'Documentation', icon: DescriptionIcon, path: '/docs' },
  { text: 'Settings', icon: SettingsIcon, path: '/settings' },
];

const Sidenav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isCurrentPath = (path: string) => {
    return location.pathname === path;
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          borderRight: '1px solid rgba(0, 0, 0, 0.12)',
          backgroundColor: 'background.paper',
          position: 'static',
        },
      }}
    >
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                selected={isCurrentPath(item.path)}
                onClick={() => navigate(item.path)}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'white',
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: isCurrentPath(item.path) ? 'white' : 'inherit',
                  }}
                >
                  <item.icon />
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider sx={{ my: 2 }} />
        <List>
          {secondaryMenuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                selected={isCurrentPath(item.path)}
                onClick={() => navigate(item.path)}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <item.icon />
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidenav;
