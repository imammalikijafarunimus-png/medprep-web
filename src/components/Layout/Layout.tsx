import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import MobileNav from './MobileNav';

export default function Layout() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30">
      
      {/* === AMBIENT BACKGROUND GLOW (Global untuk semua halaman App) === */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
         <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[128px]"></div>
         <div className="absolute bottom-[-10%] right-[10%] w-[600px] h-[600px] bg-indigo-900/10 rounded-full blur-[128px]"></div>
      </div>

      <Sidebar />
      
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72 relative z-10">
        <Header />
        
        {/* Main Content Area */}
        <main className="flex-1 pt-24 pb-24 px-4 lg:px-8 max-w-7xl mx-auto w-full">
          <Outlet /> 
        </main>
      </div>

      <MobileNav />
    </div>
  );
}