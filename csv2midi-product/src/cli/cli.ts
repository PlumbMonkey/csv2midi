#!/usr/bin/env node

/**
 * CLI tool for CSV to MIDI conversion
 * Usage: csv2midi input.csv output.mid [options]
 */

import { Converter } from '../core';
import * as fs from 'fs';

interface CLIArgs {
  input: string;
  output: string;
  ppq: number;
  timeUnits: 'ticks' | 'beats' | 'ms';
  tempoUnit: 'bpm' | 'uspb';
  autoNoteOff: boolean;
  autoNoteOffDuration: number;
}

function printHelp(): void {
  console.log(`
csv2midi - Convert CSV to MIDI files

Usage:
  csv2midi <input.csv> <output.mid> [options]

Options:
  --ppq <number>              Pulses per quarter note (default: 480)
  --time-units <units>        Time unit: ticks|beats|ms (default: ticks)
  --tempo-unit <unit>         Tempo unit: bpm|uspb (default: uspb)
  --auto-noteoff              Auto-generate note_off at track end (default: true)
  --help, -h                  Show this help message
  --version, -v               Show version

Examples:
  csv2midi music.csv output.mid
  csv2midi music.csv output.mid --ppq 480 --time-units beats --tempo-unit bpm
  csv2midi music.csv output.mid --no-auto-noteoff

CSV Format:
  track,time,type,channel,note,velocity,program,controller,value,tempo,meta_text
  
  See https://github.com/your-repo/docs for full documentation.
`);
}

function printVersion(): void {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const pkg = require('../../package.json');
  // eslint-disable-next-line no-console
  console.log(`csv2midi v${pkg.version}`);
}

function parseArgs(): CLIArgs | null {
  const args = process.argv.slice(2);

  if (args.includes('-h') || args.includes('--help')) {
    printHelp();
    process.exit(0);
  }

  if (args.includes('-v') || args.includes('--version')) {
    printVersion();
    process.exit(0);
  }

  if (args.length < 2) {
    console.error('Error: Missing required arguments');
    console.error('Usage: csv2midi <input.csv> <output.mid> [options]');
    console.error('Run with --help for more information');
    process.exit(1);
  }

  const input = args[0];
  const output = args[1];

  let ppq = 480;
  let timeUnits: 'ticks' | 'beats' | 'ms' = 'ticks';
  let tempoUnit: 'bpm' | 'uspb' = 'uspb';
  let autoNoteOff = true;
  let autoNoteOffDuration = 480;

  for (let i = 2; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--ppq' && i + 1 < args.length) {
      ppq = parseInt(args[++i], 10);
      if (isNaN(ppq) || ppq <= 0) {
        console.error('Error: --ppq must be a positive integer');
        process.exit(1);
      }
    } else if (arg === '--time-units' && i + 1 < args.length) {
      const val = args[++i];
      if (!['ticks', 'beats', 'ms'].includes(val)) {
        console.error('Error: --time-units must be one of: ticks, beats, ms');
        process.exit(1);
      }
      timeUnits = val as 'ticks' | 'beats' | 'ms';
    } else if (arg === '--tempo-unit' && i + 1 < args.length) {
      const val = args[++i];
      if (!['bpm', 'uspb'].includes(val)) {
        console.error('Error: --tempo-unit must be one of: bpm, uspb');
        process.exit(1);
      }
      tempoUnit = val as 'bpm' | 'uspb';
    } else if (arg === '--no-auto-noteoff') {
      autoNoteOff = false;
    } else if (arg === '--auto-noteoff-duration' && i + 1 < args.length) {
      autoNoteOffDuration = parseInt(args[++i], 10);
      if (isNaN(autoNoteOffDuration) || autoNoteOffDuration < 0) {
        console.error('Error: --auto-noteoff-duration must be a non-negative integer');
        process.exit(1);
      }
    }
  }

  return { input, output, ppq, timeUnits, tempoUnit, autoNoteOff, autoNoteOffDuration };
}

async function main(): Promise<void> {
  const cliArgs = parseArgs();
  if (!cliArgs) {
    process.exit(1);
  }

  // Check input file exists
  if (!fs.existsSync(cliArgs.input)) {
    console.error(`Error: Input file not found: ${cliArgs.input}`);
    process.exit(1);
  }

  const converter = new Converter({
    ppq: cliArgs.ppq,
    timeUnits: cliArgs.timeUnits,
    tempoUnit: cliArgs.tempoUnit,
    autoNoteOff: cliArgs.autoNoteOff,
    autoNoteOffDuration: cliArgs.autoNoteOffDuration,
  });

  console.log(`Converting ${cliArgs.input} → ${cliArgs.output}...`);

  const result = await converter.convertFile(cliArgs.input, cliArgs.output);

  if (result.success) {
    console.log(`✓ Conversion successful!`);
    console.log(`  Tracks: ${result.trackCount}`);
    console.log(`  Events: ${result.eventCount}`);
    console.log(`  Time: ${result.conversionTimeMs}ms`);
    console.log(`  Output: ${cliArgs.output}`);

    if (result.warnings.length > 0) {
      console.log('\nWarnings:');
      result.warnings.forEach((w) => console.log(`  ⚠ ${w}`));
    }

    process.exit(0);
  } else {
    console.error(`✗ Conversion failed!`);
    console.error('\nErrors:');
    result.errors.forEach((e) => console.error(`  ✗ ${e}`));

    if (result.warnings.length > 0) {
      console.log('\nWarnings:');
      result.warnings.forEach((w) => console.log(`  ⚠ ${w}`));
    }

    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
