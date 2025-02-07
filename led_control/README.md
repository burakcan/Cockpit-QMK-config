# Keyboard LED Control

A Node.js CLI and interactive application to control RGB lighting on QMK keyboards via Raw HID interface.

## Features

- Interactive UI with color wheel and visual sliders
- Complete RGB effect control (42 different effects)
- HSV color control with visual feedback
- Animation speed control
- Skadis/White mode toggles
- Settings persistence in EEPROM
- Effect direction control
- Detailed effect descriptions
- Preset color selection
- Version information display

## Installation

```bash
# Install dependencies
npm install

# Build the application
npm run build
```

## Usage

### Command Line Interface

```bash
# Start interactive UI mode (recommended)
npm start -i

# Set RGB color (HSV values: 0-255)
npm start -c 0,255,255    # Red
npm start -c 85,255,255   # Green
npm start -c 170,255,255  # Blue

# Toggle Skadis display mode
npm start -s on
npm start -s off

# Toggle white mode (in Skadis mode)
npm start -w on
npm start -w off

# Set RGB effect (1-42)
npm start -e 1    # Static Light
npm start -e 2    # Breathing 1
# See effect list below for all options

# Set animation speed (0-255)
npm start -a 128  # Medium speed
```

### Interactive UI Controls

- Tab/Shift+Tab: Navigate through options
- Enter: Select option
- Left/Right Arrow: Adjust values
- Up/Down Arrow: Adjust saturation in color wheel
- H: Show/hide help screen
- Esc: Return to main menu
- Q: Quit application

### Available Effects

1. Static Light
   2-5. Breathing (4 speeds)
   6-8. Rainbow Mood (3 speeds)
   9-14. Rainbow Swirl (6 variations)
   15-20. Snake (6 variations)
   21-23. Knight Rider (3 speeds)
2. Christmas
   25-34. Static Gradient (10 variations)
3. RGB Test
4. Alternating
   37-42. Twinkle (6 variations)

### Settings Persistence

The application supports saving and loading settings to/from the keyboard's EEPROM memory. This includes:

- Current effect mode
- HSV color values
- Animation speed
- Skadis/White mode states
- Effect direction

## Development

```bash
# Watch mode during development
npm run dev

# Build for production
npm run build
```

## Troubleshooting

If you encounter errors:

1. Ensure keyboard is connected and powered on
2. Run with administrator privileges on Windows
3. Set up proper udev rules on Linux:

```bash
# /etc/udev/rules.d/50-qmk.rules
KERNEL=="hidraw*", ATTRS{idVendor}=="4648", ATTRS{idProduct}=="0001", MODE="0666"
```

4. Verify your keyboard's VID/PID matches the configured values:

```typescript
private static readonly VID = 0x4648;
private static readonly PID = 0x0001;
```

5. Ensure QMK firmware has Raw HID enabled in `rules.mk`:

```make
RAW_ENABLE = yes
```

## Dependencies

- node-hid: HID device communication
- commander: CLI argument parsing
- ink & react: Interactive terminal UI
- TypeScript: Type safety and modern JavaScript features

## License

ISC
