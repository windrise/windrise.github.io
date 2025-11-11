#!/bin/bash
# Diagnostic script to test paper pipeline

echo "=================================="
echo "📊 Paper Pipeline Diagnostic"
echo "=================================="
echo ""

# Step 1: Test arXiv fetch
echo "🧪 Test 1: Fetch papers from arXiv"
echo "   Running: python scripts/arxiv_scraper.py --max-results 20 --days 7"
echo ""
python scripts/arxiv_scraper.py --max-results 20 --days 7
STEP1_EXIT=$?

echo ""
echo "---"
echo ""

# Check if candidates.json was created
if [ -f "data/papers/pending/candidates.json" ]; then
    PAPER_COUNT=$(python3 -c "import json; data=json.load(open('data/papers/pending/candidates.json')); print(data.get('total_papers', 0))")
    echo "✅ Step 1 Result: Found $PAPER_COUNT papers"
    echo "   File: data/papers/pending/candidates.json"
else
    echo "❌ Step 1 Failed: candidates.json not created"
    echo "   This means arXiv fetch failed"
    exit 1
fi

echo ""
echo "---"
echo ""

# Step 2: Test filter
echo "🧪 Test 2: Filter and rank papers"
echo "   Running: python scripts/smart_filter.py --top-n 5"
echo ""
python scripts/smart_filter.py --top-n 5
STEP2_EXIT=$?

echo ""
echo "---"
echo ""

# Check if filtered.json was created
if [ -f "data/papers/pending/filtered.json" ]; then
    FILTERED_COUNT=$(python3 -c "import json; data=json.load(open('data/papers/pending/filtered.json')); print(len(data.get('papers', [])))")
    echo "✅ Step 2 Result: $FILTERED_COUNT papers selected"
    echo "   File: data/papers/pending/filtered.json"
else
    echo "❌ Step 2 Failed: filtered.json not created"
    exit 1
fi

echo ""
echo "---"
echo ""

# Step 3: Test summary generation (without API key check for now)
echo "🧪 Test 3: Check summary generation prerequisites"
if [ -z "$GROQ_API_KEY" ]; then
    echo "⚠️  GROQ_API_KEY not set (this is OK for local testing)"
    echo "   Summaries would use fallback mode in production"
else
    echo "✅ GROQ_API_KEY is set"
fi

echo ""
echo "=================================="
echo "📊 Summary"
echo "=================================="
echo "Step 1 (arXiv fetch): $([ $STEP1_EXIT -eq 0 ] && echo '✅ PASS' || echo '❌ FAIL')"
echo "Step 2 (Filter):      $([ $STEP2_EXIT -eq 0 ] && echo '✅ PASS' || echo '❌ FAIL')"
echo ""
echo "Papers found:     $PAPER_COUNT"
echo "Papers filtered:  $FILTERED_COUNT"
echo ""
echo "✅ Pipeline is ready for AI summary generation"
echo "=================================="
