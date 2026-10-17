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
  photo?: string;
  dateOfBirth?: string;
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
  isCustom?: boolean;
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
  | 'sarif'
  | 'ivory'
  | 'summit'
  | 'studio'
  | 'atlas'
  | 'dossier'
  | 'north'
  | 'zenith'
  | 'editorial'
  | 'meridian'
  | 'vertex'
  | 'harbor'
  | 'beacon'
  | 'quartz'
  | 'retro95'
  | 'windows'
  | 'cobalt'
  | 'linen'
  | 'praxis'
  | 'portrait'
  | 'insignia'
  | 'bulletin'
  | 'verso'
  | 'granite'
  | 'palladio'
  | 'signal'
  | 'corvus'
  | 'vellum'
  | 'toon'
  | 'hexon'
  | 'lagoon'
  | 'scribe';

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
  { id: 'beacon', name: 'Beacon', description: 'Strict single column tuned for ATS parsing' },
  { id: 'meridian', name: 'Meridian', description: 'Indigo double-rule header with a narrow meta column' },
  { id: 'vellum', name: 'Vellum', description: 'Grey banded layout with wide-tracked section rules' },
  { id: 'toon', name: 'Toon', description: 'Pastel sticker cards with heavy outlines and sparkles' },
  { id: 'scribe', name: 'Scribe', description: 'Bare monochrome sheet with lowercase headings' },
  { id: 'corvus', name: 'Corvus', description: 'Dark-paper resume with a luminous rail and inset portrait' },
  { id: 'windows', name: 'Windows', description: 'Windows XP desktop window with a blue task pane' },
  { id: 'retro95', name: 'Retro 95', description: 'Windows 95/98 desktop window with beveled group boxes' },
  { id: 'dossier', name: 'Dossier', description: 'Dense yet elegant single-column for experienced candidates' },
  { id: 'modern', name: 'Modern', description: 'Clean two-column layout with accent sidebar' },
  { id: 'classic', name: 'Classic', description: 'Traditional single-column with refined lines' },
  { id: 'minimal', name: 'Forma', description: 'A clean single-column profile with a concise introduction and open spacing' },
  { id: 'creative', name: 'Folio', description: 'An editorial single-column profile with a typographic header and clear section hierarchy' },
  { id: 'professional', name: 'Mercer', description: 'A balanced résumé with a compact information rail and clear career history' },
  { id: 'executive', name: 'Principal', description: 'A senior leadership profile with a concise introduction and full-width career history' },
  { id: 'slate', name: 'Column', description: 'An even two-column layout with a compact profile header and clear section divisions' },
  { id: 'sarif', name: 'Sarif', description: 'Dark sidebar on the left with clean main content' },
  { id: 'ivory', name: 'Ledger', description: 'A clear two-column résumé with chronological experience and a compact skills rail' },
  { id: 'summit', name: 'Apex', description: 'A full-width career history with a concise profile and supporting sections below' },
  { id: 'studio', name: 'Studio', description: 'Modern designer resume with colorful cards' },
  { id: 'atlas', name: 'Atlas', description: 'Grid-driven professional layout with compact side notes' },
  { id: 'north', name: 'North', description: 'Scandinavian minimalism with calm blue accents' },
  { id: 'zenith', name: 'Zenith', description: 'High-contrast resume with strong timeline sections' },
  { id: 'editorial', name: 'Editorial', description: 'Magazine-inspired layout with typographic hierarchy' },
  { id: 'vertex', name: 'Vertex', description: 'Charcoal header band with amber accents and a supporting grid' },
  { id: 'harbor', name: 'Harbor', description: 'Deep navy sidebar with a calm, corporate main column' },
  { id: 'quartz', name: 'Quartz', description: 'Panelled layout in cool grey with muted green accents' },
  { id: 'cobalt', name: 'Cobalt', description: 'Navy header block over a contact rail and wide experience column' },
  { id: 'linen', name: 'Linen', description: 'Charcoal banner with a warm sand sidebar' },
  { id: 'praxis', name: 'Praxis', description: 'Cream two-column layout for dense senior profiles' },
  { id: 'portrait', name: 'Portrait', description: 'Centred photo header with a calm violet rule set' },
  { id: 'insignia', name: 'Insignia', description: 'Deep teal sidebar with a framed portrait on top' },
  { id: 'bulletin', name: 'Bulletin', description: 'Slate banner with a square portrait and terracotta accents' },
  { id: 'verso', name: 'Verso', description: 'Warm parchment split with a circular portrait' },
  { id: 'granite', name: 'Granite', description: 'Single-column graphite layout with heavy section bars' },
  { id: 'palladio', name: 'Palladio', description: 'Formal centred serif for academic and legal profiles' },
  { id: 'signal', name: 'Signal', description: 'Teal card layout with compact meters' },
  { id: 'hexon', name: 'Hexon', description: 'Navy hexagon sidebar with paired skill meters' },
  { id: 'lagoon', name: 'Lagoon', description: 'Teal rail with an angled photo and a timeline spine' },
];

export function getSocialPlatformMeta(platform: SocialPlatform) {
  return SOCIAL_PLATFORM_OPTIONS.find((option) => option.id === platform) ?? SOCIAL_PLATFORM_OPTIONS[0]!;
}
