#!/usr/bin/env python3
"""
Simple web interface for paper Q&A system.

This provides a Flask-based web interface for searching and querying papers
using the vector database.
"""

import os
import sys
from pathlib import Path

try:
    from flask import Flask, render_template_string, request, jsonify
    from flask_cors import CORS
except ImportError:
    print("Error: Flask not installed")
    print("Please install: pip install flask flask-cors")
    sys.exit(1)

# Import query engine
sys.path.insert(0, os.path.dirname(__file__))
try:
    from query_papers import PaperQueryEngine
except ImportError:
    print("Error: Could not import query_papers module")
    sys.exit(1)


# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Initialize query engine (will be set in main)
query_engine = None


# HTML Template
HTML_TEMPLATE = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Paper Q&A System</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 2rem;
        }

        .container {
            max-width: 1000px;
            margin: 0 auto;
        }

        .header {
            text-align: center;
            color: white;
            margin-bottom: 2rem;
        }

        .header h1 {
            font-size: 2.5rem;
            margin-bottom: 0.5rem;
        }

        .header p {
            font-size: 1.1rem;
            opacity: 0.9;
        }

        .search-box {
            background: white;
            border-radius: 12px;
            padding: 2rem;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            margin-bottom: 2rem;
        }

        .search-input-container {
            display: flex;
            gap: 1rem;
            margin-bottom: 1rem;
        }

        #searchInput {
            flex: 1;
            padding: 1rem;
            font-size: 1rem;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            transition: border-color 0.3s;
        }

        #searchInput:focus {
            outline: none;
            border-color: #667eea;
        }

        .btn {
            padding: 1rem 2rem;
            font-size: 1rem;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s;
            font-weight: 600;
        }

        .btn-primary {
            background: #667eea;
            color: white;
        }

        .btn-primary:hover {
            background: #5568d3;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .btn-secondary {
            background: #f0f0f0;
            color: #333;
        }

        .btn-secondary:hover {
            background: #e0e0e0;
        }

        .options {
            display: flex;
            gap: 1rem;
            align-items: center;
        }

        .options label {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.9rem;
            color: #666;
        }

        .loading {
            text-align: center;
            padding: 2rem;
            display: none;
        }

        .spinner {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #667eea;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 0 auto;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .results {
            display: none;
        }

        .result-card {
            background: white;
            border-radius: 12px;
            padding: 1.5rem;
            margin-bottom: 1rem;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            transition: transform 0.3s, box-shadow 0.3s;
        }

        .result-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 24px rgba(0,0,0,0.15);
        }

        .result-title {
            font-size: 1.2rem;
            color: #333;
            margin-bottom: 0.5rem;
            font-weight: 600;
        }

        .result-meta {
            display: flex;
            gap: 1rem;
            margin-bottom: 1rem;
            font-size: 0.9rem;
            color: #666;
        }

        .result-meta span {
            display: flex;
            align-items: center;
            gap: 0.25rem;
        }

        .badge {
            display: inline-block;
            padding: 0.25rem 0.75rem;
            border-radius: 12px;
            font-size: 0.85rem;
            font-weight: 600;
        }

        .badge-primary {
            background: #e3f2fd;
            color: #1976d2;
        }

        .badge-success {
            background: #e8f5e9;
            color: #388e3c;
        }

        .relevance-bar {
            height: 4px;
            background: #e0e0e0;
            border-radius: 2px;
            overflow: hidden;
            margin-bottom: 1rem;
        }

        .relevance-fill {
            height: 100%;
            background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
            transition: width 0.5s ease-out;
        }

        .result-content {
            color: #555;
            line-height: 1.6;
            margin-top: 1rem;
            padding-top: 1rem;
            border-top: 1px solid #e0e0e0;
        }

        .stats {
            background: white;
            border-radius: 12px;
            padding: 1.5rem;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            margin-bottom: 2rem;
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
        }

        .stat-item {
            text-align: center;
            padding: 1rem;
            background: #f8f9fa;
            border-radius: 8px;
        }

        .stat-value {
            font-size: 2rem;
            font-weight: 700;
            color: #667eea;
            margin-bottom: 0.25rem;
        }

        .stat-label {
            font-size: 0.9rem;
            color: #666;
        }

        .examples {
            margin-top: 1rem;
            padding-top: 1rem;
            border-top: 1px solid #e0e0e0;
        }

        .examples h3 {
            font-size: 0.9rem;
            color: #666;
            margin-bottom: 0.5rem;
        }

        .example-queries {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
        }

        .example-query {
            background: #f0f0f0;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-size: 0.85rem;
            cursor: pointer;
            transition: all 0.3s;
        }

        .example-query:hover {
            background: #667eea;
            color: white;
        }

        @media (max-width: 768px) {
            body {
                padding: 1rem;
            }

            .header h1 {
                font-size: 2rem;
            }

            .search-input-container {
                flex-direction: column;
            }

            .options {
                flex-direction: column;
                align-items: flex-start;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔍 Paper Q&A System</h1>
            <p>Semantic search and question answering over your paper collection</p>
        </div>

        <div class="stats" id="stats">
            <div class="stats-grid">
                <div class="stat-item">
                    <div class="stat-value" id="totalChunks">-</div>
                    <div class="stat-label">Indexed Chunks</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value" id="totalPapers">-</div>
                    <div class="stat-label">Papers</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">Ready</div>
                    <div class="stat-label">Status</div>
                </div>
            </div>
        </div>

        <div class="search-box">
            <div class="search-input-container">
                <input
                    type="text"
                    id="searchInput"
                    placeholder="Ask a question or search for papers..."
                    onkeypress="if(event.key==='Enter') search()"
                />
                <button class="btn btn-primary" onclick="search()">Search</button>
                <button class="btn btn-secondary" onclick="clearResults()">Clear</button>
            </div>

            <div class="options">
                <label>
                    <input type="number" id="numResults" value="5" min="1" max="20" style="width: 60px; padding: 0.5rem;">
                    Results
                </label>
            </div>

            <div class="examples">
                <h3>Example queries:</h3>
                <div class="example-queries">
                    <span class="example-query" onclick="setQuery('3D reconstruction methods')">3D reconstruction methods</span>
                    <span class="example-query" onclick="setQuery('neural rendering techniques')">Neural rendering techniques</span>
                    <span class="example-query" onclick="setQuery('medical image segmentation')">Medical image segmentation</span>
                    <span class="example-query" onclick="setQuery('self-supervised learning')">Self-supervised learning</span>
                </div>
            </div>
        </div>

        <div class="loading" id="loading">
            <div class="spinner"></div>
            <p style="margin-top: 1rem; color: white;">Searching...</p>
        </div>

        <div class="results" id="results"></div>
    </div>

    <script>
        // Load stats on page load
        window.onload = function() {
            loadStats();
        };

        function loadStats() {
            fetch('/api/stats')
                .then(response => response.json())
                .then(data => {
                    document.getElementById('totalChunks').textContent = data.total_chunks;
                    // Estimate papers (roughly chunks / 3)
                    const estPapers = Math.round(data.total_chunks / 3);
                    document.getElementById('totalPapers').textContent = `~${estPapers}`;
                })
                .catch(error => {
                    console.error('Error loading stats:', error);
                });
        }

        function setQuery(query) {
            document.getElementById('searchInput').value = query;
            search();
        }

        function search() {
            const query = document.getElementById('searchInput').value.trim();
            if (!query) return;

            const numResults = document.getElementById('numResults').value;

            // Show loading
            document.getElementById('loading').style.display = 'block';
            document.getElementById('results').style.display = 'none';

            // Make request
            fetch(`/api/search?q=${encodeURIComponent(query)}&n=${numResults}`)
                .then(response => response.json())
                .then(data => {
                    displayResults(data.results);
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Search failed. Please try again.');
                })
                .finally(() => {
                    document.getElementById('loading').style.display = 'none';
                });
        }

        function displayResults(results) {
            const container = document.getElementById('results');
            container.innerHTML = '';

            if (!results || results.length === 0) {
                container.innerHTML = `
                    <div class="result-card">
                        <p style="text-align: center; color: #666;">No results found. Try a different query.</p>
                    </div>
                `;
                container.style.display = 'block';
                return;
            }

            results.forEach((result, index) => {
                const relevance = result.distance !== null ? (1 - result.distance) * 100 : 100;
                const meta = result.metadata;

                const card = document.createElement('div');
                card.className = 'result-card';
                card.innerHTML = `
                    <div class="relevance-bar">
                        <div class="relevance-fill" style="width: ${relevance}%"></div>
                    </div>
                    <div class="result-title">${meta.title || 'Unknown Title'}</div>
                    <div class="result-meta">
                        <span>📅 ${meta.year || 'N/A'}</span>
                        <span>📍 ${meta.venue || 'Unknown'}</span>
                        <span class="badge badge-primary">${meta.chunk_type || 'content'}</span>
                        ${relevance >= 80 ? '<span class="badge badge-success">Highly Relevant</span>' : ''}
                    </div>
                    ${meta.authors ? `<div style="margin-bottom: 0.5rem; color: #666; font-size: 0.9rem;">👥 ${meta.authors}</div>` : ''}
                    <div class="result-content">${result.text}</div>
                `;

                container.appendChild(card);
            });

            container.style.display = 'block';
        }

        function clearResults() {
            document.getElementById('searchInput').value = '';
            document.getElementById('results').innerHTML = '';
            document.getElementById('results').style.display = 'none';
        }
    </script>
</body>
</html>
"""


@app.route('/')
def index():
    """Serve the main page."""
    return render_template_string(HTML_TEMPLATE)


@app.route('/api/stats')
def api_stats():
    """Get database statistics."""
    stats = query_engine.get_stats()
    return jsonify(stats)


@app.route('/api/search')
def api_search():
    """Search papers."""
    query = request.args.get('q', '')
    n_results = int(request.args.get('n', 5))

    if not query:
        return jsonify({'error': 'No query provided'}), 400

    results = query_engine.search(query, n_results=n_results)

    return jsonify({'results': results})


@app.route('/api/similar/<paper_id>')
def api_similar(paper_id):
    """Find similar papers."""
    n_results = int(request.args.get('n', 5))
    similar = query_engine.find_similar_papers(paper_id, n_results=n_results)
    return jsonify({'similar': similar})


def main():
    """Main entry point."""
    import argparse

    parser = argparse.ArgumentParser(
        description='Web interface for paper Q&A system'
    )
    parser.add_argument(
        '--db-path',
        default='data/vectordb',
        help='Path to vector database (default: data/vectordb)'
    )
    parser.add_argument(
        '--collection',
        default='papers',
        help='Collection name (default: papers)'
    )
    parser.add_argument(
        '--host',
        default='127.0.0.1',
        help='Host to bind to (default: 127.0.0.1)'
    )
    parser.add_argument(
        '--port',
        type=int,
        default=5000,
        help='Port to bind to (default: 5000)'
    )
    parser.add_argument(
        '--debug',
        action='store_true',
        help='Run in debug mode'
    )

    args = parser.parse_args()

    # Initialize query engine
    global query_engine
    print("Initializing query engine...")
    query_engine = PaperQueryEngine(db_path=args.db_path, collection_name=args.collection)

    # Start server
    print(f"\n🚀 Starting web server...")
    print(f"📍 Access at: http://{args.host}:{args.port}")
    print(f"Press Ctrl+C to stop\n")

    app.run(host=args.host, port=args.port, debug=args.debug)


if __name__ == '__main__':
    main()
