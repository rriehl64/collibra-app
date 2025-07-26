import React, { useState } from 'react';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Box,
  Typography,
  ListItemButton,
} from '@mui/material';
import {
  Storage as StorageIcon,
  Business as BusinessIcon,
  AdminPanelSettings as AdminIcon,
  Security as SecurityIcon,
  Settings as SettingsIcon,
  ExpandLess,
  ExpandMore,
  AccountTree as TreeIcon,
  Category as CategoryIcon,
  Domain as DomainIcon,
  Subject as SubjectIcon,
  BusinessCenter as LineBusinessIcon,
  Description as DescriptionIcon,
  TextFields as AcronymIcon,
  Assessment as KpiIcon,
  InsertChart as ReportIcon,
  People as UsersIcon,
  VpnKey as RolesIcon,
  Lock as PermissionsIcon,
  Public as JurisdictionIcon,
  DataObject as ProcessingIcon,
  Speed as MeasuresIcon,
  SwapHoriz as MigrationIcon,
  Assessment as AssessmentIcon,
  Policy as PolicyIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const MenuSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

interface MenuGroup {
  title: string;
  icon: React.ReactNode;
  items: {
    name: string;
    icon: React.ReactNode;
    path?: string;
  }[];
}

const menuGroups: MenuGroup[] = [
  {
    title: 'Policy Manager',
    icon: <PolicyIcon />,
    items: [
      { name: 'GDPR Articles', icon: <DescriptionIcon />, path: '/policy/gdpr' },
      { name: 'Policies & Standards', icon: <PolicyIcon />, path: '/policy/standards' },
    ],
  },
  {
    title: 'Data Assets',
    icon: <StorageIcon />,
    items: [
      { name: 'Business Processes', icon: <TreeIcon />, path: '/assets/business-processes' },
      { name: 'Data Categories', icon: <CategoryIcon />, path: '/assets/data-categories' },
      { name: 'Data Concepts', icon: <DomainIcon />, path: '/assets/data-concepts' },
      { name: 'Data Domains', icon: <DomainIcon />, path: '/assets/data-domains' },
      { name: 'Data Subject Categories', icon: <SubjectIcon />, path: '/assets/subject-categories' },
      { name: 'Line of Business', icon: <LineBusinessIcon />, path: '/assets/line-of-business' },
    ],
  },
  {
    title: 'Business Context',
    icon: <BusinessIcon />,
    items: [
      { name: 'Business Terms', icon: <DescriptionIcon />, path: '/context/business-terms' },
      { name: 'Acronyms', icon: <AcronymIcon />, path: '/context/acronyms' },
      { name: 'KPIs', icon: <KpiIcon />, path: '/context/kpis' },
      { name: 'Reports', icon: <ReportIcon />, path: '/context/reports' },
      { name: 'BI Reports', icon: <ReportIcon />, path: '/context/bi-reports' },
    ],
  },
  {
    title: 'Administration',
    icon: <AdminIcon />,
    items: [
      { name: 'Domain Types', icon: <DomainIcon />, path: '/admin/domain-types' },
      { name: 'Statuses', icon: <SettingsIcon />, path: '/admin/statuses' },
      { name: 'Characteristics', icon: <CategoryIcon />, path: '/admin/characteristics' },
      { name: 'Data Quality Rules', icon: <AssessmentIcon />, path: '/admin/quality-rules' },
      { name: 'Scopes', icon: <DomainIcon />, path: '/admin/scopes' },
      { name: 'Workflows', icon: <TreeIcon />, path: '/admin/workflows' },
    ],
  },
  {
    title: 'Access Management',
    icon: <SecurityIcon />,
    items: [
      { name: 'Users', icon: <UsersIcon />, path: '/access/users' },
      { name: 'Roles', icon: <RolesIcon />, path: '/access/roles' },
      { name: 'Permissions', icon: <PermissionsIcon />, path: '/access/permissions' },
      { name: 'Jurisdictions', icon: <JurisdictionIcon />, path: '/access/jurisdictions' },
    ],
  },
  {
    title: 'Data Processing',
    icon: <ProcessingIcon />,
    items: [
      { name: 'Processing Categories', icon: <CategoryIcon />, path: '/processing/categories' },
      { name: 'Measures', icon: <MeasuresIcon />, path: '/processing/measures' },
      { name: 'Migration Tools', icon: <MigrationIcon />, path: '/processing/migration' },
    ],
  },
];

const AssetTypeMenu: React.FC = () => {
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({});
  const navigate = useNavigate();

  const toggleSection = (title: string) => {
    setOpenSections(prev => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      <Typography variant="h6" sx={{ p: 2, pb: 1 }}>
        Asset Types
      </Typography>
      {menuGroups.map((group) => (
        <MenuSection key={group.title}>
          <ListItemButton onClick={() => toggleSection(group.title)}>
            <ListItemIcon>{group.icon}</ListItemIcon>
            <ListItemText primary={group.title} />
            {openSections[group.title] ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openSections[group.title]} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {group.items.map((item) => (
                <StyledListItemButton
                  key={item.name}
                  sx={{ pl: 4 }}
                  onClick={() => {
                    if (item.path) {
                      navigate(item.path);
                    }
                  }}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.name} />
                </StyledListItemButton>
              ))}
            </List>
          </Collapse>
        </MenuSection>
      ))}
    </Box>
  );
};

export default AssetTypeMenu;
