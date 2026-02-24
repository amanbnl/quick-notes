"use client";
import React, { useState, useRef, useEffect } from 'react';
import {
  Plus, Folder, Search, MoreHorizontal, ArrowUpRight,
  Users, Lock, Edit2, Copy, Trash2, Archive
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useRouter, useSearchParams } from 'next/navigation';

export default function NotesDashboard () {
  const searchParams = useSearchParams();
  const groupId = searchParams.get('group');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const router = useRouter()
  const isGroupView = !!groupId;
  const displayTitle = isGroupView ? `${groupId.replace('-', ' ')}` : "My Collections";

  const notebooks = [
    { id: '1', name: "Product Strategy", notes: 12, color: "bg-indigo-500", tag: "Work", isPrivate: false },
    { id: '2', name: "Meeting Minutes", notes: 45, color: "bg-emerald-500", tag: "Company", isPrivate: false },
    { id: '3', name: "Personal Growth", notes: 8, color: "bg-amber-500", tag: "Private", isPrivate: true },
  ];

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    if (openMenuId) {
      window.addEventListener('click', handleClickOutside);
    }
    return () => window.removeEventListener('click', handleClickOutside);
  }, [openMenuId]);

  const openNoteBookDetails = () => {
    router.push("/notes/sfasfswag")
  }
  return (
    <div className="max-w-[1400px] mx-auto py-6 lg:py-10 px-4 pb-24 lg:pb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">

      <header className="flex flex-col gap-6 mb-10 lg:mb-16">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={cn("w-2 h-2 rounded-full animate-pulse", isGroupView ? "bg-indigo-600" : "bg-emerald-500")} />
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">
                {isGroupView ? 'Shared Workspace' : 'Personal Library'}
              </p>
            </div>
            <h1 className="text-3xl lg:text-5xl font-black text-zinc-900 tracking-tighter capitalize">
              {displayTitle}
            </h1>
          </div>

          <button className="group flex items-center justify-center gap-2 px-6 py-4 bg-zinc-900 text-white rounded-[20px] font-bold hover:bg-zinc-800 transition-all cursor-pointer active:scale-95 shadow-xl shadow-zinc-200 w-full sm:w-auto">
            <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
            <span>{isGroupView ? 'Add Group Note' : 'Create Notebook'}</span>
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
            <input
              type="text"
              placeholder={`Search in ${displayTitle}...`}
              className="w-full pl-12 pr-4 py-4 bg-white border border-zinc-200/60 rounded-[20px] text-sm font-medium focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all shadow-sm"
            />
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10">
        {notebooks.map((notebook) => (
          <div
            key={notebook.id}
            onClick={openNoteBookDetails}
            className="group relative bg-white border border-zinc-200/50 rounded-[32px] lg:rounded-[40px] p-6 lg:p-8 hover:shadow-[0_40px_80px_-12px_rgba(0,0,0,0.08)] transition-all duration-500 cursor-pointer border-b-4 active:translate-y-0.5 active:border-b-0 overflow-visible"
            style={{ borderBottomColor: `var(--zinc-200)` }}
          >
            <div className="flex justify-between items-start mb-10 relative">
              <div className={cn("w-14 h-14 lg:w-16 lg:h-16 rounded-2xl flex items-center justify-center text-white shadow-xl transform group-hover:rotate-6 transition-transform", notebook.color)}>
                {isGroupView ? <Users size={28} /> : <Folder size={28} />}
              </div>

              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent opening the notebook
                    setOpenMenuId(openMenuId === notebook.id ? null : notebook.id);
                  }}
                  className="p-2 text-zinc-300 hover:text-zinc-900 hover:bg-zinc-50 rounded-xl transition-all cursor-pointer"
                >
                  <MoreHorizontal size={24} />
                </button>

                {/* DROPDOWN MENU */}
                {openMenuId === notebook.id && (
                  <div className="absolute right-0 mt-2 w-48 bg-white/95  border border-zinc-200 shadow-2xl rounded-2xl p-2 z-1 animate-in fade-in zoom-in-95 duration-200">
                    <button className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-zinc-600 hover:bg-zinc-50 rounded-xl transition-all cursor-pointer group/item">
                      <Edit2 size={14} className="group-hover/item:text-indigo-600" /> Rename
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-zinc-600 hover:bg-zinc-50 rounded-xl transition-all cursor-pointer group/item">
                      <Copy size={14} className="group-hover/item:text-indigo-600" /> Duplicate
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-zinc-600 hover:bg-zinc-50 rounded-xl transition-all cursor-pointer group/item">
                      <Archive size={14} className="group-hover/item:text-indigo-600" /> Archive
                    </button>
                    <div className="h-[1px] bg-zinc-100 my-1" />
                    <button className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-rose-500 hover:bg-rose-50 rounded-xl transition-all cursor-pointer">
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="relative">
              <h3 className="text-2xl lg:text-3xl font-black text-zinc-900 mb-2 tracking-tighter group-hover:text-indigo-600 transition-colors">
                {notebook.name}
              </h3>
              <p className="text-sm font-bold text-zinc-400">{notebook.notes} Notes</p>
            </div>

            <div className="mt-12 flex items-center justify-between relative">
              <div className="flex -space-x-3">
                {[1, 2].map(i => (
                  <div key={i} className="w-9 h-9 rounded-full border-4 border-white bg-zinc-100 text-[10px] font-black flex items-center justify-center text-zinc-400 group-hover:border-zinc-50 transition-colors">
                    U{i}
                  </div>
                ))}
              </div>
              <div className="w-12 h-12 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-400 group-hover:bg-zinc-900 group-hover:text-white transition-all duration-500 shadow-sm">
                <ArrowUpRight size={24} />
              </div>
            </div>
          </div>
        ))}

        <button className="border-4 border-dashed border-zinc-100 rounded-[40px] p-8 flex flex-col items-center justify-center gap-4 text-zinc-300 hover:border-indigo-200 hover:bg-indigo-50/30 hover:text-indigo-500 transition-all cursor-pointer active:scale-95 min-h-[300px]">
          <Plus size={32} />
          <span className="font-black text-lg tracking-tight">New Collection</span>
        </button>
      </div>
    </div>
  );
}