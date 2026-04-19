"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail, Lock, ArrowRight, Layers, User, Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useRouter } from 'next/navigation';
import { setCookie } from 'cookies-next';// Import this to handle the middleware token
import api from '@/lib/axios/config';    // Import your axios middleware
import { UserDetails, useUserStore } from '@/store/useUserStore'
// --- VALIDATION SCHEMA ---
const authSchema = z.object({
  fullName: z.string().min(2, "Name is required for registration").optional(),
  email: z.string().email("Please enter a valid work email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type AuthFormData = z.infer<typeof authSchema>;

export default function AuthPage () {
  const { setUser } = useUserStore();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
  });

  const onSubmit = async (formData: AuthFormData) => {
    setIsLoading(true);
    try {
      if (isLogin) {
        // 1. LOGIN CALL
        const { data } = await api.post('/users/auth/login', {
          email: formData.email,
          password: formData.password
        });
        if (data?.token) {
          // Handle Persistence
          localStorage.setItem('auth_token', data.token);
          setCookie('auth_token', data.token);
          setUser({
            id: data.id
          } as UserDetails);

          router.push('/note-books');
        }
      } else {
        // SIGNUP LOGIC (Unchanged)
        await api.post('/users', {
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password
        });

        setIsLogin(true);
        reset({ email: formData.email, password: '' });
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };
  const toggleMode = () => {
    setIsLogin(!isLogin);
    reset();
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white selection:bg-indigo-100">

      {/* LEFT SIDE: BRAND/VISUAL (Unchanged) */}
      <div className="hidden lg:flex bg-zinc-900 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/20 blur-[120px] rounded-full -mr-48 -mt-48 pointer-events-none" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-2xl">
            <Layers className="text-white" size={22} />
          </div>
          <span className="text-2xl font-black text-white tracking-tight">ProNotes.</span>
        </div>

        <div className="relative z-10">
          <h1 className="text-6xl font-black text-white tracking-tighter leading-[0.9] mb-8">
            The workspace <br /> for <span className="text-indigo-500">high-output</span> <br /> teams.
          </h1>
          <p className="text-zinc-400 text-lg font-medium max-w-md leading-relaxed">
            Consolidate your team's knowledge in a workspace that is as fast as you think.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-6">
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">
            Trusted by elite teams globally
          </p>
        </div>
      </div>

      {/* RIGHT SIDE: AUTH FORM (Integrated with API) */}
      <div className="flex items-center justify-center p-8 sm:p-12 lg:p-20 bg-zinc-50/30">
        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">

          <div className="mb-10">
            <h2 className="text-4xl font-black text-zinc-900 tracking-tighter mb-3">
              {isLogin ? "Welcome back" : "Create Account"}
            </h2>
            <p className="text-zinc-500 font-medium">
              {isLogin ? "Enter your credentials to continue." : "Join your organization with your work email."}
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>

            {!isLogin && (
              <div className="space-y-1 animate-in fade-in slide-in-from-top-2 duration-500">
                <div className="relative group">
                  <User className={cn(
                    "absolute left-4 top-1/2 -translate-y-1/2 transition-colors",
                    errors.fullName ? "text-rose-500" : "text-zinc-400 group-focus-within:text-indigo-600"
                  )} size={18} />
                  <input
                    {...register("fullName")}
                    type="text"
                    placeholder="Full Name"
                    className={cn(
                      "w-full pl-12 pr-4 py-4 bg-white border rounded-2xl text-sm font-bold transition-all outline-none text-zinc-900",
                      errors.fullName ? "border-rose-500 ring-4 ring-rose-500/5" : "border-zinc-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600"
                    )}
                  />
                </div>
                {errors.fullName && <p className="text-[10px] font-bold text-rose-500 uppercase tracking-wider ml-2">{errors.fullName.message}</p>}
              </div>
            )}

            <div className="space-y-1">
              <div className="relative group">
                <Mail className={cn(
                  "absolute left-4 top-1/2 -translate-y-1/2 transition-colors",
                  errors.email ? "text-rose-500" : "text-zinc-400 group-focus-within:text-indigo-600"
                )} size={18} />
                <input
                  {...register("email")}
                  type="email"
                  placeholder="name@company.com"
                  className={cn(
                    "w-full pl-12 pr-4 py-4 bg-white border rounded-2xl text-sm font-bold transition-all outline-none text-zinc-900",
                    errors.email ? "border-rose-500 ring-4 ring-rose-500/5" : "border-zinc-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600"
                  )}
                />
              </div>
              {errors.email && <p className="text-[10px] font-bold text-rose-500 uppercase tracking-wider ml-2">{errors.email.message}</p>}
            </div>

            <div className="space-y-1">
              <div className="relative group">
                <Lock className={cn(
                  "absolute left-4 top-1/2 -translate-y-1/2 transition-colors",
                  errors.password ? "text-rose-500" : "text-zinc-400 group-focus-within:text-indigo-600"
                )} size={18} />
                <input
                  {...register("password")}
                  type="password"
                  placeholder="Password"
                  className={cn(
                    "w-full pl-12 pr-4 py-4 bg-white border rounded-2xl text-sm font-bold transition-all outline-none text-zinc-900",
                    errors.password ? "border-rose-500 ring-4 ring-rose-500/5" : "border-zinc-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600"
                  )}
                />
              </div>
              {errors.password && <p className="text-[10px] font-bold text-rose-500 uppercase tracking-wider ml-2">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-zinc-900 disabled:bg-zinc-700 text-white rounded-2xl font-black text-sm hover:bg-zinc-800 transition-all active:scale-[0.98] shadow-xl shadow-zinc-200 flex items-center justify-center gap-2 cursor-pointer group mt-6"
            >
              {isLoading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  {isLogin ? "Sign In" : "Get Started"}
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button
              onClick={toggleMode}
              className="text-sm font-bold text-zinc-400 hover:text-indigo-600 transition-colors cursor-pointer"
            >
              {isLogin ? (
                <>New to ProNotes? <span className="text-zinc-900 underline underline-offset-4 decoration-zinc-200 hover:decoration-indigo-500">Create an account</span></>
              ) : (
                <>Already have an account? <span className="text-zinc-900 underline underline-offset-4 decoration-zinc-200 hover:decoration-indigo-500">Sign in</span></>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}