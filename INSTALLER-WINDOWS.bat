@echo off
setlocal enabledelayedexpansion

title CSV to MIDI Converter - Installation Wizard
color 0B

:menu
cls
echo.
echo ========================================
echo    CSV to MIDI Converter
echo    Installation Wizard
echo ========================================
echo.
echo Choose installation method:
echo.
echo 1) Standard Installation (Recommended)
echo    Installs to Program Files
echo    Creates Start Menu shortcuts
echo.
echo 2) Portable Installation
echo    Choose any folder
echo    No registry entries
echo.
echo 3) Exit
echo.
set /p choice="Enter your choice (1-3): "

if "%choice%"=="1" goto standard
if "%choice%"=="2" goto portable
if "%choice%"=="3" goto end
goto menu

:standard
cls
echo.
echo Installing to: C:\Program Files\CSV2MIDI
echo.

if not exist "C:\Program Files\CSV2MIDI" mkdir "C:\Program Files\CSV2MIDI"

copy csv2midi-converter.exe "C:\Program Files\CSV2MIDI\" >nul
copy START-WEB-UI.bat "C:\Program Files\CSV2MIDI\" >nul
if exist samples mkdir "C:\Program Files\CSV2MIDI\samples"
xcopy samples "C:\Program Files\CSV2MIDI\samples\" /E /Y >nul

echo.
echo Creating shortcuts...
powershell -Command "$ws = New-Object -ComObject WScript.Shell; $shortcut = $ws.CreateShortcut('C:\ProgramData\Microsoft\Windows\Start Menu\Programs\CSV to MIDI Converter.lnk'); $shortcut.TargetPath = 'C:\Program Files\CSV2MIDI\START-WEB-UI.bat'; $shortcut.Save()"

echo.
echo Installation complete!
echo.
echo You can now:
echo   - Click the Start Menu shortcut
echo   - Run: C:\Program Files\CSV2MIDI\csv2midi-converter.exe
echo.
pause
goto end

:portable
cls
echo.
echo Choose installation folder:
echo.
set /p portabledir="Enter folder path (or press Enter for current directory): "

if "%portabledir%"=="" (
    set portabledir=.
)

if not exist "%portabledir%" mkdir "%portabledir%"

echo.
echo Copying files to: %portabledir%
echo.

copy csv2midi-converter.exe "%portabledir%\" >nul
copy START-WEB-UI.bat "%portabledir%\" >nul
if exist samples xcopy samples "%portabledir%\samples\" /E /Y >nul

echo.
echo Installation complete!
echo.
echo To use:
echo   1. Go to: %portabledir%
echo   2. Double-click START-WEB-UI.bat
echo   Or run: csv2midi-converter.exe input.csv output.mid
echo.
pause
goto end

:end
echo.
echo Thank you for installing CSV to MIDI Converter!
echo.
echo Website: https://github.com/PlumbMonkey/csv2midi
echo.
