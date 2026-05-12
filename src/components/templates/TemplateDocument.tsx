import { Suspense } from 'react';
import type { CVData, TemplateId } from '../../types/cv';
import getTemplate from '../preview/getTemplate';
import type { TemplateLayoutEditor } from './templateComponents';

export type { TemplateDragState, TemplateLayoutEditor } from './templateComponents';

interface TemplateDocumentProps {
  data: CVData;
  templateId?: TemplateId;
  layoutEditor?: TemplateLayoutEditor;
}

export default function TemplateDocument({ data, templateId, layoutEditor }: TemplateDocumentProps) {
  const id = templateId ?? data.selectedTemplate;
  const Component = getTemplate(id);
  return (
    <Suspense fallback={<div className="preview-loading">Loading...</div>}>
      <Component data={data} layoutEditor={layoutEditor} />
    </Suspense>
  );
}
