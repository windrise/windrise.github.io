#!/usr/bin/env python3
"""
Data analysis and visualization tool for paper collection.

Generates comprehensive analysis reports with text-based visualizations
and charts (using ASCII art and Mermaid diagrams for web viewing).
"""

import os
import sys
import yaml
import argparse
from pathlib import Path
from typing import Dict, List, Optional, Tuple
from datetime import datetime
from collections import Counter, defaultdict


class CollectionAnalyzer:
    """Analyze and visualize paper collection data."""

    def __init__(self, papers_yaml_path: str = "data/papers/papers.yaml"):
        """
        Initialize analyzer.

        Args:
            papers_yaml_path: Path to papers.yaml
        """
        self.papers_yaml_path = papers_yaml_path

        with open(papers_yaml_path, 'r', encoding='utf-8') as f:
            self.data = yaml.safe_load(f)

        self.papers = self.data.get('papers', [])
        self.categories = self.data.get('categories', [])

    def _create_bar_chart(self, data: Dict[str, int], title: str,
                         max_width: int = 50, top_n: int = 10) -> str:
        """
        Create ASCII bar chart.

        Args:
            data: Dictionary of labels to counts
            title: Chart title
            max_width: Maximum bar width
            top_n: Show top N items

        Returns:
            ASCII bar chart as string
        """
        if not data:
            return f"{title}\n(No data)"

        # Sort and get top N
        sorted_items = sorted(data.items(), key=lambda x: x[1], reverse=True)[:top_n]

        # Find max value for scaling
        max_value = max(v for _, v in sorted_items) if sorted_items else 1

        # Build chart
        lines = [f"\n{title}\n" + "=" * len(title)]

        for label, value in sorted_items:
            # Calculate bar length
            bar_len = int((value / max_value) * max_width) if max_value > 0 else 0
            bar = "█" * bar_len

            # Format label (truncate if too long)
            label_str = label[:30] + "..." if len(label) > 30 else label
            label_str = label_str.ljust(35)

            lines.append(f"{label_str} {bar} {value}")

        return '\n'.join(lines)

    def _create_timeline(self, year_data: Dict[int, int]) -> str:
        """
        Create timeline visualization.

        Args:
            year_data: Year to paper count mapping

        Returns:
            Timeline as string
        """
        if not year_data:
            return "Timeline\n(No data)"

        years = sorted(year_data.keys())
        if not years:
            return "Timeline\n(No data)"

        min_year = min(years)
        max_year = max(years)

        lines = [f"\nPapers Over Time ({min_year}-{max_year})\n" + "=" * 40]

        # Find max count for scaling
        max_count = max(year_data.values())

        for year in range(min_year, max_year + 1):
            count = year_data.get(year, 0)
            bar_len = int((count / max_count) * 30) if max_count > 0 else 0
            bar = "▓" * bar_len

            lines.append(f"{year}  {bar} {count}")

        return '\n'.join(lines)

    def _generate_mermaid_pie(self, data: Dict[str, int], title: str) -> str:
        """
        Generate Mermaid.js pie chart.

        Args:
            data: Category to count mapping
            title: Chart title

        Returns:
            Mermaid pie chart code
        """
        if not data:
            return f"%%{{init: {{'theme':'base'}}}}%%\npie title {title}\n"

        lines = [
            "```mermaid",
            f"%%{{init: {{'theme':'base'}}}}%%",
            f"pie title {title}"
        ]

        # Sort by value
        sorted_items = sorted(data.items(), key=lambda x: x[1], reverse=True)[:10]

        for label, value in sorted_items:
            # Clean label for Mermaid
            clean_label = label.replace('"', "'").replace(':', ' ')
            lines.append(f'    "{clean_label}" : {value}')

        lines.append("```")

        return '\n'.join(lines)

    def _generate_mermaid_timeline(self, year_data: Dict[int, int]) -> str:
        """
        Generate Mermaid.js timeline/gantt chart.

        Args:
            year_data: Year to count mapping

        Returns:
            Mermaid timeline code
        """
        if not year_data:
            return ""

        years = sorted(year_data.keys())
        if not years:
            return ""

        lines = [
            "```mermaid",
            "graph TD",
            "    subgraph Papers by Year"
        ]

        for i, year in enumerate(years):
            count = year_data[year]
            lines.append(f'        Y{year}["{year}: {count} papers"]')

        lines.append("    end")
        lines.append("```")

        return '\n'.join(lines)

    def analyze_categories(self) -> str:
        """Analyze category distribution."""
        cat_counts = Counter()
        for paper in self.papers:
            for cat in paper.get('categories', []):
                cat_counts[cat] += 1

        # Map to names
        cat_names = {}
        for cat_id, count in cat_counts.items():
            cat_name = cat_id
            for cat in self.categories:
                if cat['id'] == cat_id:
                    cat_name = cat['name']
                    break
            cat_names[cat_name] = count

        # Generate visualizations
        result = []
        result.append(self._create_bar_chart(cat_names, "Category Distribution"))
        result.append("\n\n")
        result.append(self._generate_mermaid_pie(cat_names, "Category Distribution"))

        return '\n'.join(result)

    def analyze_timeline(self) -> str:
        """Analyze papers over time."""
        year_counts = Counter(p.get('year') for p in self.papers if p.get('year'))

        result = []
        result.append(self._create_timeline(dict(year_counts)))
        result.append("\n\n")
        result.append(self._generate_mermaid_timeline(dict(year_counts)))

        return '\n'.join(result)

    def analyze_venues(self) -> str:
        """Analyze venue distribution."""
        venue_counts = Counter(p.get('venue') for p in self.papers if p.get('venue'))

        result = []
        result.append(self._create_bar_chart(dict(venue_counts), "Top Venues", top_n=15))
        result.append("\n\n")
        result.append(self._generate_mermaid_pie(dict(venue_counts), "Venue Distribution (Top 10)"))

        return '\n'.join(result)

    def analyze_citations(self) -> str:
        """Analyze citation statistics."""
        citations = [p.get('citation_count', 0) for p in self.papers]

        if not citations:
            return "No citation data available"

        total = sum(citations)
        avg = total / len(citations)
        max_cit = max(citations)
        min_cit = min(citations)

        # Distribution buckets
        buckets = {
            '0': 0,
            '1-10': 0,
            '11-50': 0,
            '51-100': 0,
            '101-500': 0,
            '500+': 0
        }

        for cit in citations:
            if cit == 0:
                buckets['0'] += 1
            elif cit <= 10:
                buckets['1-10'] += 1
            elif cit <= 50:
                buckets['11-50'] += 1
            elif cit <= 100:
                buckets['51-100'] += 1
            elif cit <= 500:
                buckets['101-500'] += 1
            else:
                buckets['500+'] += 1

        result = []
        result.append(f"\nCitation Statistics\n{'='*40}")
        result.append(f"Total Citations: {total}")
        result.append(f"Average: {avg:.1f}")
        result.append(f"Range: {min_cit} - {max_cit}")
        result.append("")
        result.append(self._create_bar_chart(buckets, "Citation Distribution"))
        result.append("\n\n")
        result.append(self._generate_mermaid_pie(buckets, "Citation Distribution"))

        return '\n'.join(result)

    def analyze_authors(self) -> str:
        """Analyze author statistics."""
        author_counts = Counter()
        author_citations = defaultdict(int)

        for paper in self.papers:
            citations = paper.get('citation_count', 0)
            for author in paper.get('authors', []):
                author_counts[author] += 1
                author_citations[author] += citations

        # Top authors by paper count
        top_by_papers = dict(author_counts.most_common(15))

        # Top authors by citations
        top_by_citations = dict(sorted(
            author_citations.items(),
            key=lambda x: x[1],
            reverse=True
        )[:15])

        result = []
        result.append(self._create_bar_chart(top_by_papers, "Top Authors by Paper Count"))
        result.append("\n\n")
        result.append(self._create_bar_chart(top_by_citations, "Top Authors by Total Citations"))

        return '\n'.join(result)

    def generate_full_report(self, output_path: Optional[str] = None) -> str:
        """
        Generate comprehensive analysis report.

        Args:
            output_path: Optional path to save report

        Returns:
            Report content as string
        """
        lines = []

        # Header
        lines.append("# Paper Collection Analysis Report")
        lines.append(f"\n**Generated:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        lines.append(f"\n**Total Papers:** {len(self.papers)}")
        lines.append("\n---\n")

        # Overview statistics
        lines.append("## 📊 Overview Statistics\n")

        years = [p.get('year') for p in self.papers if p.get('year')]
        if years:
            lines.append(f"- **Year Range:** {min(years)} - {max(years)}")

        citations = [p.get('citation_count', 0) for p in self.papers]
        if citations:
            lines.append(f"- **Total Citations:** {sum(citations)}")
            lines.append(f"- **Average Citations:** {sum(citations)/len(citations):.1f}")

        all_authors = []
        for paper in self.papers:
            all_authors.extend(paper.get('authors', []))
        lines.append(f"- **Unique Authors:** {len(set(all_authors))}")

        venues = {p.get('venue') for p in self.papers if p.get('venue')}
        lines.append(f"- **Unique Venues:** {len(venues)}")

        starred = sum(1 for p in self.papers if p.get('starred', False))
        lines.append(f"- **Starred Papers:** {starred}")

        lines.append("\n---\n")

        # Category analysis
        lines.append("## 📚 Category Analysis\n")
        lines.append(self.analyze_categories())
        lines.append("\n---\n")

        # Timeline analysis
        lines.append("## 📅 Timeline Analysis\n")
        lines.append(self.analyze_timeline())
        lines.append("\n---\n")

        # Venue analysis
        lines.append("## 🏛️ Venue Analysis\n")
        lines.append(self.analyze_venues())
        lines.append("\n---\n")

        # Citation analysis
        lines.append("## 📈 Citation Analysis\n")
        lines.append(self.analyze_citations())
        lines.append("\n---\n")

        # Author analysis
        lines.append("## 👥 Author Analysis\n")
        lines.append(self.analyze_authors())
        lines.append("\n---\n")

        # Top papers
        lines.append("## 🌟 Top Papers\n")
        top_papers = sorted(
            self.papers,
            key=lambda p: p.get('citation_count', 0),
            reverse=True
        )[:10]

        for i, paper in enumerate(top_papers, 1):
            title = paper.get('title', 'Unknown')
            cit = paper.get('citation_count', 0)
            year = paper.get('year', 'N/A')
            lines.append(f"{i}. **{title}** ({year}) - {cit} citations")

        lines.append("\n---\n")

        # Recommendations
        lines.append("## 💡 Insights & Recommendations\n")

        # Identify gaps
        year_counts = Counter(p.get('year') for p in self.papers if p.get('year'))
        if year_counts:
            current_year = datetime.now().year
            recent_count = sum(year_counts[y] for y in range(current_year-2, current_year+1) if y in year_counts)
            if recent_count < 5:
                lines.append(f"- ⚠️  Low number of recent papers ({recent_count} from last 2 years)")

        uncited = sum(1 for p in self.papers if p.get('citation_count', 0) == 0)
        if uncited > len(self.papers) * 0.3:
            lines.append(f"- ⚠️  High number of uncited papers ({uncited}/{len(self.papers)})")

        # Category diversity
        cat_counts = Counter()
        for paper in self.papers:
            for cat in paper.get('categories', []):
                cat_counts[cat] += 1

        if len(cat_counts) < 3:
            lines.append("- ℹ️  Limited category diversity - consider exploring more research areas")

        lines.append("\n---\n")

        # Footer
        lines.append("_This report was automatically generated by the Collection Analyzer tool._")

        report = '\n'.join(lines)

        if output_path:
            os.makedirs(os.path.dirname(output_path) or '.', exist_ok=True)
            with open(output_path, 'w', encoding='utf-8') as f:
                f.write(report)
            print(f"Report saved to: {output_path}")

        return report


def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(
        description='Analyze and visualize paper collection'
    )
    parser.add_argument(
        '--papers-yaml',
        default='data/papers/papers.yaml',
        help='Path to papers.yaml'
    )
    parser.add_argument(
        '--output',
        help='Output file path for report'
    )
    parser.add_argument(
        '--analysis',
        choices=['categories', 'timeline', 'venues', 'citations', 'authors', 'full'],
        default='full',
        help='Type of analysis to perform'
    )

    args = parser.parse_args()

    # Check if papers.yaml exists
    if not os.path.exists(args.papers_yaml):
        print(f"Error: Papers file not found: {args.papers_yaml}", file=sys.stderr)
        return 1

    # Initialize analyzer
    analyzer = CollectionAnalyzer(papers_yaml_path=args.papers_yaml)

    # Perform analysis
    if args.analysis == 'categories':
        result = analyzer.analyze_categories()
    elif args.analysis == 'timeline':
        result = analyzer.analyze_timeline()
    elif args.analysis == 'venues':
        result = analyzer.analyze_venues()
    elif args.analysis == 'citations':
        result = analyzer.analyze_citations()
    elif args.analysis == 'authors':
        result = analyzer.analyze_authors()
    else:  # full
        result = analyzer.generate_full_report(output_path=args.output)

    if not args.output or args.analysis != 'full':
        print(result)

    return 0


if __name__ == '__main__':
    sys.exit(main())
