import { create } from 'zustand';

export interface ProfileData {
  bio: string;
  experience: { id: string; company: string; role: string; duration: string }[];
  education: { id: string; school: string; degree: string; year: string }[];
  certifications: string[];
  languages: string[];
  avatarUrl?: string;
}

interface UserState {
  profile: ProfileData;
  updateProfile: (data: Partial<ProfileData>) => void;
  addItem: (field: 'experience' | 'education' | 'certifications' | 'languages', item: any) => void;
  removeItem: (field: 'experience' | 'education' | 'certifications' | 'languages', id: string | number) => void;
}

export const useUserStore = create<UserState>((set) => ({
  profile: {
    bio: "",
    experience: [],
    education: [],
    certifications: [],
    languages: [],
  },
  updateProfile: (data) => 
    set((state) => ({ profile: { ...state.profile, ...data } })),
  
  addItem: (field, item) => 
    set((state) => ({ 
      profile: { ...state.profile, [field]: [...state.profile[field], item] } 
    })),

  removeItem: (field, idOrValue) => 
    set((state) => ({
      profile: { 
        ...state.profile, 
        [field]: state.profile[field].filter((item: any) => 
          typeof item === 'string' ? item !== idOrValue : item.id !== idOrValue
        ) 
      }
    })),
}));