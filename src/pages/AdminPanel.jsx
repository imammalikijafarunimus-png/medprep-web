import { useState } from 'react';
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  CheckCircle,
  BookOpen,
  Stethoscope,
  Zap,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('flashcard'); // Default tab
  const [loading, setLoading] = useState(false);

  // --- SUB-COMPONENT: FORM FLASHCARD ---
  const FormFlashcard = () => {
    const [data, setData] = useState({ front: '', back: '', type: 'medical' });

    const handleSave = async (e) => {
      e.preventDefault();
      setLoading(true);
      try {
        await addDoc(collection(db, 'flashcards'), {
          ...data,
          createdAt: serverTimestamp(),
        });
        alert('Flashcard berhasil disimpan!');
        setData({ front: '', back: '', type: 'medical' }); // Reset
      } catch (err) {
        alert('Gagal simpan: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    return (
      <form onSubmit={handleSave} className="space-y-4 animate-in fade-in">
        <div>
          <label className="label">Tipe Kartu</label>
          <select
            value={data.type}
            onChange={(e) => setData({ ...data, type: e.target.value })}
            className="input-field"
          >
            <option value="medical">🩺 Medis</option>
            <option value="islamic">🕌 Islam (Fiqih/Adab)</option>
          </select>
        </div>
        <div>
          <label className="label">Pertanyaan (Depan)</label>
          <textarea
            required
            rows="2"
            className="input-field"
            value={data.front}
            onChange={(e) => setData({ ...data, front: e.target.value })}
            placeholder="Contoh: Apa trias gejala X?"
          />
        </div>
        <div>
          <label className="label">Jawaban (Belakang)</label>
          <textarea
            required
            rows="3"
            className="input-field"
            value={data.back}
            onChange={(e) => setData({ ...data, back: e.target.value })}
            placeholder="Jawaban lengkap..."
          />
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Menyimpan...' : 'Simpan Flashcard'}
        </button>
      </form>
    );
  };

  // --- SUB-COMPONENT: FORM CBT ---
  const FormCBT = () => {
    const [data, setData] = useState({
      question: '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      optionE: '',
      correctAnswer: 'A',
      explanation: '',
      category: 'Respirologi',
    });

    const handleSave = async (e) => {
      e.preventDefault();
      setLoading(true);
      try {
        await addDoc(collection(db, 'cbt_questions'), {
          ...data,
          createdAt: serverTimestamp(),
        });
        alert('Soal CBT berhasil disimpan!');
        setData({ ...data, question: '', explanation: '' }); // Reset sebagian
      } catch (err) {
        alert('Gagal simpan: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    return (
      <form onSubmit={handleSave} className="space-y-4 animate-in fade-in">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Kategori Sistem</label>
            <input
              type="text"
              required
              className="input-field"
              value={data.category}
              onChange={(e) => setData({ ...data, category: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Kunci Jawaban</label>
            <select
              className="input-field"
              value={data.correctAnswer}
              onChange={(e) =>
                setData({ ...data, correctAnswer: e.target.value })
              }
            >
              {['A', 'B', 'C', 'D', 'E'].map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="label">Skenario Soal</label>
          <textarea
            required
            rows="4"
            className="input-field"
            value={data.question}
            onChange={(e) => setData({ ...data, question: e.target.value })}
            placeholder="Seorang laki-laki usia 45 tahun..."
          />
        </div>

        <div className="space-y-2">
          <label className="label">Pilihan Jawaban</label>
          {['A', 'B', 'C', 'D', 'E'].map((opt) => (
            <div key={opt} className="flex items-center gap-2">
              <span className="font-bold text-slate-500 w-4">{opt}.</span>
              <input
                required
                type="text"
                className="input-field"
                value={data[`option${opt}`]}
                onChange={(e) =>
                  setData({ ...data, [`option${opt}`]: e.target.value })
                }
                placeholder={`Pilihan ${opt}`}
              />
            </div>
          ))}
        </div>

        <div>
          <label className="label">Pembahasan</label>
          <textarea
            required
            rows="3"
            className="input-field"
            value={data.explanation}
            onChange={(e) => setData({ ...data, explanation: e.target.value })}
            placeholder="Jelaskan kenapa jawabannya itu..."
          />
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Menyimpan...' : 'Simpan Soal CBT'}
        </button>
      </form>
    );
  };

  // --- SUB-COMPONENT: FORM OSCE ---
  const FormOSCE = () => {
    const [header, setHeader] = useState({ title: '', system: '', time: 15 });
    // State untuk daftar checklist sementara
    const [items, setItems] = useState([]);
    // State untuk input item baru
    const [newItem, setNewItem] = useState({ text: '', type: 'standard' });

    const addItem = () => {
      if (!newItem.text) return;
      setItems([...items, { ...newItem, id: Date.now() }]); // Tambah ke list
      setNewItem({ ...newItem, text: '' }); // Reset input text
    };

    const removeItem = (id) => {
      setItems(items.filter((i) => i.id !== id));
    };

    const handleSave = async () => {
      if (!header.title || items.length === 0)
        return alert('Judul dan Checklist tidak boleh kosong!');
      setLoading(true);
      try {
        await addDoc(collection(db, 'osce_stations'), {
          ...header,
          checklist: items, // Simpan array checklist
          createdAt: serverTimestamp(),
        });
        alert('Station OSCE berhasil disimpan!');
        setHeader({ title: '', system: '', time: 15 });
        setItems([]);
      } catch (err) {
        alert('Gagal: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="space-y-6 animate-in fade-in">
        {/* Header Station */}
        <div className="bg-dark/50 p-4 rounded-lg space-y-4 border border-slate-700">
          <h3 className="font-bold text-white">1. Info Station</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              className="input-field"
              placeholder="Judul Station (Misal: Kateter)"
              value={header.title}
              onChange={(e) => setHeader({ ...header, title: e.target.value })}
            />
            <input
              type="text"
              className="input-field"
              placeholder="Sistem (Misal: Genitourinary)"
              value={header.system}
              onChange={(e) => setHeader({ ...header, system: e.target.value })}
            />
          </div>
        </div>

        {/* Input Checklist */}
        <div className="bg-dark/50 p-4 rounded-lg space-y-4 border border-slate-700">
          <h3 className="font-bold text-white">2. Tambah Checklist Item</h3>
          <div className="flex gap-2">
            <select
              className="input-field w-32 shrink-0"
              value={newItem.type}
              onChange={(e) => setNewItem({ ...newItem, type: e.target.value })}
            >
              <option value="standard">Standar</option>
              <option value="critical">⚠️ Kritis</option>
              <option value="islamic">🕌 Islami</option>
            </select>
            <input
              type="text"
              className="input-field"
              placeholder="Teks Checklist..."
              value={newItem.text}
              onChange={(e) => setNewItem({ ...newItem, text: e.target.value })}
            />
            <button
              type="button"
              onClick={addItem}
              className="bg-slate-700 hover:bg-slate-600 p-2 rounded-lg text-white"
            >
              <Plus size={24} />
            </button>
          </div>

          {/* Preview List */}
          <div className="space-y-2 mt-4">
            {items.map((item, idx) => (
              <div
                key={item.id}
                className="flex justify-between items-center p-3 bg-surface border border-slate-700 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-slate-500">
                    {idx + 1}.
                  </span>
                  <div>
                    <p className="text-sm">{item.text}</p>
                    <span
                      className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                        item.type === 'critical'
                          ? 'bg-red-500/20 text-red-400'
                          : item.type === 'islamic'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-slate-700 text-slate-400'
                      }`}
                    >
                      {item.type}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
            {items.length === 0 && (
              <p className="text-center text-slate-500 text-sm">
                Belum ada item checklist.
              </p>
            )}
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={loading}
          className="btn-primary w-full"
        >
          {loading ? 'Menyimpan...' : 'Simpan Station OSCE'}
        </button>
      </div>
    );
  };

  // --- RENDER UTAMA ---
  return (
    <div className="max-w-3xl mx-auto pb-20">
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <Link
          to="/app"
          className="p-2 hover:bg-slate-800 rounded-full transition-colors"
        >
          <ArrowLeft />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <p className="text-slate-400">Input Data Materi & Soal</p>
        </div>
      </div>

      {/* TABS NAVIGATION */}
      <div className="flex p-1 bg-surface border border-slate-700 rounded-xl mb-8">
        {[
          { id: 'flashcard', label: 'Flashcard', icon: Zap },
          { id: 'cbt', label: 'Soal CBT', icon: BookOpen },
          { id: 'osce', label: 'Station OSCE', icon: Stethoscope },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all ${
              activeTab === tab.id
                ? 'bg-primary text-white shadow-lg'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* CONTENT AREA */}
      <div className="bg-surface border border-slate-700 rounded-2xl p-6 shadow-xl">
        {activeTab === 'flashcard' && <FormFlashcard />}
        {activeTab === 'cbt' && <FormCBT />}
        {activeTab === 'osce' && <FormOSCE />}
      </div>

      {/* Style Helper (agar kodingan di atas lebih rapi) */}
      <style>{`
        .input-field {
          width: 100%;
          background-color: #0f172a; /* bg-dark */
          border: 1px solid #334155; /* border-slate-700 */
          border-radius: 0.5rem;
          padding: 0.5rem 1rem;
          color: white;
        }
        .input-field:focus {
          outline: none;
          border-color: #3b82f6; /* primary */
        }
        .label {
          display: block;
          font-size: 0.875rem;
          font-weight: 500;
          color: #94a3b8; /* slate-400 */
          margin-bottom: 0.25rem;
        }
        .btn-primary {
          background-color: #3b82f6;
          color: white;
          font-weight: bold;
          padding: 0.75rem;
          border-radius: 0.5rem;
          transition: background-color 0.2s;
        }
        .btn-primary:hover { background-color: #2563eb; }
        .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
      `}</style>
    </div>
  );
}
