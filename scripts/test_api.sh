#!/bin/bash
# Quick diagnostic script for API issues

echo "=================================="
echo "🔍 GROQ API Diagnostic"
echo "=================================="
echo ""

# Check 1: Environment variable
echo "📋 Check 1: Environment Variable"
if [ -z "$GROQ_API_KEY" ]; then
    echo "❌ GROQ_API_KEY is NOT set"
    echo "   This is the problem!"
    exit 1
else
    echo "✅ GROQ_API_KEY is set"
    echo "   Length: ${#GROQ_API_KEY} characters"
    echo "   Starts with: ${GROQ_API_KEY:0:4}..."

    # Check if it looks like a valid Groq key
    if [[ "$GROQ_API_KEY" == gsk_* ]]; then
        echo "   ✅ Format looks correct (starts with 'gsk_')"
    else
        echo "   ⚠️  Warning: Key doesn't start with 'gsk_'"
        echo "   Make sure this is a Groq API key"
    fi
fi
echo ""

# Check 2: Python availability
echo "📋 Check 2: Python Environment"
python3 --version
echo ""

# Check 3: Groq module
echo "📋 Check 3: Groq Module"
if python3 -c "import groq; print('✅ groq module installed')" 2>&1; then
    python3 -c "import groq; print(f'   Version: {groq.__version__}')" 2>/dev/null || echo "   (version unknown)"
else
    echo "❌ groq module not installed"
    echo "   Run: pip install groq"
    exit 1
fi
echo ""

# Check 4: API Connection Test
echo "📋 Check 4: API Connection Test"
python3 << 'PYEOF'
import os
import sys

try:
    from groq import Groq

    api_key = os.environ.get("GROQ_API_KEY")
    if not api_key:
        print("❌ No API key in environment")
        sys.exit(1)

    print("   Creating Groq client...")
    client = Groq(api_key=api_key)

    print("   Sending test request...")
    response = client.chat.completions.create(
        messages=[{"role": "user", "content": "Say 'API test successful'"}],
        model="llama-3.3-70b-versatile",  # Updated model
        max_tokens=20
    )

    result = response.choices[0].message.content
    print(f"   ✅ API Response: {result}")
    print("")
    print("🎉 All checks passed! API is working correctly.")

except Exception as e:
    print(f"   ❌ Error: {str(e)}")
    print("")
    print("Troubleshooting:")
    print("1. Check if API key is valid at https://console.groq.com/")
    print("2. Make sure you copied the entire key (starts with 'gsk_')")
    print("3. Try generating a new API key")
    sys.exit(1)
PYEOF

echo ""
echo "=================================="
echo "✅ Diagnostic Complete"
echo "=================================="
