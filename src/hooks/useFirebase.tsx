/**
 * Firebase Safe Access Hooks
 * @module hooks/useFirebase
 * 
 * Provides type-safe Firebase access with null checks
 */

import { useCallback, useState, useEffect } from 'react';
import { 
  Firestore, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  addDoc,
  DocumentData,
  DocumentReference,
  CollectionReference,
  Query
} from 'firebase/firestore';
import { Auth } from 'firebase/auth';
import { db, auth, isFirebaseInitialized } from '../lib/firebase';

// ============================================
// TYPES
// ============================================

export interface FirebaseStatus {
  isReady: boolean;
  db: Firestore | null;
  auth: Auth | null;
}

export interface UseFirebaseResult extends FirebaseStatus {
  // Safe Firestore operations
  safeDoc: (path: string, ...pathSegments: string[]) => DocumentReference<DocumentData> | null;
  safeCollection: (path: string) => CollectionReference<DocumentData> | null;
  safeGetDoc: (ref: DocumentReference) => Promise<DocumentData | null>;
  safeGetDocs: (q: Query) => Promise<DocumentData[]>;
  safeSetDoc: (ref: DocumentReference, data: DocumentData) => Promise<boolean>;
  safeUpdateDoc: (ref: DocumentReference, data: DocumentData) => Promise<boolean>;
  safeDeleteDoc: (ref: DocumentReference) => Promise<boolean>;
  safeAddDoc: (collectionRef: CollectionReference, data: DocumentData) => Promise<string | null>;
}

// ============================================
// HOOK: useFirebase
// ============================================

export function useFirebase(): UseFirebaseResult {
  const [status, setStatus] = useState<FirebaseStatus>({
    isReady: false,
    db: null,
    auth: null
  });

  useEffect(() => {
    const ready = isFirebaseInitialized();
    // Use functional update to avoid cascading
    setStatus(() => ({
      isReady: ready,
      db: ready ? db : null,
      auth: ready ? auth : null
    }));
  }, []);

  // Safe document reference
  const safeDoc = useCallback(
    (path: string, ...pathSegments: string[]): DocumentReference<DocumentData> | null => {
      if (!db) {
        console.warn('[Firebase] DB not initialized - cannot create doc reference');
        return null;
      }
      return doc(db, path, ...pathSegments);
    },
    []
  );

  // Safe collection reference
  const safeCollection = useCallback(
    (path: string): CollectionReference<DocumentData> | null => {
      if (!db) {
        console.warn('[Firebase] DB not initialized - cannot create collection reference');
        return null;
      }
      return collection(db, path);
    },
    []
  );

  // Safe get document
  const safeGetDoc = useCallback(
    async (ref: DocumentReference): Promise<DocumentData | null> => {
      if (!db) {
        console.warn('[Firebase] DB not initialized');
        return null;
      }
      try {
        const snapshot = await getDoc(ref);
        return snapshot.exists() ? snapshot.data() : null;
      } catch (error) {
        console.error('[Firebase] Get doc error:', error);
        return null;
      }
    },
    []
  );

  // Safe get documents
  const safeGetDocs = useCallback(
    async (q: Query): Promise<DocumentData[]> => {
      if (!db) {
        console.warn('[Firebase] DB not initialized');
        return [];
      }
      try {
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } catch (error) {
        console.error('[Firebase] Get docs error:', error);
        return [];
      }
    },
    []
  );

  // Safe set document
  const safeSetDoc = useCallback(
    async (ref: DocumentReference, data: DocumentData): Promise<boolean> => {
      if (!db) {
        console.warn('[Firebase] DB not initialized');
        return false;
      }
      try {
        await setDoc(ref, data);
        return true;
      } catch (error) {
        console.error('[Firebase] Set doc error:', error);
        return false;
      }
    },
    []
  );

  // Safe update document
  const safeUpdateDoc = useCallback(
    async (ref: DocumentReference, data: DocumentData): Promise<boolean> => {
      if (!db) {
        console.warn('[Firebase] DB not initialized');
        return false;
      }
      try {
        await updateDoc(ref, data);
        return true;
      } catch (error) {
        console.error('[Firebase] Update doc error:', error);
        return false;
      }
    },
    []
  );

  // Safe delete document
  const safeDeleteDoc = useCallback(
    async (ref: DocumentReference): Promise<boolean> => {
      if (!db) {
        console.warn('[Firebase] DB not initialized');
        return false;
      }
      try {
        await deleteDoc(ref);
        return true;
      } catch (error) {
        console.error('[Firebase] Delete doc error:', error);
        return false;
      }
    },
    []
  );

  // Safe add document
  const safeAddDoc = useCallback(
    async (collectionRef: CollectionReference, data: DocumentData): Promise<string | null> => {
      if (!db) {
        console.warn('[Firebase] DB not initialized');
        return null;
      }
      try {
        const docRef = await addDoc(collectionRef, data);
        return docRef.id;
      } catch (error) {
        console.error('[Firebase] Add doc error:', error);
        return null;
      }
    },
    []
  );

  return {
    ...status,
    safeDoc,
    safeCollection,
    safeGetDoc,
    safeGetDocs,
    safeSetDoc,
    safeUpdateDoc,
    safeDeleteDoc,
    safeAddDoc
  };
}

// ============================================
// HOOK: useUserProfile
// ============================================

export interface UserProfile {
  uid?: string;
  email?: string;
  displayName?: string;
  university?: string;
  subscriptionStatus?: 'free' | 'basic' | 'expert' | 'premium';
  segment?: 'muhammadiyah' | 'general';
  role?: 'student' | 'admin';
  stats?: {
    totalAnswered: number;
    totalCorrect: number;
    streak: number;
    systemProgress: Record<string, { answered: number; correct: number }>;
  };
}

export function useUserProfile(userId: string | undefined) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isReady, safeDoc, safeGetDoc } = useFirebase();

  useEffect(() => {
    if (!userId || !isReady) {
      setProfile(() => null);
      return;
    }

    const fetchProfile = async () => {
      setLoading(true);
      setError(null);

      const docRef = safeDoc('users', userId);
      if (!docRef) {
        setLoading(false);
        setError('Firebase not ready');
        return;
      }

      const data = await safeGetDoc(docRef);
      if (data) {
        setProfile(data as UserProfile);
      } else {
        setProfile(null);
      }
      
      setLoading(false);
    };

    fetchProfile();
  }, [userId, isReady, safeDoc, safeGetDoc]);

  return { profile, loading, error };
}

// ============================================
// COMPONENT: Firebase Required Wrapper
// ============================================

interface FirebaseRequiredProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function FirebaseRequired({ children, fallback }: FirebaseRequiredProps) {
  const { isReady } = useFirebase();

  if (!isReady) {
    return fallback ? <>{fallback}</> : (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center p-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-2">
            Konfigurasi Firebase Diperlukan
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
            Buat file <code className="px-1 py-0.5 bg-slate-100 dark:bg-slate-800 rounded">.env.local</code> dengan konfigurasi Firebase Anda.
            Lihat <code className="px-1 py-0.5 bg-slate-100 dark:bg-slate-800 rounded">.env.example</code> untuk referensi.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}