---
title: "Paper Collection"
type: page
date: 2025-01-07
---

# 📚 Awesome Papers Collection

A curated collection of papers in my research areas: Medical Imaging, 3D Reconstruction & Gaussian Splatting, updated regularly through automated review workflow.

<div class="stats-bar">
  <span class="stat-item">📚 Total Papers: <strong>{{ len site.Data.papers.papers }}</strong></span>
  <span class="stat-item">🗂️ Categories: <strong>{{ len site.Data.papers.categories }}</strong></span>
  <span class="stat-item">⭐ Starred: <strong>{{ len (where site.Data.papers.papers "starred" true) }}</strong></span>
  <span class="stat-item">🕐 Last Updated: <strong>{{ site.Data.papers.metadata.last_updated }}</strong></span>
</div>

---

## 🔍 Quick Navigation

<div class="category-nav">
{{- range site.Data.papers.categories -}}
  <a href="#{{ .id }}" class="category-badge" style="background-color: {{ .color }};">{{ .icon }} {{ .name }}</a>
{{- end -}}
</div>

<div style="text-align: center; margin: 30px 0;">
  <a href="https://github.com/windrise/windrise.github.io/issues?q=is%3Aissue+label%3Apaper-review" target="_blank" rel="noopener" style="display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; transition: all 0.3s;">
    🔍 Review Pending Papers →
  </a>
</div>

---

{{< all-papers >}}

---

## 🔄 Automated Paper Collection System

<div class="info-box">
  <h3>🤖 How It Works</h3>
  <p>This collection is powered by an automated workflow:</p>
  <ul>
    <li>📡 <strong>Daily arXiv Scan:</strong> Automatically fetches latest papers matching research keywords</li>
    <li>🎯 <strong>Smart Filtering:</strong> AI-powered relevance scoring based on research interests</li>
    <li>💬 <strong>AI Summaries:</strong> Automatic generation of paper summaries and key contributions</li>
    <li>👥 <strong>GitHub Review:</strong> Papers are posted as issues for manual approval</li>
    <li>✅ <strong>Auto-Update:</strong> Approved papers are automatically added to this page</li>
    <li>⭐ <strong>Categorization:</strong> Smart categorization based on content analysis</li>
  </ul>
</div>

---

## 📮 Contribute

Have a paper to recommend? You can:
- 🔍 [Review pending papers](https://github.com/windrise/windrise.github.io/issues?q=is%3Aissue+label%3Apaper-review) and approve them
- 📝 [Open an issue](https://github.com/windrise/windrise.github.io/issues/new) to suggest a paper
- 💬 Contact me directly with recommendations

<style>
.stats-bar {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
  padding: 25px;
  border-radius: 12px;
  margin: 30px 0;
  border: 1px solid #e0e0e0;
}

.stat-item {
  font-size: 1em;
  color: #555;
  padding: 5px 15px;
}

.stat-item strong {
  color: #667eea;
  font-size: 1.3em;
  display: block;
  margin-top: 5px;
}

.category-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin: 30px 0;
  justify-content: center;
}

.category-badge {
  display: inline-block;
  padding: 10px 20px;
  color: white !important;
  border-radius: 20px;
  text-decoration: none;
  font-size: 0.95em;
  font-weight: 600;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.category-badge:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(0,0,0,0.2);
}

.info-box {
  background: linear-gradient(135deg, #667eea08 0%, #764ba208 100%);
  border-left: 4px solid #667eea;
  padding: 30px;
  border-radius: 12px;
  margin: 40px 0;
}

.info-box h3 {
  margin-top: 0;
  color: #667eea;
  font-size: 1.5em;
}

.info-box ul {
  list-style: none;
  padding-left: 0;
}

.info-box li {
  padding: 12px 0;
  border-bottom: 1px solid #e0e0e0;
  line-height: 1.6;
}

.info-box li:last-child {
  border-bottom: none;
}

.info-box strong {
  color: #667eea;
}
</style>
