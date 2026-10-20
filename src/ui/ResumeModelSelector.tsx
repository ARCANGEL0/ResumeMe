import { useEffect, useRef, useState, type FormEvent } from 'react';
import { t } from '../i18n';
import { useCVStore } from '../store/cvStore';
import type { CVData } from '../types/cv';
import { getResumeModels, saveResumeModel, type ResumeModel } from '../utils/resumeModels';
import { useShallow } from 'zustand/react/shallow';

export default function ResumeModelSelector() {
  const { language, personalInfo, sections, selectedTemplate, showEuropassBranding, templateLayouts } = useCVStore(
    useShallow((state) => ({
      language: state.language,
      personalInfo: state.personalInfo,
      sections: state.sections,
      selectedTemplate: state.selectedTemplate,
      showEuropassBranding: state.showEuropassBranding,
      templateLayouts: state.templateLayouts,
    }))
  );
  const [isOpen, setIsOpen] = useState(false);
  const [isNaming, setIsNaming] = useState(false);
  const [modelName, setModelName] = useState('');
  const [listaModelos, setListaModelos] = useState<ResumeModel[]>([]);
  const [storageError, setStorageError] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    getResumeModels()
      .then(setListaModelos)
      .catch(() => setStorageError(true));

    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
        setIsNaming(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsNaming(false);
        setIsOpen(false);
      }
    };

    window.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = modelName.trim();
    if (!trimmedName) return;

    const data: CVData = {
      personalInfo,
      sections,
      selectedTemplate,
      showEuropassBranding,
    };
    const mdl: ResumeModel = {
      id: `mdl-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: trimmedName,
      savedAt: Date.now(),
      data,
      templateLayouts,
    };

    try {
      await saveResumeModel(mdl);
      setListaModelos((current) => [mdl, ...current].sort((a, b) => b.savedAt - a.savedAt));
      setStorageError(false);
      setModelName('');
      setIsNaming(false);
      setIsOpen(true);
    } catch {
      setStorageError(true);
    }
  };

  return (
    <div ref={rootRef} className={`resume-model-picker ${isOpen ? 'is-open' : ''}`}>
      <button
        type="button"
        className="resume-model-picker__trigger"
        onClick={() => setIsOpen((open) => !open)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={t(language, 'draft')}
      >
        <DraftIcon />
        <span>{t(language, 'draft')}</span>
        <ChevronIcon />
      </button>

      {isOpen && <div className="resume-model-picker__menu" role="menu">
        <button
          type="button"
          className="resume-model-picker__save"
          role="menuitem"
          onClick={() => {
            setIsOpen(false);
            setStorageError(false);
            setIsNaming(true);
          }}
        >
          <span className="resume-model-picker__plus" aria-hidden="true">+</span>
          <span>{t(language, 'saveModel')}</span>
        </button>

        <div className="resume-model-picker__list" role="list">
          {storageError ? (
            <p className="resume-model-picker__empty" role="status">{t(language, 'modelsUnavailable')}</p>
          ) : listaModelos.length ? (
            listaModelos.map((mdl) => (
              <div key={mdl.id} className="resume-model-picker__model" role="listitem">
                <ModelIcon />
                <span>{mdl.name}</span>
              </div>
            ))
          ) : (
            <p className="resume-model-picker__empty">{t(language, 'noSavedModels')}</p>
          )}
        </div>
      </div>}

      {isNaming && <div
        className="resume-model-dialog-backdrop"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) setIsNaming(false);
        }}
      >
        <section className="resume-model-dialog" role="dialog" aria-modal="true" aria-labelledby="resume-model-title">
          <h2 id="resume-model-title">{t(language, 'saveModel')}</h2>
          <form onSubmit={handleSave}>
            <label htmlFor="resume-model-name">{t(language, 'name')}</label>
            <input
              id="resume-model-name"
              autoFocus
              maxLength={80}
              value={modelName}
              onChange={(event) => setModelName(event.target.value)}
              placeholder={t(language, 'name')}
            />
            {storageError && <p className="resume-model-dialog__error" role="alert">{t(language, 'modelsUnavailable')}</p>}
            <div className="resume-model-dialog__actions">
              <button type="button" className="resume-model-dialog__cancel" onClick={() => setIsNaming(false)}>
                {t(language, 'modelCancel')}
              </button>
              <button type="submit" className="resume-model-dialog__save" disabled={!modelName.trim()}>
                {t(language, 'modelSave')}
              </button>
            </div>
          </form>
        </section>
      </div>}
    </div>
  );
}

function DraftIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 3.75h8l4 4v12.5H6z" />
      <path d="M14 3.75v4h4M9 12h6M9 15.5h6" />
    </svg>
  );
}

function ModelIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 5.5h16v13H4zM8 9h8M8 12h8M8 15h5" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
