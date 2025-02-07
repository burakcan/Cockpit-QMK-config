# Keyboard LED Control

A Node.js CLI and interactive application to control RGB lighting on QMK keyboards via Raw HID interface.

## Features

- Interactive UI with visual controls
- 42 RGB lighting effects with live preview
- HSV color control with visual sliders and color wheel
- Quick color presets (Red, Green, Blue, etc.)
- Animation speed control
- Effect direction control
- Skadis/White mode toggles
- Detailed effect descriptions
- Live effect preview when selecting
- Version information display

## Installation

```bash
# Install pnpm if you haven't already
npm install -g pnpm

# Install dependencies
pnpm install

# Build the application
pnpm build
```

## Usage

### Interactive Mode (Recommended)

```bash
# Run without logs (default)
pnpm start -i

# Run with error logs only
$env:LOGLEVEL='error'; pnpm start -i

# Run with info logs (includes commands and responses)
$env:LOGLEVEL='info'; pnpm start -i

# Run with debug logs (includes all HID device details)
$env:LOGLEVEL='debug'; pnpm start -i

# To set log level permanently in PowerShell:
$env:LOGLEVEL='none'  # or 'error', 'info', 'debug'
```

### Command Line Interface

```bash
# Set RGB color (HSV values: 0-255)
pnpm start -c 0,255,255    # Red
pnpm start -c 85,255,255   # Green
pnpm start -c 170,255,255  # Blue

# Toggle Skadis display mode
pnpm start -s on
pnpm start -s off

# Toggle white mode (in Skadis mode)
pnpm start -w on
pnpm start -w off

# Set RGB effect (1-42)
pnpm start -e 1    # Static Light
pnpm start -e 2    # Breathing 1
# See effect list below for all options

# Set animation speed (0-255)
pnpm start -a 128  # Medium speed
```

### Interactive UI Controls

#### Main Menu

- Tab/Shift+Tab: Navigate menu items
- Enter: Select menu item
- Left/Right Arrow: Adjust animation speed
- H: Show/hide help screen
- Q: Quit application

#### Effect Selection

- Up/Down: Navigate effects
- Enter: Select effect
- Esc: Cancel and restore previous effect
- Live preview while navigating

#### Color Control

- Tab: Switch between Hue/Saturation/Brightness controls
- Left/Right Arrow: Adjust hue (when active)
- Up/Down Arrow: Adjust saturation (when active)
- B/D Keys: Increase/decrease brightness
- Quick color shortcuts:
  - R: Red
  - G: Green
  - B: Blue
  - W: White
  - Y: Yellow
  - P: Purple
  - C: Cyan

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

## Troubleshooting

1. Ensure keyboard is connected and powered on
2. Run with administrator privileges on Windows
3. Set up proper udev rules on Linux:

```bash
# /etc/udev/rules.d/50-qmk.rules
KERNEL=="hidraw*", ATTRS{idVendor}=="4648", ATTRS{idProduct}=="0001", MODE="0666"
```

4. Verify QMK firmware has Raw HID enabled in `rules.mk`:

```make
RAW_ENABLE = yes
RGBLIGHT_ENABLE = yes
RGBLIGHT_ANIMATIONS = yes
```

## Development

```bash
# Watch mode during development
pnpm dev

# Build for production
pnpm build
```

## Dependencies

- node-hid: HID device communication
- commander: CLI argument parsing
- ink & react: Interactive terminal UI
- TypeScript: Type safety and modern JavaScript features

## License

ISC
