# Complete File Listing - CSV → MIDI Converter Project

## Root Files (Configuration & Documentation)

```
.eslintrc.json              ESLint configuration
.gitignore                  Git ignore rules
.prettierrc                 Prettier formatting config
CONTRIBUTING.md             Contribution guidelines
LICENSE                     MIT License
README.md                   Main project documentation
package.json                npm dependencies and scripts
tsconfig.json               TypeScript compiler options
jest.config.js              Jest test configuration
quickstart.sh               Quick start script
PROJECT_INDEX.md            This index file (quick navigation)
PROJECT_SETUP_SUMMARY.md    Detailed setup summary
```

## Documentation Files (`docs/`)

```
docs/
├── CSV_FORMAT.md           Complete CSV specification with examples
├── CLI_GUIDE.md            Command-line usage guide and options
└── DEVELOPMENT.md          Developer guide, architecture, roadmap
```

## Source Code (`src/`)

### Core Module (`src/core/`)
```
src/core/
├── types.ts                Type definitions for CSV, MIDI, conversion
├── csv-parser.ts           CSV parsing (CSVParser) and validation (CSVValidator)
├── midi-converter.ts       MIDI utilities (MIDIConverter) and file writing (MIDIFileWriter)
├── converter.ts            Main orchestrator (Converter class)
└── index.ts                Module exports
```

### CLI Tool (`src/cli/`)
```
src/cli/
└── cli.ts                  Command-line interface with argument parsing
```

### Web Server (`src/web/`)
```
src/web/
├── server.ts               Express server with POST /api/convert and /api/validate
└── public/
    └── index.html          Web UI (HTML/CSS/JavaScript)
```

## Tests (`tests/`)

### Unit Tests (`tests/unit/`)
```
tests/unit/
├── csv-parser.test.ts      CSV parsing and validation tests
└── midi-converter.test.ts  MIDI conversion utilities tests
```

### Integration Tests (`tests/integration/`)
```
tests/integration/
└── converter.test.ts       Full pipeline conversion tests
```

## Sample Files (`samples/`)

```
samples/
├── drums.csv               Example: simple 4-bar drum loop
├── bass.csv                Example: bass line with program change
├── melody.csv              Example: melodic line
└── full_song.csv           Example: multi-track complete song
```

---

## File Count Summary

| Category | Count |
|----------|-------|
| Configuration files | 5 (.eslintrc.json, .gitignore, .prettierrc, package.json, tsconfig.json, jest.config.js) |
| Documentation files | 7 (README.md, CONTRIBUTING.md, PROJECT_INDEX.md, PROJECT_SETUP_SUMMARY.md, CSV_FORMAT.md, CLI_GUIDE.md, DEVELOPMENT.md) |
| Source code files (TypeScript) | 8 (5 core + 1 cli + 2 web) |
| Test files | 3 (2 unit + 1 integration) |
| Sample files | 4 (CSV examples) |
| Other | 2 (LICENSE, quickstart.sh) |
| **Total** | **29 files** |

---

## Core Files by Responsibility

### CSV Processing
- `src/core/csv-parser.ts` — Parsing and validation
- `src/core/types.ts` — Type definitions

### MIDI Generation
- `src/core/midi-converter.ts` — Conversion logic and file writing
- `src/core/types.ts` — Type definitions

### Integration
- `src/core/converter.ts` — Orchestrates the pipeline

### CLI Interface
- `src/cli/cli.ts` — Command-line tool

### Web Interface
- `src/web/server.ts` — Express server and API
- `src/web/public/index.html` — Web UI

### Testing
- `tests/unit/csv-parser.test.ts` — CSV tests
- `tests/unit/midi-converter.test.ts` — MIDI math tests
- `tests/integration/converter.test.ts` — Full pipeline tests

### Documentation
- `docs/CSV_FORMAT.md` — Format specification
- `docs/CLI_GUIDE.md` — CLI usage
- `docs/DEVELOPMENT.md` — Development guide
- `README.md` — Project overview
- `CONTRIBUTING.md` — Contribution process

---

## Key Metrics

- **Total lines of code (TypeScript)**: ~3,500+
- **Test coverage**: 18+ test cases
- **Documentation pages**: 7
- **Example CSVs**: 4
- **Supported event types**: 8
- **CLI options**: 5+

---

## File Dependencies

```
main entry points:
  - src/cli/cli.ts          → src/core/converter.ts
  - src/web/server.ts       → src/core/converter.ts
  - src/core/converter.ts   → (uses)
      ├── src/core/csv-parser.ts
      ├── src/core/midi-converter.ts
      └── src/core/types.ts

core module structure:
  - src/core/index.ts       → (exports all from)
      ├── src/core/types.ts
      ├── src/core/csv-parser.ts
      ├── src/core/midi-converter.ts
      └── src/core/converter.ts
```

---

## How to Navigate the Project

1. **Start here**: [README.md](./README.md)
2. **Quick reference**: [PROJECT_INDEX.md](./PROJECT_INDEX.md)
3. **Full details**: [PROJECT_SETUP_SUMMARY.md](./PROJECT_SETUP_SUMMARY.md)
4. **CSV format**: [docs/CSV_FORMAT.md](./docs/CSV_FORMAT.md)
5. **CLI usage**: [docs/CLI_GUIDE.md](./docs/CLI_GUIDE.md)
6. **Development**: [docs/DEVELOPMENT.md](./docs/DEVELOPMENT.md)
7. **Code**: [src/](./src/)
8. **Tests**: [tests/](./tests/)
9. **Examples**: [samples/](./samples/)

---

## Getting Started Commands

```bash
# Install dependencies
npm install

# Build
npm run build

# Run CLI
npm start -- samples/drums.csv output.mid

# Start web server
npm run web
# Visit http://localhost:3000

# Run tests
npm test

# Lint
npm run lint

# Format
npm run format
```

---

**Ready to develop? See [docs/DEVELOPMENT.md](./docs/DEVELOPMENT.md) for next steps! 🎵**
