# Xueming Fu - Personal Website

Personal academic website powered by Hugo and the Hugo Academic (Wowchemy) theme, featuring an automated paper collection and management system.

## Overview

This is a professional academic website featuring:
- Personal biography and research interests
- Publications showcase
- Project portfolio
- Research experience timeline
- Skills and expertise
- Contact information
- **Automated Paper Collection System** - AI-powered paper discovery, filtering, and management

## Quick Start

### Prerequisites
- Hugo Extended (v0.110.0 or later)
- Git

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/windrise/windrise.github.io.git
cd windrise.github.io
```

2. Start the Hugo development server:
```bash
hugo server -D
```

3. Open your browser and visit `http://localhost:1313`

## Customization Guide

### 1. Update Personal Information

Edit `content/authors/admin/_index.md` to update:
- Your name and title
- Bio and research interests
- Education background
- Social media links
- Email and contact info

### 2. Add Your Publications

Create new publication entries in `content/publication/`:
```bash
hugo new content/publication/my-paper/index.md
```

Edit the generated file with your publication details:
- Title, authors, date
- Journal/conference name
- Abstract and summary
- PDF, code, and other links

### 3. Update Projects

Add project entries in `content/project/`:
```bash
hugo new content/project/my-project/index.md
```

### 4. Modify Experience

Edit `content/home/experience.md` to add your:
- Education history
- Work experience
- Research positions
- Internships

### 5. Update Skills

Edit `content/home/skills.md` to showcase your:
- Technical skills
- Programming languages
- Tools and frameworks
- Research expertise

### 6. Change Theme and Colors

Edit `config/_default/params.yaml` to customize:
- Theme (day/night mode)
- Font family and size
- Color scheme
- Layout options

### 7. Update Navigation Menu

Edit `config/_default/menus.yaml` to modify the navigation bar links.

### 8. Add Your Photo

Replace the avatar image:
```bash
static/img/avatar.jpg
```

## Deployment

### GitHub Pages

1. Push your changes to GitHub:
```bash
git add .
git commit -m "Update personal website"
git push origin main
```

2. Enable GitHub Pages in your repository settings:
   - Go to Settings → Pages
   - Set source to "GitHub Actions" or "main branch"

3. Your site will be available at: `https://windrise.github.io`

### Netlify

1. Connect your GitHub repository to Netlify
2. Set build command: `hugo --gc --minify`
3. Set publish directory: `public`
4. Deploy!

## File Structure

```
.
├── config/          # Site configuration
│   └── _default/
│       ├── config.yaml   # Main config
│       ├── params.yaml   # Theme parameters
│       ├── menus.yaml    # Navigation menus
│       └── languages.yaml
├── content/         # Your content
│   ├── authors/     # Author profiles
│   ├── home/        # Homepage widgets
│   ├── publication/ # Publications
│   └── project/     # Projects
├── static/          # Static files
│   └── img/         # Images
└── themes/          # Hugo themes
```

## Tips

- **Images**: Add images to `static/img/` or within specific content folders
- **SEO**: Update meta descriptions in `config/_default/params.yaml`
- **Analytics**: Add Google Analytics ID in params.yaml
- **Comments**: Enable Disqus or other comment systems in params.yaml

## Resources

- [Hugo Academic Documentation](https://wowchemy.com/docs/)
- [Hugo Documentation](https://gohugo.io/documentation/)
- [Markdown Guide](https://www.markdownguide.org/)

## License

This website is powered by the [Hugo Academic theme](https://github.com/wowchemy/wowchemy-hugo-themes).

## Contact

For questions or suggestions, please contact: your.email@example.com

---

## 📊 Automated Paper Collection System - Implementation Status

### 🎯 Project Overview

An AI-powered system that automatically discovers, filters, and manages academic papers from arXiv, completely free and running on GitHub Actions.

### ✅ Completed Features (Weeks 1-2)

#### Week 1: Core Automation Pipeline
- ✅ **arXiv Scraper** (`scripts/arxiv_scraper.py`)
  - Daily automated fetching from arXiv
  - Category filtering (cs.CV, cs.LG, eess.IV)
  - Keyword matching for research areas
  - Smart date-based querying

- ✅ **Smart Filter System** (`scripts/smart_filter.py`)
  - Multi-dimensional scoring (field match, venue quality, citations, code, practicality)
  - Weighted ranking algorithm
  - Top N paper selection (default: 10 papers/day)
  - Detailed score breakdown

- ✅ **GitHub Actions Workflows**
  - `daily-paper-update.yml` - Daily automated pipeline
  - `process-approved-papers.yml` - Process approved papers
  - `hugo.yml` - Website deployment

#### Week 2: AI Enhancement
- ✅ **Multi-API AI Summaries** (`scripts/generate_summaries_multi.py`)
  - Support for 7+ API providers:
    - Google Gemini (Free) ⭐
    - Groq (Free) ⭐
    - DeepSeek (Cheap)
    - ZhipuAI (Free) ⭐
    - OpenAI GPT
    - Anthropic Claude
    - Moonshot Kimi
  - Auto-fallback mechanism
  - 3-5 sentence summaries
  - Key contributions extraction
  - Bilingual support ready

- ✅ **Audio Generation** (`scripts/generate_audio.py`)
  - Text-to-speech using Edge TTS (Free)
  - Multiple voice options
  - MP3 format output

- ✅ **Review System** (`scripts/create_review_issue.py`)
  - Auto-creates GitHub Issues for paper review
  - Beautiful markdown formatting
  - Label-based approval workflow
  - Paper metadata display

- ✅ **Paper Management** (`scripts/process_approved_papers.py`)
  - Auto-categorization
  - YAML database integration
  - Duplicate prevention
  - Metadata management

- ✅ **Mindmap Visualization** (`scripts/generate_mindmap.py`)
  - Auto-generate Mermaid.js mindmaps
  - Visual paper structure representation
  - Hugo shortcode integration
  - Interactive web display
  - Exports to markdown files

- ✅ **Citation Tracking System** (`scripts/citation_tracker.py`)
  - Semantic Scholar API integration
  - Automatic citation count updates
  - Historical citation data tracking
  - Citation trend analysis
  - Impact metrics (influential citations)
  - Weekly automated updates
  - Citation reports generation

### 🚧 Remaining Tasks (Week 3+)

#### Priority 1: Essential Features
- [x] **Mindmap Generation** ✅ COMPLETED
  - ✅ Auto-generate paper structure visualization
  - ✅ Using Mermaid.js for web integration
  - ✅ Interactive expand/collapse
  - ✅ Export to Hugo pages
  - ✅ Hugo shortcode for easy embedding
  - Script: `scripts/generate_mindmap.py`

- [x] **Citation Tracking** ✅ COMPLETED
  - ✅ Integration with Semantic Scholar API (Free)
  - ✅ Auto-update citation counts
  - ✅ Citation history tracking
  - ✅ Weekly update schedule (GitHub Actions)
  - ✅ Impact tracking over time
  - ✅ Citation reports generation
  - Script: `scripts/citation_tracker.py`

#### Priority 2: Advanced Features
- [ ] **Local Q&A System** (Week 3, Day 15-17)
  - ChromaDB for vector storage
  - Ollama + Llama 3.1 for local LLM
  - Paper content indexing
  - Web interface for queries
  - Can run on GitHub Codespaces (60 hours/month free)

- [ ] **Enhanced Management Interface** (Week 3, Day 20-21)
  - Web-based admin panel (Hugo Admin)
  - CLI tool improvements
  - Batch operations
  - Statistics dashboard

#### Priority 3: Nice-to-Have Features
- [ ] **Weekly/Monthly Summary Reports**
  - Auto-generate research trend reports
  - Top papers of the week/month
  - Category breakdowns
  - Email/Slack notifications

- [ ] **Paper Recommendations**
  - Based on your collection
  - Similar paper suggestions
  - Author tracking
  - Conference/journal tracking

- [ ] **Enhanced Visualizations**
  - Research field timeline
  - Citation network graphs
  - Keyword trend analysis
  - Author collaboration networks

- [ ] **Mobile App**
  - Progressive Web App (PWA)
  - Offline reading support
  - Push notifications
  - Audio playback

### 📝 Next Development Session TODO

When you continue development, start with:

1. **Local Q&A System** (Priority 2 - Highest Priority)
   ```bash
   # Create vector database script
   touch scripts/setup_vectordb.py
   touch scripts/query_papers.py

   # Install dependencies (already in requirements.txt)
   pip install chromadb sentence-transformers

   # Setup for GitHub Codespaces or local
   ```
   - Document Ollama installation guide
   - Create ChromaDB setup script
   - Index paper content (abstract, key contributions)
   - Build simple web interface
   - Test locally first

2. **Enhanced Management Interface**
   - Web-based admin panel (Hugo Admin)
   - CLI tool improvements
   - Batch operations
   - Statistics dashboard

3. **Weekly/Monthly Summary Reports**
   - Auto-generate research trend reports
   - Top papers of the week/month
   - Category breakdowns
   - Email/Slack notifications

### 🔧 Quick Commands

```bash
# Run the full pipeline manually
./scripts/test_pipeline.sh

# Test API keys
./scripts/test_api.sh

# Scrape papers (test mode)
python scripts/arxiv_scraper.py --days 1 --max-results 20

# Filter papers
python scripts/smart_filter.py --top-n 10

# Generate summaries (auto-select API)
python scripts/generate_summaries_multi.py --provider auto

# Generate mindmaps for all papers
python scripts/generate_mindmap.py

# Generate mindmap for specific paper
python scripts/generate_mindmap.py --paper-id <paper-id>

# Update citation counts
python scripts/citation_tracker.py

# Generate citation report
python scripts/citation_tracker.py --report --output reports/citation_report.md

# Force update citations (ignore recent check)
python scripts/citation_tracker.py --force

# Create review issue
python scripts/create_review_issue.py

# Process approved papers (after labeling issue)
python scripts/process_approved_papers.py --issue-number 123
```

### 📚 Documentation

Detailed guides available in `/docs/`:
- `QUICK_START.md` - Get started in 5 minutes
- `SETUP_GUIDE.md` - Complete setup instructions
- `API_SETUP.md` - API key configuration
- `PAPER_AUTOMATION_PLAN.md` - Full automation strategy
- `TROUBLESHOOTING.md` - Common issues and solutions

### 🎯 Success Metrics

Current achievements:
- ✅ 100% automated paper discovery
- ✅ Zero-cost operation (all free APIs)
- ✅ ~10 minutes daily review time
- ✅ Multi-API fallback for reliability
- ✅ Full GitHub integration

Target metrics:
- 5-10 papers reviewed daily
- 2-3 papers added to collection weekly
- 100% uptime with GitHub Actions
- <15 minutes daily maintenance

### 🆓 Cost Breakdown

| Service | Monthly Cost | Usage |
|---------|-------------|--------|
| GitHub Actions | $0 | 2000 min/month free |
| API Keys (Gemini/Groq/Zhipu) | $0 | Free tiers |
| Edge TTS Audio | $0 | Unlimited |
| GitHub Pages Hosting | $0 | Unlimited |
| Storage (Git) | $0 | Unlimited for text |
| **TOTAL** | **$0/month** | 🎉 |

### 🚀 Future Enhancements

Ideas for later:
- Integration with Zotero/Mendeley
- Automated literature review generation
- Paper relationship graphs
- Collaborative filtering with other researchers
- RSS feed generation
- Social media auto-posting
- Conference deadline tracking

---

### 📌 Important Notes

1. **API Keys Required**: Set up at least one free API key (Gemini, Groq, or ZhipuAI)
2. **GitHub Secrets**: Add API keys to repository secrets
3. **Daily Review**: Check GitHub Issues daily for new papers
4. **Label System**: Use `approved`, `rejected`, `starred` labels
5. **Backup**: All data in `data/papers/papers.yaml` is version controlled

For detailed implementation plans, see `docs/PAPER_AUTOMATION_PLAN.md`