# Weekly Status Reports (Automation-First)

This document defines the automation-first Weekly Status process for the Data Strategy Support Program (PMO). The prime directive is to automate data capture, validation, and submission into centralized MongoDB collections. Human effort focuses on review and verification before submission, not on formatting emails or documents.

## Purpose
- Ensure contract compliance with the PWS: weekly progress, risks, and planning captured per person.
- Enable program transparency, performance monitoring, and auditability.
- Provide a uniform, low-friction process that takes 2–5 minutes per person using a standardized online form.

## SLA and Cadence
- Due: Every Monday by 12:00 PM Eastern.
- Scope: Each team member submits one report per reporting week.
- Identity: Uniqueness is based on `userId + weekStart` (ISO week starting Monday).

## Automation-First Principles
- No email/PDF/Word submissions. Source of truth is MongoDB.
- Submissions via authenticated web form only; data is validated server-side and stored in the `WeeklyStatus` collection.
- Auto-prefill static fields (name, supervisor, contract, team) when possible.
- Automations:
  - Weekly reminders to users with a direct form link for the current week.
  - SLA checks at 12:00 PM ET: missing reports flagged, notifications sent to owner and supervisor.
  - Dashboards auto-refresh to reflect submission status and RAG trend.

## Definition of Done (DoD)
A weekly status is considered Done when:
1) The user has submitted the form for the current week (unique by `userId + weekStart`).
2) Server validation passes (required fields present, week alignment to Monday, allowed enums).
3) The entry is written to MongoDB with timestamps and audit metadata.
4) The user and supervisor can view the entry in the app; it appears in weekly dashboards.
5) Optional review step: supervisor marks "Reviewed" (audit trail captured).

## Required Fields (MVP)
- Identity & Context
  - `userId` (reference) and `name` (snapshot)
  - `team` (string)
  - `contractNumber` (string)
  - `periodOfPerformance` (string)
  - `supervisor` (string)
  - `weekStart` (Date, normalized to Monday 00:00:00 UTC)
  - `status` (enum: green | yellow | red)
- Content
  - `summary` (string): brief overview
  - `accomplishments` (string)
  - `tasksStatus` (string)
  - `issuesNeeds` (string)
  - `nextSteps` (string)
  - `hoursWorked` (number) — optional breakdown by task in later iteration
  - `communications` (string)
- Metadata
  - `tags` (string[])
  - `reviewed` (boolean, default false)
  - `reviewedBy` (string, optional)
  - `createdBy`, `updatedBy` (string or user ref)
  - `createdAt`, `updatedAt` (timestamps)

Notes:
- `weekEnd` is a derived/virtual field (Sunday end of week) and not stored.
- A unique index on `{ userId, weekStart }` enforces one report per person per week.
- Secondary index on `{ team, weekStart }` supports dashboards.

## Submission Workflow
1) User visits the Weekly Status form (pre-fills identity and current week).
2) User completes required fields and submits.
3) Server normalizes `weekStart` to ISO Monday, validates payload, and writes to MongoDB.
4) UI shows success; entry becomes visible in List/Detail and team dashboards.
5) Optional: Supervisor review toggles `reviewed` to true and records `reviewedBy`.

## Accessibility and UX
- Form and list views must meet Section 508/WCAG 2.1 AA.
- Keyboard-accessible controls with visible focus indicators.
- Clear labels and ARIA attributes for all inputs.
- Primary actions use `PrimaryButton`; secondary actions are outlined buttons.

## Compliance and Security
- Aligns with PWS requirements for regular status documentation and program reviews.
- Authentication required for submission and viewing. Admin/supervisor permissions gate review and edits.
- All writes are audited via `createdBy/updatedBy` and timestamps.

## Data Model Summary (see `server/models/WeeklyStatus.js`)
- Unique: `userId + weekStart`
- Derived: `weekEnd` (virtual)
- Enums: status (green/yellow/red)
- Indexes: `{ userId, weekStart }` unique; `{ team, weekStart }` for reporting

## API Endpoints (planned)
- `GET /api/weekly-status?team=&from=&to=&userId=`
- `GET /api/weekly-status/:id`
- `POST /api/weekly-status` (auth required)
- `PUT /api/weekly-status/:id` (owner/admin)
- `DELETE /api/weekly-status/:id` (admin; soft delete optional)
- `GET /api/weekly-status/sla` — report missing submissions for the current week (admin)

## Reminder and SLA Automation (planned)
- Cron or scheduled job aligns to Monday 12:00 PM ET.
- Flags users without a current-week submission and triggers notifications.

## Integration Plan
- Backend: add Mongoose model, controller, routes. Register under `server.js`.
- Frontend: `src/components/WeeklyStatus/` with List, Form, Detail.
- Navigation: add menu entry for "Weekly Status". Enforce role-based access.
- Testing: unit tests (model/controller) and UI tests for form/validation.

## Out of Scope (MVP)
- Attachments and rich text formatting.
- External exports (CSV/PDF) — can be added later from server-rendered templates.

## References
- USCIS DSSS PWS (status documentation and program reviews).
- Example weekly report format (team PDFs) used to shape fields.
