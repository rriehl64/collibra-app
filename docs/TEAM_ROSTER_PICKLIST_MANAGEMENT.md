# Team Roster Picklist Management

## Overview

The Team Roster Picklist Management system provides administrators with a centralized interface to manage dropdown values for the Team Roster module. This ensures consistency across the application and allows for easy updates without code changes.

## Features

### Managed Picklists

1. **Roles** (52 values) - Job roles for team members
   - **Leadership & Management**: Chief Data Officer, Director, Deputy Director, Program Manager, Project Manager, Product Manager, Scrum Master
   - **Data Engineering**: Data Engineer, Senior Data Engineer, Lead Data Engineer, Principal Data Engineer, ETL Developer, Database Administrator
   - **Data Analytics & Science**: Data Analyst, Data Scientist, Machine Learning Engineer, AI/ML Specialist (various levels)
   - **Business Analysis**: Business Analyst, Senior Business Analyst, Business Intelligence Analyst, Requirements Analyst
   - **Architecture & Design**: Data Architect, Enterprise Architect, Solution Architect, Cloud Architect
   - **Governance & Quality**: Data Steward, Data Governance Manager, Data Quality Analyst, Metadata Manager, Privacy Officer
   - **Development & Engineering**: Software Engineer, Full Stack Developer, Frontend Developer, Backend Developer, DevOps Engineer, Site Reliability Engineer
   - **Design & UX**: UX Designer, UI Designer, UX Researcher, Product Designer
   - **Quality & Testing**: Quality Assurance Analyst, Test Engineer, Automation Engineer
   - **Support & Operations**: Technical Writer, Systems Administrator, Support Specialist, Training Specialist
   
2. **Branches** (12 values) - Organizational branches
   - Front Office, Data Management, Data Analytics, Data Engineering, Data Science, Business Intelligence, Data Governance, Product & Design, Enterprise Architecture, Cloud & Infrastructure, Quality Assurance, Program Management Office
   
3. **Position Titles** (96 values) - Specific position titles with career levels
   - **Executive & Senior Leadership**: Chief Data Officer, Director of Data Strategy, Deputy Director, Associate Director
   - **Program & Project Management**: Senior Program Manager, Program Manager, Senior Project Manager, Project Manager, Senior Product Manager, Product Manager, Agile Coach, Scrum Master
   - **Data Engineering**: Principal Data Engineer, Lead Data Engineer, Senior Data Engineer, Data Engineer I/II, Senior ETL Developer, ETL Developer, Senior Database Administrator, Database Administrator
   - **Data Analytics & Science**: Principal/Lead/Senior Data Scientist, Data Scientist I/II, Lead/Senior Data Analyst, Data Analyst I/II, Senior Machine Learning Engineer, Machine Learning Engineer, AI/ML Research Scientist
   - **Business Analysis**: Lead/Senior Business Analyst, Business Analyst I/II, Senior BI Analyst, Business Intelligence Analyst, Requirements Analyst
   - **Architecture**: Chief Data Architect, Principal/Senior Data Architect, Data Architect, Enterprise Architect, Solution Architect, Cloud Solutions Architect
   - **Data Governance & Quality**: Data Governance Manager, Senior Data Steward, Data Steward, Senior Data Quality Analyst, Data Quality Analyst, Metadata Manager, Metadata Analyst, Chief Privacy Officer, Privacy Analyst
   - **Software Development**: Staff/Principal/Senior Software Engineer, Software Engineer I/II, Senior Full Stack Developer, Full Stack Developer, Senior Frontend/Backend Developer, Frontend/Backend Developer
   - **DevOps & Infrastructure**: Principal/Senior DevOps Engineer, DevOps Engineer, Senior Site Reliability Engineer, Site Reliability Engineer, Cloud Engineer, Senior Systems Administrator, Systems Administrator
   - **Design & UX**: Lead/Senior UX Designer, UX Designer, Senior UI Designer, UI Designer, UX Researcher, Senior Product Designer, Product Designer
   - **Quality Assurance**: QA Manager, QA Lead, Senior QA Analyst, QA Analyst, Senior Test Engineer, Test Engineer, Automation Engineer
   - **Support & Operations**: Senior Technical Writer, Technical Writer, Training Manager, Training Specialist, Technical Support Specialist, Data Operations Specialist

### Management Capabilities

- ✅ **Add New Values** - Create new dropdown options
- ✅ **Delete Values** - Remove unused options
- ✅ **Reorder Values** - Change display order with up/down arrows
- ✅ **Toggle Active/Inactive** - Temporarily disable values without deleting
- ✅ **Audit Trail** - Track who modified what and when

## Access

**URL**: http://localhost:3008/admin/team-roster-picklists

**Access Level**: Admin only

**Navigation**: 
1. Click on your user profile chip (top right)
2. Select "Team Roster Picklists" from the dropdown menu

## Usage

### Adding a New Value

1. Select the appropriate tab (Roles, Branches, or Position Titles)
2. Click "Add New Value" button
3. Enter the value name
4. Click "Add" or press Enter

### Deleting a Value

1. Find the value in the table
2. Click the delete (trash) icon on the right
3. Confirm the deletion

### Reordering Values

1. Use the up/down arrow buttons to move values
2. The display order updates automatically
3. This affects the order shown in dropdowns throughout the application

### Activating/Deactivating Values

1. Click on the status chip (Active/Inactive)
2. The status toggles immediately
3. Inactive values won't appear in dropdowns but are preserved in the database

## Technical Details

### Backend

**Model**: `TeamRosterPicklist.js`
- Stores picklist type and values
- Tracks modification history
- Supports active/inactive status

**API Endpoints**:
- `GET /api/v1/team-roster-picklists` - Get all picklists
- `GET /api/v1/team-roster-picklists/:type` - Get specific picklist
- `PUT /api/v1/team-roster-picklists/:type` - Update picklist
- `POST /api/v1/team-roster-picklists/:type/values` - Add value
- `DELETE /api/v1/team-roster-picklists/:type/values/:valueId` - Delete value
- `POST /api/v1/team-roster-picklists/initialize` - Initialize defaults

### Frontend

**Component**: `TeamRosterPicklistManagement.tsx`
- Tabbed interface for each picklist type
- Real-time updates
- Drag-and-drop reordering (via arrow buttons)
- Inline status toggling

**Service**: `teamRosterPicklistService.ts`
- TypeScript interfaces
- API integration
- Error handling

### Database Schema

```javascript
{
  type: String,           // 'role', 'branch', or 'positionTitle'
  values: [{
    value: String,        // The actual value
    isActive: Boolean,    // Active/Inactive status
    displayOrder: Number  // Sort order
  }],
  lastModified: Date,
  modifiedBy: String
}
```

## Initialization

To initialize default picklists:

```bash
node initialize-team-roster-picklists.js
```

This creates the three default picklists with standard USCIS values.

## Integration with Team Roster

The Team Roster edit dialog automatically fetches active values from these picklists to populate the Role and Branch dropdowns. When you add or modify picklist values, they immediately become available in the Team Roster interface.

## Best Practices

1. **Don't Delete, Deactivate**: Instead of deleting values that are in use, deactivate them to preserve historical data
2. **Meaningful Names**: Use clear, descriptive names that users will understand
3. **Consistent Ordering**: Keep related items grouped together in the display order
4. **Regular Review**: Periodically review and clean up unused values
5. **Document Changes**: The system tracks who made changes and when for audit purposes

## Accessibility

- ✅ Section 508 compliant
- ✅ Keyboard navigation support
- ✅ Screen reader friendly
- ✅ ARIA labels on all interactive elements
- ✅ High contrast color scheme

## Future Enhancements

Potential future features:
- Bulk import/export of picklist values
- Value usage statistics (how many team members use each value)
- Validation rules (prevent deletion of values in use)
- Multi-language support
- Custom picklist types

## Support

For questions or issues with picklist management, contact the Data Strategy Support Services team.

---

*Last Updated: September 30, 2025*
