import React, { useState } from 'react';
import { ArrowLeft, Zap, BookOpen, Stethoscope, Upload, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { collection, serverTimestamp, writeBatch, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('import'); 
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  // --- SUB-COMPONENT: BULK IMPORT ---
  const BulkImport = () => {
    const [jsonInput, setJsonInput] = useState('');
    const [targetCollection, setTargetCollection] = useState('cbt_questions');

    // Helper: Menampilkan Template Format JSON sesuai pilihan
    const getPlaceholderHint = () => {
      if (targetCollection === 'osce_materials') {
        return `Format OSCE (Array):
[
  {
    "system": "Neurologi",
    "type": "checklist", // atau "case"
    "title": "Judul Materi",
    "steps": [ { "text": "Langkah 1", "isCritical": true } ] // Jika checklist
    // ... field lain jika type="case"
  }
]`;
      }
      return `Format Standar (Array): [ {"question": "...", "correctAnswer": "A"}, ... ]`;
    }

    const handleImport = async () => {
      if (!jsonInput) return;
      setLoading(true);
      setStatusMsg('');

      try {
        const data = JSON.parse(jsonInput);
        if (!Array.isArray(data)) throw new Error("Format JSON harus berupa Array [...]");

        // Batch Write (Max 500 ops)
        const batch = writeBatch(db);
        
        data.forEach((item) => {
          const docRef = doc(collection(db, targetCollection));
          batch.set(docRef, {
            ...item,
            createdAt: serverTimestamp() // Otomatis catat waktu upload
          });
        });

        await batch.commit();
        
        setStatusMsg(`Sukses! ${data.length} data berhasil diupload ke koleksi '${targetCollection}'.`);
        setJsonInput(''); 
      } catch (err: any) {
        setStatusMsg(`Error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="space-y-6 animate-in fade-in">
        
        {/* Banner Info */}
        <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-xl flex gap-3 text-blue-300 text-sm">
          <Info size={20} className="shrink-0" />
          <div>
            <p className="font-bold">Tips Upload Massal:</p>
            <p>Gunakan AI (ChatGPT/Claude) untuk mengubah materi Word/PDF Anda menjadi format JSON Array sesuai target koleksi di bawah.</p>
          </div>
        </div>

        {/* Dropdown Target Koleksi */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
             <label className="block text-slate-400 text-sm mb-2 font-bold">Target Koleksi Firebase</label>
             <select 
               value={targetCollection}
               onChange={(e) => setTargetCollection(e.target.value)}
               className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:border-blue-500 outline-none cursor-pointer"
             >
               <option value="cbt_questions">1. Bank Soal (Latihan MCQ)</option>
               <option value="study_materials">2. Materi Belajar (High Yield)</option>
               <option value="osce_materials">3. OSCE Center (Checklist & Kasus)</option> {/* <--- OPSI BARU */}
               <option value="flashcards">4. Flashcards</option>
             </select>
          </div>
        </div>

        {/* Text Area JSON */}
        <div>
          <label className="block text-slate-400 text-sm mb-2 font-bold">Paste JSON Array di sini</label>
          <textarea 
            rows={12}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-emerald-400 focus:border-blue-500 outline-none custom-scrollbar"
            placeholder={getPlaceholderHint()}
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
          />
        </div>

        {/* Status Message */}
        {statusMsg && (
          <div className={`p-4 rounded-xl flex items-center gap-2 text-sm font-bold ${statusMsg.includes('Error') ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
            {statusMsg.includes('Error') ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
            {statusMsg}
          </div>
        )}

        {/* Button Action */}
        <button 
          onClick={handleImport} 
          disabled={loading || !jsonInput}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
        >
          {loading ? 'Mengupload ke Server...' : <><Upload size={20} /> Upload JSON Sekarang</>}
        </button>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 pt-8 px-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link to="/app" className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 transition-colors">
          <ArrowLeft className="text-white" />
        </Link>
        <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
      </div>

      {/* Tabs Menu */}
      <div className="flex p-1 bg-slate-900 border border-slate-800 rounded-xl mb-8 overflow-x-auto">
        <button
          onClick={() => setActiveTab('import')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
            activeTab === 'import' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Upload size={18} /> Bulk Import JSON
        </button>
        {/* Tab lain bisa ditambahkan nanti jika butuh input manual */}
      </div>

      {/* Content Area */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 md:p-8">
        {activeTab === 'import' && <BulkImport />}
      </div>
    </div>
  );
}