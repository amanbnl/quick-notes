"use client";
import React, { useState, useEffect } from 'react';
import {
  Settings, Users, Trash2, ShieldAlert,
  ChevronLeft, Loader2, UserMinus,
  AlertTriangle, Save, UserPlus, FolderOpen,
  Share2, Search, Check, X
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useRouter, useParams } from 'next/navigation';
import api from '@/lib/axios/config';
import { useUserStore } from '@/store/useUserStore';

// --- MODAL COMPONENT (Updated with dynamic props) ---
function DeleteConfirmModal ({ isOpen, onClose, onConfirm, title, description, buttonText }: {
  isOpen: boolean,
  onClose: () => void,
  onConfirm: () => void,
  title: string,
  description: string | React.ReactNode,
  buttonText: string
}) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-[40px] shadow-2xl p-8 lg:p-10 animate-in zoom-in-95 duration-300 overflow-hidden text-center">
        <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <Trash2 size={32} className="text-rose-500" />
        </div>
        <h2 className="text-2xl font-black text-zinc-900 tracking-tight mb-2">{title}</h2>
        <p className="text-zinc-500 font-medium text-sm leading-relaxed mb-8">
          {description}
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button onClick={onClose} className="flex-1 py-4 bg-zinc-100 text-zinc-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-zinc-200 transition-all active:scale-95 cursor-pointer">Cancel</button>
          <button onClick={onConfirm} className="cursor-pointer flex-1 py-4 bg-rose-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-rose-600 transition-all active:scale-95 flex items-center justify-center gap-2">
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function WorkspaceSettings () {
  const router = useRouter();
  const params = useParams();
  const { user } = useUserStore();
  const workspaceId = params.id;

  const [activeSection, setActiveSection] = useState<'general' | 'users' | 'danger'>('general');
  const [workspace, setWorkspace] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  // --- NEW MODAL STATE ---
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({ title: '', description: '' as React.ReactNode, buttonText: '' });
  const [onConfirmAction, setOnConfirmAction] = useState<() => void>(() => () => { });

  const fetchData = async () => {
    try {
      const { data } = await api.get(`/work-spaces/${workspaceId}`);
      const wsData = data;
      if (!wsData) {
        router.push('/note-books');
        return;
      }
      if (wsData.ownerId?._id !== user?.id) {
        router.push(`/note-books?workSpace=${workspaceId}`);
        return;
      }
      setWorkspace(wsData);
      setNewName(wsData.name);
    } catch (e) {
      console.error(e);
      router.push('/note-books');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (user?.id) fetchData();
  }, [workspaceId, user?.id, router]);

  const handleUpdateName = async () => {
    setIsSaving(true);
    try {
      await api.put(`/work-spaces/${workspaceId}`, { name: newName });
      setWorkspace({ ...workspace, name: newName });
      window.location.href = `/workspace/${workspaceId}/settings`
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  // --- REFACTORED API CALL (Internal) ---
  const performRemoveMember = async (userIds: string[]) => {
    try {
      await api.post(`/work-spaces/revoke-access`, { userIds, workSpaceId: workspaceId });
      setWorkspace({
        ...workspace,
        users: workspace.users.filter((u: any) => !userIds.includes(u._id)),
        memberCount: workspace.memberCount - userIds.length
      });
      setSelectedUsers([]);
      setIsDeleteOpen(false);
      await fetchData()
    } catch (e) {
      console.error(e);
    }
  };

  const performDeleteWorkspace = async () => {
    try {
      await api.delete(`/work-spaces/${workspaceId}`);
      setIsDeleteOpen(false);
      window.location.href = '/note-books'
    } catch (e) {
      console.error(e);
    }
  };

  // --- TRIGGER MODAL FOR USERS ---
  const handleRemoveMemberClick = (userIds: string[]) => {
    setModalConfig({
      title: "Remove Members?",
      description: `Are you sure you want to remove ${userIds.length} member(s) from this workspace? They will lose access to all notes.`,
      buttonText: "Remove Access"
    });
    setOnConfirmAction(() => () => performRemoveMember(userIds));
    setIsDeleteOpen(true);
  };

  // --- TRIGGER MODAL FOR WORKSPACE ---
  const handleDeleteWorkspaceClick = () => {
    setModalConfig({
      title: "Delete Workspace?",
      description: (
        <>Are you sure you want to delete <span className="text-zinc-900 font-bold">{workspace?.name}</span>? This action is permanent.</>
      ),
      buttonText: "Delete Forever"
    });
    setOnConfirmAction(() => () => performDeleteWorkspace());
    setIsDeleteOpen(true);
  };

  const toggleSelectAll = () => {
    if (selectedUsers.length === (workspace?.users?.length || 0)) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(workspace.users.map((u: any) => u._id));
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-white">
      <Loader2 className="animate-spin text-indigo-600" size={40} />
    </div>
  );

  return (
    <div className="max-w-[1200px] mx-auto py-10 px-6 pb-20 animate-in fade-in duration-700">

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-4">
          <button
            onClick={() => router.back()}
            className="cursor-pointer flex items-center gap-2 text-zinc-400 hover:text-indigo-600 transition-colors group text-[10px] font-black uppercase tracking-[0.2em]"
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </button>
          <div>
            <h1 className="text-4xl lg:text-5xl font-black text-zinc-900 tracking-tighter">
              Workspace <span className="text-indigo-600">Settings</span>
            </h1>
            <p className="text-zinc-500 font-medium text-sm mt-2">Manage your Workspace's identity and team access.</p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-indigo-50 px-4 py-2 rounded-2xl border border-indigo-100">
          <Users size={18} className="text-indigo-600" />
          <span className="text-indigo-700 font-black text-xs uppercase tracking-widest">
            {workspace?.memberCount || 0} Member{(workspace?.memberCount || 0) !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

        {/* SIDEBAR NAVIGATION */}
        <div className="lg:col-span-3 space-y-2">
          {[
            { id: 'general', label: 'General', icon: Settings },
            { id: 'users', label: 'User Management', icon: Users },
            { id: 'danger', label: 'Danger Zone', icon: ShieldAlert, color: 'text-rose-500' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id as any)}
              className={cn(
                "w-full flex items-center gap-4 px-5 py-4 rounded-[24px] transition-all duration-300 cursor-pointer active:scale-95",
                activeSection === item.id
                  ? "bg-indigo-600 text-white shadow-xl shadow-indigo-100"
                  : "text-zinc-500 hover:bg-zinc-100/80"
              )}
            >
              <item.icon size={20} className={activeSection === item.id ? "text-white" : item.color || "text-zinc-400"} />
              <span className="text-sm font-black tracking-tight">{item.label}</span>
            </button>
          ))}
        </div>

        {/* CONTENT AREA */}
        <div className="lg:col-span-9">
          <div className="bg-white border border-zinc-200/60 rounded-[40px] shadow-sm p-8 lg:p-12 min-h-[500px]">

            {activeSection === 'general' && (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                <div>
                  <h3 className="text-2xl font-black text-zinc-900 tracking-tight">Identity</h3>
                  <p className="text-zinc-400 text-sm font-medium mt-1">Change the name of your workspace.</p>
                </div>

                <div className="space-y-4">
                  <label className="text-[11px] font-black text-zinc-400 uppercase tracking-widest ml-1">Workspace Name</label>
                  <input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full bg-zinc-50 border border-transparent focus:bg-white focus:border-indigo-200 focus:ring-4 focus:ring-indigo-500/5 rounded-[24px] px-6 py-5 text-zinc-900 text-sm font-bold transition-all outline-none"
                  />
                  <button
                    onClick={handleUpdateName}
                    disabled={isSaving || newName === workspace?.name}
                    className="cursor-pointer px-10 py-4 bg-indigo-600 text-white rounded-[20px] font-black text-xs uppercase tracking-[0.2em] active:scale-95 transition-all disabled:opacity-30 flex items-center gap-3 shadow-lg shadow-indigo-100"
                  >
                    {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    Update
                  </button>
                </div>
              </div>
            )}

            {activeSection === 'users' && (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="text-2xl font-black text-zinc-900 tracking-tight">Team Access</h3>
                    <p className="text-zinc-400 text-sm font-medium mt-1">Manage collaborators and permissions.</p>
                  </div>
                  <div className="flex gap-2">
                    {selectedUsers.length > 0 && (
                      <button
                        onClick={() => handleRemoveMemberClick(selectedUsers)}
                        className="px-5 py-3 bg-rose-50 text-rose-600 border border-rose-100 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 animate-in zoom-in-95 cursor-pointer"
                      >
                        <Trash2 size={14} /> Remove ({selectedUsers.length})
                      </button>
                    )}
                    <button
                      onClick={() => setIsInviteModalOpen(true)}
                      className="cursor-pointer px-5 py-3 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-indigo-100 active:scale-95 transition-all"
                    >
                      <UserPlus size={14} /> Invite New
                    </button>
                  </div>
                </div>

                {workspace?.users?.length > 0 ? (
                  <div className="overflow-x-auto rounded-[28px] border border-zinc-100">
                    <table className="w-full text-left">
                      <thead className="bg-zinc-50/50">
                        <tr className="border-b border-zinc-100">
                          <th className="px-6 py-5">
                            <input
                              type="checkbox"
                              checked={selectedUsers.length === workspace.users.length}
                              onChange={toggleSelectAll}
                              className="w-5 h-5 rounded-lg accent-indigo-600 cursor-pointer"
                            />
                          </th>
                          <th className="px-6 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Full Name</th>
                          <th className="px-6 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Email</th>
                          <th className="px-6 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-50">
                        {workspace.users.map((member: any) => (
                          <tr key={member._id} className="group hover:bg-zinc-50/30 transition-colors">
                            <td className="px-6 py-5">
                              <input
                                type="checkbox"
                                checked={selectedUsers.includes(member._id)}
                                onChange={() => setSelectedUsers(prev => prev.includes(member._id) ? prev.filter(id => id !== member._id) : [...prev, member._id])}
                                className="w-5 h-5 rounded-lg accent-indigo-600 cursor-pointer"
                              />
                            </td>
                            <td className="px-6 py-5">
                              <div className="flex items-center gap-3">
                                <span className="text-sm font-bold text-zinc-900">
                                  {member.fullName}
                                  {member._id === workspace.ownerId?._id && (
                                    <span className="ml-2 text-[8px] bg-zinc-900 text-white px-1.5 py-0.5 rounded uppercase tracking-tighter">Owner</span>
                                  )}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-5">
                              <span className="text-sm font-medium text-zinc-500">{member.email}</span>
                            </td>
                            <td className="px-6 py-5 text-right">
                              {member._id !== workspace.ownerId?._id && (
                                <button
                                  onClick={() => handleRemoveMemberClick([member._id])}
                                  className="cursor-pointer p-2 text-zinc-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                                >
                                  <UserMinus size={18} />
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 px-6 bg-zinc-50 rounded-[32px] border border-dashed border-zinc-200">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-zinc-200 mb-4 shadow-sm">
                      <FolderOpen size={32} />
                    </div>
                    <h4 className="text-lg font-black text-zinc-900 tracking-tight">Lone Wolf?</h4>
                    <p className="text-zinc-400 text-sm font-medium text-center max-w-[240px] mt-2 mb-6">
                      You are currently the only person in this workspace. Invite your team to collaborate.
                    </p>
                    <button
                      onClick={() => setIsInviteModalOpen(true)}
                      className="cursor-pointer px-8 py-3 bg-white border border-zinc-200 text-indigo-600 rounded-xl text-xs font-black uppercase tracking-widest hover:border-indigo-600 transition-all shadow-sm"
                    >
                      Invite First Member
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeSection === 'danger' && (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                <div className="p-8 lg:p-10 bg-rose-50/50 rounded-[32px] border border-rose-100">
                  <div className="flex items-start gap-4 mb-8">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-rose-500 shadow-sm border border-rose-100">
                      <AlertTriangle size={24} />
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-zinc-900 tracking-tight">Terminate Workspace</h4>
                      <p className="text-sm font-medium text-rose-600/70 mt-1 max-w-sm">
                        All collections, notes, and shared data within this workspace will be permanently deleted.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleDeleteWorkspaceClick}
                    className="cursor-pointer w-full py-5 bg-rose-500 text-white rounded-[24px] font-black text-xs uppercase tracking-[0.2em] hover:bg-rose-600 transition-all active:scale-95 shadow-xl shadow-rose-100"
                  >
                    Delete Workspace Forever
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      <WorkspaceInviteModal isOpen={isInviteModalOpen} onClose={async () => { setIsInviteModalOpen(false); await fetchData() }} workSpace={workspace} />

      {/* --- THE SINGLE DYNAMIC CONFIRM MODAL --- */}
      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={onConfirmAction}
        title={modalConfig.title}
        description={modalConfig.description}
        buttonText={modalConfig.buttonText}
      />
    </div>
  );
}

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
