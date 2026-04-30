import { t } from '../../i18n';
import { useState } from 'react';
import { useCVStore } from '../../store/cvStore';
import { LANGUAGE_PROFICIENCY_OPTIONS, type CVSection, SECTION_FIELDS } from '../../types/cv';
import FieldEditor from './FieldEditor';

interface SectionEditorProps {
  section: CVSection;
  index: number;
  totalSections: number;
}

const FIELD_LABELS: Record<string, Parameters<typeof t>[1]> = {
  company: 'company',
  position: 'position',
  startDate: 'startDate',
  endDate: 'endDate',
  description: 'description',
  institution: 'institution',
  degree: 'degree',
  name: 'name',
  level: 'level',
  language: 'languageField',
  proficiency: 'proficiency',
  url: 'url',
  technologies: 'technologies',
  issuer: 'issuer',
  date: 'date',
  title: 'titleField',
};

function getFieldType(key: string): 'text' | 'textarea' | 'date' {
  if (key === 'description') return 'textarea';
  if (key === 'startDate' || key === 'endDate' || key === 'date') return 'date';
  return 'text';
}

function getFieldOptions(key: string, value: string) {
  if (key === 'level') {
    const options = ['1', '2', '3', '4', '5'].map((level) => ({ label: level, value: level }));

    if (value && !['1', '2', '3', '4', '5'].includes(value)) {
      return [{ label: value, value }, ...options];
    }

    return options;
  }

  if (key !== 'proficiency') return undefined;

  const options = LANGUAGE_PROFICIENCY_OPTIONS.map((level) => ({
    label: level,
    value: level,
  }));

  if (value && !LANGUAGE_PROFICIENCY_OPTIONS.includes(value as (typeof LANGUAGE_PROFICIENCY_OPTIONS)[number])) {
    return [{ label: value, value }, ...options];
  }

  return options;
}

function isChecked(value: string | undefined) {
  return value === 'true';
}

export default function SectionEditor({ section, index, totalSections }: SectionEditorProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const {
    addEntry,
    language,
    removeEntry,
    removeSection,
    renameSection,
    reorderSection,
    updateEntry,
  } = useCVStore();

  const fieldKeys = SECTION_FIELDS[section.type];

  return (
    <div className="editor-section-card">
      <div className="editor-section-head">
        <div className="editor-section-title-group">
          <button
            type="button"
            onClick={() => setIsCollapsed((current) => !current)}
            className={`collapse-toggle ${!isCollapsed ? 'is-open' : ''}`}
            aria-label={isCollapsed ? `Expand ${section.title}` : `Collapse ${section.title}`}
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="collapse-toggle__icon"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>

          <div className="editor-section-title-stack">
            {isEditingTitle ? (
              <input
                value={section.title}
                onChange={(e) => renameSection(section.id, e.target.value)}
                onBlur={() => setIsEditingTitle(false)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setIsEditingTitle(false);
                  }
                }}
                autoFocus
                className="editor-section-title-input"
              />
            ) : (
              <button
                type="button"
                onClick={() => setIsEditingTitle(true)}
                className="editor-section-title"
              >
                {section.title}
              </button>
            )}
            <p className="editor-section-meta">
              {section.entries.length} {t(language, section.entries.length === 1 ? 'singleEntry' : 'entries')}
            </p>
          </div>
        </div>

        <div className="editor-section-actions">
          <button
            type="button"
            onClick={() => reorderSection(section.id, 'up')}
            disabled={index === 0}
            className="section-action"
            aria-label={`Move ${section.title} up`}
          >
            ↑
          </button>
          <button
            type="button"
            onClick={() => reorderSection(section.id, 'down')}
            disabled={index === totalSections - 1}
            className="section-action"
            aria-label={`Move ${section.title} down`}
          >
            ↓
          </button>
          <button
            type="button"
            onClick={() => removeSection(section.id)}
            className="section-action"
            aria-label={t(language, 'remove')}
            title={t(language, 'remove')}
          >
            ✕
          </button>
        </div>
      </div>

      <div className={`editor-collapsible ${isCollapsed ? 'is-collapsed' : 'is-open'}`}>
        <div className="entry-list">
          {section.entries.map((entry, entryIndex) => (
            <div key={entry.id} className="entry-card">
              <div className="entry-card__top">
                <div>
                  <div className="entry-card__label">{t(language, 'entry')} {entryIndex + 1}</div>
                  <p className="entry-card__summary">
                    {t(language, 'fillInFields')}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeEntry(section.id, entry.id)}
                  className="section-action"
                  aria-label={t(language, 'remove')}
                  title={t(language, 'remove')}
                >
                  ✕
                </button>
              </div>

              <div className="entry-card__grid">
                {fieldKeys.map((fieldKey) => {
                  const fieldType = getFieldType(fieldKey);
                  const isCurrent = section.type === 'experience' && isChecked(entry.fields.isCurrent);
                  const showStartOnly = section.type === 'education' && isChecked(entry.fields.showStartOnly);
                  const showEndOnly = section.type === 'education' && isChecked(entry.fields.showEndOnly);
                  const isDateFieldDisabled =
                    (fieldKey === 'endDate' && isCurrent) ||
                    (fieldKey === 'endDate' && showStartOnly) ||
                    (fieldKey === 'startDate' && showEndOnly);

                  return (
                    <div key={fieldKey} className={fieldType === 'textarea' ? 'editor-field--full' : ''}>
                      <FieldEditor
                        label={t(language, FIELD_LABELS[fieldKey] || 'titleField')}
                        value={entry.fields[fieldKey] || ''}
                        onChange={(value) => updateEntry(section.id, entry.id, fieldKey, value)}
                        type={fieldType}
                        placeholder={`${t(language, FIELD_LABELS[fieldKey] || 'titleField')}`}
                        options={getFieldOptions(fieldKey, entry.fields[fieldKey] || '')}
                        disabled={isDateFieldDisabled}
                      />

                      {section.type === 'experience' && fieldKey === 'endDate' && (
                        <label className="editor-checkbox">
                          <input
                            type="checkbox"
                            checked={isCurrent}
                            onChange={(event) => {
                              updateEntry(section.id, entry.id, 'isCurrent', event.target.checked ? 'true' : 'false');
                              if (event.target.checked) {
                                updateEntry(section.id, entry.id, 'endDate', '');
                              }
                            }}
                          />
                          <span>{t(language, 'currentlyWorking')}</span>
                        </label>
                      )}

                      {section.type === 'education' && fieldKey === 'endDate' && (
                        <div className="editor-toggle-row">
                          <label className="editor-checkbox">
                            <input
                              type="checkbox"
                              checked={showStartOnly}
                              onChange={(event) => {
                                updateEntry(section.id, entry.id, 'showStartOnly', event.target.checked ? 'true' : 'false');
                                if (event.target.checked) {
                                  updateEntry(section.id, entry.id, 'showEndOnly', 'false');
                                  updateEntry(section.id, entry.id, 'endDate', '');
                                }
                              }}
                            />
                            <span>{t(language, 'showOnlyStartDate')}</span>
                          </label>

                          <label className="editor-checkbox">
                            <input
                              type="checkbox"
                              checked={showEndOnly}
                              onChange={(event) => {
                                updateEntry(section.id, entry.id, 'showEndOnly', event.target.checked ? 'true' : 'false');
                                if (event.target.checked) {
                                  updateEntry(section.id, entry.id, 'showStartOnly', 'false');
                                  updateEntry(section.id, entry.id, 'startDate', '');
                                }
                              }}
                            />
                            <span>{t(language, 'showOnlyEndDate')}</span>
                          </label>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => addEntry(section.id)}
          className="add-entry-button"
        >
          {t(language, 'addEntry')}
        </button>
      </div>
    </div>
  );
}
