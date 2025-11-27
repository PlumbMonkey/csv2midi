# CSV → MIDI Converter - CLI Usage Guide

## Installation

```bash
npm install -g csv2midi
```

Or use locally after cloning:

```bash
npm install
npm run build
npm start -- <input.csv> <output.mid> [options]
```

## Quick Start

Convert a CSV file to MIDI:

```bash
csv2midi music.csv output.mid
```

## Full Usage

```
csv2midi <input.csv> <output.mid> [options]

Options:
  --ppq <number>                    Pulses per quarter note (default: 480)
  --time-units <ticks|beats|ms>     Time unit (default: ticks)
  --tempo-unit <bpm|uspb>           Tempo unit (default: uspb)
  --auto-noteoff                    Auto-generate note_off at track end (default: true)
  --auto-noteoff-duration <number>  Duration for auto note_off (default: 480)
  --help, -h                        Show this help
  --version, -v                     Show version
```

## Options Explained

### `--ppq <number>`
**Pulses per quarter note** — Controls the time resolution of the MIDI file.
- Common values: 120, 240, 480 (default), 960
- Higher values = finer time resolution, larger file size
- Ensure `time` values in CSV match the PPQ scale

**Example:**
```bash
csv2midi music.csv output.mid --ppq 960
```

### `--time-units <unit>`
**Time unit in the CSV `time` column** — Specifies how to interpret time values.
- `ticks` (default): Values are in PPQ units (e.g., 480 ticks = 1 beat at 480 PPQ)
- `beats`: Values are in quarter-note beats (e.g., 1.0 = 1 beat, 0.5 = half beat)
- `ms`: Values are in milliseconds (requires tempo info)

**Example — Convert beats to MIDI:**
```bash
csv2midi music.csv output.mid --time-units beats
```

**CSV with beats:**
```
track,time,type,channel,note,velocity,program,controller,value,tempo,meta_text
0,0,set_tempo,, , , , , ,500000,
0,0.5,note_on,9,36,100
0,1.0,note_off,9,36,0
```

### `--tempo-unit <unit>`
**Tempo format in the CSV `tempo` column**.
- `uspb` (default): Microseconds per beat (e.g., 500000 = 120 BPM)
- `bpm`: Beats per minute (e.g., 120 = 120 BPM)

**Example — Use BPM in CSV:**
```bash
csv2midi music.csv output.mid --tempo-unit bpm
```

**CSV with BPM:**
```
track,time,type,channel,note,velocity,program,controller,value,tempo,meta_text
0,0,set_tempo,, , , , , ,120,
```

### `--no-auto-noteoff`
By default, if a `note_on` event lacks a corresponding `note_off`, the converter auto-generates one at the end of the track. Use this flag to disable.

**Example:**
```bash
csv2midi music.csv output.mid --no-auto-noteoff
```

### `--auto-noteoff-duration <number>`
Duration (in ticks or the selected time unit) for auto-generated `note_off` events. Default: 480 (one quarter note at 480 PPQ).

**Example:**
```bash
csv2midi music.csv output.mid --auto-noteoff-duration 240
```

## Examples

### 1. Basic Conversion (Ticks, USPB)
```bash
csv2midi drums.csv output.mid
```

### 2. Convert with Beats and BPM
```bash
csv2midi music.csv output.mid --time-units beats --tempo-unit bpm
```

### 3. High Resolution (960 PPQ)
```bash
csv2midi music.csv output.mid --ppq 960 --time-units beats
```

### 4. No Auto Note-Off
```bash
csv2midi music.csv output.mid --no-auto-noteoff
```

### 5. Millisecond Timing
```bash
csv2midi music.csv output.mid --time-units ms --tempo-unit bpm
```

## Output

On success:
```
Converting drums.csv → output.mid...
✓ Conversion successful!
  Tracks: 3
  Events: 24
  Time: 45ms
  Output: output.mid
```

On error:
```
✓ Conversion failed!

Errors:
  ✗ Row 5, note: note must be an integer between 0 and 127
  ✗ Row 7, velocity: velocity must be an integer between 0 and 127
```

## Exit Codes

- **0**: Conversion successful
- **1**: Validation error or runtime error

Use for scripting:
```bash
csv2midi music.csv output.mid
if [ $? -eq 0 ]; then
  echo "Conversion succeeded"
else
  echo "Conversion failed"
fi
```

## Common Workflows

### DAW Integration (FL Studio / Ableton / Logic)

1. Prepare your CSV with correct formatting:
   ```bash
   csv2midi music.csv music.mid --ppq 480 --time-units beats --tempo-unit bpm
   ```

2. Drag the `.mid` into your DAW or use File → Import → MIDI.

3. Verify:
   - All tracks are present
   - Notes appear at correct times
   - Tempo is correct

### Batch Processing

Convert multiple CSV files:
```bash
for file in *.csv; do
  csv2midi "$file" "${file%.csv}.mid"
done
```

### Scripting

Use in a Node.js script:
```javascript
const { Converter } = require('csv2midi');

const converter = new Converter({
  ppq: 480,
  timeUnits: 'beats',
  tempoUnit: 'bpm',
});

converter.convertFile('input.csv', 'output.mid')
  .then(result => {
    if (result.success) {
      console.log(`✓ Converted ${result.eventCount} events to ${result.trackCount} tracks`);
    } else {
      console.error('Conversion failed:', result.errors);
    }
  });
```

## Tips & Tricks

1. **Test with small files first**: Create a minimal CSV with 3–5 events to verify settings.
2. **Use consistent PPQ**: Set PPQ to match your DAW's setting for best compatibility.
3. **Validate times**: Ensure all `time` values are in ascending order within each track.
4. **Check MIDI program numbers**: Verify program change values match your instruments.
5. **Watch percussion channel**: Use channel 9 for drums; general MIDI percussion is on channel 9 (10 in 1-based).

## Troubleshooting

### Error: "Input file not found"
Ensure the CSV file exists at the specified path.

### Error: "parse CSV"
Check CSV formatting: ensure headers match the spec and values are properly comma-separated.

### Error: Row X, note: "note must be an integer"
Check that note values in your CSV are integers (0–127) and not empty for `note_on`/`note_off` events.

### MIDI plays but notes are off-time
Verify `time` values are sorted in ascending order and match your PPQ setting.

### Track not appearing in DAW
Ensure the track has a `track_name` event and at least one note/event.

## Performance

Typical performance on a standard machine:
- 1,000 events: < 10ms
- 10,000 events: < 50ms
- 100,000 events: < 500ms

For very large files, consider splitting into multiple CSVs and converting separately.

## See Also

- [CSV Format Specification](./CSV_FORMAT.md)
- [Project README](../README.md)
