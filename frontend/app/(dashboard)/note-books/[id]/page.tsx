"use client";
import React, { useState, useEffect } from 'react';
import {
  Share2, MoreHorizontal, ChevronLeft,
  Calendar, Layout, Menu, X, Save, Check, Cloud
} from 'lucide-react';
import { cn } from '@/utils/cn';
import Editor from '@/components/Editor';
import ShareModal from '@/components/modals/ShareModal';
import { useRouter } from 'next/navigation';

export default function NoteEditorPage() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [openShareModal, setOpenShareModal] = useState(false);
  const [noteTitle, setNoteTitle] = useState("Product Roadmap Q1");
  const [isSaving, setIsSaving] = useState(false);
const router = useRouter();
  // Mock auto-save effect
  useEffect(() => {
    const timer = setTimeout(() => setIsSaving(false), 1000);
    return () => clearTimeout(timer);
  }, [noteTitle]);

  return (
    <div className="relative flex h-[calc(100vh-110px)] gap-4 lg:gap-6 animate-in zoom-in-95 duration-500 overflow-hidden">

      {/* 1. SIDEBAR (Note List) */}
      <div className={cn(
        "absolute lg:relative z-40 w-70 sm:w-[320px] h-full transition-all duration-500 ease-in-out",
        "bg-zinc-50/50 backdrop-blur-xl border border-zinc-200/50 rounded-4xl lg:rounded-[40px] p-4 flex flex-col shrink-0",
        isSidebarOpen ? "left-0 shadow-2xl" : "-left-full lg:left-0 shadow-sm"
      )}>
        <div className="flex items-center justify-between px-4 py-3 mb-4">
          <div className="flex items-center gap-3">
            <ChevronLeft onClick={() => router.back()} className="text-zinc-400 cursor-pointer hover:text-indigo-600 transition-colors" size={20} />
            <h2 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Strategy</h2>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 text-zinc-400 hover:bg-zinc-100 rounded-xl">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 space-y-1 overflow-y-auto px-1 custom-scrollbar">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className={cn(
              "p-4 rounded-3xl cursor-pointer transition-all duration-200 group",
              i === 1 ? "bg-white shadow-sm ring-1 ring-zinc-200" : "hover:bg-zinc-100/50 text-zinc-500"
            )}>
              <h4 className={cn("font-bold text-xs mb-1 truncate", i === 1 ? "text-indigo-600" : "text-zinc-700")}>
                {i === 1 ? noteTitle : `Product Roadmap Q${i}`}
              </h4>
              <p className="text-[9px] font-bold opacity-40 uppercase tracking-tighter">Modified 2h ago</p>
            </div>
          ))}
        </div>
      </div>

      {/* 2. MAIN EDITOR AREA */}
      <div className="flex-1 bg-white border border-zinc-200/50 rounded-4xl lg:rounded-[40px] flex flex-col overflow-hidden shadow-sm relative">

        {/* --- DYNAMIC HEADER WITH TITLE --- */}
        <header className="px-6 lg:px-10 py-4 border-b border-zinc-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-4 lg:gap-8 flex-1">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2.5 bg-zinc-100 text-zinc-600 rounded-xl active:scale-90 transition-all">
              <Menu size={20} />
            </button>
            
            {/* Title & Metadata Group */}
            <div className="flex flex-col flex-1 max-w-lg">
              <input 
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                className="bg-transparent border-none focus:outline-none text-base lg:text-lg font-black text-zinc-900 tracking-tight placeholder:text-zinc-200"
                placeholder="Untitled Note"
              />
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
                  <Calendar size={10} /> Feb 10
                </div>
                <div className="w-1 h-1 rounded-full bg-zinc-200" />
                <div className="flex items-center gap-1.5 text-[9px] font-bold text-indigo-600 uppercase tracking-widest">
                  {isSaving ? (
                    <span className="flex items-center gap-1 text-amber-500 animate-pulse">
                      <Cloud size={10} /> Saving...
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-emerald-500">
                      <Check size={10} /> Saved
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 lg:gap-3">
            <button onClick={() => setOpenShareModal(true)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 cursor-pointer">
              <Share2 size={14} /><span className="hidden md:block">Share</span>
            </button>
            <button className="p-2 text-zinc-400 hover:bg-zinc-100 rounded-xl transition-all cursor-pointer">
              <MoreHorizontal size={20} />
            </button>
          </div>
        </header>

        {/* --- PURE WRITING AREA --- */}
        <div className="flex-1 overflow-y-auto custom-scrollbar scroll-smooth">
          {/* Note Title has moved to Header - Content starts immediately */}
          <Editor />
        </div>

        {/* Mobile Quick Save */}
        <button className="lg:hidden absolute bottom-6 right-6 w-14 h-14 bg-zinc-900 text-white rounded-2xl shadow-2xl flex items-center justify-center active:scale-90 transition-all z-10">
          <Save size={24} />
        </button>
      </div>

      {/* Mobile Backdrop */}
      {isSidebarOpen && <div onClick={() => setSidebarOpen(false)} className="lg:hidden fixed inset-0 bg-zinc-900/10 backdrop-blur-sm z-30" />}
      
      {openShareModal && (
        <ShareModal
          isOpen={openShareModal}
          onClose={() => setOpenShareModal(false)}
          context="workspace"
        />
      )}
    </div>
  );
}