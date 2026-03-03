import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Mail, School, BookOpen, Edit2, Save, X, Trophy, LogOut, 
  Flame, Target, Award, TrendingUp, Shield, Crown
} from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, isFirebaseInitialized } from '../lib/firebase';

// Phase 1 & 2 Components
import { PageTransition, LoadingWrapper, AnimateIn } from '../components/ui/PageTransition';
import { Skeleton, SkeletonAvatar, SkeletonCard } from '../components/ui/Loading';
import { useToast } from '../context/ToastContext';
import { useUserStats } from '../hooks/useUserStats';

interface UserProfileData {
  university: string;
  batch: string;
  targetScore: string;
  motto: string;
}

// Loading skeleton for profile
function LoadingProfile() {
  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-6 space-y-6" aria-hidden="true">
      {/* Header skeleton */}
      <div className="flex justify-between items-center">
        <div>
          <Skeleton className="h-7 w-32 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-10 w-24 rounded-full" />
      </div>
      
      {/* Identity card skeleton */}
      <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-5 border border-slate-200 dark:border-slate-800">
        <div className="flex flex-col md:flex-row items-center gap-5">
          <SkeletonAvatar size="lg" />
          <div className="flex-1 space-y-2 text-center md:text-left">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-56" />
          </div>
          <Skeleton className="h-10 w-20 rounded-xl" />
        </div>
      </div>
      
      {/* Grid skeleton */}
      <div className="grid md:grid-cols-2 gap-4">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  );
}

// Stats Card Component
function StatsCard({ 
  icon: Icon, 
  label, 
  value, 
  color = 'teal',
  suffix = ''
}: { 
  icon: React.ElementType; 
  label: string; 
  value: string | number;
  color?: 'teal' | 'blue' | 'orange' | 'purple';
  suffix?: string;
}) {
  const colors = {
    teal: 'bg-teal-50 dark:bg-teal-900/20 text-teal-600',
    blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600',
    orange: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600',
    purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600',
  };
  
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors[color]}`}>
          <Icon size={20} />
        </div>
        <div>
          <p className="text-xl font-black text-slate-900 dark:text-white">
            {value}{suffix}
          </p>
          <p className="text-[10px] text-slate-400 font-bold uppercase">{label}</p>
        </div>
      </div>
    </div>
  );
}

export default function UserProfile() {
  const { currentUser, logout, updateUserProfile } = useAuth();
  const toast = useToast();
  const { totalAnswered, accuracy, streak, hasActivity } = useUserStats();
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [displayName, setDisplayName] = useState('');
  const [formData, setFormData] = useState<UserProfileData>({
    university: '',
    batch: '',
    targetScore: '',
    motto: ''
  });

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (!isFirebaseInitialized() || !db) {
        console.warn('[Profile] Firebase not initialized');
        setLoading(false);
        return;
      }
      
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
      setLoading(false);
    };
    fetchProfile();
  }, [currentUser]);

  const handleSave = async () => {
    if (!currentUser) return;
    
    if (!isFirebaseInitialized() || !db) {
      toast.error("Firebase belum siap. Periksa konfigurasi .env.local");
      return;
    }
    
    setSaving(true);

    try {
      // Update Display Name in Auth
      if (displayName !== currentUser.displayName && updateUserProfile) {
        await updateUserProfile(displayName); 
      }

      // Update Firestore
      await setDoc(doc(db, "users", currentUser.uid), formData, { merge: true });

      toast.success("Profil berhasil diperbarui!");
      setIsEditing(false);
      
    } catch (error) {
      console.error("Error saving:", error);
      toast.error("Gagal menyimpan profil. Coba lagi.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    if (confirm("Yakin ingin keluar dari akun?")) {
      logout();
      toast.success("Berhasil keluar dari akun");
    }
  };

  if (!currentUser) return null;

  const visibleName = displayName || currentUser.email?.split('@')[0] || 'Dokter';
  const isPremium = currentUser.subscriptionStatus === 'premium';

  return (
    <PageTransition variant="fade">
      <LoadingWrapper isLoading={loading} skeleton={<LoadingProfile />}>
        <div className="max-w-3xl mx-auto px-4 md:px-6 py-6 pb-24 font-sans">

          {/* Header */}
          <AnimateIn animation="slide-up" delay={0}>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-xl font-black text-slate-900 dark:text-white mb-0.5">
                  Profil Saya
                </h1>
                <p className="text-slate-500 text-xs">
                  Kelola data diri & target belajar.
                </p>
              </div>
              <button 
                onClick={handleLogout} 
                className="flex items-center gap-2 text-xs font-bold text-red-500 hover:text-red-600 px-4 py-2 bg-red-50 dark:bg-red-900/10 rounded-full hover:bg-red-100 transition-all border border-red-100 dark:border-red-900/20"
              >
                <LogOut size={14} /> Logout
              </button>
            </div>
          </AnimateIn>

          {/* Identity Card */}
          <AnimateIn animation="slide-up" delay={50}>
            <div className="bg-white dark:bg-slate-900 p-5 rounded-[2rem] border border-slate-200 dark:border-white/5 flex flex-col md:flex-row items-center gap-5 mb-5 shadow-sm relative overflow-hidden">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
              
              {/* Avatar */}
              <img 
                src={currentUser.photoURL || `https://ui-avatars.com/api/?name=${visibleName}&background=0D9488&color=fff`} 
                alt="Profile" 
                className="w-20 h-20 rounded-full border-4 border-slate-50 dark:border-slate-800 shadow-sm z-10"
              />
              
              {/* User Info */}
              <div className="text-center md:text-left z-10 flex-1 w-full md:w-auto">
                {isEditing ? (
                  <div className="mb-2">
                    <label className="text-[10px] text-slate-400 uppercase font-bold tracking-widest block mb-1">
                      Nama Lengkap
                    </label>
                    <input 
                      type="text" 
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full text-lg font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 focus:ring-2 focus:ring-teal-500 outline-none"
                      placeholder="dr. Fulana"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-2 justify-center md:justify-start">
                    <h2 className="text-xl font-black text-slate-900 dark:text-white">
                      {visibleName}
                    </h2>
                    {isPremium && (
                      <span className="flex items-center gap-1 bg-amber-100 dark:bg-amber-900/30 text-amber-600 text-[9px] font-bold px-2 py-0.5 rounded-full">
                        <Crown size={10} /> PRO
                      </span>
                    )}
                  </div>
                )}
                
                <p className="text-slate-500 text-xs flex items-center justify-center md:justify-start gap-1.5 font-medium">
                  <Mail size={12} /> {currentUser.email}
                </p>
              </div>

              {/* Edit/Save Buttons */}
              <div className="z-10">
                {!isEditing ? (
                  <button 
                    onClick={() => setIsEditing(true)} 
                    className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-4 py-2 rounded-xl text-xs font-bold hover:bg-teal-50 hover:text-teal-600 transition-all border border-slate-200 dark:border-slate-700"
                  >
                    <Edit2 size={14} /> Edit
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setIsEditing(false)} 
                      className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-500 transition-colors"
                    >
                      <X size={16} />
                    </button>
                    <button 
                      disabled={saving} 
                      onClick={handleSave} 
                      className="flex items-center gap-2 bg-teal-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-teal-600 shadow-lg shadow-teal-500/30 transition-all disabled:opacity-50"
                    >
                      <Save size={14} /> {saving ? 'Menyimpan...' : 'Simpan'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </AnimateIn>

          {/* Quick Stats */}
          <AnimateIn animation="slide-up" delay={100}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
              <StatsCard 
                icon={Target} 
                label="Soal Dijawab" 
                value={totalAnswered}
                color="teal"
              />
              <StatsCard 
                icon={TrendingUp} 
                label="Akurasi" 
                value={accuracy}
                suffix="%"
                color="blue"
              />
              <StatsCard 
                icon={Flame} 
                label="Streak" 
                value={streak}
                suffix=" hari"
                color="orange"
              />
              <StatsCard 
                icon={Shield} 
                label="Status" 
                value={isPremium ? 'PRO' : 'Free'}
                color="purple"
              />
            </div>
          </AnimateIn>

          {/* Data Grid */}
          <div className="grid md:grid-cols-2 gap-4">
            
            {/* Academic Column */}
            <AnimateIn animation="slide-up" delay={150}>
              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-white/5 space-y-4 shadow-sm">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2 mb-1">
                  <School size={16} className="text-teal-500" /> Akademik
                </h3>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                    Universitas
                  </label>
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={formData.university} 
                      onChange={(e) => setFormData({...formData, university: e.target.value})} 
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 outline-none transition-all" 
                      placeholder="Nama Universitas"
                    />
                  ) : (
                    <p className="text-slate-700 dark:text-slate-300 font-medium text-sm">
                      {formData.university || '-'}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                    Angkatan
                  </label>
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={formData.batch} 
                      onChange={(e) => setFormData({...formData, batch: e.target.value})} 
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 outline-none transition-all" 
                      placeholder="2020"
                    />
                  ) : (
                    <p className="text-slate-700 dark:text-slate-300 font-medium text-sm">
                      {formData.batch || '-'}
                    </p>
                  )}
                </div>
              </div>
            </AnimateIn>

            {/* Target Column */}
            <AnimateIn animation="slide-up" delay={200}>
              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-white/5 space-y-4 shadow-sm">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2 mb-1">
                  <Trophy size={16} className="text-orange-500" /> Target
                </h3>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                    Target Nilai
                  </label>
                  {isEditing ? (
                    <input 
                      type="number" 
                      value={formData.targetScore} 
                      onChange={(e) => setFormData({...formData, targetScore: e.target.value})} 
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 outline-none font-mono transition-all" 
                      placeholder="85"
                    />
                  ) : (
                    <span className="text-2xl font-black text-slate-900 dark:text-white">
                      {formData.targetScore || '0'}
                    </span>
                  )}
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                    Motto
                  </label>
                  {isEditing ? (
                    <textarea 
                      value={formData.motto} 
                      onChange={(e) => setFormData({...formData, motto: e.target.value})} 
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 outline-none resize-none leading-snug transition-all" 
                      rows={2} 
                      placeholder="Semangat!"
                    />
                  ) : (
                    <p className="text-slate-600 dark:text-slate-400 italic text-xs leading-relaxed">
                      "{formData.motto || '-'}"
                    </p>
                  )}
                </div>
              </div>
            </AnimateIn>

          </div>

          {/* Upgrade Banner for Free Users */}
          {!isPremium && (
            <AnimateIn animation="slide-up" delay={250}>
              <div 
                onClick={() => window.location.href = '/app/subscription'}
                className="mt-6 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-5 text-white cursor-pointer hover:shadow-lg transition-all relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-xl -mr-10 -mt-10"></div>
                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Crown size={18} />
                      <span className="font-bold text-sm">Upgrade ke PRO</span>
                    </div>
                    <p className="text-xs opacity-90">
                      Buka semua fitur premium & bank soal lengkap
                    </p>
                  </div>
                  <div className="bg-white/20 px-4 py-2 rounded-xl text-xs font-bold">
                    Lihat Paket
                  </div>
                </div>
              </div>
            </AnimateIn>
          )}

        </div>
      </LoadingWrapper>
    </PageTransition>
  );
}