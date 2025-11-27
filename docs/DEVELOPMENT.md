# Project Development Guide – CSV → MIDI Converter

## Setup & Development

### Prerequisites
- Node.js 16+ and npm
- Git
- A text editor or IDE (VS Code recommended)

### Installation

```bash
# Clone and setup
git clone <repo-url> csv2midi
cd csv2midi
npm install
```

### Build & Development

```bash
# Build TypeScript
npm run build

# Development mode (watch)
npm run dev

# Start web server
npm run web

# Run tests
npm test

# Watch tests
npm run test:watch

# Lint code
npm lint

# Format code
npm format
```

## Project Architecture

### Core Module (`src/core/`)
**Responsibility:** CSV parsing, MIDI generation, and conversion logic.

- **`types.ts`** — Type definitions for events, configs, and results
- **`csv-parser.ts`** — CSV parsing and validation
- **`midi-converter.ts`** — MIDI generation (MIDIConverter, MIDIFileWriter)
- **`converter.ts`** — Main orchestrator (Converter class)
- **`index.ts`** — Module exports

### CLI (`src/cli/`)
**Responsibility:** Command-line interface.

- **`cli.ts`** — Entry point, argument parsing, file I/O

### Web UI (`src/web/`)
**Responsibility:** Web server and frontend.

- **`server.ts`** — Express server, API routes
- **`public/index.html`** — Web UI (HTML + CSS + JS)

## Key Classes & APIs

### Converter
Main class for converting CSV to MIDI.

```typescript
const converter = new Converter({
  ppq: 480,
  timeUnits: 'beats',
  tempoUnit: 'bpm',
});

const result = await converter.convert(csvString);
// result: ConversionResult
```

### CSVParser
Parses CSV string to CSVRow array.

```typescript
const rows = CSVParser.parse(csvContent);
```

### CSVValidator
Validates rows against schema.

```typescript
const errors = CSVValidator.validate(rows, 'ticks');
```

### MIDIConverter
Utility methods for MIDI math and event grouping.

```typescript
const uspb = MIDIConverter.bpmToUspb(120); // 500000
const ticks = MIDIConverter.beatsToTicks(1, 480); // 480
const tracks = MIDIConverter.groupEventsByTrack(rows);
```

### MIDIFileWriter
Generates binary MIDI file.

```typescript
const buffer = MIDIFileWriter.generate(tracks, config, defaultUspb);
```

## Data Flow

```
CSV Input
    ↓
CSVParser.parse() → CSVRow[]
    ↓
CSVValidator.validate() → ValidationError[]
    ↓ (if valid)
MIDIConverter.normalizeTime() → Normalize to ticks
    ↓
MIDIConverter.groupEventsByTrack() → TrackData[]
    ↓
MIDIConverter.absoluteToDeltaTimes() → Delta times per track
    ↓
MIDIFileWriter.generate() → Buffer (MIDI binary)
    ↓
Output: .mid file
```

## Adding Features

### Adding a New Event Type

1. **Add type to `types.ts`:**
   ```typescript
   export type MIDIEventType = '...' | 'new_event_type';
   ```

2. **Add validation to `csv-parser.ts`:**
   ```typescript
   const ALLOWED_EVENT_TYPES = [..., 'new_event_type'];
   // Add type-specific validation
   ```

3. **Add generation to `midi-converter.ts`:**
   ```typescript
   case 'new_event_type':
     eventBuffer = this.writeMetaEvent(...);
     break;
   ```

4. **Add tests in `tests/`.**

### Adding CLI Options

1. **Update `parseArgs()` in `cli.ts`**
2. **Update help text**
3. **Pass option to `Converter`**

### Adding Web UI Features

1. **Update `src/web/public/index.html`** for UI
2. **Update `src/web/server.ts`** for API handling
3. **Test with sample CSVs**

## Testing

### Unit Tests
Test individual functions and classes in isolation.

```bash
npm run test:unit
```

Location: `tests/unit/`

### Integration Tests
Test full conversion pipeline.

```bash
npm run test:integration
```

Location: `tests/integration/`

### Writing Tests

```typescript
describe('MyFunction', () => {
  it('should do something', () => {
    const result = MyFunction(input);
    expect(result).toBe(expected);
  });
});
```

## MIDI File Format Reference

CSV2MIDI generates **SMF (Standard MIDI File) Format 1** files:

- **Header (14 bytes):**
  - "MThd" identifier (4 bytes)
  - Length (4 bytes) = 6
  - Format (2 bytes) = 1 (multi-track)
  - Number of tracks (2 bytes)
  - Division/PPQ (2 bytes)

- **Track chunks (variable):**
  - "MTrk" identifier (4 bytes)
  - Length (4 bytes)
  - Track data (variable):
    - Delta times (variable-length quantities)
    - MIDI events (channel messages or meta events)
    - End-of-track meta event (0xFF 0x2F 0x00)

**Resources:**
- [MIDI Specification](https://en.wikipedia.org/wiki/MIDI)
- [SMF Format](http://www.music.mcgill.ca/~ich/classes/mumt306/StandardMIDIfileformat.html)

## Common Issues & Debugging

### CSV Parse Error
- Check column headers match spec
- Ensure no unusual line endings (use LF, not CRLF)
- Test with minimal example from samples/

### Validation Errors
- Review CSV_FORMAT.md for column requirements
- Check data types (integers vs floats)
- Verify value ranges (notes 0–127, channels 0–15)

### MIDI Import Issues in DAW
- Ensure `set_tempo` at time 0
- Verify track names are set
- Check that events have matching note_off
- Test with simpler CSV first

### Performance Slow
- For >100k events, consider splitting CSV
- Check that times are sorted
- Verify PPQ isn't unreasonably high

## Code Quality

### Linting
```bash
npm run lint
```

### Formatting
```bash
npm run format
```

### Type Checking
- TypeScript compiler checks on build
- Run `npm run build` to verify

## Documentation

### User-facing
- **[README.md](../README.md)** — Overview & quick start
- **[CSV_FORMAT.md](./CSV_FORMAT.md)** — CSV specification
- **[CLI_GUIDE.md](./CLI_GUIDE.md)** — CLI options & workflows

### Developer
- **[DEVELOPMENT.md](./DEVELOPMENT.md)** — This file
- **src/** — Code comments and JSDoc

## Release Checklist

- [ ] All tests passing (`npm test`)
- [ ] Code linted (`npm run lint`)
- [ ] Code formatted (`npm run format`)
- [ ] Build succeeds (`npm run build`)
- [ ] Documentation updated
- [ ] Version bumped in `package.json`
- [ ] Changelog updated
- [ ] Git tag created
- [ ] npm package published (if applicable)

## Performance Targets

- Parsing: O(n) where n = number of rows
- Conversion: O(n log n) due to sorting
- Target: 100k events in < 1 second

## Future Enhancements

1. **Client-side converter** — Browser-based, no server upload
2. **Advanced MIDI** — Lyrics, advanced meta, tempo maps
3. **Round-trip** — MIDI → CSV conversion
4. **Visualization** — Piano roll / timeline preview
5. **Batch processing** — Convert multiple CSVs
6. **API** — REST endpoints for programmatic access

## Resources

- [MIDI Specification](https://en.wikipedia.org/wiki/MIDI)
- [General MIDI](https://en.wikipedia.org/wiki/General_MIDI)
- [jsmidgen Library](https://github.com/dingram/jsmidgen) (if used for reference)
- [csv-parse Library](https://csv.js.org/parse/)

## Questions or Issues?

1. Check this guide and existing documentation
2. Review sample CSVs in `samples/`
3. Run existing tests for examples
4. Open an issue on GitHub
5. Check project roadmap for planned features

---

**Happy coding! 🎵**
