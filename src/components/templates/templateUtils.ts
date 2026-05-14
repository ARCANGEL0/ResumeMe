import {
  LANGUAGE_PROFICIENCY_OPTIONS,
  type CVEntry,
  type CVSection,
  type LanguageProficiency,
  type PersonalInfo,
  type SectionType,
  type SocialLink,
  getSocialPlatformMeta,
} from '../../types/cv';
import {t, type UILanguage} from '../../i18n';
import type { ContactIconName } from '../../ui/ContactIcon';

export interface ContactItem {
  key: string;
  icon: ContactIconName;
  value: string;
  type: 'core' | 'social';
}

const CORE_ICONS = {
  email: 'email',
  phone: 'phone',
  location: 'location',
} as const;

export function getContactItems(personalInfo: PersonalInfo): ContactItem[] {
  const items: ContactItem[] = [];

  if (personalInfo.email.trim()) {
    items.push({
      key: 'email',
      icon: CORE_ICONS.email,
      value: personalInfo.email.trim(),
      type: 'core',
    });
  }

  if (personalInfo.phone.trim()) {
    items.push({
      key: 'phone',
      icon: CORE_ICONS.phone,
      value: personalInfo.phone.trim(),
      type: 'core',
    });
  }

  if (personalInfo.location.trim()) {
    items.push({
      key: 'location',
      icon: CORE_ICONS.location,
      value: personalInfo.location.trim(),
      type: 'core',
    });
  }

  personalInfo.socials
    .filter((social) => social.value.trim())
    .forEach((social) => {
      const meta = getSocialPlatformMeta(social.platform);
      items.push({
        key: social.id,
        icon: meta.id,
        value: social.value.trim(),
        type: 'social',
      });
    });

  return items;
}

const LANGUAGE_LEVEL_MAP: Record<LanguageProficiency, string> = {
  A1: 'beginner',
  A2: 'beginner',
  B1: 'intermediate',
  B2: 'intermediate',
  C1: 'fluent',
  C2: 'native',
};

const LANGUAGE_ALIASES: Record<string, LanguageProficiency> = {
  beginner: 'A1',
  basic: 'A1',
  elementary: 'A2',
  conversational: 'B1',
  intermediate: 'B1',
  fluent: 'C1',
  advanced: 'C1',
  native: 'C2',
  bilingual: 'C2',
};

function isLanguageProficiency(value: string): value is LanguageProficiency {
  return LANGUAGE_PROFICIENCY_OPTIONS.includes(value as LanguageProficiency);
}

export function normalizeLanguageProficiency(value: string): LanguageProficiency | '' {
  const normalized = value.trim().toUpperCase();

  if (!normalized) return '';
  if (isLanguageProficiency(normalized)) {
    return normalized;
  }

  return LANGUAGE_ALIASES[value.trim().toLowerCase()] ?? '';
}

export function getLangScore(value: string): number {
  const normalized = normalizeLanguageProficiency(value);
  return normalized ? LANGUAGE_PROFICIENCY_OPTIONS.indexOf(normalized) + 1 : 0;
}

export function getLangLevel(value: string, format: 'cefr' | 'words' = 'cefr', lang?: string): string {
  const normalized = normalizeLanguageProficiency(value);
  if (!normalized) return value.trim();
  if (format === 'words' && lang) {
    const key = LANGUAGE_LEVEL_MAP[normalized];
    return t(lang as UILanguage, key) || LANGUAGE_LEVEL_MAP[normalized];
  }
  return format === 'words' ? LANGUAGE_LEVEL_MAP[normalized] : normalized;
}

export function getSkillLevelScore(value: string): number {
  const trimmed = value.trim();
  const numeric = Number.parseInt(trimmed, 10);

  if (Number.isFinite(numeric)) {
    return Math.max(1, Math.min(5, numeric));
  }

  const normalized = trimmed.toLowerCase();
  if (!normalized) return 0;
  if (normalized.includes('expert') || normalized.includes('lead')) return 5;
  if (normalized.includes('advanced') || normalized.includes('senior')) return 4;
  if (normalized.includes('intermediate') || normalized.includes('mid')) return 3;
  if (normalized.includes('junior') || normalized.includes('basic')) return 2;
  return 1;
}

export function getEntryTitle(entry: CVEntry): string {
  return (
    entry.fields.position ||
    entry.fields.degree ||
    entry.fields.name ||
    entry.fields.title ||
    entry.fields.language ||
    entry.fields.institution ||
    entry.fields.company ||
    'Entry'
  );
}

export function getEntrySubtitle(entry: CVEntry): string {
  return [entry.fields.company, entry.fields.institution, entry.fields.issuer]
    .filter(Boolean)
    .join(' · ');
}

export function fmtDate(d: string): string {
  if (!d) return '';
  const m = d.match(/^(\d{4})-(\d{2})/);
  if (m) return `${m[2]}/${m[1]}`;
  return d;
}

export function getEntryDate(entry: CVEntry, lang?: string): string {
  const isCurrent = entry.fields.isCurrent === 'true';
  const showStartOnly = entry.fields.showStartOnly === 'true';
  const showEndOnly = entry.fields.showEndOnly === 'true';
  const startDate = fmtDate(entry.fields.startDate || '');
  const endDate = fmtDate(entry.fields.endDate || '');

  if (showStartOnly) {
    return startDate;
  }

  if (showEndOnly) {
    return endDate;
  }

  if (startDate || endDate) {
    return [startDate, isCurrent ? (lang ? t(lang as UILanguage, 'present') : 'Present') : endDate].filter(Boolean).join(' - ');
  }

  return entry.fields.date || '';
}

export function getEntryDetailLines(entry: CVEntry): string[] {
  return (entry.fields.description || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

export function splitSectionsByType(sections: CVSection[], sidebarTypes: SectionType[]) {
  const sidebarTypeSet = new Set(sidebarTypes);

  return {
    sidebar: sections.filter((section) => sidebarTypeSet.has(section.type)),
    main: sections.filter((section) => !sidebarTypeSet.has(section.type)),
  };
}
