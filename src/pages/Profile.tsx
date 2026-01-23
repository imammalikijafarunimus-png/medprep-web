import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, School, BookOpen, Edit2, Save, X, Trophy, LogOut } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase'; // Sesuaikan path jika perlu (misal: ../firebase)
import toast from 'react-hot-toast';

interface UserProfileData {
  university: string;
  batch: string;
  targetScore: string;
  motto: string;
}

export default function UserProfile() {
  // Pastikan AuthContext sudah mengekspor updateUserProfile
  const { currentUser, logout, updateUserProfile } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [displayName, setDisplayName] = useState('');
  const [formData, setFormData] = useState<UserProfileData>({
    university: '',
    batch: '',
    targetScore: '',
    motto: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (currentUser) {
        setDisplayName(currentUser.displayName || '');
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

  const handleSave = async () => {
    if (!currentUser) return;
    setLoading(true);
    const toastId = toast.loading("Menyimpan...");

    try {
      // 1. Update Display Name di Auth (jika ada fungsi updateUserProfile)
      if (displayName !== currentUser.displayName && updateUserProfile) {
        await updateUserProfile(displayName); 
      }

      // 2. Update Firestore
      await setDoc(doc(db, "users", currentUser.uid), formData, { merge: true });

      toast.success("Profil diperbarui!", { id: toastId });
      setIsEditing(false);
      
    } catch (error) {
      console.error("Error saving:", error);
      toast.error("Gagal menyimpan.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) return null;

  const visibleName = displayName || currentUser.email?.split('@')[0] || 'Dokter';

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-6 animate-in fade-in pb-24 font-sans">
      
      {/* HEADER COMPACT */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white mb-0.5">Profil Saya</h1>
          <p className="text-slate-500 text-xs">Kelola data diri & target belajar.</p>
        </div>
        <button 
          onClick={() => {
            if(confirm("Yakin ingin keluar?")) logout();
          }} 
          className="flex items-center gap-2 text-xs font-bold text-red-500 hover:text-red-600 px-4 py-2 bg-red-50 dark:bg-red-900/10 rounded-full hover:bg-red-100 transition-all border border-red-100 dark:border-red-900/20"
        >
          <LogOut size={14} /> Logout
        </button>
      </div>
      
      {/* KARTU IDENTITAS (Modern iOS Style) */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-[2rem] border border-slate-200 dark:border-white/5 flex flex-col md:flex-row items-center gap-5 mb-5 shadow-sm relative overflow-hidden">
        {/* Dekorasi Background */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        
        {/* Avatar */}
        <img 
          src={currentUser.photoURL || `https://ui-avatars.com/api/?name=${visibleName}&background=0D9488&color=fff`} 
          alt="Profile" 
          className="w-20 h-20 rounded-full border-4 border-slate-50 dark:border-slate-800 shadow-sm z-10"
        />
        
        {/* Info User */}
        <div className="text-center md:text-left z-10 flex-1 w-full md:w-auto">
          {isEditing ? (
            <div className="mb-2">
              <label className="text-[10px] text-slate-400 uppercase font-bold tracking-widest block mb-1">Nama Lengkap</label>
              <input 
                type="text" 
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full text-lg font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 focus:ring-2 focus:ring-teal-500 outline-none"
                placeholder="dr. Fulana"
              />
            </div>
          ) : (
            <h2 className="text-xl font-black text-slate-900 dark:text-white mb-1">{visibleName}</h2>
          )}
          
          <p className="text-slate-500 text-xs flex items-center justify-center md:justify-start gap-1.5 font-medium">
            <Mail size={12} /> {currentUser.email}
          </p>
        </div>

        {/* Tombol Edit */}
        <div className="z-10">
          {!isEditing ? (
            <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-4 py-2 rounded-xl text-xs font-bold hover:bg-teal-50 hover:text-teal-600 transition-all border border-slate-200 dark:border-slate-700">
              <Edit2 size={14} /> Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button onClick={() => setIsEditing(false)} className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-500 transition-colors"><X size={16} /></button>
              <button disabled={loading} onClick={handleSave} className="flex items-center gap-2 bg-teal-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-teal-600 shadow-lg shadow-teal-500/30 transition-all">
                <Save size={14} /> {loading ? '...' : 'Simpan'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* GRID DATA (Compact) */}
      <div className="grid md:grid-cols-2 gap-4">
        
        {/* Kolom Akademik */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-white/5 space-y-4 shadow-sm">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2 mb-1">
            <School size={16} className="text-teal-500" /> Akademik
          </h3>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Universitas</label>
            {isEditing ? (
              <input type="text" value={formData.university} onChange={(e) => setFormData({...formData, university: e.target.value})} className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 outline-none transition-all" placeholder="Nama Universitas"/>
            ) : <p className="text-slate-700 dark:text-slate-300 font-medium text-sm">{formData.university || '-'}</p>}
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Angkatan</label>
            {isEditing ? (
              <input type="text" value={formData.batch} onChange={(e) => setFormData({...formData, batch: e.target.value})} className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 outline-none transition-all" placeholder="2020"/>
            ) : <p className="text-slate-700 dark:text-slate-300 font-medium text-sm">{formData.batch || '-'}</p>}
          </div>
        </div>

        {/* Kolom Target */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-white/5 space-y-4 shadow-sm">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2 mb-1">
            <Trophy size={16} className="text-orange-500" /> Target
          </h3>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Target Nilai</label>
            {isEditing ? (
              <input type="number" value={formData.targetScore} onChange={(e) => setFormData({...formData, targetScore: e.target.value})} className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 outline-none font-mono transition-all" placeholder="85"/>
            ) : <span className="text-2xl font-black text-slate-900 dark:text-white">{formData.targetScore || '0'}</span>}
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Motto</label>
            {isEditing ? (
              <textarea value={formData.motto} onChange={(e) => setFormData({...formData, motto: e.target.value})} className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 outline-none resize-none leading-snug transition-all" rows={2} placeholder="Semangat!"/>
            ) : <p className="text-slate-600 dark:text-slate-400 italic text-xs leading-relaxed">"{formData.motto || '-'}"</p>}
          </div>
        </div>

      </div>
    </div>
  );
}