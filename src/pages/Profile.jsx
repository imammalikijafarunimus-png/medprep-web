import { useState, useEffect } from 'react';
import { User, Save, MapPin, Target, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function Profile() {
  const { user } = useAuth(); // Ambil user yang sedang login

  // State untuk form data
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    university: '',
    targetScore: '',
    bio: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // 1. Ambil Data dari Firestore saat halaman dibuka
  useEffect(() => {
    const fetchProfile = async () => {
      if (user?.uid) {
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            setProfile({
              name: data.name || '',
              email: data.email || user.email, // Email dari Auth atau DB
              university: data.university || '',
              targetScore: data.targetScore || '',
              bio: data.bio || '',
            });
          }
        } catch (err) {
          console.error('Gagal ambil data:', err);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchProfile();
  }, [user]);

  // 2. Fungsi Simpan Perubahan (Update Database)
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const docRef = doc(db, 'users', user.uid);

      // Update data ke Firestore
      await updateDoc(docRef, {
        name: profile.name,
        university: profile.university,
        targetScore: profile.targetScore,
        bio: profile.bio,
      });

      setMessage({ type: 'success', text: 'Profil berhasil disimpan!' });

      // Hilangkan pesan sukses setelah 3 detik
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Gagal menyimpan perubahan.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="p-8 text-center text-slate-400">Memuat profil...</div>
    );

  return (
    <div className="max-w-2xl mx-auto pb-20">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Profil Saya</h1>
        <p className="text-slate-400">
          Kelola informasi pribadi dan target belajar Anda.
        </p>
      </div>

      {/* Pesan Notifikasi (Sukses/Gagal) */}
      {message.text && (
        <div
          className={`p-4 rounded-lg mb-6 text-sm font-medium ${
            message.type === 'success'
              ? 'bg-green-500/20 text-green-400'
              : 'bg-red-500/20 text-red-400'
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Card: Info Dasar */}
        <div className="bg-surface border border-slate-700 rounded-xl p-6 space-y-4">
          <h2 className="font-bold flex items-center gap-2 text-lg">
            <User size={20} className="text-primary" /> Informasi Dasar
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">
                Nama Lengkap
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
                className="w-full bg-dark border border-slate-600 rounded-lg px-4 py-2 focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">
                Email
              </label>
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-400 cursor-not-allowed">
                <Mail size={16} />
                {profile.email}
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                *Email tidak dapat diubah
              </p>
            </div>
          </div>
        </div>

        {/* Card: Data Akademik */}
        <div className="bg-surface border border-slate-700 rounded-xl p-6 space-y-4">
          <h2 className="font-bold flex items-center gap-2 text-lg">
            <MapPin size={20} className="text-purple-400" /> Data Akademik
          </h2>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">
              Asal Universitas
            </label>
            <input
              type="text"
              placeholder="Contoh: Universitas Indonesia"
              value={profile.university}
              onChange={(e) =>
                setProfile({ ...profile, university: e.target.value })
              }
              className="w-full bg-dark border border-slate-600 rounded-lg px-4 py-2 focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">
              Target Nilai CBT
            </label>
            <div className="relative">
              <Target
                size={18}
                className="absolute left-3 top-2.5 text-slate-500"
              />
              <input
                type="number"
                placeholder="85.00"
                value={profile.targetScore}
                onChange={(e) =>
                  setProfile({ ...profile, targetScore: e.target.value })
                }
                className="w-full bg-dark border border-slate-600 rounded-lg pl-10 pr-4 py-2 focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">
              Motto / Bio Singkat
            </label>
            <textarea
              rows="3"
              placeholder="Bismillah, one shot UKMPPD!"
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              className="w-full bg-dark border border-slate-600 rounded-lg px-4 py-2 focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        {/* Tombol Simpan */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-primary hover:bg-blue-600 text-white font-bold px-6 py-3 rounded-xl transition-all disabled:opacity-50"
          >
            <Save size={20} />
            {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>
      </form>
    </div>
  );
}
