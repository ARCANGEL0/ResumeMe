// CV data types for the builder

export const SOCIAL_PLATFORM_OPTIONS = [
  { id: 'custom', label: 'customGeneral' },
  { id: 'github', label: 'github' },
  { id: 'linkedin', label: 'linkedin' },
  { id: 'gitlab', label: 'gitlab' },
  { id: 'hackthebox', label: 'hackthebox' },
  { id: 'instagram', label: 'instagram' },
  { id: 'facebook', label: 'facebook' },
  { id: 'x', label: 'x' },
  { id: 'website', label: 'website' },
  { id: 'portfolio', label: 'portfolio' },
  { id: 'dribbble', label: 'dribbble' },
  { id: 'behance', label: 'behance' },
  { id: 'stackoverflow', label: 'stackoverflow' },
  { id: 'youtube', label: 'youtube' },
  { id: 'discord', label: 'discord' },
] as const;

export type SocialPlatform = (typeof SOCIAL_PLATFORM_OPTIONS)[number]['id'];

export interface SocialLink {
  id: string;
  platform: SocialPlatform;
  value: string;
}

export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  socials: SocialLink[];
}

export type SectionType =
  | 'experience'
  | 'education'
  | 'skills'
  | 'languages'
  | 'projects'
  | 'certifications'
  | 'custom';

export interface CVSection {
  id: string;
  type: SectionType;
  title: string;
  entries: CVEntry[];
}

export interface CVEntry {
  id: string;
  fields: Record<string, string>;
}

export type TemplateId =
  | 'modern'
  | 'classic'
  | 'minimal'
  | 'creative'
  | 'professional'
  | 'executive'
  | 'slate'
  | 'ivory'
  | 'summit'
  | 'studio'
  | 'atlas'
  | 'dossier'
  | 'north'
  | 'zenith'
  | 'editorial';

export interface TemplateInfo {
  id: TemplateId;
  name: string;
  description: string;
}

export interface CVData {
  personalInfo: PersonalInfo;
  sections: CVSection[];
  selectedTemplate: TemplateId;
  layoutOverride?: TemplateLayoutState;
}

export type TemplateLayoutState = Partial<Record<string, string[]>>;

export const LANGUAGE_PROFICIENCY_OPTIONS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const;
export type LanguageProficiency = (typeof LANGUAGE_PROFICIENCY_OPTIONS)[number];

export const SECTION_FIELDS: Record<SectionType, string[]> = {
  experience: ['company', 'position', 'startDate', 'endDate', 'description'],
  education: ['institution', 'degree', 'startDate', 'endDate'],
  skills: ['name', 'level'],
  languages: ['language', 'proficiency'],
  projects: ['name', 'description', 'url', 'technologies'],
  certifications: ['name', 'issuer', 'date', 'url'],
  custom: ['title', 'description'],
};

export const DEFAULT_SECTION_TITLES: Record<SectionType, string> = {
  experience: 'Experience',
  education: 'Education',
  skills: 'Skills',
  languages: 'Languages',
  projects: 'Projects',
  certifications: 'Certifications',
  custom: 'Custom Section',
};

export const TEMPLATES: TemplateInfo[] = [
  { id: 'modern', name: 'Modern', description: 'Clean two-column layout with accent sidebar' },
  { id: 'classic', name: 'Classic', description: 'Traditional single-column with refined lines' },
  { id: 'minimal', name: 'Minimal', description: 'Airy monochrome layout with quiet spacing' },
  { id: 'creative', name: 'Creative', description: 'Vibrant contemporary resume with bold markers' },
  { id: 'professional', name: 'Professional', description: 'Structured corporate layout for ATS-friendly resumes' },
  { id: 'executive', name: 'Executive', description: 'Premium leadership profile with a dark header band' },
  { id: 'slate', name: 'Slate', description: 'Cool editorial resume with a right-hand rail' },
  { id: 'ivory', name: 'Ivory', description: 'Warm serif layout with soft dividers' },
  { id: 'summit', name: 'Summit', description: 'Confident two-column layout with skill meters' },
  { id: 'studio', name: 'Studio', description: 'Modern designer resume with colorful cards' },
  { id: 'atlas', name: 'Atlas', description: 'Grid-driven professional layout with compact side notes' },
  { id: 'dossier', name: 'Dossier', description: 'Dense yet elegant single-column for experienced candidates' },
  { id: 'north', name: 'North', description: 'Scandinavian minimalism with calm blue accents' },
  { id: 'zenith', name: 'Zenith', description: 'High-contrast resume with strong timeline sections' },
  { id: 'editorial', name: 'Editorial', description: 'Magazine-inspired layout with typographic hierarchy' },
];

export function getSocialPlatformMeta(platform: SocialPlatform) {
  return SOCIAL_PLATFORM_OPTIONS.find((option) => option.id === platform) ?? SOCIAL_PLATFORM_OPTIONS[0]!;
}
