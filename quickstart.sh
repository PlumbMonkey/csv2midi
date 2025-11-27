#!/bin/bash
# Quick Start Script for CSV2MIDI Development

echo "🎵 CSV → MIDI Converter - Quick Start"
echo "===================================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 16+"
    exit 1
fi

echo "✓ Node.js: $(node --version)"
echo "✓ npm: $(npm --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ npm install failed"
    exit 1
fi

echo "✓ Dependencies installed"
echo ""

# Build
echo "🔨 Building TypeScript..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✓ Build successful"
echo ""

# Run tests
echo "🧪 Running tests..."
npm test

if [ $? -ne 0 ]; then
    echo "⚠ Tests failed (may be expected if @types/node not installed)"
    echo "   Run 'npm install' again after full setup"
fi

echo ""
echo "✅ Quick start complete!"
echo ""
echo "Next steps:"
echo "  - Try the CLI:   npm start -- samples/drums.csv output.mid"
echo "  - Start web UI:  npm run web"
echo "  - View docs:     See README.md"
echo ""
