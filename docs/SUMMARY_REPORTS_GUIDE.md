# Summary Reports Guide

## 📊 Overview

The Summary Reports system automatically generates comprehensive weekly and monthly reports about your paper collection, including statistics, trends, and highlights.

## 🎯 Features

- ✅ **Weekly Reports**: Analyze papers added in the past 7 days
- ✅ **Monthly Reports**: Comprehensive analysis of the past 30 days
- ✅ **Automatic Generation**: GitHub Actions workflows run on schedule
- ✅ **Rich Statistics**: Category distribution, venue analysis, citation trends
- ✅ **Top Papers**: Highlights most cited and impactful papers
- ✅ **Citation Growth Tracking**: Shows papers with increasing citations
- ✅ **Markdown Format**: Easy to read and share
- ✅ **Standalone Tool**: No UI dependencies, pure reporting

## 🚀 Quick Start

### Generate Reports Manually

#### Weekly Report

```bash
# Generate and save to reports/ directory
python scripts/generate_summary_report.py --period week

# Print to console
python scripts/generate_summary_report.py --period week --print
```

#### Monthly Report

```bash
# Generate and save to reports/ directory
python scripts/generate_summary_report.py --period month

# Print to console
python scripts/generate_summary_report.py --period month --print
```

#### Both Reports

```bash
# Generate both weekly and monthly reports
python scripts/generate_summary_report.py --period both
```

### Custom Output Directory

```bash
# Save to custom directory
python scripts/generate_summary_report.py --period week --output-dir my_reports
```

## 📅 Automated Reports

Two GitHub Actions workflows automatically generate reports:

### Weekly Reports
- **Schedule**: Every Monday at 10:00 AM UTC (6:00 PM Beijing time)
- **Workflow**: `.github/workflows/weekly-summary-report.yml`
- **Output**: `reports/weekly_report_YYYY-MM-DD.md`

### Monthly Reports
- **Schedule**: First day of each month at 10:00 AM UTC (6:00 PM Beijing time)
- **Workflow**: `.github/workflows/monthly-summary-report.yml`
- **Output**: `reports/monthly_report_YYYY-MM-DD.md`

### Manual Trigger

You can also manually trigger report generation from GitHub Actions:

1. Go to **Actions** tab in your repository
2. Select **Weekly Summary Report** or **Monthly Summary Report**
3. Click **Run workflow**

## 📋 Report Contents

Each report includes the following sections:

### 1. Overview
- Total papers in collection
- New papers added in the period
- Total citations
- Average citations per paper

### 2. New Papers
Detailed listing of all papers added during the period:
- Title and authors
- Venue and year
- Categories
- Summary/abstract preview
- Links to paper, code, project page

### 3. Category Distribution
- New papers by category (for the period)
- Overall collection by category (with percentages)

### 4. Top Venues
- Most common publication venues for new papers

### 5. Top Papers by Citations
- Top 10 most cited papers in your collection

### 6. Citation Growth
- Papers with significant citation increases
- Shows citation delta and current total

### 7. Research Highlights
- Starred papers from the period
- Papers you've marked as important

### 8. Recommendations
Automated suggestions based on collection analysis:
- Alerts if no papers were added
- Highlights high-impact papers
- Notes on very recent (uncited) papers

## 📊 Example Report

```markdown
# Weekly Paper Collection Summary

**Report Period:** 2025-11-09 to 2025-11-16

**Generated:** 2025-11-16 14:42:30

---

## 📊 Overview

- **Total Papers in Collection:** 11
- **New Papers This Week:** 10
- **Total Citations:** 0
- **Average Citations per Paper:** 0.0

---

## 🆕 New Papers Added This Week

Added 10 new papers:

### 1. SemanticVLA: Semantic-Aligned Sparsification...

- **Authors:** Wei Li, Renshan Zhang, Rui Shao et al.
- **Venue:** arXiv (2025)
- **Added:** 2025-11-16
- **Categories:** 3D Gaussian Splatting

[Summary preview...]

**Links:** [Paper](http://arxiv.org/abs/...) | [Code](...)

...
```

## 🔧 Command-Line Options

```bash
python scripts/generate_summary_report.py --help

Options:
  --papers-yaml PAPERS_YAML
                        Path to papers.yaml file
                        (default: data/papers/papers.yaml)

  --period {week,month,both}
                        Report period
                        (default: week)

  --output-dir OUTPUT_DIR
                        Output directory for reports
                        (default: reports)

  --print               Print report to stdout instead of saving
```

## 📈 Use Cases

### 1. Weekly Research Updates

Generate weekly reports to track your research progress:

```bash
# Every Monday
python scripts/generate_summary_report.py --period week
```

Review the report to:
- See what papers you added this week
- Check citation growth
- Identify trending topics in your collection

### 2. Monthly Progress Review

Generate comprehensive monthly reports:

```bash
# First day of each month
python scripts/generate_summary_report.py --period month
```

Use for:
- Monthly research meetings
- Progress tracking
- Identifying research trends over time

### 3. Share with Team

Generate reports and share with collaborators:

```bash
# Generate both reports
python scripts/generate_summary_report.py --period both

# Reports saved to reports/ directory
# Share via email, Slack, or commit to repository
```

### 4. Custom Analysis

Use reports as basis for custom analysis:

```bash
# Generate report to console
python scripts/generate_summary_report.py --period month --print > analysis.md

# Process with other tools
cat analysis.md | grep "Citations:"
```

## 🎨 Report Customization

### Modify Report Content

Edit `scripts/generate_summary_report.py` to customize:

1. **Top Papers Count**: Change `n=10` in `_get_top_papers()`
2. **Preview Length**: Modify `[:200]` in summary preview
3. **Add New Sections**: Extend `_generate_report()` method
4. **Change Date Ranges**: Modify `_get_date_range()` method

### Example: Add Custom Section

```python
# In generate_summary_report.py, add to _generate_report():

lines.append("## 🔥 Trending Topics\n")
# Your custom analysis here
```

## 📁 Report Storage

Reports are saved to the `reports/` directory with naming convention:

- Weekly: `weekly_report_YYYY-MM-DD.md`
- Monthly: `monthly_report_YYYY-MM-DD.md`

Example structure:
```
reports/
├── weekly_report_2025-11-16.md
├── weekly_report_2025-11-09.md
├── monthly_report_2025-11-01.md
└── monthly_report_2025-10-01.md
```

## 🔄 Integration with Other Tools

### Citation Tracking

Reports automatically use citation data from `citation_tracker.py`:

```bash
# Update citations first
python scripts/citation_tracker.py

# Then generate report with latest data
python scripts/generate_summary_report.py --period week
```

### Q&A System

Use reports to inform your searches:

```bash
# Generate report
python scripts/generate_summary_report.py --period week

# Use highlighted papers in Q&A
python scripts/query_papers.py -q "papers about [topic from report]"
```

## 🐛 Troubleshooting

### No papers in report

**Cause**: No papers added in the date range

**Solution**:
- Check `date_added` field in papers.yaml
- Verify date range with `--print` option
- Run paper collection pipeline

### Missing citation data

**Cause**: Citation tracking not run recently

**Solution**:
```bash
python scripts/citation_tracker.py
python scripts/generate_summary_report.py --period week
```

### Empty categories

**Cause**: Papers don't have category assignments

**Solution**: Ensure papers in papers.yaml have `categories` field

## 📊 Sample Workflows

### Weekly Research Routine

```bash
# Monday morning routine
python scripts/citation_tracker.py          # Update citations
python scripts/generate_summary_report.py   # Generate weekly report
cat reports/weekly_report_*.md | tail -100  # Quick review
```

### Monthly Deep Dive

```bash
# First of the month
python scripts/citation_tracker.py --force       # Force citation update
python scripts/generate_summary_report.py --period month
python scripts/generate_summary_report.py --period week  # Also weekly
```

### Custom Time Ranges

To analyze custom date ranges, modify the script or use git to compare reports:

```bash
# Generate current report
python scripts/generate_summary_report.py --period month

# Compare with previous month
git show HEAD~1:reports/monthly_report_*.md
```

## 🎯 Best Practices

1. **Regular Generation**: Run weekly reports every Monday for consistency
2. **Review Promptly**: Check reports soon after generation while context is fresh
3. **Archive Reports**: Keep reports in git for historical tracking
4. **Combine with Citation Updates**: Always update citations before generating reports
5. **Star Important Papers**: Use `starred: true` to highlight papers in reports
6. **Add Notes**: Add `notes` field to papers for personalized highlights

## 🔮 Future Enhancements

Planned improvements:

- [ ] **Email Reports**: Automatic email delivery
- [ ] **Slack Integration**: Post reports to Slack channels
- [ ] **Charts and Graphs**: Add visualizations (PNG/SVG)
- [ ] **Comparative Analysis**: Compare periods (this week vs last week)
- [ ] **Custom Filters**: Generate reports for specific categories/venues
- [ ] **Export Formats**: PDF, HTML, JSON output options
- [ ] **Interactive Reports**: Web-based interactive dashboard

## 📚 Additional Resources

- [Citation Tracker Guide](PRIORITY1_FEATURES.md#citation-tracking)
- [Q&A System Guide](QA_SYSTEM_GUIDE.md)
- [Paper Automation Plan](PAPER_AUTOMATION_PLAN.md)

---

**Note**: This is a standalone feature that works independently of the Hugo UI. Reports are pure Markdown files that can be viewed, shared, or processed however you like.
