"use client";
import React, { useState, useEffect, useRef } from 'react';
import {
  LayoutDashboard, Settings, PlusCircle, ChevronDown,
  Hash, Layers, X, Loader2, LogOut, MoreVertical,
  Trash2, Edit2, UserPlus, LogOut as LeaveIcon, Check, Search, User,
  Share2,
  ShieldCheck,
  Eye
} from 'lucide-react';
import { cn } from '@/utils/cn';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { deleteCookie } from 'cookies-next';
import api from '@/lib/axios/config'; // Assuming your axios instance is here
import { useUserStore } from '@/store/useUserStore';

const workspaceSchema = z.object({
  name: z.string().min(2, "Workspace name is too short").max(25),
});

// --- REUSABLE WORKSPACE MODAL (CREATE/RENAME) ---
function WorkspaceModal ({ isOpen, onClose, onSuccess, initialData }: {
  isOpen: boolean,
  onClose: () => void,
  onSuccess: (data: any) => void,
  initialData?: { id: string, name: string }
}) {
  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(workspaceSchema),
  });

  useEffect(() => {
    if (isOpen) {
      reset();
      if (initialData) setValue('name', initialData.name);
    }
  }, [isOpen, initialData, reset, setValue]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm animate-in fade-in" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-[32px] shadow-2xl p-8 animate-in zoom-in-95 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-indigo-600" />
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black text-zinc-900 tracking-tight">
            {initialData ? "Rename Workspace" : "New Workspace"}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-xl transition-all cursor-pointer"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit(onSuccess)} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Workspace Name</label>
            <input {...register('name')} autoFocus className={cn("w-full px-5 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-zinc-900 font-bold outline-none", errors.name ? "border-rose-500" : "focus:border-indigo-500")} />
            {errors.name && <p className="text-[10px] font-black text-rose-500 uppercase">{errors.name.message}</p>}
          </div>
          <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-zinc-800 transition-all cursor-pointer">
            {isSubmitting ? <Loader2 className="animate-spin mx-auto" size={18} /> : (initialData ? "Update Workspace" : "Create Workspace")}
          </button>
        </form>
      </div>
    </div>
  );
}

// --- WORKSPACE INVITATION MODAL ---


function WorkspaceInviteModal ({ isOpen, onClose, workSpace }: {
  isOpen: boolean,
  onClose: () => void,
  workSpace: any
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
      await api.post(`/work-spaces/invite`, {
        workSpaceId: workSpace._id,
        userIds: selectedUsers.map(u => (u._id))
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
        <div className={cn("absolute top-0 left-0 w-full h-2", workSpace?.color || 'bg-indigo-500')} />

        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center text-zinc-900">
              <Share2 size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-zinc-900 tracking-tight">Share Collection</h2>
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{workSpace?.name}</p>
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
          {isSharing ? <Loader2 className="animate-spin" size={18} /> : "Invite to work Space"}
        </button>
      </div>
    </div>
  );
}
// --- DELETE PROMPT MODAL ---
function DeleteWorkspacePrompt ({ isOpen, onClose, onConfirm, isDeleting }: { isOpen: boolean, onClose: () => void, onConfirm: () => void, isDeleting: boolean }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm animate-in fade-in" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-white rounded-[32px] p-8 text-center animate-in zoom-in-95">
        <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-rose-500"><Trash2 size={32} /></div>
        <h2 className="text-xl font-black text-zinc-900 mb-2">Delete Workspace?</h2>
        <p className="text-sm font-medium text-zinc-500 mb-8">This action cannot be undone and all data will be permanently removed.</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 bg-zinc-100 rounded-xl font-bold text-xs cursor-pointer">Cancel</button>
          <button onClick={onConfirm} className="flex-1 py-3 bg-rose-500 text-white rounded-xl font-bold text-xs cursor-pointer">
            {isDeleting ? <Loader2 className="animate-spin mx-auto" size={18} /> : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Sidebar () {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentWorkSpaceId = searchParams.get('workSpace');

  const [workSpaces, setWorkSpaces] = useState<any[]>([]);
  const [isWorkSpacesOpen, setIsWorkSpacesOpen] = useState(true);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Modal States
  const [modalMode, setModalMode] = useState<'create' | 'rename' | 'invite' | 'delete' | null>(null);
  const [selectedWorkspace, setSelectedWorkspace] = useState<any>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  // Current User (Replace with your actual user context/store)
  const { user, setUser } = useUserStore(); // Debugging line
  const fetchWorkspaces = async () => {
    try {
      const { data } = await api.get('/work-spaces/list');
      if (data.length == 0) {
        router.push('/note-books')
      }
      setWorkSpaces(data.map((ws: any) => ({
        ...ws,
        color: ['text-rose-500', 'text-amber-500', 'text-indigo-500', 'text-emerald-500'][Math.floor(Math.random() * 4)]
      })));
    } catch (e) { console.error(e); }
  };
  const fetchUserDetails = async () => {
    if (!user?.id) return;
    const userDetailsResp = await api.get(`/users/${user?.id}`);
    const userDetails = userDetailsResp.data;

    if (userDetails) {
      setUser({
        id: userDetails._id,
        fullName: userDetails.fullName,
        email: userDetails.email,
        profile: {
          bio: '',
          experience: [],
          education: [],
          certifications: [],
          languages: [],
          avatarUrl: undefined
        }
      });
    }
  }
  useEffect(() => {
    fetchWorkspaces();
  }, []);

  useEffect(() => {
    fetchUserDetails()
  }, [user?.id])

  const handleWorkspaceAction = async (data?: any) => {
    setIsActionLoading(true);
    try {
      if (modalMode === 'create') await api.post('/work-spaces', data);
      if (modalMode === 'rename') await api.put(`/work-spaces/${selectedWorkspace._id}`, data);
      if (modalMode === 'delete') await api.delete(`/work-spaces/${selectedWorkspace._id}`);

      await fetchWorkspaces();
      setModalMode(null);
      setSelectedWorkspace(null);
    } catch (e) { console.error(e); } finally { setIsActionLoading(false); }
  };

  const handleLeaveWorkspace = async (wsId: string) => {
    try {
      await api.post('/work-spaces/revoke-access', { userIds: [user?.id], workSpaceId: wsId });
      fetchWorkspaces();
    } catch (e) { console.error(e); }
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    deleteCookie('auth_token');
    deleteCookie('user-storage')
    router.push('/login');
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'My Library', href: '/note-books' },
    { icon: Settings, label: 'Settings', href: '/settings' },
  ];

  return (
    <>
      {/* MODALS */}
      <WorkspaceModal
        isOpen={modalMode === 'create' || modalMode === 'rename'}
        onClose={() => setModalMode(null)}
        onSuccess={handleWorkspaceAction}
        initialData={modalMode === 'rename' ? selectedWorkspace : undefined}
      />
      <WorkspaceInviteModal
        isOpen={modalMode === 'invite'}
        onClose={() => setModalMode(null)}
        workSpace={selectedWorkspace}
      />
      <DeleteWorkspacePrompt
        isOpen={modalMode === 'delete'}
        onClose={() => setModalMode(null)}
        onConfirm={handleWorkspaceAction}
        isDeleting={isActionLoading}
      />

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex w-72 h-screen sticky top-0 bg-zinc-50/50 border-r border-zinc-200/50 flex-col p-6 overflow-y-auto">
        <div className="flex items-center gap-3 px-2 mb-10 shrink-0">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <Layers className="text-white" size={22} />
          </div>
          <span className="text-xl font-black tracking-tight text-zinc-900">ProNotes.</span>
        </div>

        <nav className="flex-1 flex flex-col gap-8 min-h-0">
          <section className="space-y-1">
            <p className="px-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3">Menu</p>
            {menuItems.map((item) => {
              const isActive = pathname === item.href && !currentWorkSpaceId;
              return (
                <Link key={item.label} href={item.href} className={cn(
                  "group flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300",
                  isActive ? "bg-white text-indigo-600 shadow-sm ring-1 ring-zinc-200/50" : "text-zinc-500 hover:bg-zinc-100"
                )}>
                  <item.icon size={18} />
                  <span className="text-sm font-bold">{item.label}</span>
                </Link>
              );
            })}
          </section>

          <section className="space-y-1">
            <button
              onClick={() => setIsWorkSpacesOpen(!isWorkSpacesOpen)}
              className="cursor-pointer w-full flex items-center justify-between px-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3 group hover:text-zinc-600 transition-colors"
            >
              <span>Workspaces</span>
              <ChevronDown size={14} className={cn("transition-transform duration-300", isWorkSpacesOpen ? "" : "-rotate-90")} />
            </button>

            {isWorkSpacesOpen && (
              <div className="space-y-1 animate-in slide-in-from-top-2 duration-300">
                {workSpaces.map((workSpace) => {
                  const isActive = currentWorkSpaceId === workSpace._id;
                  const isOwner = workSpace.ownerId === user?.id;

                  return (
                    <div key={`ws-container-${workSpace._id}`} className="relative group/ws">
                      <Link
                        href={`/note-books?workSpace=${workSpace._id}`}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 pr-12",
                          isActive ? "bg-white text-zinc-900 shadow-sm ring-1 ring-zinc-200/50" : "text-zinc-500 hover:bg-zinc-100"
                        )}
                      >
                        <Hash size={18} className={cn("transition-colors", isActive ? workSpace.color : "text-zinc-300")} />
                        <span className="text-sm font-bold truncate">{workSpace.name}</span>
                      </Link>

                      <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover/ws:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation(); // 2. Important: Stop the Link from triggering
                            setActiveMenuId(activeMenuId === workSpace._id ? null : workSpace._id);
                          }}
                          className="p-1.5 hover:bg-zinc-200 rounded-lg text-zinc-400 cursor-pointer"
                        >
                          <MoreVertical size={14} />
                        </button>

                        {activeMenuId === workSpace._id && (
                          <div
                            onMouseLeave={() => setActiveMenuId(null)}
                            /* 3. Added a stopPropagation here so clicking inside the menu doesn't trigger the Link */
                            onClick={(e) => e.stopPropagation()}
                            className="absolute right-0 mt-1 w-60 -top-5 bg-white border border-zinc-100 shadow-2xl rounded-2xl p-1.5 z-50"
                          >
                            {isOwner ? (
                              /* 4. Use a div instead of a Fragment if the linter is still complaining, 
                                 but keying the specific buttons usually solves it */
                              <div className="flex flex-col gap-0.5">
                                <button key="opt-invite" onClick={() => { console.log("workspace => ", workSpace); setModalMode('invite'); setSelectedWorkspace(workSpace); setActiveMenuId(null); }} className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-zinc-600 hover:bg-zinc-50 rounded-xl transition-all cursor-pointer">
                                  <UserPlus size={14} /> Invite Members
                                </button>
                                <button key="opt-rename" onClick={() => { setModalMode('rename'); setSelectedWorkspace(workSpace); setActiveMenuId(null); }} className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-zinc-600 hover:bg-zinc-50 rounded-xl transition-all cursor-pointer">
                                  <Edit2 size={14} /> Rename
                                </button>
                                <div className="h-[1px] bg-zinc-100 my-1" />
                                <button key="opt-delete" onClick={() => { setModalMode('delete'); setSelectedWorkspace(workSpace); setActiveMenuId(null); }} className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-rose-500 hover:bg-rose-50 rounded-xl transition-all cursor-pointer">
                                  <Trash2 size={14} /> Delete Workspace
                                </button>
                              </div>
                            ) : (
                              <button key="opt-leave" onClick={() => { handleLeaveWorkspace(workSpace._id); setActiveMenuId(null); }} className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-rose-500 hover:bg-rose-50 rounded-xl transition-all cursor-pointer">
                                <LeaveIcon size={14} /> Leave Workspace
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                <button
                  key="btn-create-new" // 5. Don't forget the static items in the list!
                  onClick={() => setModalMode('create')}
                  className="cursor-pointer w-full flex items-center gap-3 px-4 py-3 text-zinc-400 hover:text-indigo-600 transition-all rounded-2xl hover:bg-indigo-50/50 border border-dashed border-transparent hover:border-indigo-200 mt-2 group"
                >
                  <PlusCircle size={18} className="group-hover:rotate-90 transition-transform" />
                  <span className="text-xs font-black uppercase tracking-wider">Create New</span>
                </button>
              </div>
            )}
          </section>
        </nav>

        <div className="mt-auto shrink-0 pt-6 space-y-4">
          <div className="flex items-center justify-between px-2 bg-zinc-100/50 p-4 rounded-[24px] border border-zinc-200/30">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 shrink-0 rounded-full bg-indigo-100 border-2 border-white shadow-sm flex items-center justify-center text-[10px] font-black text-indigo-600">
                AR
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-black text-zinc-900 truncate">{user?.fullName}</p>
                {/* <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-tighter">Pro Plan</p> */}
              </div>
            </div>
            <button onClick={handleLogout} className="p-2 text-zinc-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all cursor-pointer group">
              <LogOut size={18} className="group-hover:-translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </aside>

      {/* MOBILE BOTTOM NAV */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-zinc-200 px-6 py-3 flex justify-between items-center z-50">
        <Link href="/note-books" className={cn("p-3 rounded-2xl", pathname === '/note-books' && !currentWorkSpaceId ? "text-indigo-600 bg-indigo-50" : "text-zinc-400")}>
          <LayoutDashboard size={24} />
        </Link>
        <button onClick={() => setModalMode('create')} className="cursor-pointer w-12 h-12 bg-zinc-900 text-white rounded-2xl flex items-center justify-center shadow-lg active:scale-95 transition-all">
          <PlusCircle size={24} />
        </button>
        <button onClick={handleLogout} className="p-3 text-zinc-400 rounded-2xl hover:text-rose-500 cursor-pointer">
          <LogOut size={24} />
        </button>
      </nav>
    </>
  );
}