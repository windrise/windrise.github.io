#!/usr/bin/env python3
"""
Create GitHub Issue for Paper Review
Generates an issue with papers needing review
"""

import json
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
- ✅ Approve: Add label `approved` and comment "approve"
- ❌ Reject: Add label `rejected` and comment "reject"
- ⭐ Important: Add label `starred`

---

"""

    body += """
## How to Review

1. Read the summaries above
2. Check paper links for more details
3. Add labels to indicate your decision:
   - `approved` - Add to collection
   - `rejected` - Skip this paper
   - `starred` - Mark as particularly important
4. Comment "approve" or "reject" to trigger automation

**Note:** Papers with `approved` label will be automatically added to the collection.
"""

    return body


def create_issue(papers: list):
    """Create GitHub issue using gh CLI"""
    if not papers:
        print("No papers to review")
        return

    body = create_issue_body(papers)
    title = f"📚 Paper Review - {datetime.now().strftime('%Y-%m-%d')}"

    # Save body to temp file
    with open("/tmp/issue_body.md", "w", encoding='utf-8') as f:
        f.write(body)

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
            print(f"❌ Error creating issue: {result.stderr}")

    except FileNotFoundError:
        print("❌ Error: 'gh' CLI not found")
        print("   GitHub CLI is required for this feature")
        print("   Install: https://cli.github.com/")


def main():
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
    create_issue(papers)


if __name__ == "__main__":
    main()
