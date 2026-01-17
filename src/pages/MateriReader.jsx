import { ArrowLeft, BookOpen, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useIslamicMode } from '../context/IslamicModeContext';

export default function MateriReader() {
  const { isIslamicMode } = useIslamicMode();

  return (
    <div className="max-w-3xl mx-auto pb-20">
      {/* Header Navigasi */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          to="/app"
          className="p-2 hover:bg-slate-800 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </Link>
        <div>
          <span className="text-xs font-bold text-primary uppercase tracking-wider">
            Sistem Reproduksi
          </span>
          <h1 className="text-2xl font-bold">
            Kontrasepsi & Keluarga Berencana
          </h1>
        </div>
      </div>

      {/* Konten Materi */}
      <div className="space-y-6 text-slate-300 leading-relaxed">
        {/* Blok Medis 1 */}
        <section className="bg-surface p-6 rounded-xl border border-slate-700">
          <h2 className="text-xl font-bold text-white mb-3">Definisi</h2>
          <p>
            Kontrasepsi adalah metode atau alat yang digunakan untuk mencegah
            kehamilan. Tujuannya adalah merencanakan kehamilan, mengatur jarak
            kelahiran, dan mencegah kehamilan yang tidak diinginkan.
          </p>
        </section>

        {/* --- FITUR UNGGULAN: ISLAMIC INSIGHT CARD --- */}
        {/* Card ini HANYA MUNCUL jika Mode Islam ON */}
        {isIslamicMode && (
          <div className="bg-islamic/5 border border-islamic/30 p-6 rounded-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-islamic/20 rounded-lg text-islamic shrink-0">
                <BookOpen size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-islamic mb-1">
                  Insight Fiqih: Hukum Kontrasepsi
                </h3>
                <p className="text-sm text-islamic/80 italic mb-2">
                  "Dan hendaklah takut kepada Allah orang-orang yang seandainya
                  meninggalkan di belakang mereka anak-anak yang lemah..." (QS.
                  An-Nisa: 9)
                </p>
                <p className="text-slate-300 text-sm">
                  Dalam perspektif fiqih, kontrasepsi diperbolehkan (mubah)
                  dengan niat <strong>Tanzim an-Nasl</strong> (mengatur jarak
                  kelahiran) demi kesehatan ibu dan anak. Haram hukumnya jika
                  niatnya <strong>Tahdid an-Nasl</strong> (memutus keturunan
                  secara permanen) tanpa alasan medis syar'i.
                </p>
                <div className="mt-3 text-xs bg-islamic/10 text-islamic px-2 py-1 rounded inline-block">
                  Rujukan: Fatwa MUI & Majelis Tarjih
                </div>
              </div>
            </div>
          </div>
        )}
        {/* ------------------------------------------- */}

        {/* Blok Medis 2 */}
        <section className="bg-surface p-6 rounded-xl border border-slate-700">
          <h2 className="text-xl font-bold text-white mb-3">
            Jenis-Jenis Kontrasepsi
          </h2>
          <ul className="space-y-4">
            <li className="flex gap-3">
              <span className="bg-blue-500/20 text-blue-400 w-6 h-6 flex items-center justify-center rounded-full text-sm font-bold shrink-0">
                1
              </span>
              <div>
                <strong className="text-white">Hormonal</strong>
                <p className="text-sm mt-1">
                  Pil KB, Suntik (1 bulan/3 bulan), Implan. Bekerja dengan
                  menekan ovulasi atau mengentalkan lendir serviks.
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="bg-blue-500/20 text-blue-400 w-6 h-6 flex items-center justify-center rounded-full text-sm font-bold shrink-0">
                2
              </span>
              <div>
                <strong className="text-white">Non-Hormonal</strong>
                <p className="text-sm mt-1">
                  IUD Tembaga (Spiral), Kondom. IUD bekerja dengan memblokir
                  sperma masuk ke rahim (spermicidal effect).
                </p>
              </div>
            </li>
          </ul>
        </section>

        {/* Alert Medis */}
        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg flex gap-3">
          <AlertCircle className="text-red-500 shrink-0" />
          <div className="text-sm text-red-200">
            <strong>Kontraindikasi Mutlak:</strong> Jangan berikan Pil Kombinasi
            pada pasien dengan riwayat Hipertensi, Stroke, atau Kanker Payudara.
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 lg:right-12">
        <button className="bg-primary hover:bg-blue-600 text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-blue-500/30 flex items-center gap-2 transition-all hover:scale-105">
          Latihan Soal Topik Ini
        </button>
      </div>
    </div>
  );
}
