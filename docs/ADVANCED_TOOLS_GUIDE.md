# Advanced Tools Guide

Complete guide to the advanced paper management tools including recommendations, batch operations, and analytics.

## 📚 Overview

Three powerful command-line tools for advanced paper management:

1. **Paper Recommender** (`paper_recommender.py`) - Intelligent recommendations
2. **Paper Manager** (`paper_manager.py`) - Batch operations and utilities
3. **Collection Analyzer** (`analyze_collection.py`) - Data analysis and visualization

---

## 🔍 Paper Recommender

Intelligent paper recommendation engine using multiple strategies.

### Features

- ✅ **Trending Papers** - Recent papers with significant citations
- ✅ **Similar Papers** - Content-based similarity (using vector database)
- ✅ **Author Tracking** - Follow specific authors' work
- ✅ **Venue Tracking** - Monitor conferences/journals
- ✅ **Interest-Based** - Recommendations based on categories/authors/venues
- ✅ **Comprehensive Reports** - Auto-generated recommendation reports

### Quick Start

```bash
# Show trending papers
python scripts/paper_recommender.py --trending

# Get recommendations based on a paper
python scripts/paper_recommender.py --recommend-similar gaussian-splatting-2023

# Track an author
python scripts/paper_recommender.py --track-author "John Doe"

# Track a venue
python scripts/paper_recommender.py --track-venue "CVPR"

# Generate full recommendations report
python scripts/paper_recommender.py --report --output reports/recommendations.md
```

### Detailed Usage

#### Trending Papers

Shows recent papers (last 2 years) with significant citations:

```bash
python scripts/paper_recommender.py --trending
```

Output includes:
- Paper title and year
- Venue
- Citation count

#### Similar Paper Recommendations

Get comprehensive recommendations based on a specific paper:

```bash
python scripts/paper_recommender.py --recommend-similar <paper-id>
```

Provides recommendations from:
- **Content Similarity** - Papers with similar topics (requires vector database)
- **Same Authors** - Other papers by the same authors
- **Same Venue** - Papers from the same conference/journal
- **Same Categories** - Related papers in same research area

#### Author Tracking

Monitor a specific author's work:

```bash
python scripts/paper_recommender.py --track-author "Jane Smith"
```

Shows:
- Total papers in collection
- Total and average citations
- Recent papers
- Top cited papers

#### Venue Tracking

Track papers from a conference or journal:

```bash
python scripts/paper_recommender.py --track-venue "NeurIPS"
```

Shows:
- Paper count
- Year distribution
- Citation statistics
- Recent and top papers

#### Recommendations Report

Generate a comprehensive report with insights:

```bash
python scripts/paper_recommender.py --report --output reports/recommendations.md
```

Report includes:
- Trending papers
- Category-based recommendations
- Author insights
- Prolific authors in your collection

---

## 🛠️ Paper Manager

Enhanced CLI tool for batch operations and database management.

### Features

- ✅ **Batch Operations** - Star, tag, annotate multiple papers
- ✅ **Export Formats** - JSON, CSV, BibTeX, Markdown
- ✅ **Database Validation** - Find and fix issues
- ✅ **Statistics** - Collection insights
- ✅ **Cleanup** - Remove duplicates, fix formatting

### Commands

#### Star/Unstar Papers

```bash
# Star papers
python scripts/paper_manager.py star paper-1 paper-2 paper-3

# Unstar papers
python scripts/paper_manager.py unstar paper-1
```

#### Add Categories

```bash
# Add category to multiple papers
python scripts/paper_manager.py add-category <category-id> paper-1 paper-2
```

#### Add Notes

```bash
# Add note to multiple papers
python scripts/paper_manager.py add-notes "Important for survey paper" paper-1 paper-2
```

#### Export Papers

Export to various formats:

```bash
# Export all papers to JSON
python scripts/paper_manager.py export output.json --format json

# Export to CSV
python scripts/paper_manager.py export output.csv --format csv

# Export to BibTeX
python scripts/paper_manager.py export references.bib --format bibtex

# Export to Markdown
python scripts/paper_manager.py export papers.md --format markdown

# Export only starred papers
python scripts/paper_manager.py export starred.json --starred

# Export by category
python scripts/paper_manager.py export category.json --category 3d-gaussian
```

#### Validate Database

Check for issues in the database:

```bash
python scripts/paper_manager.py validate
```

Checks for:
- Missing required fields
- Invalid dates
- Duplicate IDs
- Invalid categories
- Missing arXiv IDs

#### Statistics

Show collection statistics:

```bash
python scripts/paper_manager.py stats
```

Displays:
- Total and starred paper counts
- Year range
- Citation statistics
- Top venues
- Top authors

#### Cleanup Database

Remove duplicates and fix formatting:

```bash
# Dry run (show what would be done)
python scripts/paper_manager.py cleanup --dry-run

# Actually perform cleanup
python scripts/paper_manager.py cleanup
```

---

## 📊 Collection Analyzer

Data analysis and visualization tool with ASCII charts and Mermaid diagrams.

### Features

- ✅ **Category Analysis** - Distribution and trends
- ✅ **Timeline Analysis** - Papers over time
- ✅ **Venue Analysis** - Top conferences/journals
- ✅ **Citation Analysis** - Citation statistics and distribution
- ✅ **Author Analysis** - Prolific authors and impact
- ✅ **Visual Reports** - ASCII charts + Mermaid.js diagrams

### Quick Start

```bash
# Generate full analysis report
python scripts/analyze_collection.py --output reports/analysis.md

# Specific analysis types
python scripts/analyze_collection.py --analysis categories
python scripts/analyze_collection.py --analysis timeline
python scripts/analyze_collection.py --analysis venues
python scripts/analyze_collection.py --analysis citations
python scripts/analyze_collection.py --analysis authors
```

### Analysis Types

#### Category Analysis

```bash
python scripts/analyze_collection.py --analysis categories
```

Shows:
- ASCII bar chart of category distribution
- Mermaid.js pie chart for web viewing

#### Timeline Analysis

```bash
python scripts/analyze_collection.py --analysis timeline
```

Shows:
- Papers per year visualization
- Timeline chart

#### Venue Analysis

```bash
python scripts/analyze_collection.py --analysis venues
```

Shows:
- Top 15 venues by paper count
- Distribution visualization

#### Citation Analysis

```bash
python scripts/analyze_collection.py --analysis citations
```

Shows:
- Total, average, min, max citations
- Citation distribution buckets (0, 1-10, 11-50, 51-100, 101-500, 500+)
- Visualizations

#### Author Analysis

```bash
python scripts/analyze_collection.py --analysis authors
```

Shows:
- Top authors by paper count
- Top authors by total citations

#### Full Report

```bash
python scripts/analyze_collection.py --output reports/analysis.md
```

Generates comprehensive report with:
- Overview statistics
- All analysis types
- Top papers by citations
- Insights and recommendations
- Mermaid.js diagrams for web viewing

---

## 🎯 Use Cases

### 1. Weekly Research Review

```bash
# Check trending papers
python scripts/paper_recommender.py --trending

# Get recommendations based on recent interests
python scripts/paper_recommender.py --recommend-similar <recent-paper-id>
```

### 2. Literature Survey Preparation

```bash
# Export all papers in a category
python scripts/paper_manager.py export survey-papers.bib \
  --format bibtex \
  --category medical-imaging

# Generate analysis for insights
python scripts/analyze_collection.py --output survey-analysis.md
```

### 3. Track Research Field

```bash
# Monitor a conference
python scripts/paper_recommender.py --track-venue "ICCV"

# Follow key researchers
python scripts/paper_recommender.py --track-author "First Author"
```

### 4. Collection Maintenance

```bash
# Validate database
python scripts/paper_manager.py validate

# Clean up issues
python scripts/paper_manager.py cleanup

# Get statistics
python scripts/paper_manager.py stats
```

### 5. Monthly Research Report

```bash
# Generate comprehensive reports
python scripts/analyze_collection.py --output reports/monthly-analysis.md
python scripts/paper_recommender.py --report --output reports/monthly-recommendations.md
```

---

## 💡 Tips & Best Practices

### Paper Recommender

1. **Build Vector Database First** - For best similarity recommendations:
   ```bash
   python scripts/setup_vectordb.py
   ```

2. **Regular Tracking** - Set up weekly checks for key authors/venues

3. **Combine Strategies** - Use multiple recommendation types for comprehensive coverage

### Paper Manager

1. **Backup First** - Before cleanup operations:
   ```bash
   cp data/papers/papers.yaml data/papers/papers.yaml.backup
   ```

2. **Use Dry Run** - Always test cleanup with `--dry-run` first

3. **Regular Validation** - Run validate weekly to catch issues early

4. **Export Regularly** - Create backups in multiple formats

### Collection Analyzer

1. **Save Reports** - Generate reports monthly for trend tracking

2. **Compare Over Time** - Keep historical reports to see collection growth

3. **Use Insights** - Act on recommendations in reports

---

## 🔧 Integration with Other Tools

### With Summary Reports

```bash
# Generate analysis
python scripts/analyze_collection.py --output reports/analysis.md

# Generate summary
python scripts/generate_summary_report.py --period month

# Both provide complementary insights
```

### With Q&A System

```bash
# Find papers on a topic
python scripts/query_papers.py -q "gaussian splatting"

# Get recommendations based on results
python scripts/paper_recommender.py --recommend-similar <found-paper-id>
```

### With Citation Tracker

```bash
# Update citations
python scripts/citation_tracker.py

# Analyze citation trends
python scripts/analyze_collection.py --analysis citations

# Find trending papers
python scripts/paper_recommender.py --trending
```

---

## 🐛 Troubleshooting

### Paper Recommender

**Issue**: "Vector database not available"

**Solution**: This is a warning, not an error. Content-based similarity won't work, but other features will:
```bash
# Install vector database (optional)
pip install chromadb sentence-transformers
python scripts/setup_vectordb.py
```

### Paper Manager

**Issue**: Export fails with encoding error

**Solution**: Ensure papers.yaml has valid UTF-8:
```bash
file -bi data/papers/papers.yaml
```

**Issue**: Validation shows many issues

**Solution**: Fix issues one by one, starting with critical ones (duplicate IDs, missing required fields)

### Collection Analyzer

**Issue**: Charts don't display properly

**Solution**:
- For ASCII charts: Use monospace font terminal
- For Mermaid charts: View exported .md file in GitHub or Mermaid viewer

---

## 📈 Advanced Workflows

### Research Group Management

```bash
#!/bin/bash
# weekly-group-update.sh

# Update citations
python scripts/citation_tracker.py

# Generate reports
python scripts/generate_summary_report.py --period week
python scripts/analyze_collection.py --output reports/weekly-analysis.md
python scripts/paper_recommender.py --report --output reports/weekly-recommendations.md

# Validate database
python scripts/paper_manager.py validate

echo "✅ Weekly update complete! Check reports/ directory"
```

### Paper Collection Pipeline

```bash
#!/bin/bash
# complete-workflow.sh

# 1. Collect papers
python scripts/arxiv_scraper.py --days 7

# 2. Filter and process
python scripts/smart_filter.py --top-n 10
python scripts/generate_summaries_multi.py

# 3. Update vector database
python scripts/setup_vectordb.py --clear

# 4. Get recommendations
python scripts/paper_recommender.py --trending

# 5. Generate reports
python scripts/generate_summary_report.py --period week
python scripts/analyze_collection.py --output reports/analysis.md
```

---

## 🔮 Future Enhancements

Planned improvements:

- [ ] **Graph Visualizations** - Citation networks, collaboration graphs
- [ ] **Machine Learning** - Smart paper scoring and ranking
- [ ] **Auto-tagging** - Automatic category assignment
- [ ] **Duplicate Detection** - Smart duplicate paper detection
- [ ] **Import Tools** - Import from Zotero, Mendeley
- [ ] **Web Dashboard** - Interactive web interface for all tools

---

## 📚 Additional Resources

- [Summary Reports Guide](SUMMARY_REPORTS_GUIDE.md)
- [Q&A System Guide](QA_SYSTEM_GUIDE.md)
- [Priority 1 Features](PRIORITY1_FEATURES.md)

---

**Note**: These are standalone command-line tools that work independently of the Hugo UI. All features are fully functional via terminal.
