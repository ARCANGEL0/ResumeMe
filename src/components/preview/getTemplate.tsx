import { type ComponentType } from 'react';
import type { CVData, TemplateId } from '../../types/cv';
import type { TemplateLayoutEditor } from '../templates/templateComponents';
import Atlas from '../templates/Atlas';
import Classic from '../templates/Classic';
import Creative from '../templates/Creative';
import Dossier from '../templates/Dossier';
import Editorial from '../templates/Editorial';
import Executive from '../templates/Executive';
import Ivory from '../templates/Ivory';
import Minimal from '../templates/Minimal';
import Modern from '../templates/Modern';
import North from '../templates/North';
import Professional from '../templates/Professional';
import Sarif from '../templates/Sarif';
import Slate from '../templates/Slate';
import Studio from '../templates/Studio';
import Summit from '../templates/Summit';
import Zenith from '../templates/Zenith';

export interface TemplateProps {
  data: CVData;
  layoutEditor?: TemplateLayoutEditor;
}

const TEMPLATE_MAP: Record<TemplateId, ComponentType<TemplateProps>> = {
  atlas: Atlas,
  classic: Classic,
  creative: Creative,
  dossier: Dossier,
  editorial: Editorial,
  executive: Executive,
  ivory: Ivory,
  minimal: Minimal,
  modern: Modern,
  north: North,
  professional: Professional,
  sarif: Sarif,
  slate: Slate,
  studio: Studio,
  summit: Summit,
  zenith: Zenith,
};

export default function getTemplate(id: TemplateId): ComponentType<TemplateProps> {
  return TEMPLATE_MAP[id];
}
