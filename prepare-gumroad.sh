#!/bin/bash

# CSV to MIDI Converter - Distribution Package Builder
# Run this script to prepare the product for Gumroad

echo "🎵 CSV to MIDI Converter - Preparing for Distribution"
echo "===================================================="
echo ""

# Create distribution directory
DIST_DIR="csv2midi-product"
echo "📦 Creating distribution package: $DIST_DIR"

# Clean previous distribution
rm -rf "$DIST_DIR"
mkdir -p "$DIST_DIR"

# Copy essential files
echo "📋 Copying files..."
cp -r dist "$DIST_DIR/"
cp -r samples "$DIST_DIR/"
cp -r docs "$DIST_DIR/"
cp package.json "$DIST_DIR/"
cp package-lock.json "$DIST_DIR/"
cp tsconfig.json "$DIST_DIR/"
cp jest.config.js "$DIST_DIR/"
cp .eslintrc.json "$DIST_DIR/"
cp .prettierrc "$DIST_DIR/"
cp README.md "$DIST_DIR/"
cp CONTRIBUTING.md "$DIST_DIR/"
cp LICENSE "$DIST_DIR/"

# Copy source code for reference
echo "💾 Including source code..."
cp -r src "$DIST_DIR/"
cp -r tests "$DIST_DIR/"

# Copy Gumroad-specific files
echo "🛍️ Creating Gumroad assets..."
cp GUMROAD_PRODUCT.md "$DIST_DIR/GUMROAD_PRODUCT.md"

# Create quick start guide for Gumroad
cat > "$DIST_DIR/INSTALLATION.md" << 'EOF'
# CSV to MIDI Converter - Installation Guide

## Quick Start (5 minutes)

### Step 1: Install Dependencies
```bash
npm install
```

This installs all required packages including Express, TypeScript compiler, testing framework, etc.

### Step 2: Start the Web Application
```bash
npm run web
```

Open your browser to: **http://localhost:3000**

### Step 3: Start Converting!
- Drag a CSV file onto the upload area
- Adjust options if needed
- Click "Convert to MIDI"
- Download your MIDI file

## Alternative: Command Line

Convert files from your terminal:

```bash
npm start -- samples/drums.csv output.mid
```

**With options:**
```bash
npm start -- input.csv output.mid \
  --ppq 480 \
  --time-units beats \
  --tempo-unit bpm \
  --auto-noteoff
```

## Alternative: REST API

Start the server and make API calls:

```bash
# Start server
npm run web

# In another terminal, convert a file
curl -X POST \
  -F "file=@input.csv" \
  -F "ppq=480" \
  -F "timeUnits=beats" \
  -F "tempoUnit=bpm" \
  http://localhost:3000/api/convert \
  -o output.mid
```

## System Requirements

- **Node.js**: 16.0.0 or higher
- **npm**: 7.0.0 or higher
- **Disk Space**: ~500 MB for node_modules
- **RAM**: 512 MB minimum
- **OS**: Windows, macOS, or Linux

## Verify Installation

```bash
# Run the test suite (should see 38/38 tests passing)
npm test

# Check CLI is working
npm start -- --help

# Convert a sample file
npm start -- samples/drums.csv test_output.mid
```

## CSV Format

Your input CSV should have these columns:

```
track,time,type,channel,note,velocity,program,controller,value,tempo,meta_text
0,0,set_tempo,,,,,,,500000,
0,0,track_name,,,,,,,,"Bass"
0,0,note_on,0,36,100,,,,,
0,480,note_off,0,36,0,,,,,
```

See `docs/CSV_FORMAT.md` for complete specification.

## Need Help?

1. **Check Documentation**: See `docs/` folder for detailed guides
2. **Review Examples**: See `samples/` folder for CSV examples
3. **Read Source**: All code is well-commented in `src/`
4. **Run Tests**: `npm test` to verify everything works

## Next Steps

- Check `README.md` for full documentation
- Review `docs/CSV_FORMAT.md` for CSV specification
- Read `docs/DEVELOPMENT.md` for architecture details
- Create your own CSV files and convert them!

## Troubleshooting

**"npm: command not found"**
- Install Node.js from https://nodejs.org

**"Port 3000 already in use"**
- Kill the process using port 3000 or use a different port

**"CSV parsing errors"**
- Verify your CSV format matches the specification
- Check column names and data types
- See `docs/CSV_FORMAT.md` for examples

**Tests failing**
- Run `npm run clean` then `npm install` then `npm test`
- Make sure you have Node.js 16+ installed

---

**Ready to convert?** Start with `npm run web`! 🎵
EOF

# Create a Windows batch file for easier setup
cat > "$DIST_DIR/START_HERE.bat" << 'EOF'
@echo off
title CSV to MIDI Converter - Setup
color 0A

echo.
echo ========================================
echo CSV to MIDI Converter - Setup Wizard
echo ========================================
echo.

echo Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org
    echo (Choose the LTS version)
    pause
    exit /b 1
)

echo Node.js found: 
node --version

echo.
echo Installing dependencies... (this may take a minute)
call npm install

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Choose an option:
echo 1) Start Web Application
echo 2) Convert file via CLI
echo 3) Run tests
echo 4) Exit
echo.

set /p choice="Enter your choice (1-4): "

if "%choice%"=="1" (
    echo Starting web application...
    call npm run web
) else if "%choice%"=="2" (
    echo For CLI usage, run: npm start -- input.csv output.mid
    echo.
    echo Example:
    echo   npm start -- samples/drums.csv output.mid
) else if "%choice%"=="3" (
    echo Running tests...
    call npm test
) else (
    echo Goodbye!
)

pause
EOF

# Create macOS/Linux startup script
cat > "$DIST_DIR/START_HERE.sh" << 'EOF'
#!/bin/bash

echo ""
echo "========================================"
echo "CSV to MIDI Converter - Setup Wizard"
echo "========================================"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org"
    exit 1
fi

echo "Node.js found: $(node --version)"

echo ""
echo "Installing dependencies... (this may take a minute)"
npm install

echo ""
echo "========================================"
echo "Setup Complete!"
echo "========================================"
echo ""
echo "Choose an option:"
echo "1) Start Web Application"
echo "2) Convert file via CLI"
echo "3) Run tests"
echo "4) Exit"
echo ""

read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        echo "Starting web application..."
        npm run web
        ;;
    2)
        echo "For CLI usage, run: npm start -- input.csv output.mid"
        echo ""
        echo "Example:"
        echo "  npm start -- samples/drums.csv output.mid"
        ;;
    3)
        echo "Running tests..."
        npm test
        ;;
    4)
        echo "Goodbye!"
        ;;
    *)
        echo "Invalid choice"
        ;;
esac
EOF

chmod +x "$DIST_DIR/START_HERE.sh"

# Create a comprehensive README for the package
cat > "$DIST_DIR/PACKAGE_README.md" << 'EOF'
# CSV to MIDI Converter - Professional Edition

Welcome to the CSV to MIDI Converter! This is a complete, production-ready tool for converting spreadsheet data into MIDI files.

## 🎯 What You Get

- **Web Application** - Beautiful modern interface with drag-and-drop
- **CLI Tool** - Powerful command-line interface for batch processing
- **REST API** - Integrate into your own applications
- **Complete Source Code** - All TypeScript source with full documentation
- **38 Test Cases** - Fully tested and production-ready
- **8 Documentation Files** - Complete guides and specifications

## ⚡ Quick Start (Choose One)

### Option 1: Web Application (Easiest)
```bash
npm install
npm run web
# Open http://localhost:3000 in your browser
```

### Option 2: Command Line
```bash
npm install
npm start -- input.csv output.mid
```

### Option 3: Startup Wizard
**Windows:** Double-click `START_HERE.bat`  
**Mac/Linux:** Run `./START_HERE.sh`

## 📋 CSV Format

Your input CSV needs these columns:
```
track,time,type,channel,note,velocity,program,controller,value,tempo,meta_text
```

**Example:**
```csv
track,time,type,channel,note,velocity,program,controller,value,tempo,meta_text
0,0,set_tempo,,,,,,,500000,
0,0,track_name,,,,,,,,Bass
0,0,note_on,0,36,100,,,,,
0,480,note_off,0,36,0,,,,,
0,480,note_on,0,43,100,,,,,
0,960,note_off,0,43,0,,,,,
```

See `docs/CSV_FORMAT.md` for complete specification.

## 🎵 Features

✨ **Supported MIDI Events:**
- Note On/Off
- Program Change
- Control Change
- Set Tempo
- Track Name
- Time Signature
- Key Signature

⏱️ **Time Unit Options:**
- Ticks (absolute)
- Beats (relative to PPQ)
- Milliseconds (real time)

🎚️ **Tempo Options:**
- BPM (Beats Per Minute)
- USPB (Microseconds Per Beat)

📊 **Multi-Track Support:**
- Create complex arrangements
- Multiple instruments per file
- Flexible track organization

## 📁 Package Contents

```
csv2midi-product/
├── dist/                  ← Compiled application
├── src/                   ← Source code (TypeScript)
├── tests/                 ← Test suite (38 tests)
├── samples/               ← Example CSV files
├── docs/                  ← Complete documentation
├── package.json           ← Dependencies
├── README.md              ← Full documentation
├── INSTALLATION.md        ← Installation guide
├── START_HERE.bat         ← Windows startup
├── START_HERE.sh          ← Mac/Linux startup
└── LICENSE                ← MIT License
```

## 🚀 Command Reference

### Web Server
```bash
npm run web              # Start at http://localhost:3000
```

### CLI Tool
```bash
npm start -- input.csv output.mid                    # Basic conversion
npm start -- input.csv output.mid --ppq 960         # Custom PPQ
npm start -- input.csv output.mid --time-units beats # Time in beats
npm start -- input.csv output.mid --tempo-unit bpm   # Tempo in BPM
npm start -- --help                                  # Show help
```

### Testing
```bash
npm test                 # Run all tests
npm run test:unit        # Run unit tests only
npm run test:watch       # Run tests in watch mode
```

### Code Quality
```bash
npm run lint             # Check code
npm run format           # Auto-format code
```

## 💻 System Requirements

- **Node.js**: 16.0.0+
- **npm**: 7.0.0+
- **OS**: Windows, macOS, or Linux
- **Disk**: ~500 MB for dependencies
- **RAM**: 512 MB minimum

## 📚 Documentation

| File | Purpose |
|------|---------|
| `README.md` | Complete user guide |
| `INSTALLATION.md` | Installation & setup |
| `docs/CSV_FORMAT.md` | CSV format specification |
| `docs/CLI_GUIDE.md` | Command-line tool guide |
| `docs/DEVELOPMENT.md` | Architecture & development |
| `CONTRIBUTING.md` | Contributing guidelines |

## 🧪 Verify Installation

```bash
# Install dependencies
npm install

# Run all tests (should see 38/38 passing)
npm test

# Try a conversion
npm start -- samples/drums.csv test_output.mid

# Check the output
ls -la test_output.mid
```

## 🔧 Troubleshooting

**Issue:** "npm: command not found"
- **Solution:** Install Node.js from https://nodejs.org

**Issue:** "Port 3000 already in use"
- **Solution:** Kill the process or use a different port

**Issue:** "CSV parsing failed"
- **Solution:** Check your CSV matches the format in `docs/CSV_FORMAT.md`

**Issue:** "Tests are failing"
- **Solution:** Run `npm run clean && npm install && npm test`

## 📞 Support

1. Check the documentation in `docs/` folder
2. Review example files in `samples/` folder
3. Run `npm test` to verify installation
4. Check `CONTRIBUTING.md` for development info

## 📄 License

MIT License - You can use this commercially or modify it as needed!

## 🎁 What's Included

✅ Production-ready code  
✅ Full source code (TypeScript)  
✅ Comprehensive tests  
✅ Complete documentation  
✅ Example files  
✅ Multiple interfaces (Web, CLI, API)  
✅ Free updates  

## 🚀 Ready to Get Started?

1. Extract this package
2. Run `npm install` to install dependencies
3. Choose your interface:
   - Web: `npm run web`
   - CLI: `npm start -- input.csv output.mid`
   - Wizard: Run `START_HERE.bat` (Windows) or `START_HERE.sh` (Mac/Linux)

**Happy converting!** 🎵

---

**Questions?** See the full documentation in the `docs/` folder.
EOF

# Create an archive
echo ""
echo "📦 Creating archive..."
if command -v tar &> /dev/null; then
    tar -czf "csv2midi-product.tar.gz" "$DIST_DIR"
    echo "✅ Created: csv2midi-product.tar.gz"
fi

if command -v zip &> /dev/null; then
    zip -r "csv2midi-product.zip" "$DIST_DIR" > /dev/null
    echo "✅ Created: csv2midi-product.zip"
fi

echo ""
echo "✅ Distribution package ready!"
echo ""
echo "📦 Contents:"
echo "  - $DIST_DIR/ (full directory)"
echo "  - csv2midi-product.tar.gz (compressed)"
echo "  - csv2midi-product.zip (Windows-friendly)"
echo ""
echo "Ready to upload to Gumroad!"
echo ""
