/**
 * Firebase Mock for Testing
 * Mocks all Firebase services used in the application
 */

import { vi } from 'vitest';

// Create mock Firebase instances
const mockAuth = {
  currentUser: null,
  useDeviceLanguage: vi.fn(),
  onAuthStateChanged: vi.fn((callback) => {
    callback(null);
    return vi.fn(); // unsubscribe function
  }),
  signOut: vi.fn(() => Promise.resolve()),
};

const mockDb = {};

const mockApp = {};

// Mock Firebase functions
const mockDoc = vi.fn(() => ({
  id: 'mock-doc-id',
  path: 'mock/path',
}));

const mockCollection = vi.fn(() => ({
  id: 'mock-collection',
  path: 'mock/collection',
}));

const mockGetDoc = vi.fn(() =>
  Promise.resolve({
    exists: () => false,
    data: () => null,
    id: 'mock-doc-id',
  })
);

const mockGetDocs = vi.fn(() =>
  Promise.resolve({
    docs: [],
    empty: true,
    size: 0,
  })
);

const mockSetDoc = vi.fn(() => Promise.resolve());

const mockUpdateDoc = vi.fn(() => Promise.resolve());

const mockDeleteDoc = vi.fn(() => Promise.resolve());

const mockAddDoc = vi.fn(() => Promise.resolve({ id: 'new-doc-id' }));

const mockQuery = vi.fn((ref) => ref);

const mockWhere = vi.fn(() => ({}));

const mockOrderBy = vi.fn(() => ({}));

const mockLimit = vi.fn(() => ({}));

const mockServerTimestamp = vi.fn(() => ({
  seconds: Math.floor(Date.now() / 1000),
  nanoseconds: 0,
}));

const mockIncrement = vi.fn((n) => n);

// Mock isFirebaseInitialized
const mockIsFirebaseInitialized = vi.fn(() => true);

// Export mocks
export const auth = mockAuth;
export const db = mockDb;
export const app = mockApp;
export const isFirebaseInitialized = mockIsFirebaseInitialized;

// Mock Firebase functions
export const doc = mockDoc;
export const collection = mockCollection;
export const getDoc = mockGetDoc;
export const getDocs = mockGetDocs;
export const setDoc = mockSetDoc;
export const updateDoc = mockUpdateDoc;
export const deleteDoc = mockDeleteDoc;
export const addDoc = mockAddDoc;
export const query = mockQuery;
export const where = mockWhere;
export const orderBy = mockOrderBy;
export const limit = mockLimit;
export const serverTimestamp = mockServerTimestamp;
export const increment = mockIncrement;

// Auth functions
export const signInWithEmailAndPassword = vi.fn(() =>
  Promise.resolve({
    user: { uid: 'test-uid', email: 'test@test.com' },
  })
);

export const createUserWithEmailAndPassword = vi.fn(() =>
  Promise.resolve({
    user: { uid: 'test-uid', email: 'test@test.com' },
  })
);

export const signInWithPopup = vi.fn(() =>
  Promise.resolve({
    user: { uid: 'test-uid', email: 'test@test.com', displayName: 'Test User' },
  })
);

export const signOut = vi.fn(() => Promise.resolve());

export const updateProfile = vi.fn(() => Promise.resolve());

export const GoogleAuthProvider = vi.fn(() => ({
  addScope: vi.fn(),
}));

export const onAuthStateChanged = vi.fn((auth, callback) => {
  callback(null);
  return vi.fn();
});

// Reset all mocks
export const resetFirebaseMocks = () => {
  mockAuth.currentUser = null;
  vi.clearAllMocks();
};

// Set authenticated user
export const setAuthenticatedUser = (user: Partial<{ uid: string; email: string | null; displayName: string | null; photoURL: string | null }>) => {
  mockAuth.currentUser = {
    uid: user.uid || 'test-uid',
    email: user.email || 'test@test.com',
    displayName: user.displayName || 'Test User',
    photoURL: user.photoURL || null,
  };
};

// Set Firebase ready state
export const setFirebaseReady = (ready: boolean) => {
  mockIsFirebaseInitialized.mockReturnValue(ready);
};