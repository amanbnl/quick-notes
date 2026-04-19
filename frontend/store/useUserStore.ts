import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserDetails {
  id: string;
  fullName: string;
  email: string;
  profile: {
    bio: string;
    experience: { id: string; company: string; role: string; duration: string }[];
    education: { id: string; school: string; degree: string; year: string }[];
    certifications: string[];
    languages: string[];
    avatarUrl?: string;
  };
}

interface UserState {
  user: UserDetails | null;
  // Actions
  setUser: (user: UserDetails) => void;
  updateUserDetails: (data: Partial<UserDetails>) => void;
  updateProfileFields: (data: Partial<UserDetails['profile']>) => void;
  addItem: (field: 'experience' | 'education' | 'certifications' | 'languages', item: any) => void;
  removeItem: (field: 'experience' | 'education' | 'certifications' | 'languages', idOrValue: string) => void;
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

      // Update nested profile fields (bio, avatarUrl)
      updateProfileFields: (data) =>
        set((state) => ({
          user: state.user 
            ? { ...state.user, profile: { ...state.user.profile, ...data } } 
            : null,
        })),

      addItem: (field, item) =>
        set((state) => {
          if (!state.user) return state;
          return {
            user: {
              ...state.user,
              profile: {
                ...state.user.profile,
                [field]: [...state.user.profile[field], item],
              },
            },
          };
        }),

      removeItem: (field, idOrValue) =>
        set((state) => {
          if (!state.user) return state;
          return {
            user: {
              ...state.user,
              profile: {
                ...state.user.profile,
                [field]: state.user.profile[field].filter((item: any) =>
                  typeof item === 'string' ? item !== idOrValue : item.id !== idOrValue
                ),
              },
            },
          };
        }),

      logout: () => set({ user: null }),
    }),
    {
      name: 'user-storage', // Key for LocalStorage
    }
  )
);