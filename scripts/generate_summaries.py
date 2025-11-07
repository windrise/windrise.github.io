#!/usr/bin/env python3
"""
AI Summary Generator using Groq API (Free)
Generates multiple types of summaries for research papers
"""

import json
import os
from typing import Dict, List
from groq import Groq
import argparse


class SummaryGenerator:
    """Generate AI summaries using Groq's free API"""

    def __init__(self, api_key: str = None):
        """Initialize with Groq API key"""
        self.api_key = api_key or os.environ.get("GROQ_API_KEY")

        if not self.api_key:
            raise ValueError("GROQ_API_KEY not found. Please set it in environment or pass as argument.")

        self.client = Groq(api_key=self.api_key)
        self.model = "llama-3.1-70b-versatile"  # Free model

    def generate_tldr(self, title: str, abstract: str) -> str:
        """Generate TL;DR (one sentence summary)"""
        prompt = f"""Given this research paper, create a ONE sentence TL;DR summary.

Title: {title}

Abstract: {abstract}

TL;DR (one sentence only):"""

        try:
            response = self.client.chat.completions.create(
                messages=[{"role": "user", "content": prompt}],
                model=self.model,
                temperature=0.3,
                max_tokens=100
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            print(f"❌ Error generating TL;DR: {e}")
            return "Summary generation failed."

    def generate_short_summary(self, title: str, abstract: str) -> str:
        """Generate short summary (3-5 sentences, ~100 words)"""
        prompt = f"""Summarize this research paper in 3-5 sentences (~100 words). Focus on the main contribution, method, and results.

Title: {title}

Abstract: {abstract}

Short Summary (3-5 sentences):"""

        try:
            response = self.client.chat.completions.create(
                messages=[{"role": "user", "content": prompt}],
                model=self.model,
                temperature=0.5,
                max_tokens=200
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            print(f"❌ Error generating short summary: {e}")
            return "Summary generation failed."

    def generate_detailed_summary(self, title: str, abstract: str) -> str:
        """Generate detailed summary (~300 words)"""
        prompt = f"""Provide a detailed summary of this research paper (~300 words). Include:
1. Problem/Motivation
2. Proposed Method
3. Key Contributions
4. Main Results
5. Significance

Title: {title}

Abstract: {abstract}

Detailed Summary:"""

        try:
            response = self.client.chat.completions.create(
                messages=[{"role": "user", "content": prompt}],
                model=self.model,
                temperature=0.5,
                max_tokens=500
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            print(f"❌ Error generating detailed summary: {e}")
            return "Summary generation failed."

    def extract_key_contributions(self, title: str, abstract: str) -> List[str]:
        """Extract key contributions as bullet points"""
        prompt = f"""Extract the key contributions of this research paper as 3-5 bullet points.
Be concise and specific.

Title: {title}

Abstract: {abstract}

Key Contributions (bullet points):"""

        try:
            response = self.client.chat.completions.create(
                messages=[{"role": "user", "content": prompt}],
                model=self.model,
                temperature=0.3,
                max_tokens=300
            )

            text = response.choices[0].message.content.strip()
            # Parse bullet points
            lines = [line.strip() for line in text.split('\n') if line.strip()]
            # Remove bullet markers
            contributions = [line.lstrip('•-*123456789. ') for line in lines if line]
            return contributions[:5]  # Max 5 points

        except Exception as e:
            print(f"❌ Error extracting contributions: {e}")
            return ["Contribution extraction failed."]

    def generate_chinese_summary(self, title: str, abstract: str) -> str:
        """Generate Chinese summary"""
        prompt = f"""将以下研究论文摘要翻译成中文，并用2-3句话概括主要内容：

Title: {title}

Abstract: {abstract}

中文摘要："""

        try:
            response = self.client.chat.completions.create(
                messages=[{"role": "user", "content": prompt}],
                model=self.model,
                temperature=0.5,
                max_tokens=300
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            print(f"❌ Error generating Chinese summary: {e}")
            return "摘要生成失败。"

    def generate_all_summaries(self, paper: Dict) -> Dict:
        """Generate all types of summaries for a paper"""
        title = paper.get("title", "")
        abstract = paper.get("abstract", "")

        print(f"\n📝 Generating summaries for: {title[:60]}...")

        summaries = {
            "tldr": self.generate_tldr(title, abstract),
            "short": self.generate_short_summary(title, abstract),
            "detailed": self.generate_detailed_summary(title, abstract),
            "key_contributions": self.extract_key_contributions(title, abstract),
            "chinese": self.generate_chinese_summary(title, abstract)
        }

        print("   ✅ All summaries generated")
        return summaries

    def process_papers(self, input_file: str, output_file: str):
        """Process all papers and generate summaries"""
        # Load papers
        with open(input_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
            papers = data.get("papers", [])

        print(f"🤖 Processing {len(papers)} papers with Groq AI...")

        # Generate summaries for each paper
        for i, paper in enumerate(papers, 1):
            print(f"\n[{i}/{len(papers)}]", end=" ")

            summaries = self.generate_all_summaries(paper)
            paper["ai_summaries"] = summaries

        # Save results
        os.makedirs(os.path.dirname(output_file), exist_ok=True)
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)

        print(f"\n✅ Summaries saved to {output_file}")


def main():
    parser = argparse.ArgumentParser(description="Generate AI summaries using Groq")
    parser.add_argument("--input", default="data/papers/pending/filtered.json",
                        help="Input JSON file with filtered papers")
    parser.add_argument("--output", default="data/papers/pending/with_summaries.json",
                        help="Output JSON file")
    parser.add_argument("--api-key", help="Groq API key (or set GROQ_API_KEY env var)")

    args = parser.parse_args()

    if not os.path.exists(args.input):
        print(f"❌ Error: {args.input} not found")
        print("   Run smart_filter.py first")
        return

    # Check API key
    api_key = args.api_key or os.environ.get("GROQ_API_KEY")
    if not api_key:
        print("❌ Error: GROQ_API_KEY not set")
        print("\nTo get a free API key:")
        print("1. Visit: https://console.groq.com/")
        print("2. Sign up (free)")
        print("3. Create an API key")
        print("4. Set environment variable:")
        print("   export GROQ_API_KEY='your-key-here'")
        return

    # Generate summaries
    generator = SummaryGenerator(api_key)
    generator.process_papers(args.input, args.output)

    print("\n🎉 Summary generation complete!")


if __name__ == "__main__":
    main()
