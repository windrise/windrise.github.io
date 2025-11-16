#!/usr/bin/env python3
"""
Citation Tracker using Semantic Scholar API.

This script tracks citation counts for papers in the database using the free
Semantic Scholar API. It updates papers.yaml with current citation counts and
maintains historical data for trend analysis.
"""

import os
import sys
import yaml
import argparse
import time
import requests
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple
from pathlib import Path


# Semantic Scholar API configuration
SEMANTIC_SCHOLAR_API = "https://api.semanticscholar.org/graph/v1"
REQUEST_DELAY = 1.0  # Seconds between requests (rate limiting)


class CitationTracker:
    """Track citations for research papers."""

    def __init__(self, api_delay: float = REQUEST_DELAY):
        """
        Initialize citation tracker.

        Args:
            api_delay: Delay between API requests in seconds
        """
        self.api_delay = api_delay
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Academic-Paper-Tracker/1.0'
        })

    def get_paper_info(self, arxiv_id: str) -> Optional[Dict]:
        """
        Get paper information from Semantic Scholar.

        Args:
            arxiv_id: arXiv ID (e.g., "2308.04079" or "2308.04079v1")

        Returns:
            Dictionary with paper info including citation count, or None if not found
        """
        # Clean arxiv_id (remove version suffix if present)
        clean_arxiv_id = arxiv_id.split('v')[0] if 'v' in arxiv_id else arxiv_id

        # Try both with and without version
        arxiv_ids = [arxiv_id, clean_arxiv_id] if 'v' in arxiv_id else [arxiv_id]

        for aid in arxiv_ids:
            try:
                # Query Semantic Scholar API
                url = f"{SEMANTIC_SCHOLAR_API}/paper/arXiv:{aid}"
                params = {
                    'fields': 'title,authors,year,citationCount,influentialCitationCount,venue,publicationDate'
                }

                response = self.session.get(url, params=params, timeout=10)

                if response.status_code == 200:
                    data = response.json()
                    return {
                        'arxiv_id': aid,
                        'title': data.get('title', ''),
                        'citation_count': data.get('citationCount', 0),
                        'influential_citation_count': data.get('influentialCitationCount', 0),
                        'year': data.get('year'),
                        'venue': data.get('venue', ''),
                        'publication_date': data.get('publicationDate', ''),
                        'last_checked': datetime.now().isoformat()
                    }
                elif response.status_code == 404:
                    # Try next variant
                    continue
                else:
                    print(f"Warning: API returned status {response.status_code} for {aid}")
                    return None

            except requests.RequestException as e:
                print(f"Error fetching data for {aid}: {e}")
                continue

            finally:
                # Rate limiting
                time.sleep(self.api_delay)

        return None

    def update_citation_counts(self, papers_yaml_path: str, force_update: bool = False) -> Dict:
        """
        Update citation counts for all papers in the database.

        Args:
            papers_yaml_path: Path to papers.yaml file
            force_update: Force update even if recently checked

        Returns:
            Dictionary with update statistics
        """
        # Load papers data
        with open(papers_yaml_path, 'r', encoding='utf-8') as f:
            data = yaml.safe_load(f)

        papers = data.get('papers', [])

        stats = {
            'total': len(papers),
            'updated': 0,
            'skipped': 0,
            'failed': 0,
            'errors': []
        }

        # Initialize citation_history if not present
        if 'citation_history' not in data:
            data['citation_history'] = []

        citation_history_entry = {
            'date': datetime.now().strftime('%Y-%m-%d'),
            'papers': {}
        }

        for i, paper in enumerate(papers, 1):
            paper_id = paper.get('id', f'unknown_{i}')
            arxiv_id = paper.get('arxiv_id')

            print(f"\n[{i}/{stats['total']}] Processing: {paper.get('title', paper_id)[:60]}...")

            # Skip if no arXiv ID
            if not arxiv_id:
                print(f"  ⚠️  No arXiv ID found, skipping")
                stats['skipped'] += 1
                continue

            # Check if recently updated (within 7 days)
            if not force_update and 'citation_last_checked' in paper:
                try:
                    last_checked = datetime.fromisoformat(paper['citation_last_checked'])
                    if datetime.now() - last_checked < timedelta(days=7):
                        print(f"  ⏭️  Recently checked ({last_checked.strftime('%Y-%m-%d')}), skipping")
                        stats['skipped'] += 1
                        continue
                except (ValueError, TypeError):
                    pass  # Invalid date format, proceed with update

            # Fetch citation info
            info = self.get_paper_info(arxiv_id)

            if info:
                old_count = paper.get('citation_count', 0)
                new_count = info['citation_count']

                # Update paper data
                paper['citation_count'] = new_count
                paper['influential_citation_count'] = info.get('influential_citation_count', 0)
                paper['citation_last_checked'] = info['last_checked']

                # Record in history
                citation_history_entry['papers'][paper_id] = {
                    'citation_count': new_count,
                    'influential_count': info.get('influential_citation_count', 0)
                }

                # Show update
                if new_count > old_count:
                    print(f"  ✅ Updated: {old_count} → {new_count} citations (+{new_count - old_count})")
                elif new_count < old_count:
                    print(f"  ⚠️  Decreased: {old_count} → {new_count} citations")
                else:
                    print(f"  ✅ No change: {new_count} citations")

                stats['updated'] += 1
            else:
                print(f"  ❌ Failed to fetch citation data")
                stats['failed'] += 1
                stats['errors'].append({
                    'paper_id': paper_id,
                    'arxiv_id': arxiv_id,
                    'title': paper.get('title', '')
                })

        # Add history entry if we updated any papers
        if citation_history_entry['papers']:
            data['citation_history'].append(citation_history_entry)

            # Keep only last 365 days of history
            cutoff_date = (datetime.now() - timedelta(days=365)).strftime('%Y-%m-%d')
            data['citation_history'] = [
                entry for entry in data['citation_history']
                if entry.get('date', '') >= cutoff_date
            ]

        # Update metadata
        if 'metadata' in data:
            data['metadata']['last_citation_update'] = datetime.now().strftime('%Y-%m-%d')

        # Save updated data
        with open(papers_yaml_path, 'w', encoding='utf-8') as f:
            yaml.dump(data, f, allow_unicode=True, sort_keys=False)

        return stats

    def generate_citation_report(self, papers_yaml_path: str, output_file: Optional[str] = None) -> str:
        """
        Generate a citation report.

        Args:
            papers_yaml_path: Path to papers.yaml file
            output_file: Optional path to save report

        Returns:
            Report as string
        """
        # Load papers data
        with open(papers_yaml_path, 'r', encoding='utf-8') as f:
            data = yaml.safe_load(f)

        papers = data.get('papers', [])

        # Sort by citation count
        papers_sorted = sorted(
            papers,
            key=lambda p: p.get('citation_count', 0),
            reverse=True
        )

        # Generate report
        lines = [
            "# Citation Report",
            f"\nGenerated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}",
            f"\nTotal Papers: {len(papers)}",
            "\n## Top Papers by Citations\n"
        ]

        for i, paper in enumerate(papers_sorted[:20], 1):  # Top 20
            citations = paper.get('citation_count', 0)
            influential = paper.get('influential_citation_count', 0)
            title = paper.get('title', 'Unknown')
            year = paper.get('year', 'N/A')

            lines.append(f"{i}. **{title}** ({year})")
            lines.append(f"   - Citations: {citations} (Influential: {influential})")
            lines.append("")

        # High impact papers (>100 citations)
        high_impact = [p for p in papers if p.get('citation_count', 0) > 100]
        if high_impact:
            lines.append("\n## High Impact Papers (>100 citations)\n")
            for paper in sorted(high_impact, key=lambda p: p.get('citation_count', 0), reverse=True):
                lines.append(f"- {paper.get('title', 'Unknown')}: {paper.get('citation_count', 0)} citations")

        # Recent rising stars (papers from last 2 years with >10 citations)
        current_year = datetime.now().year
        rising_stars = [
            p for p in papers
            if p.get('year', 0) >= current_year - 2 and p.get('citation_count', 0) > 10
        ]
        if rising_stars:
            lines.append("\n## Rising Stars (Recent Papers with >10 Citations)\n")
            for paper in sorted(rising_stars, key=lambda p: p.get('citation_count', 0), reverse=True):
                lines.append(
                    f"- {paper.get('title', 'Unknown')} ({paper.get('year', 'N/A')}): "
                    f"{paper.get('citation_count', 0)} citations"
                )

        # Statistics
        total_citations = sum(p.get('citation_count', 0) for p in papers)
        avg_citations = total_citations / len(papers) if papers else 0

        lines.append("\n## Statistics\n")
        lines.append(f"- Total Citations: {total_citations}")
        lines.append(f"- Average Citations per Paper: {avg_citations:.1f}")
        lines.append(f"- Papers with >0 Citations: {sum(1 for p in papers if p.get('citation_count', 0) > 0)}")

        report = '\n'.join(lines)

        # Save if output file specified
        if output_file:
            with open(output_file, 'w', encoding='utf-8') as f:
                f.write(report)
            print(f"\nReport saved to: {output_file}")

        return report


def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(
        description='Track citation counts for research papers using Semantic Scholar API'
    )
    parser.add_argument(
        '--papers-yaml',
        default='data/papers/papers.yaml',
        help='Path to papers.yaml file (default: data/papers/papers.yaml)'
    )
    parser.add_argument(
        '--report',
        action='store_true',
        help='Generate citation report'
    )
    parser.add_argument(
        '--output',
        help='Output file for report (optional)'
    )
    parser.add_argument(
        '--force',
        action='store_true',
        help='Force update even if recently checked'
    )
    parser.add_argument(
        '--delay',
        type=float,
        default=REQUEST_DELAY,
        help=f'Delay between API requests in seconds (default: {REQUEST_DELAY})'
    )

    args = parser.parse_args()

    # Check if papers.yaml exists
    if not os.path.exists(args.papers_yaml):
        print(f"Error: Papers file not found: {args.papers_yaml}", file=sys.stderr)
        return 1

    tracker = CitationTracker(api_delay=args.delay)

    if args.report:
        # Generate report only
        print("\nGenerating citation report...")
        report = tracker.generate_citation_report(args.papers_yaml, args.output)
        if not args.output:
            print("\n" + report)
    else:
        # Update citation counts
        print("\n🔍 Starting citation tracking...\n")
        stats = tracker.update_citation_counts(args.papers_yaml, force_update=args.force)

        # Print summary
        print("\n" + "="*60)
        print("📊 Update Summary")
        print("="*60)
        print(f"Total papers: {stats['total']}")
        print(f"✅ Updated: {stats['updated']}")
        print(f"⏭️  Skipped: {stats['skipped']}")
        print(f"❌ Failed: {stats['failed']}")

        if stats['errors']:
            print("\n⚠️  Errors:")
            for error in stats['errors']:
                print(f"  - {error['title'][:60]} (arXiv: {error['arxiv_id']})")

        print("\n✨ Citation tracking complete!")

    return 0


if __name__ == '__main__':
    sys.exit(main())
