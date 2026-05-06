"use client";
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  User, ShieldAlert, ChevronRight, Camera, Loader2, Lock, Trash2, X
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useUserStore } from '@/store/useUserStore';
import api from '@/lib/axios/config';
import { useRouter } from 'next/navigation';
import { deleteCookie } from 'cookies-next';

// --- MODAL COMPONENT ---
function DeleteConfirmModal ({ isOpen, onClose, onConfirm, itemName, isDeleting }: {
  isOpen: boolean,
  onClose: () => void,
  onConfirm: () => void,
  itemName: string,
  isDeleting: boolean
}) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-[40px] shadow-2xl p-8 lg:p-10 animate-in zoom-in-95 duration-300 overflow-hidden text-center">
        <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <Trash2 size={32} className="text-rose-500" />
        </div>
        <h2 className="text-2xl font-black text-zinc-900 tracking-tight mb-2">Delete Account?</h2>
        <p className="text-zinc-500 font-medium text-sm leading-relaxed mb-8">
          Are you sure you want to delete account for <span className="text-zinc-900 font-bold">"{itemName}"</span>?
          This action will permanently wipe all your notes and workspaces.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button onClick={onClose} className="flex-1 py-4 bg-zinc-100 text-zinc-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-zinc-200 transition-all active:scale-95 cursor-pointer">Cancel</button>
          <button onClick={onConfirm} disabled={isDeleting} className="cursor-pointer flex-1 py-4 bg-rose-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-rose-600 transition-all active:scale-95 flex items-center justify-center gap-2">
            {isDeleting ? <Loader2 className="animate-spin" size={18} /> : "Delete Forever"}
          </button>
        </div>
      </div>
    </div>
  );
}

// --- SCHEMAS ---
const profileSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  bio: z.string().optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export default function ProfilePage () {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('identity');
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { user, setUser, logout } = useUserStore();

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.fullName || '',
      bio: user?.bio || ''
    }
  });

  useEffect(() => {
    if (user) {
      reset({
        fullName: user.fullName,
        bio: user.bio || ''
      });
    }
  }, [user, reset]);

  const {
    register: registerPass,
    handleSubmit: handleSubmitPass,
    reset: resetPass,
    formState: { errors: passErrors }
  } = useForm({
    resolver: zodResolver(passwordSchema)
  });

  const handleUpdateProfile = async (data: any) => {
    setIsLoading(true);
    try {
      const res = await api.put(`/users/${user?.id}`, data);
      setUser(res.data);
    } catch (error) {
      console.error("Profile update failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (data: any) => {
    try {
      await api.post('/users/reset-password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword
      });
      resetPass();
      alert("Password updated successfully");
    } catch (error) {
      console.error("Password reset failed", error);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/users/${user?.id}`);
      // Clear store and redirect
      setUser(null);
      localStorage.removeItem('auth_token');
      deleteCookie('auth_token');
      deleteCookie('user-storage');
      logout();
      router.push('/login');
    } catch (error) {
      console.error("Account deletion failed", error);
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0][0].toUpperCase();
  };

  const tabs = [
    { id: 'identity', label: 'Identity', icon: User, desc: 'Personal info' },
    { id: 'security', label: 'Security', icon: ShieldAlert, desc: 'Danger Zone' },
  ];

  return (
    <div className="max-w-[1200px] mx-auto py-6 px-4 pb-24 lg:pb-10 animate-in fade-in duration-500">

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
        itemName={user?.fullName || "Your Account"}
        isDeleting={isDeleting}
      />

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8 lg:mb-12">
        <div className="text-center sm:text-left">
          <h1 className="text-3xl lg:text-4xl font-black text-zinc-900 tracking-tighter">Profile Settings</h1>
          <p className="text-zinc-500 font-medium text-sm mt-1">Manage your identity and account security.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button onClick={() => reset()} className="flex-1 sm:flex-none px-6 py-2.5 bg-white border border-zinc-200 text-zinc-600 rounded-2xl text-xs font-bold active:scale-95 transition-all cursor-pointer">Discard</button>
          <button
            disabled={isLoading}
            onClick={handleSubmit(handleUpdateProfile)}
            className="flex-1 sm:flex-none px-6 py-2.5 bg-zinc-900 text-white rounded-2xl text-xs font-bold active:scale-95 shadow-lg shadow-zinc-100 cursor-pointer flex items-center justify-center gap-2"
          >
            {isLoading && <Loader2 size={14} className="animate-spin" />}
            Save Changes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* NAV */}
        <div className="lg:col-span-4 flex lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
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
        <div className="lg:col-span-8 bg-white border border-zinc-200/60 rounded-[32px] lg:rounded-[40px] shadow-sm min-h-[400px]">
          <div className="p-6 lg:p-10">

            {activeTab === 'identity' && (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-zinc-50 rounded-[28px] border border-zinc-100">
                  <div className="w-20 h-20 rounded-[24px] bg-indigo-600 shadow-xl shadow-indigo-100 flex items-center justify-center text-white border-4 border-white">
                    <span className="text-2xl font-black tracking-tight">
                      {getInitials(user?.fullName)}
                    </span>
                  </div>
                  <div className="text-center sm:text-left">
                    <h4 className="font-black text-zinc-900 text-xl tracking-tight">{user?.fullName || "User"}</h4>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-3 block px-1">Full Name</label>
                    <input
                      {...register("fullName")}
                      type="text"
                      className="w-full bg-zinc-50 border-transparent focus:bg-white focus:border-indigo-200 focus:ring-4 focus:ring-indigo-500/5 rounded-[20px] px-5 py-4 text-zinc-900 text-sm font-bold transition-all outline-none"
                    />
                    {errors.fullName && <p className="text-red-500 text-[10px] mt-1 font-bold px-1">{errors.fullName.message}</p>}
                  </div>
                  <div>
                    <label className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-3 block px-1">Professional Bio</label>
                    <textarea
                      {...register("bio")}
                      className="w-full bg-zinc-50 border-transparent focus:bg-white focus:border-indigo-200 focus:ring-4 focus:ring-indigo-500/5 rounded-[24px] p-5 text-zinc-900 text-sm font-medium transition-all outline-none leading-relaxed"
                      rows={4}
                      placeholder="Briefly describe your expertise..."
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                {/* <div className="p-6 bg-zinc-50 rounded-[28px] border border-zinc-100 space-y-6">
                  <div className="flex items-center gap-3">
                    <Lock size={18} className="text-zinc-400" />
                    <h3 className="text-sm font-black text-zinc-900 uppercase tracking-widest">Update Password</h3>
                  </div>

                  <div className="space-y-4">
                    <input
                      {...registerPass("currentPassword")}
                      type="password"
                      placeholder="Current Password"
                      className="w-full bg-white border-transparent focus:border-indigo-200 focus:ring-4 focus:ring-indigo-500/5 rounded-[20px] px-5 py-3 text-zinc-900 text-sm font-bold transition-all outline-none"
                    />
                    {passErrors.currentPassword && <p className="text-red-500 text-[10px] font-bold px-1">{passErrors.currentPassword.message}</p>}

                    <input
                      {...registerPass("newPassword")}
                      type="password"
                      placeholder="New Password"
                      className="w-full bg-white border-transparent focus:border-indigo-200 focus:ring-4 focus:ring-indigo-500/5 rounded-[20px] px-5 py-3 text-zinc-900 text-sm font-bold transition-all outline-none"
                    />
                    {passErrors.newPassword && <p className="text-red-500 text-[10px] font-bold px-1">{passErrors.newPassword.message}</p>}

                    <input
                      {...registerPass("confirmPassword")}
                      type="password"
                      placeholder="Confirm New Password"
                      className="w-full bg-white border-transparent focus:border-indigo-200 focus:ring-4 focus:ring-indigo-500/5 rounded-[20px] px-5 py-3 text-zinc-900 text-sm font-bold transition-all outline-none"
                    />
                    {passErrors.confirmPassword && <p className="text-red-500 text-[10px] font-bold px-1">{passErrors.confirmPassword.message}</p>}

                    <button
                      onClick={handleSubmitPass(handleResetPassword)}
                      className="w-full py-3 bg-zinc-900 text-white rounded-[20px] text-xs font-bold active:scale-95 transition-all shadow-md cursor-pointer"
                    >
                      Reset Password
                    </button>
                  </div>
                </div> */}

                <div className="p-8 bg-red-50/50 border border-red-100 rounded-[32px]">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-red-600 shadow-sm border border-red-100">
                      <ShieldAlert size={24} />
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-zinc-900 tracking-tight">Danger Zone</h4>
                      <p className="text-sm font-medium text-red-500/70">Deleting your account is irreversible. All your notes and workspaces will be permanently wiped.</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="w-full py-4 bg-white border border-red-200 text-red-600 rounded-2xl font-black text-sm hover:bg-red-600 hover:text-white transition-all cursor-pointer active:scale-95 shadow-sm"
                  >
                    Permanently Delete Account
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}