/**
 * Integration test: Full conversion pipeline
 */

import { Converter } from '../../src/core/converter';

describe('Converter Integration', () => {
  it('should convert a simple CSV to MIDI', async () => {
    const csv = `track,time,type,channel,note,velocity,program,controller,value,tempo,meta_text
0,0,set_tempo,, , , , , ,500000,
0,0,track_name,, , , , , ,,"Drums"
0,0,note_on,9,36,100,,,,,
0,480,note_off,9,36,0,,,,,`;

    const converter = new Converter({ ppq: 480 });
    const result = await converter.convert(csv);

    expect(result.success).toBe(true);
    expect(result.midiBytes).toBeDefined();
    expect(result.trackCount).toBe(1);
    expect(result.eventCount).toBe(4);
  });

  it('should convert multi-track CSV', async () => {
    const csv = `track,time,type,channel,note,velocity,program,controller,value,tempo,meta_text
0,0,track_name,, , , , , ,,"Track 0"
0,0,note_on,0,60,100,,,,,
0,480,note_off,0,60,0,,,,,
1,0,track_name,, , , , , ,,"Track 1"
1,0,note_on,0,48,100,,,,,
1,480,note_off,0,48,0,,,,,`;

    const converter = new Converter({ ppq: 480 });
    const result = await converter.convert(csv);

    expect(result.success).toBe(true);
    expect(result.trackCount).toBe(2);
    expect(result.eventCount).toBe(6);
  });

  it('should handle beats time units', async () => {
    const csv = `track,time,type,channel,note,velocity,program,controller,value,tempo,meta_text
0,0,set_tempo,, , , , , ,500000,
0,0,note_on,0,60,100,,,,,
0,1,note_off,0,60,0,,,,,`;

    const converter = new Converter({ 
      ppq: 480, 
      timeUnits: 'beats' 
    });
    const result = await converter.convert(csv);

    expect(result.success).toBe(true);
    expect(result.midiBytes).toBeDefined();
  });

  it('should handle BPM tempo units', async () => {
    const csv = `track,time,type,channel,note,velocity,program,controller,value,tempo,meta_text
0,0,set_tempo,, , , , , ,120,
0,0,note_on,0,60,100,,,,,
0,480,note_off,0,60,0,,,,,`;

    const converter = new Converter({ 
      ppq: 480, 
      tempoUnit: 'bpm' 
    });
    const result = await converter.convert(csv);

    expect(result.success).toBe(true);
  });

  it('should detect validation errors', async () => {
    const csv = `track,time,type,channel,note,velocity,program,controller,value,tempo,meta_text
0,0,note_on,0,128,100,,,,,`;

    const converter = new Converter({ ppq: 480 });
    const result = await converter.convert(csv);

    expect(result.success).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('should generate valid MIDI file header', async () => {
    const csv = `track,time,type,channel,note,velocity,program,controller,value,tempo,meta_text
0,0,note_on,0,60,100,,,,,
0,480,note_off,0,60,0,,,,,`;

    const converter = new Converter({ ppq: 480 });
    const result = await converter.convert(csv);

    expect(result.success).toBe(true);
    if (result.midiBytes) {
      // Check MIDI header: "MThd" + length
      expect(result.midiBytes.toString('ascii', 0, 4)).toBe('MThd');
      // Check track header: "MTrk"
      expect(result.midiBytes.toString('ascii', 14, 18)).toBe('MTrk');
    }
  });
});
