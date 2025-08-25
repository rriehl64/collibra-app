// USCIS Accessible Data Strategy Support Services Page - Section 508 Compliant
import React, { useState } from 'react';
import {
  Box,
  Breadcrumbs,
  Button,
  Chip,
  Container,
  Grid,
  Link as MuiLink,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tab,
  Tabs,
  Typography,
  Collapse,
  useMediaQuery,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  Home as HomeIcon,
  Info as InfoIcon,
  MenuBook as MenuBookIcon,
  School as SchoolIcon,
  Article as ArticleIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  KeyboardArrowLeft as KeyboardArrowLeftIcon,
  Menu as MenuIcon,
  Checklist as ChecklistIcon,
  Timeline as TimelineIcon,
  FactCheck as FactCheckIcon,
  ExpandMore as ExpandMoreIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
  id: string;
}

const TabPanel = ({ children, value, index, id, ...other }: TabPanelProps) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`${id}-tabpanel-${index}`}
      aria-labelledby={`${id}-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

interface SideNavItemProps {
  icon: React.ReactElement;
  label: string;
  selected: boolean;
  onClick: () => void;
  index: number;
  tabId: string;
}

function SideNavItem({ icon, label, selected, onClick, index, tabId }: SideNavItemProps) {
  return (
    <ListItemButton
      selected={selected}
      onClick={onClick}
      role="tab"
      aria-selected={selected}
      aria-controls={`${tabId}-tabpanel-${index}`}
      id={`${tabId}-tab-${index}`}
    >
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText primary={label} />
    </ListItemButton>
  );
}

const DataStrategySupport: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [sideNavOpen, setSideNavOpen] = useState(true);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const tabId = 'data-strategy-support';

  const handleTabChange = (_e: React.SyntheticEvent, newValue: number) => setTabValue(newValue);
  const toggleSideNav = () => setSideNavOpen(prev => !prev);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <MuiLink
          underline="hover"
          color="inherit"
          href="/dashboard"
          sx={{ display: 'flex', alignItems: 'center' }}
          aria-label="Go to dashboard"
        >
          <HomeIcon sx={{ mr: 0.5 }} fontSize="small" />
          Dashboard
        </MuiLink>
        <Typography sx={{ display: 'flex', alignItems: 'center', color: '#003366', fontWeight: 600 }}>
          <InfoIcon sx={{ mr: 0.5 }} fontSize="small" />
          Data Strategy Support Services
        </Typography>
      </Breadcrumbs>

      {/* Title */}
      <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#003366', fontWeight: 700 }}>
        Data Strategy Support Services
      </Typography>

      <Box
        sx={{
          p: 3,
          mb: 4,
          backgroundColor: '#f5f5f5',
          borderLeft: '4px solid #003366',
          borderRadius: '4px',
        }}
      >
        <Typography variant="body1">
          Partner with our team to design, implement, and operationalize a mission-aligned Data Strategy. We provide
          planning frameworks, governance models, operating mechanisms, and hands-on enablement—culminating in a
          portfolio-ready capstone that applies these methods to your real organizational challenge.
        </Typography>
      </Box>

      {/* Controls */}
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Button
          onClick={toggleSideNav}
          aria-expanded={sideNavOpen}
          aria-label={sideNavOpen ? 'Hide side menu' : 'Show side menu'}
          startIcon={sideNavOpen ? <KeyboardArrowLeftIcon /> : <MenuIcon />}
          variant="outlined"
          color="primary"
          size="small"
          sx={{ borderColor: '#003366', color: '#003366', '&:hover': { backgroundColor: 'rgba(0, 51, 102, 0.04)' } }}
        >
          {sideNavOpen ? 'Hide Side Menu' : 'Show Side Menu'}
        </Button>
        {isMobile && (
          <Button
            startIcon={showMobileMenu ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            onClick={() => setShowMobileMenu(prev => !prev)}
            variant="outlined"
            sx={{ color: '#003366', borderColor: '#003366' }}
            aria-expanded={showMobileMenu}
            aria-controls="mobile-sidenav"
          >
            {showMobileMenu ? 'Hide Menu' : 'Show Menu'}
          </Button>
        )}
        {/* Right-side quick action: Open KPI Catalog */}
        <Button
          component={Link}
          to="/templates/kpis"
          variant="contained"
          color="primary"
          startIcon={<TrendingUpIcon />}
          aria-label="Open KPI Catalog"
          sx={{
            backgroundColor: '#003366',
            '&:hover': { backgroundColor: '#00264d' },
            '&:focus': { outline: '3px solid #003366', outlineOffset: 2 }
          }}
        >
          Open KPI Catalog
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Side Navigation */}
        <Grid item xs={12} md={sideNavOpen ? 3 : 0} sx={{ display: sideNavOpen ? 'block' : 'none' }}>
          <Collapse in={showMobileMenu || !isMobile}>
            <Paper elevation={3} sx={{ height: '100%' }}>
              <Typography
                variant="subtitle1"
                sx={{ p: 2, backgroundColor: '#003366', color: 'white', borderTopLeftRadius: '4px', borderTopRightRadius: '4px' }}
              >
                Navigation
              </Typography>
              <List component="div" role="tablist" id="side-navigation" aria-label="Data Strategy navigation" sx={{ '.MuiListItemIcon-root': { color: '#003366' } }}>
                <SideNavItem icon={<InfoIcon />} label="Overview" selected={tabValue === 0} onClick={() => setTabValue(0)} index={0} tabId={tabId} />
                <SideNavItem icon={<MenuBookIcon />} label="Data Strategy Plan" selected={tabValue === 1} onClick={() => setTabValue(1)} index={1} tabId={tabId} />
                <SideNavItem icon={<SchoolIcon />} label="Capstone Project" selected={tabValue === 2} onClick={() => setTabValue(2)} index={2} tabId={tabId} />
                <SideNavItem icon={<ArticleIcon />} label="Resources" selected={tabValue === 3} onClick={() => setTabValue(3)} index={3} tabId={tabId} />
              </List>
            </Paper>
          </Collapse>
        </Grid>

        {/* Content */}
        <Grid item xs={12} md={sideNavOpen ? 9 : 12}>
          <Paper elevation={3}>
            {/* Horizontal tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                aria-label="Data Strategy Support tabs"
                variant="scrollable"
                scrollButtons="auto"
                textColor="primary"
                indicatorColor="primary"
                sx={{ '.MuiTab-root': { color: '#003366', '&.Mui-selected': { color: '#003366', fontWeight: 700 } } }}
              >
                <Tab label="Overview" id={`${tabId}-tab-0`} aria-controls={`${tabId}-tabpanel-0`} />
                <Tab label="Data Strategy Plan" id={`${tabId}-tab-1`} aria-controls={`${tabId}-tabpanel-1`} />
                <Tab label="Capstone Project" id={`${tabId}-tab-2`} aria-controls={`${tabId}-tabpanel-2`} />
                <Tab label="Resources" id={`${tabId}-tab-3`} aria-controls={`${tabId}-tabpanel-3`} />
              </Tabs>
            </Box>

            {/* Overview */}
            <TabPanel value={tabValue} index={0} id={tabId}>
              <Typography variant="h5" gutterBottom sx={{ color: '#003366', fontWeight: 600 }}>
                Overview
              </Typography>
              <Typography paragraph>
                Our Data Strategy Support Services help organizations align mission outcomes with data capabilities. We
                combine governance, architecture, quality, analytics, and change management into a coherent operating
                model that delivers measurable value.
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={4}>
                  <Card elevation={2} sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>Governance & Stewardship</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Define roles, policies, and controls to manage risk, privacy, and quality across the data life cycle.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Card elevation={2} sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>Data Architecture</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Blueprint for integration, storage, and access patterns that enable interoperability and reuse.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Card elevation={2} sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>Analytics & Automation</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Use predictive models, NLP, and workflow automation to accelerate insight-to-outcome.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </TabPanel>

            {/* Data Strategy Plan */}
            <TabPanel value={tabValue} index={1} id={tabId}>
              <Typography variant="h5" gutterBottom sx={{ color: '#003366', fontWeight: 600 }}>
                Data Strategy Plan (Operating Model)
              </Typography>
              <Typography paragraph>
                This plan provides a structured approach for defining, executing, and governing your data strategy.
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, borderLeft: '4px solid #003366' }} elevation={2}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#003366' }}>1. Vision & Value</Typography>
                    <Typography variant="body2">Mission linkage, measurable outcomes, and success metrics.</Typography>
                    <Box sx={{ mt: 1 }}>
                      <Chip label="Outcomes" sx={{ mr: 1, bgcolor: '#003366', color: 'white' }} />
                      <Chip label="KPIs" sx={{ mr: 1 }} />
                      <Chip label="Use Cases" />
                    </Box>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, borderLeft: '4px solid #003366' }} elevation={2}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#003366' }}>2. Governance</Typography>
                    <Typography variant="body2">Policies, stewardship, privacy, security, and standards.</Typography>
                    <Box sx={{ mt: 1 }}>
                      <Chip label="Stewards" sx={{ mr: 1 }} />
                      <Chip label="Policies" sx={{ mr: 1 }} />
                      <Chip label="Controls" />
                    </Box>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, borderLeft: '4px solid #003366' }} elevation={2}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#003366' }}>3. Architecture</Typography>
                    <Typography variant="body2">Integration, data stores, lineage, access patterns, and platforms.</Typography>
                    <Box sx={{ mt: 1 }}>
                      <Chip label="ETL/ELT" sx={{ mr: 1 }} />
                      <Chip label="Lineage" sx={{ mr: 1 }} />
                      <Chip label="Access" />
                    </Box>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, borderLeft: '4px solid #003366' }} elevation={2}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#003366' }}>4. Quality & MDM</Typography>
                    <Typography variant="body2">Validation, profiling, mastering, and remediation workflows.</Typography>
                    <Box sx={{ mt: 1 }}>
                      <Chip label="DQ Rules" sx={{ mr: 1 }} />
                      <Chip label="DQ Metrics" sx={{ mr: 1 }} />
                      <Chip label="Golden Records" />
                    </Box>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, borderLeft: '4px solid #003366' }} elevation={2}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#003366' }}>5. Analytics & AI</Typography>
                    <Typography variant="body2">Forecasting, risk scoring, NLP triage, and decision support.</Typography>
                    <Box sx={{ mt: 1 }}>
                      <Chip label="Predictive" sx={{ mr: 1 }} />
                      <Chip label="NLP" sx={{ mr: 1 }} />
                      <Chip label="Optimization" />
                    </Box>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, borderLeft: '4px solid #003366' }} elevation={2}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#003366' }}>6. Operating Mechanisms</Typography>
                    <Typography variant="body2">Funding model, delivery model, change management, training.</Typography>
                    <Box sx={{ mt: 1 }}>
                      <Chip label="Roadmap" sx={{ mr: 1 }} />
                      <Chip label="RACI" sx={{ mr: 1 }} />
                      <Chip label="Training" />
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            </TabPanel>

            {/* Capstone Project */}
            <TabPanel value={tabValue} index={2} id={tabId}>
              <Typography variant="h5" gutterBottom sx={{ color: '#003366', fontWeight: 600 }}>
                Capstone Project: Apply the Data Strategy
              </Typography>

              <Box sx={{ p: 3, mb: 3, backgroundColor: '#e6f7ff', borderLeft: '4px solid #003366', borderRadius: '4px' }}>
                <Typography variant="subtitle1" sx={{ color: '#003366', fontWeight: 600 }}>Prompt</Typography>
                <Typography>
                  Select a real business problem related to data strategy or data-driven decision-making (ideally from your
                  organization). Apply the frameworks and methodologies to design a solution end-to-end: frame the
                  problem, acquire and prepare data, build models/automations, analyze outcomes, and present
                  recommendations.
                </Typography>
              </Box>

              <Typography variant="h6" gutterBottom sx={{ mt: 2, color: '#003366', fontWeight: 600 }}>
                Expectations
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, mb: 2, borderLeft: '4px solid #003366', backgroundColor: '#f9fbff' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#003366' }}>Step 1 Example: Mission-Critical Use Case Selected</Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  We will pursue the EAD Cycle-Time Reduction initiative (receipt-to-decision), with measurable targets on median/P90 cycle time, bottleneck queue wait, rework, RFEs, and throughput per FTE.
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Button
                    component={MuiLink}
                    href="/templates/project-charter-ead-cycle-time.md"
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="outlined"
                    aria-label="Open pre-filled Project Charter draft for EAD Cycle-Time Reduction"
                  >
                    Open Charter Draft (MD)
                  </Button>
                  <Button
                    component={MuiLink}
                    href="/templates/project-charter-ead-cycle-time.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="outlined"
                    aria-label="Open pre-filled Project Charter PDF for EAD Cycle-Time Reduction"
                  >
                    Open Charter (PDF)
                  </Button>
                  <Button
                    component={Link}
                    to="/templates/kpis"
                    variant="contained"
                    color="primary"
                    aria-label="Open KPI browser to review and select metrics for Option A"
                    sx={{ backgroundColor: '#003366', '&:hover': { backgroundColor: '#00264d' } }}
                  >
                    Open KPI Browser
                  </Button>
                </Box>
              </Paper>
              <Box aria-label="PWS crosswalk table" role="region" sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#003366', mb: 1 }}>
                  PWS Crosswalk: Charter Sections to PWS Clauses
                </Typography>
                <TableContainer component={Paper} aria-label="PWS crosswalk mapping">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700 }}>Charter Section</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>PWS Clause / AQL</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Notes / Evidence</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>Objectives & Scope</TableCell>
                        <TableCell>PWS Section X.Y (Deliverables/Scope)</TableCell>
                        <TableCell>Define in/out scope; align to benefit outcomes and constraints.</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Deliverables & AQLs</TableCell>
                        <TableCell>PWS Section X.Y (AQLs/SLAs)</TableCell>
                        <TableCell>List dashboards, baselines, readouts; cite acceptance criteria.</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Schedule & Cadence</TableCell>
                        <TableCell>PWS Governance / Meeting Cadence</TableCell>
                        <TableCell>Weekly PM/COR; biweekly ops/IT; monthly executive review.</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Governance & Roles</TableCell>
                        <TableCell>PWS Roles/Responsibilities</TableCell>
                        <TableCell>Sponsor, COR/PM, Ops, IT/Data, Privacy/Security stakeholders.</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>508, Privacy, Security</TableCell>
                        <TableCell>PWS Compliance Requirements</TableCell>
                        <TableCell>Section 508, PII safeguards, least privilege, reviews.</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Risks & Mitigations</TableCell>
                        <TableCell>PWS Risk Management</TableCell>
                        <TableCell>Staffing, DQ, privacy, workload variability—mitigation plans.</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
              <Box aria-label="Capstone expectations details" role="region">
                {/* 0. Project Charter (PWS-aligned) */}
                <Accordion disableGutters>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon aria-hidden="true" />}
                    aria-controls="exp-0-content"
                    id="exp-0-header"
                  >
                    <Typography sx={{ fontWeight: 600 }}>0) Create a Project Charter aligned to the USCIS PWS</Typography>
                  </AccordionSummary>
                  <AccordionDetails id="exp-0-content">
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" sx={{ color: '#003366', fontWeight: 600 }}>Standard Charter TOC</Typography>
                        <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                          <Box component="li"><Typography>Project Title</Typography></Box>
                          <Box component="li"><Typography>Purpose and Justification</Typography></Box>
                          <Box component="li"><Typography>Project Objectives</Typography></Box>
                          <Box component="li"><Typography>Background</Typography></Box>
                          <Box component="li"><Typography>Scope / Out of Scope</Typography></Box>
                          <Box component="li"><Typography>Key Deliverables & Success Criteria</Typography></Box>
                          <Box component="li"><Typography>Project Milestones and Schedule</Typography></Box>
                          <Box component="li"><Typography>Stakeholders and Governance</Typography></Box>
                          <Box component="li"><Typography>Key Roles and Responsibilities</Typography></Box>
                          <Box component="li"><Typography>Assumptions and Constraints</Typography></Box>
                          <Box component="li"><Typography>Risks and Mitigation Strategies</Typography></Box>
                          <Box component="li"><Typography>Budget Summary</Typography></Box>
                          <Box component="li"><Typography>Approval Signatures</Typography></Box>
                        </Box>
                        <Typography variant="subtitle2" sx={{ color: '#003366', fontWeight: 600 }}>Source Documents</Typography>
                        <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                          <Box component="li">
                            <MuiLink href="https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/20524012/daecfb31-6987-4736-aad0-6bcf519594ce/USCIS-DSSS-3-PWS.docx" target="_blank" rel="noopener noreferrer" aria-label="Open USCIS Data Strategy Support Services PWS document">USCIS-DSSS-3-PWS.docx</MuiLink>
                          </Box>
                          <Box component="li">
                            <MuiLink href="https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/20524012/09f84aaf-8976-44ac-84c2-6c2363d59809/StrategicPlanFY23.pdf" target="_blank" rel="noopener noreferrer" aria-label="Open USCIS Strategic Plan FY23 PDF">StrategicPlanFY23.pdf</MuiLink>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" sx={{ color: '#003366', fontWeight: 600 }}>PWS-Driven Guidance</Typography>
                        <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                          <Box component="li"><Typography>Title: “USCIS Data Strategy Support Services 3” (aligned to PWS)</Typography></Box>
                          <Box component="li"><Typography>Purpose: Advance USCIS Data Strategy (supporting OCDO/OPQ); emphasize secure, actionable data</Typography></Box>
                          <Box component="li"><Typography>Objectives: Map to four goals—Data Management, Data Culture, Evidence & Evaluation, Process Streamlining</Typography></Box>
                          <Box component="li"><Typography>Scope: Base on PWS tasks (program mgmt, comms, front office support; optional Zero Trust/Data Pillar)</Typography></Box>
                          <Box component="li"><Typography>Deliverables: Copy PWS deliverables/AQLs; include quality/timeliness standards</Typography></Box>
                          <Box component="li"><Typography>Schedule: Use PWS due dates (kick-off, 90-day, monthly/quarterly/annual cadence)</Typography></Box>
                          <Box component="li"><Typography>Governance: COR/PM reviews, weekly cadence, roles per Appendix A</Typography></Box>
                          <Box component="li"><Typography>Constraints: Remote work, Section 508, background checks, Govt-supplied tools; travel not required</Typography></Box>
                          <Box component="li"><Typography>Risks: Staffing, quality, data security, remote logistics; include risk & quality control plans</Typography></Box>
                          <Box component="li"><Typography>Budget: High-level with period of performance (base + option years + closeout)</Typography></Box>
                        </Box>
                        <Typography variant="subtitle2" sx={{ color: '#003366', fontWeight: 600 }}>Crosswalk & Traceability</Typography>
                        <Typography variant="body2">For each Charter section, cite the specific PWS clause/section and relevant Strategic Plan objective to ensure traceable compliance.</Typography>
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
                <Divider />
                {/* 1. Problem & Success Criteria */}
                <Accordion disableGutters>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon aria-hidden="true" />}
                    aria-controls="exp-1-content"
                    id="exp-1-header"
                  >
                    <Typography sx={{ fontWeight: 600 }}>1) Choose a mission-relevant problem and define success criteria</Typography>
                  </AccordionSummary>
                  <AccordionDetails id="exp-1-content">
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" sx={{ color: '#003366', fontWeight: 600 }}>Process Steps</Typography>
                        <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                          <Box component="li"><Typography>Identify a high-impact, mission-critical use case</Typography></Box>
                          <Box component="li"><Typography>Draft problem statement and scope (in/out)</Typography></Box>
                          <Box component="li"><Typography>Define measurable success metrics (time, cost, quality)</Typography></Box>
                          <Box component="li"><Typography>Confirm stakeholders and constraints</Typography></Box>
                        </Box>
                        <Typography variant="subtitle2" sx={{ color: '#003366', fontWeight: 600 }}>Action Items</Typography>
                        <Box component="ul" sx={{ pl: 3 }}>
                          <Box component="li"><Typography>Create project charter with objectives and assumptions</Typography></Box>
                          <Box component="li"><Typography>Establish baseline metrics for comparison</Typography></Box>
                          <Box component="li"><Typography>Secure sponsor and decision cadence</Typography></Box>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" sx={{ color: '#003366', fontWeight: 600 }}>Job Aids & Documentation</Typography>
                        <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                          <Box component="li"><Typography>Problem Statement template</Typography></Box>
                          <Box component="li"><Typography>Success Metrics & KPI catalog</Typography></Box>
                          <Box component="li"><Typography>Stakeholder RACI matrix</Typography></Box>
                        </Box>
                        <Typography variant="subtitle2" sx={{ color: '#003366', fontWeight: 600 }}>Business Value</Typography>
                        <Typography variant="body2" paragraph>Aligns work to mission outcomes and ensures measurable results.</Typography>
                        <Typography variant="subtitle2" sx={{ color: '#003366', fontWeight: 600 }}>Benefits</Typography>
                        <Typography variant="body2">Applicants and benefit recipients experience faster, clearer decisions due to focused problem framing.</Typography>
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
                <Divider />

                {/* 2. Lifecycle & Governance */}
                <Accordion disableGutters>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon aria-hidden="true" />}
                    aria-controls="exp-2-content"
                    id="exp-2-header"
                  >
                    <Typography sx={{ fontWeight: 600 }}>2) Map the data life cycle and governance controls across systems</Typography>
                  </AccordionSummary>
                  <AccordionDetails id="exp-2-content">
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" sx={{ color: '#003366', fontWeight: 600 }}>Process Steps</Typography>
                        <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                          <Box component="li"><Typography>Inventory systems, data stores, and interfaces</Typography></Box>
                          <Box component="li"><Typography>Map CRUD events, retention, and access controls</Typography></Box>
                          <Box component="li"><Typography>Identify privacy, security, and stewardship roles</Typography></Box>
                          <Box component="li"><Typography>Document controls and exceptions</Typography></Box>
                        </Box>
                        <Typography variant="subtitle2" sx={{ color: '#003366', fontWeight: 600 }}>Action Items</Typography>
                        <Box component="ul" sx={{ pl: 3 }}>
                          <Box component="li"><Typography>Create a lifecycle diagram and governance matrix</Typography></Box>
                          <Box component="li"><Typography>Define policy gaps and remediation plan</Typography></Box>
                          <Box component="li"><Typography>Align standards (naming, metadata, classification)</Typography></Box>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" sx={{ color: '#003366', fontWeight: 600 }}>Job Aids & Documentation</Typography>
                        <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                          <Box component="li"><Typography>Data Lifecycle checklist</Typography></Box>
                          <Box component="li"><Typography>Governance Controls catalog</Typography></Box>
                          <Box component="li"><Typography>System Data Maps and Steward directory</Typography></Box>
                        </Box>
                        <Typography variant="subtitle2" sx={{ color: '#003366', fontWeight: 600 }}>Business Value</Typography>
                        <Typography variant="body2" paragraph>Reduces risk and rework; improves compliance and interoperability.</Typography>
                        <Typography variant="subtitle2" sx={{ color: '#003366', fontWeight: 600 }}>Benefits</Typography>
                        <Typography variant="body2">Applicants and recipients benefit from consistent data handling and fewer errors or delays.</Typography>
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
                <Divider />

                {/* 3. Integration & Quality */}
                <Accordion disableGutters>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon aria-hidden="true" />}
                    aria-controls="exp-3-content"
                    id="exp-3-header"
                  >
                    <Typography sx={{ fontWeight: 600 }}>3) Integrate and validate data; document data quality and lineage</Typography>
                  </AccordionSummary>
                  <AccordionDetails id="exp-3-content">
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" sx={{ color: '#003366', fontWeight: 600 }}>Process Steps</Typography>
                        <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                          <Box component="li"><Typography>Design integration approach (ETL/ELT, APIs, streaming)</Typography></Box>
                          <Box component="li"><Typography>Profile and cleanse data; define DQ rules</Typography></Box>
                          <Box component="li"><Typography>Implement lineage capture and data contracts</Typography></Box>
                          <Box component="li"><Typography>Establish DQ monitors and remediation</Typography></Box>
                        </Box>
                        <Typography variant="subtitle2" sx={{ color: '#003366', fontWeight: 600 }}>Action Items</Typography>
                        <Box component="ul" sx={{ pl: 3 }}>
                          <Box component="li"><Typography>Create integration blueprint and mapping specs</Typography></Box>
                          <Box component="li"><Typography>Publish DQ dashboard and alert thresholds</Typography></Box>
                          <Box component="li"><Typography>Document lineage diagrams and stewardship handoffs</Typography></Box>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" sx={{ color: '#003366', fontWeight: 600 }}>Job Aids & Documentation</Typography>
                        <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                          <Box component="li"><Typography>Data Mapping workbook</Typography></Box>
                          <Box component="li"><Typography>DQ Rules catalog and validation scripts</Typography></Box>
                          <Box component="li"><Typography>Lineage register and change logs</Typography></Box>
                        </Box>
                        <Typography variant="subtitle2" sx={{ color: '#003366', fontWeight: 600 }}>Business Value</Typography>
                        <Typography variant="body2" paragraph>Improves trust in analytics and speeds downstream decisions.</Typography>
                        <Typography variant="subtitle2" sx={{ color: '#003366', fontWeight: 600 }}>Benefits</Typography>
                        <Typography variant="body2">Applicants and recipients see fewer requests for re-submission and faster processing due to higher data quality.</Typography>
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
                <Divider />

                {/* 4. Analytics & Automation */}
                <Accordion disableGutters>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon aria-hidden="true" />}
                    aria-controls="exp-4-content"
                    id="exp-4-header"
                  >
                    <Typography sx={{ fontWeight: 600 }}>4) Develop analytics or automation (predictive models, NLP triage, workflow bots)</Typography>
                  </AccordionSummary>
                  <AccordionDetails id="exp-4-content">
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" sx={{ color: '#003366', fontWeight: 600 }}>Process Steps</Typography>
                        <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                          <Box component="li"><Typography>Select techniques aligned to objectives (classification, forecasting, NLP)</Typography></Box>
                          <Box component="li"><Typography>Split data; train, validate, and test with governance</Typography></Box>
                          <Box component="li"><Typography>Assess fairness, performance, and explainability</Typography></Box>
                          <Box component="li"><Typography>Build automation and human-in-the-loop controls</Typography></Box>
                        </Box>
                        <Typography variant="subtitle2" sx={{ color: '#003366', fontWeight: 600 }}>Action Items</Typography>
                        <Box component="ul" sx={{ pl: 3 }}>
                          <Box component="li"><Typography>Model cards and validation reports</Typography></Box>
                          <Box component="li"><Typography>Operational runbooks and exception handling</Typography></Box>
                          <Box component="li"><Typography>Deployment checklist and rollback plan</Typography></Box>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" sx={{ color: '#003366', fontWeight: 600 }}>Job Aids & Documentation</Typography>
                        <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                          <Box component="li"><Typography>Model lifecycle template (from idea to retirement)</Typography></Box>
                          <Box component="li"><Typography>Bias and performance assessment checklist</Typography></Box>
                          <Box component="li"><Typography>Automation workflow diagrams</Typography></Box>
                        </Box>
                        <Typography variant="subtitle2" sx={{ color: '#003366', fontWeight: 600 }}>Business Value</Typography>
                        <Typography variant="body2" paragraph>Increases throughput and consistency; targets resources effectively.</Typography>
                        <Typography variant="subtitle2" sx={{ color: '#003366', fontWeight: 600 }}>Benefits</Typography>
                        <Typography variant="body2">Applicants and recipients benefit from quicker, more consistent outcomes with clear escalation paths.</Typography>
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
                <Divider />

                {/* 5. Measurement & Iteration */}
                <Accordion disableGutters>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon aria-hidden="true" />}
                    aria-controls="exp-5-content"
                    id="exp-5-header"
                  >
                    <Typography sx={{ fontWeight: 600 }}>5) Measure impact (time, cost, error rates, satisfaction) and iterate</Typography>
                  </AccordionSummary>
                  <AccordionDetails id="exp-5-content">
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" sx={{ color: '#003366', fontWeight: 600 }}>Process Steps</Typography>
                        <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                          <Box component="li"><Typography>Define KPIs with baselines and targets</Typography></Box>
                          <Box component="li"><Typography>Instrument pipelines and processes</Typography></Box>
                          <Box component="li"><Typography>Run A/B or pre/post comparisons</Typography></Box>
                          <Box component="li"><Typography>Prioritize improvements and iterate</Typography></Box>
                        </Box>
                        <Typography variant="subtitle2" sx={{ color: '#003366', fontWeight: 600 }}>Action Items</Typography>
                        <Box component="ul" sx={{ pl: 3 }}>
                          <Box component="li"><Typography>Impact dashboard and monthly review</Typography></Box>
                          <Box component="li"><Typography>Issue log and remediation tracking</Typography></Box>
                          <Box component="li"><Typography>Lessons learned and next sprint goals</Typography></Box>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" sx={{ color: '#003366', fontWeight: 600 }}>Job Aids & Documentation</Typography>
                        <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                          <Box component="li"><Typography>KPI dictionary and measurement methods</Typography></Box>
                          <Box component="li"><Typography>Quality and incident taxonomy</Typography></Box>
                          <Box component="li"><Typography>Continuous improvement playbook</Typography></Box>
                        </Box>
                        <Typography variant="subtitle2" sx={{ color: '#003366', fontWeight: 600 }}>Business Value</Typography>
                        <Typography variant="body2" paragraph>Demonstrates ROI and sustains performance gains over time.</Typography>
                        <Typography variant="subtitle2" sx={{ color: '#003366', fontWeight: 600 }}>Benefits</Typography>
                        <Typography variant="body2">Applicants and recipients benefit from ongoing enhancements that reduce delays and errors.</Typography>
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
                <Divider />

                {/* 6. Portfolio-ready Readout */}
                <Accordion disableGutters>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon aria-hidden="true" />}
                    aria-controls="exp-6-content"
                    id="exp-6-header"
                  >
                    <Typography sx={{ fontWeight: 600 }}>6) Deliver a portfolio-ready report and presentation for feedback</Typography>
                  </AccordionSummary>
                  <AccordionDetails id="exp-6-content">
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" sx={{ color: '#003366', fontWeight: 600 }}>Process Steps</Typography>
                        <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                          <Box component="li"><Typography>Curate narrative: problem, approach, results, impact</Typography></Box>
                          <Box component="li"><Typography>Package artifacts: charters, models, dashboards</Typography></Box>
                          <Box component="li"><Typography>Rehearse with stakeholder questions and feedback</Typography></Box>
                        </Box>
                        <Typography variant="subtitle2" sx={{ color: '#003366', fontWeight: 600 }}>Action Items</Typography>
                        <Box component="ul" sx={{ pl: 3 }}>
                          <Box component="li"><Typography>Create executive summary and appendix</Typography></Box>
                          <Box component="li"><Typography>Publish slide deck and technical backup</Typography></Box>
                          <Box component="li"><Typography>Capture feedback and update roadmap</Typography></Box>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" sx={{ color: '#003366', fontWeight: 600 }}>Job Aids & Documentation</Typography>
                        <Box component="ul" sx={{ pl: 3, mb: 2 }}>
                          <Box component="li"><Typography>Portfolio report template (USCIS branding)</Typography></Box>
                          <Box component="li"><Typography>Presentation checklist and review rubric</Typography></Box>
                          <Box component="li"><Typography>Artifact repository structure</Typography></Box>
                        </Box>
                        <Typography variant="subtitle2" sx={{ color: '#003366', fontWeight: 600 }}>Business Value</Typography>
                        <Typography variant="body2" paragraph>Enables reuse, transparency, and informed investment decisions.</Typography>
                        <Typography variant="subtitle2" sx={{ color: '#003366', fontWeight: 600 }}>Benefits</Typography>
                        <Typography variant="body2">Applicants and recipients ultimately benefit from better-funded, scalable solutions proven to work.</Typography>
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              </Box>

              <Typography variant="h6" gutterBottom sx={{ mt: 3, color: '#003366', fontWeight: 600 }}>
                Example Scenario (USCIS Operations)
              </Typography>
              <Paper elevation={2} sx={{ p: 3, borderLeft: '4px solid #003366' }}>
                <Typography paragraph>
                  Improve the applicant experience and reduce costs/processing time for benefit adjudication by
                  establishing unified data access across ELIS, CLAIMS3, CIS Data Mart, and the National Production
                  Dataset (NPD).
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Paper elevation={0} sx={{ p: 2, bgcolor: '#f9f9f9' }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#003366' }}>Frameworks</Typography>
                      <Box component="ul" sx={{ pl: 2 }}>
                        <Box component="li"><Typography>Data Life Cycle mapping across all systems</Typography></Box>
                        <Box component="li"><Typography>Data Governance: privacy, security, stewardship, standards</Typography></Box>
                        <Box component="li"><Typography>Process Optimization: lean analytics and workflow redesign</Typography></Box>
                      </Box>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Paper elevation={0} sx={{ p: 2, bgcolor: '#f9f9f9' }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#003366' }}>Application</Typography>
                      <Box component="ul" sx={{ pl: 2 }}>
                        <Box component="li"><Typography>Standardize intake via a master data hub (e.g., CIS Data Mart)</Typography></Box>
                        <Box component="li"><Typography>Automate data validation and track data quality metrics</Typography></Box>
                        <Box component="li"><Typography>Build predictive models for workload and anomaly detection</Typography></Box>
                        <Box component="li"><Typography>Use NLP to classify inquiries and accelerate resolutions</Typography></Box>
                        <Box component="li"><Typography>Automate document checks and status updates</Typography></Box>
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>
              </Paper>

              {/* Deep Dive USCIS Use Case */}
              <Typography variant="h6" gutterBottom sx={{ mt: 3, color: '#003366', fontWeight: 600 }}>
                Deep Dive: Benefit Adjudication Triage (USCIS)
              </Typography>
              <Paper elevation={2} sx={{ p: 3, borderLeft: '4px solid #003366' }} role="region" aria-label="Deep dive USCIS use case">
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#003366' }}>Phases & Activities</Typography>
                    <Box component="ul" sx={{ pl: 2 }}>
                      <Box component="li"><Typography><strong>Frame:</strong> Charter high-variance queues; define success (TAT, rework, satisfaction)</Typography></Box>
                      <Box component="li"><Typography><strong>Lifecycle Map:</strong> ELIS intake → CIS Mart mastering → NPD analytics → ServiceNow workflows</Typography></Box>
                      <Box component="li"><Typography><strong>Integrate & Validate:</strong> Standardize status codes; DQ rules for completeness/validity; lineage register</Typography></Box>
                      <Box component="li"><Typography><strong>Analytics:</strong> Predict triage priority; NLP for inquiry routing; HITL exceptions</Typography></Box>
                      <Box component="li"><Typography><strong>Measure & Iterate:</strong> Pre/post comparisons; monthly reviews; remediation log</Typography></Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#003366' }}>KPIs & Targets</Typography>
                    <Box component="ul" sx={{ pl: 2 }}>
                      <Box component="li"><Typography>Turnaround Time (TAT): -20% within 2 quarters</Typography></Box>
                      <Box component="li"><Typography>Rework Rate: -30% due to better data quality</Typography></Box>
                      <Box component="li"><Typography>First-Contact Resolution: +15% via NLP triage</Typography></Box>
                      <Box component="li"><Typography>Applicant Satisfaction: +10% via survey (CSAT)</Typography></Box>
                    </Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#003366', mt: 2 }}>Artifacts Produced</Typography>
                    <Box component="ul" sx={{ pl: 2 }}>
                      <Box component="li"><Typography>Governance Matrix & Steward Directory</Typography></Box>
                      <Box component="li"><Typography>DQ Dashboard with alerts (Completeness, Validity)</Typography></Box>
                      <Box component="li"><Typography>Model Card + Bias Assessment</Typography></Box>
                      <Box component="li"><Typography>Operational Runbook & Exception Playbook</Typography></Box>
                    </Box>
                  </Grid>
                </Grid>
                <Box sx={{ mt: 2 }}>
                  <MuiLink href="/templates/presentation-checklist.md" underline="hover" aria-label="Open presentation checklist template">Presentation checklist</MuiLink>
                  <Typography variant="body2" color="text.secondary"> — use with portfolio report to communicate outcomes and next steps.</Typography>
                </Box>
              </Paper>

              <Typography variant="h6" gutterBottom sx={{ mt: 3, color: '#003366', fontWeight: 600 }}>
                Deliverables
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Paper elevation={2} sx={{ p: 2, height: '100%', borderTop: '4px solid #003366' }}>
                    <ChecklistIcon sx={{ color: '#003366', mr: 1 }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#003366' }}>Project Charter</Typography>
                    <Typography variant="body2">Problem statement, stakeholders, success metrics, risks.</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper elevation={2} sx={{ p: 2, height: '100%', borderTop: '4px solid #003366' }}>
                    <TimelineIcon sx={{ color: '#003366', mr: 1 }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#003366' }}>Operating Model Pack</Typography>
                    <Typography variant="body2">Lifecycle map, governance model, architecture blueprint.</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper elevation={2} sx={{ p: 2, height: '100%', borderTop: '4px solid #003366' }}>
                    <FactCheckIcon sx={{ color: '#003366', mr: 1 }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#003366' }}>Results & Readout</Typography>
                    <Typography variant="body2">Model results, impact metrics, recommendations, next steps.</Typography>
                  </Paper>
                </Grid>
              </Grid>
            </TabPanel>

            {/* Resources */}
            <TabPanel value={tabValue} index={3} id={tabId}>
              <Typography variant="h5" gutterBottom sx={{ color: '#003366', fontWeight: 600 }}>
                Resources
              </Typography>
              <Typography paragraph>
                Reference guides and templates to accelerate your project.
              </Typography>
              <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Button
                  component={Link}
                  to="/project-charter"
                  variant="contained"
                  color="primary"
                  startIcon={<FactCheckIcon />}
                  aria-label="Open Project Charter form"
                  sx={{
                    backgroundColor: '#003366',
                    '&:hover': { backgroundColor: '#00264d' },
                    outline: 'none',
                    '&:focus': { outline: '3px solid #003366', outlineOffset: 2 },
                  }}
                >
                  Open Project Charter
                </Button>
                <Button
                  component={Link}
                  to="/templates/kpi-dictionary"
                  variant="contained"
                  color="primary"
                  startIcon={<TrendingUpIcon />}
                  aria-label="Open KPI Dictionary"
                  sx={{
                    backgroundColor: '#003366',
                    '&:hover': { backgroundColor: '#00264d' },
                    outline: 'none',
                    '&:focus': { outline: '3px solid #003366', outlineOffset: 2 },
                  }}
                >
                  Open KPI Dictionary
                </Button>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Paper elevation={2} sx={{ p: 2, borderLeft: '4px solid #003366' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#003366' }}>Templates</Typography>
                    <Box component="ul" sx={{ pl: 2 }}>
                      <Box component="li">
                        <MuiLink href="/templates/project-charter-template.md" underline="hover" aria-label="Download Project Charter template">Project Charter template</MuiLink>
                      </Box>
                      <Box component="li">
                        <MuiLink href="/templates/kpi-dictionary.md" underline="hover" aria-label="Download KPI Dictionary">KPI Dictionary</MuiLink>
                      </Box>
                      <Box component="li">
                        <MuiLink href="/templates/raci-matrix-template.csv" underline="hover" aria-label="Download RACI Matrix template">RACI Matrix (CSV)</MuiLink>
                      </Box>
                      <Box component="li">
                        <MuiLink href="/templates/data-lifecycle-checklist.md" underline="hover" aria-label="Download Data Lifecycle checklist">Data Lifecycle checklist</MuiLink>
                      </Box>
                      <Box component="li">
                        <MuiLink href="/templates/governance-controls-catalog.md" underline="hover" aria-label="Download Governance Controls catalog">Governance Controls catalog</MuiLink>
                      </Box>
                      <Box component="li">
                        <MuiLink href="/templates/data-mapping-workbook.csv" underline="hover" aria-label="Download Data Mapping workbook">Data Mapping workbook (CSV)</MuiLink>
                      </Box>
                      <Box component="li">
                        <MuiLink href="/templates/dq-rules-catalog.csv" underline="hover" aria-label="Download Data Quality rules catalog">DQ Rules catalog (CSV)</MuiLink>
                      </Box>
                      <Box component="li">
                        <MuiLink href="/templates/lineage-register.csv" underline="hover" aria-label="Download Lineage register">Lineage register (CSV)</MuiLink>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper elevation={2} sx={{ p: 2, borderLeft: '4px solid #003366' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#003366' }}>Learning Aids</Typography>
                    <Box component="ul" sx={{ pl: 2 }}>
                      <Box component="li">
                        <MuiLink href="/templates/model-card-template.md" underline="hover" aria-label="Download Model Card template">Model Card template</MuiLink>
                      </Box>
                      <Box component="li">
                        <MuiLink href="/templates/bias-assessment-checklist.md" underline="hover" aria-label="Download Bias and Performance assessment checklist">Bias & Performance assessment checklist</MuiLink>
                      </Box>
                      <Box component="li">
                        <MuiLink href="/templates/automation-workflow-diagram.md" underline="hover" aria-label="Download Automation workflow outline">Automation workflow outline</MuiLink>
                      </Box>
                      <Box component="li">
                        <MuiLink href="/templates/presentation-checklist.md" underline="hover" aria-label="Download Presentation checklist">Presentation checklist</MuiLink>
                      </Box>
                      <Box component="li">
                        <MuiLink href="/templates/portfolio-report-template.md" underline="hover" aria-label="Download Portfolio report template">Portfolio report template</MuiLink>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DataStrategySupport;
