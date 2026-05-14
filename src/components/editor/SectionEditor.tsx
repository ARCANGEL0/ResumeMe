import { memo, useCallback, useMemo, useRef, useState } from 'react';
import { t } from '../../i18n';
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

function getFieldType(key: string): 'text' | 'textarea' | 'date' | 'month' {
  if (key === 'description') return 'textarea';
  if (key === 'startDate' || key === 'endDate') return 'month';
  if (key === 'date') return 'date';
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
  return value === true || value === 'true';
}

interface EntryCardProps {
  entryIndex: number;
  fieldKeys: string[];
  language: ReturnType<typeof useCVStore>['language'];
  removeEntry: (sectionId: string, entryId: string) => void;
  section: CVSection;
  updateEntry: (sectionId: string, entryId: string, field: string, value: string) => void;
}

function EntryCard({
  entryIndex,
  fieldKeys,
  language,
  removeEntry,
  section,
  updateEntry,
}: EntryCardProps) {
  const entry = section.entries[entryIndex];
  if (!entry) return null;

  const handleRemove = useCallback(() => {
    removeEntry(section.id, entry.id);
  }, [removeEntry, section.id, entry.id]);

  return (
    <div className="entry-card">
      <div className="entry-card__top">
        <div>
          <div className="entry-card__label">{t(language, 'entry')} {entryIndex + 1}</div>
          <p className="entry-card__summary">{t(language, 'fillInFields')}</p>
        </div>
        <button
          type="button"
          onClick={handleRemove}
          className="section-action"
          aria-label={t(language, 'remove')}
          title={t(language, 'remove')}
        >
          ✕
        </button>
      </div>

      <div className="entry-card__grid">
        {fieldKeys.map((fieldKey) => (
          <FieldCell
            key={fieldKey}
            entry={entry}
            entryId={entry.id}
            fieldKey={fieldKey}
            language={language}
            section={section}
            updateEntry={updateEntry}
          />
        ))}
      </div>
    </div>
  );
}

interface FieldCellProps {
  entry: CVSection['entries'][number];
  entryId: string;
  fieldKey: string;
  language: ReturnType<typeof useCVStore>['language'];
  section: CVSection;
  updateEntry: (sectionId: string, entryId: string, field: string, value: string) => void;
}

const FieldCell = function FieldCell({ entry, entryId, fieldKey, language, section, updateEntry }: FieldCellProps) {
  const fieldType = useMemo(() => getFieldType(fieldKey), [fieldKey]);
  const fieldValue = entry.fields[fieldKey] || '';
  console.log('FieldCell render:', fieldKey, 'value:', fieldValue, 'entryId:', entryId);
  const endDateBackup = useRef('');
  const startDateBackup = useRef('');

  const isCurrent = useMemo(
    () => section.type === 'experience' && isChecked(entry.fields.isCurrent),
    [section.type, entry.fields.isCurrent]
  );
  const showStartOnly = useMemo(
    () => section.type === 'education' && isChecked(entry.fields.showStartOnly),
    [section.type, entry.fields.showStartOnly]
  );
  const showEndOnly = useMemo(
    () => section.type === 'education' && isChecked(entry.fields.showEndOnly),
    [section.type, entry.fields.showEndOnly]
  );

  const isDateFieldDisabled = useMemo(
    () =>
      (fieldKey === 'endDate' && isCurrent) ||
      (fieldKey === 'endDate' && showStartOnly) ||
      (fieldKey === 'startDate' && showEndOnly),
    [fieldKey, isCurrent, showStartOnly, showEndOnly]
  );

  const handleChange = useCallback(
    (value: string) => {
      updateEntry(section.id, entryId, fieldKey, value);
    },
    [updateEntry, section.id, entryId, fieldKey]
  );

  const handleCurrentToggle = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const checked = event.target.checked;
      updateEntry(section.id, entryId, 'isCurrent', checked ? 'true' : 'false');
      if (checked) {
        endDateBackup.current = entry.fields.endDate || '';
        updateEntry(section.id, entryId, 'endDate', '');
      } else {
        updateEntry(section.id, entryId, 'endDate', endDateBackup.current);
      }
    },
    [updateEntry, section.id, entryId, entry.fields.endDate]
  );

  const handleStartOnlyToggle = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const checked = event.target.checked;
      updateEntry(section.id, entryId, 'showStartOnly', checked ? 'true' : 'false');
      if (checked) {
        endDateBackup.current = entry.fields.endDate || '';
        updateEntry(section.id, entryId, 'showEndOnly', 'false');
        updateEntry(section.id, entryId, 'endDate', '');
      } else {
        updateEntry(section.id, entryId, 'endDate', endDateBackup.current);
      }
    },
    [updateEntry, section.id, entryId, entry.fields.endDate]
  );

  const handleEndOnlyToggle = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const checked = event.target.checked;
      updateEntry(section.id, entryId, 'showEndOnly', checked ? 'true' : 'false');
      if (checked) {
        startDateBackup.current = entry.fields.startDate || '';
        updateEntry(section.id, entryId, 'showStartOnly', 'false');
        updateEntry(section.id, entryId, 'startDate', '');
      } else {
        updateEntry(section.id, entryId, 'startDate', startDateBackup.current);
      }
    },
    [updateEntry, section.id, entryId, entry.fields.startDate]
  );

  return (
    <div className={fieldType === 'textarea' ? 'editor-field--full' : ''}>
      <FieldEditor
        label={t(language, FIELD_LABELS[fieldKey] || 'titleField')}
        value={fieldValue}
        onChange={handleChange}
        type={fieldType}
        placeholder={`${t(language, FIELD_LABELS[fieldKey] || 'titleField')}`}
        options={getFieldOptions(fieldKey, fieldValue)}
        disabled={isDateFieldDisabled}
      />

      {section.type === 'experience' && fieldKey === 'endDate' && (
        <label className="editor-checkbox">
          <input type="checkbox" checked={isCurrent} onChange={handleCurrentToggle} />
          <span>{t(language, 'currentlyWorking')}</span>
        </label>
      )}

      {section.type === 'education' && fieldKey === 'endDate' && (
        <div className="editor-toggle-row">
          <label className="editor-checkbox">
            <input type="checkbox" checked={showStartOnly} onChange={handleStartOnlyToggle} />
            <span>{t(language, 'showOnlyStartDate')}</span>
          </label>
          <label className="editor-checkbox">
            <input type="checkbox" checked={showEndOnly} onChange={handleEndOnlyToggle} />
            <span>{t(language, 'showOnlyEndDate')}</span>
          </label>
        </div>
      )}
    </div>
  );
};

const SectionEditor = function SectionEditor({ section, index, totalSections }: SectionEditorProps) {
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

  const fieldKeys = useMemo(() => SECTION_FIELDS[section.type], [section.type]);

  const handleToggleCollapse = useCallback(() => {
    setIsCollapsed((current) => !current);
  }, []);

  const handleEditTitle = useCallback(() => {
    setIsEditingTitle(true);
  }, []);

  const handleTitleBlur = useCallback(() => {
    setIsEditingTitle(false);
  }, []);

  const handleTitleKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      setIsEditingTitle(false);
    }
  }, []);

  const handleTitleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      renameSection(section.id, event.target.value);
    },
    [renameSection, section.id]
  );

  const handleMoveUp = useCallback(() => {
    reorderSection(section.id, 'up');
  }, [reorderSection, section.id]);

  const handleMoveDown = useCallback(() => {
    reorderSection(section.id, 'down');
  }, [reorderSection, section.id]);

  const handleRemove = useCallback(() => {
    removeSection(section.id);
  }, [removeSection, section.id]);

  const handleAddEntry = useCallback(() => {
    addEntry(section.id);
  }, [addEntry, section.id]);

  return (
    <div className="editor-section-card">
      <div className="editor-section-head">
        <div className="editor-section-title-group">
          <button
            type="button"
            onClick={handleToggleCollapse}
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
                onChange={handleTitleChange}
                onBlur={handleTitleBlur}
                onKeyDown={handleTitleKeyDown}
                autoFocus
                className="editor-section-title-input"
              />
            ) : (
              <button
                type="button"
                onClick={handleEditTitle}
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
            onClick={handleMoveUp}
            disabled={index === 0}
            className="section-action"
            aria-label={`Move ${section.title} up`}
          >
            ↑
          </button>
          <button
            type="button"
            onClick={handleMoveDown}
            disabled={index === totalSections - 1}
            className="section-action"
            aria-label={`Move ${section.title} down`}
          >
            ↓
          </button>
          <button
            type="button"
            onClick={handleRemove}
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
            <EntryCard
              key={entry.id}
              entryIndex={entryIndex}
              fieldKeys={fieldKeys}
              language={language}
              removeEntry={removeEntry}
              section={section}
              updateEntry={updateEntry}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={handleAddEntry}
          className="add-entry-button"
        >
          {t(language, 'addEntry')}
        </button>
      </div>
    </div>
  );
};

export default SectionEditor;
