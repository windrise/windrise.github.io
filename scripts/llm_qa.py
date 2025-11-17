#!/usr/bin/env python3
"""
Enhanced Q&A with LLM integration.

Uses Gemini or ZhipuAI APIs to generate natural language answers
based on retrieved paper context from the vector database.
"""

import os
import sys
import argparse
from typing import Dict, List, Optional

# Import existing query engine
try:
    from query_papers import PaperQueryEngine
except ImportError:
    print("Error: query_papers module not found")
    sys.exit(1)

# Import LLM providers
try:
    import google.generativeai as genai
    HAS_GEMINI = True
except ImportError:
    HAS_GEMINI = False

try:
    from zhipuai import ZhipuAI
    HAS_ZHIPU = True
except ImportError:
    HAS_ZHIPU = False


class LLMQueryEngine:
    """Enhanced query engine with LLM-powered answers."""

    def __init__(self, vectordb_path: str = "data/vectordb",
                 llm_provider: str = "auto"):
        """
        Initialize LLM query engine.

        Args:
            vectordb_path: Path to vector database
            llm_provider: LLM provider to use (auto, gemini, zhipu)
        """
        # Initialize vector database
        self.query_engine = PaperQueryEngine(db_path=vectordb_path)

        # Select LLM provider
        self.llm_provider = None
        self.llm_client = None

        if llm_provider == "auto":
            self.llm_provider = self._select_provider()
        else:
            self.llm_provider = llm_provider

        self._init_llm()

    def _select_provider(self) -> str:
        """Auto-select available LLM provider."""
        # Check for API keys
        if os.getenv('GEMINI_API_KEY') and HAS_GEMINI:
            return 'gemini'
        elif os.getenv('ZHIPU_API_KEY') and HAS_ZHIPU:
            return 'zhipu'
        else:
            return None

    def _init_llm(self):
        """Initialize LLM client."""
        if self.llm_provider == 'gemini':
            if not HAS_GEMINI:
                print("Error: google-generativeai not installed")
                print("Install: pip install google-generativeai")
                sys.exit(1)

            api_key = os.getenv('GEMINI_API_KEY')
            if not api_key:
                print("Error: GEMINI_API_KEY not set")
                sys.exit(1)

            genai.configure(api_key=api_key)
            self.llm_client = genai.GenerativeModel('gemini-pro')
            print("✅ Using Gemini API")

        elif self.llm_provider == 'zhipu':
            if not HAS_ZHIPU:
                print("Error: zhipuai not installed")
                print("Install: pip install zhipuai")
                sys.exit(1)

            api_key = os.getenv('ZHIPU_API_KEY')
            if not api_key:
                print("Error: ZHIPU_API_KEY not set")
                sys.exit(1)

            self.llm_client = ZhipuAI(api_key=api_key)
            print("✅ Using ZhipuAI API")

        else:
            print("⚠️  No LLM provider available")
            print("Set GEMINI_API_KEY or ZHIPU_API_KEY environment variable")
            self.llm_provider = None

    def _generate_with_gemini(self, prompt: str) -> str:
        """Generate answer using Gemini."""
        try:
            response = self.llm_client.generate_content(prompt)
            return response.text
        except Exception as e:
            return f"Error generating answer: {e}"

    def _generate_with_zhipu(self, prompt: str) -> str:
        """Generate answer using ZhipuAI."""
        try:
            response = self.llm_client.chat.completions.create(
                model="glm-4",
                messages=[
                    {"role": "user", "content": prompt}
                ]
            )
            return response.choices[0].message.content
        except Exception as e:
            return f"Error generating answer: {e}"

    def _generate_answer(self, prompt: str) -> str:
        """Generate answer using selected LLM."""
        if self.llm_provider == 'gemini':
            return self._generate_with_gemini(prompt)
        elif self.llm_provider == 'zhipu':
            return self._generate_with_zhipu(prompt)
        else:
            return "No LLM provider configured. Please set GEMINI_API_KEY or ZHIPU_API_KEY."

    def answer_question(self, question: str, n_context: int = 3) -> Dict:
        """
        Answer a question using retrieved context and LLM.

        Args:
            question: Question to answer
            n_context: Number of relevant papers to use as context

        Returns:
            Dictionary with question, answer, sources
        """
        # Retrieve relevant papers
        print(f"\n🔍 Searching for relevant papers...")
        results = self.query_engine.search(question, n_results=n_context)

        if not results:
            return {
                'question': question,
                'answer': 'No relevant papers found in the collection.',
                'sources': []
            }

        # Build context from results
        context_parts = []
        sources = []

        for i, result in enumerate(results, 1):
            metadata = result['metadata']
            text = result['text']

            context_parts.append(f"[Paper {i}]\n{text}")
            sources.append({
                'paper_id': metadata.get('paper_id'),
                'title': metadata.get('title'),
                'year': metadata.get('year'),
                'venue': metadata.get('venue'),
                'relevance': 1.0 - (result.get('distance', 0))
            })

        context = '\n\n'.join(context_parts)

        # Generate answer with LLM
        if self.llm_provider:
            print(f"🤖 Generating answer using {self.llm_provider.upper()}...")

            prompt = f"""Based on the following research papers, please answer the question.

Question: {question}

Research Papers Context:
{context}

Please provide a comprehensive answer that:
1. Synthesizes information from the papers
2. Cites specific papers when making claims
3. Is clear and well-structured
4. Indicates if the papers don't fully answer the question

Answer:"""

            answer = self._generate_answer(prompt)
        else:
            # Fallback to simple answer
            answer = f"Based on {len(results)} relevant papers:\n\n{context[:500]}..."

        return {
            'question': question,
            'answer': answer,
            'sources': sources,
            'num_papers': len(results)
        }

    def compare_papers(self, paper_ids: List[str]) -> Dict:
        """
        Compare multiple papers using LLM.

        Args:
            paper_ids: List of paper IDs to compare

        Returns:
            Dictionary with comparison analysis
        """
        if not self.llm_provider:
            return {'error': 'No LLM provider configured'}

        print(f"\n🔍 Retrieving {len(paper_ids)} papers for comparison...")

        # Get paper details from vector database
        papers_context = []
        for paper_id in paper_ids:
            results = self.query_engine.collection.get(
                ids=[f"{paper_id}_abstract"],
                include=['documents', 'metadatas']
            )

            if results['ids']:
                papers_context.append({
                    'id': paper_id,
                    'content': results['documents'][0],
                    'metadata': results['metadatas'][0]
                })

        if not papers_context:
            return {'error': 'Papers not found in database'}

        # Build context
        context = '\n\n'.join([
            f"[Paper {i+1}: {p['metadata'].get('title', 'Unknown')}]\n{p['content']}"
            for i, p in enumerate(papers_context)
        ])

        # Generate comparison
        print(f"🤖 Generating comparison using {self.llm_provider.upper()}...")

        prompt = f"""Please compare and contrast the following research papers:

{context}

Provide a comprehensive comparison that includes:
1. Main similarities in approach/methodology
2. Key differences and unique contributions
3. Relative strengths and weaknesses
4. How they build upon or differ from each other
5. Which paper might be more suitable for different use cases

Comparison:"""

        comparison = self._generate_answer(prompt)

        return {
            'papers': papers_context,
            'comparison': comparison
        }

    def summarize_topic(self, topic: str, n_papers: int = 5) -> Dict:
        """
        Generate a literature review summary on a topic.

        Args:
            topic: Research topic
            n_papers: Number of papers to include

        Returns:
            Dictionary with summary
        """
        if not self.llm_provider:
            return {'error': 'No LLM provider configured'}

        print(f"\n🔍 Finding papers about: {topic}")

        # Search for relevant papers
        results = self.query_engine.search(topic, n_results=n_papers)

        if not results:
            return {'error': 'No relevant papers found'}

        # Build context
        context_parts = []
        for i, result in enumerate(results, 1):
            metadata = result['metadata']
            text = result['text']
            context_parts.append(
                f"[Paper {i}: {metadata.get('title', 'Unknown')} "
                f"({metadata.get('year', 'N/A')})]\n{text}"
            )

        context = '\n\n'.join(context_parts)

        # Generate summary
        print(f"🤖 Generating literature review using {self.llm_provider.upper()}...")

        prompt = f"""Based on these research papers about "{topic}", generate a comprehensive literature review summary:

{context}

The summary should:
1. Provide an overview of the research area
2. Identify common themes and approaches
3. Highlight key findings and contributions
4. Note any disagreements or different perspectives
5. Suggest gaps or future research directions
6. Be well-structured with clear sections

Literature Review:"""

        summary = self._generate_answer(prompt)

        return {
            'topic': topic,
            'summary': summary,
            'num_papers': len(results)
        }

    def interactive_chat(self):
        """Run interactive chat mode."""
        print("\n" + "="*80)
        print("🤖 Interactive Q&A with LLM")
        print("="*80)

        if not self.llm_provider:
            print("\n⚠️  No LLM configured. Using simple retrieval mode.")
            print("Set GEMINI_API_KEY or ZHIPU_API_KEY for enhanced answers.\n")
        else:
            print(f"\n✅ Using {self.llm_provider.upper()} for enhanced answers\n")

        print("Commands:")
        print("  - Ask any question about your papers")
        print("  - 'compare <id1> <id2>' - Compare two papers")
        print("  - 'review <topic>' - Generate literature review")
        print("  - 'quit' or 'exit' - Exit")
        print("\n" + "="*80 + "\n")

        while True:
            try:
                query = input("💬 You: ").strip()

                if not query:
                    continue

                if query.lower() in ['quit', 'exit', 'q']:
                    print("Goodbye!")
                    break

                elif query.lower().startswith('compare '):
                    # Parse paper IDs
                    parts = query.split()[1:]
                    if len(parts) < 2:
                        print("Usage: compare <paper-id-1> <paper-id-2> [<paper-id-3> ...]")
                        continue

                    result = self.compare_papers(parts)
                    if 'error' in result:
                        print(f"❌ {result['error']}")
                    else:
                        print(f"\n🤖 AI: {result['comparison']}\n")

                elif query.lower().startswith('review '):
                    topic = query[7:].strip()
                    result = self.summarize_topic(topic)
                    if 'error' in result:
                        print(f"❌ {result['error']}")
                    else:
                        print(f"\n🤖 AI: {result['summary']}\n")

                else:
                    # Regular Q&A
                    result = self.answer_question(query)
                    print(f"\n🤖 AI: {result['answer']}\n")

                    if result.get('sources'):
                        print("📚 Sources:")
                        for i, source in enumerate(result['sources'], 1):
                            print(f"  {i}. {source['title']} ({source['year']})")
                            print(f"     Relevance: {source['relevance']:.2%}")
                        print()

            except KeyboardInterrupt:
                print("\n\nGoodbye!")
                break
            except Exception as e:
                print(f"\n❌ Error: {e}\n")


def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(
        description='Enhanced Q&A with LLM integration'
    )
    parser.add_argument(
        '--vectordb-path',
        default='data/vectordb',
        help='Path to vector database'
    )
    parser.add_argument(
        '--llm',
        choices=['auto', 'gemini', 'zhipu'],
        default='auto',
        help='LLM provider to use'
    )
    parser.add_argument(
        '-q', '--question',
        help='Ask a specific question'
    )
    parser.add_argument(
        '--compare',
        nargs='+',
        metavar='PAPER_ID',
        help='Compare multiple papers'
    )
    parser.add_argument(
        '--review',
        metavar='TOPIC',
        help='Generate literature review on topic'
    )
    parser.add_argument(
        '-i', '--interactive',
        action='store_true',
        help='Interactive chat mode'
    )
    parser.add_argument(
        '-n',
        type=int,
        default=3,
        help='Number of context papers (default: 3)'
    )

    args = parser.parse_args()

    # Check if vector database exists
    if not os.path.exists(args.vectordb_path):
        print(f"Error: Vector database not found at {args.vectordb_path}")
        print("Please run: python scripts/setup_vectordb.py")
        return 1

    # Initialize engine
    try:
        engine = LLMQueryEngine(
            vectordb_path=args.vectordb_path,
            llm_provider=args.llm
        )
    except Exception as e:
        print(f"Error initializing engine: {e}")
        return 1

    # Execute command
    if args.interactive:
        engine.interactive_chat()

    elif args.question:
        result = engine.answer_question(args.question, n_context=args.n)
        print(f"\n❓ Question: {result['question']}")
        print(f"\n🤖 Answer:\n{result['answer']}\n")

        if result.get('sources'):
            print("📚 Sources:")
            for i, source in enumerate(result['sources'], 1):
                print(f"  {i}. {source['title']} ({source['year']})")
            print()

    elif args.compare:
        result = engine.compare_papers(args.compare)
        if 'error' in result:
            print(f"Error: {result['error']}")
        else:
            print(f"\n📊 Comparison:\n{result['comparison']}\n")

    elif args.review:
        result = engine.summarize_topic(args.review, n_papers=args.n)
        if 'error' in result:
            print(f"Error: {result['error']}")
        else:
            print(f"\n📝 Literature Review on '{result['topic']}':\n")
            print(result['summary'])
            print(f"\nBased on {result['num_papers']} papers\n")

    else:
        parser.print_help()
        print("\nExamples:")
        print("  # Interactive chat mode")
        print("  python scripts/llm_qa.py -i")
        print()
        print("  # Ask a question")
        print("  python scripts/llm_qa.py -q 'What are the latest advances in 3D reconstruction?'")
        print()
        print("  # Compare papers")
        print("  python scripts/llm_qa.py --compare paper-1 paper-2")
        print()
        print("  # Generate literature review")
        print("  python scripts/llm_qa.py --review 'gaussian splatting methods'")

    return 0


if __name__ == '__main__':
    sys.exit(main())
