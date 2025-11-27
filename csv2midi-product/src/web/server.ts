/**
 * Web server and API for CSV to MIDI conversion
 * Provides Express server with upload endpoint and web UI
 */

import express, { Express, Request, Response, NextFunction } from 'express';
import multer, { Multer } from 'multer';
import path from 'path';
import { Converter } from '../core';

const app: Express = express();
const upload: Multer = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10 MB limit
});

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes

/**
 * GET /
 * Serves the web UI
 */
app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

/**
 * POST /api/convert
 * Convert CSV to MIDI
 * Body: multipart/form-data with file and options
 * - file: CSV file
 * - ppq: Pulses per quarter note (default: 480)
 * - timeUnits: ticks|beats|ms (default: ticks)
 * - tempoUnit: bpm|uspb (default: uspb)
 */
app.post('/api/convert', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const csvContent = req.file.buffer.toString('utf-8');
    const ppq = parseInt(req.body.ppq || '480', 10);
    const timeUnits = (req.body.timeUnits || 'ticks') as 'ticks' | 'beats' | 'ms';
    const tempoUnit = (req.body.tempoUnit || 'uspb') as 'bpm' | 'uspb';

    if (isNaN(ppq) || ppq <= 0) {
      return res.status(400).json({ error: 'Invalid PPQ value' });
    }

    const converter = new Converter({ ppq, timeUnits, tempoUnit });
    const result = await converter.convert(csvContent);

    if (result.success && result.midiBytes) {
      res.setHeader('Content-Type', 'audio/midi');
      res.setHeader('Content-Disposition', 'attachment; filename="converted.mid"');
      res.send(result.midiBytes);
    } else {
      res.status(400).json({
        error: 'Conversion failed',
        errors: result.errors,
        warnings: result.warnings,
      });
    }
  } catch (err) {
    console.error('Conversion error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/validate
 * Validate CSV without converting
 */
app.post('/api/validate', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const csvContent = req.file.buffer.toString('utf-8');
    const timeUnits = (req.body.timeUnits || 'ticks') as 'ticks' | 'beats' | 'ms';

    const converter = new Converter({ timeUnits });
    const result = await converter.convert(csvContent);

    res.json({
      valid: result.success,
      trackCount: result.trackCount,
      eventCount: result.eventCount,
      errors: result.errors,
      warnings: result.warnings,
    });
  } catch (err) {
    console.error('Validation error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Error handling middleware
 */
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`CSV2MIDI server running on http://localhost:${PORT}`);
  console.log(`Web UI: http://localhost:${PORT}`);
  console.log(`API: http://localhost:${PORT}/api/convert`);
});

export default app;
