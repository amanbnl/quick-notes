"use client";
import React, { useState } from 'react';
import { 
  LayoutDashboard, StickyNote, Users, Settings, 
  PlusCircle, ChevronDown, Hash, Layers 
} from 'lucide-react';
import { cn } from '@/utils/cn';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentGroupId = searchParams.get('group');
  
  const [isGroupsOpen, setIsGroupsOpen] = useState(true);

  // Mock Data - In future, this comes from your DB
  const myGroups = [
    { id: 'design-team', name: 'Design Team', color: 'text-rose-500' },
    { id: 'marketing', name: 'Marketing', color: 'text-amber-500' },
    { id: 'dev-squad', name: 'Dev Squad', color: 'text-indigo-500' },
  ];

  const menuItems = [
    { icon: LayoutDashboard, label: 'My Library', href: '/' }, // Root is now the personal dashboard
    { icon: Users, label: 'Friends', href: '/friends' },
    { icon: Settings, label: 'Settings', href: '/profile' },
  ];

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex w-72 h-screen sticky top-0 bg-zinc-50/50 border-r border-zinc-200/50 flex-col p-6">
        <div className="flex items-center gap-3 px-2 mb-10">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <Layers className="text-white" size={22} />
          </div>
          <span className="text-xl font-black tracking-tight text-zinc-900">ProNotes.</span>
        </div>

        <nav className="flex-1 flex flex-col gap-8">
          {/* Main Links */}
          <section className="space-y-1">
            <p className="px-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3">Menu</p>
            {menuItems.map((item) => {
              const isActive = pathname === item.href && !currentGroupId;
              return (
                <Link key={item.label} href={item.href} className={cn(
                  "group flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300",
                  isActive ? "bg-white text-indigo-600 shadow-sm ring-1 ring-zinc-200/50" : "text-zinc-500 hover:bg-zinc-100"
                )}>
                  <item.icon size={18} />
                  <span className="text-sm font-bold">{item.label}</span>
                </Link>
              );
            })}
          </section>

          {/* GROUPS ACCORDION */}
          <section className="space-y-1">
            <button 
              onClick={() => setIsGroupsOpen(!isGroupsOpen)}
              className="cursor-pointer w-full flex items-center justify-between px-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3 group hover:text-zinc-600 transition-colors"
            >
              <span>Workspaces</span>
              <ChevronDown size={14} className={cn("transition-transform duration-300", isGroupsOpen ? "" : "-rotate-90")} />
            </button>

            {isGroupsOpen && (
              <div className="space-y-1 animate-in slide-in-from-top-2 duration-300">
                {myGroups.map((group) => {
                  const isActive = currentGroupId === group.id;
                  return (
                    <Link 
                      key={group.id} 
                      href={`/?group=${group.id}`}
                      className={cn(
                        "group flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300",
                        isActive ? "bg-white text-zinc-900 shadow-sm ring-1 ring-zinc-200/50" : "text-zinc-500 hover:bg-zinc-100"
                      )}
                    >
                      <Hash size={18} className={cn("transition-colors", isActive ? group.color : "text-zinc-300")} />
                      <span className="text-sm font-bold">{group.name}</span>
                    </Link>
                  );
                })}
                <button className="w-full flex items-center gap-3 px-4 py-3 text-zinc-400 hover:text-indigo-600 transition-colors rounded-2xl hover:bg-indigo-50/50 border border-dashed border-transparent hover:border-indigo-200 mt-2">
                  <PlusCircle size={18} />
                  <span className="text-xs font-black uppercase tracking-wider">New Group</span>
                </button>
              </div>
            )}
          </section>
        </nav>

        {/* User Mini Profile */}
        <div className="mt-auto pt-6 border-t border-zinc-200/50">
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-full bg-zinc-200 border-2 border-white shadow-sm" />
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-black text-zinc-900 truncate">Alex Rivera</p>
              <p className="text-[10px] font-bold text-zinc-400 uppercase">Pro Plan</p>
            </div>
          </div>
        </div>
      </aside>

      {/* MOBILE BOTTOM NAV - Adjusted for the Group Logic */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-zinc-200 px-6 py-3 flex justify-between items-center z-50">
        <Link href="/" className={cn("p-3 rounded-2xl", pathname === '/' && !currentGroupId ? "text-indigo-600 bg-indigo-50" : "text-zinc-400")}>
          <LayoutDashboard size={24} />
        </Link>
        <Link href="/friends" className={cn("p-3 rounded-2xl", pathname === '/friends' ? "text-indigo-600 bg-indigo-50" : "text-zinc-400")}>
          <Users size={24} />
        </Link>
        <button className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center text-white shadow-lg active:scale-95 transition-all">
          <PlusCircle size={24} />
        </button>
        <Link href="/profile" className={cn("p-3 rounded-2xl", pathname === '/profile' ? "text-indigo-600 bg-indigo-50" : "text-zinc-400")}>
          <Settings size={24} />
        </Link>
      </nav>
    </>
  );
}