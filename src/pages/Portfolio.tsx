import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  LinearProgress,
  Avatar,
  Tab,
  Tabs,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Alert,
  Tooltip,
  CircularProgress,
  Snackbar,
  IconButton,
} from '@mui/material';
import {
  Business as BusinessIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Dashboard as DashboardIcon,
  TrendingUp as TrendingUpIcon,
  Warning as RiskIcon,
  Lightbulb as InnovationIcon,
  Timeline as TimelineIcon,
  SmartToy as AIIcon,
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Assessment as AssessmentIcon,
  AttachMoney as BudgetIcon,
  Description as DocumentIcon,
  FilterList as FilterListIcon,
  Close as CloseIcon,
  Speed as SpeedIcon,
  AutoAwesome as AutoAwesomeIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import portfolioService, { 
  Portfolio as PortfolioType, 
  KPI, 
  OKR, 
  Risk, 
  Innovation, 
  Project, 
  Milestone 
} from '../services/portfolioService';
import {
  KPIEditDialog,
  OKREditDialog,
  RiskEditDialog,
  InnovationEditDialog,
  ProjectEditDialog,
  CurrentFutureStateEditDialog
} from '../components/portfolio/EditDialogs';
import { ProgramDocumentation } from '../components/portfolio/ProgramDocumentation';

// Using types from portfolioService

// USCIS Portfolio Data with Actual Programs
const portfolioData: PortfolioType[] = [
  {
    id: 'portfolio-data-request',
    name: 'Data Request Management Portfolio',
    description: 'Structured processes for handling data requests, operational data sharing, and resolution of data-related issues across USCIS using specialized tools, policies, and frameworks to support efficient, compliant, and transparent data operations',
    manager: 'Jennifer Martinez',
    totalBudget: '$2.1M',
    status: 'Active',
    currentState: 'SRMT-based request tracking, NIEM data standards, manual routing processes with 5-day average turnaround',
    futureState: 'AI-enhanced SRMT workflows, automated NIEM compliance, real-time interagency data sharing with <24hr turnaround',
    aiReadiness: 68,
    kpis: [
      { name: 'Request Turnaround Time', current: 4.2, target: 1.0, unit: 'days', trend: 'down', status: 'warning' },
      { name: 'NIEM Compliance Rate', current: 89, target: 98, unit: '%', trend: 'up', status: 'warning' },
      { name: 'SRMT Automation Rate', current: 42, target: 85, unit: '%', trend: 'up', status: 'critical' },
      { name: 'Interagency Data Sharing', current: 76, target: 95, unit: '%', trend: 'up', status: 'warning' },
      { name: 'Privacy Compliance Score', current: 94, target: 99, unit: '%', trend: 'stable', status: 'good' }
    ],
    okr: {
      objective: 'Transform USCIS data request management into a fully integrated, AI-enhanced, and compliant operational framework',
      keyResults: [
        { description: 'Achieve <24hr turnaround for routine requests via SRMT automation', current: 4.2, target: 1.0, unit: 'days' },
        { description: 'Reach 98% NIEM compliance across all data sharing agreements', current: 89, target: 98, unit: '%' },
        { description: 'Implement AI-enhanced routing for 85% of requests', current: 42, target: 85, unit: '%' },
        { description: 'Establish real-time data sharing with 95% of key agencies', current: 76, target: 95, unit: '%' }
      ]
    },
    risks: [
      { id: 'dr-r1', title: 'SRMT Legacy Integration', level: 'High', category: 'Technical', mitigation: 'Phased API modernization with CRIS integration', owner: 'Alex Thompson' },
      { id: 'dr-r2', title: 'NIEM Standard Compliance', level: 'Medium', category: 'Compliance', mitigation: 'Automated NIEM validation tools', owner: 'Maria Santos' },
      { id: 'dr-r3', title: 'Privacy Impact Assessment Delays', level: 'High', category: 'Compliance', mitigation: 'Streamlined PIA process with templates', owner: 'David Chen' },
      { id: 'dr-r4', title: 'Interagency Data Sharing Security', level: 'Critical', category: 'Security', mitigation: 'Enhanced encryption and access controls', owner: 'Sarah Johnson' },
      { id: 'dr-r5', title: 'CHAMPS Integration Complexity', level: 'Medium', category: 'Technical', mitigation: 'Dedicated integration team', owner: 'Michael Brown' }
    ],
    innovations: [
      { id: 'dr-i1', title: 'AI-Enhanced SRMT Routing', type: 'AI/ML', impact: 'High', aiFirst: true, description: 'ML model auto-routes requests to appropriate service centers using historical patterns' },
      { id: 'dr-i2', title: 'Predictive Request Volume Analytics', type: 'Analytics', impact: 'Medium', aiFirst: true, description: 'Forecast request volumes for Operation Allies Welcome-type initiatives' },
      { id: 'dr-i3', title: 'Automated NIEM Compliance Validation', type: 'Automation', impact: 'High', aiFirst: true, description: 'Real-time validation of data sharing against NIEM standards' },
      { id: 'dr-i4', title: 'Intelligent Expedite Request Processing', type: 'AI/ML', impact: 'High', aiFirst: true, description: 'AI identifies humanitarian and government error cases for automatic expediting' },
      { id: 'dr-i5', title: 'Cross-System Data Reconciliation', type: 'Automation', impact: 'Medium', aiFirst: true, description: 'Automated data consistency checks across SRMT, CRIS, and CHAMPS' }
    ],
    milestones: [
      {
        id: 'dr-m1',
        title: 'SRMT AI Enhancement Deployment',
        description: 'Deploy AI-enhanced routing capabilities within Service Request Management Tool for automatic request categorization and service center routing',
        dueDate: '2025-06-15',
        status: 'In Progress',
        priority: 'Critical',
        owner: 'Alex Thompson',
        portfolioId: 'portfolio-data-request',
        dependencies: ['dg-m2'],
        deliverables: ['SRMT AI Module', 'Routing Algorithm', 'Service Center Integration', 'Performance Metrics'],
        riskLevel: 'Medium'
      },
      {
        id: 'dr-m2',
        title: 'NIEM Compliance Automation',
        description: 'Implement automated National Information Exchange Model validation for all data sharing agreements and interagency operations',
        dueDate: '2025-08-30',
        status: 'Not Started',
        priority: 'High',
        owner: 'Maria Santos',
        portfolioId: 'portfolio-data-request',
        dependencies: ['dr-m1'],
        deliverables: ['NIEM Validation Engine', 'Compliance Dashboard', 'Automated Reporting', 'Training Materials'],
        riskLevel: 'High'
      },
      {
        id: 'dr-m3',
        title: 'CRIS-CHAMPS Integration Platform',
        description: 'Integrate Customer Relationship Interface System with Correspondence Handling and Management Planning System for unified workflow management',
        dueDate: '2025-07-15',
        status: 'In Progress',
        priority: 'High',
        owner: 'David Chen',
        portfolioId: 'portfolio-data-request',
        deliverables: ['Integration API', 'Unified Dashboard', 'Workflow Automation', 'Performance Analytics'],
        riskLevel: 'Medium'
      },
      {
        id: 'dr-m4',
        title: 'Privacy Impact Assessment Automation',
        description: 'Streamline PIA processes with automated templates and compliance checking for faster data sharing approvals',
        dueDate: '2025-09-30',
        status: 'Not Started',
        priority: 'Medium',
        owner: 'Sarah Johnson',
        portfolioId: 'portfolio-data-request',
        deliverables: ['PIA Template Engine', 'Compliance Checker', 'SORN Integration', 'Approval Workflow'],
        riskLevel: 'Low'
      },
      {
        id: 'dr-m5',
        title: 'Expedite Request Intelligence System',
        description: 'Deploy AI system to automatically identify and process humanitarian and government error cases for expedited handling',
        dueDate: '2025-10-15',
        status: 'Not Started',
        priority: 'High',
        owner: 'Michael Brown',
        portfolioId: 'portfolio-data-request',
        deliverables: ['AI Classification Model', 'Expedite Workflow', 'Case Tracking System', 'Reporting Dashboard'],
        riskLevel: 'Medium'
      }
    ],
    projects: [
      {
        id: 'proj-dr-1',
        name: 'Service Request Management Tool (SRMT) Enhancement Program',
        status: 'In Progress',
        progress: 75,
        manager: 'Alex Thompson',
        startDate: '2025-01-15',
        endDate: '2025-08-30',
        budget: '$450K',
        description: 'Enhancing SRMT platform for logging, tracking, and routing unresolved requests to appropriate service centers with AI-powered workflow optimization and self-service capabilities'
      },
      {
        id: 'proj-dr-2',
        name: 'NIEM-Compliant Operational Data Sharing Program',
        status: 'In Progress',
        progress: 85,
        manager: 'Maria Santos',
        startDate: '2024-11-01',
        endDate: '2025-06-30',
        budget: '$520K',
        description: 'Implementing National Information Exchange Model standards for credible, dependable, and secure data sharing across DHS and external agencies, including Operation Allies Welcome-type initiatives'
      },
      {
        id: 'proj-dr-3',
        name: 'CRIS-CHAMPS Integration & Issue Resolution Program',
        status: 'In Progress',
        progress: 60,
        manager: 'David Chen',
        startDate: '2025-02-01',
        endDate: '2025-09-15',
        budget: '$380K',
        description: 'Integrating Customer Relationship Interface System with Correspondence Handling and Management Planning System for unified issue resolution, case corrections, and expedite request processing'
      },
      {
        id: 'proj-dr-4',
        name: 'Privacy Impact Assessment & Compliance Automation',
        status: 'Planning',
        progress: 25,
        manager: 'Sarah Johnson',
        startDate: '2025-03-01',
        endDate: '2025-11-30',
        budget: '$290K',
        description: 'Automating Privacy Impact Assessments and Systems of Records Notices publication processes to ensure compliance with privacy laws and data governance best practices'
      },
      {
        id: 'proj-dr-5',
        name: 'Expedite Request Intelligence & Humanitarian Processing',
        status: 'Planning',
        progress: 15,
        manager: 'Michael Brown',
        startDate: '2025-04-01',
        endDate: '2025-12-15',
        budget: '$340K',
        description: 'Implementing AI-driven identification and processing of expedite requests for humanitarian needs and government errors, with automated prioritization and tracking capabilities'
      }
    ]
  },
  {
    id: 'portfolio-data-governance',
    name: 'Data Governance Portfolio',
    description: 'Establishing data inventory, standards, quality frameworks, and zero trust data security across the enterprise',
    manager: 'Dr. Michael Roberts',
    totalBudget: '$2.8M',
    status: 'Active',
    currentState: 'Fragmented data standards, manual quality checks, limited governance oversight',
    futureState: 'Unified data governance framework, automated quality monitoring, zero trust architecture',
    aiReadiness: 72,
    kpis: [
      { name: 'Data Quality Score', current: 78, target: 95, unit: '%', trend: 'up', status: 'warning' },
      { name: 'Policy Compliance', current: 85, target: 98, unit: '%', trend: 'up', status: 'warning' },
      { name: 'Data Inventory Coverage', current: 65, target: 90, unit: '%', trend: 'up', status: 'critical' },
      { name: 'Governance Maturity', current: 3.2, target: 4.5, unit: '/5', trend: 'up', status: 'warning' }
    ],
    okr: {
      objective: 'Establish enterprise-wide data governance with zero trust security framework',
      keyResults: [
        { description: 'Achieve 95% data quality across all critical datasets', current: 78, target: 95, unit: '%' },
        { description: 'Complete 90% data inventory coverage', current: 65, target: 90, unit: '%' },
        { description: 'Implement zero trust for 100% sensitive data', current: 25, target: 100, unit: '%' }
      ]
    },
    risks: [
      { id: 'dg-r1', title: 'Data Classification Complexity', level: 'High', category: 'Technical', mitigation: 'AI-powered classification tools', owner: 'Amanda Foster' },
      { id: 'dg-r2', title: 'Regulatory Compliance Gaps', level: 'Critical', category: 'Compliance', mitigation: 'Automated compliance monitoring', owner: 'Christopher Moore' },
      { id: 'dg-r3', title: 'Stakeholder Buy-in', level: 'Medium', category: 'Organizational', mitigation: 'Executive sponsorship program', owner: 'Rachel Green' },
      { id: 'dg-r4', title: 'Zero Trust Implementation', level: 'High', category: 'Technical', mitigation: 'Phased rollout approach', owner: 'Kevin Brown' }
    ],
    innovations: [
      { id: 'dg-i1', title: 'AI Data Quality Monitoring', type: 'AI/ML', impact: 'High', aiFirst: true, description: 'Real-time AI-powered data quality assessment and alerting' },
      { id: 'dg-i2', title: 'Automated Policy Enforcement', type: 'Automation', impact: 'High', aiFirst: true, description: 'Policy violations automatically detected and remediated' },
      { id: 'dg-i3', title: 'Smart Data Classification', type: 'AI/ML', impact: 'Medium', aiFirst: true, description: 'ML-based automatic data sensitivity classification' },
      { id: 'dg-i4', title: 'Predictive Compliance Analytics', type: 'Analytics', impact: 'Medium', aiFirst: true, description: 'Forecast compliance risks before they occur' }
    ],
    projects: [
      {
        id: 'proj-dg-1',
        name: 'Data Inventory Program',
        status: 'In Progress',
        progress: 70,
        manager: 'Amanda Foster',
        startDate: '2025-01-01',
        endDate: '2025-09-30',
        budget: '$480K',
        description: 'Comprehensive cataloging and inventory of all USCIS data assets and sources'
      },
      {
        id: 'proj-dg-2',
        name: 'Data Standards Program',
        status: 'In Progress',
        progress: 65,
        manager: 'Christopher Moore',
        startDate: '2024-12-01',
        endDate: '2025-08-31',
        budget: '$420K',
        description: 'Establishing enterprise-wide data standards, definitions, and governance policies'
      },
      {
        id: 'proj-dg-3',
        name: 'Quality by Design Program',
        status: 'In Progress',
        progress: 55,
        manager: 'Rachel Green',
        startDate: '2025-02-15',
        endDate: '2025-11-30',
        budget: '$520K',
        description: 'Implementing quality-first approach to data design, collection, and management'
      },
      {
        id: 'proj-dg-4',
        name: 'Zero Trust Data Pillar Program',
        status: 'Planning',
        progress: 25,
        manager: 'Kevin Brown',
        startDate: '2025-04-01',
        endDate: '2025-12-31',
        budget: '$650K',
        description: 'Implementing zero trust security framework for data access and protection'
      },
      {
        id: 'proj-dg-5',
        name: 'SMRT Program',
        status: 'In Progress',
        progress: 78,
        manager: 'Sarah Johnson',
        startDate: '2024-10-01',
        endDate: '2025-06-30',
        budget: '$890K',
        description: 'Strategic Management and Reporting Technology for enhanced data-driven decision making'
      },
      {
        id: 'proj-dg-6',
        name: 'NEIMS Program',
        status: 'In Progress',
        progress: 65,
        manager: 'David Chen',
        startDate: '2024-11-15',
        endDate: '2025-08-15',
        budget: '$750K',
        description: 'National Enterprise Information Management System for integrated data operations'
      }
    ]
  },
  {
    id: 'portfolio-data-engineering',
    name: 'Data Enterprise Portfolio',
    description: 'Engineering and technical programs supporting data infrastructure, analytics, and specialized data services',
    manager: 'Patricia Miller',
    totalBudget: '$4.2M',
    status: 'Active',
    currentState: 'Legacy systems, manual data pipelines, fragmented analytics infrastructure',
    futureState: 'Modern cloud-native architecture, automated pipelines, unified analytics platform',
    aiReadiness: 85,
    kpis: [
      { name: 'System Uptime', current: 99.2, target: 99.9, unit: '%', trend: 'up', status: 'warning' },
      { name: 'Data Pipeline Efficiency', current: 82, target: 95, unit: '%', trend: 'up', status: 'warning' },
      { name: 'Processing Speed', current: 4.8, target: 2.0, unit: 'hrs', trend: 'down', status: 'critical' },
      { name: 'Infrastructure Cost Optimization', current: 68, target: 85, unit: '%', trend: 'up', status: 'warning' }
    ],
    okr: {
      objective: 'Build modern, scalable data infrastructure with AI-first automation',
      keyResults: [
        { description: 'Achieve 99.9% system uptime across all platforms', current: 99.2, target: 99.9, unit: '%' },
        { description: 'Reduce data processing time to <2 hours', current: 4.8, target: 2.0, unit: 'hrs' },
        { description: 'Automate 95% of data pipeline operations', current: 82, target: 95, unit: '%' }
      ]
    },
    risks: [
      { id: 'de-r1', title: 'Cloud Migration Complexity', level: 'High', category: 'Technical', mitigation: 'Phased migration with rollback plans', owner: 'Steven Clark' },
      { id: 'de-r2', title: 'Legacy System Dependencies', level: 'Medium', category: 'Technical', mitigation: 'API abstraction layer development', owner: 'Michelle Lee' },
      { id: 'de-r3', title: 'Skills Gap in Modern Technologies', level: 'Medium', category: 'Organizational', mitigation: 'Comprehensive training program', owner: 'Angela White' },
      { id: 'de-r4', title: 'Data Security During Migration', level: 'High', category: 'Compliance', mitigation: 'Enhanced encryption and monitoring', owner: 'Daniel Harris' }
    ],
    innovations: [
      { id: 'de-i1', title: 'Auto-Scaling Data Pipelines', type: 'Automation', impact: 'High', aiFirst: true, description: 'AI-driven automatic scaling based on data volume and processing needs' },
      { id: 'de-i2', title: 'Predictive Infrastructure Monitoring', type: 'AI/ML', impact: 'High', aiFirst: true, description: 'ML models predict and prevent infrastructure failures' },
      { id: 'de-i3', title: 'Intelligent Data Routing', type: 'AI/ML', impact: 'Medium', aiFirst: true, description: 'AI optimizes data flow paths for performance and cost' },
      { id: 'de-i4', title: 'Graph Analytics Engine', type: 'Analytics', impact: 'High', aiFirst: false, description: 'Advanced relationship analysis for fraud detection and network insights' },
      { id: 'de-i5', title: 'Real-time Stream Processing', type: 'Process', impact: 'Medium', aiFirst: true, description: 'AI-enhanced real-time data processing and alerting' }
    ],
    milestones: [
      {
        id: 'de-m1',
        title: 'Cloud Infrastructure Migration Phase 1',
        description: 'Migrate core data pipelines and ETL processes to cloud-native architecture with enhanced scalability and performance',
        dueDate: '2025-06-30',
        status: 'In Progress',
        priority: 'Critical',
        owner: 'Steven Clark',
        portfolioId: 'portfolio-data-engineering',
        deliverables: ['Cloud Infrastructure Setup', 'Data Pipeline Migration', 'Performance Testing', 'Rollback Procedures'],
        riskLevel: 'High'
      },
      {
        id: 'de-m2',
        title: 'AI-Powered Pipeline Automation',
        description: 'Deploy machine learning models for automatic pipeline scaling, optimization, and failure prediction',
        dueDate: '2025-08-15',
        status: 'Not Started',
        priority: 'High',
        owner: 'Michelle Lee',
        portfolioId: 'portfolio-data-engineering',
        dependencies: ['de-m1'],
        deliverables: ['ML Scaling Models', 'Predictive Monitoring', 'Auto-Remediation System', 'Performance Dashboard'],
        riskLevel: 'Medium'
      },
      {
        id: 'de-m3',
        title: 'Graph Analytics Platform Launch',
        description: 'Launch enterprise graph database services for advanced relationship and network analysis capabilities',
        dueDate: '2025-10-30',
        status: 'In Progress',
        priority: 'High',
        owner: 'Daniel Harris',
        portfolioId: 'portfolio-data-engineering',
        deliverables: ['Graph Database Deployment', 'Query API', 'Analytics Tools', 'User Documentation'],
        riskLevel: 'Medium'
      },
      {
        id: 'de-m4',
        title: 'Real-time Stream Processing Engine',
        description: 'Implement AI-enhanced real-time data processing capabilities for immediate insights and alerting',
        dueDate: '2025-09-15',
        status: 'Not Started',
        priority: 'Medium',
        owner: 'Laura Thompson',
        portfolioId: 'portfolio-data-engineering',
        dependencies: ['de-m1'],
        deliverables: ['Stream Processing Engine', 'Real-time Analytics', 'Alert System', 'Integration APIs'],
        riskLevel: 'Low'
      },
      {
        id: 'de-m5',
        title: 'Unified Analytics Platform',
        description: 'Consolidate fragmented analytics tools into unified enterprise analytics platform with self-service capabilities',
        dueDate: '2025-12-31',
        status: 'Not Started',
        priority: 'High',
        owner: 'Robert Kim',
        portfolioId: 'portfolio-data-engineering',
        dependencies: ['de-m2', 'de-m3'],
        deliverables: ['Unified Platform', 'Self-Service Portal', 'Advanced Visualizations', 'Training Program'],
        riskLevel: 'Medium'
      }
    ],
    projects: [
      {
        id: 'proj-de-1',
        name: 'Data Engineering and Curation Program',
        status: 'In Progress',
        progress: 80,
        manager: 'Steven Clark',
        startDate: '2024-10-01',
        endDate: '2025-07-31',
        budget: '$680K',
        description: 'Building and maintaining data pipelines, ETL processes, and data curation workflows'
      },
      {
        id: 'proj-de-2',
        name: 'Dashboard Support Program',
        status: 'In Progress',
        progress: 75,
        manager: 'Michelle Lee',
        startDate: '2025-01-01',
        endDate: '2025-08-15',
        budget: '$420K',
        description: 'Supporting development and maintenance of executive and operational dashboards'
      },
      {
        id: 'proj-de-3',
        name: 'E22 Program',
        status: 'In Progress',
        progress: 90,
        manager: 'Angela White',
        startDate: '2024-09-01',
        endDate: '2025-05-31',
        budget: '$520K',
        description: 'E22 classification system development and implementation'
      },
      {
        id: 'proj-de-4',
        name: 'Graph Data Services (GDS)',
        status: 'In Progress',
        progress: 65,
        manager: 'Daniel Harris',
        startDate: '2025-01-15',
        endDate: '2025-10-30',
        budget: '$580K',
        description: 'Advanced graph database services for relationship and network analysis'
      },
      {
        id: 'proj-de-5',
        name: 'National Production Dataset',
        status: 'In Progress',
        progress: 85,
        manager: 'Laura Thompson',
        startDate: '2024-11-01',
        endDate: '2025-06-30',
        budget: '$750K',
        description: 'Maintaining and enhancing the national production dataset infrastructure'
      },
      {
        id: 'proj-de-6',
        name: 'Streamlined Case Processing (SCP) Program',
        status: 'In Progress',
        progress: 70,
        manager: 'Robert Kim',
        startDate: '2025-02-01',
        endDate: '2025-11-15',
        budget: '$620K',
        description: 'Optimizing case processing workflows through data-driven improvements'
      },
      {
        id: 'proj-de-7',
        name: 'Relationship Network Analytics Product Delivery',
        status: 'Planning',
        progress: 30,
        manager: 'Sarah Williams',
        startDate: '2025-03-15',
        endDate: '2025-12-31',
        budget: '$480K',
        description: 'Delivering advanced relationship and network analytics capabilities'
      },
      {
        id: 'proj-de-8',
        name: 'DBIS Product Owner',
        status: 'In Progress',
        progress: 60,
        manager: 'James Wilson',
        startDate: '2025-01-01',
        endDate: '2025-09-30',
        budget: '$380K',
        description: 'Database and Business Intelligence Systems product ownership and management'
      }
    ]
  },
  {
    id: 'portfolio-data-product',
    name: 'Data Product Management',
    description: 'Managing contracts, change processes, communications, and project management office operations',
    manager: 'Thomas Anderson',
    totalBudget: '$1.9M',
    status: 'Active',
    currentState: 'Manual contract processes, reactive change management, siloed communications',
    futureState: 'Automated contract lifecycle, proactive change orchestration, integrated communications hub',
    aiReadiness: 58,
    kpis: [
      { name: 'Contract Processing Time', current: 12, target: 5, unit: 'days', trend: 'down', status: 'critical' },
      { name: 'Change Success Rate', current: 78, target: 92, unit: '%', trend: 'up', status: 'warning' },
      { name: 'Stakeholder Engagement', current: 3.6, target: 4.2, unit: '/5', trend: 'up', status: 'warning' },
      { name: 'PMO Efficiency', current: 85, target: 95, unit: '%', trend: 'up', status: 'good' }
    ],
    okr: {
      objective: 'Optimize organizational effectiveness through streamlined processes and communications',
      keyResults: [
        { description: 'Reduce contract processing time to <5 days', current: 12, target: 5, unit: 'days' },
        { description: 'Achieve 92% change management success rate', current: 78, target: 92, unit: '%' },
        { description: 'Reach 4.2/5 stakeholder engagement score', current: 3.6, target: 4.2, unit: '/5' }
      ]
    },
    risks: [
      { id: 'dp-r1', title: 'Vendor Dependency', level: 'Medium', category: 'Financial', mitigation: 'Diversified vendor portfolio strategy', owner: 'Maria Garcia' },
      { id: 'dp-r2', title: 'Change Resistance', level: 'High', category: 'Organizational', mitigation: 'Enhanced stakeholder engagement program', owner: 'Ryan Martinez' },
      { id: 'dp-r3', title: 'Communication Gaps', level: 'Medium', category: 'Organizational', mitigation: 'Integrated communication platform', owner: 'Jessica Park' }
    ],
    innovations: [
      { id: 'dp-i1', title: 'AI Contract Analysis', type: 'AI/ML', impact: 'High', aiFirst: true, description: 'AI-powered contract review and risk assessment automation' },
      { id: 'dp-i2', title: 'Predictive Change Impact', type: 'Analytics', impact: 'Medium', aiFirst: true, description: 'ML models predict change impacts and success probability' },
      { id: 'dp-i3', title: 'Automated Stakeholder Notifications', type: 'Automation', impact: 'Medium', aiFirst: true, description: 'Smart notification system based on stakeholder preferences and priorities' }
    ],
    projects: [
      {
        id: 'proj-dp-1',
        name: 'Contract Management',
        status: 'In Progress',
        progress: 75,
        manager: 'Maria Garcia',
        startDate: '2024-12-01',
        endDate: '2025-08-31',
        budget: '$520K',
        description: 'Managing data-related contracts, vendor relationships, and procurement processes'
      },
      {
        id: 'proj-dp-2',
        name: 'Change Management & Communications',
        status: 'In Progress',
        progress: 80,
        manager: 'Ryan Martinez',
        startDate: '2025-01-15',
        endDate: '2025-09-30',
        budget: '$420K',
        description: 'Managing organizational change and communications for data initiatives'
      },
      {
        id: 'proj-dp-3',
        name: 'Project Management Office',
        status: 'In Progress',
        progress: 85,
        manager: 'Jessica Park',
        startDate: '2024-11-01',
        endDate: '2025-07-31',
        budget: '$480K',
        description: 'Centralized project management office supporting all data portfolio initiatives'
      }
    ]
  }
];

const Portfolio: React.FC = () => {
  // State management
  const [selectedTab, setSelectedTab] = useState(0);
  const [viewMode, setViewMode] = useState<'overview' | 'executive' | 'programs' | 'roadmap' | 'analytics'>('executive');
  const [portfolios, setPortfolios] = useState<PortfolioType[]>(portfolioData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  // Edit dialog states
  const [kpiDialogOpen, setKpiDialogOpen] = useState(false);
  const [okrDialogOpen, setOkrDialogOpen] = useState(false);
  const [riskDialogOpen, setRiskDialogOpen] = useState(false);
  const [innovationDialogOpen, setInnovationDialogOpen] = useState(false);
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [currentFutureStateDialogOpen, setCurrentFutureStateDialogOpen] = useState(false);
  const [documentationDialogOpen, setDocumentationDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | undefined>();
  const [selectedDocumentationProject, setSelectedDocumentationProject] = useState<Project | null>(null);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'success';
      case 'In Progress': return 'primary';
      case 'Planning': return 'warning';
      case 'On Hold': return 'error';
      case 'Active': return 'success';
      default: return 'default';
    }
  };

  // Load portfolios from backend
  useEffect(() => {
    loadPortfolios();
  }, []);

  const loadPortfolios = async () => {
    try {
      setLoading(true);
      const data = await portfolioService.getPortfolios();
      if (data.length > 0) {
        setPortfolios(data);
      } else {
        // Use mock data if no portfolios in backend
        setPortfolios(portfolioData);
      }
      setError(null);
    } catch (err) {
      console.error('Failed to load portfolios:', err);
      setError('Failed to load portfolios. Using mock data.');
      setPortfolios(portfolioData);
    } finally {
      setLoading(false);
    }
  };

  const currentPortfolio = portfolios[selectedTab];

  // Show loading state only during initial load
  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Container>
    );
  }

  // Show error if no portfolios available
  if (!currentPortfolio) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert severity="error">
          No portfolio data available. Please check your connection or try again later.
        </Alert>
      </Container>
    );
  }

  // Show success message
  const showSuccess = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  // Show error message
  const showError = (message: string) => {
    setError(message);
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  // Edit handlers
  const handleKPIEdit = () => {
    setKpiDialogOpen(true);
  };

  const handleKPISave = async (kpis: KPI[]) => {
    try {
      setLoading(true);
      await portfolioService.updatePortfolioKPIs(currentPortfolio.id, kpis);
      const updatedPortfolios = [...portfolios];
      updatedPortfolios[selectedTab] = { ...currentPortfolio, kpis };
      setPortfolios(updatedPortfolios);
      showSuccess('KPIs updated successfully');
    } catch (err) {
      showError('Failed to update KPIs');
    } finally {
      setLoading(false);
    }
  };

  const handleOKREdit = () => {
    setOkrDialogOpen(true);
  };

  const handleOKRSave = async (okr: OKR) => {
    try {
      setLoading(true);
      await portfolioService.updatePortfolioOKR(currentPortfolio.id, okr);
      const updatedPortfolios = [...portfolios];
      updatedPortfolios[selectedTab] = { ...currentPortfolio, okr };
      setPortfolios(updatedPortfolios);
      showSuccess('OKR updated successfully');
    } catch (err) {
      showError('Failed to update OKR');
    } finally {
      setLoading(false);
    }
  };

  const handleCurrentFutureStateEdit = () => {
    setCurrentFutureStateDialogOpen(true);
  };

  const handleCurrentFutureStateSave = async (currentState: string, futureState: string) => {
    try {
      setLoading(true);
      const updatedPortfolio = { ...currentPortfolio, currentState, futureState };
      await portfolioService.updatePortfolio(currentPortfolio.id, updatedPortfolio);
      const updatedPortfolios = [...portfolios];
      updatedPortfolios[selectedTab] = updatedPortfolio;
      setPortfolios(updatedPortfolios);
      showSuccess('Current vs Future State updated successfully');
    } catch (err) {
      showError('Failed to update Current vs Future State');
    } finally {
      setLoading(false);
    }
  };

  const handleRiskEdit = () => {
    setRiskDialogOpen(true);
  };

  const handleRiskSave = async (risks: Risk[]) => {
    try {
      setLoading(true);
      await portfolioService.updatePortfolioRisks(currentPortfolio.id, risks);
      const updatedPortfolios = [...portfolios];
      updatedPortfolios[selectedTab] = { ...currentPortfolio, risks };
      setPortfolios(updatedPortfolios);
      showSuccess('Risks updated successfully');
    } catch (err) {
      showError('Failed to update risks');
    } finally {
      setLoading(false);
    }
  };

  const handleInnovationEdit = () => {
    setInnovationDialogOpen(true);
  };

  const handleInnovationSave = async (innovations: Innovation[]) => {
    try {
      setLoading(true);
      await portfolioService.updatePortfolioInnovations(currentPortfolio.id, innovations);
      const updatedPortfolios = [...portfolios];
      updatedPortfolios[selectedTab] = { ...currentPortfolio, innovations };
      setPortfolios(updatedPortfolios);
      showSuccess('Innovations updated successfully');
    } catch (err) {
      showError('Failed to update innovations');
    } finally {
      setLoading(false);
    }
  };

  const handleProjectEdit = (project?: Project) => {
    setSelectedProject(project);
    setProjectDialogOpen(true);
  };

  const handleDocumentationView = (project: Project) => {
    setSelectedDocumentationProject(project);
    setDocumentationDialogOpen(true);
  };

  const handleProjectSave = async (project: Project) => {
    try {
      setLoading(true);
      if (selectedProject) {
        // Update existing project
        await portfolioService.updatePortfolioProject(currentPortfolio.id, project.id, project);
      } else {
        // Add new project
        await portfolioService.addPortfolioProject(currentPortfolio.id, project);
      }
      
      // Reload portfolio data
      const updatedPortfolio = await portfolioService.getPortfolio(currentPortfolio.id);
      const updatedPortfolios = [...portfolios];
      updatedPortfolios[selectedTab] = updatedPortfolio;
      setPortfolios(updatedPortfolios);
      
      showSuccess(selectedProject ? 'Project updated successfully' : 'Project added successfully');
    } catch (err) {
      showError(selectedProject ? 'Failed to update project' : 'Failed to add project');
    } finally {
      setLoading(false);
    }
  };

  // Helper functions for KPI status
  const getKPIStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'success';
      case 'warning': return 'warning';
      case 'critical': return 'error';
      default: return 'default';
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'Low': return 'success';
      case 'Medium': return 'warning';
      case 'High': return 'error';
      case 'Critical': return 'error';
      default: return 'default';
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, color: '#003366', mb: 2 }}>
          USCIS Portfolio Management
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Executive Dashboard - Data-Driven Decision Making with AI-First Strategy
        </Typography>
        
        {/* View Mode Selector */}
        <Box sx={{ mt: 2 }}>
          <Button
            variant={viewMode === 'executive' ? 'contained' : 'outlined'}
            onClick={() => setViewMode('executive')}
            startIcon={<DashboardIcon />}
            sx={{ mr: 1, color: viewMode === 'executive' ? 'white' : '#003366', bgcolor: viewMode === 'executive' ? '#003366' : 'transparent' }}
          >
            Executive View
          </Button>
          <Button
            variant={viewMode === 'overview' ? 'contained' : 'outlined'}
            onClick={() => setViewMode('overview')}
            startIcon={<AssessmentIcon />}
            sx={{ mr: 1, color: viewMode === 'overview' ? 'white' : '#003366', bgcolor: viewMode === 'overview' ? '#003366' : 'transparent' }}
          >
            Portfolio Overview
          </Button>
          <Button
            variant={viewMode === 'programs' ? 'contained' : 'outlined'}
            onClick={() => setViewMode('programs')}
            startIcon={<BusinessIcon />}
            sx={{ mr: 1, color: viewMode === 'programs' ? 'white' : '#003366', bgcolor: viewMode === 'programs' ? '#003366' : 'transparent' }}
          >
            Programs Detail
          </Button>
          <Button
            variant={viewMode === 'roadmap' ? 'contained' : 'outlined'}
            onClick={() => setViewMode('roadmap')}
            startIcon={<TimelineIcon />}
            sx={{ mr: 1, color: viewMode === 'roadmap' ? 'white' : '#003366', bgcolor: viewMode === 'roadmap' ? '#003366' : 'transparent' }}
          >
            Roadmap Timeline
          </Button>
          <Button
            variant={viewMode === 'analytics' ? 'contained' : 'outlined'}
            onClick={() => setViewMode('analytics')}
            startIcon={<TrendingUpIcon />}
            sx={{ color: viewMode === 'analytics' ? 'white' : '#003366', bgcolor: viewMode === 'analytics' ? '#003366' : 'transparent' }}
          >
            Cross-Portfolio Analytics
          </Button>
        </Box>
      </Box>

      {/* Portfolio Tabs */}
      <Paper sx={{ mb: 4 }}>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': {
              color: '#003366',
              '&.Mui-selected': {
                color: '#003366',
                fontWeight: 600
              }
            }
          }}
        >
          {portfolioData.map((portfolio, index) => (
            <Tab
              key={portfolio.id}
              label={portfolio.name}
              icon={<BusinessIcon />}
              iconPosition="start"
            />
          ))}
        </Tabs>
      </Paper>

      {/* Executive Dashboard View */}
      {viewMode === 'executive' && currentPortfolio.kpis && (
        <Box sx={{ mb: 4 }}>
          {/* OKR Section */}
          <Card 
            elevation={3} 
            sx={{ 
              mb: 3,
              cursor: 'pointer',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                boxShadow: 6,
                backgroundColor: '#f8f9fa'
              },
              '&:focus': {
                outline: '2px solid #003366',
                outlineOffset: '2px'
              }
            }}
            onClick={handleOKREdit}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleOKREdit();
              }
            }}
            tabIndex={0}
            role="button"
            aria-label="Edit OKR"
          >
            <CardContent>
              <Typography variant="h6" sx={{ color: '#003366', mb: 2, display: 'flex', alignItems: 'center' }}>
                <TrendingUpIcon sx={{ mr: 1 }} />
                Objective & Key Results (OKR)
                <EditIcon sx={{ ml: 'auto', opacity: 0.7, fontSize: '1rem' }} />
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                {currentPortfolio.okr?.objective}
              </Typography>
              <Grid container spacing={2}>
                {currentPortfolio.okr?.keyResults.map((kr, index) => (
                  <Grid item xs={12} md={4} key={index}>
                    <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                      <Typography variant="body2" gutterBottom>{kr.description}</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={(kr.current / kr.target) * 100} 
                          sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                        />
                        <Typography variant="caption">
                          {kr.current}{kr.unit} / {kr.target}{kr.unit}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>

          {/* KPIs Dashboard */}
          <Card elevation={3} sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: '#003366', mb: 2, display: 'flex', alignItems: 'center' }}>
                <SpeedIcon sx={{ mr: 1 }} />
                Key Performance Indicators
                <EditIcon sx={{ ml: 'auto', opacity: 0.7, fontSize: '1rem' }} />
              </Typography>
              <Grid container spacing={3}>
                {currentPortfolio.kpis?.map((kpi, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <Card 
                      variant="outlined" 
                      sx={{ 
                        height: '100%',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          boxShadow: 3,
                          transform: 'translateY(-2px)',
                          backgroundColor: '#f8f9fa'
                        },
                        '&:focus': {
                          outline: '2px solid #003366',
                          outlineOffset: '2px'
                        }
                      }}
                      onClick={handleKPIEdit}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleKPIEdit();
                        }
                      }}
                      tabIndex={0}
                      role="button"
                      aria-label={`Edit KPI: ${kpi.name}`}
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            {kpi.name}
                          </Typography>
                          <Chip 
                            size="small" 
                            color={getKPIStatusColor(kpi.status) as any}
                            label={kpi.status.toUpperCase()}
                          />
                        </Box>
                        <Typography variant="h4" sx={{ fontWeight: 600, color: '#003366' }}>
                          {kpi.current}{kpi.unit}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Target: {kpi.target}{kpi.unit}
                        </Typography>
                        <LinearProgress 
                          variant="determinate" 
                          value={Math.min((kpi.current / kpi.target) * 100, 100)} 
                          color={getKPIStatusColor(kpi.status) as any}
                          sx={{ mt: 1, height: 6, borderRadius: 3 }}
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>

          {/* AI Readiness & Current vs Future State */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={4}>
              <Card elevation={3} sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ color: '#003366', mb: 2, display: 'flex', alignItems: 'center' }}>
                    <AIIcon sx={{ mr: 1 }} />
                    AI Readiness Score
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                    <CircularProgress 
                      variant="determinate" 
                      value={currentPortfolio.aiReadiness || 0} 
                      size={100}
                      thickness={6}
                      sx={{ color: currentPortfolio.aiReadiness && currentPortfolio.aiReadiness > 70 ? '#4caf50' : '#ff9800' }}
                    />
                    <Typography 
                      variant="h4" 
                      sx={{ position: 'absolute', fontWeight: 600, color: '#003366' }}
                    >
                      {currentPortfolio.aiReadiness}%
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" align="center">
                    AI-First Strategy Implementation
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={8}>
              <Card 
                elevation={3} 
                sx={{ 
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    boxShadow: 6,
                    backgroundColor: '#f8f9fa'
                  }
                }}
                onClick={handleCurrentFutureStateEdit}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleCurrentFutureStateEdit();
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label="Click to edit current vs future state"
              >
                <CardContent>
                  <Typography variant="h6" sx={{ color: '#003366', mb: 2, display: 'flex', alignItems: 'center' }}>
                    <TimelineIcon sx={{ mr: 1 }} />
                    Current vs Future State
                    <EditIcon sx={{ ml: 'auto', opacity: 0.7, fontSize: '1rem' }} />
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" color="error" gutterBottom>
                        Current State
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {currentPortfolio.currentState}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" color="success.main" gutterBottom>
                        Future State
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {currentPortfolio.futureState}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Risk & Innovation Tracking */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <Card 
                elevation={3} 
                sx={{ 
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    boxShadow: 6,
                    backgroundColor: '#f8f9fa'
                  },
                  '&:focus': {
                    outline: '2px solid #003366',
                    outlineOffset: '2px'
                  }
                }}
                onClick={handleRiskEdit}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleRiskEdit();
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label="Edit Risk Management"
              >
                <CardContent>
                  <Typography variant="h6" sx={{ color: '#003366', mb: 2, display: 'flex', alignItems: 'center' }}>
                    <RiskIcon sx={{ mr: 1 }} />
                    Risk Management
                    <EditIcon sx={{ ml: 'auto', opacity: 0.7, fontSize: '1rem' }} />
                  </Typography>
                  <List dense>
                    {currentPortfolio.risks?.map((risk) => (
                      <ListItem key={risk.id}>
                        <ListItemIcon>
                          <Chip 
                            size="small" 
                            color={getRiskLevelColor(risk.level) as any}
                            label={risk.level}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={risk.title}
                          secondary={`${risk.category} - Owner: ${risk.owner}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card 
                elevation={3} 
                sx={{ 
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    boxShadow: 6,
                    backgroundColor: '#f8f9fa'
                  },
                  '&:focus': {
                    outline: '2px solid #003366',
                    outlineOffset: '2px'
                  }
                }}
                onClick={handleInnovationEdit}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleInnovationEdit();
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label="Edit Innovation Pipeline"
              >
                <CardContent>
                  <Typography variant="h6" sx={{ color: '#003366', mb: 2, display: 'flex', alignItems: 'center' }}>
                    <InnovationIcon sx={{ mr: 1 }} />
                    Innovation Pipeline
                    <EditIcon sx={{ ml: 'auto', opacity: 0.7, fontSize: '1rem' }} />
                  </Typography>
                  <List dense>
                    {currentPortfolio.innovations?.map((innovation) => (
                      <ListItem key={innovation.id}>
                        <ListItemIcon>
                          {innovation.aiFirst ? <AutoAwesomeIcon color="primary" /> : <InnovationIcon />}
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              {innovation.title}
                              {innovation.aiFirst && (
                                <Chip size="small" label="AI-First" color="primary" />
                              )}
                            </Box>
                          }
                          secondary={`${innovation.type} - ${innovation.impact} Impact`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Roadmap Timeline View */}
      {viewMode === 'roadmap' && (
        <Box sx={{ mb: 4 }}>
          {/* Timeline Header */}
          <Card elevation={3} sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: '#003366', mb: 2, display: 'flex', alignItems: 'center' }}>
                <TimelineIcon sx={{ mr: 1 }} />
                Strategic Roadmap Timeline - {currentPortfolio.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Executive view of strategic milestones, dependencies, and deliverables across the portfolio
              </Typography>
              
              {/* Timeline Summary Cards */}
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6} sm={3}>
                  <Card variant="outlined">
                    <CardContent sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h4" sx={{ color: '#003366', fontWeight: 600 }}>
                        {currentPortfolio.milestones?.length || 0}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Total Milestones
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Card variant="outlined">
                    <CardContent sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h4" sx={{ color: '#4caf50', fontWeight: 600 }}>
                        {currentPortfolio.milestones?.filter(m => m.status === 'Completed').length || 0}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Completed
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Card variant="outlined">
                    <CardContent sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h4" sx={{ color: '#ff9800', fontWeight: 600 }}>
                        {currentPortfolio.milestones?.filter(m => m.status === 'In Progress').length || 0}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        In Progress
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Card variant="outlined">
                    <CardContent sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h4" sx={{ color: '#f44336', fontWeight: 600 }}>
                        {currentPortfolio.milestones?.filter(m => m.status === 'At Risk' || m.status === 'Overdue').length || 0}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        At Risk/Overdue
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Milestone Timeline */}
          {currentPortfolio.milestones && currentPortfolio.milestones.length > 0 ? (
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6" sx={{ color: '#003366', mb: 3 }}>
                  Milestone Timeline
                </Typography>
                
                {/* Timeline Items */}
                <Box sx={{ position: 'relative' }}>
                  {/* Timeline Line */}
                  <Box
                    sx={{
                      position: 'absolute',
                      left: '24px',
                      top: '20px',
                      bottom: '20px',
                      width: '2px',
                      bgcolor: '#e0e0e0',
                      zIndex: 1
                    }}
                  />
                  
                  {currentPortfolio.milestones
                    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                    .map((milestone, index) => (
                    <Box key={milestone.id} sx={{ position: 'relative', mb: 3 }}>
                      {/* Timeline Dot */}
                      <Box
                        sx={{
                          position: 'absolute',
                          left: '16px',
                          top: '8px',
                          width: '16px',
                          height: '16px',
                          borderRadius: '50%',
                          bgcolor: milestone.status === 'Completed' ? '#4caf50' : 
                                   milestone.status === 'In Progress' ? '#2196f3' :
                                   milestone.status === 'At Risk' ? '#ff9800' :
                                   milestone.status === 'Overdue' ? '#f44336' : '#9e9e9e',
                          border: '3px solid white',
                          boxShadow: '0 0 0 3px #e0e0e0',
                          zIndex: 2
                        }}
                      />
                      
                      {/* Milestone Card */}
                      <Card 
                        variant="outlined" 
                        sx={{ 
                          ml: 6, 
                          border: `2px solid ${
                            milestone.priority === 'Critical' ? '#f44336' :
                            milestone.priority === 'High' ? '#ff9800' :
                            milestone.priority === 'Medium' ? '#2196f3' : '#4caf50'
                          }`
                        }}
                      >
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, color: '#003366' }}>
                              {milestone.title}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Chip 
                                size="small" 
                                label={milestone.status}
                                color={
                                  milestone.status === 'Completed' ? 'success' :
                                  milestone.status === 'In Progress' ? 'primary' :
                                  milestone.status === 'At Risk' ? 'warning' :
                                  milestone.status === 'Overdue' ? 'error' : 'default'
                                }
                              />
                              <Chip 
                                size="small" 
                                label={milestone.priority}
                                variant="outlined"
                                color={
                                  milestone.priority === 'Critical' ? 'error' :
                                  milestone.priority === 'High' ? 'warning' :
                                  milestone.priority === 'Medium' ? 'primary' : 'success'
                                }
                              />
                            </Box>
                          </Box>
                          
                          <Typography variant="body2" color="text.secondary" paragraph>
                            {milestone.description}
                          </Typography>
                          
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                              <Typography variant="body2" sx={{ mb: 1 }}>
                                <strong>Due Date:</strong> {new Date(milestone.dueDate).toLocaleDateString()}
                              </Typography>
                              <Typography variant="body2" sx={{ mb: 1 }}>
                                <strong>Owner:</strong> {milestone.owner}
                              </Typography>
                              <Typography variant="body2">
                                <strong>Risk Level:</strong> 
                                <Chip 
                                  size="small" 
                                  label={milestone.riskLevel}
                                  sx={{ ml: 1 }}
                                  color={
                                    milestone.riskLevel === 'Critical' ? 'error' :
                                    milestone.riskLevel === 'High' ? 'warning' :
                                    milestone.riskLevel === 'Medium' ? 'primary' : 'success'
                                  }
                                />
                              </Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <Typography variant="body2" sx={{ mb: 1 }}>
                                <strong>Key Deliverables:</strong>
                              </Typography>
                              <List dense>
                                {milestone.deliverables.map((deliverable, idx) => (
                                  <ListItem key={idx} sx={{ py: 0, px: 0 }}>
                                    <ListItemIcon sx={{ minWidth: 20 }}>
                                      <CheckCircleIcon sx={{ fontSize: 16, color: '#4caf50' }} />
                                    </ListItemIcon>
                                    <ListItemText 
                                      primary={deliverable}
                                      primaryTypographyProps={{ variant: 'body2' }}
                                    />
                                  </ListItem>
                                ))}
                              </List>
                              
                              {milestone.dependencies && milestone.dependencies.length > 0 && (
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                  <strong>Dependencies:</strong> {milestone.dependencies.join(', ')}
                                </Typography>
                              )}
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          ) : (
            <Alert severity="info">
              No milestones defined for this portfolio. Milestones help track strategic deliverables and dependencies.
            </Alert>
          )}
        </Box>
      )}

      {/* Cross-Portfolio Analytics Dashboard */}
      {viewMode === 'analytics' && (
        <Box sx={{ mb: 4 }}>
          {/* Analytics Header */}
          <Card elevation={3} sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: '#003366', mb: 2, display: 'flex', alignItems: 'center' }}>
                <TrendingUpIcon sx={{ mr: 1 }} />
                Cross-Portfolio Analytics Dashboard
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Enterprise-wide insights across all USCIS data portfolios for strategic decision-making
              </Typography>
            </CardContent>
          </Card>

          {/* Portfolio Comparison Matrix */}
          <Card elevation={3} sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: '#003366', mb: 3 }}>
                Portfolio Performance Matrix
              </Typography>
              
              {/* KPI Comparison Table */}
              <Box sx={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f5f5f5' }}>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e0e0e0' }}>Portfolio</th>
                      <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #e0e0e0' }}>AI Readiness</th>
                      <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #e0e0e0' }}>Budget</th>
                      <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #e0e0e0' }}>Programs</th>
                      <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #e0e0e0' }}>Critical Risks</th>
                      <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #e0e0e0' }}>AI Innovations</th>
                    </tr>
                  </thead>
                  <tbody>
                    {portfolioData.map((portfolio, index) => (
                      <tr key={portfolio.id} style={{ borderBottom: '1px solid #e0e0e0' }}>
                        <td style={{ padding: '12px', fontWeight: 600, color: '#003366' }}>
                          {portfolio.name}
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                            <CircularProgress
                              variant="determinate"
                              value={portfolio.aiReadiness || 0}
                              size={40}
                              thickness={6}
                              sx={{ 
                                color: (portfolio.aiReadiness || 0) > 70 ? '#4caf50' : 
                                       (portfolio.aiReadiness || 0) > 60 ? '#ff9800' : '#f44336'
                              }}
                            />
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {portfolio.aiReadiness || 0}%
                            </Typography>
                          </Box>
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center', fontWeight: 600 }}>
                          {portfolio.totalBudget}
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                          {portfolio.projects.length}
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                          <Chip
                            size="small"
                            label={portfolio.risks?.filter(r => r.level === 'Critical' || r.level === 'High').length || 0}
                            color={
                              (portfolio.risks?.filter(r => r.level === 'Critical' || r.level === 'High').length || 0) > 2 ? 'error' :
                              (portfolio.risks?.filter(r => r.level === 'Critical' || r.level === 'High').length || 0) > 0 ? 'warning' : 'success'
                            }
                          />
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                            {portfolio.innovations?.filter(i => i.aiFirst).map((_, idx) => (
                              <AutoAwesomeIcon key={idx} sx={{ fontSize: 16, color: '#2196f3' }} />
                            ))}
                            <Typography variant="caption" sx={{ ml: 0.5 }}>
                              {portfolio.innovations?.filter(i => i.aiFirst).length || 0}
                            </Typography>
                          </Box>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Box>
            </CardContent>
          </Card>

          {/* AI Readiness Heatmap & Resource Allocation */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <Card elevation={3} sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ color: '#003366', mb: 3 }}>
                    AI Readiness Heatmap
                  </Typography>
                  
                  {/* AI Readiness Visual Matrix */}
                  <Grid container spacing={2}>
                    {portfolioData.map((portfolio) => (
                      <Grid item xs={6} key={portfolio.id}>
                        <Card 
                          variant="outlined" 
                          sx={{ 
                            p: 2, 
                            textAlign: 'center',
                            bgcolor: (portfolio.aiReadiness || 0) > 70 ? '#e8f5e8' : 
                                     (portfolio.aiReadiness || 0) > 60 ? '#fff3e0' : '#ffebee',
                            border: `2px solid ${
                              (portfolio.aiReadiness || 0) > 70 ? '#4caf50' : 
                              (portfolio.aiReadiness || 0) > 60 ? '#ff9800' : '#f44336'
                            }`
                          }}
                        >
                          <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                            {portfolio.name.split(' ')[0]} {portfolio.name.split(' ')[1]}
                          </Typography>
                          <Typography variant="h4" sx={{ 
                            color: (portfolio.aiReadiness || 0) > 70 ? '#4caf50' : 
                                   (portfolio.aiReadiness || 0) > 60 ? '#ff9800' : '#f44336',
                            fontWeight: 600
                          }}>
                            {portfolio.aiReadiness || 0}%
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            AI Readiness
                          </Typography>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                  
                  {/* AI Readiness Legend */}
                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Box sx={{ width: 12, height: 12, bgcolor: '#4caf50', borderRadius: 1 }} />
                      <Typography variant="caption">High (70%+)</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Box sx={{ width: 12, height: 12, bgcolor: '#ff9800', borderRadius: 1 }} />
                      <Typography variant="caption">Medium (60-70%)</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Box sx={{ width: 12, height: 12, bgcolor: '#f44336', borderRadius: 1 }} />
                      <Typography variant="caption">Low (&lt;60%)</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card elevation={3} sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ color: '#003366', mb: 3 }}>
                    Resource Allocation Overview
                  </Typography>
                  
                  {/* Budget Distribution */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" sx={{ mb: 2 }}>
                      Budget Distribution
                    </Typography>
                    {portfolioData.map((portfolio) => {
                      const budgetValue = parseFloat(portfolio.totalBudget.replace(/[$M]/g, ''));
                      const totalBudget = portfolioData.reduce((sum, p) => sum + parseFloat(p.totalBudget.replace(/[$M]/g, '')), 0);
                      const percentage = (budgetValue / totalBudget) * 100;
                      
                      return (
                        <Box key={portfolio.id} sx={{ mb: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography variant="body2">
                              {portfolio.name.split(' ')[0]} {portfolio.name.split(' ')[1]}
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {portfolio.totalBudget} ({percentage.toFixed(1)}%)
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={percentage}
                            sx={{ 
                              height: 8, 
                              borderRadius: 4,
                              bgcolor: '#e0e0e0',
                              '& .MuiLinearProgress-bar': {
                                bgcolor: '#003366'
                              }
                            }}
                          />
                        </Box>
                      );
                    })}
                  </Box>
                  
                  {/* Total Enterprise Investment */}
                  <Box sx={{ 
                    p: 2, 
                    bgcolor: '#f5f5f5', 
                    borderRadius: 1, 
                    textAlign: 'center',
                    border: '2px solid #003366'
                  }}>
                    <Typography variant="h4" sx={{ color: '#003366', fontWeight: 600 }}>
                      ${portfolioData.reduce((sum, p) => sum + parseFloat(p.totalBudget.replace(/[$M]/g, '')), 0).toFixed(1)}M
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Enterprise Investment
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Strategic Insights & Risk Analysis */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card elevation={3} sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ color: '#003366', mb: 3 }}>
                    Strategic Insights
                  </Typography>
                  
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <TrendingUpIcon color="success" />
                      </ListItemIcon>
                      <ListItemText
                        primary="AI Transformation Leader"
                        secondary={`Data Enterprise Portfolio leads with ${portfolioData.find(p => p.id === 'portfolio-data-engineering')?.aiReadiness}% AI readiness`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <SecurityIcon color="warning" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Risk Concentration"
                        secondary={`${portfolioData.reduce((sum, p) => sum + (p.risks?.filter(r => r.level === 'Critical' || r.level === 'High').length || 0), 0)} high/critical risks across portfolios`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <AutoAwesomeIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="AI-First Innovations"
                        secondary={`${portfolioData.reduce((sum, p) => sum + (p.innovations?.filter(i => i.aiFirst).length || 0), 0)} AI-first initiatives in development`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <AssessmentIcon color="info" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Portfolio Diversity"
                        secondary={`${portfolioData.reduce((sum, p) => sum + p.projects.length, 0)} total programs across 4 strategic portfolios`}
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card elevation={3} sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ color: '#003366', mb: 3 }}>
                    Enterprise Risk Analysis
                  </Typography>
                  
                  {/* Risk Category Breakdown */}
                  <Box sx={{ mb: 3 }}>
                    {['Technical', 'Organizational', 'Compliance', 'Financial'].map((category) => {
                      const categoryRisks = portfolioData.reduce((risks, portfolio) => {
                        return risks.concat(portfolio.risks?.filter(r => r.category === category) || []);
                      }, [] as Risk[]);
                      
                      return (
                        <Box key={category} sx={{ mb: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="body2">{category} Risks</Typography>
                            <Chip
                              size="small"
                              label={categoryRisks.length}
                              color={
                                categoryRisks.length > 3 ? 'error' :
                                categoryRisks.length > 1 ? 'warning' : 'success'
                              }
                            />
                          </Box>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            {categoryRisks.map((risk, idx) => (
                              <Tooltip key={idx} title={`${risk.title} (${risk.level})`}>
                                <Box
                                  sx={{
                                    width: 8,
                                    height: 20,
                                    bgcolor: 
                                      risk.level === 'Critical' ? '#f44336' :
                                      risk.level === 'High' ? '#ff9800' :
                                      risk.level === 'Medium' ? '#2196f3' : '#4caf50',
                                    borderRadius: 1
                                  }}
                                />
                              </Tooltip>
                            ))}
                          </Box>
                        </Box>
                      );
                    })}
                  </Box>
                  
                  {/* Risk Mitigation Status */}
                  <Alert severity="info" sx={{ mt: 2 }}>
                    <Typography variant="body2">
                      <strong>Recommendation:</strong> Focus on Data Enterprise Portfolio's cloud migration risks and 
                      Data Governance Portfolio's compliance gaps for immediate attention.
                    </Typography>
                  </Alert>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Portfolio Overview - High-level summary */}
      {viewMode === 'overview' && (
        <>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={8}>
              <Card elevation={3}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: '#003366', mr: 2 }}>
                      <BusinessIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h5" sx={{ fontWeight: 600, color: '#003366' }}>
                        {currentPortfolio.name}
                      </Typography>
                      <Chip
                        label={currentPortfolio.status}
                        color={getStatusColor(currentPortfolio.status) as any}
                        size="small"
                      />
                    </Box>
                  </Box>
                  <Typography paragraph color="text.secondary">
                    {currentPortfolio.description}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Typography variant="body2">
                      <strong>Portfolio Manager:</strong> {currentPortfolio.manager}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Total Budget:</strong> {currentPortfolio.totalBudget}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card elevation={3}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ color: '#003366' }}>
                    Portfolio Statistics
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Total Programs: {currentPortfolio.projects.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Active: {currentPortfolio.projects.filter((p: Project) => p.status === 'In Progress').length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Completed: {currentPortfolio.projects.filter((p: Project) => p.status === 'Completed').length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Planning: {currentPortfolio.projects.filter((p: Project) => p.status === 'Planning').length}
                    </Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    fullWidth
                    sx={{ color: '#003366', borderColor: '#003366' }}
                    onClick={() => handleProjectEdit(undefined)}
                    aria-label="Add New Program"
                  >
                    Add New Program
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Portfolio Summary Cards - Overview Only */}
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#003366', mb: 3 }}>
            Portfolio Summary
          </Typography>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={2} sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h4" sx={{ color: '#2196f3', fontWeight: 600 }}>
                  {currentPortfolio.projects.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Programs
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={2} sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h4" sx={{ color: '#4caf50', fontWeight: 600 }}>
                  {currentPortfolio.totalBudget}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Budget
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={2} sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h4" sx={{ color: '#ff9800', fontWeight: 600 }}>
                  {Math.round(currentPortfolio.projects.reduce((sum: number, p: Project) => sum + p.progress, 0) / currentPortfolio.projects.length)}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Avg Progress
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={2} sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h4" sx={{ color: '#9c27b0', fontWeight: 600 }}>
                  {currentPortfolio.projects.filter((p: Project) => p.status === 'In Progress').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Active Programs
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </>
      )}

      {/* Programs Detail - Detailed program information */}
      {viewMode === 'programs' && (
        <>
          {/* Program Filters and Controls */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, color: '#003366' }}>
              Program Details ({currentPortfolio.projects.length})
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<FilterListIcon />}
                sx={{ color: '#003366', borderColor: '#003366' }}
              >
                Filter Programs
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                sx={{ bgcolor: '#003366', '&:hover': { bgcolor: '#002244' } }}
                onClick={() => handleProjectEdit(undefined)}
                aria-label="Create New Program"
              >
                New Program
              </Button>
            </Box>
          </Box>

          {/* Program Status Summary */}
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={3}>
              <Card elevation={1} sx={{ textAlign: 'center', p: 2, bgcolor: '#e3f2fd' }}>
                <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 600 }}>
                  {currentPortfolio.projects.filter((p: Project) => p.status === 'Planning').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Planning
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Card elevation={1} sx={{ textAlign: 'center', p: 2, bgcolor: '#fff3e0' }}>
                <Typography variant="h6" sx={{ color: '#f57c00', fontWeight: 600 }}>
                  {currentPortfolio.projects.filter((p: Project) => p.status === 'In Progress').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  In Progress
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Card elevation={1} sx={{ textAlign: 'center', p: 2, bgcolor: '#e8f5e8' }}>
                <Typography variant="h6" sx={{ color: '#388e3c', fontWeight: 600 }}>
                  {currentPortfolio.projects.filter((p: Project) => p.status === 'Completed').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Completed
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Card elevation={1} sx={{ textAlign: 'center', p: 2, bgcolor: '#ffebee' }}>
                <Typography variant="h6" sx={{ color: '#d32f2f', fontWeight: 600 }}>
                  {currentPortfolio.projects.filter((p: Project) => p.status === 'On Hold').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  On Hold
                </Typography>
              </Card>
            </Grid>
          </Grid>

          {/* Detailed Program Cards */}
          <Grid container spacing={3}>
            {currentPortfolio.projects.map((project: Project) => (
              <Grid item xs={12} md={6} key={project.id}>
                <Card 
                  elevation={3} 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': { boxShadow: 6, backgroundColor: '#f8f9fa' },
                    '&:focus': { outline: '2px solid #003366', outlineOffset: '2px' }
                  }}
                  onClick={() => handleProjectEdit(project)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleProjectEdit(project);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`Edit program ${project.name}`}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: '#003366' }}>
                        {project.name}
                      </Typography>
                      <Chip
                        label={project.status}
                        color={getStatusColor(project.status) as any}
                        size="small"
                      />
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {project.description}
                    </Typography>
                    
                    {/* Progress Section */}
                    <Box sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>Progress</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{project.progress}%</Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={project.progress}
                        sx={{ 
                          height: 10, 
                          borderRadius: 5,
                          bgcolor: '#e0e0e0',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: project.progress > 75 ? '#4caf50' : project.progress > 50 ? '#ff9800' : '#f44336'
                          }
                        }}
                      />
                    </Box>
                    
                    {/* Program Details Grid */}
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      <Grid item xs={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <PersonIcon sx={{ fontSize: 16, color: '#003366' }} />
                          <Typography variant="caption" color="text.secondary">Manager</Typography>
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {project.manager}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <BudgetIcon sx={{ fontSize: 16, color: '#003366' }} />
                          <Typography variant="caption" color="text.secondary">Budget</Typography>
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {project.budget}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <ScheduleIcon sx={{ fontSize: 16, color: '#003366' }} />
                          <Typography variant="caption" color="text.secondary">Timeline</Typography>
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {project.startDate} - {project.endDate}
                        </Typography>
                      </Grid>
                    </Grid>

                    {/* Key Metrics */}
                    <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 1, mb: 2 }}>
                      <Typography variant="caption" sx={{ fontWeight: 600, color: '#003366', mb: 1, display: 'block' }}>
                        Key Metrics
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={4}>
                          <Typography variant="caption" color="text.secondary">Team Size</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {Math.floor(Math.random() * 15) + 5}
                          </Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant="caption" color="text.secondary">Milestones</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {Math.floor(Math.random() * 8) + 3}
                          </Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant="caption" color="text.secondary">Risk Level</Typography>
                          <Chip 
                            label={['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)]} 
                            size="small"
                            color={['success', 'warning', 'error'][Math.floor(Math.random() * 3)] as any}
                          />
                        </Grid>
                      </Grid>
                    </Box>
                  </CardContent>
                  
                  <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                    <Box>
                      <Button size="small" startIcon={<ViewIcon />} sx={{ color: '#003366' }}>
                        View Details
                      </Button>
                      <Button size="small" startIcon={<EditIcon />} sx={{ color: '#003366' }}>
                        Edit
                      </Button>
                      <Button 
                        size="small" 
                        startIcon={<DocumentIcon />} 
                        sx={{ color: '#003366' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDocumentationView(project);
                        }}
                      >
                        Documentation
                      </Button>
                    </Box>
                    <Button size="small" startIcon={<AssessmentIcon />} sx={{ color: '#003366' }}>
                      Reports
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {/* Edit Dialogs */}
      <KPIEditDialog
        open={kpiDialogOpen}
        kpis={currentPortfolio?.kpis || []}
        onClose={() => setKpiDialogOpen(false)}
        onSave={handleKPISave}
      />

      <OKREditDialog
        open={okrDialogOpen}
        okr={currentPortfolio?.okr}
        onClose={() => setOkrDialogOpen(false)}
        onSave={handleOKRSave}
      />

      <CurrentFutureStateEditDialog
        open={currentFutureStateDialogOpen}
        currentState={currentPortfolio?.currentState || ''}
        futureState={currentPortfolio?.futureState || ''}
        onClose={() => setCurrentFutureStateDialogOpen(false)}
        onSave={handleCurrentFutureStateSave}
      />

      <RiskEditDialog
        open={riskDialogOpen}
        risks={currentPortfolio?.risks || []}
        onClose={() => setRiskDialogOpen(false)}
        onSave={handleRiskSave}
      />

      <InnovationEditDialog
        open={innovationDialogOpen}
        innovations={currentPortfolio?.innovations || []}
        onClose={() => setInnovationDialogOpen(false)}
        onSave={handleInnovationSave}
      />

      <ProjectEditDialog
        open={projectDialogOpen}
        project={selectedProject}
        onClose={() => {
          setProjectDialogOpen(false);
          setSelectedProject(undefined);
        }}
        onSave={handleProjectSave}
      />

      <ProgramDocumentation
        open={documentationDialogOpen}
        project={selectedDocumentationProject}
        onClose={() => {
          setDocumentationDialogOpen(false);
          setSelectedDocumentationProject(null);
        }}
      />

      {/* Success/Error Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity={error ? 'error' : 'success'}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Loading Overlay */}
      {loading && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
        >
          <CircularProgress size={60} sx={{ color: '#003366' }} />
        </Box>
      )}
    </Container>
  );
};

export default Portfolio;
