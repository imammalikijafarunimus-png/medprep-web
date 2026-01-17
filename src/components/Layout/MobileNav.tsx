import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Brain, Stethoscope, Zap, User } from 'lucide-react'; // Ganti BookOpen dengan Brain

const navItems = [
  { icon: Home, label: 'Home', path: '/app' },
  { icon: Brain, label: 'CBT', path: '/app/cbt' }, // Update path ke CBT Center
  { icon: Stethoscope, label: 'OSCE', path: '/app/osce' },
  { icon: Zap, label: 'Drill', path: '/app/flashcards' },
  { icon: User, label: 'Akun', path: '/app/profile' },
];

export default function MobileNav() {
  const location = useLocation();
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-slate-950/90 backdrop-blur-xl border-t border-slate-800 pb-safe z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          // Logic active state sederhana untuk mobile
          const isActive = location.pathname === item.path || (item.path !== '/app' && location.pathname.startsWith(item.path));
          return (
            <Link key={item.path} to={item.path} className="flex flex-col items-center justify-center w-full h-full group">
              <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-blue-500/20 text-blue-400' : 'text-slate-500 group-hover:text-slate-300'}`}>
                <item.icon size={20} />
              </div>
              <span className={`text-[10px] mt-1 font-medium ${isActive ? 'text-blue-400' : 'text-slate-500'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}