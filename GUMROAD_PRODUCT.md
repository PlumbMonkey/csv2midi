# CSV to MIDI Converter - Gumroad Product

## Product Title
**CSV → MIDI Converter | Professional Music Conversion Tool**

## Product Description

Convert spreadsheet data into professional MIDI files instantly! The CSV to MIDI Converter by PlumbMonkey is a powerful, feature-rich tool designed for musicians, producers, and music developers who want to turn raw data into playable music.

### Key Features:
✨ **Fast & Reliable** - Convert CSV files to MIDI in seconds  
🎯 **Multi-Track Support** - Create complex arrangements with multiple instrument tracks  
⚙️ **Flexible Configuration** - Customize PPQ, time units, and tempo settings  
🌐 **Web-Based Interface** - Beautiful neon-themed UI with drag-and-drop upload  
💻 **CLI Tool** - Advanced users can use the command-line interface  
🔌 **REST API** - Integrate into your own applications  
📊 **8 MIDI Event Types** - Note on/off, program change, control change, and more  
⏱️ **Multiple Time Units** - Support for ticks, beats, and milliseconds  
🎚️ **Tempo Control** - BPM or USPB tempo specification  

### Perfect For:
- Music producers creating arrangements from data
- Educational music technology projects
- Procedural music generation
- MIDI file batch processing
- Music game development
- Algorithmic composition

## What's Included:

✅ **Web Application** - Modern drag-and-drop interface  
✅ **Command-Line Tool** - Professional CLI with full option support  
✅ **REST API** - Programmatic access for integration  
✅ **Documentation** - Complete guides and CSV format specification  
✅ **Sample Files** - Example CSV files to get started  
✅ **Source Code** - Full TypeScript source (MIT Licensed)  

## Technical Specifications:

- **Language:** TypeScript (strict mode)
- **Runtime:** Node.js 16+
- **Format:** SMF Format 1 (Standard MIDI File, multi-track)
- **MIDI Events:** 8 types (Note On, Note Off, Program Change, Control Change, Set Tempo, Track Name, Time Signature, Key Signature)
- **Time Units:** Ticks, Beats, Milliseconds
- **Tempo Units:** BPM, USPB (Microseconds Per Beat)
- **Web Framework:** Express.js 4.18

## Quick Start:

### Option 1: Web Interface
1. Download and extract the package
2. Run `npm install`
3. Run `npm run web`
4. Open http://localhost:3000 in your browser
5. Drag your CSV file to convert

### Option 2: Command Line
```bash
npm start -- input.csv output.mid --ppq 480 --time-units beats --tempo-unit bpm
```

### Option 3: REST API
```bash
curl -X POST -F "file=@input.csv" http://localhost:3000/api/convert -o output.mid
```

## CSV Format:

Your CSV should include these columns:
```
track,time,type,channel,note,velocity,program,controller,value,tempo,meta_text
```

**Supported Event Types:**
- `note_on` - Start a note
- `note_off` - End a note
- `program_change` - Switch instrument
- `control_change` - MIDI controller message
- `set_tempo` - Change tempo
- `track_name` - Set track name
- `time_signature` - Set time signature
- `key_signature` - Set key signature

## Requirements:

- **Node.js** 16 or higher
- **npm** 7 or higher
- **Disk Space:** ~500 MB for dependencies

## License:

MIT License - Use commercially or modify as needed!

## Support:

- Full documentation included
- Example CSV files provided
- Clean, well-commented source code
- All 38 unit and integration tests included

## Bonus:

🎁 **Free Updates** - Get new features and improvements as they're released  
📖 **Complete Documentation** - 8 comprehensive guides  
🧪 **38 Test Cases** - Fully tested and production-ready  
🛠️ **Professional Code** - Enterprise-grade TypeScript with strict type safety

---

**Ready to turn your data into music?**

Get the CSV to MIDI Converter and start creating today!
