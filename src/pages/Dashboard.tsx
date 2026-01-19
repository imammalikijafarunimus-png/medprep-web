import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { LayoutGrid, CheckCircle, Activity, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [university, setUniversity] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // LOGIKA CERDAS UNTUK NAMA:
  // 1. Ambil displayName (jika ada)
  // 2. Jika tidak ada, ambil username dari email (sebelum @)
  // 3. Fallback terakhir 'Dokter Muda'
  const rawName = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Dokter Muda';
  
  // Rapikan nama (Huruf depan kapital, hilangkan angka jika ada)
  const cleanName = rawName.replace(/[0-9]/g, ''); // Hapus angka di email misal imam123 -> imam
  const firstName = cleanName.split(' ')[0]; // Ambil nama depan saja
  const formattedName = firstName.charAt(0).toUpperCase() + firstName.slice(1);

  useEffect(() => {
    const fetchData = async () => {
      if (currentUser) {
        try {
          const docRef = doc(db, "users", currentUser.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.university) setUniversity(data.university);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchData();
  }, [currentUser]);

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center items-center h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 pb-24 animate-in fade-in">
      
      {/* 1. Welcome Banner (NAMA SUDAH BENAR) */}
      <div className="bg-slate-900 text-white p-8 rounded-3xl relative overflow-hidden mb-8 shadow-xl shadow-slate-200 dark:shadow-none">
        <div className="absolute top-0 right-0 p-32 bg-teal-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
        <div className="relative z-10">
          {/* SAPAAN TERINTEGRASI */}
          <h1 className="text-3xl font-bold mb-2">
            Selamat Datang, dr. {formattedName}! 👋
          </h1>
          <p className="text-slate-300 max-w-lg mb-6">
            {university ? `Mahasiswa kebanggaan ${university}.` : 'Selamat datang di MedPrep.'} Siap untuk latihan hari ini?
          </p>
          
          <div className="flex gap-3">
            <Link to="/osce" className="bg-teal-500 hover:bg-teal-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2">
              <Activity size={18} /> Latihan OSCE
            </Link>
            <Link to="/profile" className="bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all backdrop-blur-sm">
              Lengkapi Profil
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Statistik Singkat */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-500 uppercase font-bold mb-1">Total Latihan</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white">0</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-500 uppercase font-bold mb-1">Target Score</p>
          <p className="text-2xl font-black text-teal-600">85</p>
        </div>
      </div>

      {/* 3. Menu Cepat */}
      <h3 className="font-bold text-slate-900 dark:text-white mb-4 text-lg">Menu Cepat</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link to="/osce" className="group bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-teal-500 transition-all flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-900/30 text-teal-600 flex items-center justify-center">
              <Activity size={24} />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 dark:text-white">OSCE Center</h4>
              <p className="text-xs text-slate-500">12 Stase + Gadar</p>
            </div>
          </div>
          <ArrowRight size={20} className="text-slate-300 group-hover:text-teal-500" />
        </Link>
      </div>

    </div>
  );
}