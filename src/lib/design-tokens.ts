/**
 * MedPrep Design Tokens
 * =====================
 * Design system constants for consistent UI implementation
 * 
 * Usage:
 * import { spacing, typography, components } from '@/lib/design-tokens';
 */

// ============================================================
// SPACING SCALE
// ============================================================
export const spacing = {
    // Component padding
    card: {
      default: 'p-6',
      compact: 'p-4',
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
      brand: 'bg-brand text-brand-foreground hover:bg-brand-dark',
    },
    
    // Badge variants
    badge: {
      default: 'bg-primary text-primary-foreground',
      secondary: 'bg-secondary text-secondary-foreground',
      destructive: 'bg-destructive text-destructive-foreground',
      outline: 'border text-foreground',
      success: 'bg-success text-success-foreground',
      warning: 'bg-warning text-warning-foreground',
      info: 'bg-info text-info-foreground',
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
      default: 'bg-card border',
      elevated: 'bg-card border shadow-sm',
      interactive: 'bg-card border hover:border-brand/50 hover:shadow-md transition-all cursor-pointer',
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
    questionCard: 'p-6 rounded-lg border bg-card',
    
    // Answer option
    answerOption: {
      base: 'w-full p-4 rounded-lg border text-left transition-all',
      hover: 'hover:border-brand hover:bg-brand/5',
      selected: 'border-brand bg-brand/10 ring-1 ring-brand',
      correct: 'border-success bg-success/10',
      incorrect: 'border-destructive bg-destructive/10',
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
  // HELPER FUNCTIONS
  // ============================================================
  
  /**
   * Combines multiple class names with cn utility
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