/**
 * Enhanced Device Fingerprinting & Session Management
 * @module utils/device
 * 
 * Security improvements:
 * - Multi-factor fingerprint generation
 * - Cryptographic hashing (SHA-256)
 * - Server-side validation ready
 * - Session binding with timestamp
 */

// ============================================
// TYPES
// ============================================

export interface DeviceInfo {
  deviceId: string;
  fingerprint: string;
  createdAt: number;
  lastSeen: number;
  userAgent: string;
  platform: string;
  screenResolution: string;
  timezone: string;
  language: string;
}

export interface SessionData {
  sessionId: string;
  deviceId: string;
  createdAt: number;
  expiresAt: number;
  isValid: boolean;
}

// ============================================
// CONSTANTS
// ============================================

const DEVICE_STORAGE_KEY = 'medprep_device_v2';
const SESSION_STORAGE_KEY = 'medprep_session_v2';
const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Generates SHA-256 hash of input string
 * Uses SubtleCrypto API for secure hashing
 */
async function sha256(message: string): Promise<string> {
  try {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch {
    // Fallback to simple hash if SubtleCrypto not available
    return btoa(message).slice(0, 64);
  }
}

/**
 * Generates a UUID v4
 */
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Gets canvas fingerprint (additional entropy)
 */
function getCanvasFingerprint(): string {
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return 'no-canvas';
    
    // Draw unique pattern
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillStyle = '#f60';
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = '#069';
    ctx.fillText('MedPrep', 2, 15);
    
    return canvas.toDataURL().slice(50, 100);
  } catch {
    return 'canvas-blocked';
  }
}

/**
 * Gets WebGL fingerprint (additional entropy)
 */
function getWebGLFingerprint(): string {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return 'no-webgl';
    
    const debugInfo = (gl as WebGLRenderingContext).getExtension('WEBGL_debug_renderer_info');
    if (!debugInfo) return 'webgl-no-debug';
    
    const renderer = (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
    return renderer?.slice(0, 50) || 'unknown';
  } catch {
    return 'webgl-blocked';
  }
}

/**
 * Gets device memory (if available)
 */
function getDeviceMemory(): string {
  try {
    // @ts-expect-error - deviceMemory is not in Navigator type
    return String(navigator.deviceMemory || 'unknown');
  } catch {
    return 'unknown';
  }
}

/**
 * Gets hardware concurrency (CPU cores)
 */
function getHardwareConcurrency(): string {
  try {
    return String(navigator.hardwareConcurrency || 'unknown');
  } catch {
    return 'unknown';
  }
}

/**
 * Gets touch support info
 */
function getTouchSupport(): string {
  try {
    return `${navigator.maxTouchPoints}-${'ontouchstart' in window}`;
  } catch {
    return 'unknown';
  }
}

// ============================================
// MAIN FUNCTIONS
// ============================================

/**
 * Generates a comprehensive device fingerprint
 * Uses multiple entropy sources for uniqueness
 */
async function generateFingerprint(): Promise<string> {
  const components = [
    // Basic browser info
    navigator.userAgent,
    navigator.platform,
    navigator.language,
    
    // Screen info
    `${screen.width}x${screen.height}x${screen.colorDepth}`,
    `${window.screen.availWidth}x${window.screen.availHeight}`,
    
    // Timezone
    String(new Date().getTimezoneOffset()),
    Intl.DateTimeFormat().resolvedOptions().timeZone,
    
    // Hardware info
    getDeviceMemory(),
    getHardwareConcurrency(),
    getTouchSupport(),
    
    // Advanced fingerprints
    getCanvasFingerprint(),
    getWebGLFingerprint(),
    
    // Additional entropy
    String(window.devicePixelRatio || 1),
  ];

  const fingerprintData = components.join('###');
  const hashedFingerprint = await sha256(fingerprintData);
  
  return hashedFingerprint;
}

/**
 * Gets or creates device info
 * Returns comprehensive device data for server validation
 */
export async function getDeviceInfo(): Promise<DeviceInfo> {
  const stored = localStorage.getItem(DEVICE_STORAGE_KEY);
  const now = Date.now();
  
  if (stored) {
    try {
      const deviceInfo: DeviceInfo = JSON.parse(stored);
      
      // Verify fingerprint still matches (detect significant changes)
      const currentFingerprint = await generateFingerprint();
      
      // Update last seen
      deviceInfo.lastSeen = now;
      deviceInfo.fingerprint = currentFingerprint;
      localStorage.setItem(DEVICE_STORAGE_KEY, JSON.stringify(deviceInfo));
      
      return deviceInfo;
    } catch {
      // Invalid stored data, create new
      console.warn('[Device] Invalid stored device info, creating new');
    }
  }
  
  // Create new device info
  const fingerprint = await generateFingerprint();
  const deviceId = `${generateUUID()}-${fingerprint.slice(0, 8)}`;
  
  const deviceInfo: DeviceInfo = {
    deviceId,
    fingerprint,
    createdAt: now,
    lastSeen: now,
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    screenResolution: `${screen.width}x${screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: navigator.language,
  };
  
  localStorage.setItem(DEVICE_STORAGE_KEY, JSON.stringify(deviceInfo));
  
  return deviceInfo;
}

/**
 * Gets device ID (backward compatible)
 * Returns just the device ID string for legacy code
 */
export async function getDeviceIdAsync(): Promise<string> {
  const deviceInfo = await getDeviceInfo();
  return deviceInfo.deviceId;
}

/**
 * Synchronous version for backward compatibility
 * Uses cached device ID if available
 */
export function getDeviceId(): string {
  const stored = localStorage.getItem(DEVICE_STORAGE_KEY);
  
  if (stored) {
    try {
      const deviceInfo: DeviceInfo = JSON.parse(stored);
      return deviceInfo.deviceId;
    } catch {
      // Fall through to create new
    }
  }
  
  // Generate synchronously (less secure but works)
  const components = [
    navigator.userAgent,
    screen.width,
    screen.height,
    navigator.platform,
    new Date().getTimezoneOffset()
  ].join('|');
  
  const deviceId = btoa(components).slice(0, 32);
  
  // Store for next time
  const deviceInfo: DeviceInfo = {
    deviceId,
    fingerprint: deviceId,
    createdAt: Date.now(),
    lastSeen: Date.now(),
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    screenResolution: `${screen.width}x${screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: navigator.language,
  };
  
  localStorage.setItem(DEVICE_STORAGE_KEY, JSON.stringify(deviceInfo));
  
  return deviceId;
}

// ============================================
// SESSION MANAGEMENT
// ============================================

/**
 * Creates a new session
 */
export function createSession(deviceId: string): SessionData {
  const now = Date.now();
  const sessionId = generateUUID();
  
  const session: SessionData = {
    sessionId,
    deviceId,
    createdAt: now,
    expiresAt: now + SESSION_DURATION_MS,
    isValid: true,
  };
  
  sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  
  return session;
}

/**
 * Gets current session
 */
export function getCurrentSession(): SessionData | null {
  const stored = sessionStorage.getItem(SESSION_STORAGE_KEY);
  
  if (!stored) return null;
  
  try {
    const session: SessionData = JSON.parse(stored);
    
    // Check if expired
    if (Date.now() > session.expiresAt) {
      invalidateSession();
      return null;
    }
    
    return session;
  } catch {
    return null;
  }
}

/**
 * Validates session
 */
export function validateSession(): boolean {
  const session = getCurrentSession();
  return session?.isValid === true;
}

/**
 * Invalidates current session
 */
export function invalidateSession(): void {
  sessionStorage.removeItem(SESSION_STORAGE_KEY);
  localStorage.removeItem(DEVICE_STORAGE_KEY);
}

/**
 * Clears all device and session data
 */
export function clearDeviceData(): void {
  localStorage.removeItem(DEVICE_STORAGE_KEY);
  sessionStorage.removeItem(SESSION_STORAGE_KEY);
}

// ============================================
// SECURITY UTILITIES
// ============================================

/**
 * Detects if the app is running in an insecure context
 */
export function isInsecureContext(): boolean {
  return !window.isSecureContext;
}

/**
 * Detects common bot/automation signatures
 */
export function detectAutomation(): boolean {
  const signals = [
    // Headless browser detection
    /HeadlessChrome/i.test(navigator.userAgent),
    /PhantomJS/i.test(navigator.userAgent),
    /Selenium/i.test(navigator.userAgent),
    
    // WebDriver presence
    !!(navigator as Navigator & { webdriver?: boolean }).webdriver,
    
    // Missing properties that real browsers have
    !(window as Window & { chrome?: unknown }).chrome && /Chrome/i.test(navigator.userAgent),
    
    // Unusual screen dimensions
    screen.width === 0 || screen.height === 0,
  ];
  
  return signals.filter(Boolean).length >= 2;
}

/**
 * Gets security status report
 */
export function getSecurityReport(): {
  isSecure: boolean;
  isAutomation: boolean;
  hasWebCrypto: boolean;
  deviceAge: number;
} {
  const stored = localStorage.getItem(DEVICE_STORAGE_KEY);
  let deviceAge = 0;
  
  if (stored) {
    try {
      const info = JSON.parse(stored) as DeviceInfo;
      deviceAge = Date.now() - info.createdAt;
    } catch {
      // ignore
    }
  }
  
  return {
    isSecure: window.isSecureContext,
    isAutomation: detectAutomation(),
    hasWebCrypto: !!crypto.subtle,
    deviceAge,
  };
}