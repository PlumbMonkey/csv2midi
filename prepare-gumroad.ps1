$DistDir = "csv2midi-product"
Write-Host "Creating distribution: $DistDir" -ForegroundColor Green

if (Test-Path $DistDir) { Remove-Item $DistDir -Recurse -Force }
New-Item -ItemType Directory -Path $DistDir | Out-Null

@("dist", "samples", "docs", "src", "tests") | ForEach-Object {
    if (Test-Path $_) { Copy-Item $_ "$DistDir\" -Recurse -Force }
}

@("package.json", "package-lock.json", "tsconfig.json", "jest.config.js", ".eslintrc.json", ".prettierrc", "README.md", "CONTRIBUTING.md", "LICENSE", "GUMROAD_PRODUCT.md") | ForEach-Object {
    if (Test-Path $_) { Copy-Item $_ "$DistDir\" }
}

# Create batch file
$batch = @'
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
'@
Set-Content "$DistDir\START_HERE.bat" $batch

Write-Host "Creating ZIP..." -ForegroundColor Green
Compress-Archive -Path $DistDir -DestinationPath "csv2midi-product.zip" -Force

Write-Host ""
Write-Host "SUCCESS!" -ForegroundColor Green
Write-Host ""
Write-Host "Files created:" -ForegroundColor Cyan
Write-Host "  - $DistDir/" 
Write-Host "  - csv2midi-product.zip"
Write-Host ""
Write-Host "Next: Upload to Gumroad"
