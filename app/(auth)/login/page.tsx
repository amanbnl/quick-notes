"use client";
import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, Layers } from 'lucide-react';
import { cn } from '@/utils/cn';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white selection:bg-indigo-100">
      
      {/* LEFT SIDE: BRAND/VISUAL - Only visible on Desktop */}
      <div className="hidden lg:flex bg-zinc-900 p-12 flex-col justify-between relative overflow-hidden">
        {/* Abstract Glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/20 blur-[120px] rounded-full -mr-48 -mt-48 pointer-events-none" />
        
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-2xl">
            <Layers className="text-white" size={22} />
          </div>
          <span className="text-2xl font-black text-white tracking-tight">ProNotes.</span>
        </div>

        <div className="relative z-10">
          <h1 className="text-6xl font-black text-white tracking-tighter leading-[0.9] mb-8">
            The workspace <br /> 
            for <span className="text-indigo-500">high-output</span> <br /> 
            teams.
          </h1>
          <p className="text-zinc-400 text-lg font-medium max-w-md leading-relaxed">
            Consolidate your team's knowledge in a workspace that is as fast as you think.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-6">
          <div className="flex -space-x-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-10 h-10 rounded-full border-4 border-zinc-900 bg-zinc-800" />
            ))}
          </div>
          <p className="text-zinc-500 text-xs font-black uppercase tracking-widest">
            Trusted by elite teams globally
          </p>
        </div>
      </div>

      {/* RIGHT SIDE: AUTH FORM */}
      <div className="flex items-center justify-center p-8 sm:p-12 lg:p-20 bg-zinc-50/30">
        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          <div className="mb-10">
            <h2 className="text-4xl font-black text-zinc-900 tracking-tighter mb-3">
              {isLogin ? "Welcome back" : "Create Workspace"}
            </h2>
            <p className="text-zinc-500 font-medium">
              {isLogin ? "Enter your credentials to continue." : "Join your organization with your work email."}
            </p>
          </div>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-4">
              {/* Email Input */}
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com" 
                  className="w-full pl-12 pr-4 py-4 bg-white border border-zinc-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all outline-none text-zinc-900"
                />
              </div>
              
              {/* Password Input */}
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                <input 
                  type="password" 
                  placeholder="Password" 
                  className="w-full pl-12 pr-4 py-4 bg-white border border-zinc-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all outline-none text-zinc-900"
                />
              </div>

              {/* Organization Logic Alert */}
              {!isLogin && (
                <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100/50 animate-in zoom-in-95">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse" />
                    <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Auto-Join Enabled</p>
                  </div>
                  <p className="text-xs font-bold text-indigo-900/60 leading-tight">
                    Sign up with your work email to automatically sync with your team's existing workspace.
                  </p>
                </div>
              )}

              {/* Action Button */}
              <button className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-black text-sm hover:bg-zinc-800 transition-all active:scale-[0.98] shadow-xl shadow-zinc-200 flex items-center justify-center gap-2 cursor-pointer group">
                {isLogin ? "Sign In" : "Register Workspace"} 
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </form>

          {/* Toggle Login/Signup */}
          <div className="mt-8 text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm font-bold text-zinc-400 hover:text-indigo-600 transition-colors cursor-pointer"
            >
              {isLogin ? (
                <>New to ProNotes? <span className="text-zinc-900">Create an account</span></>
              ) : (
                <>Already have an account? <span className="text-zinc-900">Sign in</span></>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}