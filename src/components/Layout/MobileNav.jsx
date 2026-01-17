import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, Stethoscope, Zap, User } from 'lucide-react';

const navItems = [
  { icon: Home, label: 'Home', path: '/app' },
  { icon: BookOpen, label: 'Materi', path: '/app/materi' },
  { icon: Stethoscope, label: 'OSCE', path: '/app/osce' },
  { icon: Zap, label: 'Drill', path: '/app/flashcards' },
  { icon: User, label: 'Akun', path: '/app/profile' },
];

export default function MobileNav() {
  const location = useLocation();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-slate-700 pb-2 z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center w-full h-full ${
                isActive ? 'text-primary' : 'text-slate-500'
              }`}
            >
              <item.icon size={24} />
              <span className="text-[10px] mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
