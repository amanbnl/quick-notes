"use client";
import React, { useState } from 'react';
import { 
  User, Briefcase, GraduationCap, Award, 
  Languages, Trash2, Plus, Camera, ChevronRight, ShieldAlert, Globe
} from 'lucide-react';
import { cn } from '@/utils/cn';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('identity');

  const tabs = [
    { id: 'identity', label: 'Identity', icon: User, desc: 'Personal info' },
    { id: 'skills', label: 'Languages', icon: Languages, desc: 'Communication' },
    { id: 'security', label: 'Security', icon: ShieldAlert, desc: 'Danger Zone' },
  ];

  return (
    <div className="max-w-[1200px] mx-auto py-6 px-4 pb-24 lg:pb-10 animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8 lg:mb-12">
        <div className="text-center sm:text-left">
          <h1 className="text-3xl lg:text-4xl font-black text-zinc-900 tracking-tighter">Profile Settings</h1>
          <p className="text-zinc-500 font-medium text-sm mt-1">Refine your professional identity.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none px-6 py-2.5 bg-white border border-zinc-200 text-zinc-600 rounded-2xl text-xs font-bold active:scale-95 transition-all cursor-pointer">Discard</button>
          <button className="flex-1 sm:flex-none px-6 py-2.5 bg-indigo-600 text-white rounded-2xl text-xs font-bold active:scale-95 shadow-lg shadow-indigo-100 cursor-pointer">Save Changes</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* NAV: Scrollable on mobile, Fixed on Desktop */}
        <div className="lg:col-span-4 flex lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-shrink-0 group flex items-center gap-4 px-5 py-4 rounded-[24px] transition-all duration-300 cursor-pointer active:scale-[0.98] text-left min-w-[160px] lg:min-w-full",
                activeTab === tab.id 
                  ? "bg-white shadow-xl shadow-zinc-200/50 border border-zinc-100" 
                  : "hover:bg-zinc-100/50"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                activeTab === tab.id ? "bg-indigo-600 text-white" : "bg-zinc-100 text-zinc-400 group-hover:text-zinc-900"
              )}>
                <tab.icon size={20} />
              </div>
              <div className="hidden lg:block">
                <p className={cn("font-black text-sm", activeTab === tab.id ? "text-zinc-900" : "text-zinc-500")}>{tab.label}</p>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">{tab.desc}</p>
              </div>
              <span className="lg:hidden font-bold text-xs">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* CONTENT */}
        <div className="lg:col-span-8 bg-white border border-zinc-200/60 rounded-[32px] lg:rounded-[40px] shadow-sm min-h-[500px]">
          <div className="p-6 lg:p-10">
            
            {/* 1. IDENTITY SECTION */}
            {activeTab === 'identity' && (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-zinc-50 rounded-[28px] border border-zinc-100">
                  <div className="relative group cursor-pointer">
                    <div className="w-24 h-24 rounded-[28px] bg-white shadow-xl flex items-center justify-center text-zinc-200 border-2 border-white group-hover:text-indigo-500 transition-colors">
                      <User size={40} />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center text-white border-2 border-white shadow-lg"><Camera size={14} /></div>
                  </div>
                  <div className="text-center sm:text-left">
                    <h4 className="font-black text-zinc-900 text-lg">Identity Photo</h4>
                    <p className="text-sm font-medium text-zinc-400 mb-4">Upload a professional headshot.</p>
                    <div className="flex gap-2 justify-center sm:justify-start">
                      <button className="px-4 py-2 bg-white text-zinc-900 rounded-xl text-xs font-black border border-zinc-200 hover:bg-zinc-50 transition-all cursor-pointer">Update</button>
                      <button className="px-4 py-2 text-red-500 rounded-xl text-xs font-black hover:bg-red-50 transition-all cursor-pointer">Remove</button>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-3 block">Professional Bio</label>
                  <textarea className="w-full bg-zinc-50 border-transparent focus:bg-white focus:border-indigo-200 focus:ring-4 focus:ring-indigo-500/5 rounded-[24px] p-5 text-zinc-900 text-sm font-medium transition-all outline-none leading-relaxed" rows={4} placeholder="Briefly describe your expertise..." />
                </div>
              </div>
            )}

            {/* 2. EXPERIENCE SECTION */}
            {activeTab === 'experience' && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-black text-zinc-900 tracking-tight">Work Experience</h3>
                  <button className="w-10 h-10 lg:w-auto lg:px-4 bg-zinc-900 text-white rounded-xl flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all cursor-pointer active:scale-95">
                    <Plus size={18} /> <span className="hidden lg:block text-xs font-black">Add New</span>
                  </button>
                </div>
                <div className="group flex items-center gap-4 p-5 rounded-[24px] border border-zinc-100 hover:border-indigo-200 transition-all">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center"><Briefcase size={20} /></div>
                  <div className="flex-1">
                    <p className="font-black text-zinc-900 text-sm">Product Designer</p>
                    <p className="text-[11px] font-bold text-zinc-400 uppercase">Apple • 2022 - Present</p>
                  </div>
                  <button className="p-2 text-zinc-300 hover:text-red-500 transition-colors cursor-pointer"><Trash2 size={18} /></button>
                </div>
              </div>
            )}

            {/* 3. SECURITY / DANGER ZONE */}
            {activeTab === 'security' && (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                <div className="p-8 bg-red-50/50 border border-red-100 rounded-[32px]">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-red-600 shadow-sm border border-red-100">
                      <ShieldAlert size={24} />
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-zinc-900 tracking-tight">Danger Zone</h4>
                      <p className="text-sm font-medium text-red-500/70">Deleting your account is irreversible. All your data will be wiped.</p>
                    </div>
                  </div>
                  <button className="w-full py-4 bg-white border border-red-200 text-red-600 rounded-2xl font-black text-sm hover:bg-red-600 hover:text-white transition-all cursor-pointer active:scale-95">
                    Permanently Delete Account
                  </button>
                </div>
              </div>
            )}

            {/* Placeholder for Education & Skills (Similar pattern) */}
            {(activeTab === 'education' || activeTab === 'skills') && (
              <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
                <Globe size={48} className="mb-4 text-zinc-300" />
                <p className="font-black text-zinc-400 uppercase tracking-widest">Coming to the Pitch soon</p>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}