"use client";
import React, { useState } from 'react';
import { X, Mail, ChevronDown, Shield, Globe, Link as LinkIcon, Check } from 'lucide-react';
import { cn } from '@/utils/cn';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  context: "note" | "notebook" | "workspace";
}

export default function ShareModal({ isOpen, onClose, context }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-zinc-900/40 backdrop-blur-md animate-in fade-in duration-300" 
        onClick={onClose} 
      />
      
      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-white rounded-t-[32px] sm:rounded-[40px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] p-6 sm:p-10 animate-in slide-in-from-bottom-10 duration-500">
        
        {/* Handle for Mobile dragging visual */}
        <div className="w-12 h-1.5 bg-zinc-100 rounded-full mx-auto mb-6 sm:hidden" />

        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-zinc-900 tracking-tighter">Share {context}</h2>
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-1">Manage Permissions</p>
          </div>
          <button onClick={onClose} className="p-2 text-zinc-400 hover:bg-zinc-100 rounded-xl transition-all">
            <X size={20} />
          </button>
        </div>

        {/* Invite Input Section */}
        <div className="space-y-4 mb-8">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1 group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
              <input 
                type="email" 
                placeholder="Add people by email..." 
                className="w-full pl-12 pr-4 py-4 bg-zinc-50 border-none rounded-[20px] text-sm font-medium focus:ring-4 focus:ring-indigo-500/5 focus:bg-white transition-all outline-none"
              />
            </div>
            <button className="px-6 py-4 bg-zinc-900 text-white rounded-[20px] font-black text-xs hover:bg-zinc-800 transition-all active:scale-95 shadow-lg shadow-zinc-200">
              Invite
            </button>
          </div>
        </div>

        {/* Access List */}
        <div className="space-y-4 mb-10">
          <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl border border-zinc-100/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-zinc-400 border border-zinc-100 shadow-sm">
                <Globe size={18} />
              </div>
              <div>
                <p className="text-sm font-black text-zinc-900">Anyone with the link</p>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">Private by default</p>
              </div>
            </div>
            <button className="flex items-center gap-1 text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-all">
              CHANGE <ChevronDown size={12} />
            </button>
          </div>
        </div>

        {/* Footer / Link Section */}
        <div className="flex items-center gap-3 pt-6 border-t border-zinc-100">
          <button 
            onClick={handleCopy}
            className="flex-1 flex items-center justify-center gap-2 py-4 bg-white border border-zinc-200 rounded-2xl text-xs font-black text-zinc-600 hover:bg-zinc-50 transition-all active:scale-95"
          >
            {copied ? <Check size={16} className="text-emerald-500" /> : <LinkIcon size={16} />}
            {copied ? "Copied!" : "Copy Private Link"}
          </button>
          <button className="w-14 h-14 flex items-center justify-center bg-zinc-100 text-zinc-400 rounded-2xl hover:text-zinc-900 transition-all">
            <Shield size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}