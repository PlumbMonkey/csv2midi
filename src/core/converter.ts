/**
 * Main conversion orchestrator
 * Coordinates CSV parsing, validation, and MIDI file generation
 */

import { CSVParser, CSVValidator } from './csv-parser';
import { MIDIConverter, MIDIFileWriter } from './midi-converter';
import { CSVRow, ConversionConfig, ConversionResult } from './types';
import * as fs from 'fs';

export class Converter {
  private config: ConversionConfig;
  private defaultUspb: number;

  constructor(config: Partial<ConversionConfig> = {}) {
    this.config = {
      ppq: config.ppq || 480,
      timeUnits: config.timeUnits || 'ticks',
      tempoUnit: config.tempoUnit || 'uspb',
      autoNoteOff: config.autoNoteOff !== false,
      autoNoteOffDuration: config.autoNoteOffDuration || 480,
    };

    // Default tempo: 120 BPM = 500,000 USPB
    this.defaultUspb =
      config.tempoUnit === 'bpm' ? MIDIConverter.bpmToUspb(120) : 500000;
  }

  /**
   * Convert CSV content to MIDI buffer
   */
  async convert(csvContent: string): Promise<ConversionResult> {
    const startTime = Date.now();
    const warnings: string[] = [];

    try {
      // Step 1: Parse CSV
      let rows: CSVRow[];
      try {
        rows = CSVParser.parse(csvContent);
      } catch (err) {
        return {
          success: false,
          trackCount: 0,
          eventCount: 0,
          errors: [`Failed to parse CSV: ${(err as Error).message}`],
          warnings: [],
          conversionTimeMs: Date.now() - startTime,
        };
      }

      // Step 2: Validate
      const validationErrors = CSVValidator.validate(rows, this.config.timeUnits);
      const criticalErrors = validationErrors.filter((e) => e.severity === 'error');
      const warningsList = validationErrors.filter((e) => e.severity === 'warning');

      if (criticalErrors.length > 0) {
        const errorMessages = criticalErrors.map(
          (e) => `Row ${e.row}, ${e.column}: ${e.message}`
        );
        return {
          success: false,
          trackCount: 0,
          eventCount: 0,
          errors: errorMessages,
          warnings: warningsList.map((w) => `Row ${w.row}, ${w.column}: ${w.message}`),
          conversionTimeMs: Date.now() - startTime,
        };
      }

      warnings.push(...warningsList.map((w) => `Row ${w.row}, ${w.column}: ${w.message}`));

      // Step 3: Normalize time values
      const normalizedRows = rows.map((row) => ({
        ...row,
        time: MIDIConverter.normalizeTime(
          row.time,
          this.config.timeUnits,
          this.config.ppq,
          this.defaultUspb
        ),
      }));

      // Step 4: Group by track and calculate delta times
      let tracks = MIDIConverter.groupEventsByTrack(normalizedRows);
      tracks = MIDIConverter.absoluteToDeltaTimes(tracks);

      // Step 5: Generate MIDI
      const midiBuffer = MIDIFileWriter.generate(tracks, this.config, this.defaultUspb);

      const trackCount = tracks.length;
      const eventCount = rows.length;

      return {
        success: true,
        trackCount,
        eventCount,
        errors: [],
        warnings,
        midiBytes: midiBuffer,
        conversionTimeMs: Date.now() - startTime,
      };
    } catch (err) {
      return {
        success: false,
        trackCount: 0,
        eventCount: 0,
        errors: [`Unexpected error: ${(err as Error).message}`],
        warnings,
        conversionTimeMs: Date.now() - startTime,
      };
    }
  }

  /**
   * Convert CSV file to MIDI file
   */
  async convertFile(inputPath: string, outputPath: string): Promise<ConversionResult> {
    try {
      const csvContent = fs.readFileSync(inputPath, 'utf-8');
      const result = await this.convert(csvContent);

      if (result.success && result.midiBytes) {
        fs.writeFileSync(outputPath, result.midiBytes);
      }

      return result;
    } catch (err) {
      return {
        success: false,
        trackCount: 0,
        eventCount: 0,
        errors: [`Failed to read/write file: ${(err as Error).message}`],
        warnings: [],
      };
    }
  }
}
