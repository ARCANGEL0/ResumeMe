import LanguageSelector from '../../ui/LanguageSelector';
import { getTemplateDescription, getTemplateName, t } from '../../i18n';
import { useCallback, useEffect, useState, type CSSProperties } from 'react';
import { useCVStore } from '../../store/cvStore';
import { TEMPLATES, type TemplateId, type TemplateLayoutState } from '../../types/cv';
import { exportToPDF } from '../../utils/pdfExport';
import TemplateDocument from './TemplateDocument';
import { createDefaultTemplateLayout, ensureTemplateLayout, moveLayoutSection } from './templateLayout';
import { TEMPLATE_THEMES } from './templateCatalog';

export default function TemplateSelector() {
  const { language, personalInfo, sections, selectedTemplate, setTemplate, setTemplateLayout, setView, templateLayouts } =
    useCVStore();
  const currentIndex = TEMPLATES.findIndex((template) => template.id === selectedTemplate);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dragState, setDragState] = useState<{
    regionKey: string;
    sectionId: string;
  } | null>(null);
  const activeLayout = ensureTemplateLayout(
    selectedTemplate,
    templateLayouts[selectedTemplate] ?? createDefaultTemplateLayout(selectedTemplate, sections),
    sections,
  );

  const handleExport = () => {
    exportToPDF('cv-preview', `${personalInfo.fullName || 'CV'}.pdf`);
  };

  const updateActiveLayout = useCallback(
    (sourceRegion: string, targetRegion: string, sectionId: string, targetIndex: number) => {
      const nextLayout = moveLayoutSection(activeLayout, sourceRegion, targetRegion, sectionId, targetIndex);
      setTemplateLayout(selectedTemplate, nextLayout);
    },
    [activeLayout, selectedTemplate, setTemplateLayout],
  );

  const goToTemplate = useCallback((index: number) => {
    if (index < 0 || index >= TEMPLATES.length) return;

    const template = TEMPLATES[index];
    if (!template || template.id === selectedTemplate) return;

    setTemplate(template.id);
  }, [selectedTemplate, setTemplate]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
        goToTemplate(currentIndex + 1);
      }

      if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
        goToTemplate(currentIndex - 1);
      }

      if (event.key === 'Escape') {
        setView('editor');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, goToTemplate, setView]);

  return (
    <div className="template-shell">
      {/* Mobile toggle button */}
      <button
        type="button"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="template-sidebar-toggle no-print"
        aria-label="Toggle templates"
      >
        {sidebarOpen ? '✕' : '☰'}
      </button>

      <header className="topbar no-print">
        <div className="topbar__brand">
          <ResumeMark className="topbar__icon" />
          <div>
            <div className="topbar__title">{t(language, 'templatePicker')}</div>
            <div className="topbar__subtitle topbar__subtitle--brand">
              <a href="https://arcangelo.net" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                {t(language, 'developedByArcangelo')}
              </a>
            </div>
          </div>
        </div>

        {/* Language selector inside header on mobile */}
        <div className="topbar__language-mobile">
          <LanguageSelector className="language-fab no-print" />
        </div>
      </header>

      <div className="template-workspace">
        <aside className={`template-sidebar ${sidebarOpen ? 'is-open' : ''}`}>
          <div className="template-panel">
            <div className="template-panel__inner">
              <div className="editor-section-heading">{t(language, 'templates')}</div>
              <div className="template-list">
                {TEMPLATES.map((template) => {
                  const isSelected = template.id === selectedTemplate;
                  const templateDescription = getTemplateDescription(language, template.id);

                  return (
                    <button
                      key={template.id}
                      type="button"
                      onClick={() => setTemplate(template.id)}
                      className={`template-list-card ${isSelected ? 'is-selected' : ''}`}
                      aria-pressed={isSelected}
                    >
                      <div className="template-list-card__preview">
                        <TemplateThumbPreview id={template.id} />
                      </div>

                      <div className="template-list-card__content">
                        <div className="template-list-card__head">
                          <span className="template-list-card__name">{getTemplateName(language, template.id)}</span>
                          {isSelected && (
                            <span className="template-list-card__badge">{t(language, 'selected')}</span>
                          )}
                        </div>
                        {templateDescription ? (
                          <p className="template-list-card__description">{templateDescription}</p>
                        ) : null}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>

        <div className="preview-panel">
          <div className="preview-panel__inner">
    
            <div className="preview-paper-shell">
              <div className="preview-paper preview-paper--a4">
                <div id="cv-preview">
                  <TemplatePreview
                    layoutOverride={activeLayout}
                    dragState={dragState}
                    onDragStart={(regionKey, sectionId) => setDragState({ regionKey, sectionId })}
                    onDragEnd={() => setDragState(null)}
                    onDropSection={updateActiveLayout}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="template-actions-fab no-print">
        <button
          type="button"
          onClick={() => setView('editor')}
          className="secondary-action"
        >
          {t(language, 'return')}
        </button>
        <button
          type="button"
          onClick={handleExport}
          className="primary-action primary-action--nav"
        >
          {t(language, 'downloadPdf')}
        </button>
      </div>
    </div>
  );
}

function ResumeMark({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className}>
      <path
        d="M7 3.5h7.4L19 8.1V20a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M14.2 3.5V8h4.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M9 11h6M9 14.5h6M9 18h4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TemplatePreview({
  dragState,
  layoutOverride,
  onDragEnd,
  onDragStart,
  onDropSection,
}: {
  dragState: { regionKey: string; sectionId: string } | null;
  layoutOverride?: TemplateLayoutState;
  onDragEnd: () => void;
  onDragStart: (regionKey: string, sectionId: string) => void;
  onDropSection: (sourceRegion: string, targetRegion: string, sectionId: string, targetIndex: number) => void;
}) {
  const { personalInfo, sections, selectedTemplate } = useCVStore();
  const cvData = { personalInfo, sections, selectedTemplate, layoutOverride };

  return (
    <TemplateDocument
      data={cvData}
      layoutEditor={{
        dragState,
        onDragStart,
        onDragEnd,
        onDrop: onDropSection,
      }}
    />
  );
}

function TemplateThumbPreview({ id }: { id: TemplateId }) {
  const theme = TEMPLATE_THEMES[id];

  return (
    <div
      className={`template-mini template-mini--${theme.thumbLayout}`}
      style={
        {
          '--thumb-accent': theme.accent,
          '--thumb-accent-alt': theme.accentAlt,
          '--thumb-soft': theme.accentSoft,
          '--thumb-line': theme.line,
        } as CSSProperties
      }
    >
      <MiniSheet>{renderMiniTemplate(id)}</MiniSheet>
    </div>
  );
}

function renderMiniTemplate(id: TemplateId) {
  switch (id) {
    case 'modern':
      return (
        <>
          <div className="template-mini__sidebar" />
          <div className="template-mini__content has-sidebar">
            <div className="template-mini__header" />
            <MiniLineStack />
            <div className="template-mini__divider" />
            <MiniLineStack compact />
          </div>
        </>
      );
    case 'classic':
      return (
        <div style={{ display: 'flex', flex: 1, flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
          <div className="template-mini__header" style={{ width: '66%' }} />
          <div className="template-mini__banner--thin" style={{ width: '72%' }} />
          <div className="template-mini__line template-mini__line--md" />
          <div className="template-mini__divider" />
          <MiniColumns left={<MiniLineStack compact />} right={<MiniChipGrid />} />
        </div>
      );
    case 'minimal':
      return (
        <div style={{ display: 'flex', flex: 1, flexDirection: 'column', gap: '8px' }}>
          <div className="template-mini__banner--thin" style={{ width: '100%' }} />
          <div className="template-mini__header" style={{ width: '56%' }} />
          <div className="template-mini__line template-mini__line--md" />
          <MiniColumns left={<MiniLineStack />} right={<MiniDotColumn />} />
        </div>
      );
    case 'creative':
      return (
        <div style={{ display: 'flex', flex: 1, flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.08fr 0.92fr', gap: '6px' }}>
            <div className="template-mini__banner" style={{ height: '28px' }} />
            <div style={{ display: 'grid', gap: '6px' }}>
              <div className="template-mini__cell" />
              <div className="template-mini__cell" />
            </div>
          </div>
          <MiniColumns left={<MiniCardColumn />} right={<MiniCardColumn dense />} />
        </div>
      );
    case 'professional':
      return (
        <div style={{ display: 'flex', flex: 1, flexDirection: 'column', gap: '8px' }}>
          <div className="template-mini__banner" />
          <MiniColumns left={<MiniLineStack />} right={<MiniCardColumn dense />} />
        </div>
      );
    case 'executive':
      return (
        <div style={{ display: 'flex', flex: 1, flexDirection: 'column', gap: '8px' }}>
          <div className="template-mini__banner" style={{ height: '26px' }} />
          <div style={{ display: 'grid', gridTemplateColumns: '0.75fr 1.15fr 0.72fr', gap: '6px', flex: 1 }}>
            <MiniCardColumn dense />
            <MiniLineStack />
            <MiniCardColumn dense />
          </div>
        </div>
      );
    case 'slate':
      return (
        <>
          <div className="template-mini__content" style={{ marginRight: '35%' }}>
            <div className="template-mini__header" />
            <MiniLineStack />
          </div>
          <div
            className="template-mini__sidebar"
            style={{ inset: '0 0 0 auto', left: 'auto', right: 0 }}
          />
        </>
      );
    case 'ivory':
      return (
        <div
          style={{
            display: 'flex',
            flex: 1,
            flexDirection: 'column',
            gap: '8px',
            border: '1px solid var(--thumb-line)',
            padding: '8px',
          }}
        >
          <div className="template-mini__header" style={{ width: '62%', alignSelf: 'center' }} />
          <div className="template-mini__line template-mini__line--md" style={{ alignSelf: 'center' }} />
          <MiniColumns left={<MiniLineStack />} right={<MiniDotColumn />} />
        </div>
      );
    case 'summit':
      return (
        <div style={{ display: 'flex', flex: 1, flexDirection: 'column', gap: '8px' }}>
          <div className="template-mini__banner--thin" style={{ width: '100%', height: '7px' }} />
          <div style={{ display: 'grid', gridTemplateColumns: '1.06fr 0.94fr', gap: '6px' }}>
            <div className="template-mini__cell" style={{ height: '28px' }} />
            <div className="template-mini__cell" style={{ height: '28px' }} />
          </div>
          <MiniColumns left={<MiniCardColumn />} right={<MiniCardColumn dense />} />
        </div>
      );
    case 'studio':
      return (
        <div style={{ display: 'grid', gridTemplateColumns: '0.58fr 1fr 0.72fr', gap: '6px', flex: 1 }}>
          <div className="template-mini__cell" style={{ height: '100%' }} />
          <MiniLineStack />
          <MiniCardColumn dense />
        </div>
      );
    case 'atlas':
      return (
        <div style={{ display: 'flex', flex: 1, flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.08fr 0.92fr', gap: '6px' }}>
            <div className="template-mini__cell" style={{ height: '24px' }} />
            <div className="template-mini__cell" style={{ height: '24px' }} />
          </div>
          <MiniColumns left={<MiniCardColumn />} right={<MiniCardColumn />} />
        </div>
      );
    case 'dossier':
      return (
        <div style={{ display: 'flex', flex: 1, flexDirection: 'column', gap: '8px' }}>
          <div className="template-mini__cell" style={{ height: '24px' }} />
          <div className="template-mini__line template-mini__line--md" />
          <MiniColumns left={<MiniLineStack />} right={<MiniDotColumn />} />
        </div>
      );
    case 'north':
      return (
        <div style={{ display: 'grid', gridTemplateColumns: '0.82fr 1.18fr', gap: '6px', flex: 1 }}>
          <MiniCardColumn dense />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div className="template-mini__header" />
            <MiniLineStack />
          </div>
        </div>
      );
    case 'zenith':
      return (
        <div style={{ display: 'flex', flex: 1, flexDirection: 'column', gap: '8px' }}>
          <div className="template-mini__banner" style={{ height: '26px' }} />
          <MiniColumns left={<MiniCardColumn dense />} right={<MiniCardColumn />} />
        </div>
      );
    case 'editorial':
      return (
        <div style={{ display: 'flex', flex: 1, flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
          <div className="template-mini__header" style={{ width: '68%' }} />
          <div className="template-mini__line template-mini__line--sm" />
          <div style={{ display: 'grid', gridTemplateColumns: '0.9fr 1.2fr 0.9fr', gap: '6px', width: '100%', flex: 1 }}>
            <MiniLineStack compact />
            <MiniLineStack />
            <MiniCardColumn dense />
          </div>
        </div>
      );
    default:
      return (
        <div className="template-mini__content">
          <div className="template-mini__header" />
          <MiniLineStack />
        </div>
      );
  }
}

function MiniSheet({ children }: { children: React.ReactNode }) {
  return <div className="template-mini__sheet">{children}</div>;
}

function MiniColumns({
  left,
  right,
}: {
  left: React.ReactNode;
  right: React.ReactNode;
}) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 0.82fr)', gap: '6px', flex: 1 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>{left}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>{right}</div>
    </div>
  );
}

function MiniLineStack({ compact = false }: { compact?: boolean }) {
  return (
    <>
      <div className="template-mini__line template-mini__line--lg" />
      <div className="template-mini__line template-mini__line--md" />
      {!compact && <div className="template-mini__divider" />}
      <div className="template-mini__line" />
      <div className="template-mini__line template-mini__line--sm" />
    </>
  );
}

function MiniCardColumn({ dense = false }: { dense?: boolean }) {
  return (
    <>
      <div className="template-mini__cell" style={{ height: dense ? '18px' : '22px' }} />
      <div className="template-mini__cell" style={{ height: dense ? '18px' : '22px' }} />
      {!dense && <div className="template-mini__cell" style={{ height: '18px' }} />}
    </>
  );
}

function MiniChipGrid() {
  return (
    <>
      <div className="template-mini__chips">
        <span className="template-mini__chip" />
        <span className="template-mini__chip" />
      </div>
      <div className="template-mini__grid">
        <span className="template-mini__cell" />
        <span className="template-mini__cell" />
      </div>
    </>
  );
}

function MiniDotColumn() {
  return (
    <>
      <div className="template-mini__chips">
        <span className="template-mini__chip" style={{ width: '24px' }} />
        <span className="template-mini__chip" style={{ width: '24px' }} />
      </div>
      <div className="template-mini__chips">
        <span className="template-mini__chip" style={{ width: '18px' }} />
        <span className="template-mini__chip" style={{ width: '18px' }} />
        <span className="template-mini__chip" style={{ width: '18px' }} />
      </div>
    </>
  );
}
