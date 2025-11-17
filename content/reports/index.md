---
title: "Research Reports"
type: page
date: 2025-01-17
---

<link rel="stylesheet" href="/css/papers-dark-mode.css">

# 📊 Research Reports

Automated weekly and monthly summaries of your paper collection activity.

<div class="reports-container">
  <div class="report-selector">
    <div class="selector-tabs">
      <button class="tab-btn active" data-tab="weekly" onclick="switchTab('weekly')">
        📅 Weekly Reports
      </button>
      <button class="tab-btn" data-tab="monthly" onclick="switchTab('monthly')">
        📆 Monthly Reports
      </button>
      <button class="tab-btn" data-tab="trending" onclick="switchTab('trending')">
        🔥 Trending Papers
      </button>
    </div>
  </div>

  <!-- Weekly Reports Tab -->
  <div id="weekly-tab" class="tab-content active">
    <div class="report-header">
      <h2>Weekly Summary</h2>
      <p class="report-description">
        Highlights from the past week including new papers, citation updates, and trending research.
      </p>
    </div>

    <div id="weekly-content" class="report-content">
      <div class="loading-state">
        <div class="spinner-large"></div>
        <p>Loading weekly report...</p>
      </div>
    </div>
  </div>

  <!-- Monthly Reports Tab -->
  <div id="monthly-tab" class="tab-content">
    <div class="report-header">
      <h2>Monthly Summary</h2>
      <p class="report-description">
        Comprehensive monthly overview of collection growth, top papers, and research trends.
      </p>
    </div>

    <div id="monthly-content" class="report-content">
      <div class="loading-state">
        <div class="spinner-large"></div>
        <p>Loading monthly report...</p>
      </div>
    </div>
  </div>

  <!-- Trending Papers Tab -->
  <div id="trending-tab" class="tab-content">
    <div class="report-header">
      <h2>Trending Papers</h2>
      <p class="report-description">
        Recent papers with significant citations and impact in your collection.
      </p>
    </div>

    <div id="trending-content" class="report-content">
      <div class="loading-state">
        <div class="spinner-large"></div>
        <p>Loading trending papers...</p>
      </div>
    </div>
  </div>
</div>

---

## 🤖 Automated Generation

Reports are automatically generated through GitHub Actions:
- **Weekly**: Every Monday at 10 AM UTC
- **Monthly**: First day of each month at 10 AM UTC

Check the `/reports` directory for archived reports.

<style>
.reports-container {
  max-width: 1000px;
  margin: 0 auto;
}

.report-selector {
  margin-bottom: 30px;
}

.selector-tabs {
  display: flex;
  gap: 10px;
  border-bottom: 2px solid #e0e0e0;
  flex-wrap: wrap;
}

.tab-btn {
  background: transparent;
  border: none;
  padding: 15px 30px;
  font-size: 1em;
  font-weight: 600;
  color: #666;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  transition: all 0.2s;
  white-space: nowrap;
}

.tab-btn:hover {
  color: #667eea;
}

.tab-btn.active {
  color: #667eea;
  border-bottom-color: #667eea;
}

.tab-content {
  display: none;
}

.tab-content.active {
  display: block;
  animation: fadeIn 0.3s;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.report-header {
  margin-bottom: 30px;
}

.report-header h2 {
  color: #667eea;
  margin-bottom: 10px;
}

.report-description {
  color: #666;
  font-size: 1.05em;
  line-height: 1.6;
}

.report-content {
  background: linear-gradient(135deg, #667eea08 0%, #764ba208 100%);
  border-radius: 12px;
  padding: 30px;
  border: 1px solid #e0e0e0;
  min-height: 400px;
}

.loading-state {
  text-align: center;
  padding: 60px 20px;
}

.spinner-large {
  display: inline-block;
  width: 60px;
  height: 60px;
  border: 6px solid #f3f3f3;
  border-top: 6px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-state p {
  margin-top: 20px;
  color: #666;
  font-size: 1.1em;
}

.report-section {
  margin-bottom: 40px;
}

.report-section h3 {
  color: #667eea;
  margin-bottom: 20px;
  font-size: 1.3em;
  display: flex;
  align-items: center;
  gap: 10px;
}

.stat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin: 20px 0;
}

.stat-box {
  background: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  border-left: 4px solid #667eea;
  transition: transform 0.2s;
}

.stat-box:hover {
  transform: translateY(-3px);
}

.stat-value {
  font-size: 2.5em;
  font-weight: 700;
  color: #667eea;
  display: block;
}

.stat-label {
  font-size: 0.9em;
  color: #666;
  margin-top: 5px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.paper-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.paper-card {
  background: white;
  border-left: 4px solid #667eea;
  padding: 20px;
  border-radius: 8px;
  transition: all 0.2s;
}

.paper-card:hover {
  background: #f9f9f9;
  transform: translateX(5px);
}

.paper-card-title {
  font-weight: 700;
  color: #333;
  font-size: 1.1em;
  margin-bottom: 10px;
}

.paper-card-meta {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  font-size: 0.9em;
  color: #666;
  margin-bottom: 10px;
}

.paper-card-summary {
  color: #555;
  line-height: 1.6;
  margin-top: 10px;
}

.trend-badge {
  display: inline-block;
  padding: 4px 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
  font-size: 0.85em;
  font-weight: 600;
}

.no-data {
  text-align: center;
  padding: 60px 20px;
  color: #999;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .selector-tabs {
    border-bottom-color: #444;
  }

  .tab-btn {
    color: #aaa;
  }

  .tab-btn:hover, .tab-btn.active {
    color: #667eea;
  }

  .report-content {
    background: linear-gradient(135deg, #667eea20 0%, #764ba220 100%);
    border-color: #444;
  }

  .stat-box, .paper-card {
    background: #2a2a2a;
    border-color: #667eea;
  }

  .paper-card:hover {
    background: #333;
  }

  .paper-card-title {
    color: #e0e0e0;
  }

  .paper-card-meta, .stat-label {
    color: #aaa;
  }

  .paper-card-summary {
    color: #ccc;
  }
}
</style>

<script>
let currentTab = 'weekly';

function switchTab(tabName) {
  // Hide all tabs
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.remove('active');
  });
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });

  // Show selected tab
  document.getElementById(tabName + '-tab').classList.add('active');
  document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

  currentTab = tabName;

  // Load content if not already loaded
  const contentId = tabName + '-content';
  const content = document.getElementById(contentId);

  if (content.innerHTML.includes('loading-state')) {
    loadReportContent(tabName);
  }
}

async function loadReportContent(reportType) {
  const contentId = reportType + '-content';
  const container = document.getElementById(contentId);

  try {
    // TODO: Replace with actual API endpoint or pre-generated report files
    // For now, show placeholder
    setTimeout(() => {
      container.innerHTML = generatePlaceholderContent(reportType);
    }, 1000);

    /* Actual implementation:
    const response = await fetch(`/reports/${reportType}-latest.json`);
    const data = await response.json();
    container.innerHTML = renderReport(data, reportType);
    */

  } catch (error) {
    container.innerHTML = `
      <div class="no-data">
        <p>Report not available yet.</p>
        <p style="font-size: 0.9em; margin-top: 10px;">
          Reports are generated automatically by GitHub Actions.
        </p>
      </div>
    `;
  }
}

function generatePlaceholderContent(reportType) {
  if (reportType === 'weekly') {
    return `
      <div class="report-section">
        <h3>📊 This Week's Overview</h3>
        <div class="stat-grid">
          <div class="stat-box">
            <span class="stat-value">5</span>
            <span class="stat-label">New Papers</span>
          </div>
          <div class="stat-box">
            <span class="stat-value">12</span>
            <span class="stat-label">Citation Updates</span>
          </div>
          <div class="stat-box">
            <span class="stat-value">3</span>
            <span class="stat-label">Trending Topics</span>
          </div>
        </div>
      </div>

      <div class="report-section">
        <h3>📄 New Papers Added</h3>
        <div class="paper-list">
          <div class="paper-card">
            <div class="paper-card-title">Sample Paper Title</div>
            <div class="paper-card-meta">
              <span>📅 2025</span>
              <span>🏛️ CVPR</span>
              <span>📝 45 citations</span>
            </div>
            <div class="paper-card-summary">
              This is a placeholder. Actual reports will be generated automatically.
            </div>
          </div>
        </div>
      </div>

      <div class="no-data" style="margin-top: 40px;">
        <p>🔄 Reports are generated automatically every week</p>
        <p style="font-size: 0.9em; margin-top: 10px; color: #666;">
          Run <code>python scripts/generate_summary_report.py --period week</code> to generate a report manually.
        </p>
      </div>
    `;
  } else if (reportType === 'monthly') {
    return `
      <div class="report-section">
        <h3>📊 Monthly Overview</h3>
        <div class="stat-grid">
          <div class="stat-box">
            <span class="stat-value">18</span>
            <span class="stat-label">Papers Added</span>
          </div>
          <div class="stat-box">
            <span class="stat-value">247</span>
            <span class="stat-label">Total Citations</span>
          </div>
          <div class="stat-box">
            <span class="stat-value">8</span>
            <span class="stat-label">Categories</span>
          </div>
        </div>
      </div>

      <div class="no-data" style="margin-top: 40px;">
        <p>🔄 Reports are generated automatically every month</p>
        <p style="font-size: 0.9em; margin-top: 10px; color: #666;">
          Run <code>python scripts/generate_summary_report.py --period month</code> to generate a report manually.
        </p>
      </div>
    `;
  } else {
    return `
      <div class="report-section">
        <h3>🔥 Trending Papers</h3>
        <div class="paper-list">
          <div class="paper-card">
            <div class="paper-card-title">Sample Trending Paper</div>
            <div class="paper-card-meta">
              <span class="trend-badge">↗ +25 citations</span>
              <span>📅 2024</span>
              <span>🏛️ ICCV</span>
              <span>📝 150 citations</span>
            </div>
            <div class="paper-card-summary">
              This is a placeholder for trending papers analysis.
            </div>
          </div>
        </div>
      </div>

      <div class="no-data" style="margin-top: 40px;">
        <p>🔄 Trending analysis updates daily</p>
        <p style="font-size: 0.9em; margin-top: 10px; color: #666;">
          Run <code>python scripts/paper_recommender.py --trending</code> to see current trends.
        </p>
      </div>
    `;
  }
}

// Load weekly report by default
document.addEventListener('DOMContentLoaded', () => {
  loadReportContent('weekly');
});
</script>
