import { useEffect, useMemo, useRef, useState } from 'react';
import { LANGUAGE_OPTIONS, type UILanguage, t } from '../i18n';
import { useCVStore } from '../store/cvStore';

interface LanguageSelectorProps {
  className?: string;
  style?: React.CSSProperties;
}

export default function LanguageSelector({ className = '', style }: LanguageSelectorProps) {
  const { language, setLanguage } = useCVStore();
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const selectedOption = useMemo(
    () => LANGUAGE_OPTIONS.find((option) => option.id === language) ?? LANGUAGE_OPTIONS[0],
    [language]
  );

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
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

  return (
    <div
      ref={rootRef}
      translate="no"
      className={['language-selector', isOpen ? 'is-open' : '', className].filter(Boolean).join(' ')}
      style={style}
    >
      <button
        type="button"
        className="language-selector__trigger"
        onClick={() => setIsOpen((current) => !current)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={t(language, 'language')}
      >
        <span className="language-selector__glow" aria-hidden="true" />
        <span className="language-selector__icon" aria-hidden="true">
          <GlobeIcon />
        </span>
        <span className="language-selector__flag" aria-hidden="true">
          {selectedOption?.flag}
        </span>
        <span className="language-selector__meta">
          <span className="language-selector__label">{t(language, 'language')}</span>
          <span className="language-selector__value">{selectedOption?.label}</span>
        </span>
        <span className="language-selector__chevron" aria-hidden="true">
          <ChevronIcon />
        </span>
      </button>

      <div className={`language-selector__menu ${isOpen ? 'is-open' : ''}`} role="listbox" aria-label={t(language, 'language')}>
        <div className="language-selector__menu-head">
          <span>{t(language, 'language')}</span>
          <span>{LANGUAGE_OPTIONS.length}</span>
        </div>

        <div className="language-selector__options">
          {LANGUAGE_OPTIONS.map((option) => {
            const isSelected = option.id === language;

            return (
              <button
                key={option.id}
                type="button"
                role="option"
                aria-selected={isSelected}
                className={`language-selector__option ${isSelected ? 'is-selected' : ''}`}
                onClick={() => {
                  setLanguage(option.id as UILanguage);
                  setIsOpen(false);
                }}
              >
                <span className="language-selector__option-flag" aria-hidden="true">
                  {option.flag}
                </span>
                <span className="language-selector__option-label">{option.label}</span>
                <span className="language-selector__option-code">{option.id.toUpperCase()}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function GlobeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a15 15 0 0 1 0 18" />
      <path d="M12 3a15 15 0 0 0 0 18" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
