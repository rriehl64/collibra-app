# Team Roster Management Guide

## 🎯 Overview

The Team Roster Management system provides comprehensive functionality to manage your team members including adding new members, archiving inactive members, and permanently deleting records when necessary.

## 📋 Available Operations

### 1. **Command Line Interface**

Run the interactive management script:
```bash
node manage-team-roster.js
```

**Available Options:**
- **Add New Team Member** - Interactive form to add new team members
- **Archive Team Member** - Soft delete (keeps data but marks as inactive)
- **Delete Team Member** - Permanent deletion (cannot be undone)
- **Reactivate Archived Member** - Restore archived members to active status
- **List All Team Members** - View current roster with status

### 2. **API Endpoints**

All endpoints are available at `/api/v1/team-management/`

#### Get Team Members
```http
GET /api/v1/team-management/members
```

**Query Parameters:**
- `status`: `all`, `active`, `archived`
- `branch`: Filter by specific branch
- `role`: Filter by role (partial match)

#### Add New Team Member
```http
POST /api/v1/team-management/members
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe", 
  "email": "john.doe@uscis.dhs.gov",
  "personalPhone": "555-123-4567",
  "role": "Data Analyst",
  "branch": "Data Analytics",
  "skills": [
    {
      "skillName": "SQL",
      "proficiency": "Advanced",
      "certified": true
    }
  ]
}
```

#### Archive Team Member
```http
PUT /api/v1/team-management/members/{id}/archive
Content-Type: application/json

{
  "reason": "Position eliminated"
}
```

#### Reactivate Team Member
```http
PUT /api/v1/team-management/members/{id}/reactivate
```

#### Delete Team Member (Permanent)
```http
DELETE /api/v1/team-management/members/{id}
Content-Type: application/json

{
  "confirmation": "DELETE_PERMANENTLY"
}
```

#### Get Available Branches
```http
GET /api/v1/team-management/branches
```

## 🏢 Available Branches

- Front Office
- Data Management
- Data Analytics
- Data Engineering
- Data Science
- Business Intelligence
- Data Governance
- Product & Design

## 📊 Team Member Status

### **Active Members**
- `isActive: true`
- Available for assignments
- Visible in main Team Roster
- Can be edited and managed

### **Archived Members**
- `isActive: false`
- Not available for new assignments
- Hidden from main roster by default
- Can be reactivated if needed
- Maintains all historical data

### **Deleted Members**
- Permanently removed from database
- Cannot be recovered
- Use with extreme caution

## 🔄 Workflow Examples

### Adding a New Team Member

1. **Via Command Line:**
   ```bash
   node manage-team-roster.js
   # Select option 1: Add New Team Member
   # Follow interactive prompts
   ```

2. **Via API:**
   ```bash
   curl -X POST http://localhost:3002/api/v1/team-management/members \
     -H "Content-Type: application/json" \
     -d '{
       "firstName": "Jane",
       "lastName": "Smith",
       "email": "jane.smith@uscis.dhs.gov",
       "personalPhone": "555-987-6543",
       "role": "Data Scientist",
       "branch": "Data Science"
     }'
   ```

### Archiving a Team Member

1. **Via Command Line:**
   ```bash
   node manage-team-roster.js
   # Select option 2: Archive Team Member
   # Choose from active members list
   # Provide optional reason
   ```

2. **Via API:**
   ```bash
   curl -X PUT http://localhost:3002/api/v1/team-management/members/MEMBER_ID/archive \
     -H "Content-Type: application/json" \
     -d '{"reason": "Contract ended"}'
   ```

### Viewing Team Status

```bash
# Command line
node manage-team-roster.js
# Select option 5: List All Team Members

# API
curl http://localhost:3002/api/v1/team-management/members?status=all
```

## ⚠️ Important Notes

### **Archive vs Delete**
- **Archive**: Recommended for most cases (contract end, role change, etc.)
- **Delete**: Only use for data cleanup or duplicate entries

### **Employee ID Generation**
- Automatically generated as `EMP-XXX` (e.g., EMP-028, EMP-029)
- Sequential numbering based on existing records
- Cannot be manually set

### **Email Uniqueness**
- Email addresses must be unique across all members (active and archived)
- System will prevent duplicate email registration

### **Data Retention**
- Archived members retain all historical data
- Skills, assignments, and notes are preserved
- Can generate reports including archived members

## 🔧 Integration with Team Roster Page

The Team Roster page at `/admin/team-roster` automatically:
- Shows only active members by default
- Provides filter options to include archived members
- Integrates with the management API for real-time updates
- Supports inline editing for active members

## 📈 Reporting and Analytics

Use the API to generate reports:

```javascript
// Get team composition by branch
const activeByBranch = await fetch('/api/v1/team-management/members?status=active')
  .then(r => r.json());

// Get archived members for exit analysis  
const archived = await fetch('/api/v1/team-management/members?status=archived')
  .then(r => r.json());
```

## 🚀 Quick Start

1. **Load initial data:**
   ```bash
   node seed-team-roster-accurate.js
   ```

2. **Start management:**
   ```bash
   node manage-team-roster.js
   ```

3. **Access web interface:**
   - Navigate to http://localhost:3008/admin/team-roster
   - Use admin credentials to access management features

The system is now ready for comprehensive team management! 🎉
