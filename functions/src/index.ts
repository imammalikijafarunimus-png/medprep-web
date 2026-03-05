/**
 * Firebase Cloud Functions - Role Management
 * @module functions/index
 * 
 * Server-side admin role assignment via Custom Claims.
 * These functions must be deployed to Firebase:
 * 
 * Deploy: firebase deploy --only functions
 */

import { onCall, HttpsError } from "firebase-functions/v2/https";
import { onDocumentWritten } from "firebase-functions/v2/firestore";
import * as admin from "firebase-admin";

// Initialize Firebase Admin SDK
admin.initializeApp();

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
type UserRole = "student" | "admin" | "superadmin";

interface SetRolePayload {
  targetUid: string;
  role: UserRole;
}

// ─────────────────────────────────────────────
// 1. setUserRole
//    Callable dari frontend — hanya superadmin yang boleh memanggil
// ─────────────────────────────────────────────
export const setUserRole = onCall(async (request) => {
  // Pastikan caller sudah login
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Harus login terlebih dahulu.");
  }

  const callerClaims = request.auth.token;

  // Hanya superadmin yang bisa set role
  if (callerClaims.role !== "superadmin") {
    throw new HttpsError(
      "permission-denied",
      "Hanya superadmin yang dapat mengubah role pengguna."
    );
  }

  const { targetUid, role } = request.data as SetRolePayload;

  // Validasi input
  if (!targetUid || typeof targetUid !== "string") {
    throw new HttpsError("invalid-argument", "targetUid tidak valid.");
  }

  const validRoles: UserRole[] = ["student", "admin", "superadmin"];
  if (!validRoles.includes(role)) {
    throw new HttpsError(
      "invalid-argument",
      `Role tidak valid. Gunakan: ${validRoles.join(", ")}`
    );
  }

  // Prevent self-demotion from superadmin
  if (targetUid === request.auth.uid && role !== "superadmin") {
    throw new HttpsError(
      "failed-precondition",
      "Anda tidak dapat menurunkan role superadmin diri sendiri."
    );
  }

  try {
    // Set custom claim di Firebase Auth
    await admin.auth().setCustomUserClaims(targetUid, { role });

    // Catat perubahan di Firestore untuk audit log
    await admin.firestore().collection("audit_logs").add({
      action: "set_role",
      targetUid,
      role,
      performedBy: request.auth.uid,
      performerEmail: request.auth.token.email || null,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      metadata: {
        previousRole: "unknown", // Could be enhanced to track previous role
      }
    });

    // Update field role di dokumen users/ juga (untuk query dan backup)
    await admin
      .firestore()
      .collection("users")
      .doc(targetUid)
      .set({ 
        role,
        roleUpdatedAt: admin.firestore.FieldValue.serverTimestamp(),
        roleUpdatedBy: request.auth.uid,
      }, { merge: true });

    console.log(`[setUserRole] Role '${role}' set for UID: ${targetUid} by ${request.auth.uid}`);

    return { success: true, message: `Role '${role}' berhasil di-set.` };
  } catch (error) {
    console.error("[setUserRole] Error:", error);
    throw new HttpsError("internal", "Gagal mengubah role. Coba lagi.");
  }
});

// ─────────────────────────────────────────────
// 2. initializeSuperadmin
//    Dipanggil SEKALI saat setup awal via secret key
// ─────────────────────────────────────────────
export const initializeSuperadmin = onCall(async (request) => {
  // Endpoint ini dilindungi oleh secret key di env
  const { secretKey, targetUid } = request.data as {
    secretKey: string;
    targetUid: string;
  };

  const expectedKey = process.env.SUPERADMIN_INIT_SECRET;
  if (!expectedKey || secretKey !== expectedKey) {
    throw new HttpsError("permission-denied", "Secret key tidak valid.");
  }

  if (!targetUid || typeof targetUid !== "string") {
    throw new HttpsError("invalid-argument", "targetUid tidak valid.");
  }

  try {
    // Verify user exists
    await admin.auth().getUser(targetUid);

    // Set superadmin claim
    await admin.auth().setCustomUserClaims(targetUid, { role: "superadmin" });
    
    // Update Firestore
    await admin
      .firestore()
      .collection("users")
      .doc(targetUid)
      .set({ 
        role: "superadmin",
        roleUpdatedAt: admin.firestore.FieldValue.serverTimestamp(),
      }, { merge: true });

    // Log the action
    await admin.firestore().collection("audit_logs").add({
      action: "initialize_superadmin",
      targetUid,
      performedBy: "system",
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log(`[initializeSuperadmin] Superadmin initialized for UID: ${targetUid}`);

    return { success: true, message: "Superadmin berhasil di-inisialisasi." };
  } catch (error) {
    console.error("[initializeSuperadmin] Error:", error);
    throw new HttpsError("internal", "Gagal menginisialisasi superadmin.");
  }
});

// ─────────────────────────────────────────────
// 3. onUserCreated (Firestore trigger)
//    Set default role "student" setiap ada user baru terdaftar
// ─────────────────────────────────────────────
export const onUserCreated = onDocumentWritten("users/{userId}", async (event) => {
  const after = event.data?.after;
  if (!after?.exists) return; // Dokumen dihapus, skip

  const data = after.data();
  const userId = event.params.userId;

  // Hanya proses jika ini dokumen BARU (before tidak ada)
  const before = event.data?.before;
  if (before?.exists) return; // Update, bukan create

  // Jika belum ada role, set default ke "student"
  if (!data?.role) {
    try {
      await admin.auth().setCustomUserClaims(userId, { role: "student" });
      await after.ref.set({ role: "student" }, { merge: true });
      console.log(`[onUserCreated] Default role 'student' set for user: ${userId}`);
    } catch (error) {
      console.error(`[onUserCreated] Error setting default role for ${userId}:`, error);
    }
  }
});

// ─────────────────────────────────────────────
// 4. getUserRole
//    Callable untuk mendapatkan role user tertentu (admin only)
// ─────────────────────────────────────────────
export const getUserRole = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Harus login terlebih dahulu.");
  }

  const callerClaims = request.auth.token;
  if (!["admin", "superadmin"].includes(callerClaims.role as string)) {
    throw new HttpsError("permission-denied", "Akses ditolak.");
  }

  const { targetUid } = request.data as { targetUid: string };

  if (!targetUid || typeof targetUid !== "string") {
    throw new HttpsError("invalid-argument", "targetUid tidak valid.");
  }

  try {
    const userRecord = await admin.auth().getUser(targetUid);
    const claims = userRecord.customClaims || {};
    return { uid: targetUid, role: claims.role || "student" };
  } catch {
    throw new HttpsError("not-found", "User tidak ditemukan.");
  }
});

// ─────────────────────────────────────────────
// 5. getAllUsersWithRoles
//    Callable untuk mendapatkan semua user dengan role (superadmin only)
// ─────────────────────────────────────────────
export const getAllUsersWithRoles = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Harus login terlebih dahulu.");
  }

  const callerClaims = request.auth.token;
  if (callerClaims.role !== "superadmin") {
    throw new HttpsError("permission-denied", "Hanya superadmin yang dapat mengakses.");
  }

  const { pageToken, pageSize = 100 } = request.data as { 
    pageToken?: string; 
    pageSize?: number;
  };

  try {
    const listUsersResult = await admin.auth().listUsers(pageSize, pageToken);
    
    const users = listUsersResult.users.map(user => ({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      role: (user.customClaims?.role as UserRole) || "student",
      disabled: user.disabled,
      createdAt: user.metadata.creationTime,
      lastSignInTime: user.metadata.lastSignInTime,
    }));

    return {
      users,
      nextPageToken: listUsersResult.pageToken || null,
    };
  } catch (error) {
    console.error("[getAllUsersWithRoles] Error:", error);
    throw new HttpsError("internal", "Gagal mengambil data pengguna.");
  }
});