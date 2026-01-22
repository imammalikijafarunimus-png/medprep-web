import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { isAdmin } from '../config/admin_list';
import { 
  LayoutDashboard, Trash2, FileText, 
  HelpCircle, BookOpen, PenTool, Upload, FileJson, ShieldAlert, AlertTriangle, Sparkles
} from 'lucide-react';
import { collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp, query, orderBy, writeBatch } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { SYSTEM_LIST } from '../data/osce_data';
import toast from 'react-hot-toast'; // <--- IMPORT TOAST

// --- TIPE DATA ---
interface CBTQuestion {
  id?: string;
  system: string;
  question: string;
  options: { a: string; b: string; c: string; d: string; e: string; };
  correctAnswer: 'a' | 'b' | 'c' | 'd' | 'e';
  explanation: string;
  insight?: string;
  createdAt?: any;
}

interface CBTMaterial {
  id?: string;
  system: string;     
  title: string;      
  content: string;    
  category?: string;
  insight?: string;
  createdAt?: any;
}

export default function AdminDashboard() {
  const { currentUser } = useAuth();

  // STATE
  const [activeSection, setActiveSection] = useState<'soal' | 'materi'>('soal'); 
  const [activeTab, setActiveTab] = useState<'input' | 'list' | 'import'>('input');
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const [questions, setQuestions] = useState<CBTQuestion[]>([]);
  const [materials, setMaterials] = useState<CBTMaterial[]>([]);
  
  // FORM STATES
  const [formSoal, setFormSoal] = useState<CBTQuestion>({
    system: 'Respirasi',
    question: '',
    options: { a: '', b: '', c: '', d: '', e: '' },
    correctAnswer: 'a',
    explanation: '',
    insight: ''
  });

  const [formMateri, setFormMateri] = useState<CBTMaterial>({
    system: 'Respirasi',
    title: '',
    content: '',
    category: 'High Yield',
    insight: ''
  });

  // PROTEKSI
  if (!isAdmin(currentUser?.email)) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-6 text-center">
        <div className="w-20 h-20 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-6"><ShieldAlert size={48} /></div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Akses Ditolak</h1>
        <button onClick={() => window.location.href = '/app/dashboard'} className="mt-8 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold">Kembali</button>
      </div>
    );
  }

  // --- CRUD LOGIC ---
  const handleSimpanSoal = async (e: React.FormEvent) => {
    e.preventDefault(); 
    
    // Validasi
    if (!formSoal.question || !formSoal.options.a) {
      toast.error("Lengkapi pertanyaan dan opsi jawaban!");
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading('Menyimpan soal...'); // Loading Toast

    try {
      await addDoc(collection(db, "cbt_questions"), { ...formSoal, createdAt: serverTimestamp() });
      
      toast.success("Soal berhasil disimpan!", { id: loadingToast }); // Update jadi sukses
      
      setFormSoal({ ...formSoal, question: '', options: { a: '', b: '', c: '', d: '', e: '' }, explanation: '', insight: '' });
    } catch (error) { 
      console.error(error); 
      toast.error("Gagal menyimpan soal.", { id: loadingToast });
    } finally { setLoading(false); }
  };

  const handleSimpanMateri = async (e: React.FormEvent) => {
    e.preventDefault(); 
    
    if (!formMateri.title || !formMateri.content) {
      toast.error("Judul dan Isi Materi wajib diisi!");
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading('Menyimpan materi...');

    try {
      await addDoc(collection(db, "cbt_materials"), { ...formMateri, createdAt: serverTimestamp() });
      
      toast.success("Materi berhasil disimpan!", { id: loadingToast });
      
      setFormMateri({ ...formMateri, title: '', content: '', insight: '' });
    } catch (error) { 
      console.error(error); 
      toast.error("Gagal menyimpan materi.", { id: loadingToast });
    } finally { setLoading(false); }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const collectionName = activeSection === 'soal' ? "cbt_questions" : "cbt_materials";
      const q = query(collection(db, collectionName), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      if(activeSection === 'soal') setQuestions(data as CBTQuestion[]);
      else setMaterials(data as CBTMaterial[]);
    } catch (error) { 
      console.error(error); 
      toast.error("Gagal mengambil data.");
    } finally { setLoading(false); }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Yakin hapus data ini?")) {
      const loadingToast = toast.loading('Menghapus...');
      try {
        await deleteDoc(doc(db, activeSection === 'soal' ? "cbt_questions" : "cbt_materials", id));
        toast.success("Data berhasil dihapus", { id: loadingToast });
        fetchData();
      } catch (err) {
        toast.error("Gagal menghapus", { id: loadingToast });
      }
    }
  };

  const handleResetDatabase = async () => {
    const targetName = activeSection === 'soal' ? 'Bank Soal' : 'Materi High Yield';
    if (prompt(`Ketik "HAPUS" untuk menghapus SEMUA data ${targetName}:`) === "HAPUS") {
      setLoading(true);
      const loadingToast = toast.loading('Mereset database...');
      try {
        const collectionName = activeSection === 'soal' ? "cbt_questions" : "cbt_materials";
        const snapshot = await getDocs(collection(db, collectionName));
        const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
        await Promise.all(deletePromises);
        
        toast.success(`Database ${targetName} bersih!`, { id: loadingToast });
        fetchData();
      } catch (error) { 
        console.error(error); 
        toast.error("Gagal reset database.", { id: loadingToast });
      } finally { setLoading(false); }
    } else {
        toast("Reset dibatalkan");
    }
  };

  // --- IMPORT JSON ---
  const handleJsonUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      setLoading(true); setUploadProgress(0);
      const loadingToast = toast.loading('Membaca file JSON...');
      
      fileReader.readAsText(e.target.files[0], "UTF-8");
      
      fileReader.onload = async (event) => {
        try {
          const parsedData = JSON.parse(event.target?.result as string);
          if (!Array.isArray(parsedData)) throw new Error("Format JSON harus Array []");
          
          const total = parsedData.length;
          const collectionName = activeSection === 'soal' ? "cbt_questions" : "cbt_materials";
          const defaultSystem = activeSection === 'soal' ? formSoal.system : formMateri.system;

          toast.loading(`Mengupload ${total} data...`, { id: loadingToast });

          for (let i = 0; i < total; i++) {
            const item = parsedData[i];
            let payload = {};
            
            if (activeSection === 'soal') {
                payload = {
                    system: item.system || defaultSystem, 
                    question: item.question,
                    options: item.options, 
                    correctAnswer: item.correctAnswer?.toLowerCase(),
                    explanation: item.explanation,
                    insight: item.insight || '', 
                    createdAt: serverTimestamp()
                };
            } else {
                payload = {
                    system: item.system || defaultSystem,
                    title: item.topic || item.title || 'Tanpa Judul',
                    content: item.content,
                    category: item.category || 'High Yield',
                    insight: item.insight || '',
                    createdAt: serverTimestamp()
                };
            }
            await addDoc(collection(db, collectionName), payload);
            setUploadProgress(Math.round(((i + 1) / total) * 100));
          }
          
          toast.success(`Sukses import ${total} data ke: ${defaultSystem}!`, { id: loadingToast });
          fetchData();
          setActiveTab('list');
        } catch (error) { 
          console.error(error); 
          toast.error("Gagal import JSON. Cek format file.", { id: loadingToast });
        } 
        finally { setLoading(false); setUploadProgress(0); }
      };
    }
  };

  useEffect(() => { if (activeTab === 'list') fetchData(); }, [activeTab, activeSection]);

  return (
    <div className="p-6 pb-24 animate-in fade-in max-w-5xl mx-auto">
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-indigo-600 text-white rounded-xl shadow-lg"><LayoutDashboard size={24} /></div>
        <div><h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Panel CBT</h1><p className="text-slate-500">Kelola Bank Soal & Materi High Yield</p></div>
      </div>

      {/* SWITCHER */}
      <div className="grid grid-cols-2 gap-4 mb-8 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800">
        <button onClick={() => { setActiveSection('soal'); setActiveTab('input'); }} className={`py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${activeSection === 'soal' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-indigo-500'}`}><HelpCircle size={18} /> Bank Soal</button>
        <button onClick={() => { setActiveSection('materi'); setActiveTab('input'); }} className={`py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${activeSection === 'materi' ? 'bg-white text-pink-600 shadow-sm' : 'text-slate-500 hover:text-pink-500'}`}><BookOpen size={18} /> Materi High Yield</button>
      </div>

      {/* TABS */}
      <div className="flex gap-6 mb-6 border-b border-slate-200 dark:border-slate-800">
        <button onClick={() => setActiveTab('input')} className={`pb-2 text-sm font-bold border-b-2 ${activeTab === 'input' ? 'border-slate-800 text-slate-800 dark:border-white dark:text-white' : 'border-transparent text-slate-400'}`}>Input Manual</button>
        <button onClick={() => setActiveTab('import')} className={`pb-2 text-sm font-bold border-b-2 ${activeTab === 'import' ? (activeSection === 'soal' ? 'border-indigo-600 text-indigo-600' : 'border-pink-600 text-pink-600') : 'border-transparent text-slate-400'}`}><span className="flex items-center gap-2"><FileJson size={14}/> Import JSON</span></button>
        <button onClick={() => setActiveTab('list')} className={`pb-2 text-sm font-bold border-b-2 ${activeTab === 'list' ? 'border-slate-800 text-slate-800 dark:border-white dark:text-white' : 'border-transparent text-slate-400'}`}>Lihat Daftar</button>
      </div>

      {/* --- FORM INPUT MANUAL (SOAL) --- */}
      {activeSection === 'soal' && activeTab === 'input' && (
        <form onSubmit={handleSimpanSoal} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
           <div className="flex items-center gap-2 text-indigo-600 font-bold mb-2"><PenTool size={18} /> Input Soal Baru</div>
           <div><label className="text-xs font-bold text-slate-400">SISTEM</label><select value={formSoal.system} onChange={(e) => setFormSoal({...formSoal, system: e.target.value})} className="w-full mt-1 p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl">{SYSTEM_LIST.map(sys => <option key={sys.id} value={sys.label}>{sys.label}</option>)}</select></div>
           <div><label className="text-xs font-bold text-slate-400">VIGNETTE</label><textarea value={formSoal.question} onChange={(e) => setFormSoal({...formSoal, question: e.target.value})} rows={4} className="w-full mt-1 p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl" /></div>
           <div className="grid md:grid-cols-2 gap-3">{['a','b','c','d','e'].map((opt) => (<div key={opt} className="relative"><span className="absolute left-3 top-3.5 text-xs font-bold uppercase text-slate-400">{opt}</span><input type="text" value={(formSoal.options as any)[opt]} onChange={(e) => setFormSoal({...formSoal, options: {...formSoal.options, [opt]: e.target.value}})} className="w-full pl-8 p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl" /></div>))}</div>
           
           <div className="grid md:grid-cols-3 gap-4">
              <div><label className="text-xs font-bold text-slate-400">KUNCI</label><select value={formSoal.correctAnswer} onChange={(e:any) => setFormSoal({...formSoal, correctAnswer: e.target.value})} className="w-full mt-1 p-3 bg-green-50 text-green-700 border border-green-200 rounded-xl font-bold">{['a','b','c','d','e'].map(o => <option key={o} value={o}>{o.toUpperCase()}</option>)}</select></div>
              <div className="md:col-span-2"><label className="text-xs font-bold text-slate-400">PEMBAHASAN</label><input type="text" value={formSoal.explanation} onChange={(e) => setFormSoal({...formSoal, explanation: e.target.value})} className="w-full mt-1 p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl" /></div>
           </div>
           
           <div>
             <label className="text-xs font-bold text-slate-400 flex items-center gap-1"><Sparkles size={12} className="text-emerald-500" /> INSIGHT (OPSIONAL)</label>
             <input type="text" value={formSoal.insight || ''} onChange={(e) => setFormSoal({...formSoal, insight: e.target.value})} className="w-full mt-1 p-3 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-400 placeholder:text-emerald-800/30" placeholder="Tips klinis..." />
           </div>

           <button disabled={loading} className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg transition-all">{loading ? 'Menyimpan...' : 'Simpan Soal'}</button>
        </form>
      )}

      {/* --- FORM INPUT MANUAL (MATERI) --- */}
      {activeSection === 'materi' && activeTab === 'input' && (
        <form onSubmit={handleSimpanMateri} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
           <div className="flex items-center gap-2 text-pink-600 font-bold mb-2"><FileText size={18} /> Input Materi Baru</div>
           <div className="grid md:grid-cols-2 gap-4"><div><label className="text-xs font-bold text-slate-400">SISTEM</label><select value={formMateri.system} onChange={(e) => setFormMateri({...formMateri, system: e.target.value})} className="w-full mt-1 p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl">{SYSTEM_LIST.map(sys => <option key={sys.id} value={sys.label}>{sys.label}</option>)}</select></div><div><label className="text-xs font-bold text-slate-400">KATEGORI</label><select value={formMateri.category} onChange={(e) => setFormMateri({...formMateri, category: e.target.value})} className="w-full mt-1 p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl"><option value="High Yield">High Yield</option><option value="Red Flag">Red Flag</option><option value="Emergency">Emergency</option><option value="Skill Lab">Skill Lab</option></select></div></div>
           <div><label className="text-xs font-bold text-slate-400">JUDUL</label><input type="text" value={formMateri.title} onChange={(e) => setFormMateri({...formMateri, title: e.target.value})} className="w-full mt-1 p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl" /></div>
           <div><label className="text-xs font-bold text-slate-400">ISI MATERI</label><textarea value={formMateri.content} onChange={(e) => setFormMateri({...formMateri, content: e.target.value})} rows={8} className="w-full mt-1 p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-sm" /></div>
           <div><label className="text-xs font-bold text-slate-400">INSIGHT</label><input type="text" value={formMateri.insight} onChange={(e) => setFormMateri({...formMateri, insight: e.target.value})} className="w-full mt-1 p-3 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-400" /></div>
           <button disabled={loading} className="w-full py-4 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-xl shadow-lg transition-all">{loading ? 'Menyimpan...' : 'Simpan Materi'}</button>
        </form>
      )}

      {/* --- IMPORT JSON (DENGAN SELECT SYSTEM) --- */}
      {activeTab === 'import' && (
        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
           <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${activeSection === 'soal' ? 'bg-indigo-50 text-indigo-500' : 'bg-pink-50 text-pink-500'}`}><FileJson size={40} /></div>
           <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Import {activeSection === 'soal' ? 'Bank Soal' : 'Materi'} dari JSON</h3>
           
           <div className="max-w-xs mx-auto mb-6 text-left">
             <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Akan diupload ke Sistem:</label>
             {activeSection === 'soal' ? (
                <select value={formSoal.system} onChange={(e) => setFormSoal({...formSoal, system: e.target.value})} className="w-full p-2 bg-slate-100 dark:bg-slate-800 border rounded-lg text-sm font-bold text-indigo-600">
                  {SYSTEM_LIST.map(sys => <option key={sys.id} value={sys.label}>{sys.label}</option>)}
                </select>
             ) : (
                <select value={formMateri.system} onChange={(e) => setFormMateri({...formMateri, system: e.target.value})} className="w-full p-2 bg-slate-100 dark:bg-slate-800 border rounded-lg text-sm font-bold text-pink-600">
                  {SYSTEM_LIST.map(sys => <option key={sys.id} value={sys.label}>{sys.label}</option>)}
                </select>
             )}
             <p className="text-[10px] text-slate-400 mt-1">*Jika di file JSON tidak ada label system, akan menggunakan pilihan ini.</p>
           </div>

           {loading ? (
             <div className="max-w-md mx-auto"><div className="mb-2 flex justify-between text-xs font-bold"><span>Mengupload...</span><span>{uploadProgress}%</span></div><div className="w-full bg-slate-200 rounded-full h-2.5"><div className={`h-2.5 rounded-full transition-all ${activeSection === 'soal' ? 'bg-indigo-600' : 'bg-pink-600'}`} style={{width: `${uploadProgress}%`}}></div></div></div>
           ) : (
             <label className="cursor-pointer inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all"><Upload size={20} /> Pilih File JSON<input type="file" accept=".json" className="hidden" onChange={(e) => handleJsonUpload(e)} /></label>
           )}
        </div>
      )}

      {/* --- LIST DATA & RESET --- */}
      {activeTab === 'list' && (
         <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className={`font-bold ${activeSection === 'soal' ? 'text-indigo-600' : 'text-pink-600'}`}>Total: {activeSection === 'soal' ? questions.length : materials.length}</h3>
              <button onClick={handleResetDatabase} className="text-xs flex items-center gap-1 text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg border border-red-200 transition-colors"><AlertTriangle size={12} /> Reset Database</button>
            </div>
            {activeSection === 'soal' ? questions.map(q => (
              <div key={q.id} className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 group">
                <div className="flex justify-between items-start mb-2"><span className="text-xs font-bold uppercase bg-indigo-50 text-indigo-600 px-2 py-1 rounded">{q.system}</span><button onClick={() => handleDelete(q.id!)} className="text-slate-400 hover:text-red-500"><Trash2 size={18} /></button></div>
                <p className="font-medium text-slate-800 dark:text-slate-200 mb-2 line-clamp-2">{q.question}</p>
                <div className="flex items-center gap-4 text-xs">
                   <span className="font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">Kunci: {q.correctAnswer.toUpperCase()}</span>
                   {q.insight && <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1"><Sparkles size={10} /> Ada Insight</span>}
                </div>
              </div>
            )) : materials.map(m => (
              <div key={m.id} className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-pink-500 group">
                <div className="flex justify-between items-start mb-2"><div className="flex gap-2"><span className="text-xs font-bold uppercase bg-pink-50 text-pink-600 px-2 py-1 rounded">{m.system}</span><span className="text-xs font-bold uppercase bg-orange-50 text-orange-600 px-2 py-1 rounded">{m.category}</span></div><button onClick={() => handleDelete(m.id!)} className="text-slate-400 hover:text-red-500"><Trash2 size={18} /></button></div>
                <h4 className="font-bold text-lg text-slate-800 dark:text-white mb-2">{m.title}</h4>
                <p className="text-sm text-slate-500 line-clamp-2 mb-3">{m.content}</p>
              </div>
            ))}
         </div>
      )}
    </div>
  );
}