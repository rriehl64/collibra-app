/*
 Generate Monthly Status Reports from Weekly Status data
 Usage:
   node generate-monthly-reports.js --month 8 --year 2025
 Notes:
   - Consolidates weekly status reports into monthly summaries
   - Calculates overall status, hours, and aggregated narratives
   - Creates one monthly report per user per month
*/

const dotenv = require('dotenv');
const mongoose = require('mongoose');
const connectDB = require('./server/config/db');
const WeeklyStatus = require('./server/models/WeeklyStatus');
const MonthlyStatus = require('./server/models/MonthlyStatus');

dotenv.config();

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = { month: 8, year: 2025 }; // Default to August 2025
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--month') opts.month = parseInt(args[++i], 10);
    else if (args[i] === '--year') opts.year = parseInt(args[++i], 10);
  }
  return opts;
}

function getMonthName(month, year) {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return `${monthNames[month - 1]} ${year}`;
}

function calculateOverallStatus(weeklyStatuses) {
  const statusCounts = { red: 0, yellow: 0, green: 0 };
  weeklyStatuses.forEach(ws => {
    statusCounts[ws.status] = (statusCounts[ws.status] || 0) + 1;
  });
  
  // Priority: red > yellow > green
  if (statusCounts.red > 0) return 'red';
  if (statusCounts.yellow > 0) return 'yellow';
  return 'green';
}

function consolidateNarratives(weeklyReports, field) {
  const narratives = weeklyReports
    .map(report => report[field])
    .filter(text => text && text.trim())
    .map((text, index) => `Week ${index + 1}: ${text.trim()}`);
  
  return narratives.length > 0 ? narratives.join('\n\n') : '';
}

function generateExecutiveSummary(user, weeklyReports, overallStatus) {
  const totalWeeks = weeklyReports.length;
  const totalHours = weeklyReports.reduce((sum, report) => sum + (report.hoursWorked || 0), 0);
  const avgHours = totalWeeks > 0 ? Math.round(totalHours / totalWeeks) : 0;
  
  const statusCounts = { red: 0, yellow: 0, green: 0 };
  weeklyReports.forEach(report => {
    statusCounts[report.status] = (statusCounts[report.status] || 0) + 1;
  });
  
  let summary = `${user.name} completed ${totalWeeks} weekly status reports with an overall ${overallStatus.toUpperCase()} status. `;
  summary += `Total hours worked: ${totalHours} (avg ${avgHours}/week). `;
  
  if (statusCounts.red > 0) {
    summary += `${statusCounts.red} week(s) had RED status requiring attention. `;
  }
  if (statusCounts.yellow > 0) {
    summary += `${statusCounts.yellow} week(s) had YELLOW status with minor issues. `;
  }
  if (statusCounts.green > 0) {
    summary += `${statusCounts.green} week(s) had GREEN status with normal progress. `;
  }
  
  return summary.trim();
}

async function run() {
  const { month, year } = parseArgs();
  await connectDB();

  console.log(`Generating Monthly Status Reports for ${getMonthName(month, year)}...`);

  // Get date range for the month
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59, 999);

  console.log(`Date range: ${startDate.toISOString()} to ${endDate.toISOString()}`);

  // Find all weekly reports for the month
  const weeklyReports = await WeeklyStatus.find({
    weekStart: { $gte: startDate, $lte: endDate }
  }).sort({ userId: 1, weekStart: 1 });

  console.log(`Found ${weeklyReports.length} weekly reports`);

  // Group by userId
  const userReports = {};
  weeklyReports.forEach(report => {
    const userId = report.userId.toString();
    if (!userReports[userId]) {
      userReports[userId] = [];
    }
    userReports[userId].push(report);
  });

  const userIds = Object.keys(userReports);
  console.log(`Processing ${userIds.length} users`);

  // Clear existing monthly reports for this month/year
  await MonthlyStatus.deleteMany({ month, year });
  console.log(`Cleared existing monthly reports for ${getMonthName(month, year)}`);

  const monthlyReports = [];

  for (const userId of userIds) {
    const reports = userReports[userId];
    const firstReport = reports[0];
    
    // Calculate aggregated data
    const totalHours = reports.reduce((sum, report) => sum + (report.hoursWorked || 0), 0);
    const avgHours = reports.length > 0 ? Math.round(totalHours / reports.length) : 0;
    
    const weeklyStatuses = reports.map(report => ({
      weekStart: report.weekStart,
      status: report.status
    }));
    
    const overallStatus = calculateOverallStatus(weeklyStatuses);
    
    // Consolidate narratives
    const monthlyAccomplishments = consolidateNarratives(reports, 'accomplishments');
    const monthlyTasksStatus = consolidateNarratives(reports, 'tasksStatus');
    const monthlyIssuesNeeds = consolidateNarratives(reports, 'issuesNeeds');
    const monthlyNextSteps = consolidateNarratives(reports, 'nextSteps');
    const monthlyCommunications = consolidateNarratives(reports, 'communications');
    
    const executiveSummary = generateExecutiveSummary(firstReport, reports, overallStatus);
    
    const monthlyReport = {
      userId: new mongoose.Types.ObjectId(userId),
      name: firstReport.name,
      team: firstReport.team,
      contractNumber: firstReport.contractNumber,
      periodOfPerformance: firstReport.periodOfPerformance,
      supervisor: firstReport.supervisor,
      month,
      year,
      monthName: getMonthName(month, year),
      overallStatus,
      weeklyStatuses,
      totalHoursWorked: totalHours,
      averageHoursPerWeek: avgHours,
      weeksReported: reports.length,
      monthlyAccomplishments,
      monthlyTasksStatus,
      monthlyIssuesNeeds,
      monthlyNextSteps,
      monthlyCommunications,
      executiveSummary,
      weeklyReportIds: reports.map(r => r._id),
      tags: ['monthly-report', `${month}-${year}`],
      createdBy: 'monthly-consolidation-script',
      updatedBy: 'monthly-consolidation-script'
    };
    
    monthlyReports.push(monthlyReport);
  }

  // Insert monthly reports
  try {
    const result = await MonthlyStatus.insertMany(monthlyReports, { ordered: false });
    console.log(`✅ Successfully created ${result.length} monthly status reports`);
    console.log(`📊 ${getMonthName(month, year)} Summary:`);
    console.log(`   - ${userIds.length} users`);
    console.log(`   - ${weeklyReports.length} weekly reports consolidated`);
    console.log(`   - ${result.length} monthly reports generated`);
    
    // Status breakdown
    const statusBreakdown = { red: 0, yellow: 0, green: 0 };
    result.forEach(report => {
      statusBreakdown[report.overallStatus]++;
    });
    console.log(`   - Status: ${statusBreakdown.green} Green, ${statusBreakdown.yellow} Yellow, ${statusBreakdown.red} Red`);
    
  } catch (err) {
    console.error('❌ Insert error:', err.message);
  } finally {
    await mongoose.connection.close();
  }
}

run().catch((e) => {
  console.error('❌ Script error:', e);
  process.exit(1);
});
