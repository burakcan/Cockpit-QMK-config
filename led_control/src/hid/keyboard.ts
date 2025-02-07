import HID from 'node-hid';

export interface Version {
  major: number;
  minor: number;
  patch: number;
}

export class KeyboardHID {
  private device: HID.HID | null = null;
  
  // Command constants
  private static readonly VID = 0x4648;
  private static readonly PID = 0x0001;
  private static readonly REPORT_SIZE = 33;
  private static readonly CMD_SKADIS_MODE = 0x01;
  private static readonly CMD_WHITE_MODE = 0x02;
  private static readonly CMD_RGB_EFFECT = 0x03;
  private static readonly CMD_RGB_COLOR = 0x04;
  private static readonly CMD_ANIMATION_SPEED = 0x05;
  private static readonly CMD_SET_DIRECTION = 0x06;
  private static readonly CMD_GET_VERSION = 0x0E;
  private static readonly CMD_GET_STATE = 0x0F;

  constructor() {
    this.connect();
  }

  private connect() {
    try {
      const allDevices = HID.devices();
      console.log('Available HID devices:', allDevices);

      // Filter for Raw HID interface
      const devices = allDevices.filter(d => 
        d.vendorId === KeyboardHID.VID && 
        d.productId === KeyboardHID.PID &&
        d.usagePage === 0xFF60 && // 65376 in decimal
        d.usage === 0x61        // 97 in decimal
      );
      console.log('Filtered keyboard devices:', devices);

      if (devices.length === 0) {
        throw new Error('No Raw HID interface found');
      }

      const devicePath = devices[0].path;
      if (!devicePath) {
        throw new Error('Device path is undefined');
      }

      try {
        this.device = new HID.HID(devicePath);
        console.log('Successfully connected to Raw HID interface at path:', devicePath);
      } catch (e: unknown) {
        console.error('Failed to open HID device:', e);
        throw new Error(`Failed to open HID device: ${e instanceof Error ? e.message : 'Unknown error'}`);
      }

    } catch (e: unknown) {
      console.error('Failed to connect:', e);
      if (e instanceof Error) {
        throw new Error(`Keyboard connection failed: ${e.message}`);
      }
      throw new Error('Keyboard connection failed: Unknown error');
    }
  }

  private async sendCommandWithResponse(cmd: number, ...args: number[]): Promise<number[]> {
    if (!this.device) {
      throw new Error('No device connected');
    }

    try {
      const report = new Array(KeyboardHID.REPORT_SIZE).fill(0);
      report[1] = cmd;
      args.forEach((arg, i) => report[i + 2] = arg);

      console.log('Sending HID report:', report);
      this.device.write(report);
      
      // Wait for response
      const response = await this.device.readTimeout(1000);
      console.log('Received response:', response);

      if (response[0] !== cmd) {
        throw new Error('Invalid response command');
      }

      return response;
    } catch (e) {
      console.error('Failed to send command:', e);
      if (e instanceof Error) {
        throw new Error(`Failed to send command: ${e.message}`);
      }
      throw new Error('Failed to send command: Unknown error');
    }
  }

  // Add reconnection method
  public reconnect() {
    console.log('Attempting to reconnect...');
    if (this.device) {
      try {
        this.device.close();
      } catch (e: unknown) {
        console.warn('Error closing existing device:', e);
      }
      this.device = null;
    }
    this.connect();
  }

  async setSkadisMode(enabled: boolean) {
    const response = await this.sendCommandWithResponse(0x01, enabled ? 1 : 0);
    return Boolean(response[1]);
  }

  async setWhiteMode(enabled: boolean) {
    const response = await this.sendCommandWithResponse(0x02, enabled ? 1 : 0);
    return Boolean(response[1]);
  }

  async setRGBEffect(mode: number) {
    const response = await this.sendCommandWithResponse(0x03, mode);
    return response[1];
  }

  async setRGBColor(h: number, s: number, v: number) {
    const response = await this.sendCommandWithResponse(0x04, h, s, v);
    return {
      hue: response[1],
      saturation: response[2],
      value: response[3]
    };
  }

  async setAnimationSpeed(speed: number) {
    const response = await this.sendCommandWithResponse(0x05, speed);
    return response[1];
  }

  async getCurrentState() {
    if (!this.device) throw new Error('No device connected');
    
    try {
      const response = await this.sendCommandWithResponse(0x0F);
      
      return {
        mode: response[1],
        hue: response[2],
        saturation: response[3],
        value: response[4],
        speed: response[5],
        skadisMode: Boolean(response[6]),
        whiteMode: Boolean(response[7])
      };
    } catch (e) {
      console.error('Failed to get current state:', e);
      throw new Error(`Failed to get current state: ${e instanceof Error ? e.message : 'Unknown error'}`);
    }
  }

  // Add method to validate connection
  async validateConnection(): Promise<boolean> {
    try {
      await this.getCurrentState();
      return true;
    } catch {
      return false;
    }
  }

  // Add method to ensure connection
  async ensureConnection() {
    if (!await this.validateConnection()) {
      this.reconnect();
      if (!await this.validateConnection()) {
        throw new Error('Failed to establish connection with keyboard');
      }
    }
  }

  // Add new command for direction control
  async setEffectDirection(reverse: boolean) {
    const response = await this.sendCommandWithResponse(
      KeyboardHID.CMD_SET_DIRECTION, 
      reverse ? 1 : 0
    );
    // Just return the requested state since we can't get actual state
    return reverse;
  }

  async getVersion(): Promise<Version> {
    const response = await this.sendCommandWithResponse(KeyboardHID.CMD_GET_VERSION);
    return {
      major: response[1],
      minor: response[2],
      patch: response[3]
    };
  }
} 