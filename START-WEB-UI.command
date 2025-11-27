#!/bin/bash

echo ""
echo "================================================"
echo "  CSV to MIDI Converter - Web Interface"
echo "  by PlumbMonkey"
echo "================================================"
echo ""
echo "Starting web server..."
echo ""
echo "The web UI will open at: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

./csv2midi-converter-mac --web

echo ""
echo "Server stopped."
read -p "Press Enter to exit..."
