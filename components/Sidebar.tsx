"use client";
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Settings, PlusCircle, ChevronDown, 
  Hash, Layers, X, Loader2, 
  LogOut
} from 'lucide-react';
import { cn } from '@/utils/cn';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// --- VALIDATION SCHEMA ---
const workspaceSchema = z.object({
  name: z.string().min(2, "Workspace name is too short").max(25),
});

// --- CREATE WORKSPACE MODAL ---
function CreateWorkspaceModal({ isOpen, onClose, onSuccess }: { 
  isOpen: boolean, 
  onClose: () => void, 
  onSuccess: (data: any) => void 
}) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(workspaceSchema),
  });

  // Reset form when modal closes
  useEffect(() => { if (!isOpen) reset(); }, [isOpen, reset]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-[32px] shadow-2xl p-8 animate-in zoom-in-95 duration-300">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black text-zinc-900 tracking-tight">New Workspace</h2>
          <button onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-xl transition-all cursor-pointer"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit(onSuccess)} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Workspace Name</label>
            <input 
              {...register('name')}
              autoFocus
              className={cn(
                "w-full px-5 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-zinc-900 font-bold outline-none transition-all",
                errors.name ? "border-rose-500 ring-4 ring-rose-500/5" : "focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5"
              )}
              placeholder="e.g. Engineering Team"
            />
            {errors.name && <p className="text-[10px] font-black text-rose-500 uppercase ml-1">{errors.name.message}</p>}
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-zinc-800 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : "Create Workspace"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ... (CreateWorkspaceModal component stays exactly as you had it) ...

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentWorkSpaceId = searchParams.get('workSpace');
  
  const [isWorkSpacesOpen, setIsWorkSpacesOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const myWorkSpaces = [
    { id: 'design-team', name: 'Design Team', color: 'text-rose-500' },
    { id: 'marketing', name: 'Marketing', color: 'text-amber-500' },
    { id: 'dev-squad', name: 'Dev Squad', color: 'text-indigo-500' },
  ];

  const menuItems = [
    { icon: LayoutDashboard, label: 'My Library', href: '/note-books' },
    { icon: Settings, label: 'Settings', href: '/settings' },
  ];

  const handleLogout = () => {
    // Logic for logout here
    console.log("Logging out...");
  };

  return (
    <>
      <CreateWorkspaceModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={() => setIsModalOpen(false)} 
      />

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex w-72 h-screen sticky top-0 bg-zinc-50/50 border-r border-zinc-200/50 flex-col p-6 overflow-y-auto">
        {/* LOGO */}
        <div className="flex items-center gap-3 px-2 mb-10 shrink-0">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <Layers className="text-white" size={22} />
          </div>
          <span className="text-xl font-black tracking-tight text-zinc-900">ProNotes.</span>
        </div>

        {/* NAVIGATION AREA */}
        <nav className="flex-1 flex flex-col gap-8 min-h-0">
          <section className="space-y-1">
            <p className="px-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3">Menu</p>
            {menuItems.map((item) => {
              const isActive = pathname === item.href && !currentWorkSpaceId;
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

          <section className="space-y-1">
            <button 
              onClick={() => setIsWorkSpacesOpen(!isWorkSpacesOpen)}
              className="cursor-pointer w-full flex items-center justify-between px-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3 group hover:text-zinc-600 transition-colors"
            >
              <span>Workspaces</span>
              <ChevronDown size={14} className={cn("transition-transform duration-300", isWorkSpacesOpen ? "" : "-rotate-90")} />
            </button>

            {isWorkSpacesOpen && (
              <div className="space-y-1 animate-in slide-in-from-top-2 duration-300">
                {myWorkSpaces.map((workSpace) => {
                  const isActive = currentWorkSpaceId === workSpace.id;
                  return (
                    <Link 
                      key={workSpace.id} 
                      href={`/note-books?workSpace=${workSpace.id}`}
                      className={cn(
                        "group flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300",
                        isActive ? "bg-white text-zinc-900 shadow-sm ring-1 ring-zinc-200/50" : "text-zinc-500 hover:bg-zinc-100"
                      )}
                    >
                      <Hash size={18} className={cn("transition-colors", isActive ? workSpace.color : "text-zinc-300")} />
                      <span className="text-sm font-bold">{workSpace.name}</span>
                    </Link>
                  );
                })}
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="cursor-pointer w-full flex items-center gap-3 px-4 py-3 text-zinc-400 hover:text-indigo-600 transition-all rounded-2xl hover:bg-indigo-50/50 border border-dashed border-transparent hover:border-indigo-200 mt-2 group"
                >
                  <PlusCircle size={18} className="group-hover:rotate-90 transition-transform" />
                  <span className="text-xs font-black uppercase tracking-wider">Create New</span>
                </button>
              </div>
            )}
          </section>
        </nav>

        {/* BOTTOM USER PROFILE & LOGOUT */}
        <div className="mt-auto shrink-0 pt-6 space-y-4">
          <div className="flex items-center justify-between px-2 bg-zinc-100/50 p-4 rounded-[24px] border border-zinc-200/30">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 shrink-0 rounded-full bg-indigo-100 border-2 border-white shadow-sm flex items-center justify-center text-[10px] font-black text-indigo-600">
                AR
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-black text-zinc-900 truncate">Alex Rivera</p>
                <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-tighter">Pro Plan</p>
              </div>
            </div>
            
            <button 
              onClick={handleLogout}
              className="p-2 text-zinc-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all cursor-pointer group"
              title="Logout"
            >
              <LogOut size={18} className="group-hover:-translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </aside>

      {/* MOBILE BOTTOM NAV */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-zinc-200 px-6 py-3 flex justify-between items-center z-50">
        <Link href="/note-books" className={cn("p-3 rounded-2xl", pathname === '/note-books' && !currentWorkSpaceId ? "text-indigo-600 bg-indigo-50" : "text-zinc-400")}>
          <LayoutDashboard size={24} />
        </Link>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="cursor-pointer w-12 h-12 bg-zinc-900 text-white rounded-2xl flex items-center justify-center shadow-lg active:scale-95 transition-all"
        >
          <PlusCircle size={24} />
        </button>
        <button onClick={handleLogout} className="p-3 text-zinc-400 rounded-2xl hover:text-rose-500">
          <LogOut size={24} />
        </button>
      </nav>
    </>
  );
}