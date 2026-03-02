// src/lib/device.ts
export const getDeviceId = (): string => {
  let deviceId = localStorage.getItem('medprep_device_id');

  if (!deviceId) {
    // Fingerprint sederhana tapi sangat unik
    const fingerprint = [
      navigator.userAgent,
      screen.width,
      screen.height,
      navigator.platform,
      new Date().getTimezoneOffset()
    ].join('|');

    deviceId = btoa(fingerprint).slice(0, 32);
    localStorage.setItem('medprep_device_id', deviceId);
  }

  return deviceId;
};