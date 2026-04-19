"use client";
import React, { useState, useEffect, useRef } from 'react';
import {
  LayoutDashboard, Settings, PlusCircle, ChevronDown,
  Hash, Layers, X, Loader2, LogOut, MoreVertical,
  Trash2, Edit2, UserPlus, LogOut as LeaveIcon, Check, Search, User
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
function WorkspaceInviteModal ({ isOpen, onClose, workSpaceId }: {
  isOpen: boolean,
  onClose: () => void,
  workSpaceId: string
}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isInviting, setIsInviting] = useState(false);

  // Debounced Search Logic
  useEffect(() => {
    const search = async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }
      setIsSearching(true);
      try {
        const { data } = await api.get(`/users/search?searchTerm=${query}`);
        // Filter out users already in the selected list
        const filtered = data.filter((u: any) => !selectedUsers.find(s => s._id === u._id));
        setResults(filtered);
      } catch (e) {
        console.error("Search failed:", e);
      } finally {
        setIsSearching(false);
      }
    };

    const timer = setTimeout(search, 300);
    return () => clearTimeout(timer);
  }, [query, selectedUsers]);

  const handleInvite = async () => {
    setIsInviting(true);
    try {
      await api.post('/work-spaces/invite', {
        workSpaceId,
        userIds: selectedUsers.map(u => u._id)
      });
      setSelectedUsers([]);
      onClose();
    } catch (e) {
      console.error("Invite failed:", e);
    } finally {
      setIsInviting(false);
    }
  };

  const removeUser = (id: string) => {
    setSelectedUsers(selectedUsers.filter(u => u._id !== id));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl p-8 lg:p-10 animate-in zoom-in-95 duration-300">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
              <UserPlus size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-zinc-900 tracking-tight">Invite Members</h2>
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Workspace ID: {workSpaceId.slice(-6)}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-xl transition-all"><X size={20} /></button>
        </div>

        {/* Selected Users (Tags) */}
        <div className="flex flex-wrap gap-2 min-h-[40px] mb-6">
          {selectedUsers.length === 0 && (
            <p className="text-sm font-medium text-zinc-300 italic py-2">No users selected yet...</p>
          )}
          {selectedUsers.map(u => (
            <div
              key={u._id}
              className="flex items-center gap-2 px-3 py-2 bg-zinc-900 text-white rounded-xl text-[10px] font-black uppercase tracking-wider animate-in scale-in-90"
            >
              <span>{u.name}</span>
              <button
                onClick={() => removeUser(u._id)}
                className="hover:text-rose-400 transition-colors border-l border-white/20 pl-1 ml-1"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>

        {/* Search Input Container */}
        <div className="relative mb-8">
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400">
            {isSearching ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
          </div>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-14 pr-6 py-5 bg-zinc-50 border border-zinc-100 rounded-[24px] text-zinc-800 font-bold outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all"
          />

          {/* Search Results Dropdown */}
          {results.length > 0 && (
            <div className="absolute top-full left-0 w-full mt-3 bg-white border border-zinc-100 shadow-2xl rounded-[28px] overflow-hidden z-[160] animate-in slide-in-from-top-2">
              <div className="max-h-[280px] overflow-y-auto">
                {results.map(u => (
                  <button
                    key={u._id}
                    onClick={() => {
                      setSelectedUsers([...selectedUsers, u]);
                      setQuery('');
                      setResults([]);
                    }}
                    className="group w-full px-6 py-4 hover:bg-indigo-50 text-left flex items-center justify-between transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                        <User size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-zinc-900">{u.name}</p>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase">{u.email}</p>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-zinc-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Plus size={16} className="text-indigo-600" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={handleInvite}
          disabled={selectedUsers.length === 0 || isInviting}
          className="w-full py-5 bg-zinc-900 text-white rounded-[24px] font-black text-xs uppercase tracking-[0.2em] disabled:bg-zinc-100 disabled:text-zinc-400 transition-all active:scale-95 flex items-center justify-center gap-3"
        >
          {isInviting ? <Loader2 className="animate-spin" size={20} /> : "Send Invitations"}
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
      if (modalMode === 'invite') { /* Handled in Invite Modal */ }

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
        workSpaceId={selectedWorkspace?._id}
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
                  console.log("current workspace ->", currentWorkSpaceId, "workspace in loop ->", workSpace._id, "userId ->", user)
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
                                <button key="opt-invite" onClick={() => { setModalMode('invite'); setSelectedWorkspace(workSpace); setActiveMenuId(null); }} className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-zinc-600 hover:bg-zinc-50 rounded-xl transition-all cursor-pointer">
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