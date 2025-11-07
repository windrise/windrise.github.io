#!/usr/bin/env python3
"""
Smart Paper Filter
Multi-dimensional scoring and ranking system for papers
Based on: field match, venue quality, citations, code availability, practicality
"""

import json
import yaml
import os
from typing import List, Dict, Tuple
import re
from collections import defaultdict


class SmartFilter:
    """Intelligent paper filtering and scoring system"""

    def __init__(self):
        """Initialize filter with scoring weights"""
        # Weights based on user requirements: ①领域匹配 ②顶会质量 ③引用潜力 ④代码 ⑤实用性
        self.weights = {
            "field_match": 0.40,      # 40% - Most important
            "venue_quality": 0.25,    # 25%
            "citation_potential": 0.15,  # 15%
            "code_availability": 0.10,   # 10%
            "practicality": 0.10      # 10%
        }

        # Top venues (conferences and journals)
        self.top_venues = {
            # Computer Vision
            "CVPR": 10, "ICCV": 10, "ECCV": 10,
            "NeurIPS": 10, "ICML": 10, "ICLR": 10,
            # Medical Imaging
            "MICCAI": 10, "IPMI": 9, "ISBI": 8, "TMI": 10,
            # Graphics
            "SIGGRAPH": 10, "TOG": 10,
            # General
            "Nature": 10, "Science": 10, "PAMI": 10,
        }

        # Research field keywords with importance
        self.field_keywords = {
            # High priority (your core research)
            "3d gaussian": 10,
            "gaussian splatting": 10,
            "medical image": 9,
            "medical imaging": 9,
            "cardiac": 9,
            "heart": 8,
            "self-supervised": 8,

            # Medium priority
            "3d reconstruction": 7,
            "volumetric": 7,
            "neural radiance": 7,
            "nerf": 7,
            "segmentation": 6,
            "registration": 6,

            # Lower priority but relevant
            "deep learning": 5,
            "computer vision": 5,
            "image analysis": 5,
        }

        # Practicality indicators
        self.practicality_keywords = [
            "open source", "code available", "implementation",
            "practical", "real-world", "clinical", "application",
            "dataset", "benchmark"
        ]

    def calculate_field_match_score(self, paper: Dict) -> float:
        """Calculate how well paper matches research fields (0-10)"""
        title = paper.get("title", "").lower()
        abstract = paper.get("abstract", "").lower()
        text = title + " " + abstract

        score = 0.0
        matches = []

        for keyword, importance in self.field_keywords.items():
            if keyword.lower() in text:
                score += importance
                matches.append(keyword)

        # Normalize to 0-10 range
        max_possible = sum(self.field_keywords.values())
        normalized_score = min((score / max_possible) * 10, 10)

        return normalized_score, matches

    def calculate_venue_quality_score(self, paper: Dict) -> float:
        """Calculate venue quality score (0-10)"""
        # Extract venue from journal_ref or categories
        journal_ref = paper.get("journal_ref", "").upper()
        comment = paper.get("comment", "").upper()

        score = 0.0
        matched_venue = None

        # Check if any top venue is mentioned
        for venue, venue_score in self.top_venues.items():
            if venue in journal_ref or venue in comment:
                score = venue_score
                matched_venue = venue
                break

        # If no top venue found, give base score for arXiv papers
        if score == 0:
            score = 5.0  # Baseline for arXiv papers

        return score, matched_venue

    def calculate_citation_potential(self, paper: Dict) -> float:
        """Estimate citation potential based on various factors (0-10)"""
        score = 5.0  # Start with baseline

        title = paper.get("title", "").lower()
        abstract = paper.get("abstract", "").lower()
        authors = paper.get("authors", [])

        # Novel terms often get cited
        novelty_terms = ["novel", "new", "first", "state-of-the-art", "sota", "breakthrough"]
        for term in novelty_terms:
            if term in title or term in abstract:
                score += 1.0

        # Survey/review papers tend to get more citations
        if "survey" in title or "review" in title:
            score += 2.0

        # More authors might indicate collaboration (controversial, but sometimes true)
        if len(authors) >= 5:
            score += 1.0

        # Comprehensive evaluation
        if "benchmark" in abstract or "evaluation" in abstract:
            score += 1.0

        return min(score, 10.0)

    def calculate_code_availability_score(self, paper: Dict) -> float:
        """Score based on code availability (0-10)"""
        has_code = paper.get("has_code", False)
        comment = paper.get("comment", "").lower()

        if has_code:
            return 10.0
        elif "github" in comment or "code" in comment:
            return 8.0
        else:
            return 3.0  # Base score for papers without code mention

    def calculate_practicality_score(self, paper: Dict) -> float:
        """Score based on practical applicability (0-10)"""
        abstract = paper.get("abstract", "").lower()
        comment = paper.get("comment", "").lower()
        text = abstract + " " + comment

        score = 5.0  # Baseline

        # Count practicality indicators
        for keyword in self.practicality_keywords:
            if keyword in text:
                score += 0.5

        return min(score, 10.0)

    def calculate_total_score(self, paper: Dict) -> Tuple[float, Dict]:
        """Calculate total score for a paper"""
        # Calculate individual scores
        field_score, field_matches = self.calculate_field_match_score(paper)
        venue_score, matched_venue = self.calculate_venue_quality_score(paper)
        citation_score = self.calculate_citation_potential(paper)
        code_score = self.calculate_code_availability_score(paper)
        practicality_score = self.calculate_practicality_score(paper)

        # Weighted sum
        total_score = (
            field_score * self.weights["field_match"] +
            venue_score * self.weights["venue_quality"] +
            citation_score * self.weights["citation_potential"] +
            code_score * self.weights["code_availability"] +
            practicality_score * self.weights["practicality"]
        )

        # Create detailed breakdown
        breakdown = {
            "total_score": round(total_score, 2),
            "field_match": {
                "score": round(field_score, 2),
                "matches": field_matches,
                "weight": self.weights["field_match"]
            },
            "venue_quality": {
                "score": round(venue_score, 2),
                "venue": matched_venue,
                "weight": self.weights["venue_quality"]
            },
            "citation_potential": {
                "score": round(citation_score, 2),
                "weight": self.weights["citation_potential"]
            },
            "code_availability": {
                "score": round(code_score, 2),
                "has_code": paper.get("has_code", False),
                "weight": self.weights["code_availability"]
            },
            "practicality": {
                "score": round(practicality_score, 2),
                "weight": self.weights["practicality"]
            }
        }

        return total_score, breakdown

    def filter_and_rank(self, papers: List[Dict], top_n: int = 10) -> List[Dict]:
        """Filter and rank papers by relevance"""
        print(f"\n🎯 Filtering and ranking {len(papers)} papers...")

        scored_papers = []

        for paper in papers:
            score, breakdown = self.calculate_total_score(paper)
            paper["relevance_score"] = score
            paper["score_breakdown"] = breakdown
            scored_papers.append(paper)

        # Sort by score (descending)
        scored_papers.sort(key=lambda x: x["relevance_score"], reverse=True)

        # Get top N
        top_papers = scored_papers[:top_n]

        print(f"✅ Selected top {len(top_papers)} papers")
        print(f"   Score range: {top_papers[0]['relevance_score']:.2f} - {top_papers[-1]['relevance_score']:.2f}")

        return top_papers

    def save_filtered_papers(self, papers: List[Dict], output_file: str = "data/papers/pending/filtered.json"):
        """Save filtered papers"""
        os.makedirs(os.path.dirname(output_file), exist_ok=True)

        data = {
            "filtered_at": json.dumps({"timestamp": "now"}),
            "total_papers": len(papers),
            "papers": papers
        }

        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)

        print(f"💾 Saved filtered papers to {output_file}")


def main():
    """Test the filter"""
    import argparse

    parser = argparse.ArgumentParser(description="Filter and rank papers")
    parser.add_argument("--input", default="data/papers/pending/candidates.json", help="Input JSON file")
    parser.add_argument("--output", default="data/papers/pending/filtered.json", help="Output JSON file")
    parser.add_argument("--top-n", type=int, default=10, help="Number of top papers to select")

    args = parser.parse_args()

    # Load candidates
    if not os.path.exists(args.input):
        print(f"❌ Error: {args.input} not found")
        print("   Run arxiv_scraper.py first")
        return

    with open(args.input, 'r', encoding='utf-8') as f:
        data = json.load(f)
        papers = data.get("papers", [])

    # Filter and rank
    filter_system = SmartFilter()
    top_papers = filter_system.filter_and_rank(papers, args.top_n)

    # Save results
    filter_system.save_filtered_papers(top_papers, args.output)

    # Print summary
    print("\n📊 Top Papers:")
    for i, paper in enumerate(top_papers[:5], 1):
        print(f"{i}. [{paper['relevance_score']:.1f}] {paper['title'][:60]}...")
        if paper['score_breakdown']['field_match']['matches']:
            print(f"   Matches: {', '.join(paper['score_breakdown']['field_match']['matches'][:3])}")


if __name__ == "__main__":
    main()
