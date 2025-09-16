import React, { useState, useEffect } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Box,
  Divider,
  CircularProgress,
  Alert,
  Collapse,
  Typography,
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
  EventNote as EventNoteIcon,
  Gavel as GovernanceIcon,
  AdminPanelSettings as AdminIcon,
  People as PeopleIcon,
  VpnKey as RolesIcon,
  LocationOn as JurisdictionIcon,
  Menu as MenuIcon,
  ExpandLess,
  ExpandMore,
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import menuSettingsService, { MenuSettings } from '../../services/menuSettingsService';

const DRAWER_WIDTH = 240;

// Icon mapping for dynamic menu items
const iconMap: { [key: string]: React.ComponentType } = {
  dashboard: DashboardIcon,
  school: SchoolIcon,
  storage: StorageIcon,
  governance: GovernanceIcon,
  assignment: AssignmentIndIcon,
  business: BusinessIcon,
  category: CategoryIcon,
  book: BookIcon,
  domain: DomainIcon,
  subject: SubjectIcon,
  security: SecurityIcon,
  analytics: AnalyticsIcon,
  integration: IntegrationIcon,
  event: EventNoteIcon,
  info: InfoIcon,
  description: DescriptionIcon,
  settings: SettingsIcon,
};

// Get icon for menu item based on path or menuId
const getIconForMenuItem = (menuId: string, path: string): React.ComponentType => {
  // Map specific menu items to icons
  const pathIconMap: { [key: string]: React.ComponentType } = {
    '/': DashboardIcon,
    '/learn101': SchoolIcon,
    '/data-literacy': SchoolIcon,
    '/national-production-dataset': StorageIcon,
    '/data-governance-quality': GovernanceIcon,
    '/e22-classification': AssignmentIndIcon,
    '/data-catalog': StorageIcon,
    '/data-assets': StorageIcon,
    '/assets/business-processes': BusinessIcon,
    '/assets/data-categories': CategoryIcon,
    '/assets/data-concepts': BookIcon,
    '/assets/data-domains': DomainIcon,
    '/assets/subject-categories': SubjectIcon,
    '/asset-types': StorageIcon,
    '/data-governance': SecurityIcon,
    '/dgvsmdm': SecurityIcon,
    '/data-steward-lesson': SecurityIcon,
    '/analytics': AnalyticsIcon,
    '/study-aids/business-analytics': AnalyticsIcon,
    '/integration': IntegrationIcon,
    '/weekly-status': EventNoteIcon,
    '/monthly-status': EventNoteIcon,
    '/about': InfoIcon,
    '/docs': DescriptionIcon,
    '/settings': SettingsIcon,
    '/access/user-management': PeopleIcon,
    '/access/roles': RolesIcon,
    '/access/jurisdictions': JurisdictionIcon,
    '/admin/menu-management': MenuIcon,
    '/admin/system-settings': SettingsIcon,
  };
  
  return pathIconMap[path] || StorageIcon;
};

interface MenuItem {
  text: string;
  icon: React.ComponentType;
  path: string;
  isEnabled: boolean;
}

const Sidenav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [secondaryMenuItems, setSecondaryMenuItems] = useState<MenuItem[]>([]);
  const [administrationItems, setAdministrationItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [administrationOpen, setAdministrationOpen] = useState(false);

  useEffect(() => {
    loadMenuItems();
  }, [user]);

  const loadMenuItems = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Loading menu items from API...');
      const enabledMenus = await menuSettingsService.getEnabledMenuItems();
      console.log('Received menu items:', enabledMenus.length);
      
      // Filter menu items based on user role
      const filteredMenus = enabledMenus.filter(menu => {
        if (!user) return menu.requiredRole === 'user';
        
        switch (user.role) {
          case 'admin':
            return true; // Admin can see everything
          case 'data-steward':
            return ['user', 'data-steward'].includes(menu.requiredRole);
          default:
            return menu.requiredRole === 'user';
        }
      });
      
      // Separate primary, secondary, and administration menu items
      const primary = filteredMenus
        .filter(menu => menu.category === 'primary')
        .sort((a, b) => a.order - b.order)
        .map(menu => ({
          text: menu.text,
          icon: getIconForMenuItem(menu.menuId, menu.path),
          path: menu.path,
          isEnabled: menu.isEnabled
        }));
        
      const secondary = filteredMenus
        .filter(menu => menu.category === 'secondary')
        .sort((a, b) => a.order - b.order)
        .map(menu => ({
          text: menu.text,
          icon: getIconForMenuItem(menu.menuId, menu.path),
          path: menu.path,
          isEnabled: menu.isEnabled
        }));
        
      const administration = filteredMenus
        .filter(menu => menu.category === 'administration')
        .sort((a, b) => a.order - b.order)
        .map(menu => ({
          text: menu.text,
          icon: getIconForMenuItem(menu.menuId, menu.path),
          path: menu.path,
          isEnabled: menu.isEnabled
        }));
      
      setMenuItems(primary);
      setSecondaryMenuItems(secondary);
      setAdministrationItems(administration);
    } catch (err) {
      console.error('Failed to load menu items:', err);
      setError('Failed to load menu items');
      // Fallback to default menu items if API fails
      setMenuItems([
        { text: 'Dashboard', icon: DashboardIcon, path: '/', isEnabled: true },
        { text: 'E-Unify 101', icon: SchoolIcon, path: '/learn101', isEnabled: true },
        { text: 'Data Assets', icon: StorageIcon, path: '/data-assets', isEnabled: true },
      ]);
      setSecondaryMenuItems([
        { text: 'About E-Unify', icon: InfoIcon, path: '/about', isEnabled: true },
        { text: 'Settings', icon: SettingsIcon, path: '/settings', isEnabled: true },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const isCurrentPath = (path: string) => {
    return location.pathname === path;
  };

  if (loading) {
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
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
          <CircularProgress />
        </Box>
      </Drawer>
    );
  }

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
        {error && (
          <Box sx={{ p: 2 }}>
            <Alert severity="warning">
              {error}
            </Alert>
          </Box>
        )}
        <List>
          {menuItems.filter(item => item.isEnabled).map((item) => (
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
        
        {/* Administration Section */}
        {administrationItems.length > 0 && (
          <>
            <Divider sx={{ my: 2 }} />
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => setAdministrationOpen(!administrationOpen)}
                sx={{
                  backgroundColor: 'rgba(0, 51, 102, 0.05)',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 51, 102, 0.1)',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <AdminIcon sx={{ color: '#003366' }} />
                </ListItemIcon>
                <ListItemText 
                  primary={
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#003366' }}>
                      Administration
                    </Typography>
                  } 
                />
                {administrationOpen ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>
            <Collapse in={administrationOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {administrationItems.filter(item => item.isEnabled).map((item) => (
                  <ListItem key={item.text} disablePadding>
                    <ListItemButton
                      selected={isCurrentPath(item.path)}
                      onClick={() => navigate(item.path)}
                      sx={{
                        pl: 4,
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
            </Collapse>
          </>
        )}
        
        <Divider sx={{ my: 2 }} />
        <List>
          {secondaryMenuItems.filter(item => item.isEnabled).map((item) => (
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
