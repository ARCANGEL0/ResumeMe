import { create } from 'zustand';
import { persist } from 'zustand/middleware'; // middleware for persistance, the previous commit did not had this which would cause data loss if page were refreshed
import { DEFAULT_LANGUAGE, getSectionTitle, type UILanguage } from '../i18n';
import {
  type CVData,
  type PersonalInfo,
  type CVSection,
  type SectionType,
  type SocialLink,
  type SocialPlatform,
  type TemplateId,
  type TemplateLayoutState,
  SECTION_FIELDS,
} from '../types/cv';

let nextId = 1;
const genId = () => `id-${Date.now()}-${nextId++}`;

const defaultPersonalInfo: PersonalInfo = {
  fullName: '',
  email: '',
  phone: '',
  location: '',
  summary: '',
  socials: [],
};

const defaultSections: CVSection[] = [
  {
    id: genId(),
    type: 'experience',
    title: getSectionTitle(DEFAULT_LANGUAGE, 'experience'),
    entries: [
      { id: genId(), fields: { company: '', position: '', startDate: '', endDate: '', description: '' } },
    ],
  },
  {
    id: genId(),
    type: 'education',
    title: getSectionTitle(DEFAULT_LANGUAGE, 'education'),
    entries: [
      { id: genId(), fields: { institution: '', degree: '', startDate: '', endDate: '' } },
    ],
  },
  {
    id: genId(),
    type: 'skills',
    title: getSectionTitle(DEFAULT_LANGUAGE, 'skills'),
    entries: [],
  },
];

type View = 'landing' | 'editor' | 'templates';

function cloneDocument(data: CVData): CVData {
  return JSON.parse(JSON.stringify(data)) as CVData;
}

interface CVStore extends CVData {
  templateLayouts: Partial<Record<TemplateId, TemplateLayoutState>>;
  // View state
  currentView: View;
  language: UILanguage;
  setView: (view: View) => void;
  setLanguage: (language: UILanguage) => void;
  loadDocument: (data: CVData, view?: View) => void;

  // Personal info
  updatePersonalInfo: <K extends keyof PersonalInfo>(field: K, value: PersonalInfo[K]) => void;
  addSocialLink: (platform: SocialPlatform, value: string) => void;
  updateSocialLink: (socialId: string, field: keyof SocialLink, value: SocialLink[keyof SocialLink]) => void;
  removeSocialLink: (socialId: string) => void;

  // Sections
  addSection: (type: SectionType) => void;
  removeSection: (sectionId: string) => void;
  renameSection: (sectionId: string, title: string) => void;
  reorderSection: (sectionId: string, direction: 'up' | 'down') => void;
  getUsedSectionTypes: () => SectionType[];

  // Entries
  addEntry: (sectionId: string) => void;
  removeEntry: (sectionId: string, entryId: string) => void;
  updateEntry: (sectionId: string, entryId: string, field: string, value: string) => void;

  // Template
  setTemplate: (templateId: TemplateId) => void;
  setTemplateLayout: (templateId: TemplateId, layout: TemplateLayoutState) => void;
}
// edited func. diff -> now supports persistance saving on local browser cache.
export const useCVStore = create<CVStore>()(
  persist(
    (set, get) => ({
  personalInfo: defaultPersonalInfo,
  sections: defaultSections,
  selectedTemplate: 'minimal',
  templateLayouts: {},
  currentView: 'landing',
  language: DEFAULT_LANGUAGE,

  setView: (view) => set({ currentView: view }),

  loadDocument: (data, view = 'editor') => {
    const nextDocument = cloneDocument(data);
    set({
      personalInfo: nextDocument.personalInfo,
      sections: nextDocument.sections,
      selectedTemplate: nextDocument.selectedTemplate,
      templateLayouts: {},
      currentView: view,
    });
  },

  setLanguage: (language) =>
    set((state) => ({
      language,
      sections: state.sections.map((section) => {
        // Always update section titles based on the new language
        return { ...section, title: getSectionTitle(language, section.type) };
      }),
    })),

  updatePersonalInfo: (field, value) =>
    set((state) => ({
      personalInfo: { ...state.personalInfo, [field]: value },
    })),

  addSocialLink: (platform, value) =>
    set((state) => ({
      personalInfo: {
        ...state.personalInfo,
        socials: [
          ...state.personalInfo.socials,
          {
            id: genId(),
            platform,
            value,
          },
        ],
      },
    })),

  updateSocialLink: (socialId, field, value) =>
    set((state) => ({
      personalInfo: {
        ...state.personalInfo,
        socials: state.personalInfo.socials.map((social) =>
          social.id === socialId ? { ...social, [field]: value } : social
        ),
      },
    })),

  removeSocialLink: (socialId) =>
    set((state) => ({
      personalInfo: {
        ...state.personalInfo,
        socials: state.personalInfo.socials.filter((social) => social.id !== socialId),
      },
    })),

  addSection: (type) =>
    set((state) => ({
      sections: [
        ...state.sections,
        {
          id: genId(),
          type,
          title: getSectionTitle(state.language, type),
          entries: [{ id: genId(), fields: Object.fromEntries(SECTION_FIELDS[type].map((f) => [f, ''])) }],
        },
      ],
    })),

  removeSection: (sectionId) =>
    set((state) => ({
      sections: state.sections.filter((s) => s.id !== sectionId),
    })),

  renameSection: (sectionId, title) =>
    set((state) => ({
      sections: state.sections.map((s) => (s.id === sectionId ? { ...s, title } : s)),
    })),

  reorderSection: (sectionId, direction) =>
    set((state) => {
      const idx = state.sections.findIndex((s) => s.id === sectionId);
      if (idx === -1) return state;
      const newIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (newIdx < 0 || newIdx >= state.sections.length) return state;
      const newSections = state.sections.slice();
      const tmp: CVSection = newSections[idx]!;
      newSections[idx] = newSections[newIdx]!;
      newSections[newIdx] = tmp;
      return { sections: newSections };
    }),

  getUsedSectionTypes: () => {
    return get().sections.map((s) => s.type);
  },

  addEntry: (sectionId) =>
    set((state) => ({
      sections: state.sections.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              entries: [...s.entries, { id: genId(), fields: Object.fromEntries(SECTION_FIELDS[s.type].map((f) => [f, ''])) }],
            }
          : s
      ),
    })),

  removeEntry: (sectionId, entryId) =>
    set((state) => ({
      sections: state.sections.map((s) =>
        s.id === sectionId ? { ...s, entries: s.entries.filter((e) => e.id !== entryId) } : s
      ),
    })),

  updateEntry: (sectionId, entryId, field, value) =>
    set((state) => ({
      sections: state.sections.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              entries: s.entries.map((e) =>
                e.id === entryId ? { ...e, fields: { ...e.fields, [field]: value } } : e
              ),
            }
          : s
      ),
    })),

  setTemplate: (templateId) => set({ selectedTemplate: templateId }),
  setTemplateLayout: (templateId, layout) =>
    set((state) => ({
      templateLayouts: {
        ...state.templateLayouts,
        [templateId]: layout,
      },
    })),
  }),
  {
    name: 'cv-storage',
  }
));
