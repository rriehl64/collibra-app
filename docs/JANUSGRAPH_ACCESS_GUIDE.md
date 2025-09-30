# JanusGraph Visualization - Access Guide

**Last Updated**: September 30, 2025  
**Application**: USCIS Data Literacy Support Platform  
**Feature**: JanusGraph Graph Database Visualization

---

## 🎯 Quick Access

### Method 1: Direct URL (Fastest)

Simply navigate to:
```
http://localhost:3008/admin/janusgraph
```

### Method 2: Application Menu (Recommended)

1. **Login** to the application at `http://localhost:3008`
   - Use admin credentials: `admin@example.com` / `admin123!`
   - Or data-steward: `steward@example.com` / `password123`

2. **Navigate** to the menu:
   - Look for **"Administration"** section in the left sidebar
   - Click on **"JanusGraph Visualization"**

3. **Explore** the features:
   - Interactive graph visualization
   - Custom Gremlin queries
   - Pre-built USCIS use cases
   - Data lineage and network analysis

---

## 📋 Menu Configuration

### Current Status

✅ **Menu Item**: Enabled  
✅ **Menu ID**: `janusgraph`  
✅ **Display Name**: "JanusGraph Visualization"  
✅ **Path**: `/admin/janusgraph`  
✅ **Category**: Administration  
✅ **Required Role**: Admin (also accessible to data-steward)  
✅ **Order**: 85 (appears in administration section)

### Verify Menu Status

To check if the menu item is enabled in your database:

```bash
# Run the menu initialization script
node initialize-janusgraph-menu.js
```

Expected output:
```
✅ MongoDB connected successfully
🚀 Initializing JanusGraph menu item...
ℹ️  JanusGraph menu item already exists
   Current status: Enabled
```

---

## 🔧 Troubleshooting

### Menu Item Not Visible?

**Issue**: JanusGraph menu item doesn't appear in the sidebar

**Solutions**:

1. **Check User Role**:
   - Only `admin` and `data-steward` roles can see this menu
   - Regular users won't have access
   - Verify your role in the application

2. **Refresh Menu Settings**:
   ```bash
   # Re-run the initialization script
   node initialize-janusgraph-menu.js
   ```

3. **Check Database**:
   ```javascript
   // In MongoDB shell or Compass
   use data-literacy-support
   db.menusettings.find({ menuId: 'janusgraph' })
   ```

4. **Restart Application**:
   ```bash
   # Stop the development server (Ctrl+C)
   # Then restart
   npm run dev
   ```

5. **Clear Browser Cache**:
   - Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
   - Or clear browser cache completely

### Page Not Loading?

**Issue**: Clicking menu item shows blank page or error

**Solutions**:

1. **Check Route Registration**:
   - Verify `src/App.tsx` has the route:
   ```typescript
   <Route path="/admin/janusgraph" element={<JanusGraphVisualization />} />
   ```

2. **Check Component Import**:
   - Verify `src/App.tsx` imports the component:
   ```typescript
   import JanusGraphVisualization from './pages/JanusGraphVisualization';
   ```

3. **Check Console for Errors**:
   - Open browser DevTools (F12)
   - Look for JavaScript errors in Console tab
   - Check Network tab for failed API calls

### Mock Mode Message?

**Issue**: Seeing "Mock mode - JanusGraph not connected" message

**This is Normal!** The application is designed to work in mock mode for development:

✅ **Mock Mode Benefits**:
- No JanusGraph server installation required
- Realistic sample data for USCIS use cases
- All features work with mock data
- Perfect for demonstrations and development

**To Use Real JanusGraph** (Optional):
1. Install JanusGraph server (see Implementation Guide)
2. Start Gremlin server: `./bin/janusgraph-server.sh start`
3. Application will auto-detect and connect

---

## 🎨 Features Available

Once you access JanusGraph Visualization, you'll see:

### Tab 1: Graph Visualization
- **Interactive Graph**: Zoom, pan, drag nodes
- **Pre-built Views**: 
  - Immigration Case Network
  - Workflow & Case Management
  - RNA Advanced Analytics
  - Document & Data Lineage
  - Personnel Roles & Access
  - Master Data Management
  - Automated Governance
  - Geospatial Data

### Tab 2: Custom Queries
- **Gremlin Query Interface**: Execute custom graph queries
- **Sample Queries**: Pre-built examples for common use cases
- **Query History**: Track and reuse previous queries
- **Results Display**: Formatted JSON results with metadata

### Tab 3: Statistics
- **Graph Metrics**: Vertex and edge counts
- **Performance Stats**: Query execution times
- **Connection Status**: Real-time server status
- **Data Quality**: Graph health indicators

### Tab 4: DSSS3 Advanced Capabilities (NEW!)
- **Real-Time Impact Analysis**: Policy change impact visualization
- **Advanced Fraud Detection**: Fraud ring identification
- **Intelligent Routing**: Workflow optimization
- **Predictive Analytics**: ML-powered forecasting

---

## 👥 User Roles & Permissions

### Admin Users
✅ Full access to all JanusGraph features  
✅ Can execute custom Gremlin queries  
✅ Can create/modify graph nodes and edges  
✅ Can view all pre-built visualizations  
✅ Can access DSSS3 advanced capabilities  

### Data Steward Users
✅ Full access to all JanusGraph features  
✅ Can execute custom Gremlin queries  
✅ Can view all pre-built visualizations  
✅ Can access DSSS3 advanced capabilities  
⚠️ May have limited write permissions (configurable)

### Regular Users
❌ No access to JanusGraph Visualization  
❌ Menu item not visible  
❌ Direct URL access blocked  

---

## 📊 Sample Use Cases

### Use Case 1: Policy Impact Analysis

**Scenario**: Analyze impact of I-485 evidence policy change

**Steps**:
1. Navigate to **Tab 4: DSSS3 Advanced Capabilities**
2. Click **"Real-Time Impact Analysis"** button (Red)
3. View graph showing:
   - 15,847 affected cases
   - 234 officers requiring training
   - 2 systems needing updates
   - Workflow dependencies

**Result**: Complete impact visualization in <5 seconds

### Use Case 2: Fraud Detection

**Scenario**: Identify suspicious attorney networks

**Steps**:
1. Navigate to **Tab 4: DSSS3 Advanced Capabilities**
2. Click **"Advanced Fraud Detection"** button (Orange)
3. View graph showing:
   - Fraud Ring #1: 23 cases, 94% risk score
   - Fraud Ring #2: 34 cases, 87% risk score
   - Suspicious patterns and connections

**Result**: Automated fraud ring detection with confidence scores

### Use Case 3: Data Lineage

**Scenario**: Trace data from DOS Visa Database to CRIS

**Steps**:
1. Navigate to **Tab 1: Graph Visualization**
2. Click **"Document & Data Lineage"** button
3. View graph showing:
   - Source systems (DOS, FBI, SSA)
   - Transformation steps (OCR, validation)
   - Target systems (CRIS, CLAIMS3)
   - Access audit trail

**Result**: Complete data lineage visualization for compliance

### Use Case 4: Custom Query

**Scenario**: Find all I-485 cases assigned to specific officer

**Steps**:
1. Navigate to **Tab 2: Custom Queries**
2. Enter Gremlin query:
   ```gremlin
   g.V().hasLabel('uscis_personnel')
     .has('name', 'Sarah Johnson')
     .in('ASSIGNED_TO')
     .hasLabel('immigration_case')
     .has('form_type', 'I-485')
     .valueMap()
   ```
3. Click **"Execute Query"**

**Result**: List of all I-485 cases assigned to Sarah Johnson

---

## 🔗 Related Documentation

### For Business Users
- **Strategic Overview**: `/docs/JANUSGRAPH_DSSS3_STRATEGIC_OVERVIEW.md`
- **Executive Briefing**: `/docs/JANUSGRAPH_EXECUTIVE_BRIEFING.md`
- **Documentation Index**: `/docs/JANUSGRAPH_DOCUMENTATION_INDEX.md`

### For Technical Users
- **Implementation Guide**: `/docs/JANUSGRAPH_IMPLEMENTATION_GUIDE.md`
- **DSSS3 Capabilities**: `/docs/JANUSGRAPH_DSSS3_CAPABILITIES.md`
- **API Documentation**: `/server/controllers/janusGraphController.js`

### For Developers
- **Frontend Component**: `/src/pages/JanusGraphVisualization.tsx`
- **Service Layer**: `/src/services/janusGraphService.ts`
- **Backend Controller**: `/server/controllers/janusGraphController.js`
- **Backend Routes**: `/server/routes/janusGraph.js`

---

## 🎓 Training Resources

### Quick Start Tutorial (5 minutes)

1. **Login** as admin
2. **Navigate** to JanusGraph Visualization
3. **Click** "Immigration Case Network" button
4. **Explore** the interactive graph:
   - Zoom: Mouse wheel
   - Pan: Click and drag background
   - Select node: Click on node
   - View details: Check right panel
5. **Try** a custom query in Tab 2
6. **Review** statistics in Tab 3

### Video Tutorials (Coming Soon)

- Introduction to Graph Databases (10 min)
- JanusGraph Visualization Basics (15 min)
- Custom Gremlin Queries (20 min)
- DSSS3 Use Cases Deep Dive (30 min)

### Live Training Sessions

Contact DSSS3 Program Office for:
- Weekly office hours
- One-on-one training
- Team workshops
- Custom use case development

---

## 📞 Support & Contact

### Technical Support
- **Email**: dsss3-support@uscis.dhs.gov
- **Slack**: #janusgraph-support
- **Office Hours**: Monday-Friday, 9 AM - 5 PM EST

### Feature Requests
- **Email**: dsss3-features@uscis.dhs.gov
- **Jira**: Create ticket in DSSS3 project
- **Feedback Form**: Available in application

### Emergency Issues
- **Critical bugs**: Call (202) 555-DSSS (3777)
- **Security concerns**: security@uscis.dhs.gov
- **After hours**: On-call rotation

---

## ✅ Quick Checklist

Before accessing JanusGraph Visualization, ensure:

- [ ] Application is running (`npm run dev`)
- [ ] MongoDB is connected
- [ ] Logged in as admin or data-steward
- [ ] Menu item visible in sidebar
- [ ] Browser cache cleared (if issues)
- [ ] DevTools console checked (if errors)

---

## 🚀 Next Steps

1. **Access** JanusGraph Visualization now
2. **Explore** pre-built visualizations
3. **Try** sample queries
4. **Review** DSSS3 advanced capabilities
5. **Read** strategic documentation
6. **Attend** training session
7. **Provide** feedback

---

**Document Control**  
**Version**: 1.0  
**Last Updated**: September 30, 2025  
**Classification**: For Official Use Only (FOUO)  
**Next Review**: October 30, 2025
