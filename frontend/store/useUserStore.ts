import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserDetails {
  id: string;
  fullName: string;
  email: string;
  bio: string;
  age: number;
}

interface UserState {
  user: UserDetails | null;
  // Actions
  setUser: (user: UserDetails) => void;
  updateUserDetails: (data: Partial<UserDetails>) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,

      // Initialize or overwrite the entire user object (Call this on Login)
      setUser: (user) => set({ user }),

      // Update top-level fields (fullName, email)
      updateUserDetails: (data) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        })),

      logout: () => set({ user: null }),
    }),
    {
      name: 'user-storage', // Key for LocalStorage
    }
  )
);