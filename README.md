# CSV → MIDI Converter – Project Beyond MIDI

A robust, easy-to-use tool to convert human-readable CSV files into standards-compliant MIDI files. Build your music programmatically and import seamlessly into FL Studio, Ableton Live, Logic Pro, and other DAWs.

## ✨ Features

- **Multi-track support**: Create complex arrangements with separate instrument tracks
- **Flexible timing**: Specify time in ticks, beats, or milliseconds
- **Full event support**: Note on/off, program change, control change, set tempo, track names
- **Validation**: Comprehensive schema validation with helpful error messages
- **CLI & Web UI**: Command-line tool for automation + simple web interface for quick conversions
- **Standards-compliant**: Produces valid SMF (Standard MIDI File) format
- **DAW-tested**: Import verified in FL Studio, Ableton Live, Logic Pro

## 🚀 Quick Start

### Option 1: From GitHub (Free & Open Source)

```bash
git clone https://github.com/PlumbMonkey/csv2midi.git
cd csv2midi
npm install
npm run web
```

Open **http://localhost:3000** to start converting!

See **[RUN_FROM_GITHUB.md](./RUN_FROM_GITHUB.md)** for detailed setup options.

### Option 2: CLI

```bash
npm start -- input.csv output.mid

# With options
npm start -- input.csv output.mid --ppq 480 --time-units beats --tempo-unit bpm
```

### Option 3: Programmatic (Node.js)

```javascript
const { Converter } = require('./dist/core');

const converter = new Converter({
  ppq: 480,
  timeUnits: 'beats',
  tempoUnit: 'bpm',
});

converter.convertFile('input.csv', 'output.mid').then(result => {
  console.log(result.success ? '✓ Done!' : '✗ Failed');
});
```

## 📋 CSV Format

Simple, human-readable format:

```csv
track,time,type,channel,note,velocity,program,controller,value,tempo,meta_text
0,0,set_tempo,, , , , , ,500000,
0,0,track_name,, , , , , ,,"Drums"
0,0,note_on,9,36,100,,,,,
0,480,note_off,9,36,0,,,,,
0,480,note_on,9,38,90,,,,,
0,960,note_off,9,38,0,,,,,
```

**Full specification**: [CSV_FORMAT.md](./docs/CSV_FORMAT.md)

## 📚 Documentation

- [**CSV Format Specification**](./docs/CSV_FORMAT.md) — Complete column reference, event types, examples
- [**CLI Guide**](./docs/CLI_GUIDE.md) — Command options, workflows, troubleshooting
- [**Examples**](./samples/) — Sample CSV files (drums, bass, melody, full songs)

## 🛠️ Installation

### From npm (when published)

```bash
npm install -g csv2midi
```

### From source

```bash
git clone <repo-url>
cd csv2midi
npm install
npm run build
npm start -- input.csv output.mid
```

## 📖 Usage

### CLI

```bash
# Basic
csv2midi input.csv output.mid

# With options
csv2midi input.csv output.mid \
  --ppq 480 \
  --time-units beats \
  --tempo-unit bpm \
  --auto-noteoff

# Get help
csv2midi --help
```

See [CLI_GUIDE.md](./docs/CLI_GUIDE.md) for full options and examples.

### Web UI

1. Start the server:
   ```bash
   npm run web
   ```

2. Open http://localhost:3000

3. Upload a CSV or paste content

4. Set options (PPQ, tempo unit)

5. Click "Convert"

6. Download the `.mid` file

### Programmatic API

```javascript
const { Converter } = require('csv2midi');

const converter = new Converter({
  ppq: 480,
  timeUnits: 'beats',
  tempoUnit: 'bpm',
  autoNoteOff: true,
});

// Convert from string
const result = await converter.convert(csvString);

if (result.success) {
  console.log(`Converted ${result.eventCount} events to ${result.trackCount} tracks`);
  fs.writeFileSync('output.mid', result.midiBytes);
} else {
  console.error('Errors:', result.errors);
}
```

## 🎵 Example: Simple Drum Loop

**Input: `drums.csv`**
```csv
track,time,type,channel,note,velocity,program,controller,value,tempo,meta_text
0,0,set_tempo,, , , , , ,500000,
0,0,track_name,, , , , , ,,"Drums"
0,0,note_on,9,36,100,,,,,
0,480,note_off,9,36,0,,,,,
0,480,note_on,9,38,90,,,,,
0,960,note_off,9,38,0,,,,,
```

**Command:**
```bash
csv2midi drums.csv output.mid
```

**Result:** A valid `.mid` file with a two-bar drum pattern that imports cleanly into any DAW.

## 🧪 Testing

```bash
# Run all tests
npm test

# Unit tests only
npm run test:unit

# Integration tests
npm run test:integration

# Watch mode
npm run test:watch
```

## 🏗️ Project Structure

```
csv2midi/
├── src/
│   ├── core/              # Core conversion logic
│   │   ├── types.ts       # Type definitions
│   │   ├── csv-parser.ts  # CSV parsing & validation
│   │   ├── midi-converter.ts  # MIDI generation
│   │   ├── converter.ts   # Main orchestrator
│   │   └── index.ts       # Module exports
│   ├── cli/
│   │   └── cli.ts         # CLI tool
│   └── web/
│       ├── server.ts      # Express server
│       ├── api/           # REST API routes
│       └── public/        # Web UI static files
├── tests/
│   ├── unit/              # Unit tests
│   └── integration/       # Integration tests
├── samples/               # Example CSV files
├── docs/                  # Documentation
└── package.json
```

## 🎯 Features & Roadmap

### MVP (Current)

- ✅ Multi-track MIDI generation
- ✅ Event types: note_on/off, program_change, control_change, set_tempo, track_name
- ✅ Channel support (0–15, including percussion on channel 9)
- ✅ CLI tool with validation
- ✅ Web UI (upload & download)
- ✅ CSV specification & samples
- ✅ Unit & integration tests

### Roadmap (Post-MVP)

- ⏳ In-browser converter (client-side, no server upload)
- ⏳ Live preview/playback (SoundFont + Tone.js)
- ⏳ Multiple tempo changes (tempo maps)
- ⏳ Time signatures & key signatures
- ⏳ MIDI → CSV round-trip conversion
- ⏳ Batch conversion & history
- ⏳ REST API for programmatic access
- ⏳ User presets (DAW templates)

## 🐛 Troubleshooting

### Track not appearing
- Ensure `track_name` event exists at time 0
- Check that track has at least one note event

### Wrong tempo
- Verify `set_tempo` at time 0
- Check tempo unit: USPB (default) or BPM

### Events out of order
- Ensure `time` values are sorted in ascending order per track
- Double-check time unit (`ticks`, `beats`, or `ms`)

### MIDI validation errors
- Check all `note` values are 0–127
- Verify `velocity` is 0–127
- Ensure `channel` is 0–15

For more help, see [CLI_GUIDE.md](./docs/CLI_GUIDE.md) or check the examples in `./samples/`.

## 💡 Use Cases

1. **Algorithmic composition**: Generate MIDI from algorithmic output (Python, etc.)
2. **Spreadsheet workflows**: Create MIDI from exported data in Excel/Sheets
3. **DAW automation**: Build complex arrangements programmatically
4. **Music bots**: Generate backing tracks on Discord or web apps
5. **Data-driven music**: Visualize music as structured data

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/awesome-feature`)
3. Commit changes (`git commit -m 'Add awesome feature'`)
4. Push (`git push origin feature/awesome-feature`)
5. Open a Pull Request

Areas for contribution:
- DAW import testing & documentation
- Advanced MIDI features (lyrics, key signatures)
- Web UI enhancements
- Performance optimization
- Example templates

## 📄 License

MIT License — see [LICENSE](./LICENSE) for details.

## 👥 Support & Community

- **Issues**: Report bugs on GitHub Issues
- **Discussions**: Share ideas and ask questions
- **Twitter**: [@csv2midi](https://twitter.com/csv2midi) (coming soon)
- **Discord**: Join our community server (link TBD)

## 📖 Background: Project Beyond MIDI

This project is part of **Beyond MIDI**, an initiative to make MIDI generation and manipulation more accessible to musicians, producers, and developers. Our goal: bridge the gap between human creativity and machine precision.

---

**Ready to make music programmatically?** Get started with [CSV_FORMAT.md](./docs/CSV_FORMAT.md) or jump into the [CLI guide](./docs/CLI_GUIDE.md).
