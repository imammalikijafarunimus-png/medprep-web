/**
 * Rate Limiter for Authentication & Security
 * @module lib/rateLimiter
 * 
 * Features:
 * - Configurable rate limits per action type
 * - Sliding window algorithm
 * - Exponential backoff for repeated violations
 * - Server-side sync ready
 */

// ============================================
// TYPES
// ============================================

export type RateLimitAction = 
  | 'login'
  | 'register'
  | 'password_reset'
  | 'google_signin'
  | 'api_call'
  | 'quiz_submit';

export interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
  blockDurationMs: number;
  exponentialBackoff?: boolean;
}

export interface RateLimitEntry {
  attempts: number[];
  blockedUntil?: number;
  violationCount: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remainingAttempts: number;
  resetIn?: number;
  blockedFor?: number;
  message?: string;
}

// ============================================
// DEFAULT CONFIGURATIONS
// ============================================

const DEFAULT_CONFIGS: Record<RateLimitAction, RateLimitConfig> = {
  login: {
    maxAttempts: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
    blockDurationMs: 30 * 60 * 1000, // 30 minutes
    exponentialBackoff: true,
  },
  register: {
    maxAttempts: 3,
    windowMs: 60 * 60 * 1000, // 1 hour
    blockDurationMs: 24 * 60 * 60 * 1000, // 24 hours
    exponentialBackoff: true,
  },
  password_reset: {
    maxAttempts: 3,
    windowMs: 60 * 60 * 1000, // 1 hour
    blockDurationMs: 60 * 60 * 1000, // 1 hour
    exponentialBackoff: false,
  },
  google_signin: {
    maxAttempts: 10,
    windowMs: 15 * 60 * 1000, // 15 minutes
    blockDurationMs: 15 * 60 * 1000, // 15 minutes
    exponentialBackoff: false,
  },
  api_call: {
    maxAttempts: 100,
    windowMs: 60 * 1000, // 1 minute
    blockDurationMs: 60 * 1000, // 1 minute
    exponentialBackoff: false,
  },
  quiz_submit: {
    maxAttempts: 60,
    windowMs: 60 * 1000, // 1 minute
    blockDurationMs: 5 * 60 * 1000, // 5 minutes
    exponentialBackoff: false,
  },
};

const STORAGE_KEY = 'medprep_rate_limits';

// ============================================
// RATE LIMITER CLASS
// ============================================

class RateLimiter {
  private limits: Map<string, RateLimitEntry> = new Map();
  private configs: Map<RateLimitAction, RateLimitConfig> = new Map();
  private storageAvailable: boolean;

  constructor() {
    // Load default configs
    Object.entries(DEFAULT_CONFIGS).forEach(([action, config]) => {
      this.configs.set(action as RateLimitAction, config);
    });

    // Check localStorage availability
    this.storageAvailable = this.checkStorage();
    
    // Load persisted limits
    this.loadFromStorage();
  }

  private checkStorage(): boolean {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  private loadFromStorage(): void {
    if (!this.storageAvailable) return;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        this.limits = new Map(Object.entries(data));
      }
    } catch {
      console.warn('[RateLimiter] Failed to load from storage');
    }
  }

  private saveToStorage(): void {
    if (!this.storageAvailable) return;

    try {
      const data = Object.fromEntries(this.limits);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      console.warn('[RateLimiter] Failed to save to storage');
    }
  }

  private cleanup(action: RateLimitAction): void {
    const config = this.configs.get(action);
    if (!config) return;

    const key = action;
    const entry = this.limits.get(key);
    
    if (!entry) return;

    const now = Date.now();
    const windowStart = now - config.windowMs;

    // Remove old attempts outside the window
    entry.attempts = entry.attempts.filter(time => time > windowStart);

    // Check if block has expired
    if (entry.blockedUntil && now > entry.blockedUntil) {
      entry.blockedUntil = undefined;
    }

    // Clean up empty entries
    if (entry.attempts.length === 0 && !entry.blockedUntil) {
      this.limits.delete(key);
    }

    this.saveToStorage();
  }

  /**
   * Check if an action is allowed
   */
  check(action: RateLimitAction): RateLimitResult {
    const config = this.configs.get(action);
    if (!config) {
      return { allowed: true, remainingAttempts: Infinity };
    }

    this.cleanup(action);

    const key = action;
    const entry = this.limits.get(key);
    const now = Date.now();

    // Check if currently blocked
    if (entry?.blockedUntil && now < entry.blockedUntil) {
      const blockedFor = Math.ceil((entry.blockedUntil - now) / 1000);
      return {
        allowed: false,
        remainingAttempts: 0,
        blockedFor,
        message: `Terlalu banyak percobaan. Coba lagi dalam ${this.formatTime(blockedFor)}.`,
      };
    }

    const currentAttempts = entry?.attempts.length || 0;
    const remainingAttempts = Math.max(0, config.maxAttempts - currentAttempts);

    // Check if limit exceeded
    if (currentAttempts >= config.maxAttempts) {
      // Apply block with potential exponential backoff
      let blockDuration = config.blockDurationMs;
      
      if (config.exponentialBackoff && entry) {
        blockDuration = config.blockDurationMs * Math.pow(2, entry.violationCount);
        blockDuration = Math.min(blockDuration, 24 * 60 * 60 * 1000); // Max 24 hours
      }

      const blockedUntil = now + blockDuration;
      const blockedFor = Math.ceil(blockDuration / 1000);

      // Update entry
      this.limits.set(key, {
        ...entry,
        attempts: entry?.attempts || [],
        blockedUntil,
        violationCount: (entry?.violationCount || 0) + 1,
      });

      this.saveToStorage();

      return {
        allowed: false,
        remainingAttempts: 0,
        blockedFor,
        message: `Batas percobaan terlampaui. Akun diblokir selama ${this.formatTime(blockedFor)}.`,
      };
    }

    return {
      allowed: true,
      remainingAttempts,
      resetIn: Math.ceil(config.windowMs / 1000),
    };
  }

  /**
   * Record an attempt for an action
   */
  record(action: RateLimitAction): void {
    const config = this.configs.get(action);
    if (!config) return;

    const key = action;
    const entry = this.limits.get(key) || {
      attempts: [],
      violationCount: 0,
    };

    entry.attempts.push(Date.now());
    this.limits.set(key, entry);
    this.saveToStorage();
  }

  /**
   * Reset limits for an action
   */
  reset(action: RateLimitAction): void {
    this.limits.delete(action);
    this.saveToStorage();
  }

  /**
   * Reset all limits
   */
  resetAll(): void {
    this.limits.clear();
    this.saveToStorage();
  }

  /**
   * Update config for an action
   */
  setConfig(action: RateLimitAction, config: Partial<RateLimitConfig>): void {
    const currentConfig = this.configs.get(action) || DEFAULT_CONFIGS[action];
    this.configs.set(action, { ...currentConfig, ...config });
  }

  /**
   * Get current status for an action
   */
  getStatus(action: RateLimitAction): {
    attempts: number;
    maxAttempts: number;
    blockedUntil?: number;
    violationCount: number;
  } {
    const config = this.configs.get(action) || DEFAULT_CONFIGS[action];
    const entry = this.limits.get(action);

    return {
      attempts: entry?.attempts.length || 0,
      maxAttempts: config.maxAttempts,
      blockedUntil: entry?.blockedUntil,
      violationCount: entry?.violationCount || 0,
    };
  }

  /**
   * Format time in human readable format
   */
  private formatTime(seconds: number): string {
    if (seconds < 60) {
      return `${seconds} detik`;
    } else if (seconds < 3600) {
      return `${Math.ceil(seconds / 60)} menit`;
    } else {
      return `${Math.ceil(seconds / 3600)} jam`;
    }
  }
}

// ============================================
// SINGLETON INSTANCE
// ============================================

export const rateLimiter = new RateLimiter();

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Check if action is allowed, throw error if not
 */
export function checkRateLimit(action: RateLimitAction): void {
  const result = rateLimiter.check(action);
  
  if (!result.allowed) {
    throw new Error(result.message || 'Rate limit exceeded');
  }
}

/**
 * Wrap a function with rate limiting
 */
export function withRateLimit<T extends (...args: unknown[]) => Promise<unknown>>(
  action: RateLimitAction,
  fn: T
): T {
  return (async (...args: Parameters<T>) => {
    checkRateLimit(action);
    
    try {
      const result = await fn(...args);
      return result;
    } catch (error) {
      // Record failed attempt
      rateLimiter.record(action);
      throw error;
    }
  }) as T;
}

/**
 * Higher-order function for rate-limited auth operations
 */
export function createRateLimitedAction<T extends (...args: unknown[]) => Promise<unknown>>(
  action: RateLimitAction,
  onSuccess?: () => void,
  onFailure?: (error: Error) => void
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  return async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    const result = rateLimiter.check(action);
    
    if (!result.allowed) {
      const error = new Error(result.message);
      onFailure?.(error);
      throw error;
    }

    try {
      const response = await (args as unknown as Parameters<T>)[0];
      onSuccess?.();
      return response as ReturnType<T>;
    } catch (error) {
      rateLimiter.record(action);
      onFailure?.(error as Error);
      throw error;
    }
  };
}
