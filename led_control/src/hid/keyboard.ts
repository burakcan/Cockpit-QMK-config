import HID from 'node-hid';

export class KeyboardHID {
  private device: HID.HID | null = null;
  private static readonly VID = 0x4648;
  private static readonly PID = 0x0001;
  private static readonly REPORT_SIZE = 33;

  constructor() {
    this.connect();
  }

  private connect() {
    try {
      const devices = HID.devices().filter(d => d.vendorId === KeyboardHID.VID && d.productId === KeyboardHID.PID);
      if (devices.length === 0) throw new Error('No keyboard found');
      this.device = new HID.HID(devices[0].path!);
    } catch (e) {
      console.error('Failed to connect:', e);
      process.exit(1);
    }
  }

  private sendCommand(cmd: number, ...args: number[]) {
    if (!this.device) throw new Error('No device connected');
    const report = new Array(KeyboardHID.REPORT_SIZE).fill(0);
    report[1] = cmd;
    args.forEach((arg, i) => report[i + 2] = arg);
    this.device.write(report);
  }

  setSkadisMode(enabled: boolean) { this.sendCommand(0x01, enabled ? 1 : 0); }
  setWhiteMode(enabled: boolean) { this.sendCommand(0x02, enabled ? 1 : 0); }
  setRGBEffect(mode: number) { this.sendCommand(0x03, mode); }
  setRGBColor(h: number, s: number, v: number) { this.sendCommand(0x04, h, s, v); }
  setAnimationSpeed(speed: number) { this.sendCommand(0x05, speed); }
} 