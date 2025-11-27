# 📑 CSV → MIDI Converter – Project Index

## Quick Navigation

### 🚀 Getting Started
- **[README.md](./README.md)** — Project overview, features, quick start
- **[PROJECT_SETUP_SUMMARY.md](./PROJECT_SETUP_SUMMARY.md)** — Detailed setup summary

### 📚 Documentation
- **[docs/CSV_FORMAT.md](./docs/CSV_FORMAT.md)** — CSV specification & format
- **[docs/CLI_GUIDE.md](./docs/CLI_GUIDE.md)** — Command-line usage guide
- **[docs/DEVELOPMENT.md](./docs/DEVELOPMENT.md)** — Developer guide & architecture
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** — How to contribute

### 💻 Source Code
```
src/
├── core/              # Core conversion logic
│   ├── types.ts       # Type definitions
│   ├── csv-parser.ts  # CSV parsing & validation
│   ├── midi-converter.ts  # MIDI generation
│   ├── converter.ts   # Main orchestrator
│   └── index.ts       # Exports
├── cli/               # Command-line tool
│   └── cli.ts
└── web/               # Web server & UI
    ├── server.ts      # Express server
    └── public/
        └── index.html # Web interface
```

### 🧪 Tests
```
tests/
├── unit/              # Unit tests
│   ├── csv-parser.test.ts
│   └── midi-converter.test.ts
└── integration/       # Integration tests
    └── converter.test.ts
```

### 📦 Sample Files
```
samples/
├── drums.csv          # Drum pattern example
├── bass.csv           # Bass line example
├── melody.csv         # Melody example
└── full_song.csv      # Complete song example
```

### ⚙️ Configuration
- **package.json** — Dependencies & npm scripts
- **tsconfig.json** — TypeScript settings
- **jest.config.js** — Test configuration
- **.eslintrc.json** — Linting rules
- **.prettierrc** — Code formatting
- **LICENSE** — MIT License

---

## Core Concepts

### CSV Format
The tool converts CSV with columns:
```
track,time,type,channel,note,velocity,program,controller,value,tempo,meta_text
```

See **[CSV_FORMAT.md](./docs/CSV_FORMAT.md)** for complete specification.

### Event Types Supported
- `note_on` / `note_off` — Note events
- `program_change` — Instrument selection
- `control_change` — MIDI CC events
- `set_tempo` — Tempo changes
- `track_name` — Track naming
- `time_signature` / `key_signature` — Meta events

### Key Classes
- **Converter** — Main orchestrator (`src/core/converter.ts`)
- **CSVParser** — CSV parsing (`src/core/csv-parser.ts`)
- **CSVValidator** — Input validation (`src/core/csv-parser.ts`)
- **MIDIConverter** — MIDI math utilities (`src/core/midi-converter.ts`)
- **MIDIFileWriter** — MIDI generation (`src/core/midi-converter.ts`)

---

## Common Tasks

### Install Dependencies
```bash
npm install
```

### Build Project
```bash
npm run build
```

### Run Tests
```bash
npm test                  # All tests
npm run test:unit         # Unit tests only
npm run test:integration  # Integration tests
npm run test:watch        # Watch mode
```

### Use CLI
```bash
npm start -- input.csv output.mid [options]
```

### Start Web Server
```bash
npm run web
# Visit http://localhost:3000
```

### Lint & Format
```bash
npm run lint              # Check code
npm run format            # Auto-format
```

---

## Important Files

### Entry Points
- **CLI**: `src/cli/cli.ts` (executable)
- **Web**: `src/web/server.ts` (Express server)
- **Core**: `src/core/converter.ts` (main logic)

### Main Classes
- **Converter** — `src/core/converter.ts` (lines ~30-100)
- **CSVValidator** — `src/core/csv-parser.ts` (lines ~50-150)
- **MIDIFileWriter** — `src/core/midi-converter.ts` (lines ~190-280)

### Tests
- **CSV Tests** — `tests/unit/csv-parser.test.ts`
- **MIDI Tests** — `tests/unit/midi-converter.test.ts`
- **Integration** — `tests/integration/converter.test.ts`

---

## Data Flow

```
CSV Input (string)
    ↓
CSVParser.parse()
    ↓ CSVRow[]
CSVValidator.validate()
    ↓ ValidationError[]
(if valid) MIDIConverter.normalizeTime()
    ↓ Ticks
MIDIConverter.groupEventsByTrack()
    ↓ TrackData[]
MIDIConverter.absoluteToDeltaTimes()
    ↓ Delta times
MIDIFileWriter.generate()
    ↓ Buffer
Output: .mid file
```

---

## API Examples

### Using Converter Class
```typescript
const { Converter } = require('csv2midi');

const converter = new Converter({
  ppq: 480,
  timeUnits: 'beats',
  tempoUnit: 'bpm',
});

const result = await converter.convert(csvString);
if (result.success) {
  fs.writeFileSync('output.mid', result.midiBytes);
}
```

### CLI Usage
```bash
csv2midi input.csv output.mid --ppq 480 --time-units beats --tempo-unit bpm
```

### Web API
```bash
curl -X POST http://localhost:3000/api/convert \
  -F "file=@input.csv" \
  -F "ppq=480" \
  -F "timeUnits=beats" \
  -F "tempoUnit=bpm" \
  > output.mid
```

---

## Project Statistics

| Metric | Count |
|--------|-------|
| TypeScript files | 8 |
| Test files | 3 |
| Documentation files | 5 |
| Sample CSV files | 4 |
| Configuration files | 5 |
| Lines of code | ~3,500+ |
| Test cases | 18+ |

---

## Features Matrix

| Feature | Status | Location |
|---------|--------|----------|
| CSV parsing | ✅ | `src/core/csv-parser.ts` |
| Validation | ✅ | `src/core/csv-parser.ts` |
| MIDI generation | ✅ | `src/core/midi-converter.ts` |
| Multi-track | ✅ | `src/core/midi-converter.ts` |
| CLI tool | ✅ | `src/cli/cli.ts` |
| Web UI | ✅ | `src/web/server.ts` + `index.html` |
| REST API | ✅ | `src/web/server.ts` |
| Unit tests | ✅ | `tests/unit/` |
| Integration tests | ✅ | `tests/integration/` |
| Documentation | ✅ | `docs/` |

---

## Next Steps

1. **Install**: `npm install`
2. **Build**: `npm run build`
3. **Test**: `npm test`
4. **Try**: `npm start -- samples/drums.csv test.mid`
5. **Explore**: `npm run web` (http://localhost:3000)
6. **Read**: See [README.md](./README.md) and [docs/](./docs/) for details

---

## Resources

- **MIDI Spec**: https://en.wikipedia.org/wiki/MIDI
- **SMF Format**: http://www.music.mcgill.ca/~ich/classes/mumt306/StandardMIDIfileformat.html
- **General MIDI**: https://en.wikipedia.org/wiki/General_MIDI
- **csv-parse**: https://csv.js.org/parse/
- **Express**: https://expressjs.com/

---

## Support

- 📖 See [docs/](./docs/) for detailed documentation
- 🐛 Report bugs in [Issues](../../issues)
- 💡 Share ideas in [Discussions](../../discussions)
- 👥 Contribute via [CONTRIBUTING.md](./CONTRIBUTING.md)

---

**Happy coding! 🎵**
