#!/usr/bin/env python3
"""
Generate weekly and monthly summary reports for paper collection.

This script analyzes the paper database and generates comprehensive reports
including statistics, trends, and highlights.
"""

import os
import sys
import yaml
import argparse
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Optional, Tuple
from collections import defaultdict, Counter


class ReportGenerator:
    """Generate summary reports for paper collection."""

    def __init__(self, papers_yaml_path: str = "data/papers/papers.yaml"):
        """
        Initialize report generator.

        Args:
            papers_yaml_path: Path to papers.yaml file
        """
        self.papers_yaml_path = papers_yaml_path
        self.data = self._load_data()
        self.papers = self.data.get('papers', [])
        self.categories = self.data.get('categories', [])

    def _load_data(self) -> Dict:
        """Load papers data from YAML."""
        with open(self.papers_yaml_path, 'r', encoding='utf-8') as f:
            return yaml.safe_load(f)

    def _get_date_range(self, period: str) -> Tuple[datetime, datetime]:
        """
        Get date range for the report period.

        Args:
            period: 'week' or 'month'

        Returns:
            Tuple of (start_date, end_date)
        """
        end_date = datetime.now()

        if period == 'week':
            start_date = end_date - timedelta(days=7)
        elif period == 'month':
            start_date = end_date - timedelta(days=30)
        else:
            raise ValueError(f"Invalid period: {period}")

        return start_date, end_date

    def _filter_papers_by_date(self, start_date: datetime, end_date: datetime,
                                date_field: str = 'date_added') -> List[Dict]:
        """
        Filter papers by date range.

        Args:
            start_date: Start date
            end_date: End date
            date_field: Field to use for date filtering

        Returns:
            List of papers in date range
        """
        filtered = []
        for paper in self.papers:
            date_str = paper.get(date_field)
            if not date_str:
                continue

            try:
                paper_date = datetime.fromisoformat(str(date_str))
                if start_date <= paper_date <= end_date:
                    filtered.append(paper)
            except (ValueError, TypeError):
                continue

        return filtered

    def _get_category_stats(self, papers: List[Dict]) -> Dict:
        """Get statistics by category."""
        category_counts = Counter()
        for paper in papers:
            for cat in paper.get('categories', []):
                category_counts[cat] += 1

        # Map category IDs to names
        category_map = {cat['id']: cat['name'] for cat in self.categories}

        stats = {}
        for cat_id, count in category_counts.most_common():
            cat_name = category_map.get(cat_id, cat_id)
            stats[cat_name] = count

        return stats

    def _get_venue_stats(self, papers: List[Dict]) -> Dict:
        """Get statistics by venue."""
        venue_counts = Counter()
        for paper in papers:
            venue = paper.get('venue', 'Unknown')
            if venue:
                venue_counts[venue] += 1

        return dict(venue_counts.most_common(10))

    def _get_top_papers(self, papers: List[Dict], n: int = 10,
                        by: str = 'citation_count') -> List[Dict]:
        """
        Get top N papers by a metric.

        Args:
            papers: List of papers
            n: Number of top papers
            by: Metric to sort by

        Returns:
            List of top papers
        """
        return sorted(
            papers,
            key=lambda p: p.get(by, 0),
            reverse=True
        )[:n]

    def _get_citation_growth(self) -> List[Dict]:
        """
        Analyze citation growth from history.

        Returns:
            List of papers with significant citation growth
        """
        citation_history = self.data.get('citation_history', [])
        if len(citation_history) < 2:
            return []

        # Get latest and previous entries
        latest = citation_history[-1]
        previous = citation_history[-2] if len(citation_history) > 1 else {}

        latest_papers = latest.get('papers', {})
        previous_papers = previous.get('papers', {})

        growth_papers = []
        for paper_id, latest_data in latest_papers.items():
            latest_count = latest_data.get('citation_count', 0)
            previous_count = previous_papers.get(paper_id, {}).get('citation_count', 0)

            if latest_count > previous_count:
                # Find paper details
                paper = next((p for p in self.papers if p.get('id') == paper_id), None)
                if paper:
                    growth_papers.append({
                        'paper': paper,
                        'growth': latest_count - previous_count,
                        'total': latest_count
                    })

        return sorted(growth_papers, key=lambda x: x['growth'], reverse=True)

    def generate_weekly_report(self, output_path: Optional[str] = None) -> str:
        """
        Generate weekly summary report.

        Args:
            output_path: Optional path to save report

        Returns:
            Report content as string
        """
        start_date, end_date = self._get_date_range('week')
        return self._generate_report(
            period='week',
            start_date=start_date,
            end_date=end_date,
            output_path=output_path
        )

    def generate_monthly_report(self, output_path: Optional[str] = None) -> str:
        """
        Generate monthly summary report.

        Args:
            output_path: Optional path to save report

        Returns:
            Report content as string
        """
        start_date, end_date = self._get_date_range('month')
        return self._generate_report(
            period='month',
            start_date=start_date,
            end_date=end_date,
            output_path=output_path
        )

    def _generate_report(self, period: str, start_date: datetime,
                        end_date: datetime, output_path: Optional[str] = None) -> str:
        """
        Generate summary report.

        Args:
            period: 'week' or 'month'
            start_date: Start date
            end_date: End date
            output_path: Optional path to save report

        Returns:
            Report content as string
        """
        # Get papers added in period
        new_papers = self._filter_papers_by_date(start_date, end_date)

        # Get all papers for overall stats
        all_papers = self.papers

        # Generate report sections
        lines = []

        # Header
        period_name = "Weekly" if period == 'week' else "Monthly"
        lines.append(f"# {period_name} Paper Collection Summary")
        lines.append(f"\n**Report Period:** {start_date.strftime('%Y-%m-%d')} to {end_date.strftime('%Y-%m-%d')}")
        lines.append(f"\n**Generated:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        lines.append("\n---\n")

        # Overview
        lines.append("## 📊 Overview")
        lines.append(f"\n- **Total Papers in Collection:** {len(all_papers)}")
        lines.append(f"- **New Papers This {period.capitalize()}:** {len(new_papers)}")

        total_citations = sum(p.get('citation_count', 0) for p in all_papers)
        lines.append(f"- **Total Citations:** {total_citations}")

        avg_citations = total_citations / len(all_papers) if all_papers else 0
        lines.append(f"- **Average Citations per Paper:** {avg_citations:.1f}")

        lines.append("\n---\n")

        # New Papers
        if new_papers:
            lines.append(f"## 🆕 New Papers Added This {period.capitalize()}")
            lines.append(f"\nAdded {len(new_papers)} new papers:\n")

            for i, paper in enumerate(new_papers, 1):
                title = paper.get('title', 'Unknown')
                authors = paper.get('authors', [])
                author_str = ', '.join(authors[:3])
                if len(authors) > 3:
                    author_str += f" et al. ({len(authors)} authors)"

                venue = paper.get('venue', 'Unknown')
                year = paper.get('year', 'N/A')
                date_added = paper.get('date_added', 'N/A')

                lines.append(f"### {i}. {title}")
                lines.append(f"\n- **Authors:** {author_str}")
                lines.append(f"- **Venue:** {venue} ({year})")
                lines.append(f"- **Added:** {date_added}")

                # Add categories
                categories = paper.get('categories', [])
                if categories:
                    cat_names = []
                    for cat_id in categories:
                        cat = next((c for c in self.categories if c['id'] == cat_id), None)
                        if cat:
                            cat_names.append(cat['name'])
                    if cat_names:
                        lines.append(f"- **Categories:** {', '.join(cat_names)}")

                # Add summary if available
                summary = paper.get('ai_summary', paper.get('abstract', ''))
                if summary:
                    preview = summary[:200] + "..." if len(summary) > 200 else summary
                    lines.append(f"\n{preview}")

                # Add links
                links = paper.get('links', {})
                link_parts = []
                if links.get('paper'):
                    link_parts.append(f"[Paper]({links['paper']})")
                if links.get('code'):
                    link_parts.append(f"[Code]({links['code']})")
                if links.get('project'):
                    link_parts.append(f"[Project]({links['project']})")

                if link_parts:
                    lines.append(f"\n**Links:** {' | '.join(link_parts)}")

                lines.append("\n")

            lines.append("---\n")

        # Category Statistics
        lines.append("## 📚 Category Distribution\n")

        if new_papers:
            new_cat_stats = self._get_category_stats(new_papers)
            lines.append(f"### New Papers by Category (This {period.capitalize()})\n")
            for cat_name, count in new_cat_stats.items():
                lines.append(f"- **{cat_name}:** {count} papers")
            lines.append("\n")

        all_cat_stats = self._get_category_stats(all_papers)
        lines.append("### Overall Collection by Category\n")
        for cat_name, count in all_cat_stats.items():
            percentage = (count / len(all_papers) * 100) if all_papers else 0
            lines.append(f"- **{cat_name}:** {count} papers ({percentage:.1f}%)")

        lines.append("\n---\n")

        # Venue Statistics
        if new_papers:
            venue_stats = self._get_venue_stats(new_papers)
            if venue_stats:
                lines.append(f"## 🏛️ Top Venues (This {period.capitalize()})\n")
                for venue, count in venue_stats.items():
                    lines.append(f"- **{venue}:** {count} papers")
                lines.append("\n---\n")

        # Top Papers by Citations
        lines.append("## 🌟 Top Papers by Citations\n")
        top_papers = self._get_top_papers(all_papers, n=10, by='citation_count')
        for i, paper in enumerate(top_papers, 1):
            title = paper.get('title', 'Unknown')
            citations = paper.get('citation_count', 0)
            year = paper.get('year', 'N/A')
            lines.append(f"{i}. **{title}** ({year}) - {citations} citations")

        lines.append("\n---\n")

        # Citation Growth
        citation_growth = self._get_citation_growth()
        if citation_growth:
            lines.append("## 📈 Citation Growth\n")
            lines.append("Papers with significant citation increases:\n")
            for item in citation_growth[:10]:
                paper = item['paper']
                growth = item['growth']
                total = item['total']
                title = paper.get('title', 'Unknown')
                lines.append(f"- **{title}:** +{growth} citations (now {total} total)")

            lines.append("\n---\n")

        # Research Highlights
        if new_papers:
            starred_papers = [p for p in new_papers if p.get('starred', False)]
            if starred_papers:
                lines.append("## ⭐ Research Highlights\n")
                lines.append("Starred papers from this period:\n")
                for paper in starred_papers:
                    title = paper.get('title', 'Unknown')
                    lines.append(f"- **{title}**")
                    notes = paper.get('notes', '')
                    if notes:
                        lines.append(f"  - {notes}")
                lines.append("\n---\n")

        # Recommendations
        lines.append("## 💡 Recommendations\n")

        if len(new_papers) == 0:
            lines.append("- No new papers were added this period. Consider running the paper collection pipeline.\n")
        elif len(new_papers) < 3:
            lines.append("- Only a few papers were added. Consider expanding your search criteria.\n")

        high_impact = [p for p in new_papers if p.get('citation_count', 0) > 50]
        if high_impact:
            lines.append(f"- {len(high_impact)} high-impact papers (>50 citations) were added. Review these for priority reading.\n")

        uncited = [p for p in new_papers if p.get('citation_count', 0) == 0]
        if uncited:
            lines.append(f"- {len(uncited)} papers have no citations yet. These are very recent - consider revisiting later.\n")

        lines.append("\n---\n")

        # Footer
        lines.append("## 📝 Notes\n")
        lines.append("- This report is automatically generated from your paper collection database")
        lines.append("- Citation counts are updated weekly via Semantic Scholar API")
        lines.append("- To update citation counts manually, run: `python scripts/citation_tracker.py`")

        report = '\n'.join(lines)

        # Save if output path provided
        if output_path:
            os.makedirs(os.path.dirname(output_path) or '.', exist_ok=True)
            with open(output_path, 'w', encoding='utf-8') as f:
                f.write(report)
            print(f"Report saved to: {output_path}")

        return report


def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(
        description='Generate weekly or monthly summary reports'
    )
    parser.add_argument(
        '--papers-yaml',
        default='data/papers/papers.yaml',
        help='Path to papers.yaml file (default: data/papers/papers.yaml)'
    )
    parser.add_argument(
        '--period',
        choices=['week', 'month', 'both'],
        default='week',
        help='Report period (default: week)'
    )
    parser.add_argument(
        '--output-dir',
        default='reports',
        help='Output directory for reports (default: reports)'
    )
    parser.add_argument(
        '--print',
        action='store_true',
        help='Print report to stdout instead of saving'
    )

    args = parser.parse_args()

    # Check if papers.yaml exists
    if not os.path.exists(args.papers_yaml):
        print(f"Error: Papers file not found: {args.papers_yaml}", file=sys.stderr)
        return 1

    # Initialize generator
    generator = ReportGenerator(papers_yaml_path=args.papers_yaml)

    # Generate reports
    if args.period in ['week', 'both']:
        print("\n📊 Generating weekly report...")
        if args.print:
            report = generator.generate_weekly_report()
            print("\n" + report)
        else:
            output_path = os.path.join(
                args.output_dir,
                f"weekly_report_{datetime.now().strftime('%Y-%m-%d')}.md"
            )
            generator.generate_weekly_report(output_path=output_path)

    if args.period in ['month', 'both']:
        print("\n📊 Generating monthly report...")
        if args.print:
            report = generator.generate_monthly_report()
            print("\n" + report)
        else:
            output_path = os.path.join(
                args.output_dir,
                f"monthly_report_{datetime.now().strftime('%Y-%m-%d')}.md"
            )
            generator.generate_monthly_report(output_path=output_path)

    print("\n✨ Report generation complete!")
    return 0


if __name__ == '__main__':
    sys.exit(main())
