# Data Literacy Support - Data Governance Platform

A modern React-based web application designed to improve data literacy and governance within organizations, helping teams discover, understand, and trust their data with intelligent data governance solutions.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Development Roadmap](#development-roadmap)
- [Contributing](#contributing)
- [License](#license)

## Overview

The Data Literacy Support platform is a comprehensive solution for data governance that helps organizations manage their data assets, policies, and workflows in a centralized location. It provides tools for data cataloging, governance policies, analytics, and integration capabilities while focusing on improving data literacy across the organization.

This application showcases how modern data governance tools can help teams:
- Discover and catalog data across the organization
- Implement governance policies and workflows
- Visualize data lineage and relationships
- Ensure compliance with regulations like GDPR
- Improve data quality and trustworthiness

## Features

### Current Features

1. **Data Catalog**
   - Comprehensive data asset discovery and metadata management
   - Search and filter capabilities for data assets
   - Tagging and categorization of data
   - Certification workflow visualization

2. **Data Governance**
   - Centralized policy management
   - Governance workflow visualization
   - Role-based access visualization

3. **Analytics & Reporting**
   - Data visualization dashboards
   - Business glossary tools
   - Metrics and KPIs

4. **Integration & Scalability**
   - API-first architecture demonstration
   - Cloud-native scalability visualization

5. **Learning Resources**
   - Data governance education materials
   - Best practices documentation
   - Interactive learning modules

### User Interface

The application features a modern, responsive UI built with Material-UI (MUI) that follows Collibra's design guidelines and color scheme. The interface prioritizes usability and accessibility with:

- Intuitive navigation
- Responsive design for all device sizes
- Section 508 compliance for accessibility
- Interactive data visualizations
- Consistent styling and component usage

## Technology Stack

- **Frontend**: React, TypeScript, Material-UI
- **Backend**: Node.js, Express
- **State Management**: React Context API
- **Routing**: React Router
- **Visualization**: Recharts
- **Documentation**: Markdown
- **Development Tools**: ESLint, Prettier, TypeScript, Concurrently

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher)
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/rbriehl/data-literacy-support.git
   cd data-literacy-support
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

1. Start the development server:
   ```bash
   npm run dev
   ```
   This will start both the React frontend (port 3005) and the Node.js backend (port 3001).

2. Seed the database with sample data:
   ```bash
   node server/seeder.js -i
   ```
   This will populate the database with sample users, data assets, and policies.

3. Access the application at: http://localhost:3005

### Development Tools

The application includes a DevTools panel (visible only in development mode) that provides helpful features for developers:

- **Quick Login Buttons**: Login instantly as admin, data steward, or regular user
- **Auto Form Fill**: Fill the login form with predefined credentials
- **Environment Information**: View current environment settings

### Login Credentials

The following credentials are available for testing:

1. **Admin User**
   - Email: admin@example.com
   - Password: admin123!
   - Access: Full administrative access

2. **Data Steward**
   - Email: steward@example.com
   - Password: password123
   - Access: Data governance and stewardship features

3. **Regular User**
   - Email: user@example.com
   - Password: password123
   - Access: Basic user features


The application consists of both a frontend React application and a backend Express server.

1. **Development Mode** (runs both frontend and backend):
   ```bash
   npm run dev
   ```
   This starts:
   - Frontend on http://localhost:3000
   - Backend server on http://localhost:3001

2. **Frontend Only**:
   ```bash
   npm start
   ```

3. **Backend Only**:
   ```bash
   npm run server
   ```

4. **Production Build**:
   ```bash
   npm run build
   ```

## Project Structure

```
data-literacy-support/
├── docs/                # Documentation files
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── Layout/      # Layout components
│   │   └── Learn/       # Educational components
│   ├── pages/           # Main application pages
│   ├── App.tsx          # Main application component
│   └── index.tsx        # Application entry point
├── server.js            # Express backend server
├── package.json         # Dependencies and scripts
└── tsconfig.json        # TypeScript configuration
```

## Development Roadmap

### Phase 1: Core Infrastructure & UI (Complete)
- ✅ Project setup with React, TypeScript, and Material-UI
- ✅ Basic UI components and layout
- ✅ Mock data implementation
- ✅ Routing and navigation
- ✅ Initial pages (Home, Data Catalog, Data Governance)
- ✅ Documentation structure

### Phase 2: Enhanced Features (In Progress)
| Task | Description | Level of Effort | Status |
|------|-------------|----------------|--------|
| MongoDB Integration | Replace mock data with MongoDB database | Medium (3-5 days) | Not Started |
| User Authentication | Implement user login, registration, and profiles | Medium (3-5 days) | Not Started |
| Data Asset Details | Create detailed views for data assets | Medium (3-4 days) | Not Started |
| Advanced Search | Implement advanced search functionality | Medium (3-4 days) | Not Started |
| Data Lineage Visualization | Create interactive data lineage diagrams | High (5-7 days) | Not Started |

### Phase 3: Business Logic Implementation (Planned)
| Task | Description | Level of Effort | Status |
|------|-------------|----------------|--------|
| Workflow Engine | Implement workflow management for governance processes | High (7-10 days) | Not Started |
| Policy Management | Create CRUD operations for policies | Medium (4-6 days) | Not Started |
| Automated Rules | Implement rule-based validation for data assets | High (6-8 days) | Not Started |
| Reporting Engine | Create customizable reports and dashboards | High (7-9 days) | Not Started |
| Export Capabilities | Add PDF, Excel, and CSV export features | Medium (3-5 days) | Not Started |

### Phase 4: Advanced Features (Future)
| Task | Description | Level of Effort | Status |
|------|-------------|----------------|--------|
| AI-Powered Recommendations | Implement ML for data governance recommendations | Very High (10-15 days) | Not Started |
| Real-time Collaboration | Add collaborative features for team governance | High (8-10 days) | Not Started |
| Integration APIs | Create RESTful APIs for third-party integration | Medium (5-7 days) | Not Started |
| Compliance Templates | Build templates for common regulations (GDPR, CCPA, etc.) | Medium (5-7 days) | Not Started |
| Mobile Application | Develop companion mobile app | Very High (15-20 days) | Not Started |

### Phase 5: Production Readiness (Future)
| Task | Description | Level of Effort | Status |
|------|-------------|----------------|--------|
| Comprehensive Testing | Unit, integration, and E2E tests | High (8-10 days) | Not Started |
| Performance Optimization | Improve application performance | Medium (4-6 days) | Not Started |
| Security Audit | Conduct security assessment | Medium (3-5 days) | Not Started |
| Documentation | Create comprehensive user and developer docs | Medium (5-7 days) | Not Started |
| Deployment Pipeline | Set up CI/CD for automated deployment | Medium (3-5 days) | Not Started |

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
