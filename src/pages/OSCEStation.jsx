import { useState } from 'react';
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  AlertTriangle,
  Save,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useIslamicMode } from '../context/IslamicModeContext';
import { useAuth } from '../context/AuthContext';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'; // Import Firestore
import { db } from '../lib/firebase';

// Data Checklist
const checklistData = [
  {
    id: 1,
    text: 'Memperkenalkan diri & Identifikasi Pasien',
    type: 'standard',
  },
  { id: 2, text: 'Informed Consent & Menjelaskan Prosedur', type: 'standard' },
  { id: 3, text: 'Membaca Basmalah & Menenangkan Pasien', type: 'islamic' },
  { id: 4, text: 'Mencuci tangan 6 langkah WHO', type: 'critical' },
  { id: 5, text: 'Memakai sarung tangan steril', type: 'critical' },
  {
    id: 6,
    text: 'Menjaga aurat pasien (hanya membuka area tindakan)',
    type: 'islamic',
  },
  {
    id: 7,
    text: 'Melakukan desinfeksi area genital (sirkuler)',
    type: 'standard',
  },
  { id: 8, text: 'Memasukkan kateter hingga urine keluar', type: 'standard' },
  { id: 9, text: 'Mengembangkan balon kateter', type: 'standard' },
  { id: 10, text: 'Membaca Hamdalah & Edukasi Pasien', type: 'islamic' },
];

export default function OSCEStation() {
  const { isIslamicMode } = useIslamicMode();
  const { user } = useAuth(); // Ambil data user
  const navigate = useNavigate();

  const [checkedItems, setCheckedItems] = useState({});
  const [saving, setSaving] = useState(false); // State loading simpan

  // Filter item berdasarkan mode
  const visibleItems = checklistData.filter((item) =>
    isIslamicMode ? true : item.type !== 'islamic'
  );

  const toggleCheck = (id) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const score = visibleItems.filter((item) => checkedItems[item.id]).length;
  const totalScore = visibleItems.length;

  // --- FUNGSI BARU: SIMPAN NILAI KE FIREBASE ---
  const handleFinish = async () => {
    if (
      !confirm(
        'Apakah Anda yakin ingin mengakhiri station ini dan menyimpan nilai?'
      )
    )
      return;

    setSaving(true);
    try {
      // Simpan ke koleksi 'study_history'
      await addDoc(collection(db, 'study_history'), {
        userId: user.uid, // Punya siapa?
        type: 'OSCE', // Jenis Latihan
        title: 'Pemasangan Kateter', // Judul Materi
        score: score, // Nilai User
        maxScore: totalScore, // Nilai Maksimal
        percentage: Math.round((score / totalScore) * 100), // Persentase
        completedAt: serverTimestamp(), // Waktu Server
      });

      alert(`Alhamdulillah! Nilai tersimpan: ${score}/${totalScore}`);
      navigate('/app'); // Kembali ke Dashboard
    } catch (error) {
      console.error('Error saving score:', error);
      alert('Gagal menyimpan nilai. Coba lagi.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link to="/app" className="p-2 hover:bg-slate-800 rounded-full">
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-xl font-bold">Pemasangan Kateter Urin</h1>
            <p className="text-sm text-slate-400">Station Genitourinary</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
          <Clock size={16} className="text-orange-400" />
          <span className="font-mono font-bold">15:00</span>
        </div>
      </div>

      {/* Checklist */}
      <div className="space-y-3">
        {visibleItems.map((item) => (
          <div
            key={item.id}
            onClick={() => toggleCheck(item.id)}
            className={`
              p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 select-none
              ${
                checkedItems[item.id]
                  ? 'bg-blue-500/10 border-blue-500/50'
                  : 'bg-surface border-slate-700 hover:border-slate-500'
              }
            `}
          >
            <div
              className={`mt-0.5 transition-colors ${
                checkedItems[item.id] ? 'text-primary' : 'text-slate-600'
              }`}
            >
              <CheckCircle
                size={24}
                fill={checkedItems[item.id] ? 'currentColor' : 'none'}
              />
            </div>

            <div className="flex-1">
              <p
                className={`font-medium ${
                  checkedItems[item.id] ? 'text-white' : 'text-slate-300'
                }`}
              >
                {item.text}
              </p>

              <div className="flex gap-2 mt-2">
                {item.type === 'critical' && (
                  <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded font-bold flex items-center gap-1 w-fit">
                    <AlertTriangle size={10} /> POIN KRITIS
                  </span>
                )}
                {item.type === 'islamic' && (
                  <span className="text-[10px] bg-islamic/20 text-islamic px-2 py-0.5 rounded font-bold w-fit border border-islamic/20">
                    🕌 ADAB ISLAMI
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-surface/90 backdrop-blur-md border-t border-slate-700 p-4 lg:pl-72 z-10">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400">Skor Anda</p>
            <p className="text-2xl font-bold font-heading">
              {score}{' '}
              <span className="text-slate-500 text-lg">/ {totalScore}</span>
            </p>
          </div>

          <button
            onClick={handleFinish} // Panggil fungsi simpan
            disabled={saving}
            className="flex items-center gap-2 bg-islamic hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              'Menyimpan...'
            ) : (
              <>
                <Save size={20} /> Selesai Station
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
