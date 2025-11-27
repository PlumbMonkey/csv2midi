/**
 * Unit tests for CSV Parser and Validator
 */

import { CSVParser, CSVValidator } from '../../src/core/csv-parser';
import { CSVRow } from '../../src/core/types';

describe('CSVParser', () => {
  describe('parse', () => {
    it('should parse valid CSV content', () => {
      const csv = `track,time,type,channel,note,velocity,program,controller,value,tempo,meta_text
0,0,note_on,0,60,100`;
      const rows = CSVParser.parse(csv);

      expect(rows).toHaveLength(1);
      expect(rows[0].track).toBe(0);
      expect(rows[0].time).toBe(0);
      expect(rows[0].type).toBe('note_on');
      expect(rows[0].note).toBe(60);
      expect(rows[0].velocity).toBe(100);
    });

    it('should handle empty columns gracefully', () => {
      const csv = `track,time,type,channel,note,velocity,program,controller,value,tempo,meta_text
0,0,set_tempo`;
      const rows = CSVParser.parse(csv);

      expect(rows).toHaveLength(1);
      expect(rows[0].track).toBe(0);
      expect(rows[0].note).toBeUndefined();
      expect(rows[0].velocity).toBeUndefined();
    });

    it('should handle multiple rows', () => {
      const csv = `track,time,type,channel,note,velocity,program,controller,value,tempo,meta_text
0,0,note_on,0,60,100
0,480,note_off,0,60,0`;
      const rows = CSVParser.parse(csv);

      expect(rows).toHaveLength(2);
      expect(rows[0].time).toBe(0);
      expect(rows[1].time).toBe(480);
    });

    it('should parse track_name events', () => {
      const csv = `track,time,type,channel,note,velocity,program,controller,value,tempo,meta_text
0,0,track_name,,,,,,,,"My Track"`;
      const rows = CSVParser.parse(csv);

      expect(rows[0].type).toBe('track_name');
      expect(rows[0].meta_text).toBe('My Track');
    });

    it('should parse float time values', () => {
      const csv = `track,time,type,channel,note,velocity,program,controller,value,tempo,meta_text
0,0.5,note_on,0,60,100`;
      const rows = CSVParser.parse(csv);

      expect(rows[0].time).toBe(0.5);
    });
  });
});

describe('CSVValidator', () => {
  describe('validate', () => {
    it('should pass valid rows', () => {
      const rows: CSVRow[] = [
        {
          track: 0,
          time: 0,
          type: 'note_on',
          channel: 0,
          note: 60,
          velocity: 100,
        },
      ];

      const errors = CSVValidator.validate(rows, 'ticks');
      expect(errors).toHaveLength(0);
    });

    it('should fail on negative track', () => {
      const rows: CSVRow[] = [
        {
          track: -1,
          time: 0,
          type: 'note_on',
          channel: 0,
          note: 60,
          velocity: 100,
        },
      ];

      const errors = CSVValidator.validate(rows, 'ticks');
      expect(errors).toHaveLength(1);
      expect(errors[0].column).toBe('track');
    });

    it('should fail on negative time', () => {
      const rows: CSVRow[] = [
        {
          track: 0,
          time: -1,
          type: 'note_on',
          channel: 0,
          note: 60,
          velocity: 100,
        },
      ];

      const errors = CSVValidator.validate(rows, 'ticks');
      expect(errors.some((e) => e.column === 'time')).toBe(true);
    });

    it('should fail on invalid event type', () => {
      const rows: CSVRow[] = [
        {
          track: 0,
          time: 0,
          type: 'invalid_type' as any,
          channel: 0,
          note: 60,
          velocity: 100,
        },
      ];

      const errors = CSVValidator.validate(rows, 'ticks');
      expect(errors.some((e) => e.column === 'type')).toBe(true);
    });

    it('should fail on out-of-range channel', () => {
      const rows: CSVRow[] = [
        {
          track: 0,
          time: 0,
          type: 'note_on',
          channel: 16, // Max is 15
          note: 60,
          velocity: 100,
        },
      ];

      const errors = CSVValidator.validate(rows, 'ticks');
      expect(errors.some((e) => e.column === 'channel')).toBe(true);
    });

    it('should fail on out-of-range note', () => {
      const rows: CSVRow[] = [
        {
          track: 0,
          time: 0,
          type: 'note_on',
          channel: 0,
          note: 128, // Max is 127
          velocity: 100,
        },
      ];

      const errors = CSVValidator.validate(rows, 'ticks');
      expect(errors.some((e) => e.column === 'note')).toBe(true);
    });

    it('should fail on missing note_on note', () => {
      const rows: CSVRow[] = [
        {
          track: 0,
          time: 0,
          type: 'note_on',
          channel: 0,
          velocity: 100,
        },
      ];

      const errors = CSVValidator.validate(rows, 'ticks');
      expect(errors.some((e) => e.column === 'note')).toBe(true);
    });

    it('should fail on missing program_change program', () => {
      const rows: CSVRow[] = [
        {
          track: 0,
          time: 0,
          type: 'program_change',
          channel: 0,
        },
      ];

      const errors = CSVValidator.validate(rows, 'ticks');
      expect(errors.some((e) => e.column === 'program')).toBe(true);
    });

    it('should pass for valid set_tempo event', () => {
      const rows: CSVRow[] = [
        {
          track: 0,
          time: 0,
          type: 'set_tempo',
          tempo: 500000,
        },
      ];

      const errors = CSVValidator.validate(rows, 'ticks');
      expect(errors).toHaveLength(0);
    });

    it('should fail on non-positive tempo', () => {
      const rows: CSVRow[] = [
        {
          track: 0,
          time: 0,
          type: 'set_tempo',
          tempo: 0,
        },
      ];

      const errors = CSVValidator.validate(rows, 'ticks');
      expect(errors.some((e) => e.column === 'tempo')).toBe(true);
    });
  });
});
