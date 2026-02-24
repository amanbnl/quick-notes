"use client";
import React from 'react';
import { ArrowLeft, Search, Layers } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-white/5 border border-white/10 rounded-[32px] mb-12 animate-pulse">
          <Search className="text-zinc-500" size={32} />
        </div>

        <h1 className="text-[120px] font-black tracking-tighter leading-none mb-4 opacity-20">404</h1>
        
        <div className="max-w-md mx-auto">
          <h2 className="text-3xl font-black tracking-tight mb-4">Node not found.</h2>
          <p className="text-zinc-400 font-medium mb-12 leading-relaxed">
            The knowledge node you are looking for has been moved, archived, or never existed in this workspace.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/" 
              className="flex items-center gap-2 px-8 py-4 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all active:scale-95"
            >
              <ArrowLeft size={16} /> Return to Base
            </Link>
            <button 
              onClick={() => window.location.reload()}
              className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all"
            >
              Retry Connection
            </button>
          </div>
        </div>
      </div>

      {/* Footer Identity */}
      <div className="absolute bottom-12 flex items-center gap-2 opacity-20">
        <Layers size={16} />
        <span className="text-[10px] font-black tracking-[0.3em] uppercase">ProNotes System OS</span>
      </div>
    </div>
  );
}