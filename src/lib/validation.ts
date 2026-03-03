/**
 * Input Validation & Sanitization Utilities
 * @module lib/validation
 * 
 * Security features:
 * - Input sanitization for XSS prevention
 * - Email validation
 * - Password strength checking
 * - Markdown sanitization config
 * - Field validation helpers
 */

// ============================================
// TYPES
// ============================================

export interface ValidationResult {
    isValid: boolean;
    errors: string[];
    sanitized?: string;
  }
  
  export interface PasswordStrength {
    score: number; // 0-5
    label: 'Sangat Lemah' | 'Lemah' | 'Sedang' | 'Kuat' | 'Sangat Kuat';
    suggestions: string[];
  }
  
  // ============================================
  // SANITIZATION PATTERNS
  // ============================================
  
  // HTML entities to encode
  const HTML_ENTITIES: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;',
  };
  
  // Dangerous HTML patterns to remove
  const DANGEROUS_PATTERNS = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
    /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
    /<embed\b[^>]*>/gi,
    /<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi, // Event handlers like onclick, onerror, etc.
    /data:text\/html/gi,
    /vbscript:/gi,
  ];
  
  // ============================================
  // SANITIZATION FUNCTIONS
  // ============================================
  
  /**
   * Escapes HTML special characters
   */
  export function escapeHtml(input: string): string {
    if (!input || typeof input !== 'string') return '';
    
    return input.replace(/[&<>"'`=/]/g, (char) => HTML_ENTITIES[char] || char);
  }
  
  /**
   * Removes dangerous HTML patterns
   */
  export function removeDangerousHtml(input: string): string {
    if (!input || typeof input !== 'string') return '';
    
    let sanitized = input;
    DANGEROUS_PATTERNS.forEach(pattern => {
      sanitized = sanitized.replace(pattern, '');
    });
    
    return sanitized;
  }
  
  /**
   * Sanitizes input for safe display
   */
  export function sanitizeInput(input: string, options: {
    escapeHtml?: boolean;
    removeDangerousPatterns?: boolean;
    trim?: boolean;
    maxLength?: number;
  } = {}): string {
    if (!input || typeof input !== 'string') return '';
    
    const {
      escapeHtml: shouldEscape = true,
      removeDangerousPatterns: shouldRemove = true,
      trim = true,
      maxLength = 10000,
    } = options;
    
    let result = input;
    
    // Truncate if too long
    if (result.length > maxLength) {
      result = result.slice(0, maxLength);
    }
    
    // Trim whitespace
    if (trim) {
      result = result.trim();
    }
    
    // Remove dangerous patterns first
    if (shouldRemove) {
      result = removeDangerousHtml(result);
    }
    
    // Then escape HTML
    if (shouldEscape) {
      result = escapeHtml(result);
    }
    
    return result;
  }
  
  /**
   * Sanitizes markdown content
   * Allows safe markdown but removes dangerous HTML
   */
  export function sanitizeMarkdown(input: string): string {
    if (!input || typeof input !== 'string') return '';
    
    let sanitized = input;
    
    // Remove dangerous HTML patterns
    DANGEROUS_PATTERNS.forEach(pattern => {
      sanitized = sanitized.replace(pattern, '');
    });
    
    // Remove script-like content in links
    sanitized = sanitized.replace(/\[([^\]]*)\]\(javascript:[^)]*\)/gi, '[$1](#)');
    sanitized = sanitized.replace(/\[([^\]]*)\]\(data:[^)]*\)/gi, '[$1](#)');
    
    // Remove event handlers in markdown
    sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
    
    return sanitized;
  }
  
  // ============================================
  // VALIDATION FUNCTIONS
  // ============================================
  
  /**
   * Validates email format
   */
  export function validateEmail(email: string): ValidationResult {
    const errors: string[] = [];
    
    if (!email || typeof email !== 'string') {
      errors.push('Email harus diisi');
      return { isValid: false, errors };
    }
    
    const trimmedEmail = email.trim().toLowerCase();
    
    // Check length
    if (trimmedEmail.length > 254) {
      errors.push('Email terlalu panjang (maksimal 254 karakter)');
    }
    
    // Check format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      errors.push('Format email tidak valid');
    }
    
    // Check for dangerous characters
    if (/[<>"']/.test(trimmedEmail)) {
      errors.push('Email mengandung karakter tidak valid');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      sanitized: trimmedEmail,
    };
  }
  
  /**
   * Validates password strength
   */
  export function validatePassword(password: string): ValidationResult & { strength: PasswordStrength } {
    const errors: string[] = [];
    const suggestions: string[] = [];
    
    if (!password || typeof password !== 'string') {
      errors.push('Password harus diisi');
      return {
        isValid: false,
        errors,
        strength: { score: 0, label: 'Sangat Lemah', suggestions: ['Masukkan password'] },
      };
    }
    
    // Check minimum length
    if (password.length < 8) {
      errors.push('Password minimal 8 karakter');
      suggestions.push('Gunakan minimal 8 karakter');
    }
    
    // Check maximum length
    if (password.length > 128) {
      errors.push('Password terlalu panjang (maksimal 128 karakter)');
    }
    
    // Check for uppercase
    if (!/[A-Z]/.test(password)) {
      suggestions.push('Tambahkan huruf besar');
    }
    
    // Check for lowercase
    if (!/[a-z]/.test(password)) {
      suggestions.push('Tambahkan huruf kecil');
    }
    
    // Check for numbers
    if (!/\d/.test(password)) {
      suggestions.push('Tambahkan angka');
    }
    
    // Check for special characters
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      suggestions.push('Tambahkan karakter khusus (!@#$% dll)');
    }
    
    // Check for common patterns
    const commonPatterns = ['password', '123456', 'qwerty', 'abc123', 'admin'];
    const lowerPassword = password.toLowerCase();
    commonPatterns.forEach(pattern => {
      if (lowerPassword.includes(pattern)) {
        errors.push('Password mengandung pola umum yang mudah ditebak');
      }
    });
    
    // Calculate strength score
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
    
    // Normalize score to 0-5
    score = Math.min(5, Math.floor(score * 5 / 6));
    
    const labels: PasswordStrength['label'][] = [
      'Sangat Lemah',
      'Lemah',
      'Sedang',
      'Kuat',
      'Sangat Kuat',
    ];
    
    const strength: PasswordStrength = {
      score,
      label: labels[score] || 'Sangat Lemah',
      suggestions: suggestions.length > 0 ? suggestions : ['Password sudah cukup kuat'],
    };
    
    // Password must be at least "Sedang" strength
    const isValid = errors.length === 0 && score >= 2;
    
    return {
      isValid,
      errors,
      strength,
      sanitized: password, // Don't modify password
    };
  }
  
  /**
   * Validates name format
   */
  export function validateName(name: string): ValidationResult {
    const errors: string[] = [];
    
    if (!name || typeof name !== 'string') {
      errors.push('Nama harus diisi');
      return { isValid: false, errors };
    }
    
    const trimmedName = name.trim();
    
    // Check length
    if (trimmedName.length < 2) {
      errors.push('Nama minimal 2 karakter');
    }
    
    if (trimmedName.length > 100) {
      errors.push('Nama terlalu panjang (maksimal 100 karakter)');
    }
    
    // Check format (letters, spaces, some special chars)
    if (!/^[a-zA-ZÀ-ÿ\s\-'.]+$/.test(trimmedName)) {
      errors.push('Nama hanya boleh mengandung huruf dan spasi');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      sanitized: sanitizeInput(trimmedName, { escapeHtml: true, removeDangerousPatterns: true }),
    };
  }
  
  /**
   * Validates university name
   */
  export function validateUniversity(university: string): ValidationResult {
    const errors: string[] = [];
    
    if (!university || typeof university !== 'string') {
      errors.push('Universitas harus dipilih');
      return { isValid: false, errors };
    }
    
    const trimmedUniversity = university.trim();
    
    if (trimmedUniversity.length < 2) {
      errors.push('Nama universitas tidak valid');
    }
    
    if (trimmedUniversity.length > 200) {
      errors.push('Nama universitas terlalu panjang');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      sanitized: sanitizeInput(trimmedUniversity, { escapeHtml: true }),
    };
  }
  
  /**
   * Validates text input (general purpose)
   */
  export function validateText(
    input: string,
    options: {
      minLength?: number;
      maxLength?: number;
      required?: boolean;
      fieldName?: string;
    } = {}
  ): ValidationResult {
    const {
      minLength = 0,
      maxLength = 1000,
      required = true,
      fieldName = 'Field',
    } = options;
    
    const errors: string[] = [];
    
    if (!input || typeof input !== 'string') {
      if (required) {
        errors.push(`${fieldName} harus diisi`);
      }
      return { isValid: !required, errors, sanitized: '' };
    }
    
    const trimmed = input.trim();
    
    if (required && trimmed.length === 0) {
      errors.push(`${fieldName} tidak boleh kosong`);
    }
    
    if (trimmed.length < minLength) {
      errors.push(`${fieldName} minimal ${minLength} karakter`);
    }
    
    if (trimmed.length > maxLength) {
      errors.push(`${fieldName} maksimal ${maxLength} karakter`);
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      sanitized: sanitizeInput(trimmed),
    };
  }
  
  // ============================================
  // REACT MARKDOWN SANITIZATION CONFIG
  // ============================================
  
  /**
   * Allowed HTML elements in markdown
   */
  export const ALLOWED_MARKDOWN_ELEMENTS = [
    'p', 'br', 'strong', 'em', 'u', 's', 'del',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li',
    'blockquote', 'code', 'pre',
    'a', 'img',
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
    'hr', 'span', 'div',
  ];
  
  /**
   * Allowed HTML attributes in markdown
   */
  export const ALLOWED_MARKDOWN_ATTRIBUTES: Record<string, string[]> = {
    a: ['href', 'title', 'target', 'rel'],
    img: ['src', 'alt', 'title', 'width', 'height'],
    span: ['className'],
    div: ['className'],
    code: ['className'],
    pre: ['className'],
    table: ['className'],
    th: ['align'],
    td: ['align'],
  };
  
  /**
   * URL sanitizer for links
   */
  export function sanitizeUrl(url: string): string {
    if (!url || typeof url !== 'string') return '';
    
    const trimmed = url.trim();
    
    // Only allow safe protocols
    const safeProtocols = ['http://', 'https://', 'mailto:', 'tel:'];
    const isSafeProtocol = safeProtocols.some(protocol => 
      trimmed.toLowerCase().startsWith(protocol)
    );
    
    // Allow relative URLs
    const isRelative = trimmed.startsWith('/') || trimmed.startsWith('#');
    
    if (!isSafeProtocol && !isRelative) {
      return '#'; // Return safe fallback
    }
    
    return trimmed;
  }
  
  /**
   * Creates a sanitized link component for markdown
   */
  export function createSanitizedLink(href: string, children: React.ReactNode): {
    href: string;
    rel: string;
    target: string;
    children: React.ReactNode;
  } {
    return {
      href: sanitizeUrl(href),
      rel: 'noopener noreferrer nofollow',
      target: '_blank',
      children,
    };
  }
  
  // ============================================
  // FORM VALIDATION HELPER
  // ============================================
  
  /**
   * Validates multiple fields at once
   */
  export function validateForm<T extends Record<string, unknown>>(
    data: T,
    validators: Partial<Record<keyof T, (value: unknown) => ValidationResult>>
  ): {
    isValid: boolean;
    errors: Partial<Record<keyof T, string[]>>;
    sanitized: Partial<Record<keyof T, string>>;
  } {
    const errors: Partial<Record<keyof T, string[]>> = {};
    const sanitized: Partial<Record<keyof T, string>> = {};
    let isValid = true;
    
    Object.keys(validators).forEach(key => {
      const fieldKey = key as keyof T;
      const validator = validators[fieldKey];
      
      if (validator) {
        const result = validator(data[fieldKey]);
        
        if (!result.isValid) {
          isValid = false;
          errors[fieldKey] = result.errors;
        }
        
        if (result.sanitized !== undefined) {
          sanitized[fieldKey] = result.sanitized;
        }
      }
    });
    
    return { isValid, errors, sanitized };
  }
  