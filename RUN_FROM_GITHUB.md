# Run CSV to MIDI Converter from GitHub

You can clone and run the CSV to MIDI Converter directly from GitHub without downloading the Gumroad package.

## Quick Start from GitHub

### Option 1: Clone and Run (Recommended)

```bash
# Clone the repository
git clone https://github.com/PlumbMonkey/csv2midi.git
cd csv2midi

# Install dependencies
npm install

# Start the web application
npm run web
```

Then open **http://localhost:3000** in your browser.

### Option 2: One-Line Setup (Windows)

```powershell
git clone https://github.com/PlumbMonkey/csv2midi.git; cd csv2midi; npm install; npm run web
```

### Option 3: One-Line Setup (Mac/Linux)

```bash
git clone https://github.com/PlumbMonkey/csv2midi.git && cd csv2midi && npm install && npm run web
```

## Available Commands

Once installed, you can use:

```bash
# Start web application (http://localhost:3000)
npm run web

# Convert via CLI
npm start -- input.csv output.mid

# Run all tests (38 tests)
npm test

# Build from source
npm run build

# Check code quality
npm lint

# Auto-format code
npm format
```

## System Requirements

- **Git** - To clone the repository
- **Node.js** 16+ - https://nodejs.org
- **npm** 7+ - Comes with Node.js

## What You Get

✅ Full source code (TypeScript)  
✅ Web UI with neon theme  
✅ CLI tool for batch processing  
✅ REST API endpoint  
✅ All 38 tests  
✅ Complete documentation  
✅ Sample CSV files  

## GitHub Repository

**URL:** https://github.com/PlumbMonkey/csv2midi

### Clone Options:

```bash
# HTTPS (no setup needed)
git clone https://github.com/PlumbMonkey/csv2midi.git

# SSH (requires SSH key)
git clone git@github.com:PlumbMonkey/csv2midi.git
```

## Verify Installation

```bash
# Run tests to verify everything works
npm test

# Should see: Tests: 38 passed, 38 total
```

## Convert Your First File

```bash
# Try the example
npm start -- samples/drums.csv output.mid

# Or start the web server
npm run web
# Then upload a CSV at http://localhost:3000
```

## Development

If you want to modify the code:

```bash
# Install dev dependencies (already done by npm install)
npm install

# TypeScript watch mode (auto-compile on save)
npm run build -- --watch

# Run tests in watch mode (re-run on file changes)
npm run test:watch

# The source code is in src/
# Compiled code goes to dist/
```

## Troubleshooting

**"git: command not found"**
- Install Git from https://git-scm.com

**"npm: command not found"**
- Install Node.js from https://nodejs.org

**"Port 3000 already in use"**
- Kill the process: `lsof -ti:3000 | xargs kill -9` (Mac/Linux)
- Or use Windows: `netstat -ano | findstr :3000` and kill the PID

**Tests failing after clone**
```bash
npm run clean
npm install
npm test
```

## Free vs Gumroad

| Feature | GitHub (Free) | Gumroad (Paid) |
|---------|---------------|---|
| Source code | ✅ Yes | ✅ Yes |
| Web UI | ✅ Yes | ✅ Yes |
| CLI tool | ✅ Yes | ✅ Yes |
| REST API | ✅ Yes | ✅ Yes |
| Tests | ✅ Yes | ✅ Yes |
| Support | ❌ No | ✅ Yes* |

*Paid version may include email support depending on Gumroad seller setup

## Contributing

The GitHub version is open source (MIT License). Feel free to:
- Report issues
- Submit pull requests
- Fork and modify
- Use in your projects

See **CONTRIBUTING.md** for guidelines.

## Next Steps

1. **Clone:** `git clone https://github.com/PlumbMonkey/csv2midi.git`
2. **Install:** `npm install`
3. **Run:** `npm run web`
4. **Convert:** Upload a CSV at http://localhost:3000

Enjoy! 🎵
