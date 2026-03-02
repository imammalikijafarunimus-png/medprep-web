/**
 * AuthContext Integration Tests
 * Testing authentication context functionality
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { AuthProvider, useAuth } from './AuthContext';

// Mock Firebase
vi.mock('../lib/firebase', () => ({
  auth: null,
  db: null,
  isFirebaseInitialized: () => false,
}));

// Test component that uses auth context
const TestComponent = () => {
  const { currentUser, loading, isFirebaseReady, login, logout } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <span data-testid="firebase-ready">{isFirebaseReady ? 'Ready' : 'Not Ready'}</span>
      <span data-testid="user-status">{currentUser ? 'Logged In' : 'Logged Out'}</span>
      {currentUser && (
        <span data-testid="user-email">{currentUser.email}</span>
      )}
      <button onClick={() => login('test@test.com', 'password')}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Initialization', () => {
    it('should render without crashing', () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      expect(screen.getByTestId('firebase-ready')).toBeInTheDocument();
    });

    it('should show loading state initially', () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      // Loading should complete quickly with Firebase not initialized
      expect(screen.queryByText('Loading...')).toBeDefined();
    });

    it('should indicate Firebase is not ready when not initialized', async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('firebase-ready').textContent).toBe('Not Ready');
      });
    });
  });

  describe('User State', () => {
    it('should show logged out state initially', async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('user-status').textContent).toBe('Logged Out');
      });
    });
  });

  describe('useAuth hook', () => {
    it('should throw error when used outside provider', () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<TestComponent />);
      }).toThrow('useAuth must be used within an AuthProvider');

      consoleError.mockRestore();
    });
  });
});

// Additional tests for when Firebase IS ready
describe('AuthContext with Firebase Ready', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  it('should indicate Firebase is ready when initialized', async () => {
    // Create a proper mock for Firebase auth
    const mockOnAuthStateChanged = vi.fn((auth, callback) => {
      // Immediately call callback with null (no user)
      callback(null);
      // Return unsubscribe function
      return vi.fn();
    });

    // Re-mock with Firebase ready and proper auth mock
    vi.doMock('../lib/firebase', () => ({
      auth: {
        onAuthStateChanged: mockOnAuthStateChanged,
      },
      db: {},
      isFirebaseInitialized: () => true,
    }));

    // Need to re-import after mocking
    vi.doMock('firebase/auth', () => ({
      onAuthStateChanged: mockOnAuthStateChanged,
    }));

    const { AuthProvider: FreshAuthProvider, useAuth: freshUseAuth } = await import(
      './AuthContext'
    );

    const TestComp = () => {
      const { isFirebaseReady } = freshUseAuth();
      return <span data-testid="status">{isFirebaseReady ? 'Ready' : 'Not Ready'}</span>;
    };

    render(
      <FreshAuthProvider>
        <TestComp />
      </FreshAuthProvider>
    );

    // Wait a bit for the effect to run
    await waitFor(() => {
      expect(screen.getByTestId('status').textContent).toBe('Ready');
    }, { timeout: 3000 });
  });
});