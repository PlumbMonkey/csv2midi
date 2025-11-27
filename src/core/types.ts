/**
 * Type definitions for CSV2MIDI conversion
 * Based on PRD section 6: CSV format spec
 */

export type MIDIEventType =
  | 'note_on'
  | 'note_off'
  | 'program_change'
  | 'control_change'
  | 'set_tempo'
  | 'track_name'
  | 'time_signature'
  | 'key_signature';

export type TimeUnit = 'ticks' | 'beats' | 'ms';
export type TempoUnit = 'bpm' | 'uspb';

export interface CSVRow {
  track: number;
  time: number;
  type: MIDIEventType;
  channel?: number;
  note?: number;
  velocity?: number;
  program?: number;
  controller?: number;
  value?: number;
  tempo?: number;
  meta_text?: string;
}

export interface MIDIEvent extends CSVRow {
  delta_time?: number; // Calculated after sorting by track
}

export interface ConversionConfig {
  ppq: number; // Pulses per quarter note
  timeUnits: TimeUnit;
  tempoUnit: TempoUnit;
  autoNoteOff?: boolean;
  autoNoteOffDuration?: number;
}

export interface ConversionResult {
  success: boolean;
  trackCount: number;
  eventCount: number;
  errors: string[];
  warnings: string[];
  midiBytes?: Buffer;
  conversionTimeMs?: number;
}

export interface TrackData {
  trackIndex: number;
  name?: string;
  events: MIDIEvent[];
}

export interface ValidationError {
  row: number;
  column: string;
  value: any;
  message: string;
  severity: 'error' | 'warning';
}
