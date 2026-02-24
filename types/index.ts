export interface Profile {
  bio: string;
  experience: { company: string; role: string; year: string }[];
  education: { school: string; degree: string }[];
  certifications: string[];
  languages: string[];
}