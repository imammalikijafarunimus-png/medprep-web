import { BookOpen, Activity, Moon } from 'lucide-react';
import { useIslamicMode } from '../context/IslamicModeContext';

export default function Dashboard() {
  const { isIslamicMode } = useIslamicMode();

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-900 to-slate-900 rounded-2xl p-6 border border-slate-700">
        <h2 className="text-2xl font-bold mb-2">Siap untuk UKMPPD? 🩺</h2>
        <p className="text-slate-300">Progress kamu minggu ini sangat bagus.</p>
      </div>

      {/* Grid Menu */}
      <div className="grid grid-cols-2 gap-4">
        <div className="card hover:border-blue-500 cursor-pointer">
          <div className="p-2 bg-blue-500/10 w-fit rounded-lg text-blue-500 mb-2">
            <BookOpen />
          </div>
          <h3 className="font-semibold">Materi</h3>
        </div>

        <div className="card hover:border-purple-500 cursor-pointer">
          <div className="p-2 bg-purple-500/10 w-fit rounded-lg text-purple-500 mb-2">
            <Activity />
          </div>
          <h3 className="font-semibold">OSCE</h3>
        </div>

        {/* LOGIC ISLAMIC TOGGLE DISINI */}
        {isIslamicMode ? (
          <div className="card border-islamic/50 bg-islamic/5 cursor-pointer">
            <div className="p-2 bg-islamic/20 w-fit rounded-lg text-islamic mb-2">
              <Moon />
            </div>
            <h3 className="font-semibold text-islamic">Doa & Adab</h3>
            <p className="text-xs text-islamic/80">Fiqih Medis</p>
          </div>
        ) : (
          <div className="card hover:border-orange-500 cursor-pointer">
            <div className="p-2 bg-orange-500/10 w-fit rounded-lg text-orange-500 mb-2">
              <Activity />
            </div>
            <h3 className="font-semibold">Statistik</h3>
          </div>
        )}
      </div>
    </div>
  );
}
