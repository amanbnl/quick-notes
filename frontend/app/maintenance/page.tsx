"use client";
import React from 'react';
import { Settings, Zap, Layers, RefreshCw } from 'lucide-react';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background Effect */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[400px] bg-indigo-600/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="relative z-10 text-center">
        <div className="relative inline-flex mb-12">
          <div className="w-24 h-24 bg-zinc-900 border border-white/10 rounded-[40px] flex items-center justify-center">
            <Settings className="text-indigo-500 animate-[spin_8s_linear_infinite]" size={40} />
          </div>
          <div className="absolute -top-2 -right-2 w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center shadow-2xl animate-bounce">
            <Zap className="text-white" size={16} fill="currentColor" />
          </div>
        </div>

        <div className="max-w-xl mx-auto">
          <p className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.4em] mb-4">Status: Maintenance</p>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">Optimizing the <br/>Knowledge Engine.</h1>
          
          <p className="text-zinc-400 font-medium mb-12 leading-relaxed">
            We're currently performing a scheduled architectural update to ensure 50ms sync speeds. We'll be back online in a few minutes.
          </p>

          <button 
            onClick={() => reset()}
            className="cursor-pointer group inline-flex items-center gap-3 px-10 py-5 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all active:scale-95 shadow-2xl shadow-white/5"
          >
            <RefreshCw size={18} className="group-active:rotate-180 transition-transform duration-500" />
            Re-Initialize System
          </button>
        </div>
      </div>

      <div className="absolute bottom-12 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">
        System Core: v2.0.4-stable
      </div>
    </div>
  );
}