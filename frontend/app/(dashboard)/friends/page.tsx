"use client";
import React, { useState } from 'react';
import { Users, UserPlus, Search, MoreVertical, MessageSquare, ShieldCheck, Mail } from 'lucide-react';
import { cn } from '@/utils/cn';

export default function FriendsPage() {

  const friends = [
    { id: 1, name: "Sarah Jenkins", role: "Collaborator", status: "online", email: "sarah@design.com" },
    { id: 2, name: "Marcus Aurelius", role: "Viewer", status: "offline", email: "marcus@philosophy.org" },
    { id: 3, name: "Elena Rodriguez", role: "Admin", status: "online", email: "elena@tech.io" },
  ];

  return (
    <div className="max-w-[1200px] mx-auto py-6 lg:py-10 px-4 pb-24 lg:pb-10 animate-in fade-in duration-700">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-zinc-900 tracking-tighter">Collaboration Hub</h1>
          <p className="text-zinc-500 font-medium mt-1">Manage your professional network and workspace permissions.</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-6 py-3.5 bg-zinc-900 text-white rounded-[20px] font-bold hover:bg-zinc-800 transition-all active:scale-95 shadow-xl shadow-zinc-200">
          <UserPlus size={18} />
          <span>Invite Teammate</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Stats & Filters */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-zinc-200/60 rounded-[32px] p-6 shadow-sm">
            <h3 className="font-black text-zinc-900 mb-4 tracking-tight">Overview</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-indigo-50 rounded-2xl">
                <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">Total Friends</p>
                <p className="text-2xl font-black text-zinc-900">128</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Friends List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              className="w-full pl-12 pr-4 py-4 bg-white border border-zinc-200/60 rounded-[24px] outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all text-sm font-medium"
            />
          </div>

          <div className="space-y-3">
            {friends.map((friend) => (
              <div 
                key={friend.id}
                className="group flex items-center gap-4 p-4 bg-white border border-zinc-100 rounded-[28px] hover:shadow-md transition-all duration-300"
              >
                <div className="relative">
                  <div className="w-14 h-14 bg-zinc-100 rounded-2xl flex items-center justify-center text-zinc-400 font-bold">
                    {friend.name.charAt(0)}
                  </div>
                  <div className={cn(
                    "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-4 border-white",
                    friend.status === 'online' ? "bg-emerald-500" : "bg-zinc-300"
                  )} />
                </div>

                <div className="flex-1">
                  <h4 className="font-black text-zinc-900 text-sm tracking-tight">{friend.name}</h4>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-tighter flex items-center gap-1">
                      <Mail size={10} /> {friend.email}
                    </span>
                    <span className="text-[11px] font-bold text-indigo-500 uppercase tracking-tighter flex items-center gap-1">
                      <ShieldCheck size={10} /> {friend.role}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-3 text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all cursor-pointer">
                    <MessageSquare size={18} />
                  </button>
                  <button className="p-3 text-zinc-400 hover:bg-zinc-100 rounded-xl transition-all cursor-pointer">
                    <MoreVertical size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}