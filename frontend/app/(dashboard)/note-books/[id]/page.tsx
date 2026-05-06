"use client";
import React, { useState, useEffect } from 'react';
import {
  Share2, MoreHorizontal, ChevronLeft,
  Calendar, Menu, X, Check, Cloud, Plus, Save,
  Trash,
  Trash2,
  Loader2
} from 'lucide-react';
import { cn } from '@/utils/cn';
import Editor from '@/components/Editor';
import ShareModal from '@/components/modals/ShareModal';
import { useRouter, useParams } from 'next/navigation';
import api from '@/lib/axios/config';
import { useUserStore } from '@/store/useUserStore';


function DeleteConfirmModal ({ isOpen, onClose, onConfirm, itemName }: {
  isOpen: boolean,
  onClose: () => void,
  onConfirm: () => void,
  itemName: string,
}) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-[40px] shadow-2xl p-8 lg:p-10 animate-in zoom-in-95 duration-300 overflow-hidden text-center">
        <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <Trash2 size={32} className="text-rose-500" />
        </div>
        <h2 className="text-2xl font-black text-zinc-900 tracking-tight mb-2">Delete Note</h2>
        <p className="text-zinc-500 font-medium text-sm leading-relaxed mb-8">
          Are you sure you want to delete <span className="text-zinc-900 font-bold">"{itemName}"</span>?
          This action cannot be undone.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button onClick={onClose} className="flex-1 py-4 bg-zinc-100 text-zinc-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-zinc-200 transition-all active:scale-95 cursor-pointer">Cancel</button>
          <button onClick={onConfirm} className=" cursor-pointer flex-1 py-4 bg-rose-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-rose-600 transition-all active:scale-95 flex items-center justify-center gap-2">
            {"Delete Forever"}
          </button>
        </div>
      </div>
    </div>
  );
}
export default function NoteEditorPage () {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [openShareModal, setOpenShareModal] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [workspaceData, setWorkspaceData] = useState(null);
  const [activeNote, setActiveNote] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const { id: notebookId } = useParams();
  const { user } = useUserStore();

  // PERMISSION CHECK
  const isOwner = !workspaceData?.workSpaceId || workspaceData?.ownerId?._id === user?.id;

  // Since isOwner is already true when the workspace is null, 
  // canEdit can simply mirror isOwner.
  const canEdit = isOwner;

  const handleDeleteNote = async () => {
    if (!canEdit) return;
    try {
      await api.delete(`/notes/${noteToDelete?._id}`).then(async () => {
        setIsDeleteOpen(false);
        setNoteToDelete(null);
        setActiveNote(null);
        await fetchWorkspace();
      });
    } catch (error) {
      console.error(error);
    }
  };

  const fetchWorkspace = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/note-books/${notebookId}`);
      const mappedNotes = res.data.notes?.map(n => ({
        ...n,
        name: n.title || "Untitled Note",
        content: n.jsonBody || ""
      })) || [];

      setWorkspaceData({ ...res.data, notes: mappedNotes });
      if (mappedNotes.length > 0) {
        setActiveNote(mappedNotes[0]);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (notebookId) fetchWorkspace();
  }, [notebookId]);

  const handleAddNewNote = () => {
    if (!canEdit) return;
    setActiveNote({
      name: "",
      content: "",
      isNew: true
    });
    setSidebarOpen(false);
  };

  const handleNoteSelect = (note) => {
    setActiveNote({
      ...note,
      name: note.name || note.title,
      content: note.content || note.jsonBody
    });
    if (window.innerWidth < 1024) setSidebarOpen(false);
  };

  const handleManualSave = async () => {
    if (!activeNote || !canEdit) return;

    setIsSaving(true);
    const payload = {
      title: activeNote.name || "Untitled Note",
      jsonBody: activeNote.content,
      id: activeNote._id
    };

    try {
      if (activeNote._id) {
        await api.put(`/notes/${activeNote._id}`, payload);
        setWorkspaceData(prev => ({
          ...prev,
          notes: prev.notes.map(n => n._id === activeNote._id ? { ...activeNote, updatedAt: new Date().toISOString() } : n)
        }));
      } else {
        delete payload.id;
        payload['notebookId'] = notebookId;
        await api.post(`/notes`, payload);
        await fetchWorkspace();
      }
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setTimeout(() => setIsSaving(false), 600);
    }
  };

  if (loading) return <div className="h-full w-full flex items-center justify-center font-black text-zinc-300 animate-pulse">LOADING WORKSPACE...</div>;

  return (
    <>
      <h1 className="text-3xl lg:text-5xl font-black text-zinc-900 tracking-tighter text-glow-indigo pb-10">
        {workspaceData ? workspaceData.name : "My Collections"}
      </h1>
              <hr className='mb-3 border-zinc-100' />
      <div className="relative flex h-[calc(100vh-110px)] gap-4 lg:gap-6 overflow-hidden">

        {/* 1. SIDEBAR */}
        <aside className={cn(
          "absolute lg:relative z-40 w-70 sm:w-[320px] h-full transition-all duration-500 bg-zinc-50/50 backdrop-blur-xl border border-zinc-200/50 rounded-4xl p-4 flex flex-col",
          isSidebarOpen ? "left-0 shadow-2xl" : "-left-full lg:left-0 shadow-sm"
        )}>
          <div className="flex items-center justify-between px-4 py-3 mb-4">
            <div onClick={() => router.back()} className="flex items-center gap-3 cursor-pointer ">
              <ChevronLeft className="text-zinc-400 hover:text-indigo-600 " size={20} />
              <h2 className=" hover:text-indigo-600 text-[10px] font-black text-zinc-400 uppercase tracking-widest truncate max-w-[120px]">
                {workspaceData?.name}
              </h2>
            </div>
            {canEdit && (
              <button onClick={handleAddNewNote} className="p-2 bg-zinc-900 text-white rounded-xl active:scale-95 transition-all cursor-pointer">
                <Plus size={18} />
              </button>
            )}
          </div>

          <div className="flex-1 space-y-2 overflow-y-auto px-1 custom-scrollbar">
            {workspaceData?.notes?.map((note) => (
              <div
                key={note._id}
                onClick={() => handleNoteSelect(note)}
                className={cn(
                  "p-4 rounded-3xl cursor-pointer transition-all border",
                  activeNote?._id === note._id ? "bg-white shadow-sm border-zinc-200" : "border-transparent hover:bg-zinc-100/50"
                )}
              >
                <h4 className={cn("font-bold text-xs truncate", activeNote?._id === note._id ? "text-indigo-600" : "text-zinc-600")}>
                  {note.name || note.title}
                </h4>
                <p className="text-[9px] font-bold opacity-30 mt-1 uppercase">
                  {note.updatedAt ? new Date(note.updatedAt).toLocaleDateString() : "Draft"}
                </p>
              </div>
            ))}
          </div>
        </aside>

        {/* 2. MAIN EDITOR AREA */}
        <main className="flex-1 bg-white border border-zinc-200/50 rounded-4xl flex flex-col overflow-hidden relative shadow-sm">
          {activeNote ? (
            <>
              <header className="px-6 lg:px-10 py-4 border-b border-zinc-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-20">
                <div className="flex items-center gap-4 flex-1">
                  <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2.5 bg-zinc-100 rounded-xl"><Menu size={20} /></button>
                  <div className="flex flex-col flex-1">
                    <input
                      value={activeNote.name || ""}
                      onChange={(e) => canEdit && setActiveNote({ ...activeNote, name: e.target.value })}
                      readOnly={!canEdit}
                      className={cn(
                        "bg-transparent border-none focus:outline-none text-base lg:text-lg font-black text-zinc-900",
                        !canEdit && "cursor-default"
                      )}
                      placeholder="Enter Title..."
                    />
                    <div className="flex items-center gap-3 text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
                      <Calendar size={10} /> {new Date(activeNote.updatedAt || new Date()).toLocaleDateString()}
                      {canEdit && (
                        isSaving ? <span className="text-amber-500 animate-pulse ml-2">Saving...</span> : <span className="text-emerald-500 ml-2">Saved</span>
                      )}
                    </div>
                  </div>
                </div>

                {canEdit && (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleManualSave}
                      disabled={isSaving}
                      className="flex items-center gap-2 px-6 py-2.5 bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isSaving ? <Cloud size={14} className="animate-bounce" /> : <Save size={14} />}
                      {activeNote._id ? "Update" : "Save Now"}
                    </button>

                    {activeNote._id && (
                      <button
                        onClick={() => { setIsDeleteOpen(true); setNoteToDelete(activeNote); }}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-6 py-2.5 bg-red-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-all cursor-pointer disabled:opacity-50"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                )}
              </header>

              <div className="flex-1 overflow-y-auto">
                <Editor
                  key={activeNote._id || 'new-note-editor'}
                  initialContent={activeNote.content || activeNote.jsonBody}
                  editable={canEdit}
                  onChange={(newContent) => {
                    if (canEdit) setActiveNote(prev => ({ ...prev, content: newContent }));
                  }}
                />
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-10">
              <div className="w-20 h-20 bg-zinc-50 rounded-[32px] flex items-center justify-center text-zinc-200 mb-6 border border-zinc-100">
                <Plus size={40} />
              </div>
              <h2 className="text-xl font-black text-zinc-900 tracking-tighter mb-2">No Active Note</h2>
              <p className="text-sm text-zinc-400 font-bold max-w-xs mb-8">
                {canEdit ? "Click the button below to start writing." : "Select a note from the sidebar to view it."}
              </p>
              {canEdit && (
                <button onClick={handleAddNewNote} className="px-8 py-3 bg-zinc-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all cursor-pointer">
                  Create New Note
                </button>
              )}
            </div>
          )}
        </main>

        {openShareModal && <ShareModal isOpen={openShareModal} onClose={() => setOpenShareModal(false)} context="notebook" data={workspaceData} />}
        <DeleteConfirmModal
          isOpen={isDeleteOpen}
          onClose={() => { setIsDeleteOpen(false); setNoteToDelete(null); }}
          onConfirm={handleDeleteNote}
          itemName={noteToDelete?.title || noteToDelete?.name}
        />
      </div>
    </>
  );
}