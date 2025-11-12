#!/usr/bin/env python3
"""
Multi-API AI Summary Generator
Supports: Groq, Google Gemini, DeepSeek
"""

import json
import os
import time
from typing import Dict, List, Optional
import argparse


class MultiAPIGenerator:
    """Generate AI summaries using multiple API providers"""

    def __init__(self, api_provider: str = "auto"):
        """
        Initialize with API provider

        Args:
            api_provider: "gemini", "groq", "deepseek", "zhipu", "openai", "claude", "kimi", or "auto"
        """
        self.api_provider = api_provider
        self.client = None
        self.model_name = None
        self.max_retries = 3
        self.retry_delay = 2

        # Try to initialize API client
        self._init_client()

    def _init_client(self):
        """Initialize API client based on provider"""

        if self.api_provider == "auto":
            # Try providers in order of preference (free first, then paid)
            providers = ["gemini", "zhipu", "groq", "deepseek", "kimi", "openai", "claude"]
            for provider in providers:
                if self._try_init_provider(provider):
                    print(f"✅ Using {provider.upper()} API")
                    return

            print("⚠️  No API provider available, using fallback mode")
            self.api_provider = None

        else:
            # Try specific provider
            if not self._try_init_provider(self.api_provider):
                print(f"❌ Failed to initialize {self.api_provider}, using fallback mode")
                self.api_provider = None

    def _try_init_provider(self, provider: str) -> bool:
        """Try to initialize a specific provider"""

        try:
            if provider == "gemini":
                return self._init_gemini()
            elif provider == "groq":
                return self._init_groq()
            elif provider == "deepseek":
                return self._init_deepseek()
            elif provider == "zhipu":
                return self._init_zhipu()
            elif provider == "openai":
                return self._init_openai()
            elif provider == "claude":
                return self._init_claude()
            elif provider == "kimi":
                return self._init_kimi()
        except Exception as e:
            print(f"   Failed to init {provider}: {str(e)[:100]}")
            return False

        return False

    def _init_gemini(self) -> bool:
        """Initialize Google Gemini API"""
        api_key = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")

        if not api_key:
            return False

        try:
            import google.generativeai as genai

            genai.configure(api_key=api_key)
            self.client = genai.GenerativeModel('gemini-1.5-flash')
            self.model_name = "gemini-1.5-flash"
            self.api_provider = "gemini"
            return True

        except ImportError:
            print("   google-generativeai not installed: pip install google-generativeai")
            return False
        except Exception as e:
            print(f"   Gemini init error: {str(e)[:100]}")
            return False

    def _init_groq(self) -> bool:
        """Initialize Groq API"""
        api_key = os.environ.get("GROQ_API_KEY")

        if not api_key:
            return False

        try:
            from groq import Groq

            self.client = Groq(api_key=api_key)
            self.model_name = "llama-3.3-70b-versatile"
            self.api_provider = "groq"
            return True

        except ImportError:
            print("   groq not installed: pip install groq")
            return False
        except Exception as e:
            print(f"   Groq init error: {str(e)[:100]}")
            return False

    def _init_deepseek(self) -> bool:
        """Initialize DeepSeek API"""
        api_key = os.environ.get("DEEPSEEK_API_KEY")

        if not api_key:
            return False

        try:
            from openai import OpenAI

            # DeepSeek uses OpenAI-compatible API
            self.client = OpenAI(
                api_key=api_key,
                base_url="https://api.deepseek.com"
            )
            self.model_name = "deepseek-chat"
            self.api_provider = "deepseek"
            return True

        except ImportError:
            print("   openai not installed: pip install openai")
            return False
        except Exception as e:
            print(f"   DeepSeek init error: {str(e)[:100]}")
            return False

    def _init_zhipu(self) -> bool:
        """Initialize ZhipuAI (智谱AI) API"""
        api_key = os.environ.get("ZHIPU_API_KEY")

        if not api_key:
            return False

        try:
            from zhipuai import ZhipuAI

            self.client = ZhipuAI(api_key=api_key)
            self.model_name = "glm-4-flash"  # Free model
            self.api_provider = "zhipu"
            return True

        except ImportError:
            print("   zhipuai not installed: pip install zhipuai")
            return False
        except Exception as e:
            print(f"   ZhipuAI init error: {str(e)[:100]}")
            return False

    def _init_openai(self) -> bool:
        """Initialize OpenAI API"""
        api_key = os.environ.get("OPENAI_API_KEY")

        if not api_key:
            return False

        try:
            from openai import OpenAI

            self.client = OpenAI(api_key=api_key)
            self.model_name = "gpt-4o-mini"  # Cheapest option
            self.api_provider = "openai"
            return True

        except ImportError:
            print("   openai not installed: pip install openai")
            return False
        except Exception as e:
            print(f"   OpenAI init error: {str(e)[:100]}")
            return False

    def _init_claude(self) -> bool:
        """Initialize Anthropic Claude API"""
        api_key = os.environ.get("ANTHROPIC_API_KEY") or os.environ.get("CLAUDE_API_KEY")

        if not api_key:
            return False

        try:
            from anthropic import Anthropic

            self.client = Anthropic(api_key=api_key)
            self.model_name = "claude-3-haiku-20240307"  # Fastest/cheapest
            self.api_provider = "claude"
            return True

        except ImportError:
            print("   anthropic not installed: pip install anthropic")
            return False
        except Exception as e:
            print(f"   Claude init error: {str(e)[:100]}")
            return False

    def _init_kimi(self) -> bool:
        """Initialize Moonshot Kimi API"""
        api_key = os.environ.get("KIMI_API_KEY") or os.environ.get("MOONSHOT_API_KEY")

        if not api_key:
            return False

        try:
            from openai import OpenAI

            # Kimi uses OpenAI-compatible API
            self.client = OpenAI(
                api_key=api_key,
                base_url="https://api.moonshot.cn/v1"
            )
            self.model_name = "moonshot-v1-8k"
            self.api_provider = "kimi"
            return True

        except ImportError:
            print("   openai not installed: pip install openai")
            return False
        except Exception as e:
            print(f"   Kimi init error: {str(e)[:100]}")
            return False

    def _call_api(self, prompt: str, max_tokens: int = 500) -> Optional[str]:
        """Call API with retry logic"""

        if not self.client:
            return None

        for attempt in range(self.max_retries):
            try:
                if self.api_provider == "gemini":
                    response = self.client.generate_content(prompt)
                    return response.text

                elif self.api_provider == "groq":
                    response = self.client.chat.completions.create(
                        messages=[{"role": "user", "content": prompt}],
                        model=self.model_name,
                        max_tokens=max_tokens,
                        temperature=0.5
                    )
                    return response.choices[0].message.content

                elif self.api_provider in ["deepseek", "openai", "kimi"]:
                    # OpenAI-compatible APIs
                    response = self.client.chat.completions.create(
                        model=self.model_name,
                        messages=[{"role": "user", "content": prompt}],
                        max_tokens=max_tokens,
                        temperature=0.5
                    )
                    return response.choices[0].message.content

                elif self.api_provider == "zhipu":
                    response = self.client.chat.completions.create(
                        model=self.model_name,
                        messages=[{"role": "user", "content": prompt}],
                        max_tokens=max_tokens,
                        temperature=0.5
                    )
                    return response.choices[0].message.content

                elif self.api_provider == "claude":
                    response = self.client.messages.create(
                        model=self.model_name,
                        max_tokens=max_tokens,
                        messages=[{"role": "user", "content": prompt}],
                        temperature=0.5
                    )
                    return response.content[0].text

            except Exception as e:
                if attempt < self.max_retries - 1:
                    wait_time = self.retry_delay * (attempt + 1)
                    print(f"   ⚠️  Attempt {attempt + 1} failed, retrying in {wait_time}s...")
                    time.sleep(wait_time)
                else:
                    print(f"   ❌ All retries failed: {str(e)[:100]}")

        return None

    def generate_summary(self, title: str, abstract: str) -> str:
        """Generate short summary"""
        if not abstract or len(abstract.strip()) < 50:
            return abstract[:500] if abstract else "No abstract available."

        prompt = f"""Summarize this research paper in 3-5 sentences (~100 words):

Title: {title}
Abstract: {abstract}

Summary:"""

        result = self._call_api(prompt, max_tokens=200)

        # Fallback
        if not result:
            return abstract[:400] + "..." if len(abstract) > 400 else abstract

        return result

    def extract_contributions(self, title: str, abstract: str) -> List[str]:
        """Extract key contributions"""
        if not abstract or len(abstract.strip()) < 50:
            return [title] if title else ["No information available."]

        prompt = f"""Extract 3-5 key contributions from this paper as bullet points:

Title: {title}
Abstract: {abstract}

Key Contributions:"""

        result = self._call_api(prompt, max_tokens=300)

        # Parse bullet points
        if result:
            lines = [line.strip() for line in result.split('\n') if line.strip()]
            contributions = [line.lstrip('•-*123456789. ') for line in lines if line]
            return contributions[:5] if contributions else [abstract[:200] + "..."]

        # Fallback: extract sentences from abstract
        sentences = abstract.split('.')[:3]
        return [s.strip() + '.' for s in sentences if s.strip()]

    def generate_all_summaries(self, paper: Dict) -> Dict:
        """Generate all summaries for a paper"""
        title = paper.get("title", "")
        abstract = paper.get("abstract", "")

        print(f"📝 Generating summaries for: {title[:60]}...")

        if not abstract or len(abstract.strip()) < 20:
            print(f"   ⚠️  No abstract available")
            return {
                "tldr": title,
                "short": "Abstract not available.",
                "key_contributions": ["Information not available"],
                "provider": "fallback"
            }

        summaries = {
            "short": self.generate_summary(title, abstract),
            "key_contributions": self.extract_contributions(title, abstract),
            "provider": self.api_provider or "fallback"
        }

        print(f"   ✅ Generated using {summaries['provider']}")
        return summaries

    def process_papers(self, input_file: str, output_file: str):
        """Process all papers"""
        with open(input_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
            papers = data.get("papers", [])

        if not papers:
            print("⚠️  No papers found")
            return

        print(f"🤖 Processing {len(papers)} papers...")
        print(f"   Provider: {self.api_provider or 'fallback mode'}")
        if self.model_name:
            print(f"   Model: {self.model_name}")
        print()

        for i, paper in enumerate(papers, 1):
            print(f"[{i}/{len(papers)}]", end=" ")
            summaries = self.generate_all_summaries(paper)
            paper["ai_summaries"] = summaries

            # Rate limiting
            if i < len(papers):
                time.sleep(0.5)

        # Save results
        os.makedirs(os.path.dirname(output_file), exist_ok=True)
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)

        print(f"\n✅ Saved to {output_file}")


def main():
    parser = argparse.ArgumentParser(description="Multi-API Summary Generator")
    parser.add_argument("--input", default="data/papers/pending/filtered.json")
    parser.add_argument("--output", default="data/papers/pending/with_summaries.json")
    parser.add_argument("--provider", default="auto",
                       choices=["auto", "gemini", "groq", "deepseek", "zhipu", "openai", "claude", "kimi"],
                       help="API provider (auto tries all in order)")

    args = parser.parse_args()

    if not os.path.exists(args.input):
        print(f"❌ Error: {args.input} not found")
        return

    print("="*60)
    print("🤖 Multi-API Summary Generator")
    print("="*60)
    print()

    generator = MultiAPIGenerator(api_provider=args.provider)
    generator.process_papers(args.input, args.output)

    print("\n🎉 Complete!")


if __name__ == "__main__":
    main()
