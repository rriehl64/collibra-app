# E‑Unify Application: Features & Capabilities

Last updated: 2025-08-23

## Frontend (React + MUI)

- **Routing & Layout**
  - App routing with protected and role-based routes: `src/App.tsx`
  - Layout shell and navbar: `src/components/Layout/`
  - Dev tools overlay: `src/components/DevTools/`

- **Contexts & Global UX**
  - Theme: `src/contexts/ThemeContext.tsx`
  - Accessibility (high contrast, large text): `src/contexts/AccessibilityContext.tsx`
  - Auth (roles: admin, data steward, user): `src/contexts/AuthContext.tsx`
  - Edit mode for inline editing: `src/contexts/EditContext.tsx`
  - Snackbar notifications: `src/contexts/SnackbarContext.tsx`

- **Shared/Editing Components**
  - Inline editing: `src/components/shared/EditableField.tsx`
  - Common utilities: `src/components/common/` (e.g., `ScrollToTop`)

- **Authentication**
  - Login/Register forms: `src/components/Auth/`
  - Dev login page (quick role switch): `src/pages/DevLogin.tsx`

- **Major Pages**
  - Dashboard: `src/pages/Dashboard.tsx`
  - Data Catalog suite:
    - Catalog: `src/pages/DataCatalog.tsx`
    - Asset types: `src/pages/AssetTypes.tsx`
    - Data assets demo: `src/pages/DataAssetDemo.tsx`
    - Elasticsearch admin: `src/components/ElasticsearchAdmin.tsx`
  - Data Governance & Policy:
    - Data Governance: `src/pages/DataGovernance.tsx`
    - Policy Index/GDPR/Standards: `src/pages/policy/`
  - Business/Context Modules:
    - Business Processes: `src/pages/BusinessProcesses.tsx`
    - Data Categories/Concepts/Domains/Subject Categories: `src/pages/`
    - Line of Business: `src/pages/LineOfBusiness.tsx`
    - Business Terms & Acronyms: `src/pages/BusinessTerms.tsx`, `src/pages/Acronyms.tsx`
  - E22 Classification (standardized editing pattern):
    - Container page: `src/pages/E22Classification.tsx`
    - Sections in `src/components/E22Classification/` including:
      - `OverviewSection.tsx` (model pattern)
      - `USCISRolesSection.tsx` (refactored: admin toolbar, inline edit, form mode, PUT saves)
      - Eligibility / Application Requirements / Data Challenges / Category Reference / Legal Foundation (to standardize)
  - National Production Dataset (tabs + accessible sidenav): `src/pages/NationalProductionDataset.tsx`
  - Data Literacy Module (9 tabs, 508 compliant): `src/pages/DataLiteracyModule.tsx`
  - Reports/Analytics/Integration/KPIs: `src/pages/Reports.tsx`, `Analytics.tsx`, `Integration.tsx`, `KPIs.tsx`
  - Project Charter: `src/pages/ProjectCharter.tsx`
  - Documentation viewer: `src/pages/Documentation.tsx`
  - Settings & Profile: `src/pages/Settings.tsx`, `Profile.tsx`
  - Access Management (admin): Users/Roles/Permissions/Jurisdictions `src/pages/access/`
  - Admin sections: DomainTypes/Statuses/Characteristics/Workflows `src/pages/admin/`

- **Accessibility & Design**
  - USCIS color scheme and 508 compliance integrated across pages
  - Keyboard navigable tabs and sidenav (NPD) with ARIA and visible focus
  - High contrast and large text toggles via `AccessibilityContext`

## Backend (Node + Express + MongoDB)

- **Server Setup**
  - Express with CORS, cookies, logging: `server.js`
  - Docs serving via `/docs/:file`
  - DB connection: `server/config/db.js`

- **Routes & Controllers** (mounted in `server.js`)
  - Auth: `server/controllers/auth.js` -> `/api/v1/auth`
  - Dashboard: `server/controllers/dashboard.js` -> `/api/v1/dashboard`
  - Data Assets: `server/controllers/dataAssets.js` -> `/api/v1/data-assets`
  - Business Processes: `server/controllers/businessProcessController.js` -> `/api/v1/business-processes`
  - Project Charters: `server/controllers/projectCharterController.js` -> `/api/v1/project-charters`
  - Data Categories/Concepts: `server/controllers/dataCategoryController.js`, `dataConceptController.js`
  - Policies: `server/controllers/policies.js` -> `/api/v1/policies`
  - Users: `/api/v1/users`
  - E22 suite (per-section controllers):
    - Overview: `server/controllers/e22OverviewController.js`
    - USCIS Roles: `server/controllers/e22USCISRolesController.js`
    - Eligibility: `server/controllers/e22EligibilityController.js`
    - Application Requirements: `server/controllers/e22ApplicationRequirementsController.js`
    - Data Challenges: `server/controllers/e22DataChallengesController.js`
    - Category Reference: `server/controllers/e22CategoryReferenceController.js`
    - Legal Foundation: `server/controllers/e22LegalFoundationController.js`
    - Mounted under `/api/v1/e22`

- **Models (Mongoose)**
  - DataAsset/DataCategory/DataConcept/Domain/SubjectCategory/BusinessProcess: `server/models/*.js`
  - E22 models: `server/models/E22*.js`
  - Policy, ProjectCharter, Task, User

## Tooling, Scripts, and Data

- **Scripts (root)**
  - Seeding/migration/utilities: `create-*.js`, `reset-and-populate-data.js`, `insert-users.js`
  - E22 population/diagnostics: `create-e22-*.js`, `diagnose-and-fix-collections.js`, `final_structure_fix.js`
  - Checks: `check-data-assets.js`, `check-databases.js`, `list-all-assets.js`
  - Tests: `test-api*.js`, `test-e22-api.js`, `test-update-asset.js`
  - Shell helpers: `final_fix.sh`, `change-database.sh`

- **Testing**
  - Jest config and mocks: `jest.config.js`, `src/__mocks__/`

- **Public Assets & Templates**
  - Templates: `public/templates/*.md`, `.csv`
  - Branding/assets: `public/images/`, `public/E-Unify.png`

- **Deployment**
  - Netlify: `netlify.toml`
  - CRA config override: `config-overrides.js`

## Notable Capabilities

- **Inline Editing UX**
  - Admin-only edit mode with toolbar (Edit Content, Form Mode, Save All, Cancel)
  - `EditableField` pattern (USCIS Roles aligned to `OverviewSection`)

- **Dual Navigation**
  - Tabs + accessible sidenav (NPD) with ARIA and keyboard support

- **Accessibility**
  - Global high-contrast/large-text controls
  - 508 compliance across UI

- **Auth & Roles**
  - Role-aware routes and pages; dev login for quick role-switching

- **Documentation**
  - Backend serves markdown files from `/docs` via `/docs/:file`
