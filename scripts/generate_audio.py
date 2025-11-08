#!/usr/bin/env python3
"""
Audio Generator using Edge TTS (Free)
Converts paper summaries to audio files
"""

import json
import os
import asyncio
import edge_tts
from pathlib import Path
from typing import Dict


class AudioGenerator:
    """Generate audio summaries using Edge TTS"""

    def __init__(self, output_dir: str = "static/audio"):
        """Initialize audio generator"""
        self.output_dir = output_dir
        os.makedirs(output_dir, exist_ok=True)

        # Available voices
        self.voices = {
            "en-male": "en-US-GuyNeural",
            "en-female": "en-US-JennyNeural",
            "zh-male": "zh-CN-YunxiNeural",
            "zh-female": "zh-CN-XiaoxiaoNeural"
        }

    async def text_to_speech(self, text: str, output_file: str, voice: str = "en-male"):
        """Convert text to speech"""
        voice_id = self.voices.get(voice, self.voices["en-male"])

        communicate = edge_tts.Communicate(text, voice_id)
        await communicate.save(output_file)

    async def generate_paper_audio(self, paper: Dict, paper_id: str):
        """Generate audio for a paper's summary"""
        summaries = paper.get("ai_summaries", {})

        if not summaries:
            print(f"   ⚠️  No summaries found for {paper_id}")
            return None

        # Use short summary for audio
        text = summaries.get("short", summaries.get("tldr", ""))

        if not text:
            print(f"   ⚠️  No text to convert for {paper_id}")
            return None

        # Create audio file path
        audio_file = os.path.join(self.output_dir, f"{paper_id}.mp3")

        try:
            await self.text_to_speech(text, audio_file, "en-female")
            print(f"   🔊 Audio saved: {audio_file}")
            return f"/audio/{paper_id}.mp3"
        except Exception as e:
            print(f"   ❌ Error generating audio: {e}")
            return None

    async def process_papers(self, input_file: str, output_file: str):
        """Process all papers and generate audio"""
        # Load papers
        with open(input_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
            papers = data.get("papers", [])

        print(f"\n🔊 Generating audio for {len(papers)} papers...")

        # Generate audio for each paper
        for i, paper in enumerate(papers, 1):
            paper_id = paper.get("arxiv_id", f"paper_{i}")
            title = paper.get("title", "")[:50]

            print(f"\n[{i}/{len(papers)}] {title}...")

            audio_url = await self.generate_paper_audio(paper, paper_id)

            if audio_url:
                if "ai_summaries" not in paper:
                    paper["ai_summaries"] = {}
                paper["ai_summaries"]["audio_url"] = audio_url

        # Save updated data
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)

        print(f"\n✅ Audio generation complete!")
        print(f"📁 Audio files saved to: {self.output_dir}")
        print(f"📄 Updated data saved to: {output_file}")


def main():
    import argparse

    parser = argparse.ArgumentParser(description="Generate audio summaries")
    parser.add_argument("--input", default="data/papers/pending/with_summaries.json",
                        help="Input JSON with summaries")
    parser.add_argument("--output", default="data/papers/pending/with_audio.json",
                        help="Output JSON file")

    args = parser.parse_args()

    if not os.path.exists(args.input):
        print(f"❌ Error: {args.input} not found")
        print("   Run generate_summaries.py first")
        return

    generator = AudioGenerator()
    asyncio.run(generator.process_papers(args.input, args.output))


if __name__ == "__main__":
    main()
