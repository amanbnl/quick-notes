"use client";
import React, { useState, useEffect } from 'react';
import {
  Plus, Folder, Search, MoreHorizontal, ArrowUpRight,
  Users, Edit2, Archive, X, Loader2, Trash2, AlertCircle
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// --- DELETE CONFIRMATION MODAL ---
function DeleteConfirmModal({ isOpen, onClose, onConfirm, itemName, isDeleting }: {
  isOpen: boolean,
  onClose: () => void,
  onConfirm: () => void,
  itemName: string,
  isDeleting: boolean
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-110 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-[40px] shadow-2xl p-8 lg:p-10 animate-in zoom-in-95 duration-300 overflow-hidden text-center">
        <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <Trash2 size={32} className="text-rose-500" />
        </div>
        
        <h2 className="text-2xl font-black text-zinc-900 tracking-tight mb-2">Delete Collection?</h2>
        <p className="text-zinc-500 font-medium text-sm leading-relaxed mb-8">
          Are you sure you want to delete <span className="text-zinc-900 font-bold">"{itemName}"</span>? 
          This action cannot be undone and all notes within will be permanently removed.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-4 bg-zinc-100 text-zinc-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-zinc-200 transition-all active:scale-95"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 py-4 bg-rose-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-rose-600 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            {isDeleting ? <Loader2 className="animate-spin" size={18} /> : "Delete Forever"}
          </button>
        </div>
      </div>
    </div>
  );
}

// --- REUSABLE NOTEBOOK MODAL (CREATE/RENAME) ---
function NotebookModal({ isOpen, onClose, onSuccess, initialData, workspaceId, title }: {
  isOpen: boolean,
  onClose: () => void,
  onSuccess: (data: any) => void,
  initialData?: { name: string, color: string },
  workspaceId: string | null,
  title: string
}) {
  const { register, handleSubmit, watch, setValue, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(z.object({
      name: z.string().min(2, "Name is too short").max(30),
      color: z.string(),
      workspaceId: z.string().optional()
    })),
    defaultValues: initialData || { name: '', color: 'bg-indigo-500', workspaceId: workspaceId || '' }
  });

  useEffect(() => {
    if (isOpen) reset(initialData || { name: '', color: 'bg-indigo-500', workspaceId: workspaceId || '' });
  }, [isOpen, initialData, workspaceId, reset]);

  const selectedColor = watch('color');
  const colors = [
    { name: 'Indigo', class: 'bg-indigo-500' },
    { name: 'Emerald', class: 'bg-emerald-500' },
    { name: 'Amber', class: 'bg-amber-500' },
    { name: 'Rose', class: 'bg-rose-500' },
    { name: 'Sky', class: 'bg-sky-500' },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-zinc-900/40 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl p-8 lg:p-10 animate-in zoom-in-95 duration-300 overflow-hidden">
        <div className={cn("absolute top-0 left-0 w-full h-2 transition-colors duration-500", selectedColor)} />
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-black text-zinc-900 tracking-tight">{title}</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-xl transition-all"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit(onSuccess)} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-800 ml-1">Collection Name</label>
            <input {...register('name')} autoFocus className={cn("w-full px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-zinc-800 font-bold outline-none transition-all", errors.name ? "border-rose-500 ring-4 ring-rose-500/5" : "focus:bg-white focus:border-indigo-500")} placeholder="e.g. Design Systems" />
            {errors.name && <p className="text-xs font-bold text-rose-500 ml-1">{errors.name.message}</p>}
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-800 ml-1">Theme Color</label>
            <div className="flex flex-wrap gap-3 my-1">
              {colors.map((c) => (
                <button key={c.name} type="button" onClick={() => setValue('color', c.class)} className={cn("w-10 h-10 rounded-full transition-all active:scale-90", c.class, selectedColor === c.class ? "ring-4 ring-offset-2 ring-zinc-900" : "opacity-40 hover:opacity-100")} />
              ))}
            </div>
          </div>
          <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-zinc-800 transition-all active:scale-95 flex items-center justify-center gap-2">
            {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}

// --- MAIN DASHBOARD ---
export default function NotesDashboard() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const workspaceId = searchParams.get('workspaceId');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  
  // MODAL STATES
  const [modalMode, setModalMode] = useState<'create' | 'rename' | 'delete' | null>(null);
  const [activeNotebook, setActiveNotebook] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Mock data
  const notebooks = [
    { id: '1', name: "Product Strategy", notes: 12, color: "bg-indigo-500" },
    { id: '2', name: "Meeting Minutes", notes: 45, color: "bg-emerald-500" },
    { id: '3', name: "Personal Growth", notes: 8, color: "bg-amber-500" },
  ];

  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    if (openMenuId) window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [openMenuId]);

  const handleAction = async (action: () => Promise<void>) => {
    await action();
    setModalMode(null);
    setActiveNotebook(null);
    router.refresh();
  };

  const onConfirmDelete = async () => {
    setIsDeleting(true);
    console.log("API CALL: Deleting notebook", activeNotebook.id);
    await new Promise(r => setTimeout(r, 1000)); // Simulate API
    setIsDeleting(false);
    handleAction(async () => {});
  };

  return (
    <div className="max-w-[1400px] mx-auto py-6 lg:py-10 px-4 pb-24 lg:pb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* RENAME / CREATE MODALS */}
      <NotebookModal
        isOpen={modalMode === 'create' || modalMode === 'rename'}
        onClose={() => { setModalMode(null); setActiveNotebook(null); }}
        onSuccess={(data) => handleAction(async () => console.log("Success:", data))}
        initialData={modalMode === 'rename' ? activeNotebook : undefined}
        workspaceId={workspaceId}
        title={modalMode === 'create' ? "New Collection" : "Rename Collection"}
      />

      {/* DELETE CONFIRMATION MODAL */}
      <DeleteConfirmModal 
        isOpen={modalMode === 'delete'}
        onClose={() => { setModalMode(null); setActiveNotebook(null); }}
        onConfirm={onConfirmDelete}
        itemName={activeNotebook?.name || ''}
        isDeleting={isDeleting}
      />

      <header className="flex flex-col gap-6 mb-10 lg:mb-16">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl lg:text-5xl font-black text-zinc-900 tracking-tighter">My Collections</h1>
          </div>
          <button onClick={() => setModalMode('create')} className="group flex items-center justify-center gap-2 px-6 py-4 bg-zinc-900 text-white rounded-[20px] font-bold hover:bg-zinc-800 transition-all cursor-pointer active:scale-95 shadow-xl shadow-zinc-200">
            <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
            <span>Create Notebook</span>
          </button>
        </div>
        <hr className='mb-3 border-zinc-100' />
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10">
        {notebooks.map((notebook) => (
          <div
            key={notebook.id}
            onClick={() => router.push(`/note-books/${notebook.id}`)}
            className="group relative bg-white border border-zinc-200/50 rounded-[32px] lg:rounded-[40px] p-6 lg:p-8 hover:shadow-[0_40px_80px_-12px_rgba(0,0,0,0.08)] transition-all duration-500 cursor-pointer border-b-4 active:translate-y-0.5"
            style={{ borderBottomColor: `var(--zinc-200)` }}
          >
            <div className="flex justify-between items-start mb-10 relative">
              <div className={cn("w-14 h-14 lg:w-16 lg:h-16 rounded-2xl flex items-center justify-center text-white shadow-xl transform group-hover:rotate-6 transition-transform", notebook.color)}>
                <Folder size={28} />
              </div>

              <div className="relative">
                <button onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === notebook.id ? null : notebook.id); }} className="p-2 text-zinc-300 hover:text-zinc-900 hover:bg-zinc-50 rounded-xl transition-all cursor-pointer">
                  <MoreHorizontal size={24} />
                </button>

                {openMenuId === notebook.id && (
                  <div className="absolute right-0 mt-2 w-48 bg-white/95 border border-zinc-200 shadow-2xl rounded-2xl p-2 z-[60] animate-in fade-in zoom-in-95 duration-200">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setActiveNotebook(notebook); setModalMode('rename'); setOpenMenuId(null); }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-zinc-600 hover:bg-zinc-50 rounded-xl transition-all cursor-pointer group/item"
                    >
                      <Edit2 size={14} className="group-hover/item:text-indigo-600" /> Rename
                    </button>
                    <div className="h-[1px] bg-zinc-100 my-1" />
                    <button 
                      onClick={(e) => { e.stopPropagation(); setActiveNotebook(notebook); setModalMode('delete'); setOpenMenuId(null); }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-rose-500 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="relative">
              <h3 className="text-2xl lg:text-3xl font-black text-zinc-900 mb-2 tracking-tighter group-hover:text-indigo-600 transition-colors">
                {notebook.name}
              </h3>
              <p className="text-sm font-bold text-zinc-400">{notebook.notes} Notes</p>
            </div>
            <div className="mt-12 flex items-center justify-end">
              <div className="w-12 h-12 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-400 group-hover:bg-zinc-900 group-hover:text-white transition-all duration-500 shadow-sm">
                <ArrowUpRight size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}