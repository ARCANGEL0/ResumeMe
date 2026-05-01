import { useCVStore } from '../../store/cvStore';
import getTemplate from './getTemplate';

export default function PreviewPanel() {
  const { personalInfo, sections, selectedTemplate, templateLayouts } = useCVStore();
  const cvData = {
    personalInfo,
    sections,
    selectedTemplate,
    layoutOverride: templateLayouts[selectedTemplate],
  };
  const Component = getTemplate(selectedTemplate);

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
