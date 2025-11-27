/**
 * MIDI File Generator
 * Converts parsed CSV events to standard MIDI file format
 * Uses absolute time to delta time conversion per track
 */

import { CSVRow, MIDIEvent, TrackData, ConversionConfig } from './types';

export class MIDIConverter {
  /**
   * Convert BPM to microseconds per beat (USPB)
   */
  static bpmToUspb(bpm: number): number {
    return Math.round(60_000_000 / bpm);
  }

  /**
   * Convert microseconds per beat to BPM
   */
  static uspbToBpm(uspb: number): number {
    return Math.round(60_000_000 / uspb);
  }

  /**
   * Convert beats to ticks
   */
  static beatsToTicks(beats: number, ppq: number): number {
    return Math.round(beats * ppq);
  }

  /**
   * Convert milliseconds to ticks given tempo
   */
  static msToTicks(ms: number, uspb: number, ppq: number): number {
    // uspb is microseconds per beat
    // 1 beat = uspb microseconds = uspb/1000 milliseconds
    const msPerBeat = uspb / 1000;
    const beats = ms / msPerBeat;
    return Math.round(beats * ppq);
  }

  /**
   * Normalize time values from various units to ticks
   */
  static normalizeTime(
    time: number,
    timeUnits: 'ticks' | 'beats' | 'ms',
    ppq: number,
    defaultUspb: number
  ): number {
    switch (timeUnits) {
      case 'ticks':
        return Math.round(time);
      case 'beats':
        return this.beatsToTicks(time, ppq);
      case 'ms':
        return this.msToTicks(time, defaultUspb, ppq);
      default:
        throw new Error(`Unknown time unit: ${timeUnits}`);
    }
  }

  /**
   * Group events by track and sort by time
   */
  static groupEventsByTrack(events: CSVRow[]): TrackData[] {
    const trackMap = new Map<number, CSVRow[]>();

    // Group by track
    events.forEach((event) => {
      if (!trackMap.has(event.track)) {
        trackMap.set(event.track, []);
      }
      trackMap.get(event.track)!.push(event);
    });

    // Sort each track by time and convert to TrackData
    const tracks: TrackData[] = [];
    trackMap.forEach((events, trackIndex) => {
      events.sort((a, b) => a.time - b.time);
      const trackName = events.find((e) => e.type === 'track_name')?.meta_text;
      tracks.push({
        trackIndex,
        name: trackName,
        events: events as MIDIEvent[],
      });
    });

    return tracks.sort((a, b) => a.trackIndex - b.trackIndex);
  }

  /**
   * Convert absolute times to delta times for each track
   */
  static absoluteToDeltaTimes(tracks: TrackData[]): TrackData[] {
    return tracks.map((track) => {
      let lastAbsoluteTime = 0;
      const eventsWithDelta = track.events.map((event) => {
        const deltaTime = event.time - lastAbsoluteTime;
        lastAbsoluteTime = event.time;
        return {
          ...event,
          delta_time: deltaTime,
        };
      });

      return {
        ...track,
        events: eventsWithDelta,
      };
    });
  }
}

/**
 * MIDI File Writer - generates binary MIDI data
 * Implements standard MIDI file format (SMF)
 */
export class MIDIFileWriter {
  /**
   * Write a variable-length quantity (used in MIDI for delta times and data lengths)
   */
  private static writeVariableLength(value: number): Buffer {
    const bytes: number[] = [];

    bytes.push(value & 0x7f);
    value >>= 7;

    while (value) {
      bytes.unshift((value & 0x7f) | 0x80);
      value >>= 7;
    }

    return Buffer.from(bytes);
  }

  /**
   * Write a big-endian 32-bit integer
   */
  private static writeUint32(value: number): Buffer {
    const buffer = Buffer.alloc(4);
    buffer.writeUInt32BE(value, 0);
    return buffer;
  }

  /**
   * Write a big-endian 16-bit integer
   */
  private static writeUint16(value: number): Buffer {
    const buffer = Buffer.alloc(2);
    buffer.writeUInt16BE(value, 0);
    return buffer;
  }

  /**
   * Write a meta event
   */
  private static writeMetaEvent(
    deltaTime: number,
    metaType: number,
    data: Buffer | string
  ): Buffer {
    const buffers: Buffer[] = [];

    buffers.push(this.writeVariableLength(deltaTime));
    buffers.push(Buffer.from([0xff, metaType]));

    const dataBuffer = typeof data === 'string' ? Buffer.from(data, 'utf-8') : data;
    buffers.push(this.writeVariableLength(dataBuffer.length));
    buffers.push(dataBuffer);

    return Buffer.concat(buffers);
  }

  /**
   * Write a MIDI channel message (note on/off, program change, control change)
   */
  private static writeChannelMessage(
    deltaTime: number,
    status: number,
    data1: number,
    data2: number
  ): Buffer {
    const buffers: Buffer[] = [];

    buffers.push(this.writeVariableLength(deltaTime));
    buffers.push(Buffer.from([status, data1, data2]));

    return Buffer.concat(buffers);
  }

  /**
   * Generate complete MIDI file from tracks
   */
  static generate(tracks: TrackData[], config: ConversionConfig, defaultUspb: number): Buffer {
    const chunks: Buffer[] = [];

    // Header chunk: MThd (4 bytes) + length (4 bytes) + format (2) + tracks (2) + division (2)
    chunks.push(Buffer.from('MThd'));
    chunks.push(this.writeUint32(6)); // Header length
    chunks.push(this.writeUint16(1)); // Format 1 (multiple tracks)
    chunks.push(this.writeUint16(tracks.length)); // Number of tracks
    chunks.push(this.writeUint16(config.ppq)); // Division (PPQ)

    // Track chunks
    tracks.forEach((track) => {
      const trackBuffer = this.generateTrackChunk(track, config, defaultUspb);
      chunks.push(trackBuffer);
    });

    return Buffer.concat(chunks);
  }

  /**
   * Generate a track chunk (MTrk + events)
   */
  private static generateTrackChunk(
    track: TrackData,
    config: ConversionConfig,
    defaultUspb: number
  ): Buffer {
    const eventBuffers: Buffer[] = [];
    let currentDeltaTime = 0;

    // Process events
    track.events.forEach((event) => {
      const deltaTime = event.delta_time || 0;
      let eventBuffer: Buffer | null = null;

      switch (event.type) {
        case 'set_tempo':
          const tempo = event.tempo || defaultUspb;
          const tempoBytes = Buffer.alloc(3);
          tempoBytes[0] = (tempo >> 16) & 0xff;
          tempoBytes[1] = (tempo >> 8) & 0xff;
          tempoBytes[2] = tempo & 0xff;
          eventBuffer = this.writeMetaEvent(deltaTime, 0x51, tempoBytes);
          break;

        case 'track_name':
          eventBuffer = this.writeMetaEvent(deltaTime, 0x03, event.meta_text || 'Track');
          break;

        case 'note_on':
          const noteOnStatus = 0x90 | (event.channel || 0);
          eventBuffer = this.writeChannelMessage(
            deltaTime,
            noteOnStatus,
            event.note || 0,
            event.velocity || 0
          );
          break;

        case 'note_off':
          const noteOffStatus = 0x80 | (event.channel || 0);
          eventBuffer = this.writeChannelMessage(
            deltaTime,
            noteOffStatus,
            event.note || 0,
            event.velocity || 0
          );
          break;

        case 'program_change':
          const programStatus = 0xc0 | (event.channel || 0);
          eventBuffer = this.writeVariableLength(deltaTime);
          eventBuffer = Buffer.concat([eventBuffer, Buffer.from([programStatus, event.program || 0])]);
          break;

        case 'control_change':
          const ccStatus = 0xb0 | (event.channel || 0);
          eventBuffer = this.writeChannelMessage(
            deltaTime,
            ccStatus,
            event.controller || 0,
            event.value || 0
          );
          break;

        case 'time_signature':
          // Basic implementation: numerator, denominator, clock, 32nd notes
          const timeData = Buffer.from([4, 2, 24, 8]); // 4/4 default
          eventBuffer = this.writeMetaEvent(deltaTime, 0x58, timeData);
          break;

        case 'key_signature':
          // Key signature: sharps/flats, major/minor
          const keyData = Buffer.from([0, 0]); // C major default
          eventBuffer = this.writeMetaEvent(deltaTime, 0x59, keyData);
          break;
      }

      if (eventBuffer) {
        eventBuffers.push(eventBuffer);
      }
    });

    // End of track
    const endOfTrack = this.writeMetaEvent(0, 0x2f, Buffer.alloc(0));
    eventBuffers.push(endOfTrack);

    const trackData = Buffer.concat(eventBuffers);

    // Create track chunk: MTrk + length + data
    const trackChunk = Buffer.concat([
      Buffer.from('MTrk'),
      this.writeUint32(trackData.length),
      trackData,
    ]);

    return trackChunk;
  }
}
