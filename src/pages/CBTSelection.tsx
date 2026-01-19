import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Brain, ArrowRight, Grid, LayoutGrid } from 'lucide-react';
// IMPORT DATA KATEGORI BARU
import { EXAM_CATEGORIES } from '../data/categories'; 

export default function CBTSelection() {
  const navigate = useNavigate();
  // Simpan Label lengkapnya untuk dikirim ke URL/Filter
  const [selectedSystem, setSelectedSystem] = useState<string | null>(null);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* Header (Tetap sama) */}
      <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-32 bg-blue-500/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
        <h1 className="text-3xl font-bold text-white mb-2 relative z-10">CBT Center</h1>
        <p className="text-slate-400 text-sm max-w-xl relative z-10">
          Pusat pembelajaran komprehensif. Pilih materi untuk memperdalam konsep (High Yield) atau uji kemampuanmu.
        </p>
      </div>

      {/* STEP 1: PILIH SISTEM & TOPIK (NEW GRID 15 KATEGORI) */}
      <div>
        <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
          <LayoutGrid size={20} className="text-blue-500" /> Pilih Kategori Materi
        </h3>
        
        {/* Grid Responsive: 2 kolom di HP, 3 di Tablet, 5 di Desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {EXAM_CATEGORIES.map((cat) => {
            const isSelected = selectedSystem === cat.label;
            
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedSystem(isSelected ? null : cat.label)}
                className={`p-3 rounded-xl text-xs md:text-sm font-bold transition-all border flex items-center justify-center text-center h-16 ${
                  isSelected 
                  ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20 scale-105' 
                  : `bg-slate-900/50 hover:bg-slate-800 ${cat.color}`
                }`}
              >
                {cat.shortLabel}
              </button>
            );
          })}
        </div>
      </div>

      {/* STEP 2: PILIH MODE (Tetap sama, logika navigasi tetap jalan) */}
      <div className={`grid md:grid-cols-2 gap-6 transition-all duration-500 ${!selectedSystem ? 'opacity-50 grayscale pointer-events-none' : 'opacity-100'}`}>
        
        {/* CARD 1: MATERI */}
        <div 
          onClick={() => navigate(`/app/cbt/read?system=${encodeURIComponent(selectedSystem || '')}`)}
          className="group bg-slate-900/50 border border-slate-800 hover:border-emerald-500/50 p-6 rounded-3xl cursor-pointer transition-all hover:-translate-y-1 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
            <BookOpen size={24} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Pelajari Materi</h3>
          <p className="text-slate-400 text-sm mb-6">Rangkuman High Yield & Clinical Pearls.</p>
          <span className="text-emerald-400 text-sm font-bold flex items-center gap-2">
            Buka Materi <ArrowRight size={16} />
          </span>
        </div>

        {/* CARD 2: SOAL */}
        <div 
          onClick={() => navigate(`/app/cbt/quiz?system=${encodeURIComponent(selectedSystem || '')}`)}
          className="group bg-slate-900/50 border border-slate-800 hover:border-blue-500/50 p-6 rounded-3xl cursor-pointer transition-all hover:-translate-y-1 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 transition-transform">
            <Brain size={24} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Latihan Soal (MCQ)</h3>
          <p className="text-slate-400 text-sm mb-6">Uji pemahaman dengan soal vignette.</p>
          <span className="text-blue-400 text-sm font-bold flex items-center gap-2">
            Mulai Ujian <ArrowRight size={16} />
          </span>
        </div>

      </div>
    </div>
  );
}