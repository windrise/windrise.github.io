# Local Q&A System Guide

## 🎯 Overview

The Local Q&A System provides semantic search and question-answering capabilities over your paper collection using:

- **ChromaDB**: Vector database for storing paper embeddings
- **Sentence Transformers**: Lightweight embedding model (all-MiniLM-L6-v2)
- **Flask**: Web interface for easy interaction
- **100% Local**: No external API calls required (except for optional LLM integration)

## 📦 Features

- ✅ Semantic search across all papers
- ✅ Find similar papers based on content
- ✅ Interactive web interface
- ✅ Command-line query tool
- ✅ Fast local embedding generation
- ✅ Persistent vector database
- ✅ No API costs

## 🚀 Quick Start

### 1. Install Dependencies

```bash
pip install -r scripts/requirements.txt
```

This will install:
- `chromadb` - Vector database
- `sentence-transformers` - Embedding model
- `flask` - Web framework
- `flask-cors` - CORS support

### 2. Index Your Papers

```bash
# Index all papers from papers.yaml
python scripts/setup_vectordb.py
```

This will:
- Create a vector database at `data/vectordb/`
- Load the embedding model (downloads on first run, ~90MB)
- Process all papers into searchable chunks
- Generate embeddings for each chunk
- Store in ChromaDB

**First-time setup**: The embedding model will be downloaded automatically (~90MB). This only happens once.

### 3. Search Papers

You have three ways to search:

#### Option A: Web Interface (Recommended)

```bash
python scripts/web_qa.py
```

Then open your browser to: `http://127.0.0.1:5000`

#### Option B: Command Line

```bash
# Single query
python scripts/query_papers.py -q "gaussian splatting 3D reconstruction"

# Find similar papers
python scripts/query_papers.py --similar gaussian-splatting-2023
```

#### Option C: Interactive Mode

```bash
python scripts/query_papers.py -i
```

This starts an interactive terminal session for multiple queries.

## 📚 Detailed Usage

### Setup Vector Database

```bash
# Basic indexing
python scripts/setup_vectordb.py

# Clear and re-index
python scripts/setup_vectordb.py --clear

# Custom database path
python scripts/setup_vectordb.py --db-path /path/to/db

# Show stats only
python scripts/setup_vectordb.py --stats-only
```

**When to re-index:**
- After adding new papers to `papers.yaml`
- After modifying paper abstracts or contributions
- If the database becomes corrupted

### Command-Line Queries

```bash
# Search with custom number of results
python scripts/query_papers.py -q "medical image segmentation" -n 10

# Show full content instead of preview
python scripts/query_papers.py -q "neural rendering" --full

# Find papers similar to a specific paper
python scripts/query_papers.py --similar gaussian-splatting-2023 -n 5

# Interactive mode for multiple queries
python scripts/query_papers.py -i
```

**Interactive mode commands:**
- Type any question or search query
- `similar <paper-id>` - Find similar papers
- `stats` - Show database statistics
- `quit` or `exit` - Exit

### Web Interface

```bash
# Start server (default: http://127.0.0.1:5000)
python scripts/web_qa.py

# Custom host and port
python scripts/web_qa.py --host 0.0.0.0 --port 8080

# Enable debug mode
python scripts/web_qa.py --debug
```

**Web Interface Features:**
- Clean, modern UI
- Real-time search
- Relevance scoring visualization
- Example queries for quick start
- Mobile-responsive design

## 🏗️ Architecture

### How It Works

1. **Indexing Phase:**
   ```
   Paper YAML → Text Chunks → Embeddings → Vector DB
   ```

2. **Query Phase:**
   ```
   Query → Embedding → Similarity Search → Ranked Results
   ```

### Paper Chunking Strategy

Each paper is split into multiple chunks for better search:

1. **Abstract Chunk**: Title + Abstract
2. **Contribution Chunks**: Each key contribution separately
3. **Metadata Chunk**: Authors, venue, year, categories, notes

This allows finding relevant papers even if the query matches only a specific contribution or metadata.

### Embedding Model

- **Model**: `all-MiniLM-L6-v2`
- **Size**: ~90MB
- **Dimensions**: 384
- **Speed**: ~3000 tokens/second on CPU
- **Quality**: Good balance between size and accuracy

## 💡 Example Use Cases

### 1. Find Papers on a Topic

```bash
python scripts/query_papers.py -q "self-supervised learning for medical imaging"
```

Returns papers that semantically match the query, even if they don't contain exact keywords.

### 2. Explore Related Work

```bash
python scripts/query_papers.py --similar gaussian-splatting-2023
```

Finds papers with similar content, methodology, or applications.

### 3. Answer Research Questions

```bash
python scripts/query_papers.py -q "What are the latest methods for 3D reconstruction?"
```

Retrieves relevant papers and shows their abstracts and contributions.

### 4. Compare Methods

Search for multiple topics and compare results:

```bash
python scripts/query_papers.py -i

Query: gaussian splatting advantages
Query: nerf limitations
Query: 3D reconstruction comparison
```

## 🔧 Advanced Configuration

### Custom Database Location

```bash
# Setup
python scripts/setup_vectordb.py --db-path /custom/path

# Query
python scripts/query_papers.py --db-path /custom/path
```

### Multiple Collections

You can create separate collections for different paper categories:

```bash
# Create medical imaging collection
python scripts/setup_vectordb.py --collection medical_imaging

# Query specific collection
python scripts/query_papers.py --collection medical_imaging -q "cardiac segmentation"
```

### Embedding Model Selection

To use a different embedding model, edit `scripts/setup_vectordb.py` and `scripts/query_papers.py`:

```python
# Change this line:
self.embedding_model = SentenceTransformer('all-MiniLM-L6-v2')

# To your preferred model:
self.embedding_model = SentenceTransformer('all-mpnet-base-v2')  # Better quality, slower
```

Popular alternatives:
- `all-mpnet-base-v2`: Better quality, 420MB
- `all-MiniLM-L12-v2`: Balance, 120MB
- `paraphrase-multilingual-MiniLM-L12-v2`: Multilingual support

## 🚀 Performance Tips

### 1. Initial Indexing

- **Time**: ~1-2 seconds per paper (first run includes model download)
- **Disk Space**: ~100MB for database + 90MB for model
- **Memory**: ~500MB during indexing

### 2. Query Performance

- **Speed**: <100ms for most queries
- **Accuracy**: Depends on query quality and paper content
- **Scalability**: Handles 1000+ papers efficiently

### 3. Optimization

If you have many papers (>100):

```bash
# Use batch processing (already default in scripts)
# Increase batch size in script for faster indexing

# For very large collections, consider:
# - Using GPU acceleration (install sentence-transformers[gpu])
# - Splitting into multiple collections by category
# - Using a more powerful embedding model
```

## 🌐 Deployment Options

### Local Development

```bash
python scripts/web_qa.py
```

### GitHub Codespaces

GitHub provides 60 hours/month of free Codespaces:

1. Open repo in Codespaces
2. Install dependencies: `pip install -r scripts/requirements.txt`
3. Index papers: `python scripts/setup_vectordb.py`
4. Start web server: `python scripts/web_qa.py --host 0.0.0.0`
5. Codespaces will provide a public URL

### Docker (Future)

```dockerfile
# Dockerfile example (not yet implemented)
FROM python:3.10-slim
WORKDIR /app
COPY scripts/requirements.txt .
RUN pip install -r requirements.txt
COPY . .
RUN python scripts/setup_vectordb.py
CMD ["python", "scripts/web_qa.py", "--host", "0.0.0.0"]
```

## 🔮 Future Enhancements

### Planned Features

1. **LLM Integration**
   - Local LLM (Ollama + Llama 3.1)
   - Generate natural language answers
   - Summarize multiple papers
   - Compare and contrast papers

2. **Enhanced Search**
   - Filters by year, venue, category
   - Boolean search operators
   - Citation-aware ranking
   - Trending papers detection

3. **Better UI**
   - Save search history
   - Bookmark papers
   - Export results
   - Dark mode

4. **API**
   - RESTful API for programmatic access
   - Webhook integrations
   - Slack/Discord bots

## 🐛 Troubleshooting

### Database not found

```
Error: Database not found at data/vectordb
```

**Solution**: Run indexing first:
```bash
python scripts/setup_vectordb.py
```

### Model download fails

```
Error downloading model
```

**Solution**: Check internet connection and try again. The model is downloaded from HuggingFace.

### Out of memory during indexing

```
MemoryError
```

**Solution**: Index in batches or use a smaller embedding model.

### Port already in use

```
Address already in use
```

**Solution**: Use a different port:
```bash
python scripts/web_qa.py --port 5001
```

### Empty search results

**Possible causes:**
1. Database not indexed - run `python scripts/setup_vectordb.py`
2. Query too specific - try broader terms
3. Papers don't match query - verify papers.yaml content

## 📊 Database Statistics

View database stats:

```bash
python scripts/setup_vectordb.py --stats-only
```

Or in query mode:

```bash
python scripts/query_papers.py -i
# Then type: stats
```

## 🔒 Privacy & Security

- ✅ **100% Local**: All processing happens on your machine
- ✅ **No External Calls**: Embeddings generated locally
- ✅ **No Data Leakage**: Your papers never leave your system
- ✅ **Open Source**: Full transparency of what's happening

## 📝 Best Practices

1. **Keep Database Updated**: Re-index after adding papers
2. **Use Descriptive Queries**: Natural language works best
3. **Explore Similar Papers**: Great for literature review
4. **Save Useful Queries**: Document common searches
5. **Regular Backups**: Backup `data/vectordb/` directory

## 🆘 Getting Help

If you encounter issues:

1. Check this documentation
2. Verify all dependencies are installed
3. Ensure papers.yaml is valid
4. Check console output for errors
5. Try re-indexing the database

## 📚 Additional Resources

- [ChromaDB Documentation](https://docs.trychroma.com/)
- [Sentence Transformers](https://www.sbert.net/)
- [Flask Documentation](https://flask.palletsprojects.com/)
- [Vector Search Explained](https://www.pinecone.io/learn/vector-search/)

---

**Note**: This Q&A system is designed to work offline and doesn't require API keys. For even better results, you can optionally integrate with a local LLM (see Future Enhancements section).
