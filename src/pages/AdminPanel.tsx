import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { isAdmin } from '../config/admin_list';
import { 
  LayoutDashboard, Trash2, FileText, 
  HelpCircle, BookOpen, PenTool, Upload, FileJson, 
  AlertTriangle, Sparkles, Lock, Unlock,
  Users, Search, Crown, CheckCircle, Calendar, Layers, Hash,
  Star, Shield, XCircle, Filter, X
} from 'lucide-react';
import { collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp, query, orderBy, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { SYSTEM_LIST } from '../data/osce_data';
import toast from 'react-hot-toast'; 

// --- INTERFACES ---
interface UserData {
  id: string;
  name: string;
  displayName?: string;
  email: string;
  university: string;
  subscriptionStatus: 'free' | 'basic' | 'expert' | 'premium';
}

interface CBTQuestion {
  id?: string;
  system: string;
  question: string;
  options: { a: string; b: string; c: string; d: string; e: string; };
  correctAnswer: 'a' | 'b' | 'c' | 'd' | 'e';
  explanation: string;
  insight?: string;
  type?: 'free' | 'premium'; 
  examYear?: string; 
  examBatch?: string;
  createdAt?: any;
}

interface CBTMaterial {
  id?: string;
  system: string;
  title: string;
  content: string;
  category: string;
  insight?: string;
  type?: 'free' | 'premium';
  createdAt?: any;
}

export default function AdminDashboard() {
  const { currentUser } = useAuth();

  // STATE UTAMA
  const [activeSection, setActiveSection] = useState<'soal' | 'materi' | 'users'>('soal'); 
  const [activeTab, setActiveTab] = useState<'input' | 'list' | 'import'>('input');
  const [loading, setLoading] = useState(false);
  const [jsonTextInput, setJsonTextInput] = useState('');
  
  // DATA STATE
  const [questions, setQuestions] = useState<CBTQuestion[]>([]);
  const [materials, setMaterials] = useState<CBTMaterial[]>([]);
  const [users, setUsers] = useState<UserData[]>([]); 
  
  // FILTER STATE (NEW)
  const [searchTerm, setSearchTerm] = useState(''); // Untuk Users & Konten
  const [filterSystem, setFilterSystem] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [filterBatch, setFilterBatch] = useState(''); // Khusus Soal

  // FORM INPUT STATE
  const [formSoal, setFormSoal] = useState<CBTQuestion>({
    system: 'Respirasi',
    question: '',
    options: { a: '', b: '', c: '', d: '', e: '' },
    correctAnswer: 'a',
    explanation: '',
    insight: '',
    type: 'free',
    examYear: '', 
    examBatch: ''
  });

  const [formMateri, setFormMateri] = useState<CBTMaterial>({
    system: 'Respirasi',
    title: '',
    content: '',
    category: 'High Yield',
    insight: '',
    type: 'free'
  });

  // SECURITY CHECK
  if (!isAdmin(currentUser?.email)) {
     return (
         <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-black">
             <div className="text-center">
                 <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2">403</h1>
                 <p className="text-slate-500">Akses ditolak. Anda bukan admin.</p>
             </div>
         </div>
     );
  }

  // --- ACTIONS ---

  const handleSimpanSoal = async (e: React.FormEvent) => {
    e.preventDefault(); 
    if (!formSoal.question || !formSoal.options.a) { toast.error("Data tidak lengkap"); return; }
    setLoading(true); 
    const toastId = toast.loading("Menyimpan Soal...");
    try {
      await addDoc(collection(db, "cbt_questions"), { ...formSoal, createdAt: serverTimestamp() });
      toast.success("Soal Berhasil Disimpan!", { id: toastId });
      setFormSoal(prev => ({ ...prev, question: '', options: { a: '', b: '', c: '', d: '', e: '' }, explanation: '', insight: '' }));
    } catch (error) { toast.error("Gagal menyimpan", { id: toastId }); } 
    finally { setLoading(false); }
  };

  const handleSimpanMateri = async (e: React.FormEvent) => {
      e.preventDefault(); 
      if (!formMateri.title || !formMateri.content) { toast.error("Data tidak lengkap"); return; }
      setLoading(true); 
      const toastId = toast.loading("Menyimpan Materi...");
      try { 
          await addDoc(collection(db, "cbt_materials"), { ...formMateri, createdAt: serverTimestamp() }); 
          toast.success("Materi Berhasil Disimpan!", { id: toastId }); 
          setFormMateri(prev => ({ ...prev, title: '', content: '', insight: '' })); 
      } catch (error) { toast.error("Gagal menyimpan", { id: toastId }); } 
      finally { setLoading(false); }
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
          if(activeSection === 'soal') setQuestions(data as CBTQuestion[]); 
          else setMaterials(data as CBTMaterial[]);
      }
    } catch (error) { console.error(error); } 
    finally { setLoading(false); }
  };

  // CHANGE USER STATUS
  const handleChangeStatus = async (userId: string, newStatus: string) => {
      if(confirm(`Ubah status user ini menjadi ${newStatus.toUpperCase()}?`)) {
          try {
              await updateDoc(doc(db, "users", userId), { subscriptionStatus: newStatus });
              toast.success(`Status user diupdate ke: ${newStatus.toUpperCase()}`);
              fetchData();
          } catch (err) {
              toast.error("Gagal update status");
          }
      }
  };
  
  const handleDelete = async (id: string) => {
      if(confirm("Yakin ingin menghapus item ini?")) { 
          await deleteDoc(doc(db, activeSection === 'soal' ? "cbt_questions" : "cbt_materials", id)); 
          toast.success("Item dihapus"); 
          fetchData(); 
      }
  };

  const handleDeleteUser = async (id: string) => {
      if(confirm("Yakin ingin MENGHAPUS user ini permanen?")) { 
          await deleteDoc(doc(db, "users", id)); 
          toast.success("User dihapus"); 
          fetchData(); 
      }
  };
  
  // JSON IMPORT LOGIC
  const processJsonData = async (jsonData: any[]) => {
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
      }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
     const fileReader = new FileReader();
     if (e.target.files && e.target.files[0]) {
        setLoading(true);
        fileReader.readAsText(e.target.files[0], "UTF-8");
        fileReader.onload = async (ev) => { 
            try { 
                await processJsonData(JSON.parse(ev.target?.result as string)); 
                toast.success("Sukses Import JSON File!"); 
                fetchData(); 
                setActiveTab('list'); 
            } catch { toast.error("Format File Error"); } 
            finally { setLoading(false); } 
        };
     }
  };

  const handleTextImport = async () => { 
      setLoading(true);
      try { 
          await processJsonData(JSON.parse(jsonTextInput)); 
          toast.success("Import Text Sukses!"); 
          fetchData(); 
          setActiveTab('list'); 
      } 
      catch { toast.error("Format JSON Salah. Cek kurung {} []"); }
      finally { setLoading(false); }
  };

  useEffect(() => { 
      if (activeTab === 'list' || activeSection === 'users') fetchData(); 
  }, [activeTab, activeSection]);
  
  // FILTERING LOGIC
  const getFilteredData = () => {
      if (activeSection === 'soal') {
          return questions.filter(q => {
              const matchesSearch = q.question.toLowerCase().includes(searchTerm.toLowerCase());
              const matchesSystem = filterSystem === 'All' || q.system === filterSystem;
              const matchesType = filterType === 'All' || q.type === filterType;
              const matchesBatch = filterBatch === '' || 
                                   (q.examBatch && q.examBatch.toLowerCase().includes(filterBatch.toLowerCase())) ||
                                   (q.examYear && q.examYear.includes(filterBatch));
              return matchesSearch && matchesSystem && matchesType && matchesBatch;
          });
      } else {
          return materials.filter(m => {
              const matchesSearch = m.title.toLowerCase().includes(searchTerm.toLowerCase());
              const matchesSystem = filterSystem === 'All' || m.system === filterSystem;
              const matchesType = filterType === 'All' || m.type === filterType;
              return matchesSearch && matchesSystem && matchesType;
          });
      }
  };

  const filteredData = getFilteredData();

  // Badge Helper
  const getTypeBadge = (type: string | undefined) => {
      if (type === 'premium') return <span className="flex items-center gap-1 bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-[10px] font-bold border border-amber-200"><Lock size={10} /> PRO</span>;
      return <span className="flex items-center gap-1 bg-teal-100 text-teal-700 px-2 py-0.5 rounded text-[10px] font-bold border border-teal-200"><Unlock size={10} /> FREE</span>;
  };

  // --- RENDER UI ---
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24 max-w-7xl mx-auto px-4 md:px-6">
      
      {/* HEADER */}
      <div className="relative bg-slate-900 dark:bg-black rounded-[2.5rem] p-10 overflow-hidden shadow-2xl">
         <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px]"></div>
         <div className="relative z-10 flex items-center gap-4">
             <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl text-white shadow-lg">
                 <LayoutDashboard size={32} />
             </div>
             <div>
                 <h1 className="text-3xl font-black text-white mb-1">Admin Panel</h1>
                 <p className="text-slate-400">Pusat Kontrol MedPrep OS.</p>
             </div>
         </div>
      </div>

      {/* NAVIGASI UTAMA */}
      <div className="flex p-1.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto">
        <button onClick={() => { setActiveSection('soal'); setActiveTab('input'); }} className={`flex-1 py-3 px-6 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${activeSection === 'soal' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}><HelpCircle size={18} /> Bank Soal</button>
        <button onClick={() => { setActiveSection('materi'); setActiveTab('input'); }} className={`flex-1 py-3 px-6 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${activeSection === 'materi' ? 'bg-pink-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}><BookOpen size={18} /> Materi</button>
        <button onClick={() => { setActiveSection('users'); }} className={`flex-1 py-3 px-6 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${activeSection === 'users' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}><Users size={18} /> User Manager</button>
      </div>

      {/* === SECTION: USER MANAGER (3 LEVEL) === */}
      {activeSection === 'users' && (
         <div className="space-y-6">
              <div className="bg-white dark:bg-slate-900 p-4 rounded-[2rem] border border-slate-200 dark:border-slate-800 flex items-center gap-3 shadow-sm">
                  <Search className="text-slate-400 ml-2" />
                  <input type="text" placeholder="Cari nama atau email user..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="flex-1 bg-transparent outline-none font-medium text-slate-700 dark:text-white p-2" />
              </div>
              
              <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800">
                            <tr>
                                <th className="p-6 font-black text-slate-400 text-xs uppercase tracking-widest">User Info</th>
                                <th className="p-6 font-black text-slate-400 text-xs uppercase tracking-widest">Status Langganan</th>
                                <th className="p-6 font-black text-slate-400 text-xs uppercase tracking-widest text-right">Aksi & Leveling</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {users.filter(u => u.email?.toLowerCase().includes(searchTerm.toLowerCase()) || u.name?.toLowerCase().includes(searchTerm.toLowerCase())).map(user => (
                                <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                    <td className="p-6">
                                        <p className="font-bold text-slate-900 dark:text-white text-base">{user.displayName || user.name || 'User Tanpa Nama'}</p>
                                        <p className="text-xs text-slate-500 font-mono mt-1">{user.email}</p>
                                        <span className="text-[10px] text-slate-400 mt-1 block">{user.university} ({user.segment})</span>
                                    </td>
                                    <td className="p-6">
                                        {user.subscriptionStatus === 'expert' || user.subscriptionStatus === 'premium' ? (
                                            <span className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 px-3 py-1.5 rounded-full text-xs font-black border border-amber-200 dark:border-amber-800 shadow-sm">
                                                <Crown size={12} fill="currentColor"/> EXPERT
                                            </span>
                                        ) : user.subscriptionStatus === 'basic' ? (
                                            <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 px-3 py-1.5 rounded-full text-xs font-black border border-blue-200 dark:border-blue-800 shadow-sm">
                                                <Star size={12} fill="currentColor"/> BASIC
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-2 bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 px-3 py-1.5 rounded-full text-xs font-bold border border-slate-200 dark:border-slate-700">
                                                <Shield size={12} /> FREE
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-6 text-right">
                                        <div className="flex justify-end items-center gap-2">
                                            <button onClick={() => handleChangeStatus(user.id, 'free')} className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 border border-slate-200" title="Set Free"><XCircle size={16}/></button>
                                            <button onClick={() => handleChangeStatus(user.id, 'basic')} className={`px-3 py-1.5 rounded-lg font-bold text-xs border transition-all ${user.subscriptionStatus === 'basic' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-600 border-blue-200 hover:bg-blue-50'}`}>Basic</button>
                                            <button onClick={() => handleChangeStatus(user.id, 'expert')} className={`px-3 py-1.5 rounded-lg font-bold text-xs border transition-all ${user.subscriptionStatus === 'expert' ? 'bg-amber-500 text-white border-amber-500' : 'bg-white text-amber-600 border-amber-200 hover:bg-amber-50'}`}>Expert</button>
                                            <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 mx-2"></div>
                                            <button onClick={() => handleDeleteUser(user.id)} className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 border border-red-100 transition-colors" title="Hapus User"><Trash2 size={16}/></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                  </div>
              </div>
         </div>
      )}

      {/* === SECTION: KONTEN (SOAL & MATERI) === */}
      {activeSection !== 'users' && (
        <>
          {/* SUB TABS */}
          <div className="flex justify-center gap-2 mb-8">
            {['input', 'import', 'list'].map(tab => (
                <button 
                    key={tab}
                    onClick={() => setActiveTab(tab as any)} 
                    className={`px-6 py-2 rounded-full text-sm font-bold transition-all border ${activeTab === tab 
                        ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900' 
                        : 'bg-transparent text-slate-500 border-transparent hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                >
                    {tab === 'input' ? 'Input Manual' : tab === 'import' ? 'Import JSON' : 'Lihat Daftar'}
                </button>
            ))}
          </div>

          {/* TAB 1: INPUT MANUAL */}
          {activeTab === 'input' && (
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl max-w-4xl mx-auto animate-in zoom-in-95 duration-300">
                <div className="flex items-center gap-2 font-black text-xl mb-6 text-slate-900 dark:text-white pb-4 border-b border-slate-100 dark:border-slate-800">
                    <PenTool size={24} className="text-indigo-500"/> 
                    Input {activeSection === 'soal' ? 'Soal CBT' : 'Materi Belajar'}
                </div>
              
                <form onSubmit={activeSection === 'soal' ? handleSimpanSoal : handleSimpanMateri} className="space-y-6">
                    {/* INPUT FORM (SAMA SEPERTI SEBELUMNYA) */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Sistem Organ</label>
                            <select value={activeSection === 'soal' ? formSoal.system : formMateri.system} onChange={(e) => activeSection === 'soal' ? setFormSoal({...formSoal, system: e.target.value}) : setFormMateri({...formMateri, system: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl appearance-none font-bold text-slate-700 dark:text-slate-300 outline-none">
                                {SYSTEM_LIST.map(sys => <option key={sys.id} value={sys.label}>{sys.label}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Tipe Akses</label>
                            <div className="flex gap-4">
                                <label className={`flex-1 cursor-pointer p-4 rounded-2xl border-2 flex items-center justify-center gap-2 font-bold transition-all ${(activeSection === 'soal' ? formSoal.type : formMateri.type) === 'free' ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-slate-200 opacity-60'}`}>
                                    <input type="radio" className="hidden" name="type" value="free" checked={(activeSection === 'soal' ? formSoal.type : formMateri.type) === 'free'} onChange={() => activeSection === 'soal' ? setFormSoal({...formSoal, type: 'free'}) : setFormMateri({...formMateri, type: 'free'})} />
                                    <Unlock size={16}/> FREE
                                </label>
                                <label className={`flex-1 cursor-pointer p-4 rounded-2xl border-2 flex items-center justify-center gap-2 font-bold transition-all ${(activeSection === 'soal' ? formSoal.type : formMateri.type) === 'premium' ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-slate-200 opacity-60'}`}>
                                    <input type="radio" className="hidden" name="type" value="premium" checked={(activeSection === 'soal' ? formSoal.type : formMateri.type) === 'premium'} onChange={() => activeSection === 'soal' ? setFormSoal({...formSoal, type: 'premium'}) : setFormMateri({...formMateri, type: 'premium'})} />
                                    <Lock size={16}/> PREMIUM
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* FIELD KHUSUS SOAL (BATCH & TAHUN) */}
                    {activeSection === 'soal' && (
                        <div className="grid md:grid-cols-2 gap-4 bg-indigo-50 dark:bg-indigo-900/10 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-800">
                            <div>
                                <label className="text-xs font-bold text-indigo-500 mb-1 block">TAHUN (Opsional)</label>
                                <input type="text" placeholder="2024" value={formSoal.examYear} onChange={(e) => setFormSoal({...formSoal, examYear: e.target.value})} className="w-full p-2 rounded-lg bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-indigo-500 mb-1 block">BATCH / FOLDER</label>
                                <input type="text" placeholder="Mei, Fase Intensif, dll" value={formSoal.examBatch} onChange={(e) => setFormSoal({...formSoal, examBatch: e.target.value})} className="w-full p-2 rounded-lg bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800" />
                            </div>
                        </div>
                    )}

                    {activeSection === 'materi' && (
                        <>
                            <input type="text" placeholder="Judul Materi..." value={formMateri.title} onChange={(e) => setFormMateri({...formMateri, title: e.target.value})} className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-bold" />
                            <textarea rows={8} placeholder="Isi Materi (Markdown)..." value={formMateri.content} onChange={(e) => setFormMateri({...formMateri, content: e.target.value})} className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-sm" />
                            <input type="text" placeholder="Insight Klinis..." value={formMateri.insight} onChange={(e) => setFormMateri({...formMateri, insight: e.target.value})} className="w-full p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200" />
                        </>
                    )}

                    {activeSection === 'soal' && (
                        <>
                            <textarea rows={4} placeholder="Vignette Soal..." value={formSoal.question} onChange={(e) => setFormSoal({...formSoal, question: e.target.value})} className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800" />
                            <div className="space-y-2">
                                {['a','b','c','d','e'].map(opt => (
                                    <div key={opt} className="flex gap-2">
                                        <span className="w-10 h-10 flex items-center justify-center bg-slate-100 rounded-lg font-bold uppercase text-slate-500">{opt}</span>
                                        <input type="text" placeholder={`Opsi ${opt.toUpperCase()}`} value={(formSoal.options as any)[opt]} onChange={(e) => setFormSoal({...formSoal, options: {...formSoal.options, [opt]: e.target.value}})} className="flex-1 p-2 rounded-lg bg-white border border-slate-200" />
                                    </div>
                                ))}
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-400 block mb-1">KUNCI</label>
                                    <select value={formSoal.correctAnswer} onChange={(e:any) => setFormSoal({...formSoal, correctAnswer: e.target.value})} className="w-full p-3 bg-green-50 border border-green-200 rounded-xl font-bold text-green-700">
                                        {['a','b','c','d','e'].map(o => <option key={o} value={o}>{o.toUpperCase()}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-400 block mb-1">PEMBAHASAN</label>
                                    <input type="text" placeholder="Penjelasan singkat..." value={formSoal.explanation} onChange={(e) => setFormSoal({...formSoal, explanation: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" />
                                </div>
                            </div>
                            <input type="text" placeholder="Insight (Optional)..." value={formSoal.insight} onChange={(e) => setFormSoal({...formSoal, insight: e.target.value})} className="w-full p-3 bg-emerald-50 border border-emerald-200 rounded-xl" />
                        </>
                    )}

                    <button disabled={loading} className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:scale-[1.01] transition-all">
                        {loading ? 'Menyimpan...' : 'SIMPAN DATA'}
                    </button>
                </form>
            </div>
          )}

          {/* TAB 2: IMPORT JSON (FIXED) */}
          {activeTab === 'import' && (
             <div className="space-y-8 max-w-3xl mx-auto animate-in fade-in slide-in-from-right duration-300">
                <div className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl text-center">
                    <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 bg-slate-100 dark:bg-slate-800 text-slate-500`}>
                        <FileJson size={40} />
                    </div>
                    <h3 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Upload File JSON</h3>
                    <p className="text-slate-500 mb-8 max-w-sm mx-auto">Format file harus sesuai dengan struktur database MedPrep.</p>
                    <label className="cursor-pointer inline-flex items-center gap-3 px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-2xl hover:scale-105 transition-transform shadow-lg">
                        <Upload size={20} /> Pilih File JSON
                        <input type="file" accept=".json" className="hidden" onChange={handleFileUpload} />
                    </label>
                </div>
                
                <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-white"><PenTool size={20} /> Paste JSON Text</h3>
                    <textarea value={jsonTextInput} onChange={(e) => setJsonTextInput(e.target.value)} className="w-full h-48 p-6 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl font-mono text-xs mb-6 outline-none text-slate-700 dark:text-slate-300" placeholder='[ { "question": "...", "options": {...} } ]' />
                    <button onClick={handleTextImport} className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg hover:shadow-emerald-500/20 transition-all">
                        <Upload size={20} /> Proses Import Text
                    </button>
                </div>
             </div>
          )}
          
          {/* TAB 3: LIST DATA (NEW SEARCH & FILTER) */}
          {activeTab === 'list' && (
             <div className="space-y-6">
                 {/* SEARCH & FILTER BAR */}
                 <div className="bg-white dark:bg-slate-900 p-4 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-4">
                     {/* Search Text */}
                     <div className="flex-1 relative">
                         <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                         <input 
                            type="text" 
                            placeholder="Cari konten..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-950 rounded-xl outline-none text-sm font-medium"
                         />
                     </div>
                     
                     {/* Filter System */}
                     <div className="relative w-40">
                         <select value={filterSystem} onChange={(e) => setFilterSystem(e.target.value)} className="w-full p-3 bg-slate-50 dark:bg-slate-950 rounded-xl outline-none text-xs font-bold appearance-none">
                             <option value="All">Semua Sistem</option>
                             {SYSTEM_LIST.map(s => <option key={s.id} value={s.label}>{s.label}</option>)}
                         </select>
                     </div>

                     {/* Filter Type */}
                     <div className="relative w-32">
                         <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="w-full p-3 bg-slate-50 dark:bg-slate-950 rounded-xl outline-none text-xs font-bold appearance-none">
                             <option value="All">Semua Tipe</option>
                             <option value="free">Free</option>
                             <option value="premium">Premium</option>
                         </select>
                     </div>

                     {/* Filter Batch (Soal Only) */}
                     {activeSection === 'soal' && (
                         <div className="w-40 relative">
                             <input 
                                type="text" 
                                placeholder="Filter Batch/Thn" 
                                value={filterBatch}
                                onChange={(e) => setFilterBatch(e.target.value)}
                                className="w-full p-3 bg-slate-50 dark:bg-slate-950 rounded-xl outline-none text-xs font-bold"
                             />
                         </div>
                     )}
                 </div>

                 <div className="flex justify-between items-center px-2">
                     <h3 className={`font-bold ${activeSection === 'soal' ? 'text-indigo-600' : 'text-pink-600'}`}>
                         Ditemukan: {filteredData.length} Data
                     </h3>
                 </div>
                 
                 {/* LIST ITEMS */}
                 <div className="grid gap-4">
                     {activeSection === 'soal' ? (filteredData as CBTQuestion[]).map(q => (
                        <div key={q.id} className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 hover:border-indigo-500 group relative shadow-sm hover:shadow-md transition-all">
                            <div className="flex flex-wrap gap-2 mb-3">
                                <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">{q.system}</span>
                                {q.examBatch && (
                                    <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                        <Hash size={10} /> {q.examBatch} {q.examYear}
                                    </span>
                                )}
                                {getTypeBadge(q.type)}
                            </div>
                            <p className="font-medium text-slate-800 dark:text-slate-200 mb-4 line-clamp-2 leading-relaxed">{q.question}</p>
                            <div className="flex justify-between items-center border-t border-slate-100 dark:border-slate-800 pt-4 mt-2">
                                <span className="text-xs text-slate-400 font-mono">ID: {q.id}</span>
                                <button onClick={() => handleDelete(q.id!)} className="text-slate-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-full"><Trash2 size={18}/></button>
                            </div>
                        </div>
                     )) : (filteredData as CBTMaterial[]).map(m => (
                        <div key={m.id} className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 hover:border-pink-500 group relative shadow-sm hover:shadow-md transition-all">
                            <div className="flex gap-2 mb-3">
                                <span className="bg-pink-50 text-pink-600 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">{m.system}</span>
                                <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold">{m.category}</span>
                                {getTypeBadge(m.type)}
                            </div>
                            <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-2">{m.title}</h4>
                            <p className="text-slate-500 text-sm line-clamp-2 mb-4">{m.content}</p>
                            <div className="flex justify-end border-t border-slate-100 dark:border-slate-800 pt-4">
                                <button onClick={() => handleDelete(m.id!)} className="text-slate-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-full"><Trash2 size={18}/></button>
                            </div>
                        </div>
                     ))}
                 </div>
             </div>
          )}
        </>
      )}
    </div>
  );
}