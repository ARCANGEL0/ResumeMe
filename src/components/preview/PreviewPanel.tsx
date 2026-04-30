import { useCVStore } from '../../store/cvStore';
import TemplateDocument from '../templates/TemplateDocument';

export default function PreviewPanel() {
  const { personalInfo, sections, selectedTemplate, templateLayouts } = useCVStore();
  const cvData = {
    personalInfo,
    sections,
    selectedTemplate,
    layoutOverride: templateLayouts[selectedTemplate],
  };

  return (
    <div className="preview-panel__inner">
      <div className="preview-paper-shell">
        <div className="preview-paper">
          <div id="cv-preview">
            <TemplateDocument data={cvData} />
          </div>
        </div>
      </div>
    </div>
  );
}
