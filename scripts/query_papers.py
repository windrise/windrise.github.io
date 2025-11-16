#!/usr/bin/env python3
"""
Query papers using the vector database.

This script provides semantic search and Q&A functionality over the paper collection
using ChromaDB and sentence transformers.
"""

import os
import sys
import yaml
import argparse
from pathlib import Path
from typing import List, Dict, Optional

try:
    import chromadb
    from chromadb.config import Settings
    from sentence_transformers import SentenceTransformer
except ImportError as e:
    print(f"Error: Required package not installed: {e}")
    print("Please install: pip install chromadb sentence-transformers")
    sys.exit(1)


class PaperQueryEngine:
    """Query engine for paper search and Q&A."""

    def __init__(self, db_path: str = "data/vectordb", collection_name: str = "papers"):
        """
        Initialize the query engine.

        Args:
            db_path: Path to ChromaDB data
            collection_name: Name of the collection
        """
        self.db_path = db_path
        self.collection_name = collection_name

        # Check if database exists
        if not os.path.exists(db_path):
            print(f"Error: Database not found at {db_path}")
            print("Please run: python scripts/setup_vectordb.py")
            sys.exit(1)

        # Initialize ChromaDB client
        self.client = chromadb.PersistentClient(
            path=db_path,
            settings=Settings(
                anonymized_telemetry=False
            )
        )

        # Load embedding model
        print("Loading embedding model...")
        self.embedding_model = SentenceTransformer('all-MiniLM-L6-v2')

        # Get collection
        try:
            self.collection = self.client.get_collection(name=collection_name)
            print(f"✅ Connected to collection: {collection_name}")
            print(f"📊 Total chunks: {self.collection.count()}\n")
        except Exception as e:
            print(f"Error: Collection '{collection_name}' not found")
            print(f"Please run: python scripts/setup_vectordb.py")
            sys.exit(1)

    def search(self, query: str, n_results: int = 5, filter_metadata: Optional[Dict] = None) -> List[Dict]:
        """
        Search for relevant papers.

        Args:
            query: Search query
            n_results: Number of results to return
            filter_metadata: Optional metadata filters

        Returns:
            List of result dictionaries
        """
        # Generate query embedding
        query_embedding = self.embedding_model.encode([query])[0]

        # Build where clause if filters provided
        where = filter_metadata if filter_metadata else None

        # Search collection
        results = self.collection.query(
            query_embeddings=[query_embedding.tolist()],
            n_results=n_results,
            where=where
        )

        # Format results
        formatted_results = []
        if results['ids'] and results['ids'][0]:
            for i in range(len(results['ids'][0])):
                formatted_results.append({
                    'id': results['ids'][0][i],
                    'text': results['documents'][0][i],
                    'metadata': results['metadatas'][0][i],
                    'distance': results['distances'][0][i] if 'distances' in results else None
                })

        return formatted_results

    def answer_question(self, question: str, n_context: int = 3) -> Dict:
        """
        Answer a question using relevant paper context.

        Args:
            question: Question to answer
            n_context: Number of relevant chunks to use as context

        Returns:
            Dictionary with answer and context
        """
        # Search for relevant context
        results = self.search(question, n_results=n_context)

        if not results:
            return {
                'question': question,
                'answer': 'No relevant papers found.',
                'context': []
            }

        # Build context from results
        context_parts = []
        sources = []

        for i, result in enumerate(results, 1):
            metadata = result['metadata']
            text = result['text']

            context_parts.append(f"[Source {i}] {text}")
            sources.append({
                'paper_id': metadata.get('paper_id'),
                'title': metadata.get('title'),
                'chunk_type': metadata.get('chunk_type'),
                'relevance': 1.0 - (result['distance'] if result['distance'] else 0)
            })

        context = '\n\n'.join(context_parts)

        # For now, return the context (in the future, this can be passed to an LLM)
        answer = self._generate_simple_answer(question, results)

        return {
            'question': question,
            'answer': answer,
            'context': context,
            'sources': sources
        }

    def _generate_simple_answer(self, question: str, results: List[Dict]) -> str:
        """
        Generate a simple answer based on retrieved results.

        Args:
            question: The question
            results: Retrieved results

        Returns:
            Answer string
        """
        if not results:
            return "I couldn't find any relevant information in the paper collection."

        # Get top result
        top_result = results[0]
        metadata = top_result['metadata']

        # Build simple answer based on chunk type
        chunk_type = metadata.get('chunk_type', '')

        if 'abstract' in chunk_type:
            return (
                f"Based on the paper '{metadata.get('title')}' "
                f"({metadata.get('venue')}, {metadata.get('year')}), "
                f"here's what I found:\n\n{top_result['text']}"
            )
        elif 'contribution' in chunk_type:
            return (
                f"The paper '{metadata.get('title')}' addresses this. "
                f"Here's a relevant contribution:\n\n{top_result['text']}"
            )
        else:
            return (
                f"I found relevant information in '{metadata.get('title')}':\n\n"
                f"{top_result['text']}"
            )

    def find_similar_papers(self, paper_id: str, n_results: int = 5) -> List[Dict]:
        """
        Find papers similar to a given paper.

        Args:
            paper_id: Paper ID to find similar papers for
            n_results: Number of similar papers to return

        Returns:
            List of similar papers
        """
        # Get the paper's abstract chunk
        try:
            results = self.collection.get(
                ids=[f"{paper_id}_abstract"],
                include=['documents', 'embeddings', 'metadatas']
            )

            if not results['ids']:
                print(f"Error: Paper '{paper_id}' not found in database")
                return []

            # Use the abstract embedding to find similar papers
            embedding = results['embeddings'][0]

            similar = self.collection.query(
                query_embeddings=[embedding],
                n_results=n_results + 1  # +1 because it will include itself
            )

            # Format and filter out the source paper
            formatted = []
            for i in range(len(similar['ids'][0])):
                chunk_id = similar['ids'][0][i]
                metadata = similar['metadatas'][0][i]

                # Skip the source paper and non-abstract chunks
                if metadata.get('paper_id') == paper_id:
                    continue
                if not chunk_id.endswith('_abstract'):
                    continue

                formatted.append({
                    'paper_id': metadata.get('paper_id'),
                    'title': metadata.get('title'),
                    'year': metadata.get('year'),
                    'venue': metadata.get('venue'),
                    'similarity': 1.0 - similar['distances'][0][i]
                })

            return formatted[:n_results]

        except Exception as e:
            print(f"Error finding similar papers: {e}")
            return []

    def get_stats(self) -> Dict:
        """
        Get database statistics.

        Returns:
            Statistics dictionary
        """
        count = self.collection.count()
        return {
            'collection_name': self.collection_name,
            'total_chunks': count,
            'db_path': self.db_path
        }


def print_results(results: List[Dict], show_full: bool = False):
    """Print search results in a readable format."""
    if not results:
        print("No results found.")
        return

    for i, result in enumerate(results, 1):
        metadata = result['metadata']
        print(f"\n{'='*80}")
        print(f"Result {i}: {metadata.get('title', 'Unknown')}")
        print(f"{'='*80}")
        print(f"Paper ID: {metadata.get('paper_id')}")
        print(f"Type: {metadata.get('chunk_type')}")
        print(f"Year: {metadata.get('year')} | Venue: {metadata.get('venue')}")

        if result.get('distance') is not None:
            relevance = 1.0 - result['distance']
            print(f"Relevance: {relevance:.2%}")

        if show_full:
            print(f"\nContent:\n{result['text']}")
        else:
            # Show preview
            preview = result['text'][:200] + "..." if len(result['text']) > 200 else result['text']
            print(f"\nPreview:\n{preview}")


def interactive_mode(engine: PaperQueryEngine):
    """Run interactive query mode."""
    print("\n" + "="*80)
    print("🔍 Interactive Paper Query Mode")
    print("="*80)
    print("\nCommands:")
    print("  - Type your question or search query")
    print("  - 'similar <paper-id>' - Find similar papers")
    print("  - 'stats' - Show database statistics")
    print("  - 'quit' or 'exit' - Exit")
    print("\n" + "="*80 + "\n")

    while True:
        try:
            query = input("🔍 Query: ").strip()

            if not query:
                continue

            if query.lower() in ['quit', 'exit', 'q']:
                print("Goodbye!")
                break

            elif query.lower() == 'stats':
                stats = engine.get_stats()
                print(f"\n📊 Database Statistics:")
                print(f"  Collection: {stats['collection_name']}")
                print(f"  Total chunks: {stats['total_chunks']}")
                print(f"  DB path: {stats['db_path']}")

            elif query.lower().startswith('similar '):
                paper_id = query[8:].strip()
                print(f"\n🔍 Finding papers similar to: {paper_id}\n")
                similar = engine.find_similar_papers(paper_id, n_results=5)

                if similar:
                    for i, paper in enumerate(similar, 1):
                        print(f"{i}. {paper['title']}")
                        print(f"   ({paper['venue']} {paper['year']}) - Similarity: {paper['similarity']:.2%}")
                else:
                    print("No similar papers found.")

            else:
                # Regular search/question
                print(f"\n🔍 Searching...\n")
                results = engine.search(query, n_results=5)
                print_results(results, show_full=False)

        except KeyboardInterrupt:
            print("\n\nGoodbye!")
            break
        except Exception as e:
            print(f"\n❌ Error: {e}")


def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(
        description='Query papers using semantic search'
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
        '--query',
        '-q',
        help='Search query'
    )
    parser.add_argument(
        '--similar',
        help='Find papers similar to the given paper ID'
    )
    parser.add_argument(
        '--results',
        '-n',
        type=int,
        default=5,
        help='Number of results to return (default: 5)'
    )
    parser.add_argument(
        '--full',
        action='store_true',
        help='Show full content instead of preview'
    )
    parser.add_argument(
        '--interactive',
        '-i',
        action='store_true',
        help='Run in interactive mode'
    )

    args = parser.parse_args()

    # Initialize query engine
    engine = PaperQueryEngine(db_path=args.db_path, collection_name=args.collection)

    if args.interactive:
        # Interactive mode
        interactive_mode(engine)

    elif args.similar:
        # Find similar papers
        print(f"\n🔍 Finding papers similar to: {args.similar}\n")
        similar = engine.find_similar_papers(args.similar, n_results=args.results)

        if similar:
            for i, paper in enumerate(similar, 1):
                print(f"{i}. {paper['title']}")
                print(f"   ({paper['venue']} {paper['year']}) - Similarity: {paper['similarity']:.2%}\n")
        else:
            print("No similar papers found.")

    elif args.query:
        # Single query
        print(f"\n🔍 Searching for: {args.query}\n")
        results = engine.search(args.query, n_results=args.results)
        print_results(results, show_full=args.full)

    else:
        # No query provided, show help
        parser.print_help()
        print("\nExamples:")
        print("  python scripts/query_papers.py -q 'gaussian splatting 3D reconstruction'")
        print("  python scripts/query_papers.py --similar gaussian-splatting-2023")
        print("  python scripts/query_papers.py -i  # Interactive mode")

    return 0


if __name__ == '__main__':
    sys.exit(main())
