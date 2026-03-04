import { create } from 'zustand';

export interface Note {
  id: string;
  title: string;
  content: string; // HTML or JSON from the editor
  notebookId: string;
  updatedAt: Date;
}

export interface Notebook {
  id: string;
  name: string;
  color: string;
  noteCount: number;
}

interface NoteState {
  notebooks: Notebook[];
  notes: Note[];
  addNotebook: (name: string, color: string) => void;
  addNote: (notebookId: string, title: string) => void;
}

export const useNoteStore = create<NoteState>((set) => ({
  notebooks: [
    { id: '1', name: 'Work Meetings', color: '#3b82f6', noteCount: 3 },
    { id: '2', name: 'Personal Growth', color: '#10b981', noteCount: 5 },
  ],
  notes: [],
  addNotebook: (name, color) => set((state) => ({
    notebooks: [...state.notebooks, { id: Date.now().toString(), name, color, noteCount: 0 }]
  })),
  addNote: (notebookId, title) => set((state) => ({
    notes: [...state.notes, { id: Date.now().toString(), title, content: '', notebookId, updatedAt: new Date() }]
  }))
}));