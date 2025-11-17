---
title: "Collection Analytics"
type: page
date: 2025-01-17
---

<link rel="stylesheet" href="/css/papers-dark-mode.css">

# 📊 Paper Collection Analytics

Real-time insights and statistics about your research paper collection.

<div id="analytics-loading" style="text-align: center; padding: 50px;">
  <div style="display: inline-block; width: 50px; height: 50px; border: 5px solid #f3f3f3; border-top: 5px solid #667eea; border-radius: 50%; animation: spin 1s linear infinite;"></div>
  <p style="margin-top: 20px; color: #666;">Loading analytics data...</p>
</div>

<div id="analytics-content" style="display: none;">

## 📈 Overview

<div class="stats-grid">
  <div class="stat-card">
    <div class="stat-icon">📚</div>
    <div class="stat-value" id="total-papers">0</div>
    <div class="stat-label">Total Papers</div>
  </div>
  <div class="stat-card">
    <div class="stat-icon">📝</div>
    <div class="stat-value" id="total-citations">0</div>
    <div class="stat-label">Total Citations</div>
  </div>
  <div class="stat-card">
    <div class="stat-icon">👥</div>
    <div class="stat-value" id="unique-authors">0</div>
    <div class="stat-label">Unique Authors</div>
  </div>
  <div class="stat-card">
    <div class="stat-icon">🏛️</div>
    <div class="stat-value" id="unique-venues">0</div>
    <div class="stat-label">Venues</div>
  </div>
  <div class="stat-card">
    <div class="stat-icon">⭐</div>
    <div class="stat-value" id="starred-papers">0</div>
    <div class="stat-label">Starred Papers</div>
  </div>
  <div class="stat-card">
    <div class="stat-icon">📅</div>
    <div class="stat-value" id="year-range">-</div>
    <div class="stat-label">Year Range</div>
  </div>
</div>

---

## 📚 Category Distribution

<div id="category-chart" class="chart-container"></div>

---

## 📅 Papers Over Time

<div id="timeline-chart" class="chart-container"></div>

---

## 🏛️ Top Venues

<div id="venue-chart" class="chart-container"></div>

---

## 📈 Citation Distribution

<div id="citation-chart" class="chart-container"></div>

---

## 👥 Top Authors

<div class="author-section">
  <div class="author-column">
    <h3>By Paper Count</h3>
    <div id="authors-by-papers" class="author-list"></div>
  </div>
  <div class="author-column">
    <h3>By Total Citations</h3>
    <div id="authors-by-citations" class="author-list"></div>
  </div>
</div>

---

## 🌟 Top Cited Papers

<div id="top-papers" class="papers-list"></div>

<p style="text-align: right; color: #999; margin-top: 30px; font-size: 0.85em;">
  Last updated: <span id="last-updated">-</span>
</p>

</div>

<style>
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin: 30px 0;
}

.stat-card {
  background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 25px;
  text-align: center;
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.2);
}

.stat-icon {
  font-size: 2.5em;
  margin-bottom: 10px;
}

.stat-value {
  font-size: 2.5em;
  font-weight: 700;
  color: #667eea;
  margin: 10px 0;
}

.stat-label {
  font-size: 0.95em;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.chart-container {
  background: linear-gradient(135deg, #667eea08 0%, #764ba208 100%);
  border-radius: 12px;
  padding: 30px;
  margin: 20px 0;
  border: 1px solid #e0e0e0;
}

.bar-chart {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.bar-item {
  display: flex;
  align-items: center;
  gap: 15px;
}

.bar-label {
  min-width: 150px;
  font-weight: 600;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.bar-wrapper {
  flex: 1;
  background: #f0f0f0;
  border-radius: 5px;
  height: 30px;
  position: relative;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 5px;
  transition: width 0.5s ease;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 10px;
  color: white;
  font-weight: 600;
  font-size: 0.9em;
}

.author-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin: 20px 0;
}

.author-column h3 {
  color: #667eea;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #667eea;
}

.author-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.author-item {
  background: linear-gradient(135deg, #667eea08 0%, #764ba208 100%);
  border-left: 3px solid #667eea;
  padding: 12px 15px;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: transform 0.2s;
}

.author-item:hover {
  transform: translateX(5px);
  background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
}

.author-name {
  font-weight: 600;
  color: #333;
}

.author-count {
  color: #667eea;
  font-weight: 700;
  font-size: 1.1em;
}

.papers-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.paper-item {
  background: linear-gradient(135deg, #667eea08 0%, #764ba208 100%);
  border-left: 4px solid #667eea;
  padding: 20px;
  border-radius: 8px;
  transition: all 0.2s;
}

.paper-item:hover {
  background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
  transform: translateX(5px);
}

.paper-title {
  font-weight: 700;
  font-size: 1.1em;
  color: #333;
  margin-bottom: 10px;
}

.paper-meta {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  font-size: 0.9em;
  color: #666;
}

.paper-meta span {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.paper-citations {
  color: #667eea;
  font-weight: 700;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .stat-card, .chart-container, .author-item, .paper-item {
    background: linear-gradient(135deg, #667eea20 0%, #764ba220 100%);
    border-color: #444;
  }

  .stat-label, .bar-label, .author-name, .paper-title, .paper-meta {
    color: #e0e0e0;
  }

  .bar-wrapper {
    background: #333;
  }
}
</style>

<script>
// Load and display analytics data
async function loadAnalytics() {
  try {
    const response = await fetch('/data/analytics.json');
    const data = await response.json();

    // Hide loading, show content
    document.getElementById('analytics-loading').style.display = 'none';
    document.getElementById('analytics-content').style.display = 'block';

    // Update overview stats
    document.getElementById('total-papers').textContent = data.overview.total_papers;
    document.getElementById('total-citations').textContent = data.overview.citations.total;
    document.getElementById('unique-authors').textContent = data.overview.unique_authors;
    document.getElementById('unique-venues').textContent = data.overview.unique_venues;
    document.getElementById('starred-papers').textContent = data.overview.starred_papers;
    document.getElementById('year-range').textContent =
      `${data.overview.year_range.min} - ${data.overview.year_range.max}`;

    // Update last updated
    const updateTime = new Date(data.overview.generated_at);
    document.getElementById('last-updated').textContent = updateTime.toLocaleString();

    // Render charts
    renderBarChart('category-chart', data.categories.map(c => ({
      label: c.name,
      value: c.count,
      color: c.color
    })), 'Papers');

    renderTimelineChart('timeline-chart', data.timeline);

    renderBarChart('venue-chart', data.venues.map(v => ({
      label: v.name,
      value: v.count
    })), 'Papers');

    renderBarChart('citation-chart', data.citations.map(c => ({
      label: c.range,
      value: c.count
    })), 'Papers');

    // Render authors
    renderAuthors('authors-by-papers', data.authors.by_papers, 'count');
    renderAuthors('authors-by-citations', data.authors.by_citations, 'citations');

    // Render top papers
    renderTopPapers('top-papers', data.top_papers);

  } catch (error) {
    console.error('Error loading analytics:', error);
    document.getElementById('analytics-loading').innerHTML =
      '<p style="color: red;">Error loading analytics data. Please try again later.</p>';
  }
}

function renderBarChart(containerId, data, valueLabel) {
  const container = document.getElementById(containerId);
  if (!container || !data || data.length === 0) return;

  const maxValue = Math.max(...data.map(d => d.value));

  const html = `
    <div class="bar-chart">
      ${data.map(item => `
        <div class="bar-item">
          <div class="bar-label" title="${item.label}">${item.label}</div>
          <div class="bar-wrapper">
            <div class="bar-fill" style="width: ${(item.value / maxValue * 100)}%; ${item.color ? `background: ${item.color};` : ''}">
              ${item.value}
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  container.innerHTML = html;
}

function renderTimelineChart(containerId, data) {
  const container = document.getElementById(containerId);
  if (!container || !data || data.length === 0) return;

  const maxValue = Math.max(...data.map(d => d.count));

  const html = `
    <div class="bar-chart">
      ${data.map(item => `
        <div class="bar-item">
          <div class="bar-label">${item.year}</div>
          <div class="bar-wrapper">
            <div class="bar-fill" style="width: ${(item.count / maxValue * 100)}%;">
              ${item.count} ${item.count === 1 ? 'paper' : 'papers'}
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  container.innerHTML = html;
}

function renderAuthors(containerId, authors, valueKey) {
  const container = document.getElementById(containerId);
  if (!container || !authors || authors.length === 0) return;

  const html = authors.map((author, index) => `
    <div class="author-item">
      <span class="author-name">${index + 1}. ${author.name}</span>
      <span class="author-count">${author[valueKey]}</span>
    </div>
  `).join('');

  container.innerHTML = html;
}

function renderTopPapers(containerId, papers) {
  const container = document.getElementById(containerId);
  if (!container || !papers || papers.length === 0) return;

  const html = papers.map((paper, index) => `
    <div class="paper-item">
      <div class="paper-title">${index + 1}. ${paper.title}</div>
      <div class="paper-meta">
        <span>📅 ${paper.year || 'N/A'}</span>
        ${paper.venue ? `<span>🏛️ ${paper.venue}</span>` : ''}
        <span class="paper-citations">📝 ${paper.citations} citations</span>
        ${paper.authors && paper.authors.length > 0 ?
          `<span>👥 ${paper.authors.join(', ')}${paper.authors.length >= 3 ? ' et al.' : ''}</span>`
          : ''}
      </div>
    </div>
  `).join('');

  container.innerHTML = html;
}

// Load analytics when page loads
document.addEventListener('DOMContentLoaded', loadAnalytics);
</script>
