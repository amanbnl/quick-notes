"use client";
import React, { useState, useEffect } from 'react';
import {
  Plus, Folder, Search, MoreHorizontal, ArrowUpRight,
  Edit2, X, Loader2, Trash2,
  UserPlus, Check, User, Ghost,
  ShieldCheck,
  Eye,
  Share2
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import api from '@/lib/axios/config';

// --- MODALS (KEEPING YOUR EXISTING LOGIC) ---

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
        <h2 className="text-2xl font-black text-zinc-900 tracking-tight mb-2">Delete Collection?</h2>
        <p className="text-zinc-500 font-medium text-sm leading-relaxed mb-8">
          Are you sure you want to delete <span className="text-zinc-900 font-bold">"{itemName}"</span>?
          This action cannot be undone.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button onClick={onClose} className="flex-1 py-4 bg-zinc-100 text-zinc-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-zinc-200 transition-all active:scale-95 cursor-pointer">Cancel</button>
          <button onClick={onConfirm} disabled={isDeleting} className=" cursor-pointer flex-1 py-4 bg-rose-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-rose-600 transition-all active:scale-95 flex items-center justify-center gap-2">
            {isDeleting ? <Loader2 className="animate-spin" size={18} /> : "Delete Forever"}
          </button>
        </div>
      </div>
    </div>
  );
}

function NotebookModal ({ isOpen, onClose, onSuccess, initialData, workspaceId, title }: {
  isOpen: boolean,
  onClose: () => void,
  onSuccess: (data: any) => void,
  initialData?: { name: string, color: string, workspaceId?: string | null },
  workspaceId: string | null,
  title: string
}) {
  const { register, handleSubmit, watch, setValue, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(z.object({
      name: z.string().min(2, "Name is too short").max(30),
      color: z.string(),
      workspaceId: z.string().optional().nullable()
    })),
    defaultValues: initialData || {
      name: '',
      color: 'bg-indigo-500',
      workspaceId: workspaceId || undefined
    }
  });

  useEffect(() => {
    if (isOpen) reset(initialData || { name: '', color: 'bg-indigo-500', workspaceId: workspaceId || null });
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
          <h2 className="text-2xl font-black text-zinc-900 tracking-tight">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-xl transition-all cursor-pointer"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit(onSuccess)} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-800 ml-1">Collection Name</label>
            <input {...register('name')} autoFocus className={cn("w-full px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-zinc-800 font-bold outline-none transition-all", errors.name ? "border-rose-500 ring-4 ring-rose-500/5" : "focus:bg-white focus:border-indigo-500")} placeholder="e.g. Design Systems" />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-800 ml-1">Theme Color</label>
            <div className="flex flex-wrap gap-3 my-1">
              {colors.map((c) => (
                <button key={c.name} type="button" onClick={() => setValue('color', c.class)} className={cn("w-10 h-10 rounded-full transition-all active:scale-90 cursor-pointer", c.class, selectedColor === c.class ? "ring-4 ring-offset-2 ring-zinc-900" : "opacity-40 hover:opacity-100")} />
              ))}
            </div>
          </div>
          <button type="submit" disabled={isSubmitting} className="cursor-pointer w-full py-4 bg-zinc-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-zinc-800 transition-all active:scale-95 flex items-center justify-center gap-2">
            {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}

function ShareModal ({ isOpen, onClose, notebook }: {
  isOpen: boolean,
  onClose: () => void,
  notebook: any
}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  // Search Logic
  useEffect(() => {
    const search = async () => {
      if (query.length < 2) return setResults([]);
      setIsSearching(true);
      try {
        const { data } = await api.get(`/users/search?searchTerm=${query}`);
        // Exclude already selected
        setResults(data.filter((u: any) => !selectedUsers.find(s => s._id === u._id)));
      } catch (e) {
        console.error(e);
      } finally {
        setIsSearching(false);
      }
    };
    const t = setTimeout(search, 300);
    return () => clearTimeout(t);
  }, [query, selectedUsers]);

  const toggleRole = (userId: string) => {
    setSelectedUsers(prev => prev.map(u =>
      u._id === userId
        ? { ...u, role: u.role === 'viewer' ? 'editor' : 'viewer' }
        : u
    ));
  };

  const handleShare = async () => {
    setIsSharing(true);
    try {
      await api.post(`/note-books/${notebook._id}/share`, {
        invites: selectedUsers.map(u => ({ userId: u._id, role: u.role }))
      });
      setSelectedUsers([]);
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSharing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm animate-in fade-in" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl p-8 lg:p-10 animate-in zoom-in-95 overflow-hidden">
        {/* Decorative Top Accent */}
        <div className={cn("absolute top-0 left-0 w-full h-2", notebook?.color || 'bg-indigo-500')} />

        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center text-zinc-900">
              <Share2 size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-zinc-900 tracking-tight">Share Collection</h2>
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{notebook?.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="cursor-pointer p-2 hover:bg-zinc-100 rounded-xl transition-all text-zinc-800"><X size={20} /></button>
        </div>

        {/* Selected Users List */}
        {/* <div className="space-y-2 mb-6 max-h-40 overflow-y-auto custom-scrollbar">
          {selectedUsers.map(u => (
            <div key={u._id} className="flex items-center justify-between p-3 bg-zinc-50 rounded-2xl border border-zinc-100 animate-in slide-in-from-right-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-zinc-400 border border-zinc-100">
                  <User size={14} />
                </div>
                <span className="text-sm font-bold text-zinc-900">{u.fullName}</span>
              </div>
            
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleRole(u._id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-zinc-200 rounded-lg text-[10px] font-black uppercase tracking-tighter hover:border-indigo-500 transition-colors text-zinc-600 cursor-pointer"
                >
                  {u.role === 'editor' ? <ShieldCheck size={12} className="text-indigo-600" /> : <Eye size={12} />}
                  {u.role}
                </button>
                <button onClick={() => setSelectedUsers(selectedUsers.filter(x => x._id !== u._id))} className=" cursor-pointer p-1.5 text-zinc-400 hover:text-rose-500">
                  <X size={16} />
                </button>
              </div>
            </div>
          ))}
        </div> */}
        {/* Updated User Tags Section */}
        <div className="flex flex-wrap gap-2 mb-6 max-h-32 overflow-y-auto custom-scrollbar">
          {selectedUsers.map(u => (
            <div
              key={u._id}
              className="group flex items-center gap-2 pl-3 pr-2 py-1.5 bg-zinc-900 text-white rounded-xl border border-zinc-800 animate-in zoom-in-95 duration-200"
            >
              <span className="text-[10px] font-black uppercase tracking-wider truncate max-w-[120px]">
                {u.fullName}
              </span>

              <button
                onClick={() => setSelectedUsers(selectedUsers.filter(x => x._id !== u._id))}
                className="p-0.5 hover:bg-white/20 rounded-md transition-colors cursor-pointer"
              >
                <X size={14} className="text-zinc-400 group-hover:text-white" />
              </button>
            </div>
          ))}

          {selectedUsers.length === 0 && (
            <div className="w-full text-center py-2">
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">No members selected</p>
            </div>
          )}
        </div>
        {/* Search Input */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search collaborators..."
            className=" text-zinc-800 w-full pl-12 pr-4 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none font-bold placeholder:text-zinc-600 focus:bg-white focus:border-indigo-500 transition-all"
          />

          {/* Search Results Dropdown */}
          {(results.length > 0 || (query.length >= 2 && !isSearching)) && (
            <div className="absolute top-full left-0 w-full mt-2 bg-white border border-zinc-100 shadow-2xl rounded-2xl overflow-hidden z-10 animate-in fade-in slide-in-from-top-2">
              {results.length > 0 ? (
                results.map(u => (
                  <button
                    key={u._id}
                    onClick={() => {
                      setSelectedUsers([...selectedUsers, { ...u, role: 'viewer' }]);
                      setQuery('');
                      setResults([]);
                    }}
                    className="w-full px-6 py-4 hover:bg-zinc-50 text-left flex items-center justify-between group transition-colors cursor-pointer"
                  >
                    <div className="flex flex-col">
                      <span className="font-bold text-zinc-900 text-sm">{u.name}</span>
                      {/* Removed uppercase class here */}
                      <span className="text-[10px] text-zinc-400 font-bold">{u.email}</span>
                    </div>
                    <Check size={16} className="text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))
              ) : (
                /* No User Found State */
                <div className="px-6 py-8 text-center">
                  <p className="text-sm font-bold text-zinc-400">No user found for "{query}"</p>
                </div>
              )}
            </div>
          )}
        </div>

        <button
          onClick={handleShare}
          disabled={selectedUsers.length === 0 || isSharing}
          className="w-full py-5 bg-zinc-900 text-white rounded-[24px] font-black text-xs uppercase tracking-[0.2em] hover:bg-zinc-800 disabled:bg-zinc-100 disabled:text-zinc-400 transition-all active:scale-95 flex items-center justify-center gap-3"
        >
          {isSharing ? <Loader2 className="animate-spin" size={18} /> : "Invite to Collection"}
        </button>
      </div>
    </div>
  );
}
// --- MAIN DASHBOARD ---

export default function NotesDashboard () {
  const searchParams = useSearchParams();
  const router = useRouter();

  const workspaceId = searchParams.get('workSpace');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [notebooks, setNotebooks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [modalMode, setModalMode] = useState<'create' | 'rename' | 'delete' | 'share' | null>(null);
  const [activeNotebook, setActiveNotebook] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    if (openMenuId) window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [openMenuId]);

  const fetchNoteBooks = async () => {
    setIsLoading(true);
    try {
      const listURL = workspaceId ? `/note-books/list?workSpaceId=${workspaceId}` : '/note-books/list';
      const noteBookListResp = await api.get(listURL);
      const noteBookList = noteBookListResp.data;
      setNotebooks(noteBookList.map((nb: any) => ({
        ...nb,
        color: ['bg-indigo-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500'][Math.floor(Math.random() * 4)]
      })));
    } catch (error) {
      console.log('error while loading notebooks ->', error)
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchNoteBooks();
  }, [workspaceId]);

  const handleAction = async (action: () => Promise<void>) => {
    await action();
    setModalMode(null);
    setActiveNotebook(null);
    fetchNoteBooks();
  };

  const onConfirmDelete = async () => {
    setIsDeleting(true);
    // Add your API call here: await api.delete(`/note-books/${activeNotebook._id}`)
    await api.delete(`/note-books/${activeNotebook._id}`)
    setIsDeleting(false);
    handleAction(async () => { });
  };
  const creteNoteBook = async (data: any) => {
    try {
      if (modalMode === 'rename') {

        await api.put(`/note-books/${activeNotebook._id}`, {
          id: activeNotebook._id,
          name: data.name,
          workSpaceId: data.workspaceId || null
        })
        return
      }
      console.log("data ->", data);
      await api.post('/note-books', {
        name: data.name,
        workSpaceId: data.workspaceId || null,
      });

    } catch (error) {
      console.log("Error creating notebook ->", error);
    }
  }
  return (
    <div className="max-w-350 mx-auto px-4 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* MODALS */}
      <NotebookModal
        isOpen={modalMode === 'create' || modalMode === 'rename'}
        onClose={() => { setModalMode(null); setActiveNotebook(null); }}
        onSuccess={(data) => handleAction(async () => creteNoteBook(data))}
        initialData={modalMode === 'rename' ? activeNotebook : undefined}
        workspaceId={workspaceId}
        title={modalMode === 'create' ? "New Collection" : "Rename Collection"}
      />

      <DeleteConfirmModal
        isOpen={modalMode === 'delete'}
        onClose={() => { setModalMode(null); setActiveNotebook(null); }}
        onConfirm={onConfirmDelete}
        itemName={activeNotebook?.name || ''}
        isDeleting={isDeleting}
      />

      <ShareModal
        isOpen={modalMode === 'share'}
        onClose={() => { setModalMode(null); setActiveNotebook(null); }}
        notebook={activeNotebook}
      />

      {/* HEADER */}
      <header className="flex flex-col gap-6 mb-10 lg:mb-16">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl lg:text-5xl font-black text-zinc-900 tracking-tighter text-glow-indigo">My Collections</h1>
          </div>
          {notebooks.length > 0 && (
            <button onClick={() => setModalMode('create')} className="group flex items-center justify-center gap-2 px-6 py-4 bg-zinc-900 text-white rounded-[20px] font-bold hover:bg-zinc-800 transition-all cursor-pointer active:scale-95 shadow-xl shadow-zinc-200">
              <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
              <span>Create Notebook</span>
            </button>
          )}
        </div>
        <hr className='mb-3 border-zinc-100' />
      </header>

      {/* MAIN CONTENT AREA */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-zinc-300" size={48} />
        </div>
      ) : notebooks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10">
          {notebooks.map((notebook) => (
            <div
              key={notebook._id}
              onClick={() => router.push(`/note-books/${notebook._id}`)}
              /* FIX 1: Added 'flex flex-col' and 'h-full' to make the card a flex container */
              className="group relative bg-white border border-zinc-200/50 rounded-[32px] lg:rounded-[40px] p-6 lg:p-8 hover:shadow-[0_40px_80px_-12px_rgba(0,0,0,0.08)] transition-all duration-500 cursor-pointer border-b-4 active:translate-y-0.5 flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-10 relative shrink-0">
                <div className={cn("w-14 h-14 lg:w-16 lg:h-16 rounded-2xl flex items-center justify-center text-white shadow-xl transform group-hover:rotate-6 transition-transform", notebook.color)}>
                  <Folder size={28} />
                </div>
                <div className="relative">
                  <button onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === notebook._id ? null : notebook._id); }} className="p-2 text-zinc-300 cursor-pointer hover:text-zinc-900 hover:bg-zinc-50 rounded-xl transition-all">
                    <MoreHorizontal size={24} />
                  </button>
                  {openMenuId === notebook._id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white/95 border border-zinc-200 shadow-2xl rounded-2xl p-2 z-[60] animate-in fade-in zoom-in-95 duration-200">
                      <button onClick={(e) => { e.stopPropagation(); setActiveNotebook(notebook); setModalMode('rename'); setOpenMenuId(null); }} className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-zinc-600 hover:bg-zinc-50 rounded-xl transition-all group/item cursor-pointer">
                        <Edit2 size={14} className="group-hover/item:text-indigo-600" /> Rename
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); setActiveNotebook(notebook); setModalMode('delete'); setOpenMenuId(null); }} className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-rose-500 hover:bg-rose-50 rounded-xl transition-all cursor-pointer">
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Content wrapper */}
              <div className="flex-1">
                <h3 className="text-2xl lg:text-3xl font-black text-zinc-900 mb-2 tracking-tighter group-hover:text-indigo-600 transition-colors line-clamp-2">
                  {notebook.name}
                </h3>
                <p className="text-sm font-bold text-zinc-400">{notebook.notes?.length || 0} {notebook.notes?.length === 1 ? 'Note': 'Notes'} </p>
              </div>

              {/* FIX 2: Replaced 'mt-12' with 'mt-auto' and added 'pt-6' for breathing room */}
              <div className="mt-auto pt-6 flex items-center justify-end">
                <div
                  onClick={(e) => { e.stopPropagation(); setActiveNotebook(notebook); setModalMode('share'); }}
                  className="w-12 h-12 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-400 group-hover:bg-zinc-900 group-hover:text-white transition-all duration-500 shadow-sm hover:scale-110 active:scale-95"
                >
                  <ArrowUpRight size={24} />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* --- CREATIVE EMPTY STATE --- */
        <div className="flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-500">
          <div className="relative mb-10">
            {/* Layered Decorative Elements */}
            <div className="absolute inset-0 bg-indigo-100/50 blur-[80px] rounded-full scale-150" />
            <div className="relative w-28 h-28 lg:w-36 lg:h-36 bg-zinc-50 rounded-[40px] flex items-center justify-center text-zinc-200 rotate-6 shadow-sm border border-zinc-100">
              <Folder size={64} strokeWidth={1.5} />
            </div>
            <div className="absolute -top-4 -right-4 w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center text-white shadow-xl -rotate-12 animate-bounce">
              <Plus size={24} strokeWidth={3} />
            </div>
          </div>

          <h2 className="text-3xl lg:text-4xl font-black text-zinc-900 tracking-tight mb-4">
            Your shelf is empty
          </h2>
          <p className="text-zinc-500 font-medium max-w-sm mx-auto mb-10 leading-relaxed">
            Every great idea needs a home. Create your first collection to start organizing your workspace.
          </p>

          <button
            onClick={() => setModalMode('create')}
            className="cursor-pointer flex items-center gap-3 px-10 py-5 bg-zinc-900 text-white rounded-[24px] font-black text-xs uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all active:scale-95 shadow-2xl shadow-zinc-200"
          >
            <Plus size={18} />
            Create First Collection
          </button>
        </div>
      )}
    </div>
  );
}