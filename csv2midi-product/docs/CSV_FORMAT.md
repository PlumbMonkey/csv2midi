# CSV → MIDI Converter - CSV Format Specification

## Overview

The CSV format defines a human-readable event list with absolute timing (in ticks). Each row represents a single MIDI event, and events are grouped into tracks for conversion to a standard `.mid` file.

## CSV Structure

### Header Row
```
track,time,type,channel,note,velocity,program,controller,value,tempo,meta_text
```

### Column Definitions

| Column | Type | Required | Range | Description |
|--------|------|----------|-------|-------------|
| **track** | integer | Yes | ≥0 | Track index (0-based). All events with the same track number will be placed in a single MIDI track. |
| **time** | number | Yes | ≥0 | Absolute time in the selected unit (default: ticks). Used to sequence events; automatically converted to delta times during conversion. |
| **type** | string | Yes | See below | Event type: `note_on`, `note_off`, `program_change`, `control_change`, `set_tempo`, `track_name`, `time_signature`, `key_signature`. |
| **channel** | integer | No | 0–15 | MIDI channel. Default: 0. Use 9 for percussion/drums. |
| **note** | integer | No | 0–127 | MIDI note number. Required for `note_on` and `note_off` events. |
| **velocity** | integer | No | 0–127 | Note velocity. Required for `note_on` and `note_off` events. |
| **program** | integer | No | 0–127 | Program/instrument number. Required for `program_change` events. |
| **controller** | integer | No | 0–127 | CC controller number. Required for `control_change` events. |
| **value** | integer | No | 0–127 | Controller value or generic value. Required for `control_change` events. |
| **tempo** | integer | No | >0 | Tempo in microseconds per beat (USPB) or BPM (if `--tempo-unit=bpm`). For `set_tempo` events. |
| **meta_text** | string | No | Any text | Metadata text (e.g., track name for `track_name` events). |

## Event Types

### `note_on`
Turns on a note.
- Required: `note`, `velocity`, (implicitly `channel`)
- Example: `0,480,note_on,0,60,100`

### `note_off`
Turns off a note.
- Required: `note`, `velocity`, (implicitly `channel`)
- Example: `0,960,note_off,0,60,0`

### `program_change`
Changes the instrument/program on a channel.
- Required: `program`, (implicitly `channel`)
- Example: `0,0,program_change,0,33` (select electric bass)

### `control_change` (CC)
Sends a MIDI control change message (e.g., volume, expression, sustain pedal).
- Required: `controller`, `value`, (implicitly `channel`)
- Example: `0,0,control_change,0,7,100` (set channel volume to 100)

### `set_tempo`
Sets the tempo at a specific point. Creates a MIDI Set Tempo meta event.
- Required: `tempo` (in USPB or BPM depending on `--tempo-unit`)
- Example: `0,0,set_tempo, , , , , , ,500000,` (120 BPM)

### `track_name`
Sets the name of a track. Should appear at time 0.
- Required: `meta_text`
- Example: `0,0,track_name, , , , , , ,,"Drums"`

### `time_signature`
Sets the time signature. (Optional, experimental)
- Example: `0,0,time_signature` (defaults to 4/4)

### `key_signature`
Sets the key signature. (Optional, experimental)
- Example: `0,0,key_signature` (defaults to C major)

## Time Units

Times in the `time` column use one of three units, specified by the `--time-units` CLI flag (default: `ticks`):

- **`ticks`** (default): Absolute time in PPQ units (e.g., 480 ticks = 1 quarter note at 480 PPQ).
- **`beats`**: Absolute time in quarter-note beats (e.g., 1.0 = 1 beat, 0.5 = half beat).
- **`ms`**: Absolute time in milliseconds. Requires tempo info to convert.

## Tempo Units

The `tempo` field format depends on the `--tempo-unit` CLI flag (default: `uspb`):

- **`uspb`** (default): Microseconds per beat. 
  - Formula: USPB = 60,000,000 / BPM
  - Examples: 500,000 = 120 BPM, 333,333 = 180 BPM
- **`bpm`**: Beats per minute. 
  - Automatically converted to USPB during conversion.

## Example CSV: Simple Drum Loop

```csv
track,time,type,channel,note,velocity,program,controller,value,tempo,meta_text
0,0,set_tempo,, , , , , ,500000,
0,0,track_name,, , , , , ,,"Drums"
0,0,note_on,9,36,100,,,,,
0,480,note_off,9,36,0,,,,,
0,480,note_on,9,38,90,,,,,
0,960,note_off,9,38,0,,,,,
0,960,note_on,9,42,80,,,,,
0,1440,note_off,9,42,0,,,,,
```

This creates:
- One track (track 0)
- Tempo set to 500,000 USPB (120 BPM)
- Track named "Drums"
- Kick drum (note 36) at time 0
- Snare (note 38) at time 480 (half a beat later)
- Closed hihat (note 42) at time 960

## Example CSV: Multi-Track Song

```csv
track,time,type,channel,note,velocity,program,controller,value,tempo,meta_text
0,0,set_tempo,, , , , , ,500000,
0,0,track_name,, , , , , ,,"Drums"
0,0,note_on,9,36,100,,,,,
0,480,note_off,9,36,0,,,,,
1,0,track_name,, , , , , ,,"Bass"
1,0,program_change,0,, ,33,,,,
1,0,note_on,0,36,80,,,,,
1,960,note_off,0,36,0,,,,,
2,0,track_name,, , , , , ,,"Melody"
2,0,program_change,0,, ,0,,,,
2,0,note_on,0,60,100,,,,,
2,480,note_off,0,60,0,,,,,
```

This creates:
- Track 0: Drums on percussion channel (9)
- Track 1: Bass (program 33) on channel 0
- Track 2: Melody (program 0, Grand Piano) on channel 0

## Best Practices

1. **Always set track names**: Use a `track_name` event at time 0 for each track for clarity.
2. **Set tempo early**: Place `set_tempo` at the beginning (time 0) of your arrangement.
3. **Use appropriate channels**: Channel 9 (drum channel) for percussion/drums; channels 0–8, 10–15 for melodic instruments.
4. **Pair note_on and note_off**: Every `note_on` should have a matching `note_off` at the correct time.
5. **Keep timing absolute**: The converter automatically computes delta times; use absolute times for clarity.
6. **Test in your DAW**: After conversion, import the `.mid` file and verify events appear correctly.

## Common MIDI Program Numbers (GM1 Standard)

| Program | Instrument |
|---------|-----------|
| 0 | Acoustic Grand Piano |
| 24 | Acoustic Guitar |
| 32 | Acoustic Bass |
| 33 | Electric Bass |
| 41 | Violin |
| 48 | String Ensemble 1 |
| 64 | Saxophone |

See [General MIDI](https://en.wikipedia.org/wiki/General_MIDI) for the full instrument list.

## MIDI Drum Map (GM1 Standard)

Channel 9 (10 in 1-based) is reserved for drums/percussion. Common note numbers:

| Note | Name |
|------|------|
| 36 | Bass Drum 1 (Kick) |
| 38 | Acoustic Snare |
| 42 | Closed Hi-Hat |
| 46 | Open Hi-Hat |
| 49 | Crash Cymbal 1 |
| 51 | Ride Cymbal |

## Troubleshooting

- **Track not appearing in DAW**: Check that `track_name` is set and the track has at least one note event.
- **Tempo not changing**: Verify `set_tempo` is placed at time 0 with a valid USPB value.
- **Wrong instrument**: Double-check `program_change` event and MIDI program number.
- **Events out of order**: Verify times are sorted in ascending order per track.
