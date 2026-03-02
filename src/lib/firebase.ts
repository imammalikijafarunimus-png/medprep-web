/**
 * Firebase Configuration with Enhanced Security
 * @module lib/firebase
 * 
 * Security improvements:
 * - Strict environment variable validation
 * - Graceful error handling
 * - Type-safe configuration
 */

import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// ============================================
// ENVIRONMENT VALIDATION
// ============================================

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

/**
 * Required environment variables for Firebase
 */
const REQUIRED_ENV_VARS = [
  'VITE_API_KEY',
  'VITE_AUTH_DOMAIN', 
  'VITE_PROJECT_ID',
  'VITE_STORAGE_BUCKET',
  'VITE_MESSAGING_SENDER_ID',
  'VITE_APP_ID'
] as const;

/**
 * Validates that all required environment variables are present
 * @throws Error if any required variables are missing
 */
function validateEnvironment(): void {
  const missingVars = REQUIRED_ENV_VARS.filter(
    varName => !import.meta.env[varName]
  );

  if (missingVars.length > 0) {
    const errorMsg = `[Firebase] Missing required environment variables: ${missingVars.join(', ')}. ` +
      `Please check your .env file or deployment configuration.`;
    
    // In development, show detailed error
    if (import.meta.env.DEV) {
      console.error(errorMsg);
      console.error('Expected variables:', REQUIRED_ENV_VARS);
      console.error('Current env:', import.meta.env);
    }
    
    throw new Error(errorMsg);
  }
}

/**
 * Creates Firebase configuration from environment variables
 */
function createFirebaseConfig(): FirebaseConfig {
  validateEnvironment();

  return {
    apiKey: import.meta.env.VITE_API_KEY,
    authDomain: import.meta.env.VITE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_APP_ID,
  };
}

// ============================================
// FIREBASE INITIALIZATION
// ============================================

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

try {
  const config = createFirebaseConfig();
  app = initializeApp(config);
  auth = getAuth(app);
  db = getFirestore(app);
  
  // Configure auth settings for better security
  auth.useDeviceLanguage();
  
  if (import.meta.env.DEV) {
    console.log('[Firebase] Initialized successfully');
    console.log('[Firebase] Project ID:', config.projectId);
  }
} catch (error) {
  console.error('[Firebase] Initialization failed:', error);
  
  // Re-throw to prevent app from running with broken config
  throw error;
}

// Di akhir file firebase.ts
export { app, auth, db };

// ⬇️ PASTIKAN INI ADA!
export const isFirebaseInitialized = (): boolean => {
  return app !== null && auth !== null && db !== null;
};