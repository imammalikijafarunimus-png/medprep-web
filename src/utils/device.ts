// src/utils/device.ts
export const getDeviceId = (): string => {
    const STORAGE_KEY = 'medprep_device_id';
    let deviceId = localStorage.getItem(STORAGE_KEY);
    
    if (!deviceId) {
      // Generate ID acak sederhana jika belum ada
      deviceId = Date.now().toString(36) + Math.random().toString(36).substr(2);
      localStorage.setItem(STORAGE_KEY, deviceId);
    }
    
    return deviceId;
  };