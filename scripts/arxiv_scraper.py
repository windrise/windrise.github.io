#!/usr/bin/env python3
"""
arXiv Paper Scraper
Fetches papers from arXiv based on categories and keywords
"""

import arxiv
import yaml
import json
import os
from datetime import datetime, timedelta
from typing import List, Dict
import argparse


class ArxivScraper:
    """Scrape papers from arXiv API"""

    def __init__(self, config_path: str = "data/papers/papers.yaml"):
        """Initialize scraper with configuration"""
        self.config_path = config_path
        self.config = self.load_config()

        # Research keywords from your requirements
        self.keywords = [
            "gaussian splatting",
            "3D gaussian",
            "medical image",
            "medical imaging",
            "cardiac motion",
            "cardiac imaging",
            "heart imaging",
            "self-supervised learning",
            "3D reconstruction",
            "volumetric reconstruction",
            "neural radiance field",
            "NeRF"
        ]

        # arXiv categories
        self.categories = [
            "cs.CV",  # Computer Vision
            "cs.LG",  # Machine Learning
            "cs.AI",  # Artificial Intelligence
            "eess.IV"  # Image and Video Processing
        ]

    def load_config(self) -> Dict:
        """Load configuration from YAML file"""
        if os.path.exists(self.config_path):
            with open(self.config_path, 'r', encoding='utf-8') as f:
                return yaml.safe_load(f)
        return {}

    def build_query(self, days_back: int = 1) -> str:
        """Build arXiv query string"""
        # Strategy: Use categories only, filter by keywords in post-processing
        # This avoids overly restrictive queries

        # Build query with categories
        category_queries = [f"cat:{cat}" for cat in self.categories]
        category_str = " OR ".join(category_queries)

        # Use only categories for broader results
        # Keywords will be used for relevance scoring, not hard filtering
        query = f"({category_str})"

        return query

    def fetch_papers(self, max_results: int = 50, days_back: int = 1) -> List[Dict]:
        """Fetch papers from arXiv"""
        print(f"🔍 Fetching papers from last {days_back} day(s)...")

        query = self.build_query(days_back)
        print(f"Query: {query[:100]}...")

        # Create search
        search = arxiv.Search(
            query=query,
            max_results=max_results,
            sort_by=arxiv.SortCriterion.SubmittedDate,
            sort_order=arxiv.SortOrder.Descending
        )

        papers = []
        cutoff_date = datetime.now() - timedelta(days=days_back)

        for result in search.results():
            # Check if paper is within date range
            if result.published.replace(tzinfo=None) < cutoff_date:
                continue

            paper = {
                "id": result.entry_id.split('/')[-1],
                "title": result.title,
                "authors": [author.name for author in result.authors],
                "abstract": result.summary,  # Changed from result.abstract to result.summary
                "published": result.published.strftime("%Y-%m-%d"),
                "updated": result.updated.strftime("%Y-%m-%d"),
                "categories": result.categories,
                "primary_category": result.primary_category,
                "links": {
                    "paper": result.entry_id,
                    "pdf": result.pdf_url,
                },
                "arxiv_id": result.entry_id.split('/')[-1],
                "comment": result.comment if result.comment else "",
                "journal_ref": result.journal_ref if result.journal_ref else "",
            }

            # Check for code availability
            if result.comment and ("github" in result.comment.lower() or "code" in result.comment.lower()):
                paper["has_code"] = True
            else:
                paper["has_code"] = False

            papers.append(paper)

        print(f"✅ Found {len(papers)} papers")
        return papers

    def save_candidates(self, papers: List[Dict], output_file: str = "data/papers/pending/candidates.json"):
        """Save candidate papers to JSON file"""
        os.makedirs(os.path.dirname(output_file), exist_ok=True)

        # Add metadata
        data = {
            "fetched_at": datetime.now().isoformat(),
            "total_papers": len(papers),
            "papers": papers
        }

        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)

        print(f"💾 Saved {len(papers)} candidates to {output_file}")

    def run(self, max_results: int = 50, days_back: int = 1):
        """Main execution"""
        papers = self.fetch_papers(max_results, days_back)
        self.save_candidates(papers)
        return papers


def main():
    parser = argparse.ArgumentParser(description="Scrape papers from arXiv")
    parser.add_argument("--max-results", type=int, default=50, help="Maximum papers to fetch")
    parser.add_argument("--days", type=int, default=1, help="Days to look back")
    parser.add_argument("--test", action="store_true", help="Test mode - just print query")

    args = parser.parse_args()

    scraper = ArxivScraper()

    if args.test:
        query = scraper.build_query(args.days)
        print("Test Query:")
        print(query)
        print("\nKeywords:", scraper.keywords)
        print("Categories:", scraper.categories)
    else:
        papers = scraper.run(args.max_results, args.days)
        print(f"\n🎉 Scraping complete! Found {len(papers)} papers")
        print("📁 Results saved to: data/papers/pending/candidates.json")


if __name__ == "__main__":
    main()
