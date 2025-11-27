#!/bin/bash

# CSV to MIDI Converter - macOS Installation Script

clear
echo "========================================"
echo "  CSV to MIDI Converter"
echo "  Installation for macOS"
echo "========================================"
echo ""

# Check if running on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    echo "This installer is for macOS only."
    exit 1
fi

# Installation options menu
show_menu() {
    echo ""
    echo "Installation Options:"
    echo ""
    echo "1) Standard Installation (Recommended)"
    echo "   Installs to /Applications"
    echo "   Creates launcher in Dock"
    echo ""
    echo "2) Portable Installation"
    echo "   Choose any folder"
    echo "   No system changes"
    echo ""
    echo "3) Exit"
    echo ""
    read -p "Enter your choice (1-3): " choice
}

standard_install() {
    clear
    echo ""
    echo "Installing to /Applications/CSV2MIDI..."
    echo ""
    
    # Create application directory
    sudo mkdir -p /Applications/CSV2MIDI
    sudo chmod 755 /Applications/CSV2MIDI
    
    # Copy files
    sudo cp csv2midi-converter-mac /Applications/CSV2MIDI/
    sudo cp START-WEB-UI.command /Applications/CSV2MIDI/
    sudo chmod +x /Applications/CSV2MIDI/csv2midi-converter-mac
    sudo chmod +x /Applications/CSV2MIDI/START-WEB-UI.command
    
    # Copy samples
    if [ -d "samples" ]; then
        sudo cp -r samples /Applications/CSV2MIDI/
        sudo chmod -R 755 /Applications/CSV2MIDI/samples
    fi
    
    # Create desktop shortcut
    cat > /tmp/csv2midi.sh << 'EOF'
#!/bin/bash
open -a Terminal /Applications/CSV2MIDI/START-WEB-UI.command
EOF
    
    sudo cp /tmp/csv2midi.sh /Applications/CSV2MIDI/launcher.sh
    sudo chmod +x /Applications/CSV2MIDI/launcher.sh
    rm /tmp/csv2midi.sh
    
    echo ""
    echo "Installation complete!"
    echo ""
    echo "You can now:"
    echo "  - Open /Applications/CSV2MIDI from Finder"
    echo "  - Double-click START-WEB-UI.command to start"
    echo "  - Or run: /Applications/CSV2MIDI/csv2midi-converter-mac input.csv output.mid"
    echo ""
    read -p "Press Enter to continue..."
}

portable_install() {
    clear
    echo ""
    read -p "Enter installation folder path (default: ~/CSV2MIDI): " install_dir
    
    if [ -z "$install_dir" ]; then
        install_dir="$HOME/CSV2MIDI"
    fi
    
    echo ""
    echo "Installing to: $install_dir"
    echo ""
    
    # Create directory
    mkdir -p "$install_dir"
    
    # Copy files
    cp csv2midi-converter-mac "$install_dir/"
    cp START-WEB-UI.command "$install_dir/"
    chmod +x "$install_dir/csv2midi-converter-mac"
    chmod +x "$install_dir/START-WEB-UI.command"
    
    # Copy samples
    if [ -d "samples" ]; then
        cp -r samples "$install_dir/"
        chmod -R 755 "$install_dir/samples"
    fi
    
    echo ""
    echo "Installation complete!"
    echo ""
    echo "To use:"
    echo "  1. Open Finder and go to: $install_dir"
    echo "  2. Double-click START-WEB-UI.command"
    echo "  Or from Terminal:"
    echo "     cd $install_dir"
    echo "     ./csv2midi-converter-mac input.csv output.mid"
    echo ""
    read -p "Press Enter to continue..."
}

# Main loop
while true; do
    show_menu
    
    case $choice in
        1) standard_install ;;
        2) portable_install ;;
        3) echo ""; echo "Goodbye!"; echo ""; exit 0 ;;
        *) echo "Invalid choice. Please try again." ;;
    esac
done
