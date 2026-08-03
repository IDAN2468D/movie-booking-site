export interface SmartHomeLightState {
  connected: boolean;
  deviceName?: string;
  rgbColor: [number, number, number];
  intensity: number;
}

export class SmartHomeSyncEngine {
  private device: any = null;
  private gattServer: any = null;

  public async connectBluetoothLight(): Promise<{ success: boolean; deviceName?: string; error?: string }> {
    if (typeof window === 'undefined' || !(navigator as any).bluetooth) {
      return { success: false, error: 'Web Bluetooth API isn not supported on this browser.' };
    }

    try {
      this.device = await (navigator as any).bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ['0000181a-0000-1000-8000-00805f9b34fb']
      });

      if (this.device) {
        this.gattServer = await this.device.gatt.connect();
        return { success: true, deviceName: this.device.name || 'Smart Light Ambient' };
      }
      return { success: false, error: 'No device selected' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Bluetooth connection failed' };
    }
  }

  public syncSceneMetadata(rgb: [number, number, number], vibrationPattern: number[] = [100, 50, 100]) {
    // Sync browser screen ambient lighting
    if (typeof window !== 'undefined') {
      document.documentElement.style.setProperty('--ambient-rgb', `${rgb[0]}, ${rgb[1]}, ${rgb[2]}`);

      // Haptic feedback trigger
      if (navigator.vibrate) {
        navigator.vibrate(vibrationPattern);
      }
    }
  }

  public disconnect() {
    if (this.gattServer && this.gattServer.connected) {
      this.gattServer.disconnect();
    }
    this.device = null;
  }
}

export const smartHomeSyncEngine = new SmartHomeSyncEngine();
