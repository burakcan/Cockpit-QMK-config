import tkinter as tk
from tkinter import ttk
import hid
import colorsys

class KeyboardController:
    # QMK Raw HID commands
    CMD_SKADIS_MODE = 0x01
    CMD_WHITE_MODE = 0x02
    CMD_RGB_EFFECT = 0x03
    CMD_RGB_COLOR = 0x04
    CMD_RGB_ANIMATION = 0x05

    def __init__(self):
        # Update these with your keyboard's values
        self.vendor_id = 0x4648  # Replace with your keyboard's vendor ID
        self.product_id = 0x0001  # Replace with your keyboard's product ID
        self.usage_page = 0xFF60
        self.usage = 0x61
        self.device = None
        self.connect()

    def connect(self):
        """Connect to the keyboard"""
        try:
            # Find all HID devices
            devices = hid.enumerate(self.vendor_id, self.product_id)
            # Filter for Raw HID interface
            raw_hid_devices = [d for d in devices if d['usage_page'] == self.usage_page and d['usage'] == self.usage]
            
            if raw_hid_devices:
                self.device = hid.Device(path=raw_hid_devices[0]['path'])
                print("Connected to keyboard")
                return True
            else:
                print("No compatible keyboard found")
                return False
        except Exception as e:
            print(f"Error connecting to keyboard: {e}")
            return False

    def send_command(self, command, *args):
        """Send a command to the keyboard"""
        if not self.device:
            print("No keyboard connected")
            return None

        # Prepare the report (32 bytes, first byte is report ID)
        report = [0x00] * 33  # 32 bytes + 1 report ID byte
        report[1] = command  # Command goes after report ID
        
        # Add arguments
        for i, arg in enumerate(args):
            report[i + 2] = arg

        try:
            self.device.write(report)
            response = self.device.read(32, timeout=1000)
            return response
        except Exception as e:
            print(f"Error sending command: {e}")
            return None

    def set_skadis_mode(self, enabled):
        return self.send_command(self.CMD_SKADIS_MODE, 1 if enabled else 0)

    def set_white_mode(self, enabled):
        return self.send_command(self.CMD_WHITE_MODE, 1 if enabled else 0)

    def set_rgb_effect(self, mode):
        return self.send_command(self.CMD_RGB_EFFECT, mode)

    def set_rgb_color(self, h, s, v):
        return self.send_command(self.CMD_RGB_COLOR, h, s, v)

    def set_animation_speed(self, speed):
        return self.send_command(self.CMD_RGB_ANIMATION, speed)

class App:
    def __init__(self, root):
        self.root = root
        self.root.title("Keyboard LED Control")
        self.controller = KeyboardController()
        
        # Create main frame
        self.main_frame = ttk.Frame(root, padding="10")
        self.main_frame.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        
        # Mode controls
        self.create_mode_controls()
        
        # Color controls
        self.create_color_controls()
        
        # Effect controls
        self.create_effect_controls()
        
        # Animation speed control
        self.create_animation_controls()

    def create_mode_controls(self):
        mode_frame = ttk.LabelFrame(self.main_frame, text="Mode Controls", padding="5")
        mode_frame.grid(row=0, column=0, columnspan=2, sticky=(tk.W, tk.E), pady=5)
        
        self.skadis_var = tk.BooleanVar()
        ttk.Checkbutton(mode_frame, text="Skadis Mode", variable=self.skadis_var,
                       command=lambda: self.controller.set_skadis_mode(self.skadis_var.get())).grid(row=0, column=0)
        
        self.white_var = tk.BooleanVar()
        ttk.Checkbutton(mode_frame, text="White Mode", variable=self.white_var,
                       command=lambda: self.controller.set_white_mode(self.white_var.get())).grid(row=0, column=1)

    def create_color_controls(self):
        color_frame = ttk.LabelFrame(self.main_frame, text="Color Controls", padding="5")
        color_frame.grid(row=1, column=0, columnspan=2, sticky=(tk.W, tk.E), pady=5)
        
        # HSV sliders
        self.hue_var = tk.IntVar(value=0)
        ttk.Label(color_frame, text="Hue:").grid(row=0, column=0)
        ttk.Scale(color_frame, from_=0, to=255, variable=self.hue_var, orient=tk.HORIZONTAL,
                 command=lambda _: self.update_color()).grid(row=0, column=1, sticky=(tk.W, tk.E))
        
        self.sat_var = tk.IntVar(value=255)
        ttk.Label(color_frame, text="Saturation:").grid(row=1, column=0)
        ttk.Scale(color_frame, from_=0, to=255, variable=self.sat_var, orient=tk.HORIZONTAL,
                 command=lambda _: self.update_color()).grid(row=1, column=1, sticky=(tk.W, tk.E))
        
        self.val_var = tk.IntVar(value=255)
        ttk.Label(color_frame, text="Value:").grid(row=2, column=0)
        ttk.Scale(color_frame, from_=0, to=255, variable=self.val_var, orient=tk.HORIZONTAL,
                 command=lambda _: self.update_color()).grid(row=2, column=1, sticky=(tk.W, tk.E))

    def create_effect_controls(self):
        effect_frame = ttk.LabelFrame(self.main_frame, text="Effect Controls", padding="5")
        effect_frame.grid(row=2, column=0, columnspan=2, sticky=(tk.W, tk.E), pady=5)
        
        self.effect_var = tk.IntVar(value=1)
        effects = [
            "Static",
            "Breathing",
            "Rainbow Mood",
            "Rainbow Swirl",
            "Snake",
            "Knight",
            "Christmas",
            "Static Gradient",
            "RGB Test",
            "Alternating",
            "Twinkle"
        ]
        
        ttk.Label(effect_frame, text="Effect:").grid(row=0, column=0)
        effect_menu = ttk.OptionMenu(effect_frame, self.effect_var, effects[0], *effects,
                                   command=lambda _: self.controller.set_rgb_effect(self.effect_var.get()))
        effect_menu.grid(row=0, column=1, sticky=(tk.W, tk.E))

    def create_animation_controls(self):
        anim_frame = ttk.LabelFrame(self.main_frame, text="Animation Speed", padding="5")
        anim_frame.grid(row=3, column=0, columnspan=2, sticky=(tk.W, tk.E), pady=5)
        
        self.speed_var = tk.IntVar(value=128)
        ttk.Scale(anim_frame, from_=0, to=255, variable=self.speed_var, orient=tk.HORIZONTAL,
                 command=lambda _: self.controller.set_animation_speed(self.speed_var.get())).grid(row=0, column=0, sticky=(tk.W, tk.E))

    def update_color(self):
        self.controller.set_rgb_color(
            self.hue_var.get(),
            self.sat_var.get(),
            self.val_var.get()
        )

if __name__ == "__main__":
    root = tk.Tk()
    app = App(root)
    root.mainloop() 