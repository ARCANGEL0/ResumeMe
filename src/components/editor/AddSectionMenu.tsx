import { getSectionTitle, t } from '../../i18n';
import { useCVStore } from '../../store/cvStore';
import { type SectionType } from '../../types/cv';

const ALL_SECTIONS: { type: SectionType; icon: string }[] = [
  { type: 'experience', icon: '💼' },
  { type: 'education', icon: '🎓' },
  { type: 'skills', icon: '⚡' },
  { type: 'languages', icon: '🌍' },
  { type: 'projects', icon: '🚀' },
  { type: 'certifications', icon: '📜' },
];

export default function AddSectionMenu() {
  const { language, sections, addSection } = useCVStore();

  const usedTypes = new Set(sections.map((section) => section.type));
  const availableSections = ALL_SECTIONS.filter((section) => !usedTypes.has(section.type));
  const showCustomOnly = availableSections.length === 0;

  return (
    <div className="add-section-card">
      <div className="add-section-card__intro">
        <div className="add-section-card__title">{t(language, 'sectionLibrary')}</div>
        <p className="add-section-card__description">
          {t(language, 'sectionLibraryDescription')}
        </p>
      </div>

      <div className="add-section-grid">
        {availableSections.map((section) => (
          <button
            key={section.type}
            type="button"
            onClick={() => addSection(section.type)}
            className="add-section-button"
          >
            <span className="add-section-button__icon">{section.icon}</span>
            <span className="add-section-button__label">{getSectionTitle(language, section.type)}</span>
            <span className="add-section-button__plus">+</span>
          </button>
        ))}

        <button
          type="button"
          onClick={() => addSection('custom')}
          className="add-section-button"
        >
          <span className="add-section-button__icon">✨</span>
          <span className="add-section-button__label">{getSectionTitle(language, 'custom')}</span>
          <span className="add-section-button__plus">+</span>
        </button>
      </div>

      {showCustomOnly && (
        <p className="add-section-note">
          {t(language, 'allStandardSectionsAdded')}
        </p>
      )}
    </div>
  );
}
