@echo off
echo CSV to MIDI Converter
node --version >nul 2>&1
if errorlevel 1 (echo Install Node.js & pause & exit)
npm install
echo Choose: 1=Web, 2=CLI, 3=Tests
set /p c="Choice: "
if "%c%"=="1" npm run web
if "%c%"=="2" echo npm start -- input.csv output.mid  
if "%c%"=="3" npm test
pause
