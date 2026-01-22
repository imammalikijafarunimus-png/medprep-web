// ... (Import bagian atas sama seperti sebelumnya, pastikan icon Calendar, Layers, Hash diimport)
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { isAdmin } from '../config/admin_list';
import { 
  LayoutDashboard, Trash2, FileText, 
  HelpCircle, BookOpen, PenTool, Upload, FileJson, 
  ShieldAlert, AlertTriangle, Sparkles, Code, Lock, Unlock,
  Users, Search, Crown, CheckCircle, Calendar, Layers, Hash
} from 'lucide-react';
import { collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp, query, orderBy, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { SYSTEM_LIST } from '../data/osce_data';
import toast from 'react-hot-toast'; 

// ... (Interface UserData & CBTMaterial TETAP SAMA) ...

// UPDATE INTERFACE SOAL
interface CBTQuestion {
  id?: string;
  system: string;
  question: string;
  options: { a: string; b: string; c: string; d: string; e: string; };
  correctAnswer: 'a' | 'b' | 'c' | 'd' | 'e';
  explanation: string;
  insight?: string;
  type?: 'free' | 'premium'; 
  
  // FLEXIBLE FIELDS
  examYear?: string;  // Boleh kosong (utk latihan acak)
  examBatch?: string; // Bisa "Mei", "Agustus", atau "Fase Intensif"
  
  createdAt?: any;
}

// ... (Interface CBTMaterial TETAP SAMA) ...

export default function AdminDashboard() {
  const { currentUser } = useAuth();

  // ... (STATE activeSection, activeTab, loading, users, searchUser TETAP SAMA) ...
  const [activeSection, setActiveSection] = useState<'soal' | 'materi' | 'users'>('soal'); 
  const [activeTab, setActiveTab] = useState<'input' | 'list' | 'import'>('input');
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [jsonTextInput, setJsonTextInput] = useState('');
  
  const [questions, setQuestions] = useState<CBTQuestion[]>([]);
  const [materials, setMaterials] = useState<CBTMaterial[]>([]);
  const [users, setUsers] = useState<UserData[]>([]); 
  const [searchUser, setSearchUser] = useState('');

  // FORM SOAL (Default Batch Kosong agar Dokter isi sendiri)
  const [formSoal, setFormSoal] = useState<CBTQuestion>({
    system: 'Respirasi',
    question: '',
    options: { a: '', b: '', c: '', d: '', e: '' },
    correctAnswer: 'a',
    explanation: '',
    insight: '',
    type: 'free',
    examYear: '',       // Default kosong
    examBatch: ''       // Default kosong
  });

  const [formMateri, setFormMateri] = useState<CBTMaterial>({
    system: 'Respirasi',
    title: '',
    content: '',
    category: 'High Yield',
    insight: '',
    type: 'free'
  });

  // ... (PROTEKSI ADMIN TETAP SAMA) ...
  if (!isAdmin(currentUser?.email)) {
     // ... copy return dari file sebelumnya ...
     return null; // (Placeholder biar pendek, pakai yg lama)
  }

  // ... (HANDLE SIMPAN SOAL/MATERI, FETCH, TOGGLE PREMIUM, DELETE, RESET, IMPORT - TETAP SAMA) ...
  // (Pastikan fungsi processJsonData juga mapping examYear & examBatch seperti file sebelumnya)

  // LOGIKA SIMPAN & FETCH TETAP SAMA SEPERTI FILE SEBELUMNYA
  // SAYA HANYA TULIS ULANG BAGIAN FORM INPUT MANUAL DI BAWAH INI:

  // --- RE-IMPLEMENTASI FUNGSI PENTING AGAR TIDAK ERROR ---
  const handleSimpanSoal = async (e: React.FormEvent) => {
    e.preventDefault(); 
    if (!formSoal.question || !formSoal.options.a) { toast.error("Data tidak lengkap"); return; }
    setLoading(true); const toastId = toast.loading("Menyimpan...");
    try {
      await addDoc(collection(db, "cbt_questions"), { ...formSoal, createdAt: serverTimestamp() });
      toast.success("Berhasil!", { id: toastId });
      // Reset Form (Batch tidak direset agar input beruntun enak)
      setFormSoal(prev => ({ ...prev, question: '', options: { a: '', b: '', c: '', d: '', e: '' }, explanation: '', insight: '' }));
    } catch (error) { toast.error("Gagal", { id: toastId }); } finally { setLoading(false); }
  };

  const handleSimpanMateri = async (e: React.FormEvent) => {
      // ... Copy logika simpan materi dari file sebelumnya ...
      e.preventDefault(); 
      if (!formMateri.title || !formMateri.content) { toast.error("Data tidak lengkap"); return; }
      setLoading(true); const toastId = toast.loading("Menyimpan...");
      try { await addDoc(collection(db, "cbt_materials"), { ...formMateri, createdAt: serverTimestamp() }); toast.success("Berhasil!", { id: toastId }); setFormMateri({ ...formMateri, title: '', content: '', insight: '' }); } 
      catch (error) { toast.error("Gagal", { id: toastId }); } finally { setLoading(false); }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeSection === 'users') {
          const q = query(collection(db, "users"));
          const snapshot = await getDocs(q);
          setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as UserData[]);
      } else {
          const collectionName = activeSection === 'soal' ? "cbt_questions" : "cbt_materials";
          const q = query(collection(db, collectionName), orderBy("createdAt", "desc"));
          const snapshot = await getDocs(q);
          const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          if(activeSection === 'soal') setQuestions(data as CBTQuestion[]); else setMaterials(data as CBTMaterial[]);
      }
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const handleTogglePremium = async (userId: string, currentStatus: string | undefined) => {
      const newStatus = currentStatus === 'premium' ? 'free' : 'premium';
      if(confirm(`Ubah status user jadi ${newStatus.toUpperCase()}?`)) {
          await updateDoc(doc(db, "users", userId), { subscriptionStatus: newStatus });
          toast.success("Updated!"); fetchData();
      }
  };
  
  const handleDelete = async (id: string) => {
      if(confirm("Hapus?")) { await deleteDoc(doc(db, activeSection === 'soal' ? "cbt_questions" : "cbt_materials", id)); toast.success("Dihapus"); fetchData(); }
  };

  const handleResetDatabase = async () => { /* ... Logika Reset Sama ... */ };
  
  const processJsonData = async (jsonData: any[]) => {
      // Pastikan field examYear & examBatch di-mapping
      const collectionName = activeSection === 'soal' ? "cbt_questions" : "cbt_materials";
      for (let i = 0; i < jsonData.length; i++) {
          const item = jsonData[i];
          let payload: any = {
              system: item.system || (activeSection==='soal'?formSoal.system:formMateri.system),
              type: item.type || 'free',
              createdAt: serverTimestamp()
          };
          if(activeSection === 'soal') {
             payload = { ...payload, question: item.question, options: item.options, correctAnswer: item.correctAnswer, explanation: item.explanation, insight: item.insight, examYear: item.examYear || formSoal.examYear, examBatch: item.examBatch || formSoal.examBatch };
          } else {
             payload = { ...payload, title: item.title, content: item.content, category: item.category, insight: item.insight };
          }
          await addDoc(collection(db, collectionName), payload);
          setUploadProgress(Math.round(((i + 1) / jsonData.length) * 100));
      }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => { /* ... Logika Upload Sama ... */ 
     const fileReader = new FileReader();
     if (e.target.files && e.target.files[0]) {
        setLoading(true);
        fileReader.readAsText(e.target.files[0], "UTF-8");
        fileReader.onload = async (ev) => { try { await processJsonData(JSON.parse(ev.target?.result as string)); toast.success("Sukses"); fetchData(); setActiveTab('list'); } catch { toast.error("Error"); } finally { setLoading(false); } };
     }
  };
  
  const handleTextImport = async () => { /* ... Logika Text Import Sama ... */ 
      try { await processJsonData(JSON.parse(jsonTextInput)); toast.success("Sukses"); fetchData(); setActiveTab('list'); } catch { toast.error("Error"); }
  };

  useEffect(() => { if (activeTab === 'list' || activeSection === 'users') fetchData(); }, [activeTab, activeSection]);
  
  const getTypeBadge = (type: string | undefined) => {
      if (type === 'premium') return <span className="flex items-center gap-1 bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-[10px] font-bold border border-amber-200"><Lock size={10} /> PRO</span>;
      return <span className="flex items-center gap-1 bg-teal-100 text-teal-700 px-2 py-0.5 rounded text-[10px] font-bold border border-teal-200"><Unlock size={10} /> FREE</span>;
  };

  // --- RETURN RENDER ---
  return (
    <div className="p-6 pb-24 animate-in fade-in max-w-5xl mx-auto">
      {/* Header & Switcher (Sama) */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-indigo-600 text-white rounded-xl shadow-lg"><LayoutDashboard size={24} /></div>
        <div><h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Panel CBT</h1><p className="text-slate-500">Kelola Bank Soal, Materi & User</p></div>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-8 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800">
        <button onClick={() => { setActiveSection('soal'); setActiveTab('input'); }} className={`py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${activeSection === 'soal' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-indigo-500'}`}><HelpCircle size={18} /> Bank Soal</button>
        <button onClick={() => { setActiveSection('materi'); setActiveTab('input'); }} className={`py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${activeSection === 'materi' ? 'bg-white text-pink-600 shadow-sm' : 'text-slate-500 hover:text-pink-500'}`}><BookOpen size={18} /> Materi</button>
        <button onClick={() => { setActiveSection('users'); }} className={`py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${activeSection === 'users' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-emerald-500'}`}><Users size={18} /> User Manager</button>
      </div>

      {/* SECTION USERS (Sama) */}
      {activeSection === 'users' && (
         <div className="space-y-6">
             {/* ... Search & Table Users (Copy dari file sebelumnya) ... */}
              <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-3">
                  <Search className="text-slate-400" />
                  <input type="text" placeholder="Cari email user..." value={searchUser} onChange={(e) => setSearchUser(e.target.value)} className="flex-1 bg-transparent outline-none font-medium text-slate-700 dark:text-white" />
              </div>
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                  <table className="w-full text-left">
                      <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 text-xs uppercase font-bold">
                          <tr><th className="p-4">User</th><th className="p-4">Status</th><th className="p-4 text-right">Aksi</th></tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                          {users.filter(u => u.email?.toLowerCase().includes(searchUser.toLowerCase())).map(user => (
                              <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                  <td className="p-4"><p className="font-bold text-slate-900 dark:text-white">{user.displayName || 'User'}</p><p className="text-xs text-slate-500">{user.email}</p></td>
                                  <td className="p-4">{user.subscriptionStatus === 'premium' ? <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold border border-amber-200"><Crown size={12} fill="currentColor"/> PREMIUM</span> : <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-xs font-bold border border-slate-200">FREE</span>}</td>
                                  <td className="p-4 text-right">
                                      {user.subscriptionStatus === 'premium' ? 
                                          <button onClick={() => handleTogglePremium(user.id, 'premium')} className="text-xs font-bold text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg border border-red-200">Batalkan</button> : 
                                          <button onClick={() => handleTogglePremium(user.id, 'free')} className="text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 px-4 py-2 rounded-lg flex items-center gap-2 ml-auto"><CheckCircle size={14} /> Aktifkan PRO</button>
                                      }
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
                  {users.length === 0 && !loading && <div className="p-8 text-center text-slate-400">Belum ada user.</div>}
              </div>
         </div>
      )}

      {/* SECTION CONTENT */}
      {activeSection !== 'users' && (
        <>
          <div className="flex gap-6 mb-6 border-b border-slate-200 dark:border-slate-800">
            <button onClick={() => setActiveTab('input')} className={`pb-2 text-sm font-bold border-b-2 ${activeTab === 'input' ? 'border-slate-800 text-slate-800 dark:border-white dark:text-white' : 'border-transparent text-slate-400'}`}>Input Manual</button>
            <button onClick={() => setActiveTab('import')} className={`pb-2 text-sm font-bold border-b-2 ${activeTab === 'import' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400'}`}>Import JSON</button>
            <button onClick={() => setActiveTab('list')} className={`pb-2 text-sm font-bold border-b-2 ${activeTab === 'list' ? 'border-slate-800 text-slate-800 dark:border-white dark:text-white' : 'border-transparent text-slate-400'}`}>Lihat Daftar</button>
          </div>

          {activeTab === 'input' && (
            <form onSubmit={activeSection === 'soal' ? handleSimpanSoal : handleSimpanMateri} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
              <div className="flex items-center gap-2 font-bold mb-2 text-slate-800 dark:text-white"><PenTool size={18} /> Input Baru</div>
              
              {/* SISTEM & TYPE */}
              <div className="grid md:grid-cols-2 gap-4">
                <div><label className="text-xs font-bold text-slate-400">SISTEM</label><select value={activeSection === 'soal' ? formSoal.system : formMateri.system} onChange={(e) => activeSection === 'soal' ? setFormSoal({...formSoal, system: e.target.value}) : setFormMateri({...formMateri, system: e.target.value})} className="w-full mt-1 p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl">{SYSTEM_LIST.map(sys => <option key={sys.id} value={sys.label}>{sys.label}</option>)}</select></div>
                <div><label className="text-xs font-bold text-slate-400">TIPE</label><select value={activeSection === 'soal' ? formSoal.type : formMateri.type} onChange={(e: any) => activeSection === 'soal' ? setFormSoal({...formSoal, type: e.target.value}) : setFormMateri({...formMateri, type: e.target.value})} className="w-full mt-1 p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-700"><option value="free">🔓 Free</option><option value="premium">💎 Premium</option></select></div>
              </div>

              {/* FITUR KHUSUS SOAL: TAHUN & BATCH (FLEXIBLE) */}
              {activeSection === 'soal' && (
    <div className="grid md:grid-cols-2 gap-4 bg-indigo-50 dark:bg-indigo-900/10 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800">
        <div>
            <label className="text-xs font-bold text-indigo-400 flex items-center gap-1"><Calendar size={12}/> TAHUN (Wajib untuk Arsip)</label>
            <input 
            type="text" 
            placeholder="Contoh: 2024 (Kosongkan utk Latihan Acak)" // Helper Text
            value={formSoal.examYear} 
            onChange={(e) => setFormSoal({...formSoal, examYear: e.target.value})} 
            className="w-full mt-1 p-2 bg-white dark:bg-slate-950 border border-indigo-200 dark:border-indigo-800 rounded-lg font-bold" 
            />
        </div>
        <div>
            <label className="text-xs font-bold text-indigo-400 flex items-center gap-1"><Layers size={12}/> NAMA FOLDER / BATCH</label>
            <input 
            type="text" 
            list="batchSuggestions" 
            placeholder="Ketik: 'Fase Intensif', 'Mei', dll" 
            value={formSoal.examBatch} 
            onChange={(e) => setFormSoal({...formSoal, examBatch: e.target.value})} 
            className="w-full mt-1 p-2 bg-white dark:bg-slate-950 border border-indigo-200 dark:border-indigo-800 rounded-lg font-bold" 
            />
                          {/* Saran Otomatis */}
                          <datalist id="batchSuggestions">
                              <option value="Fase Intensif" />
                              <option value="Latihan Harian" />
                              <option value="Februari" />
                              <option value="Mei" />
                              <option value="Agustus" />
                              <option value="November" />
                          </datalist>
                      </div>
                  </div>
              )}

              {/* ... INPUT VIGNETTE, OPTION, DLL SAMA SEPERTI FILE SEBELUMNYA ... */}
              {activeSection === 'materi' && <div><label className="text-xs font-bold text-slate-400">KATEGORI</label><select value={formMateri.category} onChange={(e) => setFormMateri({...formMateri, category: e.target.value})} className="w-full mt-1 p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl"><option value="High Yield">High Yield</option><option value="Red Flag">Red Flag</option><option value="Emergency">Emergency</option><option value="Skill Lab">Skill Lab</option></select></div>}
              
              {activeSection === 'soal' && (<><div><label className="text-xs font-bold text-slate-400">VIGNETTE SOAL</label><textarea value={formSoal.question} onChange={(e) => setFormSoal({...formSoal, question: e.target.value})} rows={4} className="w-full mt-1 p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl" /></div><div className="grid md:grid-cols-2 gap-3">{['a','b','c','d','e'].map((opt) => (<div key={opt} className="relative"><span className="absolute left-3 top-3.5 text-xs font-bold uppercase text-slate-400">{opt}</span><input type="text" value={(formSoal.options as any)[opt]} onChange={(e) => setFormSoal({...formSoal, options: {...formSoal.options, [opt]: e.target.value}})} className="w-full pl-8 p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl" /></div>))}</div><div className="grid md:grid-cols-3 gap-4"><div><label className="text-xs font-bold text-slate-400">KUNCI</label><select value={formSoal.correctAnswer} onChange={(e:any) => setFormSoal({...formSoal, correctAnswer: e.target.value})} className="w-full mt-1 p-3 bg-green-50 text-green-700 border border-green-200 rounded-xl font-bold">{['a','b','c','d','e'].map(o => <option key={o} value={o}>{o.toUpperCase()}</option>)}</select></div><div className="md:col-span-2"><label className="text-xs font-bold text-slate-400">PEMBAHASAN</label><input type="text" value={formSoal.explanation} onChange={(e) => setFormSoal({...formSoal, explanation: e.target.value})} className="w-full mt-1 p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl" /></div></div><div><label className="text-xs font-bold text-slate-400 flex items-center gap-1"><Sparkles size={12} className="text-emerald-500" /> INSIGHT</label><input type="text" value={formSoal.insight || ''} onChange={(e) => setFormSoal({...formSoal, insight: e.target.value})} className="w-full mt-1 p-3 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-400" /></div></>)}
              {activeSection === 'materi' && (<><div><label className="text-xs font-bold text-slate-400">JUDUL</label><input type="text" value={formMateri.title} onChange={(e) => setFormMateri({...formMateri, title: e.target.value})} className="w-full mt-1 p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl" /></div><div><label className="text-xs font-bold text-slate-400">ISI MATERI</label><textarea value={formMateri.content} onChange={(e) => setFormMateri({...formMateri, content: e.target.value})} rows={8} className="w-full mt-1 p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-sm" /></div><div><label className="text-xs font-bold text-slate-400">INSIGHT</label><input type="text" value={formMateri.insight} onChange={(e) => setFormMateri({...formMateri, insight: e.target.value})} className="w-full mt-1 p-3 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-400" /></div></>)}
              
              <button disabled={loading} className={`w-full py-4 text-white font-bold rounded-xl shadow-lg transition-all ${activeSection === 'soal' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-pink-600 hover:bg-pink-700'}`}>{loading ? 'Menyimpan...' : 'Simpan'}</button>
            </form>
          )}

          {activeTab === 'import' && (
             <div className="space-y-8">
                 {/* ... Bagian Import Sama ... */}
                <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-center"><div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-slate-100 text-slate-500`}><FileJson size={32} /></div><h3 className="text-xl font-bold mb-2">Upload File JSON</h3><label className="cursor-pointer inline-flex items-center gap-2 px-8 py-3 bg-slate-900 text-white font-bold rounded-xl"><Upload size={18} /> Pilih File<input type="file" accept=".json" className="hidden" onChange={handleFileUpload} /></label></div>
                <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm"><h3 className="text-xl font-bold mb-4">Paste JSON Code</h3><textarea value={jsonTextInput} onChange={(e) => setJsonTextInput(e.target.value)} className="w-full h-40 p-4 border rounded-xl font-mono text-xs mb-4" placeholder="Paste JSON here..." /><button onClick={handleTextImport} className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl flex items-center gap-2"><Upload size={18} /> Import Text</button></div>
             </div>
          )}
          
          {activeTab === 'list' && (
             <div className="space-y-4">
                 <div className="flex justify-between items-center"><h3 className={`font-bold ${activeSection === 'soal' ? 'text-indigo-600' : 'text-pink-600'}`}>Total: {activeSection === 'soal' ? questions.length : materials.length}</h3><button onClick={handleResetDatabase} className="text-xs flex items-center gap-1 text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg border border-red-200 transition-colors"><AlertTriangle size={12} /> Reset Database</button></div>
                 {activeSection === 'soal' ? questions.map(q => (
                    <div key={q.id} className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 group relative">
                        <div className="flex flex-wrap gap-2 mb-2">
                            <span className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded text-xs font-bold">{q.system}</span>
                            {/* TAMPILAN BATCH FLEXIBLE */}
                            {q.examBatch && (
                                <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                                    <Hash size={10} /> {q.examBatch} {q.examYear}
                                </span>
                            )}
                            {getTypeBadge(q.type)}
                        </div>
                        <p className="font-medium text-slate-800 dark:text-slate-200 mb-2 line-clamp-2">{q.question}</p>
                        <button onClick={() => handleDelete(q.id!)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500"><Trash2 size={18}/></button>
                    </div>
                 )) : materials.map(m => (<div key={m.id} className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-pink-500 group relative"><div className="flex gap-2 mb-2"><span className="bg-pink-50 text-pink-600 px-2 py-1 rounded text-xs font-bold">{m.system}</span>{getTypeBadge(m.type)}</div><h4 className="font-bold mb-1 text-slate-800 dark:text-white">{m.title}</h4><button onClick={() => handleDelete(m.id!)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500"><Trash2 size={18}/></button></div>))}
             </div>
          )}
        </>
      )}
    </div>
  );
}