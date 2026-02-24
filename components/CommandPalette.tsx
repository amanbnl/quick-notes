"use client";
import React, { useEffect, useState } from 'react';
import { Search, FileText, Users, Settings, Plus, Command } from 'lucide-react';
import { cn } from '@/utils/cn';

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');

  // Listen for Cmd+K or Ctrl+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  if (!isOpen) return null;

  const results = [
    { icon: FileText, label: 'Product Roadmap 2026', category: 'Recent Notes' },
    { icon: FileText, label: 'Marketing Brainstorm', category: 'Recent Notes' },
    { icon: Users, label: 'Invite Sarah Jenkins', category: 'Actions' },
    { icon: Plus, label: 'Create New Notebook', category: 'Actions' },
    { icon: Settings, label: 'Account Settings', category: 'System' },
  ].filter(item => item.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh] p-4 sm:p-6">
      <div className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsOpen(false)} />
      
      <div className="relative w-full max-w-2xl bg-white rounded-[32px] shadow-[0_32px_128px_-12px_rgba(0,0,0,0.3)] border border-zinc-200 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Search Input */}
        <div className="flex items-center px-6 py-5 border-b border-zinc-100">
          <Search className="text-zinc-400 mr-4" size={22} />
          <input 
            autoFocus
            placeholder="Search notes, actions, or people..."
            className="flex-1 bg-transparent border-none outline-none text-zinc-900 font-bold text-lg placeholder:text-zinc-200"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="flex items-center gap-1 px-2 py-1 bg-zinc-100 rounded-lg border border-zinc-200">
            <span className="text-[10px] font-black text-zinc-400">ESC</span>
          </div>
        </div>

        {/* Results List */}
        <div className="max-h-[400px] overflow-y-auto p-3 custom-scrollbar">
          {results.length > 0 ? (
            results.map((item, index) => (
              <div 
                key={index}
                className="group flex items-center justify-between p-4 rounded-2xl hover:bg-indigo-50 cursor-pointer transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-zinc-50 rounded-xl flex items-center justify-center text-zinc-400 group-hover:bg-white group-hover:text-indigo-600 group-hover:shadow-sm transition-all">
                    <item.icon size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-black text-zinc-900 group-hover:text-indigo-900">{item.label}</p>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{item.category}</p>
                  </div>
                </div>
                <Command size={14} className="text-zinc-200 group-hover:text-indigo-300" />
              </div>
            ))
          ) : (
            <div className="py-12 text-center">
              <p className="text-sm font-bold text-zinc-400">No results found for &apos;{query}&apos;</p>
            </div>
          )}
        </div>

        {/* Footer Hint */}
        <div className="px-6 py-3 bg-zinc-50 border-t border-zinc-100 flex gap-4">
          <div className="flex items-center gap-1 text-[10px] font-bold text-zinc-400 uppercase">
            <span className="p-1 bg-white border border-zinc-200 rounded text-[8px]">↑↓</span> to navigate
          </div>
          <div className="flex items-center gap-1 text-[10px] font-bold text-zinc-400 uppercase">
            <span className="p-1 bg-white border border-zinc-200 rounded text-[8px]">ENTER</span> to select
          </div>
        </div>
      </div>
    </div>
  );
}