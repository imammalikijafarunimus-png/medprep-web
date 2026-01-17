import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import MobileNav from './MobileNav'; // <--- Pastikan baris ini tidak error

export default function Layout() {
  return (
    <div className="min-h-screen bg-dark text-white flex">
      {/* Sidebar Desktop */}
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <Header />

        {/* Konten Utama (Outlet) */}
        <main className="flex-1 pt-20 pb-24 px-4 lg:pl-72 lg:px-8 max-w-7xl mx-auto w-full overflow-x-hidden">
          <Outlet />
        </main>
      </div>

      {/* Navigasi Mobile */}
      <MobileNav />
    </div>
  );
}
