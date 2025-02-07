# Keyboard LED Control Application

This application provides a graphical interface to control the RGB LED features of your QMK keyboard through Raw HID commands.

## Features

- Toggle Skadis Mode
- Toggle White Mode (when in Skadis Mode)
- Control RGB colors using HSV values
- Set various RGB effects
- Adjust animation speed
- Real-time color updates

## Setup

1. Install Python 3.7 or higher (make sure it includes tkinter, which is included by default in most Python distributions)
2. Install the required dependencies:

   ```bash
   pip install -r requirements.txt
   ```

   Note: If you get permission errors, you may need to use `pip install --user -r requirements.txt` instead.

3. Update the vendor_id and product_id in `keyboard_led_control.py` to match your keyboard's values:

   ```python
   self.vendor_id = 0x4648  # Update this to match your keyboard's vendor ID
   self.product_id = 0x0001  # Update this to match your keyboard's product ID
   ```

   You can find these values:

   - On Windows: Device Manager > Human Interface Devices > Right-click your keyboard > Properties > Details > Hardware Ids
   - On Linux: Run `lsusb` in terminal
   - On macOS: Apple menu > About This Mac > System Report > USB

## Usage

1. Make sure your keyboard is connected and has the QMK firmware with Raw HID support enabled
2. Run the application:

   ```bash
   python keyboard_led_control.py
   ```

   Note: On some systems, you might need to use `python3` instead of `python`.

3. Use the GUI to control your keyboard's LED features:
   - Toggle Skadis Mode and White Mode using checkboxes
   - Adjust HSV values using sliders
   - Select RGB effects from the dropdown menu
   - Control animation speed with the slider

## Troubleshooting

1. If the application can't find your keyboard:

   - Verify the vendor_id and product_id are correct
   - Ensure your keyboard firmware has Raw HID enabled
   - Try running the application with administrator/root privileges
   - On Linux, you may need to add udev rules for HID access

2. If you get "ImportError: No module named 'tkinter'":

   - On Ubuntu/Debian: Install tkinter with `sudo apt-get install python3-tk`
   - On Fedora: Install tkinter with `sudo dnf install python3-tkinter`
   - On macOS: Reinstall Python from python.org to include tkinter

3. If commands aren't working:
   - Make sure Skadis Mode is enabled for most features
   - Check that your keyboard firmware supports all the implemented commands

## Contributing

Feel free to submit issues and pull requests for new features or bug fixes.
