"use client";
import React, { useState, useEffect } from 'react';
import {
  Plus, Folder, Search, MoreHorizontal, ArrowUpRight,
  Edit2, X, Loader2, Trash2,
  UserPlus, Check, User
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// --- DELETE CONFIRMATION MODAL (EXISTING) ---
function DeleteConfirmModal({ isOpen, onClose, onConfirm, itemName, isDeleting }: {
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

// --- REUSABLE NOTEBOOK MODAL (CREATE/RENAME - EXISTING) ---
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

// --- NEW SHARE MODAL (SEARCH + TAGS) ---
function ShareModal({ isOpen, onClose, notebook }: { 
  isOpen: boolean, 
  onClose: () => void, 
  notebook: any 
}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isInviting, setIsInviting] = useState(false);

  // Mock search logic
  useEffect(() => {
    const searchUsers = async () => {
      if (query.length < 2) { setResults([]); return; }
      setIsSearching(true);
      // Simulate API call
      setTimeout(() => {
        const mockUsers = [
          { id: 'u1', name: 'Alex Rivera', email: 'alex@company.com' },
          { id: 'u2', name: 'Sarah Chen', email: 'sarah@company.com' },
          { id: 'u3', name: 'Jordan Smyth', email: 'jordan@company.com' },
        ].filter(u => u.name.toLowerCase().includes(query.toLowerCase()));
        setResults(mockUsers);
        setIsSearching(false);
      }, 400);
    };
    const debounce = setTimeout(searchUsers, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const toggleUser = (user: any) => {
    if (selectedUsers.find(u => u.id === user.id)) {
      setSelectedUsers(selectedUsers.filter(u => u.id !== user.id));
    } else {
      setSelectedUsers([...selectedUsers, user]);
      setQuery('');
      setResults([]);
    }
  };

  const handleInvite = async () => {
    setIsInviting(true);
    await new Promise(r => setTimeout(r, 1000)); // Simulate API
    setIsInviting(false);
    onClose();
    setSelectedUsers([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl p-8 lg:p-10 animate-in zoom-in-95 duration-300 overflow-hidden">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
              <UserPlus size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-zinc-900 tracking-tight">Share Collection</h2>
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{notebook?.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-xl transition-all"><X size={20} /></button>
        </div>

        {/* Selected Users as Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {selectedUsers.map(user => (
            <div key={user.id} className="flex items-center gap-2 px-3 py-2 bg-zinc-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest animate-in scale-in-90">
              {user.name}
              <button onClick={() => toggleUser(user)} className="hover:text-rose-400 transition-colors">
                <X size={14} />
              </button>
            </div>
          ))}
        </div>

        <div className="relative mb-8">
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400">
            {isSearching ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
          </div>
          <input 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-14 pr-6 py-5 bg-zinc-50 border border-zinc-100 rounded-[24px] text-zinc-800 font-bold outline-none focus:bg-white focus:border-indigo-500 transition-all"
          />

          {/* Results Dropdown */}
          {results.length > 0 && (
            <div className="absolute top-full left-0 w-full mt-2 bg-white border border-zinc-100 shadow-2xl rounded-[24px] overflow-hidden z-10 animate-in slide-in-from-top-2">
              {results.map(user => (
                <button 
                  key={user.id}
                  onClick={() => toggleUser(user)}
                  className="w-full flex items-center justify-between px-6 py-4 hover:bg-zinc-50 transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500">
                      <User size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-black text-zinc-900">{user.name}</p>
                      <p className="text-[10px] font-bold text-zinc-400 uppercase">{user.email}</p>
                    </div>
                  </div>
                  {selectedUsers.find(u => u.id === user.id) && <Check size={18} className="text-indigo-600" />}
                </button>
              ))}
            </div>
          )}
        </div>

        <button 
          onClick={handleInvite}
          disabled={selectedUsers.length === 0 || isInviting}
          className="w-full py-5 bg-zinc-900 disabled:bg-zinc-100 disabled:text-zinc-400 text-white rounded-[24px] font-black text-xs uppercase tracking-[0.2em] transition-all active:scale-95 flex items-center justify-center gap-3"
        >
          {isInviting ? <Loader2 className="animate-spin" size={18} /> : "Send Invitations"}
        </button>
      </div>
    </div>
  );
}

// --- MAIN DASHBOARD (ALL FUNCTIONALITY INTACT) ---
export default function NotesDashboard() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const workspaceId = searchParams.get('workspaceId');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  
  // MODAL STATES
  const [modalMode, setModalMode] = useState<'create' | 'rename' | 'delete' | 'share' | null>(null);
  const [activeNotebook, setActiveNotebook] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Mock data (Preserved)
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
      
      {/* RENAME / CREATE MODALS (Preserved) */}
      <NotebookModal
        isOpen={modalMode === 'create' || modalMode === 'rename'}
        onClose={() => { setModalMode(null); setActiveNotebook(null); }}
        onSuccess={(data) => handleAction(async () => console.log("Success:", data))}
        initialData={modalMode === 'rename' ? activeNotebook : undefined}
        workspaceId={workspaceId}
        title={modalMode === 'create' ? "New Collection" : "Rename Collection"}
      />

      {/* DELETE CONFIRMATION MODAL (Preserved) */}
      <DeleteConfirmModal 
        isOpen={modalMode === 'delete'}
        onClose={() => { setModalMode(null); setActiveNotebook(null); }}
        onConfirm={onConfirmDelete}
        itemName={activeNotebook?.name || ''}
        isDeleting={isDeleting}
      />

      {/* NEW SHARE MODAL INTEGRATION */}
      <ShareModal 
        isOpen={modalMode === 'share'}
        onClose={() => { setModalMode(null); setActiveNotebook(null); }}
        notebook={activeNotebook}
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

            {/* MODIFIED SHARE ACTION (ArrowUpRight) */}
            <div className="mt-12 flex items-center justify-end">
              <div 
                onClick={(e) => {
                  e.stopPropagation(); // CRITICAL: Stop navigation to notebook
                  setActiveNotebook(notebook);
                  setModalMode('share');
                }}
                className="w-12 h-12 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-400 group-hover:bg-zinc-900 group-hover:text-white transition-all duration-500 shadow-sm hover:scale-110 active:scale-95 cursor-pointer"
              >
                <ArrowUpRight size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}