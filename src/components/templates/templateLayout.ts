import type { CVSection, SectionType, TemplateId, TemplateLayoutState } from '../../types/cv';

export interface TemplateLayoutRegion {
  key: string;
  label: string;
}

export interface TemplateLayoutPreset {
  regions: TemplateLayoutRegion[];
  defaultLayout: Partial<Record<string, SectionType[]>>;
}

const FALLBACK_REGION = 'main';

export const TEMPLATE_LAYOUT_PRESETS: Record<TemplateId, TemplateLayoutPreset> = {
  modern: {
    regions: [{ key: 'sidebar', label: 'Sidebar' }, { key: 'main', label: 'Main' }],
    defaultLayout: {
      sidebar: ['skills', 'languages', 'certifications'],
      main: ['experience', 'projects', 'education', 'custom'],
    },
  },
  classic: {
    regions: [
      { key: 'main', label: 'Main' },
      { key: 'bottomLeft', label: 'Bottom Left' },
      { key: 'bottomRight', label: 'Bottom Right' },
    ],
    defaultLayout: {
      main: ['experience', 'education', 'projects'],
      bottomLeft: ['skills', 'certifications'],
      bottomRight: ['languages', 'custom'],
    },
  },
  minimal: {
    regions: [{ key: 'main', label: 'Main' }, { key: 'sidebar', label: 'Sidebar' }],
    defaultLayout: {
      main: ['experience', 'education', 'projects', 'certifications', 'custom'],
      sidebar: ['skills', 'languages'],
    },
  },
  creative: {
    regions: [
      { key: 'utility', label: 'Utility' },
      { key: 'storyLeft', label: 'Story Left' },
      { key: 'storyRight', label: 'Story Right' },
    ],
    defaultLayout: {
      utility: ['skills', 'languages'],
      storyLeft: ['experience', 'education', 'custom'],
      storyRight: ['projects', 'certifications'],
    },
  },
  professional: {
    regions: [{ key: 'main', label: 'Main' }, { key: 'supporting', label: 'Supporting' }],
    defaultLayout: {
      main: ['experience', 'projects', 'education', 'custom'],
      supporting: ['skills', 'languages', 'certifications'],
    },
  },
  executive: {
    regions: [{ key: 'left', label: 'Left' }, { key: 'right', label: 'Right' }],
    defaultLayout: {
      left: ['experience', 'projects'],
      right: ['education', 'skills', 'languages', 'certifications', 'custom'],
    },
  },
  slate: {
    regions: [{ key: 'main', label: 'Main' }, { key: 'sidebar', label: 'Sidebar' }],
    defaultLayout: {
      main: ['experience', 'projects', 'education', 'custom'],
      sidebar: ['skills', 'languages'],
    },
  },
  ivory: {
    regions: [{ key: 'main', label: 'Main' }, { key: 'side', label: 'Side' }],
    defaultLayout: {
      main: ['experience', 'education', 'projects', 'custom'],
      side: ['skills', 'languages', 'certifications'],
    },
  },
  summit: {
    regions: [{ key: 'main', label: 'Main' }, { key: 'side', label: 'Side' }],
    defaultLayout: {
      main: ['experience', 'projects', 'education', 'custom'],
      side: ['skills', 'languages', 'certifications'],
    },
  },
  studio: {
    regions: [{ key: 'main', label: 'Main' }, { key: 'side', label: 'Side' }],
    defaultLayout: {
      main: ['experience', 'projects'],
      side: ['education', 'skills', 'languages', 'certifications', 'custom'],
    },
  },
  atlas: {
    regions: [{ key: 'left', label: 'Left' }, { key: 'right', label: 'Right' }],
    defaultLayout: {
      left: ['experience', 'education', 'projects'],
      right: ['skills', 'languages', 'certifications', 'custom'],
    },
  },
  dossier: {
    regions: [{ key: 'main', label: 'Main' }, { key: 'side', label: 'Side' }],
    defaultLayout: {
      main: ['experience', 'projects', 'education', 'custom'],
      side: ['skills', 'languages', 'certifications'],
    },
  },
  north: {
    regions: [{ key: 'main', label: 'Main' }, { key: 'sidebar', label: 'Sidebar' }],
    defaultLayout: {
      main: ['experience', 'projects', 'education', 'custom'],
      sidebar: ['skills', 'languages', 'certifications'],
    },
  },
  zenith: {
    regions: [{ key: 'lead', label: 'Lead' }, { key: 'support', label: 'Support' }],
    defaultLayout: {
      lead: ['experience', 'projects', 'custom'],
      support: ['education', 'skills', 'languages', 'certifications'],
    },
  },
  editorial: {
    regions: [
      { key: 'left', label: 'Left' },
      { key: 'middle', label: 'Middle' },
      { key: 'right', label: 'Right' },
    ],
    defaultLayout: {
      left: ['custom', 'skills', 'languages'],
      middle: ['experience', 'projects'],
      right: ['education', 'certifications'],
    },
  },
};

export function getTemplateLayoutPreset(templateId: TemplateId): TemplateLayoutPreset {
  return TEMPLATE_LAYOUT_PRESETS[templateId];
}

export function createDefaultTemplateLayout(templateId: TemplateId, sections: CVSection[]): TemplateLayoutState {
  const preset = getTemplateLayoutPreset(templateId);
  const assigned = new Set<string>();
  const nextLayout: TemplateLayoutState = {};

  preset.regions.forEach((region) => {
    const types = preset.defaultLayout[region.key] ?? [];
    const orderedIds = types.flatMap((type) =>
      sections
        .filter((section) => !assigned.has(section.id) && section.type === type)
        .map((section) => {
          assigned.add(section.id);
          return section.id;
        }),
    );

    nextLayout[region.key] = orderedIds;
  });

  const fallbackRegion = preset.regions.find((region) => region.key === FALLBACK_REGION)?.key ?? preset.regions[0]?.key;
  if (fallbackRegion) {
    const fallbackIds = nextLayout[fallbackRegion] ?? [];
    const unassigned = sections.filter((section) => !assigned.has(section.id)).map((section) => section.id);
    nextLayout[fallbackRegion] = [...fallbackIds, ...unassigned];
  }

  return nextLayout;
}

export function ensureTemplateLayout(
  templateId: TemplateId,
  layout: TemplateLayoutState | undefined,
  sections: CVSection[],
): TemplateLayoutState {
  const defaultLayout = createDefaultTemplateLayout(templateId, sections);
  if (!layout) {
    return defaultLayout;
  }

  const preset = getTemplateLayoutPreset(templateId);
  const sectionIds = new Set(sections.map((section) => section.id));
  const nextLayout: TemplateLayoutState = {};
  const assigned = new Set<string>();

  preset.regions.forEach((region) => {
    nextLayout[region.key] = (layout[region.key] ?? []).filter((sectionId) => {
      if (!sectionIds.has(sectionId)) {
        return false;
      }

      if (assigned.has(sectionId)) {
        return false;
      }

      assigned.add(sectionId);
      return true;
    });
  });

  const fallbackRegion = preset.regions.find((region) => region.key === FALLBACK_REGION)?.key ?? preset.regions[0]?.key;
  sections.forEach((section) => {
    if (assigned.has(section.id)) {
      return;
    }

    const preferredRegion =
      preset.regions.find((region) => (preset.defaultLayout[region.key] ?? []).includes(section.type))?.key ??
      fallbackRegion;

    if (!preferredRegion) {
      return;
    }

    nextLayout[preferredRegion] = [...(nextLayout[preferredRegion] ?? []), section.id];
    assigned.add(section.id);
  });

  return nextLayout;
}

export function moveLayoutSection(
  layout: TemplateLayoutState,
  sourceRegion: string,
  targetRegion: string,
  sectionId: string,
  targetIndex: number,
): TemplateLayoutState {
  const nextLayout = Object.fromEntries(
    Object.entries(layout).map(([key, value]) => [key, [...(value ?? [])]]),
  ) as TemplateLayoutState;

  const sourceSections = nextLayout[sourceRegion] ?? [];
  const targetSections = nextLayout[targetRegion] ?? [];
  const sourceIndex = sourceSections.indexOf(sectionId);

  if (sourceIndex === -1) {
    return layout;
  }

  sourceSections.splice(sourceIndex, 1);

  let insertIndex = Math.max(0, Math.min(targetIndex, targetSections.length));
  if (sourceRegion === targetRegion && sourceIndex < insertIndex) {
    insertIndex -= 1;
  }
  const nextTarget = sourceRegion === targetRegion ? sourceSections : targetSections;
  nextTarget.splice(insertIndex, 0, sectionId);

  nextLayout[sourceRegion] = sourceRegion === targetRegion ? nextTarget : sourceSections;
  nextLayout[targetRegion] = nextTarget;

  return nextLayout;
}

export function getSectionsForRegion(
  sections: CVSection[],
  layout: TemplateLayoutState | undefined,
  regionKey: string,
): CVSection[] {
  if (!layout?.[regionKey]) {
    return [];
  }

  const sectionMap = new Map(sections.map((section) => [section.id, section]));
  return layout[regionKey]!
    .map((sectionId) => sectionMap.get(sectionId))
    .filter((section): section is CVSection => Boolean(section));
}
