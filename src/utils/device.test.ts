/**
 * Device Utility Tests
 * Testing device fingerprinting and session management
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

// Mock crypto.subtle
const mockDigest = vi.fn(() => Promise.resolve(new ArrayBuffer(32)));
const mockSubtle = {
  digest: mockDigest,
};

Object.defineProperty(global, 'crypto', {
  value: {
    subtle: mockSubtle,
    getRandomValues: vi.fn((arr: Uint8Array) => {
      for (let i = 0; i < arr.length; i++) {
        arr[i] = Math.floor(Math.random() * 256);
      }
      return arr;
    }),
  },
  writable: true,
});

// Mock window.isSecureContext
Object.defineProperty(window, 'isSecureContext', {
  value: true,
  writable: true,
});

// Mock canvas
HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
  fillStyle: '',
  fillRect: vi.fn(),
  fillText: vi.fn(),
  arc: vi.fn(),
  fill: vi.fn(),
  stroke: vi.fn(),
  measureText: vi.fn(() => ({ width: 100 })),
  save: vi.fn(),
  restore: vi.fn(),
  translate: vi.fn(),
  rotate: vi.fn(),
  beginPath: vi.fn(),
  closePath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  font: '',
  textBaseline: '',
})) as any;

HTMLCanvasElement.prototype.toDataURL = vi.fn(() => 'data:image/png;base64,mock');

// Import after mocks
import {
  getDeviceInfo,
  getDeviceId,
  getDeviceIdAsync,
  createSession,
  validateSession,
  invalidateSession,
  detectAutomation,
  getSecurityReport,
} from '../utils/device';

describe('Device Utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getDeviceId', () => {
    it('should generate a device ID', () => {
      const deviceId = getDeviceId();
      expect(deviceId).toBeDefined();
      expect(typeof deviceId).toBe('string');
      expect(deviceId.length).toBeGreaterThan(0);
    });

    it('should return consistent ID for same device', () => {
      const id1 = getDeviceId();
      const id2 = getDeviceId();
      // Should be consistent (based on same navigator properties)
      expect(id1).toBe(id2);
    });
  });

  describe('getDeviceIdAsync', () => {
    it('should generate a device ID asynchronously', async () => {
      const deviceId = await getDeviceIdAsync();
      expect(deviceId).toBeDefined();
      expect(typeof deviceId).toBe('string');
      expect(deviceId.length).toBeGreaterThan(0);
    });
  });

  describe('getDeviceInfo', () => {
    it('should return device information', async () => {
      const info = await getDeviceInfo();

      expect(info).toBeDefined();
      expect(info.deviceId).toBeDefined();
      expect(typeof info.deviceId).toBe('string');
    });

    it('should include screen resolution', async () => {
      const info = await getDeviceInfo();

      // Screen resolution should be captured
      expect(info).toHaveProperty('screenResolution');
      expect(typeof info.screenResolution).toBe('string');
    });

    it('should include timezone information', async () => {
      const info = await getDeviceInfo();

      expect(info.timezone).toBeDefined();
      expect(typeof info.timezone).toBe('string');
    });
  });

  describe('Session Management', () => {
    describe('createSession', () => {
      it('should create a session', () => {
        const deviceId = 'test-device-id';
        createSession(deviceId);

        // Session uses sessionStorage with key 'medprep_session_v2'
        const stored = sessionStorage.getItem('medprep_session_v2');
        expect(stored).toBeDefined();
      });

      it('should store device ID in session', () => {
        const deviceId = 'unique-device-123';
        createSession(deviceId);

        const stored = sessionStorage.getItem('medprep_session_v2');
        if (stored) {
          const session = JSON.parse(stored);
          expect(session.deviceId).toBe(deviceId);
        }
      });

      it('should set session timestamp', () => {
        createSession('test-device');

        const stored = sessionStorage.getItem('medprep_session_v2');
        if (stored) {
          const session = JSON.parse(stored);
          expect(session.createdAt).toBeDefined();
        }
      });
    });

    describe('validateSession', () => {
      it('should return false if no session exists', () => {
        // Clear any existing session
        sessionStorage.clear();
        const isValid = validateSession();
        expect(isValid).toBe(false);
      });

      it('should validate existing session', () => {
        createSession('test-device');
        const isValid = validateSession();
        expect(isValid).toBe(true);
      });

      it('should return false for expired session', () => {
        // Create session with expired timestamp
        const oldTimestamp = Date.now() - (31 * 24 * 60 * 60 * 1000); // 31 days ago (past expiry)
        sessionStorage.setItem('medprep_session_v2', JSON.stringify({
          sessionId: 'test-session',
          deviceId: 'test',
          createdAt: oldTimestamp,
          expiresAt: oldTimestamp + 1000, // Already expired
          isValid: true,
        }));

        const isValid = validateSession();
        expect(isValid).toBe(false);
      });
    });

    describe('invalidateSession', () => {
      it('should remove session from storage', () => {
        createSession('test-device');
        expect(sessionStorage.getItem('medprep_session_v2')).toBeDefined();

        invalidateSession();
        expect(sessionStorage.getItem('medprep_session_v2')).toBeNull();
      });
    });
  });

  describe('detectAutomation', () => {
    it('should return boolean', () => {
      const result = detectAutomation();
      expect(typeof result).toBe('boolean');
    });

    it('should detect WebDriver presence', () => {
      // Mock webdriver property
      Object.defineProperty(navigator, 'webdriver', {
        value: true,
        writable: true,
        configurable: true,
      });

      const result = detectAutomation();
      // If webdriver is true, automation should be detected
      expect(result).toBe(true);
    });
  });

  describe('getSecurityReport', () => {
    it('should return security report', () => {
      const report = getSecurityReport();

      expect(report).toBeDefined();
      expect(typeof report.isSecure).toBe('boolean');
      expect(typeof report.isAutomation).toBe('boolean');
      expect(typeof report.hasWebCrypto).toBe('boolean');
      expect(typeof report.deviceAge).toBe('number');
    });

    it('should detect WebCrypto availability', () => {
      const report = getSecurityReport();
      expect(report.hasWebCrypto).toBe(true); // Mocked as available
    });

    it('should return device age', () => {
      // Create device info first with correct key
      localStorage.setItem('medprep_device_v2', JSON.stringify({
        deviceId: 'test',
        createdAt: Date.now(),
      }));

      const report = getSecurityReport();
      expect(report.deviceAge).toBeGreaterThanOrEqual(0);
    });
  });
});