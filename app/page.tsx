"use client";
import React from 'react';
import { 
  ArrowRight, Layers, Zap, Users, Shield, 
  ChevronRight, Sparkles, Command, Check, Star,
  Lock, Globe, MousePointer2, Smartphone, Cpu, BarChart3,
  Network, Fingerprint
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/utils/cn';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-white selection:bg-indigo-500/30 selection:text-indigo-200 overflow-x-hidden font-sans">
      
      {/* 1. ARCHITECTURAL NAV */}
      <nav className="fixed top-0 left-0 right-0 z-100 bg-black/60 backdrop-blur-2xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center group-hover:bg-indigo-500 transition-colors">
              <Layers className="text-black group-hover:text-white" size={16} />
            </div>
            <span className="text-sm font-black tracking-widest uppercase">ProNotes.</span>
          </div>
          
          <div className="hidden md:flex items-center gap-10">
            {['Engine', 'Security', 'Pricing'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-colors">
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-6">
            <Link href="/login" className="text-xs font-bold text-zinc-400 hover:text-white transition-all">
              Log In
            </Link>
            <Link href="/login" className="bg-white text-black text-[10px] font-black uppercase tracking-widest px-6 py-2.5 rounded-full hover:bg-indigo-500 hover:text-white transition-all active:scale-95">
              Get Access
            </Link>
          </div>
        </div>
      </nav>

      {/* 2. HERO: THE "PROBLEM SOLVED" STATEMENT */}
      <section className="relative pt-48 pb-32 px-6 overflow-hidden">
        {/* Ambient Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <Fingerprint size={14} className="text-indigo-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Zero-Trust Knowledge Architecture</span>
          </div>

          <h1 className="text-6xl md:text-[120px] font-black tracking-[-0.06em] leading-[0.85] mb-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            Kill Institutional <br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 italic font-serif font-light">Amnesia.</span>
          </h1>

          <p className="text-lg md:text-2xl text-zinc-400 font-medium max-w-2xl mx-auto mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
            ProNotes automatically unifies your team's scattered intelligence into a single, high-velocity workspace. No silos, no friction, just pure clarity.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-400">
            <Link href="/login" className="px-12 py-6 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all active:scale-95 flex items-center gap-3 shadow-[0_0_40px_rgba(255,255,255,0.1)]">
              Start Building Now <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* 3. CORE ENGINE: THE BENTO SYSTEM */}
      <section id="engine" className="py-24 px-6 border-t border-white/5 bg-zinc-950/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            
            {/* The Organization Engine */}
            <div className="md:col-span-8 bg-zinc-900/50 border border-white/5 p-12 rounded-[48px] relative overflow-hidden group min-h-[500px] flex flex-col justify-between hover:border-indigo-500/30 transition-colors">
              <div className="relative z-10">
                <Network className="text-indigo-400 mb-8" size={32} />
                <h2 className="text-5xl font-black tracking-tighter leading-none mb-6">Autonomous <br/>Organization.</h2>
                <p className="text-zinc-400 font-bold max-w-sm leading-relaxed text-lg">
                  ProNotes automatically groups your team based on email domains. New hires get instant access to the collective memory of your company.
                </p>
              </div>
              <div className="absolute -bottom-10 -right-10 w-2/3 h-64 bg-indigo-500/10 rounded-tl-[48px] border-t border-l border-white/10 backdrop-blur-xl p-8">
                 <div className="flex flex-col gap-4">
                    <div className="h-4 w-3/4 bg-white/10 rounded-full animate-pulse" />
                    <div className="h-4 w-1/2 bg-white/10 rounded-full animate-pulse" />
                    <div className="h-4 w-5/6 bg-white/10 rounded-full animate-pulse" />
                 </div>
              </div>
            </div>

            {/* Performance */}
            <div className="md:col-span-4 bg-white p-12 rounded-[48px] text-black flex flex-col justify-between group">
              <Zap className="text-indigo-600" size={40} />
              <div>
                <h2 className="text-3xl font-black tracking-tighter mb-4">50ms Sync.</h2>
                <p className="text-zinc-600 font-bold leading-relaxed">
                  Real-time isn't a feature; it's our foundation. Zero-latency collaboration across every device in the organization.
                </p>
              </div>
            </div>

            {/* Security Section */}
            <div id="security" className="md:col-span-4 bg-zinc-900/50 border border-white/5 p-12 rounded-[48px] flex flex-col justify-between hover:border-indigo-500/30 transition-all">
              <Lock className="text-indigo-400" size={40} />
              <div>
                <h2 className="text-2xl font-black tracking-tighter mb-2">Zero-Trust.</h2>
                <p className="text-zinc-500 font-bold text-sm">Military-grade encryption for every notebook. You own the keys; we just provide the vault.</p>
              </div>
            </div>

            {/* Navigation */}
            <div className="md:col-span-8 bg-gradient-to-br from-indigo-900/20 to-black border border-white/5 p-12 rounded-[48px] flex flex-col md:flex-row items-center gap-12 group">
               <div className="flex-1">
                  <Command className="text-white mb-6" size={32} />
                  <h2 className="text-3xl font-black tracking-tighter mb-4">Speed of Thought.</h2>
                  <p className="text-zinc-400 font-bold leading-relaxed italic">"The Cmd+K workflow makes me feel like I have a superpower."</p>
               </div>
               <div className="hidden md:block w-72 h-32 bg-zinc-800/50 rounded-2xl border border-white/10 shadow-2xl p-4">
                  <div className="w-full h-2 bg-indigo-500 rounded-full mb-4" />
                  <div className="w-2/3 h-2 bg-zinc-700 rounded-full" />
               </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. THE PROOF (WALL OF LOVE) */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-4xl font-black tracking-tighter mb-4">The new standard for <br/>high-output teams.</h2>
            <div className="flex justify-center gap-1">
              {[1,2,3,4,5].map(i => <Star key={i} size={14} className="fill-indigo-500 text-indigo-500" />)}
            </div>
          </div>
          
          <div className="columns-1 md:columns-2 gap-8 space-y-8">
            {[
              { author: "Marcus Thorne", role: "CTO @ Vercel", quote: "ProNotes is the only tool that actually solved our internal documentation friction. The organization mode is genius." },
              { author: "Sarah Chen", role: "Product Lead @ Linear", quote: "If you care about speed and security, this is the only platform that matters. It's built for power users." },
            ].map((t, i) => (
              <div key={i} className="break-inside-avoid p-10 bg-zinc-900/30 border border-white/5 rounded-[40px] hover:border-indigo-500/20 transition-all">
                <p className="text-zinc-300 font-medium italic mb-8 leading-relaxed">"{t.quote}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-400 font-bold text-xs uppercase">{t.author[0]}</div>
                  <div>
                    <p className="text-sm font-black text-white uppercase tracking-wider">{t.author}</p>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. PRICING: TRANSPARENT VALUE */}
      <section id="pricing" className="py-32 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             
             {/* Individual */}
             <div className="p-12 rounded-[56px] border border-white/5 bg-zinc-950/50 hover:bg-zinc-900/50 transition-all group">
                <div className="mb-12">
                  <p className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Personal</p>
                  <h3 className="text-6xl font-black tracking-tighter">$0</h3>
                </div>
                <div className="space-y-6 mb-12">
                  <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-zinc-400">
                    <Check size={18} className="text-indigo-500" /> Private Space
                  </div>
                  <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-zinc-400">
                    <Check size={18} className="text-indigo-500" /> Unlimited Notes
                  </div>
                </div>
                <button className="w-full py-6 bg-white/5 border border-white/10 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-all cursor-pointer">Start Solo</button>
             </div>

             {/* Team */}
             <div className="p-12 rounded-[56px] bg-white text-black relative shadow-[0_0_80px_rgba(255,255,255,0.05)]">
                <div className="absolute top-12 right-12">
                   <div className="px-4 py-1.5 bg-indigo-600 rounded-full text-white text-[10px] font-black uppercase tracking-widest">Growth Standard</div>
                </div>
                <div className="mb-12">
                  <p className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Organization</p>
                  <h3 className="text-6xl font-black tracking-tighter">$12<span className="text-lg text-zinc-400 tracking-normal">/mo</span></h3>
                </div>
                <div className="space-y-6 mb-12">
                  <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-zinc-600">
                    <Check size={18} className="text-indigo-600" /> Collaborative Workspaces
                  </div>
                  <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-zinc-600">
                    <Check size={18} className="text-indigo-600" /> Domain-Based Grouping
                  </div>
                  <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-zinc-600">
                    <Check size={18} className="text-indigo-600" /> Admin Intelligence
                  </div>
                </div>
                <button className="w-full py-6 bg-black text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 transition-all cursor-pointer">Scale Team</button>
             </div>
          </div>
        </div>
      </section>

      {/* 6. FINAL SHOUT & GET STARTED CONTENT */}
      <section className="py-48 px-6 text-center bg-[#09090b]">
        <h2 className="text-5xl md:text-8xl font-black tracking-tighter mb-12">Build a smarter <br/>organization.</h2>
        <div className="flex flex-col items-center gap-8">
          <Link href="/login" className="px-12 py-6 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-500 transition-all active:scale-95 shadow-2xl shadow-indigo-500/20">
            Initialize Free Workspace
          </Link>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">No setup fees. No complex onboarding. Just sync.</p>
        </div>
      </section>

      <footer className="py-20 px-6 border-t border-white/5 flex flex-col items-center gap-10">
        <div className="flex items-center gap-3 opacity-30 grayscale">
          <Layers size={20} />
          <span className="text-sm font-black tracking-widest uppercase">ProNotes.</span>
        </div>
        <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-zinc-600">
          <a href="#" className="hover:text-white transition-colors">Twitter</a>
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Security</a>
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-800">
          © 2026 — Zero Trust Knowledge OS.
        </p>
      </footer>

    </div>
  );
}