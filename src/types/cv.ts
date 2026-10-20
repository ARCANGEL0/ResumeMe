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
  role?: string;
  email: string;
  phone: string;
  location: string;
  nationality?: string;
  gender?: string;
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
  | 'scribe'
  | 'europass';

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
  showEuropassBranding?: boolean;
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
  { id: 'north', name: 'Nord', description: 'A centered profile header above a quiet two-column résumé layout' },
  { id: 'europass', name: 'Europass', description: 'A European CV layout with Europass branding, labeled contact details, and ruled sections' },
  { id: 'hexon', name: 'Hexon', description: 'A clean two-column résumé with a photo masthead and profile band' },
  { id: 'beacon', name: 'Beacon', description: 'Strict single column tuned for ATS parsing' },
  { id: 'meridian', name: 'Axiom', description: 'A numbered identity header and contact strip above a single-column career record' },
  { id: 'vellum', name: 'Vellum', description: 'Grey banded layout with wide-tracked section rules' },
  { id: 'toon', name: 'Toon', description: 'Pastel sticker cards with heavy outlines and sparkles' },
  { id: 'scribe', name: 'Scribe', description: 'Large editorial nameplate with a balanced two-column résumé body' },
  { id: 'corvus', name: 'Charcoal', description: 'A charcoal identity banner above a quiet information rail' },
  { id: 'windows', name: 'Windows', description: 'Windows XP desktop window with a blue task pane' },
  { id: 'retro95', name: 'Retro 95', description: 'Windows 95/98 desktop window with beveled group boxes' },
  { id: 'dossier', name: 'Dossier', description: 'A structured two-column résumé with a strong identity panel' },
  { id: 'modern', name: 'Modern', description: 'A clean portrait header with a narrow left information column' },
  { id: 'classic', name: 'Classic', description: 'Traditional single-column with refined lines' },
  { id: 'minimal', name: 'Forme', description: 'A clean résumé with a portrait masthead, career timeline, and balanced lower columns' },
  { id: 'creative', name: 'Folio', description: 'An editorial single-column profile with a typographic header and clear section hierarchy' },
  { id: 'professional', name: 'Mercer', description: 'A monochrome single-column résumé with ruled section bands and a clear career record' },
  { id: 'executive', name: 'Crest', description: 'A composed leadership résumé with generous spacing and clear career chronology' },
  { id: 'slate', name: 'Simple', description: 'A straightforward single-column résumé with shaded section headings' },
  { id: 'sarif', name: 'Sarif', description: 'Dark sidebar on the left with clean main content' },
  { id: 'ivory', name: 'Crystal', description: 'A portrait nameplate above a contact rail and timeline-led career column' },
  { id: 'summit', name: 'Apex', description: 'A full-width career history with a concise profile and supporting sections below' },
  { id: 'studio', name: 'JSON', description: 'A readable code-inspired résumé with real profile and career data' },
  { id: 'atlas', name: 'Gridline', description: 'A practical two-column résumé with a broad career history and compact supporting rail' },
  { id: 'zenith', name: 'Waypoint', description: 'A chronological résumé with supporting details in a narrow rail' },
  { id: 'editorial', name: 'Vantage', description: 'A profile card and contact rail beside a timeline-led career column' },
  { id: 'vertex', name: 'Vector', description: 'An angular grayscale layout with a profile rail and broad career column' },
  { id: 'harbor', name: 'Civic', description: 'A straightforward corporate layout with a quiet information rail' },
  { id: 'quartz', name: 'Clarity', description: 'A clean portrait rail for contact, education, and skills beside a profile-led career column' },
  { id: 'cobalt', name: 'Contour', description: 'A quiet split layout with a broad work history and outlined support column' },
  { id: 'linen', name: 'Linen', description: 'Charcoal banner with a warm sand sidebar' },
  { id: 'praxis', name: 'Praxis', description: 'Cream two-column layout for dense senior profiles' },
  { id: 'portrait', name: 'Portrait', description: 'Centred photo header with a calm violet rule set' },
  { id: 'insignia', name: 'Merit', description: 'A compact masthead above a skills and education rail with a full career column' },
  { id: 'bulletin', name: 'Dispatch', description: 'A compact profile rail alongside a linear career timeline' },
  { id: 'verso', name: 'Monolith', description: 'A monochrome résumé with a monogram header and narrow contact rail' },
  { id: 'granite', name: 'Granite', description: 'Single-column graphite layout with heavy section bars' },
  { id: 'palladio', name: 'Charter', description: 'A formal serif résumé with a structured profile and supporting columns' },
  { id: 'signal', name: 'Register', description: 'A technology résumé with a contact masthead and focused skills rail' },
  { id: 'lagoon', name: 'Lagoon', description: 'Teal rail with an angled photo and a timeline spine' },
];

export function getSocialPlatformMeta(platform: SocialPlatform) {
  return SOCIAL_PLATFORM_OPTIONS.find((option) => option.id === platform) ?? SOCIAL_PLATFORM_OPTIONS[0]!;
}
