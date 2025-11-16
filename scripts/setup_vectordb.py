#!/usr/bin/env python3
"""
Setup and manage ChromaDB vector database for paper Q&A system.

This script creates a ChromaDB collection and indexes all papers from the
papers.yaml database. It uses sentence-transformers for embedding generation.
"""

import os
import sys
import yaml
import argparse
from pathlib import Path
from typing import List, Dict, Optional
from datetime import datetime

try:
    import chromadb
    from chromadb.config import Settings
    from sentence_transformers import SentenceTransformer
except ImportError as e:
    print(f"Error: Required package not installed: {e}")
    print("Please install: pip install chromadb sentence-transformers")
    sys.exit(1)


class PaperVectorDB:
    """Manage vector database for paper search and Q&A."""

    def __init__(self, db_path: str = "data/vectordb", collection_name: str = "papers"):
        """
        Initialize the vector database.

        Args:
            db_path: Path to store ChromaDB data
            collection_name: Name of the collection
        """
        self.db_path = db_path
        self.collection_name = collection_name

        # Create directory if needed
        os.makedirs(db_path, exist_ok=True)

        # Initialize ChromaDB client
        self.client = chromadb.PersistentClient(
            path=db_path,
            settings=Settings(
                anonymized_telemetry=False,
                allow_reset=True
            )
        )

        # Load embedding model (using a lightweight model)
        print("Loading embedding model (all-MiniLM-L6-v2)...")
        self.embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
        print("✅ Model loaded successfully")

        # Get or create collection
        try:
            self.collection = self.client.get_collection(name=collection_name)
            print(f"✅ Loaded existing collection: {collection_name}")
        except:
            self.collection = self.client.create_collection(
                name=collection_name,
                metadata={"description": "Research paper embeddings for Q&A"}
            )
            print(f"✅ Created new collection: {collection_name}")

    def create_paper_chunks(self, paper: Dict) -> List[Dict]:
        """
        Create searchable chunks from a paper.

        Args:
            paper: Paper dictionary

        Returns:
            List of chunk dictionaries with text and metadata
        """
        chunks = []
        paper_id = paper.get('id', 'unknown')
        title = paper.get('title', 'Unknown')

        # Chunk 1: Title + Abstract
        abstract = paper.get('abstract', paper.get('ai_summary', ''))
        if abstract:
            chunks.append({
                'id': f"{paper_id}_abstract",
                'text': f"Title: {title}\n\nAbstract: {abstract}",
                'metadata': {
                    'paper_id': paper_id,
                    'title': title,
                    'chunk_type': 'abstract',
                    'year': str(paper.get('year', '')),
                    'venue': paper.get('venue', ''),
                    'authors': ', '.join(paper.get('authors', [])[:3])
                }
            })

        # Chunk 2-N: Key Contributions (each as a separate chunk)
        contributions = paper.get('key_contributions', [])
        for i, contrib in enumerate(contributions, 1):
            chunks.append({
                'id': f"{paper_id}_contrib_{i}",
                'text': f"Title: {title}\n\nKey Contribution {i}: {contrib}",
                'metadata': {
                    'paper_id': paper_id,
                    'title': title,
                    'chunk_type': f'contribution_{i}',
                    'year': str(paper.get('year', '')),
                    'venue': paper.get('venue', ''),
                    'authors': ', '.join(paper.get('authors', [])[:3])
                }
            })

        # Chunk N+1: Metadata summary
        categories = ', '.join(paper.get('categories', []))
        metadata_text = (
            f"Title: {title}\n"
            f"Authors: {', '.join(paper.get('authors', []))}\n"
            f"Venue: {paper.get('venue', 'Unknown')}\n"
            f"Year: {paper.get('year', 'N/A')}\n"
            f"Categories: {categories}\n"
            f"Type: {paper.get('type', 'Research')}"
        )

        if paper.get('notes'):
            metadata_text += f"\nNotes: {paper.get('notes')}"

        chunks.append({
            'id': f"{paper_id}_metadata",
            'text': metadata_text,
            'metadata': {
                'paper_id': paper_id,
                'title': title,
                'chunk_type': 'metadata',
                'year': str(paper.get('year', '')),
                'venue': paper.get('venue', ''),
                'categories': categories
            }
        })

        return chunks

    def index_papers(self, papers_yaml_path: str, clear_existing: bool = False) -> Dict:
        """
        Index all papers from YAML file into vector database.

        Args:
            papers_yaml_path: Path to papers.yaml file
            clear_existing: If True, clear existing collection first

        Returns:
            Dictionary with indexing statistics
        """
        # Clear collection if requested
        if clear_existing:
            print("⚠️  Clearing existing collection...")
            self.client.delete_collection(name=self.collection_name)
            self.collection = self.client.create_collection(
                name=self.collection_name,
                metadata={"description": "Research paper embeddings for Q&A"}
            )

        # Load papers
        with open(papers_yaml_path, 'r', encoding='utf-8') as f:
            data = yaml.safe_load(f)

        papers = data.get('papers', [])
        if not papers:
            print("⚠️  No papers found in database")
            return {'total': 0, 'indexed': 0, 'chunks': 0}

        print(f"\n📚 Indexing {len(papers)} papers...")

        stats = {
            'total': len(papers),
            'indexed': 0,
            'chunks': 0,
            'errors': []
        }

        all_ids = []
        all_texts = []
        all_metadatas = []

        for i, paper in enumerate(papers, 1):
            paper_id = paper.get('id', f'paper_{i}')
            title = paper.get('title', 'Unknown')

            try:
                # Create chunks for this paper
                chunks = self.create_paper_chunks(paper)

                if not chunks:
                    print(f"  [{i}/{len(papers)}] ⚠️  No content to index: {title[:60]}")
                    continue

                # Add chunks to batch
                for chunk in chunks:
                    all_ids.append(chunk['id'])
                    all_texts.append(chunk['text'])
                    all_metadatas.append(chunk['metadata'])

                stats['indexed'] += 1
                stats['chunks'] += len(chunks)

                print(f"  [{i}/{len(papers)}] ✅ {title[:60]}... ({len(chunks)} chunks)")

            except Exception as e:
                print(f"  [{i}/{len(papers)}] ❌ Error: {title[:60]}")
                stats['errors'].append({
                    'paper_id': paper_id,
                    'title': title,
                    'error': str(e)
                })

        # Generate embeddings and add to collection
        if all_texts:
            print(f"\n🔄 Generating embeddings for {len(all_texts)} chunks...")
            embeddings = self.embedding_model.encode(all_texts, show_progress_bar=True)

            print(f"💾 Adding to vector database...")
            self.collection.add(
                ids=all_ids,
                embeddings=embeddings.tolist(),
                documents=all_texts,
                metadatas=all_metadatas
            )

        return stats

    def search(self, query: str, n_results: int = 5) -> Dict:
        """
        Search for relevant papers using semantic search.

        Args:
            query: Search query
            n_results: Number of results to return

        Returns:
            Dictionary with search results
        """
        # Generate query embedding
        query_embedding = self.embedding_model.encode([query])[0]

        # Search collection
        results = self.collection.query(
            query_embeddings=[query_embedding.tolist()],
            n_results=n_results
        )

        return results

    def get_stats(self) -> Dict:
        """
        Get database statistics.

        Returns:
            Dictionary with stats
        """
        count = self.collection.count()
        return {
            'collection_name': self.collection_name,
            'total_chunks': count,
            'db_path': self.db_path
        }


def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(
        description='Setup vector database for paper Q&A system'
    )
    parser.add_argument(
        '--papers-yaml',
        default='data/papers/papers.yaml',
        help='Path to papers.yaml file (default: data/papers/papers.yaml)'
    )
    parser.add_argument(
        '--db-path',
        default='data/vectordb',
        help='Path to store vector database (default: data/vectordb)'
    )
    parser.add_argument(
        '--collection',
        default='papers',
        help='Collection name (default: papers)'
    )
    parser.add_argument(
        '--clear',
        action='store_true',
        help='Clear existing collection before indexing'
    )
    parser.add_argument(
        '--stats-only',
        action='store_true',
        help='Only show database statistics'
    )

    args = parser.parse_args()

    # Initialize database
    print("🚀 Initializing vector database...\n")
    db = PaperVectorDB(db_path=args.db_path, collection_name=args.collection)

    if args.stats_only:
        # Show stats only
        stats = db.get_stats()
        print("\n📊 Database Statistics:")
        print(f"  Collection: {stats['collection_name']}")
        print(f"  Total chunks: {stats['total_chunks']}")
        print(f"  DB path: {stats['db_path']}")
        return 0

    # Check if papers.yaml exists
    if not os.path.exists(args.papers_yaml):
        print(f"Error: Papers file not found: {args.papers_yaml}", file=sys.stderr)
        return 1

    # Index papers
    stats = db.index_papers(args.papers_yaml, clear_existing=args.clear)

    # Print summary
    print("\n" + "="*60)
    print("📊 Indexing Summary")
    print("="*60)
    print(f"Total papers: {stats['total']}")
    print(f"✅ Indexed: {stats['indexed']}")
    print(f"📝 Total chunks: {stats['chunks']}")
    print(f"❌ Errors: {len(stats.get('errors', []))}")

    if stats.get('errors'):
        print("\n⚠️  Errors:")
        for error in stats['errors']:
            print(f"  - {error['title'][:60]}: {error['error']}")

    # Show final stats
    final_stats = db.get_stats()
    print(f"\n✨ Vector database ready!")
    print(f"📍 Location: {final_stats['db_path']}")
    print(f"📊 Total chunks in database: {final_stats['total_chunks']}")

    return 0


if __name__ == '__main__':
    sys.exit(main())
