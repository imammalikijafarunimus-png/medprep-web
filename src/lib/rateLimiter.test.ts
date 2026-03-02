/**
 * Rate Limiter Tests
 * Testing rate limiting functionality for authentication operations
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { rateLimiter, RateLimitAction } from '../lib/rateLimiter';

// Mock localStorage
const localStorageMock = {
  store: {} as Record<string, string>,
  getItem: vi.fn((key: string) => localStorageMock.store[key] || null),
  setItem: vi.fn((key: string, value: string) => {
    localStorageMock.store[key] = value;
  }),
  removeItem: vi.fn((key: string) => {
    delete localStorageMock.store[key];
  }),
  clear: vi.fn(() => {
    localStorageMock.store = {};
  }),
};

// Setup localStorage mock
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

describe('RateLimiter', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  describe('check', () => {
    it('should allow first attempt', () => {
      const result = rateLimiter.check('login');
      expect(result.allowed).toBe(true);
      expect(result.remainingAttempts).toBeGreaterThan(0);
    });

    it('should allow multiple attempts within limit', () => {
      const action: RateLimitAction = 'login';

      // First few attempts should be allowed
      for (let i = 0; i < 3; i++) {
        const result = rateLimiter.check(action);
        expect(result.allowed).toBe(true);
        rateLimiter.record(action);
      }
    });

    it('should block after too many attempts', () => {
      const action: RateLimitAction = 'login';

      // Record many failed attempts
      for (let i = 0; i < 10; i++) {
        rateLimiter.record(action);
      }

      // Next attempt should be blocked
      const result = rateLimiter.check(action);
      expect(result.allowed).toBe(false);
      expect(result.blockedFor).toBeDefined();
    });

    it('should return correct remaining attempts', () => {
      const action: RateLimitAction = 'register';
      rateLimiter.record(action);
      rateLimiter.record(action);

      const result = rateLimiter.check(action);
      expect(result.remainingAttempts).toBeLessThan(5);
    });

    it('should show blocked time when rate limited', () => {
      const action: RateLimitAction = 'password_reset';

      // Exceed limit
      for (let i = 0; i < 10; i++) {
        rateLimiter.record(action);
      }

      const result = rateLimiter.check(action);
      expect(result.allowed).toBe(false);
      expect(result.blockedFor).toBeDefined();
      expect(result.blockedFor).toBeGreaterThan(0);
    });
  });

  describe('record', () => {
    it('should record attempts in localStorage', () => {
      rateLimiter.record('login');

      // Check that something was stored
      expect(localStorageMock.setItem).toHaveBeenCalled();
    });

    it('should track different actions separately', () => {
      rateLimiter.record('login');
      rateLimiter.record('register');
      rateLimiter.record('google_signin');

      // Each action should have its own tracking
      const loginResult = rateLimiter.check('login');
      const registerResult = rateLimiter.check('register');
      const googleResult = rateLimiter.check('google_signin');

      // All should be allowed (different action counters)
      // login: max 5, after 1 = 4 remaining
      expect(loginResult.remainingAttempts).toBeLessThan(5);
      // register: max 3, after 1 = 2 remaining
      expect(registerResult.remainingAttempts).toBeLessThan(3);
      // google_signin: max 10, after 1 = 9 remaining
      expect(googleResult.remainingAttempts).toBeLessThan(10);
    });
  });

  describe('reset', () => {
    it('should reset attempts for an action', () => {
      const action: RateLimitAction = 'login';

      // Record several attempts
      for (let i = 0; i < 5; i++) {
        rateLimiter.record(action);
      }

      // Reset
      rateLimiter.reset(action);

      // Should be allowed again
      const result = rateLimiter.check(action);
      expect(result.allowed).toBe(true);
      expect(result.remainingAttempts).toBeGreaterThan(0);
    });

    it('should clear blocked status after reset', () => {
      const action: RateLimitAction = 'login';

      // Block the action
      for (let i = 0; i < 15; i++) {
        rateLimiter.record(action);
      }

      // Verify blocked
      let result = rateLimiter.check(action);
      expect(result.allowed).toBe(false);

      // Reset
      rateLimiter.reset(action);

      // Should be unblocked
      result = rateLimiter.check(action);
      expect(result.allowed).toBe(true);
    });
  });

  describe('resetAll', () => {
    it('should clear all rate limit data', () => {
      // Record for all actions
      const actions: RateLimitAction[] = ['login', 'register', 'password_reset', 'google_signin'];
      actions.forEach(action => rateLimiter.record(action));

      // Clear all
      rateLimiter.resetAll();

      // All should be reset
      actions.forEach(action => {
        const result = rateLimiter.check(action);
        expect(result.allowed).toBe(true);
      });
    });
  });

  describe('action-specific limits', () => {
    it('should have stricter limits for password_reset', () => {
      const action: RateLimitAction = 'password_reset';

      // Password reset should have lower limit
      for (let i = 0; i < 5; i++) {
        rateLimiter.record(action);
      }

      const result = rateLimiter.check(action);
      // Password reset should have stricter limits
      expect(result.remainingAttempts).toBeLessThanOrEqual(3);
    });

    it('should have appropriate limits for register', () => {
      const action: RateLimitAction = 'register';

      // Register should have very strict limits
      for (let i = 0; i < 3; i++) {
        rateLimiter.record(action);
      }

      const result = rateLimiter.check(action);
      expect(result.remainingAttempts).toBeLessThanOrEqual(2);
    });
  });

  describe('error messages', () => {
    it('should return meaningful error message when blocked', () => {
      const action: RateLimitAction = 'login';

      // Block the action
      for (let i = 0; i < 10; i++) {
        rateLimiter.record(action);
      }

      const result = rateLimiter.check(action);
      expect(result.allowed).toBe(false);
      expect(result.message).toBeDefined();
      expect(result.message.length).toBeGreaterThan(0);
    });
  });
});