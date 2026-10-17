import type { CVData } from '../../types/cv';
import ReferenceResume from './ReferenceResume';
import type { TemplateLayoutEditor } from './templateComponents';

export default function Dossier(props: { data: CVData; layoutEditor?: TemplateLayoutEditor }) {
  return <ReferenceResume {...props} template="dossier" />;
}
