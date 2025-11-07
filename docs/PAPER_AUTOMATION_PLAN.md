# Paper Collection Automation Plan

## 📋 Overview

This document outlines the plan for building an automated paper collection and management system for the research website, similar to [papers.cool](https://papers.cool/) with additional AI-powered features.

## 🎯 Goals

1. **Automated Discovery**: Automatically find and add relevant papers from arXiv and conferences
2. **Smart Filtering**: Intelligent filtering based on research interests and quality metrics
3. **AI Enhancement**: Generate summaries, audio, Q&A, and mind maps
4. **Easy Maintenance**: Minimal manual intervention required

---

## 🏗️ System Architecture

### Phase 1: Foundation (Current)
✅ **Status**: Completed

- [x] Create paper collection page structure
- [x] Design data schema (YAML format)
- [x] Add homepage banner/button
- [x] Implement basic styling

### Phase 2: Data Pipeline (Next 2-4 weeks)

#### 2.1 arXiv Scraper
```python
# Pseudo-code structure
class ArxivScraper:
    def __init__(self, categories, keywords):
        self.categories = ['cs.CV', 'cs.LG', 'eess.IV']
        self.keywords = ['gaussian splatting', 'medical image', ...]

    def fetch_daily_papers(self):
        """Fetch papers from last 24 hours"""
        # Use arXiv API
        pass

    def filter_relevant(self, papers):
        """Apply keyword and category filters"""
        pass
```

**Technologies**:
- Python with `arxiv` package
- GitHub Actions for daily scheduling
- YAML for data storage

**Files to create**:
- `.github/workflows/arxiv-scraper.yml`
- `scripts/arxiv_scraper.py`
- `scripts/paper_filter.py`

#### 2.2 Citation Tracking
```python
class CitationTracker:
    def update_citations(self, paper_list):
        """Update citation counts from Google Scholar/Semantic Scholar"""
        # Use Semantic Scholar API (free, no auth needed)
        pass
```

**APIs to use**:
- Semantic Scholar API (recommended - free, reliable)
- Alternative: Google Scholar (via serpapi)

#### 2.3 Venue Tracker
Track papers from major conferences:
- CVPR, ICCV, ECCV (Computer Vision)
- NeurIPS, ICML, ICLR (Machine Learning)
- MICCAI, IPMI, ISBI (Medical Imaging)
- SIGGRAPH (Graphics)

**Implementation**:
- Conference RSS feeds
- PapersWithCode API
- OpenReview API

---

### Phase 3: AI Features (4-8 weeks)

#### 3.1 Paper Summarization
```python
class PaperSummarizer:
    def __init__(self, model='gpt-4'):
        self.model = model

    def generate_summary(self, paper):
        """Generate 3-level summaries:
        - TL;DR (1 sentence)
        - Short summary (3-5 sentences)
        - Detailed summary (1 paragraph)
        """
        pass

    def extract_key_contributions(self, paper):
        """Extract bullet points of key contributions"""
        pass
```

**Technologies**:
- OpenAI GPT-4 API
- Anthropic Claude API (alternative)
- Local LLM (Llama 2/3) for cost savings

#### 3.2 Audio Generation (NotebookLM-style)
```python
class AudioGenerator:
    def generate_paper_podcast(self, paper):
        """Generate a conversational audio summary"""
        # Similar to Google NotebookLM
        pass

    def text_to_speech(self, text):
        """Convert text summary to speech"""
        # Use ElevenLabs or OpenAI TTS
        pass
```

**Technologies**:
- ElevenLabs API (high-quality voices)
- OpenAI TTS API
- Google Cloud Text-to-Speech

#### 3.3 Interactive Q&A System
```python
class PaperQA:
    def __init__(self):
        self.vector_store = VectorStore()  # Pinecone, Chroma, etc.
        self.llm = ChatGPT()

    def index_paper(self, paper):
        """Create embeddings and store in vector DB"""
        pass

    def answer_question(self, question, paper_context):
        """Answer questions about specific papers"""
        pass
```

**Technologies**:
- Vector Database: Pinecone (cloud) or ChromaDB (local)
- Embeddings: OpenAI ada-002 or open-source alternatives
- RAG (Retrieval-Augmented Generation)

#### 3.4 Mind Map Generation
```python
class MindMapGenerator:
    def generate_mindmap(self, paper):
        """Generate hierarchical mind map from paper structure"""
        # Parse: Title -> Sections -> Key Points
        pass

    def export_formats(self):
        """Export as: Mermaid, D3.js, GraphViz"""
        pass
```

**Visualization**:
- Mermaid.js (for Hugo integration)
- D3.js (interactive)
- Markmap (markdown to mindmap)

---

### Phase 4: Frontend Integration (2-3 weeks)

#### 4.1 Interactive Paper Cards
```javascript
// Add interactive features to paper cards
class PaperCard {
  constructor(paper) {
    this.paper = paper;
  }

  toggleExpand() {
    // Show/hide full abstract
  }

  playAudio() {
    // Play generated audio summary
  }

  openQA() {
    // Open Q&A modal
  }

  showMindmap() {
    // Display mind map
  }
}
```

#### 4.2 Search & Filter
- Full-text search
- Filter by category, venue, year
- Sort by date, citations, relevance

#### 4.3 Personalization
- Save favorites
- Custom tags
- Reading progress tracking
- Email notifications for new papers

---

## 🔄 GitHub Actions Workflows

### Daily Paper Update
```yaml
# .github/workflows/daily-paper-update.yml
name: Daily Paper Update

on:
  schedule:
    - cron: '0 0 * * *'  # Run daily at midnight UTC
  workflow_dispatch:  # Manual trigger

jobs:
  update-papers:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.10'

      - name: Install dependencies
        run: pip install -r scripts/requirements.txt

      - name: Fetch arXiv papers
        run: python scripts/arxiv_scraper.py
        env:
          ARXIV_CATEGORIES: ${{ secrets.ARXIV_CATEGORIES }}

      - name: Update citations
        run: python scripts/citation_tracker.py
        env:
          SEMANTIC_SCHOLAR_API_KEY: ${{ secrets.SS_API_KEY }}

      - name: Generate AI summaries
        run: python scripts/summarize_papers.py
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}

      - name: Commit changes
        run: |
          git config user.name "Paper Bot"
          git config user.email "bot@windrise.github.io"
          git add data/papers/
          git commit -m "🤖 Daily paper update $(date +%Y-%m-%d)" || exit 0
          git push
```

### Weekly Summary Generation
```yaml
# .github/workflows/weekly-summary.yml
name: Weekly Paper Summary

on:
  schedule:
    - cron: '0 10 * * 1'  # Every Monday at 10 AM UTC

jobs:
  generate-summary:
    runs-on: ubuntu-latest
    steps:
      - name: Generate weekly digest
        run: python scripts/weekly_digest.py

      - name: Send email notification
        run: python scripts/send_digest_email.py
```

---

## 💾 Data Structure

### Paper Entry Format
```yaml
- id: "unique-paper-id"
  title: "Paper Title"
  authors: ["Author 1", "Author 2"]
  venue: "CVPR"
  year: 2024
  categories: ["3d-gaussian", "reconstruction"]

  # Links
  links:
    paper: "https://arxiv.org/abs/xxxx.xxxxx"
    code: "https://github.com/..."
    project: "https://project-page.com"

  # Metadata
  arxiv_id: "2401.12345"
  citation_count: 42
  date_added: "2024-01-15"

  # AI-generated content
  summaries:
    tldr: "One sentence summary"
    short: "3-5 sentence summary"
    detailed: "Paragraph summary"

  audio:
    url: "https://windrise.github.io/audio/papers/xxxx.mp3"
    duration: 180  # seconds

  mindmap:
    mermaid: "graph TD; A[Main] --> B[Point 1]..."

  qa_embeddings:
    vector_id: "embedding-uuid"
    indexed: true
```

---

## 🔌 API Integrations

### Required APIs

| Service | Purpose | Cost | Priority |
|---------|---------|------|----------|
| arXiv API | Fetch papers | Free | High |
| Semantic Scholar | Citations | Free | High |
| OpenAI GPT-4 | Summaries | ~$0.03/paper | High |
| ElevenLabs | Audio | ~$0.10/paper | Medium |
| Pinecone | Vector DB | $70/month | Medium |

### Optional APIs

| Service | Purpose | Cost | Priority |
|---------|---------|------|----------|
| Google NotebookLM | Audio podcasts | TBD | Low |
| Anthropic Claude | Alternative LLM | Similar to GPT-4 | Low |
| PapersWithCode | Code links | Free | Medium |

---

## 📊 Cost Estimation

### Monthly Costs (assuming 30 papers/day)

- **OpenAI GPT-4**:
  - 30 papers/day × 30 days = 900 papers
  - ~$0.03 per paper = ~$27/month

- **ElevenLabs (optional)**:
  - 900 papers × $0.10 = $90/month
  - Can start with fewer papers or use cheaper TTS

- **Pinecone (optional)**:
  - $70/month for starter plan
  - Alternative: ChromaDB (free, self-hosted)

- **GitHub Actions**:
  - 2000 minutes/month free
  - Should be sufficient for daily runs

**Total estimate**: $27-$187/month depending on features enabled

**Cost-saving strategies**:
1. Start with summaries only (~$27/month)
2. Use local LLMs for some tasks (free)
3. Use ChromaDB instead of Pinecone (free)
4. Generate audio only for starred papers

---

## 🚀 Implementation Timeline

### Week 1-2: Setup
- [ ] Set up Python environment
- [ ] Create arXiv scraper script
- [ ] Test basic paper fetching
- [ ] Set up GitHub Actions

### Week 3-4: Data Pipeline
- [ ] Implement filtering logic
- [ ] Add citation tracking
- [ ] Create data validation
- [ ] Set up automatic commits

### Week 5-6: AI Summaries
- [ ] Integrate OpenAI API
- [ ] Generate test summaries
- [ ] Update paper cards with summaries
- [ ] Add caching to save costs

### Week 7-8: Audio (Optional)
- [ ] Set up TTS service
- [ ] Generate sample audio
- [ ] Add audio player to UI
- [ ] Optimize audio generation

### Week 9-10: Q&A System (Optional)
- [ ] Set up vector database
- [ ] Create embeddings pipeline
- [ ] Build Q&A interface
- [ ] Test with sample papers

### Week 11-12: Mind Maps (Optional)
- [ ] Implement mind map generation
- [ ] Integrate visualization library
- [ ] Add export functionality
- [ ] Polish UI

---

## 🧪 Testing Strategy

1. **Unit Tests**: Test each component individually
2. **Integration Tests**: Test complete pipeline
3. **Manual Review**: Weekly check of added papers
4. **Quality Metrics**:
   - Relevance score (% of relevant papers)
   - False positive rate
   - Summary quality scores

---

## 📈 Success Metrics

- **Papers added**: Target 20-30 relevant papers/day
- **Accuracy**: >80% relevance rate
- **Uptime**: >99% for daily updates
- **User engagement**: Track visits to paper collection page

---

## 🛠️ Getting Started

### Immediate Next Steps

1. **Install dependencies**:
   ```bash
   cd scripts
   pip install arxiv pyyaml requests openai
   ```

2. **Set up secrets** in GitHub:
   - `OPENAI_API_KEY`
   - `SEMANTIC_SCHOLAR_API_KEY` (optional)

3. **Test scraper locally**:
   ```bash
   python scripts/arxiv_scraper.py --test
   ```

4. **Enable GitHub Action**:
   - Uncomment workflow file
   - Monitor first run

---

## 📞 Support & Maintenance

- **Weekly reviews**: Check for false positives
- **Monthly audits**: Review AI quality and costs
- **Quarterly updates**: Improve filters and categories
- **Community feedback**: Accept paper suggestions via GitHub issues

---

## 🔮 Future Enhancements

- **Collaborative features**: Allow others to contribute papers
- **Mobile app**: iOS/Android app for paper reading
- **Browser extension**: Save papers while browsing
- **Paper recommendations**: ML-based personalized recommendations
- **Reading groups**: Organize papers into reading lists
- **Annotations**: Allow note-taking on papers

---

**Status**: 🟢 Ready to start Phase 2

**Last Updated**: 2025-01-07

**Contact**: For questions or suggestions, open an issue on GitHub.
