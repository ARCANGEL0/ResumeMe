import { lazy, type ComponentType } from 'react';
import type { CVData, TemplateId } from '../../types/cv';
import type { TemplateLayoutEditor } from '../templates/templateComponents';

export interface TemplateProps {
  data: CVData;
  layoutEditor?: TemplateLayoutEditor;
}

const TEMPLATE_MAP: Record<TemplateId, ComponentType<TemplateProps>> = {
  atlas: lazy(() => import('../templates/Atlas')),
  classic: lazy(() => import('../templates/Classic')),
  creative: lazy(() => import('../templates/Creative')),
  dossier: lazy(() => import('../templates/Dossier')),
  editorial: lazy(() => import('../templates/Editorial')),
  executive: lazy(() => import('../templates/Executive')),
  ivory: lazy(() => import('../templates/Ivory')),
  minimal: lazy(() => import('../templates/Minimal')),
  modern: lazy(() => import('../templates/Modern')),
  north: lazy(() => import('../templates/North')),
  professional: lazy(() => import('../templates/Professional')),
  sarif: lazy(() => import('../templates/Sarif')),
  slate: lazy(() => import('../templates/Slate')),
  studio: lazy(() => import('../templates/Studio')),
  summit: lazy(() => import('../templates/Summit')),
  zenith: lazy(() => import('../templates/Zenith')),
};

export default function getTemplate(id: TemplateId): ComponentType<TemplateProps> {
  return TEMPLATE_MAP[id];
}
