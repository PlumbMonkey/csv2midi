/**
 * Unit tests for MIDI Converter utilities
 */

import { MIDIConverter } from '../../src/core/midi-converter';

describe('MIDIConverter', () => {
  describe('bpmToUspb', () => {
    it('should convert BPM to USPB correctly', () => {
      const uspb = MIDIConverter.bpmToUspb(120);
      expect(uspb).toBe(500000); // 60,000,000 / 120 = 500,000
    });

    it('should convert 60 BPM correctly', () => {
      const uspb = MIDIConverter.bpmToUspb(60);
      expect(uspb).toBe(1000000); // 60,000,000 / 60 = 1,000,000
    });

    it('should convert 180 BPM correctly', () => {
      const uspb = MIDIConverter.bpmToUspb(180);
      expect(uspb).toBe(333333); // ~333,333
    });
  });

  describe('uspbToBpm', () => {
    it('should convert USPB to BPM correctly', () => {
      const bpm = MIDIConverter.uspbToBpm(500000);
      expect(bpm).toBe(120); // 60,000,000 / 500,000 = 120
    });

    it('should convert 1,000,000 USPB to BPM correctly', () => {
      const bpm = MIDIConverter.uspbToBpm(1000000);
      expect(bpm).toBe(60);
    });
  });

  describe('beatsToTicks', () => {
    it('should convert beats to ticks at 480 PPQ', () => {
      const ticks = MIDIConverter.beatsToTicks(1, 480);
      expect(ticks).toBe(480);
    });

    it('should convert 0.5 beats to 240 ticks at 480 PPQ', () => {
      const ticks = MIDIConverter.beatsToTicks(0.5, 480);
      expect(ticks).toBe(240);
    });

    it('should convert beats to ticks at 960 PPQ', () => {
      const ticks = MIDIConverter.beatsToTicks(1, 960);
      expect(ticks).toBe(960);
    });
  });

  describe('msToTicks', () => {
    it('should convert milliseconds to ticks', () => {
      // 500,000 USPB = 120 BPM = 500 ms per beat at 480 PPQ
      const ticks = MIDIConverter.msToTicks(500, 500000, 480);
      expect(ticks).toBe(480); // 1 beat at 480 PPQ
    });

    it('should convert 250 ms to half beat at 120 BPM', () => {
      const ticks = MIDIConverter.msToTicks(250, 500000, 480);
      expect(ticks).toBe(240);
    });
  });

  describe('normalizeTime', () => {
    it('should keep ticks unchanged', () => {
      const normalized = MIDIConverter.normalizeTime(480, 'ticks', 480, 500000);
      expect(normalized).toBe(480);
    });

    it('should convert beats to ticks', () => {
      const normalized = MIDIConverter.normalizeTime(1, 'beats', 480, 500000);
      expect(normalized).toBe(480);
    });

    it('should convert milliseconds to ticks', () => {
      const normalized = MIDIConverter.normalizeTime(500, 'ms', 480, 500000);
      expect(normalized).toBe(480);
    });
  });

  describe('groupEventsByTrack', () => {
    it('should group events by track', () => {
      const events = [
        { track: 0, time: 0, type: 'note_on' as const, channel: 0, note: 60, velocity: 100 },
        { track: 0, time: 480, type: 'note_off' as const, channel: 0, note: 60, velocity: 0 },
        { track: 1, time: 0, type: 'note_on' as const, channel: 0, note: 48, velocity: 100 },
      ];

      const tracks = MIDIConverter.groupEventsByTrack(events);

      expect(tracks).toHaveLength(2);
      expect(tracks[0].trackIndex).toBe(0);
      expect(tracks[0].events).toHaveLength(2);
      expect(tracks[1].trackIndex).toBe(1);
      expect(tracks[1].events).toHaveLength(1);
    });

    it('should sort events by time within each track', () => {
      const events = [
        { track: 0, time: 480, type: 'note_off' as const, channel: 0, note: 60, velocity: 0 },
        { track: 0, time: 0, type: 'note_on' as const, channel: 0, note: 60, velocity: 100 },
      ];

      const tracks = MIDIConverter.groupEventsByTrack(events);

      expect(tracks[0].events[0].time).toBe(0);
      expect(tracks[0].events[1].time).toBe(480);
    });

    it('should extract track_name if present', () => {
      const events = [
        { track: 0, time: 0, type: 'track_name' as const, meta_text: 'Drums' },
        { track: 0, time: 0, type: 'note_on' as const, channel: 9, note: 36, velocity: 100 },
      ];

      const tracks = MIDIConverter.groupEventsByTrack(events);

      expect(tracks[0].name).toBe('Drums');
    });
  });

  describe('absoluteToDeltaTimes', () => {
    it('should convert absolute times to delta times', () => {
      const tracks = [
        {
          trackIndex: 0,
          events: [
            { track: 0, time: 0, type: 'note_on' as const, channel: 0, note: 60, velocity: 100 },
            { track: 0, time: 480, type: 'note_off' as const, channel: 0, note: 60, velocity: 0 },
            { track: 0, time: 960, type: 'note_on' as const, channel: 0, note: 64, velocity: 100 },
          ] as any,
        },
      ];

      const deltaTracks = MIDIConverter.absoluteToDeltaTimes(tracks);

      expect(deltaTracks[0].events[0].delta_time).toBe(0);
      expect(deltaTracks[0].events[1].delta_time).toBe(480);
      expect(deltaTracks[0].events[2].delta_time).toBe(480);
    });
  });
});
