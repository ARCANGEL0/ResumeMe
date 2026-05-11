import { useMemo } from 'react';
import { useCVStore } from '../../store/cvStore';
import { TEMPLATES, type TemplateId } from '../../types/cv';
import getTemplate from './getTemplate';

const VALID_TEMPLATE_IDS = new Set(TEMPLATES.map(t => t.id));

function isValidTemplateId(id: string): id is TemplateId {
  return VALID_TEMPLATE_IDS.has(id as TemplateId);
}

export default function PreviewPanel() {
  const { personalInfo, sections, selectedTemplate, templateLayouts } = useCVStore();
  const safeTemplate = isValidTemplateId(selectedTemplate) ? selectedTemplate : 'minimal';
  const cvData = useMemo(
    () => ({
      personalInfo,
      sections,
      selectedTemplate: safeTemplate,
      layoutOverride: templateLayouts[safeTemplate],
    }),
    [personalInfo, sections, safeTemplate, templateLayouts]
  );
  const Component = getTemplate(safeTemplate);

  return (
    <div className="preview-panel__inner">
      <div className="preview-paper-shell">
        <div className="preview-paper">
          <div id="cv-preview">
            <Component data={cvData} />
          </div>
        </div>
      </div>
    </div>
  );
}
