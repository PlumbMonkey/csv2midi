#!/usr/bin/env node

const path = require('path');
const args = process.argv.slice(2);

// Check if running as web server
if (args.includes('--web') || args.includes('web')) {
  console.log('Starting CSV to MIDI Converter Web Server...\n');
  require('./dist/web/server');
} else if (args.includes('--help') || args.includes('-h') || args.length === 0) {
  console.log(`
CSV to MIDI Converter v0.1.0

Usage:
  csv2midi-converter.exe [input.csv] [output.mid] [options]
  csv2midi-converter.exe --web                Start web server

Options:
  --ppq <number>           Pulses per quarter note (default: 480)
  --time-units <unit>      Time unit: ticks, beats, ms (default: ticks)
  --tempo-unit <unit>      Tempo unit: bpm, uspb (default: uspb)
  --auto-noteoff           Automatically add note-off events
  --web                    Start web server on http://localhost:3000
  --help, -h               Show this help

Examples:
  csv2midi-converter.exe drums.csv output.mid
  csv2midi-converter.exe song.csv output.mid --ppq 960 --time-units beats
  csv2midi-converter.exe --web

For more info, visit: https://github.com/PlumbMonkey/csv2midi
  `);
} else {
  // CLI mode
  require('./dist/cli/cli');
}
