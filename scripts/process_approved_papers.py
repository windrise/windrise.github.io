#!/usr/bin/env python3
"""
Process Approved Papers from GitHub Issues
Reads approved papers and adds them to the collection
"""

from review_snapshot import load_snapshot, parse_approval
import argparse
import json
import os
import re
import subprocess
import yaml
from datetime import datetime
from typing import Dict, List, Optional


def load_papers_yaml(filepath: str = "data/papers/papers.yaml") -> dict:
    """Load the papers.yaml file"""
    if not os.path.exists(filepath):
        return {"papers": [], "categories": [], "metadata": {}}

    with open(filepath, 'r', encoding='utf-8') as f:
        return yaml.safe_load(f) or {"papers": [], "categories": [], "metadata": {}}


def save_papers_yaml(data: dict, filepath: str = "data/papers/papers.yaml"):
    """Save the papers.yaml file"""
    with open(filepath, 'w', encoding='utf-8') as f:
        yaml.dump(data, f, allow_unicode=True, sort_keys=False, default_flow_style=False)


def get_issue_content(issue_number: int) -> str:
    """Get issue content using gh CLI"""
    result = subprocess.run(
        ["gh", "issue", "view", str(issue_number), "--json", "body"],
        capture_output=True,
        text=True
    )

    if result.returncode != 0:
        raise Exception(f"Failed to get issue content: {result.stderr}")

    data = json.loads(result.stdout)
    return data.get("body", "")


def categorize_paper(paper: dict, existing_categories: List[dict]) -> List[str]:
    """Auto-categorize paper based on keywords and content"""
    categories = []

    title_lower = paper.get("title", "").lower()
    abstract_lower = paper.get("abstract", "").lower()
    content = title_lower + " " + abstract_lower

    # Category matching rules
    rules = {
        "3d-gaussian": ["gaussian splatting", "3d gaussian", "3dgs"],
        "medical-imaging": ["medical image", "medical imaging", "clinical", "diagnosis"],
        "cardiac-imaging": ["cardiac", "heart", "myocardial"],
        "nerf": ["nerf", "neural radiance", "radiance field"],
        "reconstruction": ["3d reconstruction", "reconstruction", "structure from motion"],
        "self-supervised": ["self-supervised", "unsupervised", "contrastive learning"]
    }

    # Get existing category IDs
    existing_ids = {cat["id"] for cat in existing_categories}

    for cat_id, keywords in rules.items():
        if cat_id in existing_ids:
            if any(keyword in content for keyword in keywords):
                categories.append(cat_id)

    # Default to first category if no match
    if not categories and existing_categories:
        categories.append(existing_categories[0]["id"])

    return categories


def create_paper_id(title: str, year: int) -> str:
    """Generate a unique paper ID"""
    # Convert title to slug
    slug = re.sub(r'[^\w\s-]', '', title.lower())
    slug = re.sub(r'[-\s]+', '-', slug)
    slug = slug[:50]  # Limit length
    return f"{slug}-{year}"


def convert_to_yaml_paper(paper: dict, existing_categories: List[dict]) -> dict:
    """Convert paper from JSON format to YAML format"""
    title = paper.get("title", "Untitled")
    year = paper.get("year", datetime.now().year)

    # Auto-categorize
    categories = categorize_paper(paper, existing_categories)

    # Determine paper type
    paper_type = "Research"
    if "survey" in title.lower():
        paper_type = "Survey"
    elif paper.get("relevance_score", 0) >= 8:
        paper_type = "Foundation"

    yaml_paper = {
        "id": create_paper_id(title, year),
        "title": title,
        "authors": paper.get("authors", [])[:10],  # Limit authors
        "venue": paper.get("venue", "arXiv"),
        "year": year,
        "month": paper.get("month", datetime.now().month),
        "categories": categories,
        "type": paper_type,
        "abstract": paper.get("abstract", "")[:500],  # Limit length
        "links": {
            "paper": paper.get("links", {}).get("paper", ""),
            "code": paper.get("links", {}).get("code", ""),
            "project": "",
            "video": ""
        },
        "arxiv_id": paper.get("arxiv_id", ""),
        "citation_count": 0,
        "starred": paper.get("starred", False),
        "date_added": datetime.now().strftime("%Y-%m-%d"),
        "notes": ""
    }

    # Add AI summary if available
    if "ai_summaries" in paper:
        summaries = paper["ai_summaries"]
        yaml_paper["ai_summary"] = summaries.get("short", summaries.get("tldr", ""))
        yaml_paper["key_contributions"] = summaries.get("key_contributions", [])[:5]

    # Add relevance score
    if "relevance_score" in paper:
        yaml_paper["relevance_score"] = paper["relevance_score"]

    return yaml_paper


def process_approved_papers(issue_number: int, comment_body: str):
    """Main processing function"""
    print(f"📋 Processing issue #{issue_number}...")

    # Load existing papers database
    papers_data = load_papers_yaml()
    existing_papers = papers_data.get("papers", [])
    existing_categories = papers_data.get("categories", [])

    # Get existing arXiv IDs to avoid duplicates
    existing_arxiv_ids = {
        re.sub(r"v[0-9]+$", "", p["arxiv_id"]) for p in existing_papers if p.get("arxiv_id")
    }

    # Get issue content
    issue_body = get_issue_content(issue_number)
    arxiv_ids = [parse_approval(comment_body)]

    print(f"Found {len(arxiv_ids)} papers in issue")

    # Load pending papers with full data
    pending_papers = load_snapshot(issue_body, issue_number)
    pending_by_arxiv = {p.get("arxiv_id"): p for p in pending_papers}

    if arxiv_ids[0] not in pending_by_arxiv:
        raise ValueError("Requested paper is not in this issue snapshot")

    # Process each arXiv ID
    added_count = 0
    for arxiv_id in arxiv_ids:
        if re.sub(r"v[0-9]+$", "", arxiv_id) in existing_arxiv_ids:
            print(f"⏭️  Skipping {arxiv_id} (already exists)")
            continue

        # Get full paper data from pending
        paper_data = pending_by_arxiv.get(arxiv_id)

        if not paper_data:
            print(f"⚠️  Warning: No data found for {arxiv_id}, skipping")
            continue

        # Convert to YAML format
        yaml_paper = convert_to_yaml_paper(paper_data, existing_categories)

        # Add to papers list
        existing_papers.append(yaml_paper)
        added_count += 1
        print(f"✅ Added: {yaml_paper['title']}")

    if added_count > 0:
        # Update metadata
        if "metadata" not in papers_data:
            papers_data["metadata"] = {}

        papers_data["metadata"]["last_updated"] = datetime.now().strftime("%Y-%m-%d")
        papers_data["metadata"]["total_papers"] = len(existing_papers)
        papers_data["papers"] = existing_papers

        # Save updated database
        save_papers_yaml(papers_data)
        print(f"\n✅ Successfully added {added_count} paper(s) to the collection")
    else:
        print("\nℹ️  No new papers to add")


def main():
    parser = argparse.ArgumentParser(description="Process approved papers from GitHub issue")
    parser.add_argument(
        "--issue-number",
        type=int,
        required=True,
        help="GitHub issue number to process"
    )

    args = parser.parse_args()

    try:
        # Read comment data from the event file, never interpolate it into a shell.
        with open(os.environ["GITHUB_EVENT_PATH"], encoding="utf-8") as f:
            event = json.load(f)
        if (event.get("action") != "created" or event.get("issue", {}).get("number") != args.issue_number
                or "pull_request" in event.get("issue", {})):
            raise ValueError("Expected a newly created issue comment")
        process_approved_papers(args.issue_number, event["comment"]["body"])
    except Exception as e:
        print(f"❌ Error: {e}")
        raise


if __name__ == "__main__":
    main()

