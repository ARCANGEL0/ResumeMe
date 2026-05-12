import { useShallow } from 'zustand/react/shallow';
import { t } from '../../i18n';
import { useCVStore } from '../../store/cvStore';
import AddSectionMenu from './AddSectionMenu';
import PersonalInfoEditor from './PersonalInfoEditor';
import SectionEditor from './SectionEditor';

export default function EditorPanel() {
  const { language, sections } = useCVStore(
    useShallow((state) => ({ language: state.language, sections: state.sections })),
  );

  return (
    <div className="editor-panel">
      <div className="editor-panel__inner">
        <div className="editor-section-heading">{t(language, 'personalInformation')}</div>
        <PersonalInfoEditor />

        <div className="editor-section-heading">{t(language, 'resumeSections')}</div>
        {sections.map((section, index) => (
          <SectionEditor
            key={section.id}
            section={section}
            index={index}
            totalSections={sections.length}
          />
        ))}

        <div className="editor-section-heading">{t(language, 'addSections')}</div>
        <AddSectionMenu />
      </div>
    </div>
  );
}
