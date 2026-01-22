import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; // Pastikan AuthContext sudah ada updateUserProfile
import { Mail, School, BookOpen, Edit2, Save, X, Trophy } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase'; // Sesuaikan path firebase Anda
import toast from 'react-hot-toast';

interface UserProfileData {
  university: string;
  batch: string;
  targetScore: string;
  motto: string;
}

export default function UserProfile() {
  // Ambil updateUserProfile dari Context (fitur baru)
  const { currentUser, logout, updateUserProfile } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // State Nama Lengkap
  const [displayName, setDisplayName] = useState('');

  // State Data Firestore
  const [formData, setFormData] = useState<UserProfileData>({
    university: '',
    batch: '',
    targetScore: '',
    motto: ''
  });

  // 1. Ambil Data Saat Load
  useEffect(() => {
    const fetchProfile = async () => {
      if (currentUser) {
        // Ambil Nama dari Auth
        setDisplayName(currentUser.displayName || '');

        // Ambil Data dari Firestore
        try {
          const docRef = doc(db, "users", currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setFormData(docSnap.data() as UserProfileData);
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      }
    };
    fetchProfile();
  }, [currentUser]);

  // 2. Fungsi Simpan (Diperbarui agar lebih mulus)
  const handleSave = async () => {
    if (!currentUser) return;
    setLoading(true);
    const toastId = toast.loading("Menyimpan profil...");

    try {
      // A. Update Nama di Auth Context (Tanpa Reload!)
      if (displayName !== currentUser.displayName) {
        await updateUserProfile(displayName); 
      }

      // B. Update Data Tambahan di Firestore
      await setDoc(doc(db, "users", currentUser.uid), formData, { merge: true });

      toast.success("Profil berhasil diperbarui!", { id: toastId });
      setIsEditing(false);
      
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Gagal menyimpan data.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) return null;

  // Nama untuk Avatar (Fallback ke Email jika kosong)
  const visibleName = displayName || currentUser.email?.split('@')[0] || 'Dokter';

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8 animate-in fade-in pb-24">
      
      {/* Header Page */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Profil Dokter Muda</h1>
          <p className="text-slate-500 text-sm">Kelola data diri dan target belajar Anda.</p>
        </div>
        <button 
          onClick={() => {
            if(confirm("Yakin ingin keluar?")) logout();
          }} 
          className="text-sm text-red-500 hover:text-red-700 font-bold px-4 py-2 border border-red-200 rounded-lg hover:bg-red-50 transition-all"
        >
          Logout
        </button>
      </div>
      
      {/* Kartu Identitas Utama */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center gap-6 mb-6 shadow-sm relative overflow-hidden">
        {/* Dekorasi Background */}
        <div className="absolute top-0 right-0 p-32 bg-teal-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        
        {/* Avatar */}
        <img 
          src={currentUser.photoURL || `https://ui-avatars.com/api/?name=${visibleName}&background=0D9488&color=fff`} 
          alt="Profile" 
          className="w-24 h-24 rounded-full border-4 border-teal-50 dark:border-slate-800 shadow-md z-10"
        />
        
        {/* Info User */}
        <div className="text-center md:text-left z-10 flex-1 w-full md:w-auto">
          {isEditing ? (
            <div className="mb-2">
              <label className="text-xs text-slate-400 uppercase font-bold">Nama Lengkap & Gelar</label>
              <input 
                type="text" 
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full text-xl font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1 mt-1 focus:ring-2 focus:ring-teal-500 outline-none"
                placeholder="dr. Fulana, S.Ked"
              />
            </div>
          ) : (
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{visibleName}</h2>
          )}
          
          <p className="text-slate-500 flex items-center justify-center md:justify-start gap-2 mt-1">
            <Mail size={16} /> {currentUser.email}
          </p>
        </div>

        {/* Tombol Edit/Simpan */}
        <div className="z-10">
          {!isEditing ? (
            <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-5 py-2.5 rounded-xl font-bold hover:bg-teal-50 hover:text-teal-700 transition-all">
              <Edit2 size={16} /> Edit Profil
            </button>
          ) : (
            <div className="flex gap-2">
              <button onClick={() => setIsEditing(false)} className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600"><X size={20} /></button>
              <button disabled={loading} onClick={handleSave} className="flex items-center gap-2 bg-teal-500 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-teal-600 shadow-lg shadow-teal-500/30">
                <Save size={18} /> {loading ? '...' : 'Simpan'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Grid Data Akademik & Target (Desain Lama Dipertahankan) */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Kolom Akademik */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
            <School size={18} className="text-teal-500" /> Akademik
          </h3>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Universitas</label>
            {isEditing ? (
              <input type="text" value={formData.university} onChange={(e) => setFormData({...formData, university: e.target.value})} className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none" placeholder="Nama Universitas"/>
            ) : <p className="text-slate-700 dark:text-slate-300 font-medium text-lg">{formData.university || '-'}</p>}
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Angkatan</label>
            {isEditing ? (
              <input type="text" value={formData.batch} onChange={(e) => setFormData({...formData, batch: e.target.value})} className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none" placeholder="2020"/>
            ) : <p className="text-slate-700 dark:text-slate-300 font-medium text-lg">{formData.batch || '-'}</p>}
          </div>
        </div>

        {/* Kolom Target */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
            <Trophy size={18} className="text-orange-500" /> Target
          </h3>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Target UKMPPD</label>
            {isEditing ? (
              <input type="number" value={formData.targetScore} onChange={(e) => setFormData({...formData, targetScore: e.target.value})} className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none font-mono" placeholder="85"/>
            ) : <span className="text-3xl font-black text-slate-900 dark:text-white">{formData.targetScore || '0'}</span>}
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Motto</label>
            {isEditing ? (
              <textarea value={formData.motto} onChange={(e) => setFormData({...formData, motto: e.target.value})} className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none resize-none" rows={2}/>
            ) : <p className="text-slate-600 dark:text-slate-400 italic text-sm">"{formData.motto || '-'}"</p>}
          </div>
        </div>
      </div>

    </div>
  );
}