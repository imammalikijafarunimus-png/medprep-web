/**
 * Test Utilities
 * Custom render function and helpers for testing React components
 */

import React, { ReactElement, ReactNode } from 'react';
import { render, RenderOptions, fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter, MemoryRouter, MemoryRouterProps } from 'react-router-dom';
import { vi, expect } from 'vitest';

// ============================================
// Types
// ============================================

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  routerProps?: Omit<MemoryRouterProps, 'children'>;
  initialAuthUser?: {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL?: string | null;
    subscriptionStatus?: 'free' | 'basic' | 'expert' | 'premium';
    stats?: {
      totalAnswered: number;
      totalCorrect: number;
      streak: number;
      systemProgress: Record<string, { answered: number; correct: number }>;
    };
  } | null;
}

// ============================================
// Mock Providers
// ============================================

// Mock AuthContext
const MockAuthProvider: React.FC<{ children: ReactNode; user?: CustomRenderOptions['initialAuthUser'] }> = ({
  children,
  user
}) => {
  const value = {
    currentUser: user,
    loading: false,
    isFirebaseReady: true,
    loginWithGoogle: vi.fn(),
    logout: vi.fn(),
    register: vi.fn(),
    login: vi.fn(),
    updateUserProfile: vi.fn(),
    updateGlobalStats: vi.fn(),
    getRateLimitStatus: vi.fn(() => ({ remainingAttempts: 5, blockedFor: undefined })),
  };

  // Create a simple context provider without importing the actual AuthContext
  return React.createElement(
    React.createContext(value).Provider,
    { value },
    children
  );
};

// Mock ThemeContext
const MockThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const value = {
    isDarkMode: false,
    toggleTheme: vi.fn(),
  };

  return React.createElement(
    React.createContext(value).Provider,
    { value },
    children
  );
};

// ============================================
// Custom Render Function
// ============================================

const AllProviders: React.FC<{
  children: ReactNode;
  routerProps?: CustomRenderOptions['routerProps'];
  initialAuthUser?: CustomRenderOptions['initialAuthUser'];
}> = ({ children, routerProps, initialAuthUser }) => {
  return (
    <MemoryRouter {...routerProps}>
      <MockAuthProvider user={initialAuthUser}>
        <MockThemeProvider>
          {children}
        </MockThemeProvider>
      </MockAuthProvider>
    </MemoryRouter>
  );
};

/**
 * Custom render function that includes all providers
 */
export function renderWithProviders(
  ui: ReactElement,
  options: CustomRenderOptions = {}
) {
  const { routerProps, initialAuthUser, ...renderOptions } = options;

  return {
    user: userEvent.setup(),
    ...render(ui, {
      wrapper: ({ children }) => (
        <AllProviders routerProps={routerProps} initialAuthUser={initialAuthUser}>
          {children}
        </AllProviders>
      ),
      ...renderOptions,
    }),
  };
}

/**
 * Simple render with router only
 */
export function renderWithRouter(
  ui: ReactElement,
  routerProps?: Omit<MemoryRouterProps, 'children'>
) {
  return render(ui, {
    wrapper: ({ children }) => (
      <MemoryRouter {...routerProps}>{children}</MemoryRouter>
    ),
  });
}

// ============================================
// Helper Functions
// ============================================

/**
 * Wait for element to appear
 */
export async function waitForElement(
  text: string | RegExp,
  timeout = 3000
): Promise<HTMLElement> {
  return waitFor(
    () => screen.getByText(text),
    { timeout }
  );
}

/**
 * Check if element is not in document
 */
export async function expectNotToBeInTheDocument(text: string | RegExp): Promise<void> {
  await waitFor(() => {
    expect(screen.queryByText(text)).not.toBeInTheDocument();
  });
}

/**
 * Create mock function with implementation
 */
export function createMockFn<T extends (...args: unknown[]) => unknown>(implementation?: T) {
  return vi.fn(implementation);
}

/**
 * Mock localStorage
 */
export function mockLocalStorage() {
  const store: Record<string, string> = {};

  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      Object.keys(store).forEach(key => delete store[key]);
    }),
    get store() {
      return { ...store };
    },
  };
}

/**
 * Generate mock user for testing
 */
export function createMockUser(overrides?: Partial<{
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  subscriptionStatus: 'free' | 'basic' | 'expert' | 'premium';
  university: string;
}>) {
  return {
    uid: 'test-uid',
    email: 'test@test.com',
    displayName: 'Test User',
    photoURL: null,
    subscriptionStatus: 'free' as const,
    university: 'Test University',
    ...overrides,
  };
}

/**
 * Wait for loading to finish
 */
export async function waitForLoadingToFinish() {
  await waitFor(
    () => {
      const loadingElements = screen.queryAllByText(/loading|memuat/i);
      expect(loadingElements.length).toBe(0);
    },
    { timeout: 3000 }
  );
}

// Re-export everything from testing library for convenience
export * from '@testing-library/react';
export { screen, waitFor, fireEvent };
export { default as userEvent } from '@testing-library/user-event';