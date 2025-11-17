#!/usr/bin/env python3
"""
Paper Recommendation Engine.

This script provides intelligent paper recommendations based on:
- Similar papers (using vector database)
- Author tracking
- Venue/conference tracking
- Category interests
- Reading history and preferences
"""

import os
import sys
import yaml
import argparse
from pathlib import Path
from typing import Dict, List, Optional, Set, Tuple
from collections import Counter, defaultdict
from datetime import datetime

# Import vector database if available
HAS_VECTORDB = False
PaperQueryEngine = None
try:
    from query_papers import PaperQueryEngine
    HAS_VECTORDB = True
except (ImportError, ModuleNotFoundError) as e:
    # Vector database dependencies not installed, that's ok
    pass


class PaperRecommender:
    """Recommend papers based on various criteria."""

    def __init__(self, papers_yaml_path: str = "data/papers/papers.yaml",
                 vectordb_path: str = "data/vectordb"):
        """
        Initialize recommender.

        Args:
            papers_yaml_path: Path to papers.yaml
            vectordb_path: Path to vector database
        """
        self.papers_yaml_path = papers_yaml_path
        self.vectordb_path = vectordb_path

        # Load papers data
        with open(papers_yaml_path, 'r', encoding='utf-8') as f:
            self.data = yaml.safe_load(f)

        self.papers = self.data.get('papers', [])
        self.categories = self.data.get('categories', [])

        # Initialize vector database if available
        self.query_engine = None
        if HAS_VECTORDB and os.path.exists(vectordb_path):
            try:
                self.query_engine = PaperQueryEngine(db_path=vectordb_path)
                print("✅ Vector database loaded for similarity search")
            except Exception as e:
                print(f"⚠️  Could not load vector database: {e}")

    def get_similar_papers_by_content(self, paper_id: str, n: int = 5) -> List[Dict]:
        """
        Get similar papers using vector database.

        Args:
            paper_id: Paper ID
            n: Number of recommendations

        Returns:
            List of similar papers with scores
        """
        if not self.query_engine:
            return []

        try:
            similar = self.query_engine.find_similar_papers(paper_id, n_results=n)
            return similar
        except Exception as e:
            print(f"Error finding similar papers: {e}")
            return []

    def get_papers_by_author(self, author_name: str, exclude_ids: Set[str] = None) -> List[Dict]:
        """
        Get all papers by an author.

        Args:
            author_name: Author name (partial match)
            exclude_ids: Paper IDs to exclude

        Returns:
            List of papers
        """
        exclude_ids = exclude_ids or set()
        author_lower = author_name.lower()

        matching_papers = []
        for paper in self.papers:
            if paper.get('id') in exclude_ids:
                continue

            authors = paper.get('authors', [])
            if any(author_lower in author.lower() for author in authors):
                matching_papers.append(paper)

        return matching_papers

    def get_papers_by_venue(self, venue: str, exclude_ids: Set[str] = None,
                           limit: Optional[int] = None) -> List[Dict]:
        """
        Get papers from a specific venue.

        Args:
            venue: Venue name (partial match)
            exclude_ids: Paper IDs to exclude
            limit: Max number of papers

        Returns:
            List of papers
        """
        exclude_ids = exclude_ids or set()
        venue_lower = venue.lower()

        matching_papers = []
        for paper in self.papers:
            if paper.get('id') in exclude_ids:
                continue

            paper_venue = paper.get('venue', '').lower()
            if venue_lower in paper_venue:
                matching_papers.append(paper)
                if limit and len(matching_papers) >= limit:
                    break

        return matching_papers

    def get_papers_by_category(self, category: str, exclude_ids: Set[str] = None,
                               limit: Optional[int] = None) -> List[Dict]:
        """
        Get papers in a category.

        Args:
            category: Category ID or name
            exclude_ids: Paper IDs to exclude
            limit: Max number of papers

        Returns:
            List of papers
        """
        exclude_ids = exclude_ids or set()
        category_lower = category.lower()

        matching_papers = []
        for paper in self.papers:
            if paper.get('id') in exclude_ids:
                continue

            paper_cats = paper.get('categories', [])
            if any(category_lower in cat.lower() for cat in paper_cats):
                matching_papers.append(paper)
                if limit and len(matching_papers) >= limit:
                    break

        return matching_papers

    def get_trending_papers(self, min_citations: int = 10, limit: int = 10) -> List[Dict]:
        """
        Get trending papers (recent + cited).

        Args:
            min_citations: Minimum citation count
            limit: Max number of papers

        Returns:
            List of trending papers
        """
        current_year = datetime.now().year

        # Papers from last 2 years with citations
        trending = [
            p for p in self.papers
            if p.get('year', 0) >= current_year - 2
            and p.get('citation_count', 0) >= min_citations
        ]

        # Sort by citation count
        trending.sort(key=lambda p: p.get('citation_count', 0), reverse=True)

        return trending[:limit]

    def recommend_based_on_paper(self, paper_id: str, n: int = 10) -> Dict:
        """
        Get comprehensive recommendations based on a paper.

        Args:
            paper_id: Paper ID to base recommendations on
            n: Total number of recommendations

        Returns:
            Dictionary with different recommendation types
        """
        # Find the paper
        paper = next((p for p in self.papers if p.get('id') == paper_id), None)
        if not paper:
            return {'error': f'Paper {paper_id} not found'}

        recommendations = {
            'source_paper': paper,
            'similar_by_content': [],
            'same_authors': [],
            'same_venue': [],
            'same_categories': []
        }

        exclude_ids = {paper_id}

        # 1. Similar by content (vector database)
        if self.query_engine:
            similar = self.get_similar_papers_by_content(paper_id, n=5)
            recommendations['similar_by_content'] = similar
            exclude_ids.update(s['paper_id'] for s in similar)

        # 2. Same authors
        authors = paper.get('authors', [])
        if authors:
            # Pick first author for recommendations
            author_papers = self.get_papers_by_author(authors[0], exclude_ids)
            recommendations['same_authors'] = author_papers[:3]
            exclude_ids.update(p.get('id') for p in author_papers[:3])

        # 3. Same venue
        venue = paper.get('venue')
        if venue:
            venue_papers = self.get_papers_by_venue(venue, exclude_ids, limit=3)
            recommendations['same_venue'] = venue_papers
            exclude_ids.update(p.get('id') for p in venue_papers)

        # 4. Same categories
        categories = paper.get('categories', [])
        if categories:
            cat_papers = self.get_papers_by_category(categories[0], exclude_ids, limit=4)
            recommendations['same_categories'] = cat_papers

        return recommendations

    def recommend_based_on_interests(self, categories: List[str] = None,
                                    authors: List[str] = None,
                                    venues: List[str] = None,
                                    n: int = 10) -> List[Dict]:
        """
        Recommend papers based on specified interests.

        Args:
            categories: List of category IDs/names
            authors: List of author names
            venues: List of venue names
            n: Number of recommendations

        Returns:
            List of recommended papers with scores
        """
        recommendations = {}  # paper_id -> score

        # Score papers based on matches
        for paper in self.papers:
            paper_id = paper.get('id')
            score = 0

            # Category match
            if categories:
                paper_cats = paper.get('categories', [])
                for cat in categories:
                    if any(cat.lower() in pc.lower() for pc in paper_cats):
                        score += 3

            # Author match
            if authors:
                paper_authors = paper.get('authors', [])
                for author in authors:
                    if any(author.lower() in pa.lower() for pa in paper_authors):
                        score += 5

            # Venue match
            if venues:
                paper_venue = paper.get('venue', '')
                for venue in venues:
                    if venue.lower() in paper_venue.lower():
                        score += 2

            # Bonus for high citations
            citations = paper.get('citation_count', 0)
            if citations > 100:
                score += 3
            elif citations > 50:
                score += 2
            elif citations > 10:
                score += 1

            # Bonus for recent papers
            year = paper.get('year', 0)
            current_year = datetime.now().year
            if year >= current_year:
                score += 2
            elif year >= current_year - 1:
                score += 1

            if score > 0:
                recommendations[paper_id] = score

        # Sort by score and get top N
        sorted_papers = sorted(
            recommendations.items(),
            key=lambda x: x[1],
            reverse=True
        )[:n]

        # Return full paper objects with scores
        result = []
        for paper_id, score in sorted_papers:
            paper = next((p for p in self.papers if p.get('id') == paper_id), None)
            if paper:
                result.append({
                    'paper': paper,
                    'score': score
                })

        return result

    def track_authors(self, author_names: List[str], min_citations: int = 0) -> Dict:
        """
        Track specific authors and their papers.

        Args:
            author_names: List of author names to track
            min_citations: Minimum citation count

        Returns:
            Dictionary with author statistics
        """
        result = {}

        for author in author_names:
            papers = self.get_papers_by_author(author)

            # Filter by citations if specified
            if min_citations > 0:
                papers = [p for p in papers if p.get('citation_count', 0) >= min_citations]

            # Sort by year (most recent first)
            papers.sort(key=lambda p: p.get('year', 0), reverse=True)

            total_citations = sum(p.get('citation_count', 0) for p in papers)

            result[author] = {
                'paper_count': len(papers),
                'total_citations': total_citations,
                'avg_citations': total_citations / len(papers) if papers else 0,
                'recent_papers': papers[:5],  # Last 5 papers
                'top_cited': sorted(
                    papers,
                    key=lambda p: p.get('citation_count', 0),
                    reverse=True
                )[:3]
            }

        return result

    def track_venues(self, venue_names: List[str]) -> Dict:
        """
        Track specific venues/conferences.

        Args:
            venue_names: List of venue names

        Returns:
            Dictionary with venue statistics
        """
        result = {}

        for venue in venue_names:
            papers = self.get_papers_by_venue(venue)

            # Sort by year
            papers.sort(key=lambda p: p.get('year', 0), reverse=True)

            # Get year distribution
            year_dist = Counter(p.get('year') for p in papers)

            total_citations = sum(p.get('citation_count', 0) for p in papers)

            result[venue] = {
                'paper_count': len(papers),
                'year_distribution': dict(year_dist),
                'total_citations': total_citations,
                'avg_citations': total_citations / len(papers) if papers else 0,
                'recent_papers': papers[:5],
                'top_cited': sorted(
                    papers,
                    key=lambda p: p.get('citation_count', 0),
                    reverse=True
                )[:3]
            }

        return result

    def generate_recommendations_report(self, output_path: Optional[str] = None) -> str:
        """
        Generate a comprehensive recommendations report.

        Args:
            output_path: Optional path to save report

        Returns:
            Report content as string
        """
        lines = []

        # Header
        lines.append("# Paper Recommendations Report")
        lines.append(f"\n**Generated:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        lines.append("\n---\n")

        # Trending Papers
        lines.append("## 🔥 Trending Papers")
        lines.append("\nRecent papers with significant citations:\n")

        trending = self.get_trending_papers(min_citations=10, limit=10)
        for i, paper in enumerate(trending, 1):
            title = paper.get('title', 'Unknown')
            citations = paper.get('citation_count', 0)
            year = paper.get('year', 'N/A')
            lines.append(f"{i}. **{title}** ({year}) - {citations} citations")

        lines.append("\n---\n")

        # Category-based recommendations
        lines.append("## 📚 Recommendations by Category\n")

        # Get top 3 categories from collection
        cat_counts = Counter()
        for paper in self.papers:
            for cat in paper.get('categories', []):
                cat_counts[cat] += 1

        for cat_id, count in cat_counts.most_common(3):
            cat_name = cat_id
            for cat in self.categories:
                if cat['id'] == cat_id:
                    cat_name = cat['name']
                    break

            lines.append(f"### {cat_name}")
            cat_papers = self.get_papers_by_category(cat_id, limit=3)

            for paper in cat_papers:
                title = paper.get('title', 'Unknown')
                year = paper.get('year', 'N/A')
                citations = paper.get('citation_count', 0)
                lines.append(f"- **{title}** ({year}) - {citations} citations")

            lines.append("")

        lines.append("---\n")

        # Author insights
        lines.append("## 👥 Author Insights\n")

        # Get top authors by paper count
        author_counts = Counter()
        for paper in self.papers:
            for author in paper.get('authors', []):
                author_counts[author] += 1

        lines.append("### Most Prolific Authors in Your Collection\n")
        for author, count in author_counts.most_common(10):
            papers = self.get_papers_by_author(author)
            total_cit = sum(p.get('citation_count', 0) for p in papers)
            lines.append(f"- **{author}**: {count} papers, {total_cit} total citations")

        lines.append("\n---\n")

        # Recommendations note
        lines.append("## 💡 How to Use Recommendations\n")
        lines.append("- Use `--recommend-similar <paper-id>` to get papers similar to a specific paper")
        lines.append("- Use `--track-author <name>` to follow an author's work")
        lines.append("- Use `--track-venue <name>` to monitor a conference/journal")
        lines.append("- Use `--interests` with categories/authors/venues for personalized recommendations")

        report = '\n'.join(lines)

        if output_path:
            os.makedirs(os.path.dirname(output_path) or '.', exist_ok=True)
            with open(output_path, 'w', encoding='utf-8') as f:
                f.write(report)
            print(f"Report saved to: {output_path}")

        return report


def print_recommendations(recs: Dict, max_per_section: int = 5):
    """Print recommendations in a readable format."""
    print("\n" + "="*80)
    print("📚 Paper Recommendations")
    print("="*80)

    source = recs.get('source_paper', {})
    print(f"\n📄 Based on: {source.get('title', 'Unknown')}")
    print(f"   Authors: {', '.join(source.get('authors', [])[:3])}")
    print(f"   Venue: {source.get('venue', 'Unknown')} ({source.get('year', 'N/A')})")

    # Similar by content
    similar = recs.get('similar_by_content', [])
    if similar:
        print("\n🔍 Similar Papers (by content):")
        for i, item in enumerate(similar[:max_per_section], 1):
            print(f"\n{i}. {item.get('title', 'Unknown')}")
            print(f"   Similarity: {item.get('similarity', 0):.2%}")
            print(f"   {item.get('venue', 'Unknown')} ({item.get('year', 'N/A')})")

    # Same authors
    same_authors = recs.get('same_authors', [])
    if same_authors:
        print("\n👥 More from Same Authors:")
        for i, paper in enumerate(same_authors[:max_per_section], 1):
            print(f"\n{i}. {paper.get('title', 'Unknown')}")
            print(f"   {', '.join(paper.get('authors', [])[:2])}")
            print(f"   {paper.get('venue', 'Unknown')} ({paper.get('year', 'N/A')})")

    # Same venue
    same_venue = recs.get('same_venue', [])
    if same_venue:
        print("\n🏛️ More from Same Venue:")
        for i, paper in enumerate(same_venue[:max_per_section], 1):
            print(f"\n{i}. {paper.get('title', 'Unknown')}")
            print(f"   {paper.get('year', 'N/A')}")

    # Same categories
    same_cats = recs.get('same_categories', [])
    if same_cats:
        print("\n📂 Related Papers (same category):")
        for i, paper in enumerate(same_cats[:max_per_section], 1):
            print(f"\n{i}. {paper.get('title', 'Unknown')}")
            print(f"   {paper.get('venue', 'Unknown')} ({paper.get('year', 'N/A')})")


def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(
        description='Paper recommendation engine'
    )
    parser.add_argument(
        '--papers-yaml',
        default='data/papers/papers.yaml',
        help='Path to papers.yaml'
    )
    parser.add_argument(
        '--vectordb-path',
        default='data/vectordb',
        help='Path to vector database'
    )

    # Recommendation modes
    parser.add_argument(
        '--recommend-similar',
        metavar='PAPER_ID',
        help='Get recommendations based on a specific paper'
    )
    parser.add_argument(
        '--track-author',
        metavar='AUTHOR',
        help='Track papers by an author'
    )
    parser.add_argument(
        '--track-venue',
        metavar='VENUE',
        help='Track papers from a venue'
    )
    parser.add_argument(
        '--trending',
        action='store_true',
        help='Show trending papers'
    )
    parser.add_argument(
        '--report',
        action='store_true',
        help='Generate full recommendations report'
    )
    parser.add_argument(
        '--output',
        help='Output file for report'
    )

    args = parser.parse_args()

    # Check if papers.yaml exists
    if not os.path.exists(args.papers_yaml):
        print(f"Error: Papers file not found: {args.papers_yaml}", file=sys.stderr)
        return 1

    # Initialize recommender
    recommender = PaperRecommender(
        papers_yaml_path=args.papers_yaml,
        vectordb_path=args.vectordb_path
    )

    # Execute requested operation
    if args.recommend_similar:
        recs = recommender.recommend_based_on_paper(args.recommend_similar)
        if 'error' in recs:
            print(f"Error: {recs['error']}")
            return 1
        print_recommendations(recs)

    elif args.track_author:
        result = recommender.track_authors([args.track_author])
        author_data = result.get(args.track_author, {})

        print(f"\n👥 Author: {args.track_author}")
        print(f"Papers in collection: {author_data.get('paper_count', 0)}")
        print(f"Total citations: {author_data.get('total_citations', 0)}")
        print(f"Average citations: {author_data.get('avg_citations', 0):.1f}")

        print("\nRecent Papers:")
        for paper in author_data.get('recent_papers', [])[:5]:
            print(f"- {paper.get('title')} ({paper.get('year')})")

    elif args.track_venue:
        result = recommender.track_venues([args.track_venue])
        venue_data = result.get(args.track_venue, {})

        print(f"\n🏛️ Venue: {args.track_venue}")
        print(f"Papers in collection: {venue_data.get('paper_count', 0)}")
        print(f"Total citations: {venue_data.get('total_citations', 0)}")
        print(f"Average citations: {venue_data.get('avg_citations', 0):.1f}")

        print("\nRecent Papers:")
        for paper in venue_data.get('recent_papers', [])[:5]:
            print(f"- {paper.get('title')} ({paper.get('year')})")

    elif args.trending:
        trending = recommender.get_trending_papers(limit=10)
        print("\n🔥 Trending Papers (recent + cited):\n")
        for i, paper in enumerate(trending, 1):
            print(f"{i}. {paper.get('title')}")
            print(f"   {paper.get('venue')} ({paper.get('year')}) - {paper.get('citation_count', 0)} citations\n")

    elif args.report:
        report = recommender.generate_recommendations_report(output_path=args.output)
        if not args.output:
            print(report)

    else:
        parser.print_help()
        print("\nExamples:")
        print("  python scripts/paper_recommender.py --recommend-similar gaussian-splatting-2023")
        print("  python scripts/paper_recommender.py --track-author 'John Doe'")
        print("  python scripts/paper_recommender.py --trending")
        print("  python scripts/paper_recommender.py --report --output reports/recommendations.md")

    return 0


if __name__ == '__main__':
    sys.exit(main())
