/**
 * User Management Page
 * @module pages/UserManagement
 * 
 * Superadmin-only page for managing user roles.
 * Uses Cloud Functions to set custom claims.
 */

import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { useRoleManagement } from '../hooks/useRoleManagement';
import { UserRole, ROLE_LABELS, ROLE_COLORS } from '../types/auth';
import { Navigate } from 'react-router-dom';

// ============================================
// TYPES
// ============================================

interface UserListItem {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: UserRole;
  university?: string;
  subscriptionStatus?: string;
  createdAt?: Date;
}

// ============================================
// COMPONENT
// ============================================

export default function UserManagement() {
  const { currentUser, isSuperAdmin, loading: authLoading } = useAuth();
  const { setUserRole, loading: roleLoading, error, clearError } = useRoleManagement();
  
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserListItem | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [successMsg, setSuccessMsg] = useState('');

  // ============================================
  // HOOKS - MUST BE CALLED BEFORE ANY CONDITIONAL RETURNS
  // ============================================

  // Load users from Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      if (!db || !isSuperAdmin) return;
      
      try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        
        const userList: UserListItem[] = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            uid: doc.id,
            email: data.email || null,
            displayName: data.displayName || null,
            role: data.role || 'student',
            university: data.university,
            subscriptionStatus: data.subscriptionStatus,
            createdAt: data.createdAt?.toDate(),
          };
        });
        
        setUsers(userList);
      } catch (err) {
        console.error('Error fetching users:', err);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, [isSuperAdmin]);

  // ============================================
  // CONDITIONAL RENDERS - AFTER ALL HOOKS
  // ============================================

  // Loading state
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  // Redirect if not superadmin
  if (!isSuperAdmin) {
    return <Navigate to="/app/dashboard" replace />;
  }

  // Filter users by search query
  const filteredUsers = users.filter(user => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      user.email?.toLowerCase().includes(query) ||
      user.displayName?.toLowerCase().includes(query) ||
      user.uid.toLowerCase().includes(query)
    );
  });

  // Handle role change
  const handleRoleChange = async () => {
    if (!selectedUser) return;
    
    setSuccessMsg('');
    const success = await setUserRole(selectedUser.uid, selectedRole);
    
    if (success) {
      setSuccessMsg(`✅ Role berhasil diubah menjadi ${ROLE_LABELS[selectedRole]} untuk ${selectedUser.email}`);
      
      // Update local state
      setUsers(prev => prev.map(user => 
        user.uid === selectedUser.uid 
          ? { ...user, role: selectedRole }
          : user
      ));
      
      setSelectedUser(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            👑 Manajemen Pengguna
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
            Kelola role dan akses pengguna
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-600 dark:text-slate-400">Login sebagai:</span>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            currentUser?.role === 'superadmin' 
              ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
              : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
          }`}>
            {currentUser?.email} ({ROLE_LABELS[currentUser?.role || 'student']})
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard 
          label="Total Pengguna" 
          value={users.length.toString()} 
          icon="👥"
        />
        <StatCard 
          label="Student" 
          value={users.filter(u => u.role === 'student').length.toString()} 
          icon="🎓"
          color="blue"
        />
        <StatCard 
          label="Admin" 
          value={users.filter(u => u.role === 'admin').length.toString()} 
          icon="🛠️"
          color="yellow"
        />
        <StatCard 
          label="Superadmin" 
          value={users.filter(u => u.role === 'superadmin').length.toString()} 
          icon="👑"
          color="purple"
        />
      </div>

      {/* Search & Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Cari berdasarkan email, nama, atau UID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={() => setLoadingUsers(true)}
            className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center justify-between">
          <span className="text-red-700 dark:text-red-400 text-sm">❌ {error}</span>
          <button onClick={clearError} className="text-red-500 hover:text-red-700">✕</button>
        </div>
      )}
      
      {successMsg && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <span className="text-green-700 dark:text-green-400 text-sm">{successMsg}</span>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        {loadingUsers ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent mx-auto" />
            <p className="text-slate-500 dark:text-slate-400 mt-2">Memuat pengguna...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-slate-500 dark:text-slate-400">
              {searchQuery ? 'Tidak ada pengguna yang cocok' : 'Belum ada pengguna'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-900">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Pengguna</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Role</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Universitas</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {filteredUsers.map((user) => (
                  <tr key={user.uid} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">
                          {user.displayName || 'Tanpa Nama'}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {user.email}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                        ROLE_COLORS[user.role].bg
                      } ${ROLE_COLORS[user.role].text}`}>
                        {ROLE_LABELS[user.role]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                      {user.university || '-'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-1 rounded text-xs ${
                        user.subscriptionStatus === 'premium' 
                          ? 'bg-amber-100 text-amber-800'
                          : user.subscriptionStatus === 'expert'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {user.subscriptionStatus || 'free'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setSelectedRole(user.role);
                          setSuccessMsg('');
                          clearError();
                        }}
                        disabled={user.uid === currentUser?.uid && user.role === 'superadmin'}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Ubah Role
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Role Change Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              Ubah Role Pengguna
            </h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Pengguna:</p>
                <p className="font-medium text-slate-900 dark:text-white">
                  {selectedUser.displayName || selectedUser.email}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  UID: {selectedUser.uid}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Role Baru
                </label>
                <div className="space-y-2">
                  {(['student', 'admin', 'superadmin'] as UserRole[]).map((role) => (
                    <label
                      key={role}
                      className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedRole === role
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="role"
                        value={role}
                        checked={selectedRole === role}
                        onChange={() => setSelectedRole(role)}
                        className="sr-only"
                      />
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        ROLE_COLORS[role].bg
                      } ${ROLE_COLORS[role].text}`}>
                        {ROLE_LABELS[role]}
                      </span>
                      <span className="ml-2 text-sm text-slate-600 dark:text-slate-400">
                        {role === 'student' && 'Akses belajar'}
                        {role === 'admin' && 'Kelola konten'}
                        {role === 'superadmin' && 'Akses penuh'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setSelectedUser(null)}
                className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                Batal
              </button>
              <button
                onClick={handleRoleChange}
                disabled={roleLoading || selectedRole === selectedUser.role}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium"
              >
                {roleLoading ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info Panel */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
        <h3 className="font-semibold text-amber-800 dark:text-amber-400 mb-2">
          ⚠️ Catatan Keamanan
        </h3>
        <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
          <li>• Perubahan role diproses di server (Cloud Functions)</li>
          <li>• User perlu logout & login ulang agar role baru aktif</li>
          <li>• Semua perubahan dicatat di audit_logs Firestore</li>
          <li>• Anda tidak dapat menurunkan role superadmin diri sendiri</li>
        </ul>
      </div>
    </div>
  );
}

// ============================================
// SUBCOMPONENTS
// ============================================

function StatCard({ 
  label, 
  value, 
  icon, 
  color = 'slate' 
}: { 
  label: string; 
  value: string; 
  icon: string;
  color?: 'slate' | 'blue' | 'yellow' | 'purple';
}) {
  const colors = {
    slate: 'bg-slate-100 dark:bg-slate-700',
    blue: 'bg-blue-100 dark:bg-blue-900/50',
    yellow: 'bg-yellow-100 dark:bg-yellow-900/50',
    purple: 'bg-purple-100 dark:bg-purple-900/50',
  };

  return (
    <div className={`${colors[color]} rounded-xl p-4`}>
      <div className="flex items-center justify-between">
        <span className="text-2xl">{icon}</span>
        <span className="text-2xl font-bold text-slate-900 dark:text-white">{value}</span>
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">{label}</p>
    </div>
  );
}