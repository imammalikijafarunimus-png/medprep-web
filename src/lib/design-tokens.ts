/**
 * MedPrep Design Tokens v2.0
 * ==========================
 * Design system constants for consistent UI implementation
 * 
 * Usage:
 * import { spacing, typography, variants, cn } from '@/lib/design-tokens';
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// ============================================================
// UTILITY FUNCTION
// ============================================================

/**
 * Combines class names with Tailwind merge for conflict resolution
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ============================================================
// COLOR TOKENS - Semantic Aliases
// ============================================================

export const colors = {
  // Brand colors (use these instead of teal-*)
  brand: {
    bg: 'bg-brand',
    text: 'text-brand',
    border: 'border-brand',
    bgLight: 'bg-brand-light',
    bgDark: 'bg-brand-dark',
    foreground: 'text-brand-foreground',
    ring: 'ring-brand',
  },
  
  // Semantic colors
  success: {
    bg: 'bg-success',
    text: 'text-success',
    border: 'border-success',
    bgLight: 'bg-success/10',
    foreground: 'text-success-foreground',
  },
  
  warning: {
    bg: 'bg-warning',
    text: 'text-warning',
    border: 'border-warning',
    bgLight: 'bg-warning/10',
    foreground: 'text-warning-foreground',
  },
  
  info: {
    bg: 'bg-info',
    text: 'text-info',
    border: 'border-info',
    bgLight: 'bg-info/10',
    foreground: 'text-info-foreground',
  },
  
  destructive: {
    bg: 'bg-destructive',
    text: 'text-destructive',
    border: 'border-destructive',
    bgLight: 'bg-destructive/10',
    foreground: 'text-destructive-foreground',
  },
  
  // Surface colors (for dark sections)
  surface: {
    bg: 'bg-surface',
    bgElevated: 'bg-surface-elevated',
    bgOverlay: 'bg-surface-overlay',
    text: 'text-white',
    border: 'border-white/10',
  },
  
  // Card colors
  card: {
    bg: 'bg-card',
    text: 'text-card-foreground',
    border: 'border-border',
  },
} as const;

// ============================================================
// SPACING SCALE
// ============================================================

export const spacing = {
  // Component padding
  card: {
    compact: 'p-4',
    default: 'p-6',
    spacious: 'p-8',
  },
  
  // Section gaps
  section: {
    tight: 'gap-2',
    default: 'gap-4',
    comfortable: 'gap-6',
    spacious: 'gap-8',
  },
  
  // Form element gaps
  form: {
    field: 'space-y-2',
    group: 'space-y-4',
    section: 'space-y-6',
  },
  
  // Layout gaps
  layout: {
    inline: 'gap-2',
    between: 'gap-4',
    around: 'gap-6',
    spacious: 'gap-8',
  },
} as const;

// ============================================================
// TYPOGRAPHY SCALE
// ============================================================

export const typography = {
  // Headings
  heading: {
    h1: 'text-3xl font-bold tracking-tight',
    h2: 'text-2xl font-semibold tracking-tight',
    h3: 'text-xl font-semibold',
    h4: 'text-lg font-medium',
    h5: 'text-base font-medium',
    h6: 'text-sm font-medium',
  },
  
  // Body text
  body: {
    large: 'text-base leading-relaxed',
    default: 'text-sm leading-normal',
    small: 'text-xs leading-normal',
  },
  
  // Labels
  label: {
    default: 'text-sm font-medium',
    small: 'text-xs font-medium',
  },
  
  // Caption & helper text
  caption: 'text-xs text-muted-foreground',
  helper: 'text-xs text-muted-foreground mt-1',
  
  // Special
  mono: 'font-mono text-sm',
} as const;

// ============================================================
// COMPONENT SIZES
// ============================================================

export const sizes = {
  // Buttons
  button: {
    sm: 'h-8 px-3 text-xs',
    default: 'h-10 px-4 text-sm',
    lg: 'h-12 px-6 text-base',
    icon: 'size-10',
    iconSm: 'size-8',
    iconLg: 'size-12',
  },
  
  // Inputs
  input: {
    sm: 'h-8 px-3 text-xs',
    default: 'h-10 px-4 text-sm',
    lg: 'h-12 px-4 text-base',
  },
  
  // Avatars
  avatar: {
    xs: 'size-6',
    sm: 'size-8',
    default: 'size-10',
    lg: 'size-12',
    xl: 'size-16',
  },
  
  // Icons
  icon: {
    xs: 'size-3',
    sm: 'size-4',
    default: 'size-5',
    lg: 'size-6',
    xl: 'size-8',
  },
  
  // Cards
  card: {
    compact: 'p-4',
    default: 'p-6',
    spacious: 'p-8',
  },
  
  // Sidebar
  sidebar: {
    width: 'w-[280px]',
    widthCollapsed: 'w-[72px]',
  },
} as const;

// ============================================================
// BORDER RADIUS - Standardized Values
// ============================================================

export const radius = {
  // Use these instead of arbitrary values like rounded-[2.5rem]
  sm: 'rounded-sm',       // 2px
  default: 'rounded',     // 4px
  md: 'rounded-md',       // 6px
  lg: 'rounded-lg',       // 8px
  xl: 'rounded-xl',       // 12px
  '2xl': 'rounded-2xl',   // 16px
  '3xl': 'rounded-3xl',   // 24px - Use for hero cards
  full: 'rounded-full',   // 9999px
} as const;

// ============================================================
// COMPONENT VARIANTS
// ============================================================

export const variants = {
  // Button variants
  button: {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    link: 'text-primary underline-offset-4 hover:underline',
    brand: 'bg-brand text-brand-foreground hover:bg-brand-dark shadow-sm',
    surface: 'bg-surface text-white hover:bg-surface-elevated',
    success: 'bg-success text-success-foreground hover:bg-success/90',
    warning: 'bg-warning text-warning-foreground hover:bg-warning/90',
  },
  
  // Badge variants
  badge: {
    default: 'bg-primary text-primary-foreground',
    secondary: 'bg-secondary text-secondary-foreground',
    destructive: 'bg-destructive text-destructive-foreground',
    outline: 'border text-foreground',
    success: 'bg-success/10 text-success border border-success/20',
    warning: 'bg-warning/10 text-warning border border-warning/20',
    info: 'bg-info/10 text-info border border-info/20',
    brand: 'bg-brand/10 text-brand border border-brand/20',
  },
  
  // Alert variants
  alert: {
    default: 'bg-card border',
    destructive: 'bg-destructive/10 border-destructive/50 text-destructive',
    success: 'bg-success/10 border-success/50 text-success',
    warning: 'bg-warning/10 border-warning/50 text-warning',
    info: 'bg-info/10 border-info/50 text-info',
  },
  
  // Card variants
  card: {
    default: 'bg-card border rounded-2xl',
    elevated: 'bg-card border rounded-2xl shadow-sm hover:shadow-md transition-shadow',
    interactive: 'bg-card border rounded-2xl hover:border-brand/50 hover:shadow-md transition-all cursor-pointer',
    surface: 'bg-surface border border-white/10 rounded-2xl text-white',
    glass: 'bg-white/80 dark:bg-card/80 backdrop-blur-xl border border-white/20 rounded-2xl',
  },
} as const;

// ============================================================
// ANIMATION DURATIONS
// ============================================================

export const animation = {
  fast: 'duration-100',
  default: 'duration-200',
  slow: 'duration-300',
  slower: 'duration-500',
} as const;

// ============================================================
// LAYOUT CONSTANTS
// ============================================================

export const layout = {
  maxWidth: 'max-w-7xl',
  maxWidthSm: 'max-w-3xl',
  maxWidthMd: 'max-w-4xl',
  maxWidthLg: 'max-w-5xl',
  maxWidthProse: 'max-w-prose',
  headerHeight: 'h-16',
  footerHeight: 'h-12',
  sidebarWidth: 'w-[280px]',
  sidebarCollapsedWidth: 'w-[72px]',
} as const;

// ============================================================
// Z-INDEX LAYERS
// ============================================================

export const zIndex = {
  base: 'z-0',
  dropdown: 'z-10',
  sticky: 'z-20',
  fixed: 'z-30',
  modal: 'z-40',
  popover: 'z-50',
  tooltip: 'z-60',
  toast: 'z-70',
  modalOverlay: 'z-80',
  highest: 'z-90',
} as const;

// ============================================================
// QUIZ/EXAM SPECIFIC TOKENS
// ============================================================

export const quiz = {
  // Question card
  questionCard: 'p-6 rounded-xl border bg-card',
  
  // Answer option
  answerOption: {
    base: 'w-full p-4 rounded-xl border text-left transition-all duration-200',
    hover: 'hover:border-brand hover:bg-brand/5',
    selected: 'border-brand bg-brand/10 ring-1 ring-brand',
    correct: 'border-success bg-success/10 text-success',
    incorrect: 'border-destructive bg-destructive/10 text-destructive',
  },
  
  // Timer
  timer: {
    default: 'text-lg font-mono font-semibold',
    warning: 'text-warning',
    danger: 'text-destructive animate-pulse',
  },
  
  // Progress
  progress: {
    track: 'h-2 bg-muted rounded-full overflow-hidden',
    bar: 'h-full bg-brand transition-all duration-300',
  },
  
  // Score badge
  score: {
    excellent: 'text-success',
    good: 'text-brand',
    average: 'text-warning',
    poor: 'text-destructive',
  },
} as const;

// ============================================================
// PRESET COMBINATIONS - Common patterns
// ============================================================

export const presets = {
  // Icon container with brand color
  iconBrand: 'inline-flex items-center justify-center rounded-xl bg-brand/10 text-brand p-2',
  
  // Icon container with success color
  iconSuccess: 'inline-flex items-center justify-center rounded-xl bg-success/10 text-success p-2',
  
  // Icon container with warning color
  iconWarning: 'inline-flex items-center justify-center rounded-xl bg-warning/10 text-warning p-2',
  
  // Stat card preset
  statCard: 'bg-card border rounded-2xl p-4 hover:shadow-lg transition-all duration-200',
  
  // Hero section dark
  heroDark: 'bg-surface text-white rounded-3xl p-6 md:p-8 overflow-hidden relative',
  
  // Glass card
  glassCard: 'bg-white/80 dark:bg-card/80 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl',
} as const;

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Combines multiple class names with cn utility
 * @deprecated Use cn() instead
 */
export function classes(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Creates a responsive container class
 */
export function container(padding: boolean = true): string {
  return padding 
    ? 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8' 
    : 'max-w-7xl mx-auto';
}

/**
 * Creates a section wrapper class
 */
export function section(spacing: 'tight' | 'default' | 'spacious' = 'default'): string {
  const spacingMap = {
    tight: 'py-8',
    default: 'py-12',
    spacious: 'py-16',
  };
  return spacingMap[spacing];
}

/**
 * Creates an icon container with specified color variant
 */
export function iconContainer(
  variant: 'brand' | 'success' | 'warning' | 'info' | 'destructive' = 'brand',
  size: 'sm' | 'default' | 'lg' = 'default'
): string {
  const sizeMap = {
    sm: 'p-1.5 rounded-lg',
    default: 'p-2 rounded-xl',
    lg: 'p-3 rounded-xl',
  };
  
  const variantMap = {
    brand: 'bg-brand/10 text-brand',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    info: 'bg-info/10 text-info',
    destructive: 'bg-destructive/10 text-destructive',
  };
  
  return `inline-flex items-center justify-center ${sizeMap[size]} ${variantMap[variant]}`;
}