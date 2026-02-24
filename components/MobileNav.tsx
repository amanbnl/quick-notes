// components/MobileNav.tsx
"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, FileText, Users, User } from 'lucide-react';
import { cn } from '@/utils/cn';

export default function MobileNav() {
  const pathname = usePathname();

  const navItems = [
    { icon: Home, label: 'Home', path: '/notes' },
    { icon: FileText, label: 'Editor', path: '/notes/1' }, // Dummy ID for demo
    { icon: Users, label: 'Friends', path: '/friends' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-zinc-100 px-6 py-3 z-50 flex justify-between items-center pb-8">
      {navItems.map((item) => {
        const isActive = pathname === item.path;
        return (
          <Link 
            key={item.path} 
            href={item.path}
            className={cn(
              "flex flex-col items-center gap-1 transition-all active:scale-90",
              isActive ? "text-indigo-600" : "text-zinc-400"
            )}
          >
            <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
            <span className="text-[10px] font-black uppercase tracking-tighter">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}