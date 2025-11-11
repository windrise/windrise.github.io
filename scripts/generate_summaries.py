#!/usr/bin/env python3
"""
AI Summary Generator using Groq API (Free)
Generates multiple types of summaries for research papers
"""

import json
import os
import time
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
        # Updated to latest available model (llama-3.1-70b was decommissioned)
        self.model = "llama-3.3-70b-versatile"  # Latest free model
        self.max_retries = 3
        self.retry_delay = 2  # seconds

    def _call_api_with_retry(self, prompt: str, max_tokens: int, temperature: float = 0.5) -> str:
        """Call Groq API with retry mechanism"""
        last_error = None

        for attempt in range(self.max_retries):
            try:
                response = self.client.chat.completions.create(
                    messages=[{"role": "user", "content": prompt}],
                    model=self.model,
                    temperature=temperature,
                    max_tokens=max_tokens
                )
                return response.choices[0].message.content.strip()

            except Exception as e:
                last_error = e
                error_msg = str(e)

                # Check if it's a rate limit error
                if "rate_limit" in error_msg.lower():
                    wait_time = self.retry_delay * (attempt + 1)
                    print(f"   ⏳ Rate limit hit, waiting {wait_time}s...")
                    time.sleep(wait_time)
                    continue

                # For other errors, wait briefly and retry
                if attempt < self.max_retries - 1:
                    print(f"   ⚠️  Attempt {attempt + 1} failed: {error_msg[:100]}")
                    time.sleep(self.retry_delay)
                    continue

        # All retries failed
        error_detail = str(last_error)[:200]
        print(f"   ❌ All {self.max_retries} attempts failed: {error_detail}")
        raise last_error

    def generate_tldr(self, title: str, abstract: str) -> str:
        """Generate TL;DR (one sentence summary)"""
        if not abstract or len(abstract.strip()) < 50:
            return f"{title[:200]}..."

        prompt = f"""Given this research paper, create a ONE sentence TL;DR summary.

Title: {title}

Abstract: {abstract}

TL;DR (one sentence only):"""

        try:
            return self._call_api_with_retry(prompt, max_tokens=100, temperature=0.3)
        except Exception as e:
            # Fallback: return first sentence of abstract
            first_sentence = abstract.split('.')[0] + '.'
            return first_sentence[:300]

    def generate_short_summary(self, title: str, abstract: str) -> str:
        """Generate short summary (3-5 sentences, ~100 words)"""
        if not abstract or len(abstract.strip()) < 50:
            return abstract[:500] if abstract else "No abstract available."

        prompt = f"""Summarize this research paper in 3-5 sentences (~100 words). Focus on the main contribution, method, and results.

Title: {title}

Abstract: {abstract}

Short Summary (3-5 sentences):"""

        try:
            return self._call_api_with_retry(prompt, max_tokens=200, temperature=0.5)
        except Exception as e:
            # Fallback: return truncated abstract
            return abstract[:400] + "..." if len(abstract) > 400 else abstract

    def generate_detailed_summary(self, title: str, abstract: str) -> str:
        """Generate detailed summary (~300 words)"""
        if not abstract or len(abstract.strip()) < 50:
            return abstract if abstract else "No abstract available."

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
            return self._call_api_with_retry(prompt, max_tokens=500, temperature=0.5)
        except Exception as e:
            # Fallback: return full abstract
            return abstract

    def extract_key_contributions(self, title: str, abstract: str) -> List[str]:
        """Extract key contributions as bullet points"""
        if not abstract or len(abstract.strip()) < 50:
            return [title] if title else ["No information available."]

        prompt = f"""Extract the key contributions of this research paper as 3-5 bullet points.
Be concise and specific.

Title: {title}

Abstract: {abstract}

Key Contributions (bullet points):"""

        try:
            text = self._call_api_with_retry(prompt, max_tokens=300, temperature=0.3)

            # Parse bullet points
            lines = [line.strip() for line in text.split('\n') if line.strip()]
            # Remove bullet markers
            contributions = [line.lstrip('•-*123456789. ') for line in lines if line]
            return contributions[:5] if contributions else [abstract[:200] + "..."]

        except Exception as e:
            # Fallback: extract first few sentences from abstract
            sentences = abstract.split('.')[:3]
            return [s.strip() + '.' for s in sentences if s.strip()]

    def generate_chinese_summary(self, title: str, abstract: str) -> str:
        """Generate Chinese summary"""
        if not abstract or len(abstract.strip()) < 50:
            return title if title else "无摘要信息。"

        prompt = f"""将以下研究论文摘要翻译成中文，并用2-3句话概括主要内容：

Title: {title}

Abstract: {abstract}

中文摘要："""

        try:
            return self._call_api_with_retry(prompt, max_tokens=300, temperature=0.5)
        except Exception as e:
            # Fallback: just return English title
            return f"（AI翻译失败）{title}"

    def generate_all_summaries(self, paper: Dict) -> Dict:
        """Generate all types of summaries for a paper"""
        title = paper.get("title", "")
        abstract = paper.get("abstract", "")

        print(f"\n📝 Generating summaries for: {title[:60]}...")

        # Check if abstract is available
        if not abstract or len(abstract.strip()) < 20:
            print(f"   ⚠️  Warning: No abstract or abstract too short")
            return {
                "tldr": title,
                "short": "Abstract not available.",
                "detailed": "Abstract not available.",
                "key_contributions": ["Information not available"],
                "chinese": title
            }

        summaries = {}
        success_count = 0

        # Generate each type with individual error handling
        try:
            summaries["tldr"] = self.generate_tldr(title, abstract)
            success_count += 1
        except Exception as e:
            summaries["tldr"] = abstract.split('.')[0] + '.'
            print(f"   ⚠️  TLDR generation failed, using fallback")

        try:
            summaries["short"] = self.generate_short_summary(title, abstract)
            success_count += 1
        except Exception as e:
            summaries["short"] = abstract[:400] + "..."
            print(f"   ⚠️  Short summary generation failed, using fallback")

        try:
            summaries["detailed"] = self.generate_detailed_summary(title, abstract)
            success_count += 1
        except Exception as e:
            summaries["detailed"] = abstract
            print(f"   ⚠️  Detailed summary generation failed, using fallback")

        try:
            summaries["key_contributions"] = self.extract_key_contributions(title, abstract)
            success_count += 1
        except Exception as e:
            sentences = abstract.split('.')[:3]
            summaries["key_contributions"] = [s.strip() + '.' for s in sentences if s.strip()]
            print(f"   ⚠️  Key contributions extraction failed, using fallback")

        try:
            summaries["chinese"] = self.generate_chinese_summary(title, abstract)
            success_count += 1
        except Exception as e:
            summaries["chinese"] = title
            print(f"   ⚠️  Chinese summary generation failed, using fallback")

        print(f"   ✅ Generated {success_count}/5 summaries successfully (fallbacks used for others)")
        return summaries

    def process_papers(self, input_file: str, output_file: str):
        """Process all papers and generate summaries"""
        # Load papers
        with open(input_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
            papers = data.get("papers", [])

        if not papers:
            print("⚠️  No papers found to process")
            return

        print(f"🤖 Processing {len(papers)} papers with Groq AI...")
        print(f"   Model: {self.model}")
        print(f"   Retries: {self.max_retries}")

        total_success = 0
        total_failures = 0

        # Generate summaries for each paper
        for i, paper in enumerate(papers, 1):
            print(f"\n[{i}/{len(papers)}]", end=" ")

            try:
                summaries = self.generate_all_summaries(paper)
                paper["ai_summaries"] = summaries
                total_success += 1

                # Small delay to avoid rate limiting
                if i < len(papers):
                    time.sleep(0.5)

            except Exception as e:
                print(f"   ❌ Failed to process paper: {str(e)[:100]}")
                paper["ai_summaries"] = {
                    "tldr": paper.get("title", "Error"),
                    "short": "Summary generation failed. Please check logs.",
                    "detailed": "Summary generation failed. Please check logs.",
                    "key_contributions": ["Summary generation failed."],
                    "chinese": "摘要生成失败"
                }
                total_failures += 1

        # Save results
        os.makedirs(os.path.dirname(output_file), exist_ok=True)
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)

        print(f"\n" + "="*60)
        print(f"✅ Processing complete!")
        print(f"   Successful: {total_success}/{len(papers)}")
        print(f"   Failed: {total_failures}/{len(papers)}")
        print(f"   Output: {output_file}")
        print("="*60)


def test_api_connection(api_key: str):
    """Test Groq API connection"""
    print("🔍 Testing Groq API connection...")

    try:
        client = Groq(api_key=api_key)
        response = client.chat.completions.create(
            messages=[{"role": "user", "content": "Say hello"}],
            model="llama-3.3-70b-versatile",  # Updated model
            max_tokens=10
        )
        print("✅ API connection successful!")
        print(f"   Response: {response.choices[0].message.content}")
        return True
    except Exception as e:
        print(f"❌ API connection failed: {str(e)}")
        print("\nPossible issues:")
        print("1. Invalid API key")
        print("2. Network connection problem")
        print("3. API rate limit reached")
        print("4. API service down")
        return False


def main():
    parser = argparse.ArgumentParser(description="Generate AI summaries using Groq")
    parser.add_argument("--input", default="data/papers/pending/filtered.json",
                        help="Input JSON file with filtered papers")
    parser.add_argument("--output", default="data/papers/pending/with_summaries.json",
                        help="Output JSON file")
    parser.add_argument("--api-key", help="Groq API key (or set GROQ_API_KEY env var)")
    parser.add_argument("--test", action="store_true", help="Test API connection only")

    args = parser.parse_args()

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
        print("\nOr in GitHub Actions, add to repository secrets:")
        print("   Settings → Secrets → Actions → New repository secret")
        print("   Name: GROQ_API_KEY")
        print("   Value: your-api-key")
        return

    # Test mode
    if args.test:
        test_api_connection(api_key)
        return

    if not os.path.exists(args.input):
        print(f"❌ Error: {args.input} not found")
        print("   Run smart_filter.py first")
        return

    # Test API before processing
    print("\n" + "="*60)
    if not test_api_connection(api_key):
        print("\n⚠️  API test failed, but continuing with fallback mode...")
        print("   Summaries will use original abstracts instead of AI generation.")
    print("="*60 + "\n")

    # Generate summaries
    try:
        generator = SummaryGenerator(api_key)
        generator.process_papers(args.input, args.output)
        print("\n🎉 Summary generation complete!")
    except Exception as e:
        print(f"\n❌ Fatal error: {e}")
        print("\nTroubleshooting:")
        print("1. Check your GROQ_API_KEY is valid")
        print("2. Run with --test to verify API connection")
        print("3. Check network connectivity")
        raise


if __name__ == "__main__":
    main()
