/**
 * Navigation Configuration
 * @module config/navigation
 * 
 * Single source of truth for all navigation items.
 * Import this in Layout, Sidebar, MobileNav, etc.
 */

import { 
  LayoutGrid, 
  Brain, 
  Stethoscope, 
  Moon, 
  Zap, 
  User,
  ShieldCheck,
  Users,
  type LucideIcon 
} from 'lucide-react';

export interface NavItem {
  icon: LucideIcon;
  label: string;
  path: string;
  badge?: string;
  adminOnly?: boolean;
  superAdminOnly?: boolean;
  premiumOnly?: boolean;
}

/**
 * Main navigation items - used in Sidebar and Mobile Nav
 */
export const NAV_ITEMS: NavItem[] = [
  { 
    icon: LayoutGrid, 
    label: 'Dashboard', 
    path: '/app/dashboard' 
  },
  { 
    icon: Brain, 
    label: 'CBT Center', 
    path: '/app/cbt',
    badge: 'Bank Soal'
  },
  { 
    icon: Stethoscope, 
    label: 'OSCE Center', 
    path: '/app/osce' 
  },
  { 
    icon: Moon, 
    label: 'OSCIE Center', 
    path: '/app/oscie',
    premiumOnly: true
  },
  { 
    icon: Zap, 
    label: 'Flashcards', 
    path: '/app/flashcards' 
  },
  { 
    icon: User, 
    label: 'Profil', 
    path: '/app/profile' 
  },
];

/**
 * Admin navigation items
 */
export const ADMIN_NAV_ITEMS: NavItem[] = [
  {
    icon: ShieldCheck,
    label: 'Admin Panel',
    path: '/app/admin',
    adminOnly: true
  }
];

/**
 * SuperAdmin navigation items
 */
export const SUPERADMIN_NAV_ITEMS: NavItem[] = [
  {
    icon: Users,
    label: 'User Management',
    path: '/app/users',
    superAdminOnly: true
  }
];

/**
 * All navigation items including admin
 */
export const getAllNavItems = (isAdmin: boolean = false, isSuperAdmin: boolean = false, isPremium: boolean = false): NavItem[] => {
  let items = [...NAV_ITEMS];
  
  // Add admin items if user is admin
  if (isAdmin) {
    items = [...items, ...ADMIN_NAV_ITEMS];
  }
  
  // Add superadmin items if user is superadmin
  if (isSuperAdmin) {
    items = [...items, ...SUPERADMIN_NAV_ITEMS];
  }
  
  // Filter premium items if not premium
  if (!isPremium) {
    items = items.filter(item => !item.premiumOnly);
  }
  
  return items;
};

/**
 * Get navigation items for mobile (limited slots)
 * Use bottom sheet or "More" menu for overflow
 */
export const MOBILE_NAV_ITEMS = NAV_ITEMS.slice(0, 5);
export const MOBILE_OVERFLOW_ITEMS = NAV_ITEMS.slice(5);

/**
 * Page titles for header display
 */
export const PAGE_TITLES: Record<string, string> = {
  '/app/dashboard': 'Dashboard',
  '/app/cbt': 'CBT Center',
  '/app/cbt/read': 'Materi CBT',
  '/app/cbt/quiz': 'Latihan Soal',
  '/app/osce': 'OSCE Center',
  '/app/oscie': 'OSCIE Center',
  '/app/flashcards': 'Flashcards',
  '/app/profile': 'Profil',
  '/app/admin': 'Admin Panel',
  '/app/users': 'User Management',
  '/app/search': 'Pencarian',
  '/app/subscription': 'Subscription',
  '/app/trends': 'Analisis',
};

/**
 * Get page title from pathname
 */
export const getPageTitle = (pathname: string): string => {
  // Try exact match first
  if (PAGE_TITLES[pathname]) {
    return PAGE_TITLES[pathname];
  }
  
  // Try prefix match for dynamic routes
  for (const [path, title] of Object.entries(PAGE_TITLES)) {
    if (pathname.startsWith(path)) {
      return title;
    }
  }
  
  return 'MedPrep';
};