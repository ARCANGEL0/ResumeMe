import { lazy, type ComponentType } from 'react';
import type { CVData, TemplateId } from '../../types/cv';
import type { TemplateLayoutEditor } from '../templates/templateComponents';

export interface TemplateProps {
  data: CVData;
  layoutEditor?: TemplateLayoutEditor;
}

const TEMPLATE_MAP: Record<TemplateId, ComponentType<TemplateProps>> = {
  atlas: lazy(() => import('../templates/Atlas')),
  beacon: lazy(() => import('../templates/Beacon')),
  classic: lazy(() => import('../templates/Classic')),
  cobalt: lazy(() => import('../templates/Cobalt')),
  creative: lazy(() => import('../templates/Creative')),
  dossier: lazy(() => import('../templates/Dossier')),
  editorial: lazy(() => import('../templates/Editorial')),
  executive: lazy(() => import('../templates/Executive')),
  harbor: lazy(() => import('../templates/Harbor')),
  ivory: lazy(() => import('../templates/Ivory')),
  linen: lazy(() => import('../templates/Linen')),
  meridian: lazy(() => import('../templates/Meridian')),
  minimal: lazy(() => import('../templates/Minimal')),
  modern: lazy(() => import('../templates/Modern')),
  north: lazy(() => import('../templates/North')),
  praxis: lazy(() => import('../templates/Praxis')),
  professional: lazy(() => import('../templates/Professional')),
  quartz: lazy(() => import('../templates/Quartz')),
  retro95: lazy(() => import('../templates/Retro95')),
  sarif: lazy(() => import('../templates/Sarif')),
  slate: lazy(() => import('../templates/Slate')),
  studio: lazy(() => import('../templates/Studio')),
  summit: lazy(() => import('../templates/Summit')),
  vertex: lazy(() => import('../templates/Vertex')),
  windows: lazy(() => import('../templates/Windows')),
  zenith: lazy(() => import('../templates/Zenith')),
  bulletin: lazy(() => import('../templates/Bulletin')),
  corvus: lazy(() => import('../templates/Corvus')),
  granite: lazy(() => import('../templates/Granite')),
  insignia: lazy(() => import('../templates/Insignia')),
  palladio: lazy(() => import('../templates/Palladio')),
  portrait: lazy(() => import('../templates/Portrait')),
  signal: lazy(() => import('../templates/Signal')),
  verso: lazy(() => import('../templates/Verso')),
  hexon: lazy(() => import('../templates/Hexon')),
  lagoon: lazy(() => import('../templates/Lagoon')),
  scribe: lazy(() => import('../templates/Scribe')),
  toon: lazy(() => import('../templates/Toon')),
  vellum: lazy(() => import('../templates/Vellum')),
};

export default function getTemplate(id: TemplateId): ComponentType<TemplateProps> {
  return TEMPLATE_MAP[id];
}
