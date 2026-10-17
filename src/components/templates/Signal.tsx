import type { CVData } from '../../types/cv';
import ReferenceResume from './ReferenceResume';
import type { TemplateLayoutEditor } from './templateComponents';

export default function Signal(props: { data: CVData; layoutEditor?: TemplateLayoutEditor }) {
  return <ReferenceResume {...props} template="signal" />;
}
