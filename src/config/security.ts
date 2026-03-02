/**
 * Security Constants
 * @module config/security
 * 
 * Centralized security configuration and constants
 */

// ============================================
// RATE LIMITING CONFIGURATION
// ============================================

export const RATE_LIMIT_CONFIG = {
    // Authentication
    LOGIN_MAX_ATTEMPTS: 5,
    LOGIN_WINDOW_MINUTES: 15,
    LOGIN_BLOCK_MINUTES: 30,
    
    REGISTER_MAX_ATTEMPTS: 3,
    REGISTER_WINDOW_MINUTES: 60,
    REGISTER_BLOCK_HOURS: 24,
    
    PASSWORD_RESET_MAX_ATTEMPTS: 3,
    PASSWORD_RESET_WINDOW_MINUTES: 60,
    
    GOOGLE_SIGNIN_MAX_ATTEMPTS: 10,
    GOOGLE_SIGNIN_WINDOW_MINUTES: 15,
    
    // API
    API_MAX_REQUESTS_PER_MINUTE: 100,
    QUIZ_SUBMIT_MAX_PER_MINUTE: 60,
    
  } as const;
  
  // ============================================
  // SESSION CONFIGURATION
  // ============================================
  
  export const SESSION_CONFIG = {
    // Session duration in milliseconds
    DEFAULT_SESSION_DURATION_DAYS: 30,
    PREMIUM_SESSION_DURATION_DAYS: 90,
    
    // Device binding
    ENFORCE_SINGLE_DEVICE_FOR_PREMIUM: true,
    ALLOW_MULTI_DEVICE_FOR_FREE: true,
    
    // Session validation interval
    VALIDATION_INTERVAL_MINUTES: 5,
    
  } as const;
  
  // ============================================
  // INPUT VALIDATION LIMITS
  // ============================================
  
  export const VALIDATION_LIMITS = {
    // Name
    NAME_MIN_LENGTH: 2,
    NAME_MAX_LENGTH: 100,
    
    // Email
    EMAIL_MAX_LENGTH: 254,
    
    // Password
    PASSWORD_MIN_LENGTH: 8,
    PASSWORD_MAX_LENGTH: 128,
    PASSWORD_MIN_STRENGTH_SCORE: 2, // 0-5 scale
    
    // University
    UNIVERSITY_MAX_LENGTH: 200,
    
    // General text
    TEXT_MAX_LENGTH: 10000,
    MARKDOWN_MAX_LENGTH: 50000,
    
  } as const;
  
  // ============================================
  // ALLOWED HTML/MARKDOWN ELEMENTS
  // ============================================
  
  export const ALLOWED_HTML_ELEMENTS = [
    // Text formatting
    'p', 'br', 'span',
    'strong', 'b', 'em', 'i', 'u', 's', 'del', 'mark',
    
    // Headings
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    
    // Lists
    'ul', 'ol', 'li',
    
    // Block elements
    'blockquote', 'pre', 'code',
    
    // Links and media
    'a', 'img',
    
    // Tables
    'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td',
    
    // Misc
    'hr', 'div',
    
  ] as const;
  
  export const ALLOWED_HTML_ATTRIBUTES: Record<string, readonly string[]> = {
    a: ['href', 'title', 'target', 'rel', 'className'] as const,
    img: ['src', 'alt', 'title', 'width', 'height', 'className'] as const,
    span: ['className'] as const,
    div: ['className'] as const,
    code: ['className'] as const,
    pre: ['className'] as const,
    table: ['className'] as const,
    th: ['align', 'scope', 'className'] as const,
    td: ['align', 'className'] as const,
    h1: ['className'] as const,
    h2: ['className'] as const,
    h3: ['className'] as const,
    h4: ['className'] as const,
    h5: ['className'] as const,
    h6: ['className'] as const,
  };
  
  // ============================================
  // ALLOWED URL PROTOCOLS
  // ============================================
  
  export const ALLOWED_URL_PROTOCOLS = [
    'http:',
    'https:',
    'mailto:',
    'tel:',
  ] as const;
  
  // ============================================
  // DANGEROUS PATTERNS TO BLOCK
  // ============================================
  
  export const DANGEROUS_PATTERNS = [
    // Script injection
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    
    // Iframe injection
    /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
    
    // Object/Embed injection
    /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
    /<embed\b[^>]*>/gi,
    
    // Form injection
    /<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi,
    
    // Dangerous URL schemes
    /javascript:/gi,
    /vbscript:/gi,
    /data:text\/html/gi,
    
    // Event handlers (onclick, onerror, etc.)
    /on\w+\s*=/gi,
    
    // Expression injection (CSS)
    /expression\s*\(/gi,
    
    // Meta refresh
    /<meta\s+http-equiv\s*=\s*["']?refresh/gi,
    
  ] as const;
  
  // ============================================
  // SECURITY HEADERS RECOMMENDATIONS
  // ============================================
  
  export const SECURITY_HEADERS = {
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self' https://*.firebaseio.com https://firestore.googleapis.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com;",
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
  } as const;
  
  // ============================================
  // ERROR MESSAGES
  // ============================================
  
  export const SECURITY_ERROR_MESSAGES = {
    // Rate limiting
    RATE_LIMIT_EXCEEDED: 'Terlalu banyak percobaan. Silakan coba lagi nanti.',
    RATE_LIMIT_LOGIN: 'Terlalu banyak percobaan login. Akun diblokir sementara.',
    RATE_LIMIT_REGISTER: 'Terlalu banyak percobaan registrasi. Silakan coba lagi nanti.',
    
    // Device/Session
    MULTI_DEVICE_DETECTED: 'Akun Anda terdeteksi login di perangkat lain. Untuk keamanan, silakan login kembali.',
    SESSION_EXPIRED: 'Sesi Anda telah berakhir. Silakan login kembali.',
    INVALID_DEVICE: 'Perangkat tidak dikenali. Silakan verifikasi identitas Anda.',
    
    // Input validation
    INVALID_EMAIL: 'Format email tidak valid.',
    INVALID_PASSWORD: 'Password tidak memenuhi syarat keamanan.',
    INVALID_INPUT: 'Input mengandung karakter tidak valid.',
    XSS_DETECTED: 'Konten mengandung kode berbahaya yang telah diblokir.',
    
    // General
    UNAUTHORIZED: 'Anda tidak memiliki akses ke fitur ini.',
    SUBSCRIPTION_REQUIRED: 'Fitur ini memerlukan langganan premium.',
    
  } as const;
  
  // ============================================
  // AUDIT LOG EVENTS
  // ============================================
  
  export const AUDIT_EVENTS = {
    // Authentication
    LOGIN_SUCCESS: 'LOGIN_SUCCESS',
    LOGIN_FAILED: 'LOGIN_FAILED',
    LOGOUT: 'LOGOUT',
    REGISTER_SUCCESS: 'REGISTER_SUCCESS',
    REGISTER_FAILED: 'REGISTER_FAILED',
    GOOGLE_SIGNIN_SUCCESS: 'GOOGLE_SIGNIN_SUCCESS',
    GOOGLE_SIGNIN_FAILED: 'GOOGLE_SIGNIN_FAILED',
    
    // Security
    RATE_LIMITED: 'RATE_LIMITED',
    MULTI_DEVICE_DETECTED: 'MULTI_DEVICE_DETECTED',
    SESSION_EXPIRED: 'SESSION_EXPIRED',
    XSS_ATTEMPT: 'XSS_ATTEMPT',
    INVALID_INPUT: 'INVALID_INPUT',
    
    // User actions
    PROFILE_UPDATED: 'PROFILE_UPDATED',
    PASSWORD_CHANGED: 'PASSWORD_CHANGED',
    SUBSCRIPTION_CHANGED: 'SUBSCRIPTION_CHANGED',
    
    // Admin actions
    ADMIN_USER_VIEW: 'ADMIN_USER_VIEW',
    ADMIN_USER_UPDATE: 'ADMIN_USER_UPDATE',
    ADMIN_CONTENT_UPDATE: 'ADMIN_CONTENT_UPDATE',
    
  } as const;
  
  // ============================================
  // EXPORT ALL
  // ============================================
  
  export type AuditEvent = typeof AUDIT_EVENTS[keyof typeof AUDIT_EVENTS];
  