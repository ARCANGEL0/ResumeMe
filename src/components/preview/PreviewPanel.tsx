import { Suspense, useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useCVStore } from '../../store/cvStore';
import { TEMPLATES, type TemplateId } from '../../types/cv';
import getTemplate from './getTemplate';
import ZoomablePreview from './ZoomablePreview';

const VALID_TEMPLATE_IDS = new Set(TEMPLATES.map(t => t.id));

function isValidTemplateId(id: string): id is TemplateId {
  return VALID_TEMPLATE_IDS.has(id as TemplateId);
}

export default function PreviewPanel() {
  const { personalInfo, sections, selectedTemplate, showEuropassBranding, templateLayouts } = useCVStore(
    useShallow((state) => ({
      personalInfo: state.personalInfo,
      sections: state.sections,
      selectedTemplate: state.selectedTemplate,
      showEuropassBranding: state.showEuropassBranding,
      templateLayouts: state.templateLayouts,
    }))
  );
  const safeTemplate = isValidTemplateId(selectedTemplate) ? selectedTemplate : 'beacon';
  const cvData = useMemo(
    () => ({
      personalInfo,
      sections,
      selectedTemplate: safeTemplate,
      layoutOverride: templateLayouts[safeTemplate],
      showEuropassBranding,
    }),
    [personalInfo, sections, safeTemplate, showEuropassBranding, templateLayouts]
  );
  const Component = getTemplate(safeTemplate);

  return (
    <div className="preview-panel__inner">
      <ZoomablePreview>
        <div id="cv-preview">
          <Suspense fallback={<div className="preview-loading">Loading...</div>}>
            <Component data={cvData} />
          </Suspense>
        </div>
      </ZoomablePreview>
    </div>
  );
}
