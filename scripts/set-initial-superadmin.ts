#!/usr/bin/env ts-node
/**
 * Set Initial Superadmin Script
 * @module scripts/set-initial-superadmin
 * 
 * Run this script ONCE to set up the first superadmin.
 * After that, superadmin can set roles for other users via the UI.
 * 
 * PREREQUISITES:
 * 1. Download serviceAccountKey.json from Firebase Console:
 *    Project Settings → Service Accounts → Generate new private key
 * 
 * 2. Add to .gitignore:
 *    serviceAccountKey.json
 *    *.json.key
 * 
 * USAGE:
 *   # Using environment variables
 *   GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json \
 *   SUPERADMIN_EMAIL=your@email.com \
 *   npx ts-node scripts/set-initial-superadmin.ts
 * 
 *   # Or create a .env file with:
 *   GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json
 *   SUPERADMIN_EMAIL=your@email.com
 * 
 * SECURITY WARNING:
 * - NEVER commit serviceAccountKey.json to git!
 * - Delete the key file after use
 * - This script should only be run by trusted administrators
 */

import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env if exists
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Configuration
const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
const superadminEmail = process.env.SUPERADMIN_EMAIL;

// Validation
if (!serviceAccountPath) {
  console.error('❌ Error: GOOGLE_APPLICATION_CREDENTIALS environment variable is required');
  console.error('   Set it to the path of your serviceAccountKey.json');
  console.error('');
  console.error('Example:');
  console.error('   GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json \\');
  console.error('   SUPERADMIN_EMAIL=your@email.com \\');
  console.error('   npx ts-node scripts/set-initial-superadmin.ts');
  process.exit(1);
}

if (!superadminEmail) {
  console.error('❌ Error: SUPERADMIN_EMAIL environment variable is required');
  console.error('   Set it to the email of the user you want to make superadmin');
  process.exit(1);
}

// Type assertion after validation
const email: string = superadminEmail;

// Initialize Firebase Admin
try {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
  console.log('✅ Firebase Admin initialized successfully');
} catch (error) {
  console.error('❌ Failed to initialize Firebase Admin:', error);
  process.exit(1);
}

// Main function
async function main() {
  console.log('');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('  MedPrep - Set Initial Superadmin');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('');

  try {
    // Step 1: Find user by email
    console.log(`🔍 Looking up user with email: ${email}`);
    const user = await admin.auth().getUserByEmail(email);
    console.log(`✅ User found!`);
    console.log(`   UID: ${user.uid}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Display Name: ${user.displayName || '(not set)'}`);
    console.log('');

    // Step 2: Check current claims
    const currentClaims = user.customClaims || {};
    const currentRole = currentClaims.role || 'none';
    console.log(`📋 Current role: ${currentRole}`);
    
    if (currentRole === 'superadmin') {
      console.log('⚠️  User is already a superadmin. No changes needed.');
      process.exit(0);
    }

    // Step 3: Confirm action
    console.log('');
    console.log('⚠️  WARNING: This will set this user as SUPERADMIN');
    console.log('   Superadmin has full access to:');
    console.log('   - Manage user roles (admin, superadmin)');
    console.log('   - Access all admin features');
    console.log('   - View audit logs');
    console.log('   - Delete users');
    console.log('');

    // Step 4: Set superadmin role
    console.log('🔄 Setting superadmin role...');
    
    // Set custom claims in Firebase Auth
    await admin.auth().setCustomUserClaims(user.uid, { role: 'superadmin' });
    console.log('✅ Custom claims set in Firebase Auth');

    // Update Firestore user document
    await admin.firestore().collection('users').doc(user.uid).set({
      role: 'superadmin',
      roleUpdatedAt: admin.firestore.FieldValue.serverTimestamp(),
      roleUpdatedBy: 'initial_setup_script',
    }, { merge: true });
    console.log('✅ Firestore user document updated');

    // Log to audit_logs
    await admin.firestore().collection('audit_logs').add({
      action: 'initial_superadmin_setup',
      targetUid: user.uid,
      targetEmail: user.email,
      performedBy: 'setup_script',
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      metadata: {
        script: 'set-initial-superadmin.ts',
      }
    });
    console.log('✅ Audit log created');

    console.log('');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('  ✅ SUCCESS!');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('');
    console.log('The user now has superadmin role.');
    console.log('');
    console.log('⚠️  IMPORTANT: The user needs to:');
    console.log('   1. Log out of the application');
    console.log('   2. Log in again for the new role to take effect');
    console.log('');
    console.log('💡 Next steps:');
    console.log('   - Delete the serviceAccountKey.json file for security');
    console.log('   - Access /app/users to manage other user roles');
    console.log('');

  } catch (error: any) {
    console.error('');
    console.error('═══════════════════════════════════════════════════════════');
    console.error('  ❌ ERROR');
    console.error('═══════════════════════════════════════════════════════════');
    console.error('');
    
    if (error.code === 'auth/user-not-found') {
      console.error('User not found with email:', email);
      console.error('');
      console.error('Make sure:');
      console.error('1. The user has registered in the app first');
      console.error('2. The email is correct');
    } else if (error.code === 'auth/invalid-email') {
      console.error('Invalid email format:', email);
    } else {
      console.error('Error:', error.message || error);
    }
    
    process.exit(1);
  }

  process.exit(0);
}

// Run
main();