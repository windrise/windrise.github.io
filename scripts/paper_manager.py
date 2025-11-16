#!/usr/bin/env python3
"""
Enhanced CLI tool for paper management and batch operations.

Provides utilities for:
- Batch operations (mark, tag, export)
- Database management and cleanup
- Statistics and analysis
- Data validation
"""

import os
import sys
import yaml
import argparse
import json
import csv
from pathlib import Path
from typing import Dict, List, Optional, Set
from datetime import datetime
from collections import Counter


class PaperManager:
    """Manage papers with batch operations and utilities."""

    def __init__(self, papers_yaml_path: str = "data/papers/papers.yaml"):
        """
        Initialize paper manager.

        Args:
            papers_yaml_path: Path to papers.yaml
        """
        self.papers_yaml_path = papers_yaml_path
        self._load_data()

    def _load_data(self):
        """Load papers data from YAML."""
        with open(self.papers_yaml_path, 'r', encoding='utf-8') as f:
            self.data = yaml.safe_load(f)

        self.papers = self.data.get('papers', [])
        self.categories = self.data.get('categories', [])
        self.metadata = self.data.get('metadata', {})

    def _save_data(self):
        """Save papers data to YAML."""
        # Update metadata
        self.data['metadata']['last_updated'] = datetime.now().strftime('%Y-%m-%d')
        self.data['metadata']['total_papers'] = len(self.papers)

        with open(self.papers_yaml_path, 'w', encoding='utf-8') as f:
            yaml.dump(self.data, f, allow_unicode=True, sort_keys=False)

    def batch_mark_starred(self, paper_ids: List[str], starred: bool = True):
        """
        Mark multiple papers as starred/unstarred.

        Args:
            paper_ids: List of paper IDs
            starred: True to star, False to unstar
        """
        updated = 0
        for paper_id in paper_ids:
            paper = self._get_paper_by_id(paper_id)
            if paper:
                paper['starred'] = starred
                updated += 1

        if updated > 0:
            self._save_data()

        print(f"✅ Updated {updated}/{len(paper_ids)} papers")

    def batch_add_category(self, paper_ids: List[str], category: str):
        """
        Add category to multiple papers.

        Args:
            paper_ids: List of paper IDs
            category: Category ID to add
        """
        updated = 0
        for paper_id in paper_ids:
            paper = self._get_paper_by_id(paper_id)
            if paper:
                categories = paper.get('categories', [])
                if category not in categories:
                    categories.append(category)
                    paper['categories'] = categories
                    updated += 1

        if updated > 0:
            self._save_data()

        print(f"✅ Added category to {updated}/{len(paper_ids)} papers")

    def batch_add_notes(self, paper_ids: List[str], note: str):
        """
        Add note to multiple papers.

        Args:
            paper_ids: List of paper IDs
            note: Note to add
        """
        updated = 0
        for paper_id in paper_ids:
            paper = self._get_paper_by_id(paper_id)
            if paper:
                existing_note = paper.get('notes', '')
                if existing_note:
                    paper['notes'] = f"{existing_note}\n{note}"
                else:
                    paper['notes'] = note
                updated += 1

        if updated > 0:
            self._save_data()

        print(f"✅ Added notes to {updated}/{len(paper_ids)} papers")

    def export_papers(self, output_path: str, format: str = 'json',
                     filter_category: Optional[str] = None,
                     filter_starred: Optional[bool] = None):
        """
        Export papers to various formats.

        Args:
            output_path: Output file path
            format: Export format (json, csv, bibtex, markdown)
            filter_category: Only export papers in this category
            filter_starred: Only export starred/unstarred papers
        """
        # Filter papers
        papers_to_export = self.papers

        if filter_category:
            papers_to_export = [
                p for p in papers_to_export
                if filter_category in p.get('categories', [])
            ]

        if filter_starred is not None:
            papers_to_export = [
                p for p in papers_to_export
                if p.get('starred', False) == filter_starred
            ]

        # Export based on format
        if format == 'json':
            self._export_json(papers_to_export, output_path)
        elif format == 'csv':
            self._export_csv(papers_to_export, output_path)
        elif format == 'bibtex':
            self._export_bibtex(papers_to_export, output_path)
        elif format == 'markdown':
            self._export_markdown(papers_to_export, output_path)
        else:
            print(f"Unknown format: {format}")
            return

        print(f"✅ Exported {len(papers_to_export)} papers to {output_path}")

    def _export_json(self, papers: List[Dict], output_path: str):
        """Export to JSON."""
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(papers, f, indent=2, ensure_ascii=False)

    def _export_csv(self, papers: List[Dict], output_path: str):
        """Export to CSV."""
        if not papers:
            return

        # Get all possible fields
        fields = set()
        for paper in papers:
            fields.update(paper.keys())

        fields = sorted(fields)

        with open(output_path, 'w', encoding='utf-8', newline='') as f:
            writer = csv.DictWriter(f, fieldnames=fields)
            writer.writeheader()

            for paper in papers:
                # Convert lists to strings
                row = {}
                for field in fields:
                    value = paper.get(field, '')
                    if isinstance(value, list):
                        row[field] = ', '.join(str(v) for v in value)
                    elif isinstance(value, dict):
                        row[field] = json.dumps(value)
                    else:
                        row[field] = value
                writer.writerow(row)

    def _export_bibtex(self, papers: List[Dict], output_path: str):
        """Export to BibTeX."""
        entries = []

        for paper in papers:
            paper_id = paper.get('id', 'unknown')
            title = paper.get('title', 'Unknown')
            authors = ' and '.join(paper.get('authors', []))
            year = paper.get('year', '')
            venue = paper.get('venue', '')
            arxiv_id = paper.get('arxiv_id', '')

            entry_type = 'article'
            if venue and any(conf in venue.lower() for conf in ['cvpr', 'iccv', 'eccv', 'nips', 'icml']):
                entry_type = 'inproceedings'

            entry = f"""@{entry_type}{{{paper_id},
  title = {{{title}}},
  author = {{{authors}}},
  year = {{{year}}},
  venue = {{{venue}}},"""

            if arxiv_id:
                entry += f"\n  eprint = {{{arxiv_id}}},"

            entry += "\n}\n"
            entries.append(entry)

        with open(output_path, 'w', encoding='utf-8') as f:
            f.write('\n'.join(entries))

    def _export_markdown(self, papers: List[Dict], output_path: str):
        """Export to Markdown."""
        lines = ["# Paper Collection Export", ""]

        for i, paper in enumerate(papers, 1):
            title = paper.get('title', 'Unknown')
            authors = ', '.join(paper.get('authors', []))
            venue = paper.get('venue', 'Unknown')
            year = paper.get('year', 'N/A')

            lines.append(f"## {i}. {title}")
            lines.append(f"\n**Authors:** {authors}")
            lines.append(f"\n**Venue:** {venue} ({year})")

            categories = paper.get('categories', [])
            if categories:
                lines.append(f"\n**Categories:** {', '.join(categories)}")

            abstract = paper.get('abstract', paper.get('ai_summary', ''))
            if abstract:
                lines.append(f"\n**Abstract:** {abstract}")

            links = paper.get('links', {})
            if any(links.values()):
                link_parts = []
                if links.get('paper'):
                    link_parts.append(f"[Paper]({links['paper']})")
                if links.get('code'):
                    link_parts.append(f"[Code]({links['code']})")
                if links.get('project'):
                    link_parts.append(f"[Project]({links['project']})")
                lines.append(f"\n**Links:** {' | '.join(link_parts)}")

            lines.append("\n---\n")

        with open(output_path, 'w', encoding='utf-8') as f:
            f.write('\n'.join(lines))

    def validate_database(self) -> Dict:
        """
        Validate database for issues.

        Returns:
            Dictionary with validation results
        """
        issues = {
            'missing_fields': [],
            'invalid_dates': [],
            'duplicate_ids': [],
            'invalid_categories': [],
            'missing_arxiv_ids': []
        }

        # Check for duplicates
        seen_ids = set()
        for paper in self.papers:
            paper_id = paper.get('id')
            if paper_id in seen_ids:
                issues['duplicate_ids'].append(paper_id)
            seen_ids.add(paper_id)

        # Check required fields
        required_fields = ['id', 'title', 'authors', 'year']
        for paper in self.papers:
            paper_id = paper.get('id', 'unknown')
            for field in required_fields:
                if not paper.get(field):
                    issues['missing_fields'].append(f"{paper_id}: missing '{field}'")

        # Check dates
        for paper in self.papers:
            date_added = paper.get('date_added')
            if date_added:
                try:
                    datetime.fromisoformat(str(date_added))
                except ValueError:
                    issues['invalid_dates'].append(f"{paper.get('id')}: invalid date '{date_added}'")

        # Check categories
        valid_cat_ids = {cat['id'] for cat in self.categories}
        for paper in self.papers:
            for cat in paper.get('categories', []):
                if cat not in valid_cat_ids:
                    issues['invalid_categories'].append(f"{paper.get('id')}: unknown category '{cat}'")

        # Check arXiv IDs
        for paper in self.papers:
            if not paper.get('arxiv_id'):
                issues['missing_arxiv_ids'].append(paper.get('id'))

        return issues

    def get_statistics(self) -> Dict:
        """
        Get comprehensive statistics about the collection.

        Returns:
            Dictionary with statistics
        """
        stats = {}

        # Basic counts
        stats['total_papers'] = len(self.papers)
        stats['starred_papers'] = sum(1 for p in self.papers if p.get('starred', False))

        # Year distribution
        years = [p.get('year') for p in self.papers if p.get('year')]
        stats['year_range'] = f"{min(years)} - {max(years)}" if years else "N/A"
        stats['year_distribution'] = dict(Counter(years))

        # Category distribution
        cat_counts = Counter()
        for paper in self.papers:
            for cat in paper.get('categories', []):
                cat_counts[cat] += 1
        stats['category_distribution'] = dict(cat_counts)

        # Venue distribution
        venue_counts = Counter(p.get('venue') for p in self.papers if p.get('venue'))
        stats['top_venues'] = dict(venue_counts.most_common(10))

        # Citation statistics
        citations = [p.get('citation_count', 0) for p in self.papers]
        if citations:
            stats['total_citations'] = sum(citations)
            stats['avg_citations'] = sum(citations) / len(citations)
            stats['max_citations'] = max(citations)
            stats['papers_with_citations'] = sum(1 for c in citations if c > 0)

        # Author statistics
        all_authors = []
        for paper in self.papers:
            all_authors.extend(paper.get('authors', []))

        stats['total_authors'] = len(set(all_authors))
        author_counts = Counter(all_authors)
        stats['top_authors'] = dict(author_counts.most_common(10))

        # Type distribution
        type_counts = Counter(p.get('type', 'Unknown') for p in self.papers)
        stats['type_distribution'] = dict(type_counts)

        return stats

    def cleanup_database(self, dry_run: bool = True):
        """
        Clean up database (remove duplicates, fix formatting, etc.).

        Args:
            dry_run: If True, only show what would be done
        """
        changes = []

        # Remove duplicate IDs (keep first occurrence)
        seen_ids = set()
        papers_to_keep = []
        for paper in self.papers:
            paper_id = paper.get('id')
            if paper_id not in seen_ids:
                papers_to_keep.append(paper)
                seen_ids.add(paper_id)
            else:
                changes.append(f"Remove duplicate: {paper_id}")

        # Sort papers by date_added
        papers_to_keep.sort(key=lambda p: p.get('date_added', ''), reverse=True)

        if dry_run:
            print("🔍 Dry run - would make these changes:")
            for change in changes:
                print(f"  - {change}")
            print(f"\n  Total changes: {len(changes)}")
        else:
            self.papers = papers_to_keep
            self._save_data()
            print(f"✅ Cleaned up database: {len(changes)} changes")

    def _get_paper_by_id(self, paper_id: str) -> Optional[Dict]:
        """Get paper by ID."""
        return next((p for p in self.papers if p.get('id') == paper_id), None)


def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(
        description='Enhanced paper management CLI tool'
    )
    parser.add_argument(
        '--papers-yaml',
        default='data/papers/papers.yaml',
        help='Path to papers.yaml'
    )

    subparsers = parser.add_subparsers(dest='command', help='Commands')

    # Star papers
    star_parser = subparsers.add_parser('star', help='Star papers')
    star_parser.add_argument('paper_ids', nargs='+', help='Paper IDs to star')

    # Unstar papers
    unstar_parser = subparsers.add_parser('unstar', help='Unstar papers')
    unstar_parser.add_argument('paper_ids', nargs='+', help='Paper IDs to unstar')

    # Add category
    cat_parser = subparsers.add_parser('add-category', help='Add category to papers')
    cat_parser.add_argument('category', help='Category ID')
    cat_parser.add_argument('paper_ids', nargs='+', help='Paper IDs')

    # Add notes
    notes_parser = subparsers.add_parser('add-notes', help='Add notes to papers')
    notes_parser.add_argument('note', help='Note text')
    notes_parser.add_argument('paper_ids', nargs='+', help='Paper IDs')

    # Export
    export_parser = subparsers.add_parser('export', help='Export papers')
    export_parser.add_argument('output', help='Output file path')
    export_parser.add_argument('--format', choices=['json', 'csv', 'bibtex', 'markdown'],
                               default='json', help='Export format')
    export_parser.add_argument('--category', help='Filter by category')
    export_parser.add_argument('--starred', action='store_true', help='Only starred papers')

    # Validate
    subparsers.add_parser('validate', help='Validate database')

    # Statistics
    subparsers.add_parser('stats', help='Show statistics')

    # Cleanup
    cleanup_parser = subparsers.add_parser('cleanup', help='Cleanup database')
    cleanup_parser.add_argument('--dry-run', action='store_true', help='Show what would be done')

    args = parser.parse_args()

    if not args.command:
        parser.print_help()
        return 0

    # Check if papers.yaml exists
    if not os.path.exists(args.papers_yaml):
        print(f"Error: Papers file not found: {args.papers_yaml}", file=sys.stderr)
        return 1

    # Initialize manager
    manager = PaperManager(papers_yaml_path=args.papers_yaml)

    # Execute command
    if args.command == 'star':
        manager.batch_mark_starred(args.paper_ids, starred=True)

    elif args.command == 'unstar':
        manager.batch_mark_starred(args.paper_ids, starred=False)

    elif args.command == 'add-category':
        manager.batch_add_category(args.paper_ids, args.category)

    elif args.command == 'add-notes':
        manager.batch_add_notes(args.paper_ids, args.note)

    elif args.command == 'export':
        filter_starred = True if args.starred else None
        manager.export_papers(
            args.output,
            format=args.format,
            filter_category=args.category,
            filter_starred=filter_starred
        )

    elif args.command == 'validate':
        issues = manager.validate_database()
        print("\n🔍 Database Validation Results:\n")

        total_issues = sum(len(v) for v in issues.values())
        if total_issues == 0:
            print("✅ No issues found!")
        else:
            for issue_type, items in issues.items():
                if items:
                    print(f"\n{issue_type.replace('_', ' ').title()}:")
                    for item in items[:10]:  # Show first 10
                        print(f"  - {item}")
                    if len(items) > 10:
                        print(f"  ... and {len(items) - 10} more")

    elif args.command == 'stats':
        stats = manager.get_statistics()
        print("\n📊 Collection Statistics:\n")
        print(f"Total Papers: {stats['total_papers']}")
        print(f"Starred Papers: {stats['starred_papers']}")
        print(f"Year Range: {stats['year_range']}")
        print(f"Total Citations: {stats.get('total_citations', 0)}")
        print(f"Average Citations: {stats.get('avg_citations', 0):.1f}")
        print(f"\nTop Venues:")
        for venue, count in list(stats['top_venues'].items())[:5]:
            print(f"  - {venue}: {count} papers")

    elif args.command == 'cleanup':
        manager.cleanup_database(dry_run=args.dry_run)

    return 0


if __name__ == '__main__':
    sys.exit(main())
