/**
 * CSV Parser and Validator
 * Parses CSV data and validates against the schema defined in PRD section 6
 */

import { parse } from 'csv-parse/sync';
import {
  CSVRow,
  MIDIEventType,
  TimeUnit,
  ValidationError,
} from './types';

const ALLOWED_EVENT_TYPES: MIDIEventType[] = [
  'note_on',
  'note_off',
  'program_change',
  'control_change',
  'set_tempo',
  'track_name',
  'time_signature',
  'key_signature',
];

export class CSVParser {
  static parse(csvContent: string): CSVRow[] {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      relax_column_count: true,
    } as any);

    return records.map((record: Record<string, string>) => ({
      track: parseInt(record.track, 10),
      time: parseFloat(record.time),
      type: record.type as MIDIEventType,
      channel: record.channel ? parseInt(record.channel, 10) : undefined,
      note: record.note ? parseInt(record.note, 10) : undefined,
      velocity: record.velocity ? parseInt(record.velocity, 10) : undefined,
      program: record.program ? parseInt(record.program, 10) : undefined,
      controller: record.controller ? parseInt(record.controller, 10) : undefined,
      value: record.value ? parseInt(record.value, 10) : undefined,
      tempo: record.tempo ? parseInt(record.tempo, 10) : undefined,
      meta_text: record.meta_text || undefined,
    }));
  }
}

export class CSVValidator {
  static validate(rows: CSVRow[], timeUnits: TimeUnit): ValidationError[] {
    const errors: ValidationError[] = [];

    rows.forEach((row, index) => {
      const rowNum = index + 2; // +2 because of header and 1-based indexing

      // Required fields validation
      if (typeof row.track !== 'number' || row.track < 0) {
        errors.push({
          row: rowNum,
          column: 'track',
          value: row.track,
          message: 'track must be a non-negative integer',
          severity: 'error',
        });
      }

      if (typeof row.time !== 'number' || row.time < 0) {
        errors.push({
          row: rowNum,
          column: 'time',
          value: row.time,
          message: `time must be a non-negative ${timeUnits}`,
          severity: 'error',
        });
      }

      if (!ALLOWED_EVENT_TYPES.includes(row.type)) {
        errors.push({
          row: rowNum,
          column: 'type',
          value: row.type,
          message: `type must be one of: ${ALLOWED_EVENT_TYPES.join(', ')}`,
          severity: 'error',
        });
      }

      // Channel validation
      if (row.channel !== undefined) {
        if (!Number.isInteger(row.channel) || row.channel < 0 || row.channel > 15) {
          errors.push({
            row: rowNum,
            column: 'channel',
            value: row.channel,
            message: 'channel must be an integer between 0 and 15',
            severity: 'error',
          });
        }
      }

      // Note validation
      if (row.note !== undefined) {
        if (!Number.isInteger(row.note) || row.note < 0 || row.note > 127) {
          errors.push({
            row: rowNum,
            column: 'note',
            value: row.note,
            message: 'note must be an integer between 0 and 127',
            severity: 'error',
          });
        }
      }

      // Velocity validation
      if (row.velocity !== undefined) {
        if (!Number.isInteger(row.velocity) || row.velocity < 0 || row.velocity > 127) {
          errors.push({
            row: rowNum,
            column: 'velocity',
            value: row.velocity,
            message: 'velocity must be an integer between 0 and 127',
            severity: 'error',
          });
        }
      }

      // Program validation
      if (row.program !== undefined) {
        if (!Number.isInteger(row.program) || row.program < 0 || row.program > 127) {
          errors.push({
            row: rowNum,
            column: 'program',
            value: row.program,
            message: 'program must be an integer between 0 and 127',
            severity: 'error',
          });
        }
      }

      // Controller validation
      if (row.controller !== undefined) {
        if (!Number.isInteger(row.controller) || row.controller < 0 || row.controller > 127) {
          errors.push({
            row: rowNum,
            column: 'controller',
            value: row.controller,
            message: 'controller must be an integer between 0 and 127',
            severity: 'error',
          });
        }
      }

      // Value validation
      if (row.value !== undefined) {
        if (!Number.isInteger(row.value) || row.value < 0 || row.value > 127) {
          errors.push({
            row: rowNum,
            column: 'value',
            value: row.value,
            message: 'value must be an integer between 0 and 127',
            severity: 'error',
          });
        }
      }

      // Tempo validation
      if (row.tempo !== undefined) {
        if (!Number.isInteger(row.tempo) || row.tempo <= 0) {
          errors.push({
            row: rowNum,
            column: 'tempo',
            value: row.tempo,
            message: 'tempo must be a positive integer',
            severity: 'error',
          });
        }
      }

      // Type-specific validations
      if (['note_on', 'note_off'].includes(row.type)) {
        if (row.note === undefined) {
          errors.push({
            row: rowNum,
            column: 'note',
            value: undefined,
            message: `${row.type} requires a note field`,
            severity: 'error',
          });
        }
        if (row.velocity === undefined) {
          errors.push({
            row: rowNum,
            column: 'velocity',
            value: undefined,
            message: `${row.type} requires a velocity field`,
            severity: 'error',
          });
        }
      }

      if (row.type === 'program_change' && row.program === undefined) {
        errors.push({
          row: rowNum,
          column: 'program',
          value: undefined,
          message: 'program_change requires a program field',
          severity: 'error',
        });
      }

      if (row.type === 'control_change') {
        if (row.controller === undefined) {
          errors.push({
            row: rowNum,
            column: 'controller',
            value: undefined,
            message: 'control_change requires a controller field',
            severity: 'error',
          });
        }
        if (row.value === undefined) {
          errors.push({
            row: rowNum,
            column: 'value',
            value: undefined,
            message: 'control_change requires a value field',
            severity: 'error',
          });
        }
      }
    });

    return errors;
  }
}
