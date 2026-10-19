import type { CVSection, SectionType, TemplateId, TemplateLayoutState } from '../../types/cv';
import { debugLog } from '../../utils/debugLog';

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
  europass: {
    regions: [{ key: 'main', label: 'Main' }],
    defaultLayout: {
      main: ['experience', 'education', 'skills', 'certifications', 'projects', 'languages', 'custom'],
    },
  },
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
    regions: [
      { key: 'main', label: 'Career' },
      { key: 'lowerLeft', label: 'Education' },
      { key: 'lowerMiddle', label: 'Skills' },
      { key: 'lowerRight', label: 'Additional' },
    ],
    defaultLayout: {
      main: ['experience', 'projects'],
      lowerLeft: ['education'],
      lowerMiddle: ['skills', 'languages'],
      lowerRight: ['certifications', 'custom'],
    },
  },
  creative: {
    regions: [{ key: 'sidebar', label: 'Profile' }, { key: 'main', label: 'Experience' }],
    defaultLayout: {
      sidebar: ['skills', 'languages'],
      main: ['experience', 'projects', 'education', 'certifications', 'custom'],
    },
  },
  professional: {
    regions: [{ key: 'main', label: 'Main' }],
    defaultLayout: {
      main: ['experience', 'education', 'skills', 'languages', 'projects', 'certifications', 'custom'],
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
      main: ['experience', 'education', 'projects', 'skills', 'languages', 'certifications', 'custom'],
      sidebar: [],
    },
  },
  sarif: {
    regions: [{ key: 'main', label: 'Main' }],
    defaultLayout: {
      main: ['experience', 'projects', 'education', 'skills', 'languages', 'certifications', 'custom'],
    },
  },
  ivory: {
    regions: [{ key: 'main', label: 'Main' }, { key: 'side', label: 'Side' }],
    defaultLayout: {
      main: ['education', 'certifications', 'skills', 'experience', 'projects', 'languages', 'custom'],
      side: [],
    },
  },
  summit: {
    regions: [{ key: 'main', label: 'Main' }, { key: 'side', label: 'Side' }],
    defaultLayout: {
      main: ['experience', 'education', 'projects'],
      side: ['skills', 'languages', 'certifications', 'custom'],
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
      main: ['experience', 'projects', 'custom'],
      side: ['education', 'skills', 'languages', 'certifications'],
    },
  },
  north: {
    regions: [{ key: 'main', label: 'Main' }, { key: 'sidebar', label: 'Sidebar' }],
    defaultLayout: {
      main: ['experience', 'education', 'projects', 'certifications', 'custom'],
      sidebar: ['skills', 'languages'],
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
  meridian: {
    regions: [{ key: 'meta', label: 'Meta' }, { key: 'main', label: 'Main' }],
    defaultLayout: {
      meta: ['skills', 'languages', 'certifications'],
      main: ['experience', 'projects', 'education', 'custom'],
    },
  },
  vertex: {
    regions: [
      { key: 'main', label: 'Main' },
      { key: 'supportLeft', label: 'Support Left' },
      { key: 'supportRight', label: 'Support Right' },
    ],
    defaultLayout: {
      main: ['experience', 'projects', 'custom'],
      supportLeft: ['education', 'certifications'],
      supportRight: ['skills', 'languages'],
    },
  },
  harbor: {
    regions: [{ key: 'sidebar', label: 'Sidebar' }, { key: 'main', label: 'Main' }],
    defaultLayout: {
      sidebar: ['skills', 'languages', 'certifications'],
      main: ['experience', 'projects', 'education', 'custom'],
    },
  },
  beacon: {
    regions: [{ key: 'main', label: 'Main' }],
    defaultLayout: {
      main: ['experience', 'education', 'projects', 'skills', 'languages', 'certifications', 'custom'],
    },
  },
  quartz: {
    regions: [{ key: 'main', label: 'Main' }, { key: 'side', label: 'Side' }],
    defaultLayout: {
      main: ['experience', 'projects', 'custom'],
      side: ['education', 'skills', 'languages', 'certifications'],
    },
  },
  retro95: {
    regions: [{ key: 'main', label: 'Main' }, { key: 'sidebar', label: 'Sidebar' }],
    defaultLayout: {
      main: ['experience', 'projects', 'education', 'custom'],
      sidebar: ['skills', 'languages', 'certifications'],
    },
  },
  windows: {
    regions: [{ key: 'main', label: 'Main' }, { key: 'sidebar', label: 'Sidebar' }],
    defaultLayout: {
      main: ['experience', 'projects', 'education', 'custom'],
      sidebar: ['skills', 'languages', 'certifications'],
    },
  },
  cobalt: {
    regions: [{ key: 'main', label: 'Main' }, { key: 'aside', label: 'Aside' }],
    defaultLayout: {
      main: ['experience', 'projects', 'education', 'skills'],
      aside: ['languages', 'certifications', 'custom'],
    },
  },
  linen: {
    regions: [{ key: 'main', label: 'Main' }, { key: 'sidebar', label: 'Sidebar' }],
    defaultLayout: {
      main: ['experience', 'projects', 'certifications', 'custom'],
      sidebar: ['education', 'skills', 'languages'],
    },
  },
  praxis: {
    regions: [{ key: 'main', label: 'Main' }, { key: 'side', label: 'Side' }],
    defaultLayout: {
      main: ['experience', 'education', 'projects'],
      side: ['skills', 'languages', 'certifications', 'custom'],
    },
  },
  vellum: {
    regions: [{ key: 'left', label: 'Left' }, { key: 'right', label: 'Right' }],
    defaultLayout: {
      left: ['experience', 'projects', 'custom'],
      right: ['education', 'skills', 'languages', 'certifications'],
    },
  },
  toon: {
    regions: [{ key: 'main', label: 'Main' }, { key: 'side', label: 'Side' }],
    defaultLayout: {
      main: ['experience', 'education', 'projects'],
      side: ['skills', 'languages', 'certifications', 'custom'],
    },
  },
  hexon: {
    regions: [{ key: 'main', label: 'Main' }, { key: 'sidebar', label: 'Sidebar' }],
    defaultLayout: {
      main: ['experience', 'projects', 'education', 'custom'],
      sidebar: ['skills', 'languages', 'certifications'],
    },
  },
  lagoon: {
    regions: [{ key: 'main', label: 'Main' }, { key: 'sidebar', label: 'Sidebar' }],
    defaultLayout: {
      main: ['experience', 'projects', 'custom'],
      sidebar: ['education', 'skills', 'languages', 'certifications'],
    },
  },
  scribe: {
    regions: [{ key: 'main', label: 'Main' }, { key: 'aside', label: 'Aside' }],
    defaultLayout: {
      main: ['experience', 'projects', 'education', 'certifications', 'custom'],
      aside: ['skills', 'languages'],
    },
  },
  portrait: {
    regions: [{ key: 'main', label: 'Main' }, { key: 'side', label: 'Side' }],
    defaultLayout: {
      main: ['experience', 'projects', 'education', 'custom'],
      side: ['skills', 'languages', 'certifications'],
    },
  },
  insignia: {
    regions: [{ key: 'main', label: 'Main' }, { key: 'sidebar', label: 'Sidebar' }],
    defaultLayout: {
      main: ['experience', 'projects'],
      sidebar: ['skills', 'education', 'certifications', 'languages', 'custom'],
    },
  },
  bulletin: {
    regions: [{ key: 'main', label: 'Main' }, { key: 'side', label: 'Skills' }, { key: 'bottom', label: 'Lower Sections' }],
    defaultLayout: {
      main: ['experience', 'projects'],
      side: ['skills', 'languages'],
      bottom: ['certifications', 'education', 'custom'],
    },
  },
  verso: {
    regions: [{ key: 'main', label: 'Main' }, { key: 'side', label: 'Side' }],
    defaultLayout: {
      main: ['experience', 'projects', 'education', 'custom'],
      side: ['skills', 'languages', 'certifications'],
    },
  },
  granite: {
    regions: [{ key: 'main', label: 'Main' }, { key: 'footer', label: 'Footer' }],
    defaultLayout: {
      main: ['experience', 'projects', 'education', 'custom'],
      footer: ['skills', 'languages', 'certifications'],
    },
  },
  palladio: {
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
  signal: {
    regions: [{ key: 'main', label: 'Main' }, { key: 'side', label: 'Side' }],
    defaultLayout: {
      main: ['experience', 'projects', 'custom'],
      side: ['education', 'skills', 'languages', 'certifications'],
    },
  },
  corvus: {
    regions: [{ key: 'main', label: 'Main' }, { key: 'aside', label: 'Aside' }],
    defaultLayout: {
      main: ['experience', 'projects', 'education', 'custom'],
      aside: ['skills', 'languages', 'certifications'],
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
    const types = new Set(preset.defaultLayout[region.key] ?? []);
    const regionSections = sections
      .filter((section) => !assigned.has(section.id) && types.has(section.type));

    if (templateId === 'ivory') {
      const preferredOrder = preset.defaultLayout[region.key] ?? [];
      regionSections.sort((a, b) => preferredOrder.indexOf(a.type) - preferredOrder.indexOf(b.type));
    }

    const orderedIds = regionSections
      .map((section) => {
        assigned.add(section.id);
        return section.id;
      });

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
  let savedLayout = layout;
  if (templateId === 'creative' && layout.sidebar === undefined && layout.main?.length) {
    const sectionTypes = new Map(sections.map((section) => [section.id, section.type]));
    const sidebarTypes = new Set(preset.defaultLayout.sidebar ?? []);
    const savedMain = layout.main;
    const sidebar = savedMain.filter((sectionId) => sidebarTypes.has(sectionTypes.get(sectionId) as SectionType));
    if (sidebar.length) {
      savedLayout = {
        ...layout,
        main: savedMain.filter((sectionId) => !sidebar.includes(sectionId)),
        sidebar,
      };
    }
  }
  const sectionIds = new Set(sections.map((section) => section.id));
  const nextLayout: TemplateLayoutState = {};
  const assigned = new Set<string>();

  preset.regions.forEach((region) => {
    nextLayout[region.key] = (savedLayout[region.key] ?? []).filter((sectionId) => {
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
  layout: TemplateLayoutState | undefined,
  sourceRegion: string,
  targetRegion: string,
  sectionId: string,
  targetIndex: number,
): TemplateLayoutState | undefined {
  if (!layout) {
    debugLog('moveLayoutSection: layout is undefined');
    return undefined;
  }
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
