#!/usr/bin/env python3
"""
Create GitHub Issue for Paper Review
Generates an issue with papers needing review
"""

import argparse
import json
from review_snapshot import save_snapshot, encode
import os
import subprocess
from datetime import datetime


def create_issue_body(papers: list) -> str:
    """Create markdown body for GitHub issue"""
    body = f"""# 📚 Daily Paper Review - {datetime.now().strftime('%Y-%m-%d')}

Found **{len(papers)}** relevant papers today. Please review and approve/reject.

---

"""

    for i, paper in enumerate(papers, 1):
        title = paper.get("title", "Untitled")
        authors = paper.get("authors", [])
        arxiv_id = paper.get("arxiv_id", "")
        score = paper.get("relevance_score", 0)
        summaries = paper.get("ai_summaries", {})

        # Get paper links
        paper_url = paper.get("links", {}).get("paper", "")
        pdf_url = paper.get("links", {}).get("pdf", "")

        # Get score breakdown
        breakdown = paper.get("score_breakdown", {})
        field_match = breakdown.get("field_match", {})
        venue_info = breakdown.get("venue_quality", {})

        body += f"""## {i}. {title}

**Score:** `{score:.1f}/10` | **arXiv:** [{arxiv_id}]({paper_url})

**Authors:** {', '.join(authors[:3])}{"..." if len(authors) > 3 else ""}

**Relevance:**
- 🎯 Field Match: {field_match.get('score', 0)}/10 - Matches: {', '.join(field_match.get('matches', [])[:3])}
- 🏆 Venue: {venue_info.get('venue', 'arXiv')} ({venue_info.get('score', 0)}/10)
- 💻 Code: {"✅ Available" if paper.get('has_code') else "❌ Not mentioned"}

**AI Summary:**
{summaries.get('short', summaries.get('tldr', 'No summary available'))}

**Key Contributions:**
"""
        for contrib in summaries.get('key_contributions', [])[:3]:
            body += f"- {contrib}\n"

        body += f"""
**Links:** [📄 Paper]({paper_url}) | [📥 PDF]({pdf_url})

**Actions:**
- ✅ Approve only this paper: comment `/approve {arxiv_id}`
- Skip: leave this paper unapproved. Issue labels do not approve papers.

---

"""

    body += """
## How to Review

1. Read the summaries and check the paper links.
2. A repository writer comments `/approve <arxiv-id>` using the exact ID above.
3. Use one command and one paper per new comment. Bare `approve`, batch commands,
   edited comments, and issue labels do not trigger approval.
4. Leave unwanted papers unapproved. Approval adds to the collection; it is not undone
   by editing/deleting the comment. Keep this issue open for remaining papers.

Each review uses its fixed snapshot, never the latest shared pending files.

"""

    return body


def ensure_labels_exist():
    """Create required labels if they don't exist"""
    labels = [
        ("paper-review", "0366d6", "Papers pending review"),
        ("automated", "bfdadc", "Automated task"),
        ("approved", "0e8a16", "Approved for addition"),
        ("rejected", "d93f0b", "Rejected"),
        ("starred", "fbca04", "Important/starred paper")
    ]

    for name, color, description in labels:
        # Try to create label, ignore if it already exists
        subprocess.run(
            ["gh", "label", "create", name,
             "--color", color,
             "--description", description,
             "--force"],
            capture_output=True,
            text=True
        )


def create_issue(papers: list, prepare_only: bool = False):
    """Create GitHub issue using gh CLI"""
    if not papers:
        print("⚠️  No papers to review - skipping issue creation")
        print("   This might be normal if no relevant papers were found today.")
        return

    digest = save_snapshot(papers)
    if prepare_only:
        return
    committed = subprocess.run(
        ["git", "show", f"HEAD:data/papers/review-snapshots/{digest}.json"],
        capture_output=True, check=True
    ).stdout
    if committed != encode(papers):
        raise ValueError("Publish only after the exact snapshot has been committed and pushed")
    body = create_issue_body(papers) + f"\n<!-- paper-review-snapshot: {digest} -->\n"
    title = f"📚 Paper Review - {datetime.now().strftime('%Y-%m-%d')}"

    # Save body to temp file
    with open("/tmp/issue_body.md", "w", encoding='utf-8') as f:
        f.write(body)

    # Ensure labels exist
    try:
        print("🏷️  Ensuring labels exist...")
        ensure_labels_exist()
    except Exception as e:
        print(f"⚠️  Warning: Could not create labels: {e}")
        print("   Proceeding without labels...")

    # Create issue using gh CLI
    try:
        result = subprocess.run(
            ["gh", "issue", "create",
             "--title", title,
             "--body-file", "/tmp/issue_body.md",
             "--label", "paper-review,automated"],
            capture_output=True,
            text=True
        )

        if result.returncode == 0:
            print(f"✅ Issue created successfully!")
            print(result.stdout)
        else:
            raise RuntimeError(f"Error creating issue: {result.stderr}")

    except FileNotFoundError:
        print("❌ Error: 'gh' CLI not found")
        print("   GitHub CLI is required for this feature")
        print("   Install: https://cli.github.com/")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--prepare-only", action="store_true")
    args = parser.parse_args()
    input_file = "data/papers/pending/with_audio.json"

    if not os.path.exists(input_file):
        # Try with summaries file
        input_file = "data/papers/pending/with_summaries.json"

    if not os.path.exists(input_file):
        print(f"❌ No processed papers found")
        return

    # Load papers
    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
        papers = data.get("papers", [])

    print(f"📋 Creating review issue for {len(papers)} papers...")
    create_issue(papers, prepare_only=args.prepare_only)


if __name__ == "__main__":
    main()

