"use client";
import React from 'react';
import {
  ArrowRight, Layers, Users,
  Sparkles, Check,
  LayoutDashboard, BookOpen, Share2
} from 'lucide-react';
import Link from 'next/link';

export default function LandingPage () {
  return (
    <div className="min-h-screen bg-white text-zinc-900 selection:bg-indigo-100 selection:text-indigo-700 overflow-x-hidden font-sans">

      {/* 1. NAVIGATION */}
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-white/80 backdrop-blur-xl border-b border-zinc-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100 group-hover:rotate-6 transition-all duration-300">
              <Layers className="text-white" size={20} />
            </div>
            <span className="text-xl font-black tracking-tighter text-zinc-900 uppercase">
              ProNotes<span className="text-indigo-600">.</span>
            </span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/login" className="bg-zinc-900 text-white text-[11px] font-black uppercase tracking-[0.15em] px-8 py-3.5 rounded-2xl hover:bg-indigo-600 transition-all active:scale-95 shadow-xl shadow-zinc-200">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* 2. HERO: WHO WE ARE & WHAT WE DO */}
      <section className="relative pt-4 pb-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

            {/* LEFT: TEXT CONTENT */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 mb-8">
                <Sparkles size={14} className="text-indigo-600" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">Introducing ProNotes</span>
              </div>

              <h1 className="text-5xl lg:text-8xl font-black tracking-tight leading-[1.05] text-zinc-900 mb-8">
                Your thoughts, <br />
                <span className="text-indigo-600">perfectly aligned.</span>
              </h1>

              <p className="text-lg lg:text-xl text-zinc-500 font-medium leading-relaxed max-w-xl mb-12">
                We are a dedicated team of builders who believe that note-taking shouldn't be a chore.
                <span className="text-zinc-900 font-bold"> ProNotes</span> is a clean, minimal workspace designed to help
                individuals and teams capture ideas instantly, organize them intuitively, and never lose
                track of a single insight again.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 lg:justify-start">
                <Link href="/login" className="w-full sm:w-auto px-10 py-5 bg-zinc-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all flex items-center justify-center gap-3">
                  Join the platform <ArrowRight size={18} />
                </Link>
                <div className="flex items-center gap-2 px-6 py-5 text-zinc-400 font-bold text-xs uppercase tracking-widest">
                  <Check size={16} className="text-emerald-500" /> 100% Secure & Private
                </div>
              </div>
            </div>

            {/* RIGHT: IMAGE STACK / MOCKUPS */}
            <div className="flex-1 relative w-full max-w-2xl">
              <div className="relative aspect-square">
                {/* Main Dashboard Preview Image */}
                <div className="absolute top-0 right-0 w-[85%] h-[85%] bg-zinc-100 rounded-[40px] border-8 border-white shadow-2xl overflow-hidden rotate-3 hover:rotate-0 transition-transform duration-700">
                  <div className="w-full h-full bg-gradient-to-br from-indigo-50 to-white flex items-center justify-center">
                    <LayoutDashboard size={80} className="text-indigo-100" />
                  </div>
                </div>

                {/* Secondary Feature Image */}
                <div className="absolute bottom-0 left-0 w-[60%] h-[60%] bg-white rounded-[32px] border-8 border-white shadow-2xl overflow-hidden -rotate-6 hover:rotate-0 transition-transform duration-700 flex flex-col p-6">
                  <div className="w-12 h-12 bg-indigo-600 rounded-xl mb-4" />
                  <div className="space-y-3">
                    <div className="h-4 w-full bg-zinc-100 rounded-full" />
                    <div className="h-4 w-3/4 bg-zinc-100 rounded-full" />
                  </div>
                </div>

                {/* Small Floating Card */}
                <div className="absolute top-1/2 -left-10 transform -translate-y-1/2 bg-white px-6 py-4 rounded-2xl shadow-xl border border-zinc-100 flex items-center gap-4 animate-bounce">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Users size={20} className="text-emerald-600" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest">Real-time Sync</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. WHAT WE OFFER */}
      <section className="py-32 px-6 bg-zinc-50">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-20">
            <h2 className="text-4xl lg:text-6xl font-black tracking-tighter text-zinc-900 uppercase mb-6">Our Offering</h2>
            <div className="h-2 w-24 bg-indigo-600 mx-auto rounded-full mb-8" />
            <p className="text-zinc-500 font-bold text-lg max-w-2xl mx-auto">
              We built a suite of tools that work the way your brain does.
              Simple, fast, and completely clutter-free.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Offering 1 */}
            <div className="bg-white p-10 rounded-[40px] border border-zinc-200/50 hover:shadow-2xl hover:border-indigo-200 transition-all group">
              <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-8 group-hover:scale-110 transition-transform">
                <BookOpen size={32} />
              </div>
              <h3 className="text-2xl font-black text-zinc-900 mb-4 uppercase tracking-tight">Smart Workspaces</h3>
              <p className="text-zinc-500 font-medium leading-relaxed">
                Easily manage your daily notes in a structured workspace. From quick meeting minutes to long-form strategy, everything has its place.
              </p>
            </div>

            {/* Offering 2 */}
            <div className="bg-white p-10 rounded-[40px] border border-zinc-200/50 hover:shadow-2xl hover:border-indigo-200 transition-all group">
              <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-8 group-hover:scale-110 transition-transform">
                <LayoutDashboard size={32} />
              </div>
              <h3 className="text-2xl font-black text-zinc-900 mb-4 uppercase tracking-tight">Seamless Organization</h3>
              <p className="text-zinc-500 font-medium leading-relaxed">
                Group your notebooks by projects, teams, or personal goals. Our "Collections" feature keeps your dashboard clean and focused.
              </p>
            </div>

            {/* Offering 3 */}
            <div className="bg-white p-10 rounded-[40px] border border-zinc-200/50 hover:shadow-2xl hover:border-indigo-200 transition-all group">
              <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center text-white mb-8 group-hover:scale-110 transition-transform">
                <Share2 size={32} />
              </div>
              <h3 className="text-2xl font-black text-zinc-900 mb-4 uppercase tracking-tight">Team Integration</h3>
              <p className="text-zinc-500 font-medium leading-relaxed">
                Built-in domain grouping means your team is automatically synced. Share ideas instantly without the "request access" friction.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 4. FINAL CALL */}
      <section className="py-40 px-6 text-center">
        <h2 className="text-5xl lg:text-8xl font-black tracking-tighter text-zinc-900 mb-12 uppercase">Join ProNotes today.</h2>
        <Link href="/login" className="px-16 py-8 bg-zinc-900 text-white rounded-3xl font-black text-xs uppercase tracking-[0.3em] hover:bg-indigo-600 transition-all active:scale-95 shadow-2xl shadow-zinc-200 inline-block">
          Create Your First Note
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="py-20 px-6 border-t border-zinc-100 flex flex-col items-center gap-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Layers size={16} className="text-white" />
          </div>
          <span className="text-sm font-black tracking-widest uppercase text-zinc-900">ProNotes.</span>
        </div>
      </footer>

    </div>
  );
}