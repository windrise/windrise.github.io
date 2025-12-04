# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

An academic personal website built with Hugo and the Wowchemy theme, featuring an advanced automated paper collection and management system. The site combines traditional academic website features with AI-powered research paper automation running entirely on GitHub Actions with free APIs.

## Key Technologies

- **Hugo Static Site Generator** (Extended v0.110.0+)
- **Wowchemy/Hugo Academic Theme** (v5)
- **Python 3.10** for automation scripts
- **GitHub Actions** for CI/CD and automation
- **Multiple AI APIs** (Gemini, Groq, DeepSeek, ZhipuAI, etc.)
- **ChromaDB + Sentence Transformers** for local Q&A system

## Essential Build & Development Commands

### Hugo Site Development

```bash
# Start local development server
hugo server -D

# Build production site
hugo --gc --minify

# Create new content
hugo new content/publication/my-paper/index.md
hugo new content/project/my-project/index.md
```

### Paper Automation System

```bash
# Run complete paper collection pipeline manually
./scripts/test_pipeline.sh

# Test API keys
./scripts/test_api.sh

# Individual automation steps
python scripts/arxiv_scraper.py --days 1 --max-results 20
python scripts/smart_filter.py --top-n 10
python scripts/generate_summaries_multi.py --provider auto
python scripts/generate_mindmap.py
python scripts/citation_tracker.py
python scripts/generate_audio.py

# Q&A System
python scripts/setup_vectordb.py                    # Setup vector database
python scripts/query_papers.py -q "your question"   # Query papers
python scripts/query_papers.py --similar <paper-id> # Find similar papers
python scripts/query_papers.py -i                   # Interactive mode
python scripts/web_qa.py                            # Web interface

# Paper management
python scripts/create_review_issue.py
python scripts/process_approved_papers.py --issue-number 123
```

## Core Architecture

### 1. Hugo Site Structure

- **config/_default/** - Site configuration (config.yaml, params.yaml, menus.yaml)
- **content/** - All site content
  - **authors/admin/** - Personal profile and bio
  - **home/** - Homepage widgets (experience, skills, etc.)
  - **publication/** - Academic publications
  - **project/** - Research projects
  - **papers/** - Automated paper collection pages
- **layouts/shortcodes/** - Custom Hugo shortcodes for enhanced functionality
  - **all-papers-enhanced.html** - Advanced paper browser with search/filter/select
  - **mindmap.html** - Mermaid.js diagram integration
  - **recent-papers.html** - Recent papers widget
- **static/** - Static assets (images, audio, mindmaps, CSS, JS)
- **data/papers/papers.yaml** - Centralized paper database

### 2. Automated Paper Collection Pipeline

**Daily GitHub Actions Workflow** (.github/workflows/daily-paper-update.yml):

1. **arxiv_scraper.py** - Fetch papers from arXiv by category and keywords
2. **smart_filter.py** - Score and rank papers using multi-dimensional algorithm
3. **generate_summaries_multi.py** - Generate AI summaries with auto-fallback across 7+ APIs
4. **generate_mindmap.py** - Create Mermaid.js visualizations of paper structure
5. **generate_audio.py** - Generate TTS audio using Edge TTS
6. **create_review_issue.py** - Create GitHub issue for human review
7. **process_approved_papers.py** - Process approved papers into site

**Key Design Principles:**
- Zero-cost operation using free APIs (Gemini, Groq, ZhipuAI)
- Multi-API fallback for reliability
- Human-in-the-loop via GitHub Issues with label-based approval
- All data stored in version-controlled YAML

### 3. Data Schema (data/papers/papers.yaml)

```yaml
papers:
  - id: unique-paper-id
    title: Paper Title
    authors: [Author1, Author2]
    venue: Conference/Journal
    year: 2025
    month: 11
    categories: [3d-gaussian, medical-imaging]
    type: Foundation|Research
    abstract: Full abstract text
    links:
      paper: arXiv URL
      code: GitHub URL
      project: Project page URL
    arxiv_id: arXiv ID
    citation_count: Updated by citation_tracker.py
    starred: true/false
    date_added: YYYY-MM-DD
    notes: Personal notes
    ai_summary: Generated summary
    key_contributions: [Contribution1, Contribution2]
    relevance_score: Computed score
```

### 4. Frontend Enhancement System

The **all-papers-enhanced.html** shortcode provides:
- Real-time search across titles/authors/abstracts
- Multi-dimensional filtering (year, category, tags, starred, has-code)
- Multiple sort modes (date, relevance, citations, alphabetical)
- Selection mode with URL-based sharing
- Export capabilities (BibTeX, JSON, Markdown)
- Abstract expand/collapse
- Dark mode support (auto-detect system preference)
- Responsive design with floating action buttons

### 5. Q&A System Architecture

**Local-first approach** for privacy and cost:
- **ChromaDB** for vector storage
- **Sentence Transformers** (all-MiniLM-L6-v2) for embeddings
- **Flask** web interface (web_qa.py)
- Smart chunking with metadata preservation
- Semantic search across entire paper collection
- Find similar papers functionality
- Works on GitHub Codespaces (60 hours/month free)

## Important File Locations

### Configuration Files
- `config/_default/config.yaml` - Main Hugo config
- `config/_default/params.yaml` - Theme parameters and colors
- `config/_default/menus.yaml` - Navigation menu structure
- `scripts/requirements.txt` - Python dependencies

### Data Files
- `data/papers/papers.yaml` - Main paper database (version controlled)
- `data/papers/pending/` - Pending papers awaiting review

### Automation Scripts (scripts/)
- `arxiv_scraper.py` - arXiv paper fetching
- `smart_filter.py` - Multi-dimensional paper scoring/ranking
- `generate_summaries_multi.py` - Multi-API AI summary generation
- `generate_mindmap.py` - Mermaid diagram generation
- `citation_tracker.py` - Semantic Scholar citation tracking
- `generate_audio.py` - Edge TTS audio generation
- `create_review_issue.py` - GitHub issue creation
- `process_approved_papers.py` - Approved paper processing
- `setup_vectordb.py` - ChromaDB vector database setup
- `query_papers.py` - Command-line Q&A interface
- `web_qa.py` - Flask web Q&A interface

### GitHub Actions Workflows (.github/workflows/)
- `daily-paper-update.yml` - Daily automated paper collection (cron: 0 0 * * *)
- `process-approved-papers.yml` - Process approved papers via issue labels
- `weekly-citation-update.yml` - Update citation counts weekly
- `hugo.yml` - Build and deploy Hugo site to GitHub Pages

## Development Workflows

### Adding/Modifying Papers

**Manual Addition:**
1. Edit `data/papers/papers.yaml`
2. Add paper entry with required fields
3. Generate mindmap: `python scripts/generate_mindmap.py --paper-id <id>`
4. Update vector DB: `python scripts/setup_vectordb.py` (if Q&A enabled)

**Automated Review:**
1. Check daily GitHub Issues for new papers
2. Add labels: `approved`, `rejected`, or `starred`
3. Workflow automatically processes labeled papers
4. Approved papers added to `papers.yaml` and site rebuilt

### Testing Changes Locally

```bash
# Install dependencies
pip install -r scripts/requirements.txt

# Test individual components
python scripts/arxiv_scraper.py --days 1 --max-results 5
python scripts/smart_filter.py
python scripts/generate_summaries_multi.py --provider gemini

# Test complete pipeline
./scripts/test_pipeline.sh

# Test Hugo site
hugo server -D
# Visit http://localhost:1313
```

### Working with Hugo Shortcodes

**Usage in content files:**
```markdown
{{< all-papers-enhanced >}}
{{< recent-papers count="5" >}}
{{< mindmap paper_id="paper-id" >}}
```

**Shortcode locations:** `layouts/shortcodes/*.html`

### Deployment

**Automatic deployment via GitHub Actions:**
- Push to `main` branch triggers Hugo build
- Site deployed to GitHub Pages automatically
- URL: https://windrise.github.io

## API Keys & Secrets

**Required GitHub Secrets** (for automation):
- `GEMINI_API_KEY` - Google Gemini (Free, recommended)
- `GROQ_API_KEY` - Groq (Free, recommended)
- `ZHIPU_API_KEY` - ZhipuAI (Free)
- `DEEPSEEK_API_KEY` - DeepSeek (Cheap)
- `OPENAI_API_KEY` - OpenAI GPT (Optional)
- `ANTHROPIC_API_KEY` - Claude (Optional)
- `KIMI_API_KEY` - Moonshot Kimi (Optional)

**Fallback Strategy:**
The system automatically tries APIs in order until one succeeds. At least one free API key should be configured.

## Paper Categories & Taxonomy

**Predefined categories** in papers.yaml:
- `3d-gaussian` - 3D Gaussian Splatting
- `medical-imaging` - Medical Image Analysis
- `cardiac-imaging` - Cardiac Imaging
- `self-supervised` - Self-Supervised Learning
- `nerf` - Neural Radiance Fields
- `reconstruction` - 3D Reconstruction

**Paper types:**
- `Foundation` - Seminal/foundational papers
- `Research` - Regular research papers

## Frontend JavaScript Architecture

**Located in:** `static/js/` and embedded in shortcodes

**Key features:**
- LocalStorage for user preferences and drafts
- URL hash-based state for shareable selections
- Dynamic filtering and sorting with live results
- Modal dialogs for selection/export
- Clipboard API for copy functionality
- Intersection Observer for lazy loading (planned)

## Notes for Future Development

### Current Frontend Enhancement Status
- ✅ Search and filtering (complete)
- ✅ Selection and sharing (complete)
- ✅ Export to BibTeX/JSON/Markdown (complete)
- ✅ Dark mode auto-detect (complete)
- 📋 Reading notes system (design complete, implementation pending)
- 📋 Manual dark mode toggle (pending)
- 📋 Paper thumbnails (pending)
- 📋 Visualization enhancements (pending)

### Backend Automation Features
- ✅ Core pipeline (complete)
- ✅ AI summaries with multi-API fallback (complete)
- ✅ Mindmap generation (complete)
- ✅ Citation tracking (complete)
- ✅ Local Q&A system (complete)
- 📋 Enhanced management interface (pending)
- 📋 Weekly/monthly summary reports (pending)
- 📋 Paper recommendations (pending)

### Reading Notes System Design
See `docs/READING_NOTES_DESIGN.md` for complete specification. Key components:
- Hybrid storage: LocalStorage (drafts) + GitHub (persistent)
- Markdown editor with real-time preview
- Status tracking (to-read, reading, completed)
- Progress tracking and star ratings
- Auto-save every 5 seconds
- Sync to papers.yaml on manual save

## Common Issues

**Hugo build fails:**
- Ensure Hugo Extended version ≥ 0.110.0
- Check for YAML syntax errors in papers.yaml
- Verify all shortcode references are correct

**Automation pipeline fails:**
- Check API key configuration in GitHub Secrets
- Review workflow logs in GitHub Actions
- Test locally with `./scripts/test_pipeline.sh`
- Verify Python dependencies: `pip install -r scripts/requirements.txt`

**Papers not appearing on site:**
- Ensure paper is in `papers.yaml` (not pending/)
- Rebuild Hugo site: `hugo --gc --minify`
- Check paper metadata formatting
- Verify categories match predefined list

## Testing

**Manual testing:**
```bash
# Test API connectivity
./scripts/test_api.sh

# Test full pipeline
./scripts/test_pipeline.sh

# Test specific components
python scripts/arxiv_scraper.py --days 1 --max-results 5
python scripts/smart_filter.py
```

**GitHub Actions testing:**
- Use workflow_dispatch for manual triggers
- Monitor workflow runs in Actions tab
- Check artifacts for debugging

## Documentation

Comprehensive guides in `/docs/`:
- `QUICK_START.md` - Get started in 5 minutes
- `SETUP_GUIDE.md` - Complete setup instructions
- `API_SETUP.md` - API key configuration
- `PAPER_AUTOMATION_PLAN.md` - Full automation strategy
- `PRIORITY1_FEATURES.md` - Mindmap & Citation Tracking
- `QA_SYSTEM_GUIDE.md` - Local Q&A System guide
- `READING_NOTES_DESIGN.md` - Reading notes system design
- `TROUBLESHOOTING.md` - Common issues and solutions
