/**
 * Breadcrumb Component
 * @module components/ui/Breadcrumb
 * 
 * Accessible breadcrumb navigation with:
 * - Schema.org structured data
 * - Keyboard navigation
 * - Responsive truncation
 */

import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';

export interface BreadcrumbItem {
  label: string;
  path?: string;
  icon?: React.ReactNode;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  /** Show home icon */
  showHome?: boolean;
  /** Home path */
  homePath?: string;
  /** Max items before truncation */
  maxItems?: number;
  /** Additional classes */
  className?: string;
}

/**
 * Generate breadcrumb items from pathname
 */
export function generateBreadcrumbs(pathname: string, customLabels?: Record<string, string>): BreadcrumbItem[] {
  const pathMap: Record<string, string> = {
    '/app': 'App',
    '/app/dashboard': 'Dashboard',
    '/app/cbt': 'CBT Center',
    '/app/cbt/read': 'Materi',
    '/app/cbt/quiz': 'Latihan',
    '/app/osce': 'OSCE Center',
    '/app/oscie': 'OSCIE Center',
    '/app/flashcards': 'Flashcards',
    '/app/profile': 'Profil',
    '/app/admin': 'Admin',
    '/app/search': 'Pencarian',
    '/app/subscription': 'Subscription',
    '/app/trends': 'Analisis',
    ...customLabels,
  };

  const segments = pathname.split('/').filter(Boolean);
  const items: BreadcrumbItem[] = [];
  let currentPath = '';

  for (let i = 0; i < segments.length; i++) {
    currentPath += `/${segments[i]}`;
    const fullPath = currentPath;
    const label = pathMap[fullPath] || segments[i].charAt(0).toUpperCase() + segments[i].slice(1);
    
    // Don't make last item clickable
    const isLast = i === segments.length - 1;
    
    items.push({
      label,
      path: isLast ? undefined : fullPath,
    });
  }

  return items;
}

/**
 * Breadcrumb component with accessibility
 */
export function Breadcrumb({
  items,
  showHome = true,
  homePath = '/app/dashboard',
  maxItems = 4,
  className,
}: BreadcrumbProps) {
  // Truncate items if too many
  const shouldTruncate = items.length > maxItems;
  const visibleItems = shouldTruncate
    ? [items[0], { label: '...', path: undefined }, ...items.slice(-2)]
    : items;

  // Schema.org structured data
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: item.path ? `${window.location.origin}${item.path}` : undefined,
    })),
  };

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <nav
        aria-label="Breadcrumb"
        className={cn('flex items-center text-sm', className)}
      >
        <ol className="flex items-center flex-wrap gap-1" role="list">
          {/* Home */}
          {showHome && (
            <li className="flex items-center">
              <Link
                to={homePath}
                className="flex items-center text-slate-400 hover:text-teal-600 dark:text-slate-500 dark:hover:text-teal-400 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 rounded"
                aria-label="Beranda"
              >
                <Home size={14} aria-hidden="true" />
              </Link>
              <ChevronRight
                size={14}
                className="mx-1.5 text-slate-300 dark:text-slate-600"
                aria-hidden="true"
              />
            </li>
          )}

          {/* Breadcrumb Items */}
          {visibleItems.map((item, index) => {
            const isLast = index === visibleItems.length - 1;
            const isTruncated = item.label === '...';

            return (
              <li key={`${item.label}-${index}`} className="flex items-center">
                {isTruncated ? (
                  <span
                    className="px-2 text-slate-400 dark:text-slate-500"
                    aria-hidden="true"
                  >
                    ...
                  </span>
                ) : item.path && !isLast ? (
                  <Link
                    to={item.path}
                    className={cn(
                      'flex items-center gap-1.5 transition-colors',
                      'text-slate-500 hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-400',
                      'focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 rounded'
                    )}
                  >
                    {item.icon && <span aria-hidden="true">{item.icon}</span>}
                    <span>{item.label}</span>
                  </Link>
                ) : (
                  <span
                    className="font-medium text-slate-700 dark:text-slate-300"
                    aria-current="page"
                  >
                    {item.icon && <span aria-hidden="true">{item.icon}</span>}
                    {item.label}
                  </span>
                )}

                {!isLast && (
                  <ChevronRight
                    size={14}
                    className="mx-1.5 text-slate-300 dark:text-slate-600"
                    aria-hidden="true"
                  />
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}

/**
 * Auto-generated breadcrumb from current route
 */
export function AutoBreadcrumb({
  customLabels,
  showHome = true,
  className,
}: {
  customLabels?: Record<string, string>;
  showHome?: boolean;
  className?: string;
}) {
  const location = useLocation();
  const items = generateBreadcrumbs(location.pathname, customLabels);

  return (
    <Breadcrumb items={items} showHome={showHome} className={className} />
  );
}

export default Breadcrumb;