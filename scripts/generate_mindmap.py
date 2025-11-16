#!/usr/bin/env python3
"""
Generate Mermaid.js mindmaps for research papers.

This script creates interactive mindmaps from paper abstracts and key contributions,
visualizing the paper structure and main ideas using Mermaid.js syntax.
"""

import os
import sys
import yaml
import argparse
import re
from typing import Dict, List, Optional
from pathlib import Path


def sanitize_text(text: str, max_length: int = 100) -> str:
    """
    Sanitize text for Mermaid.js nodes.

    Args:
        text: Input text to sanitize
        max_length: Maximum length for node text

    Returns:
        Sanitized text safe for Mermaid.js
    """
    # Remove special characters that break Mermaid
    text = text.replace('"', "'")
    text = text.replace('(', '[')
    text = text.replace(')', ']')
    text = text.replace('\n', ' ')
    text = text.replace('  ', ' ')

    # Truncate if too long
    if len(text) > max_length:
        text = text[:max_length-3] + "..."

    return text.strip()


def extract_key_concepts(text: str, max_concepts: int = 5) -> List[str]:
    """
    Extract key concepts from text (simplified version).

    Args:
        text: Input text
        max_concepts: Maximum number of concepts to extract

    Returns:
        List of key concept strings
    """
    # Split into sentences
    sentences = re.split(r'[.!?]+', text)

    # Extract main phrases (simplified)
    concepts = []
    for sentence in sentences[:max_concepts]:
        sentence = sentence.strip()
        if len(sentence) > 20:  # Skip very short fragments
            # Take first meaningful part
            parts = sentence.split(',')
            if parts:
                concepts.append(sanitize_text(parts[0], max_length=60))

    return concepts[:max_concepts]


def generate_mindmap_from_paper(paper: Dict) -> str:
    """
    Generate Mermaid.js mindmap syntax from paper data.

    Args:
        paper: Paper dictionary with title, abstract, key_contributions, etc.

    Returns:
        Mermaid.js mindmap code as string
    """
    title = sanitize_text(paper.get('title', 'Paper'), max_length=80)

    # Start mindmap
    lines = [
        "```mermaid",
        "mindmap",
        f"  root(({title}))"
    ]

    # Add main branches

    # 1. Overview/Abstract
    abstract = paper.get('abstract', paper.get('ai_summary', ''))
    if abstract:
        lines.append("    Overview")
        # Extract 2-3 key points from abstract
        concepts = extract_key_concepts(abstract, max_concepts=3)
        for concept in concepts:
            lines.append(f"      {concept}")

    # 2. Key Contributions
    contributions = paper.get('key_contributions', [])
    if contributions:
        lines.append("    Key Contributions")
        for i, contrib in enumerate(contributions[:4], 1):  # Limit to 4
            contrib_text = sanitize_text(contrib, max_length=70)
            lines.append(f"      Contribution {i}")
            lines.append(f"        {contrib_text}")

    # 3. Metadata
    lines.append("    Metadata")

    # Authors
    authors = paper.get('authors', [])
    if authors:
        author_text = sanitize_text(', '.join(authors[:3]), max_length=60)
        if len(authors) > 3:
            author_text += f" +{len(authors)-3} more"
        lines.append(f"      Authors: {author_text}")

    # Venue and Year
    venue = paper.get('venue', 'Unknown')
    year = paper.get('year', 'N/A')
    lines.append(f"      {venue} {year}")

    # Categories
    categories = paper.get('categories', [])
    if categories:
        cat_text = ', '.join(categories[:3])
        lines.append(f"      Categories: {cat_text}")

    # 4. Resources (if available)
    links = paper.get('links', {})
    if any(links.values()):
        lines.append("    Resources")
        if links.get('paper'):
            lines.append("      Paper Link")
        if links.get('code'):
            lines.append("      Code Available")
        if links.get('project'):
            lines.append("      Project Page")
        if links.get('video'):
            lines.append("      Video Demo")

    lines.append("```")

    return '\n'.join(lines)


def generate_mindmap_for_all_papers(papers_yaml_path: str, output_dir: Optional[str] = None) -> int:
    """
    Generate mindmaps for all papers in the YAML database.

    Args:
        papers_yaml_path: Path to papers.yaml file
        output_dir: Optional directory to save individual mindmap files

    Returns:
        Number of mindmaps generated
    """
    # Load papers data
    with open(papers_yaml_path, 'r', encoding='utf-8') as f:
        data = yaml.safe_load(f)

    papers = data.get('papers', [])

    if not papers:
        print("No papers found in database")
        return 0

    # Create output directory if specified
    if output_dir:
        os.makedirs(output_dir, exist_ok=True)

    count = 0
    for paper in papers:
        paper_id = paper.get('id', f'paper_{count}')

        # Generate mindmap
        mindmap = generate_mindmap_from_paper(paper)

        # Save to file if output_dir specified
        if output_dir:
            output_path = os.path.join(output_dir, f'{paper_id}_mindmap.md')
            with open(output_path, 'w', encoding='utf-8') as f:
                f.write(mindmap)
            print(f"Generated mindmap for: {paper.get('title', paper_id)}")

        # Also add to paper data (for Hugo integration)
        paper['mindmap'] = mindmap

        count += 1

    # Save updated data back to YAML (with mindmaps embedded)
    if output_dir is None:  # Only update YAML if not saving to separate files
        with open(papers_yaml_path, 'w', encoding='utf-8') as f:
            yaml.dump(data, f, allow_unicode=True, sort_keys=False)

    return count


def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(
        description='Generate Mermaid.js mindmaps for research papers'
    )
    parser.add_argument(
        '--papers-yaml',
        default='data/papers/papers.yaml',
        help='Path to papers.yaml file (default: data/papers/papers.yaml)'
    )
    parser.add_argument(
        '--output-dir',
        default='static/mindmaps',
        help='Directory to save individual mindmap files (default: static/mindmaps)'
    )
    parser.add_argument(
        '--paper-id',
        help='Generate mindmap for specific paper ID only'
    )

    args = parser.parse_args()

    # Check if papers.yaml exists
    if not os.path.exists(args.papers_yaml):
        print(f"Error: Papers file not found: {args.papers_yaml}", file=sys.stderr)
        return 1

    # Generate mindmaps
    if args.paper_id:
        # Generate for specific paper
        with open(args.papers_yaml, 'r', encoding='utf-8') as f:
            data = yaml.safe_load(f)

        papers = data.get('papers', [])
        paper = next((p for p in papers if p.get('id') == args.paper_id), None)

        if not paper:
            print(f"Error: Paper ID not found: {args.paper_id}", file=sys.stderr)
            return 1

        mindmap = generate_mindmap_from_paper(paper)

        if args.output_dir:
            os.makedirs(args.output_dir, exist_ok=True)
            output_path = os.path.join(args.output_dir, f'{args.paper_id}_mindmap.md')
            with open(output_path, 'w', encoding='utf-8') as f:
                f.write(mindmap)
            print(f"Mindmap saved to: {output_path}")
        else:
            print(mindmap)

        count = 1
    else:
        # Generate for all papers
        count = generate_mindmap_for_all_papers(args.papers_yaml, args.output_dir)

    print(f"\nSuccessfully generated {count} mindmap(s)")
    return 0


if __name__ == '__main__':
    sys.exit(main())
