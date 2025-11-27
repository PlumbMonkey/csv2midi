; CSV to MIDI Converter - Windows Installer Script
; Built with NSIS

!include "MUI2.nsh"

; Configuration
Name "CSV to MIDI Converter"
OutFile "csv2midi-installer-windows.exe"
InstallDir "$PROGRAMFILES\CSV2MIDI"
InstallDirRegKey HKLM "Software\csv2midi" "Install_Dir"

; MUI Settings
!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH
!insertmacro MUI_LANGUAGE "English"

; Installer sections
Section "Install"
  SetOutPath "$INSTDIR"
  File "csv2midi-converter.exe"
  File "START-WEB-UI.bat"
  SetOutPath "$INSTDIR\samples"
  File "samples\*.*"
  
  ; Create shortcuts
  SetOutPath "$INSTDIR"
  CreateDirectory "$SMPROGRAMS\CSV to MIDI Converter"
  CreateShortCut "$SMPROGRAMS\CSV to MIDI Converter\CSV to MIDI Converter.lnk" "$INSTDIR\START-WEB-UI.bat"
  CreateShortCut "$SMPROGRAMS\CSV to MIDI Converter\Uninstall.lnk" "$INSTDIR\uninstall.exe"
  CreateShortCut "$DESKTOP\CSV to MIDI Converter.lnk" "$INSTDIR\START-WEB-UI.bat"
  
  ; Write uninstall info
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\CSV2MIDI" "DisplayName" "CSV to MIDI Converter"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\CSV2MIDI" "UninstallString" "$INSTDIR\uninstall.exe"
  WriteUninstaller "$INSTDIR\uninstall.exe"
SectionEnd

; Uninstaller
Section "Uninstall"
  RMDir /r "$INSTDIR"
  RMDir /r "$SMPROGRAMS\CSV to MIDI Converter"
  Delete "$DESKTOP\CSV to MIDI Converter.lnk"
  DeleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\CSV2MIDI"
SectionEnd
