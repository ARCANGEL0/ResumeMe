import LanguageSelector from '../../ui/LanguageSelector';
import ResumeMark from '../../ui/ResumeMark';

import { getTemplateDescription, getTemplateName, t } from '../../i18n';
import { useCallback, useEffect, useState, type CSSProperties } from 'react';
import { useCVStore } from '../../store/cvStore';
import { TEMPLATES, type TemplateId, type TemplateLayoutState } from '../../types/cv';
import { exportToPDF } from '../../utils/pdfExportMobile';
import TemplateDocument from './TemplateDocument';
import { createDefaultTemplateLayout, ensureTemplateLayout, getTemplateLayoutPreset, moveLayoutSection } from './templateLayout';
import { TEMPLATE_THEMES } from './templateCatalog';
import ZoomablePreview from '../preview/ZoomablePreview';

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

  const handleExport = async () => {
    try {
      await exportToPDF('cv-preview', `${personalInfo.fullName || 'CV'}.pdf`);
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  const updateActiveLayout = useCallback(
    (sourceRegion: string, targetRegion: string, sectionId: string, targetIndex: number) => {
      const state = useCVStore.getState();
      const activeLayout = ensureTemplateLayout(
        selectedTemplate,
        state.templateLayouts?.[selectedTemplate] ?? createDefaultTemplateLayout(selectedTemplate, state.sections),
        state.sections,
      );
      const nextLayout = moveLayoutSection(activeLayout, sourceRegion, targetRegion, sectionId, targetIndex);
      if (nextLayout) {
        setTemplateLayout(selectedTemplate, nextLayout);
      }
    },
    [selectedTemplate, setTemplateLayout],
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
              <a href="https://arcangelo.net" target="_blank" rel="noopener noreferrer" className="brand-link">
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

        {sidebarOpen && (
          <div
            className="sidebar-backdrop no-print"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <div className="preview-panel">
          <div className="preview-panel__inner">
    
            <ZoomablePreview className="preview-paper preview-paper--a4">
              <div id="cv-preview">
                <TemplatePreview
                  layoutOverride={activeLayout}
                  dragState={dragState}
                  onDragStart={(regionKey, sectionId) => setDragState({ regionKey, sectionId })}
                  onDragEnd={() => setDragState(null)}
                  onDropSection={updateActiveLayout}
                />
              </div>
            </ZoomablePreview>
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
  const regionLabels = Object.fromEntries(
    getTemplateLayoutPreset(selectedTemplate).regions.map((region) => [region.key, region.label]),
  );

  return (
    <TemplateDocument
      data={cvData}
      layoutEditor={{
        dragState,
        onDragStart,
        onDragEnd,
        onDrop: onDropSection,
        regionLabels,
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
    case 'sarif':
      return (
        <>
          <div
            className="template-mini__sidebar"
            style={{ inset: '0 auto 0 0', left: 0, right: 'auto' }}
          />
          <div className="template-mini__content" style={{ marginLeft: '35%' }}>
            <div className="template-mini__header" />
            <MiniLineStack />
          </div>
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
    case 'meridian':
      return (
        <div style={{ display: 'flex', flex: 1, flexDirection: 'column', gap: '6px' }}>
          <div className="template-mini__header" style={{ width: '58%' }} />
          <div className="template-mini__divider" />
          <div className="template-mini__divider" />
          <div style={{ display: 'grid', gridTemplateColumns: '0.62fr 1.7fr', gap: '8px', flex: 1 }}>
            <MiniDotColumn />
            <MiniLineStack />
          </div>
        </div>
      );
    case 'vertex':
      return (
        <div style={{ display: 'flex', flex: 1, flexDirection: 'column', gap: '8px' }}>
          <div className="template-mini__banner" style={{ height: '30px' }} />
          <MiniLineStack compact />
          <div className="template-mini__divider" />
          <MiniColumns left={<MiniCardColumn dense />} right={<MiniCardColumn dense />} />
        </div>
      );
    case 'harbor':
      return (
        <>
          <div className="template-mini__sidebar" />
          <div className="template-mini__content has-sidebar">
            <div className="template-mini__header" style={{ width: '70%' }} />
            <div className="template-mini__line template-mini__line--sm" />
            <MiniLineStack />
          </div>
        </>
      );
    case 'beacon':
      return (
        <div style={{ display: 'flex', flex: 1, flexDirection: 'column', gap: '7px' }}>
          <div className="template-mini__header" style={{ width: '52%' }} />
          <div className="template-mini__line template-mini__line--md" />
          <div className="template-mini__divider" />
          <MiniLineStack />
          <MiniLineStack compact />
        </div>
      );
    case 'quartz':
      return (
        <div style={{ display: 'flex', flex: 1, flexDirection: 'column', gap: '7px' }}>
          <div className="template-mini__cell" style={{ height: '26px' }} />
          <div style={{ display: 'grid', gridTemplateColumns: '1.55fr 0.85fr', gap: '6px', flex: 1 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <MiniCardColumn />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <MiniCardColumn dense />
            </div>
          </div>
        </div>
      );
    case 'windows':
      return (
        <div style={{ display: 'flex', flex: 1, flexDirection: 'column', gap: '4px' }}>
          <div style={{ height: '7px', borderRadius: '3px 3px 0 0', background: 'linear-gradient(180deg, #3f8ff5, #0058e6)' }} />
          <div style={{ display: 'grid', gridTemplateColumns: '0.42fr 1fr', gap: '4px', flex: 1 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '3px', borderRadius: '3px', background: 'linear-gradient(180deg, #d3e5fa, #c3d9f4)' }}>
              <div style={{ height: '16px', borderRadius: '2px', background: 'linear-gradient(180deg, #ffffff, #dae9fb)' }} />
              <div style={{ height: '16px', borderRadius: '2px', background: 'linear-gradient(180deg, #ffffff, #dae9fb)' }} />
            </div>
            <MiniLineStack />
          </div>
          <div style={{ height: '6px', borderRadius: '0 0 3px 3px', background: 'linear-gradient(180deg, #4993ec, #1941a5)' }} />
        </div>
      );
    case 'retro95':
      return (
        <div style={{ display: 'flex', flex: 1, flexDirection: 'column', gap: '3px', padding: '3px', background: '#008080' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', flex: 1, padding: '3px', background: '#c0c0c0', boxShadow: 'inset -1px -1px 0 #000, inset 1px 1px 0 #fff' }}>
            <div style={{ height: '7px', background: 'linear-gradient(90deg, #000080, #1084d0)' }} />
            <div style={{ display: 'grid', gridTemplateColumns: '0.5fr 1fr', gap: '3px', flex: 1 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                <div style={{ height: '15px', background: '#c0c0c0', boxShadow: 'inset -1px -1px 0 #808080, inset 1px 1px 0 #fff' }} />
                <div style={{ height: '15px', background: '#c0c0c0', boxShadow: 'inset -1px -1px 0 #808080, inset 1px 1px 0 #fff' }} />
              </div>
              <div style={{ background: '#ffffff', boxShadow: 'inset 1px 1px 0 #808080' }} />
            </div>
          </div>
        </div>
      );
    case 'cobalt':
      return (
        <div style={{ display: 'flex', flex: 1, flexDirection: 'column', gap: '7px' }}>
          <div className="template-mini__banner" style={{ height: '30px' }} />
          <div style={{ display: 'grid', gridTemplateColumns: '0.78fr 1.72fr', gap: '7px', flex: 1 }}>
            <MiniDotColumn />
            <MiniLineStack />
          </div>
        </div>
      );
    case 'linen':
      return (
        <>
          <div className="template-mini__sidebar" style={{ background: '#efeae1' }} />
          <div className="template-mini__content has-sidebar">
            <div className="template-mini__banner" style={{ height: '18px', background: 'linear-gradient(135deg, #3f3d3a, #575350)' }} />
            <MiniLineStack />
          </div>
        </>
      );
    case 'praxis':
      return (
        <div style={{ display: 'flex', flex: 1, flexDirection: 'column', gap: '7px' }}>
          <div className="template-mini__banner--thin" style={{ width: '100%', height: '5px' }} />
          <div className="template-mini__header" style={{ width: '54%' }} />
          <div className="template-mini__divider" />
          <MiniColumns left={<MiniLineStack />} right={<MiniCardColumn dense />} />
        </div>
      );
    case 'portrait':
      return (
        <div style={{ display: 'flex', flex: 1, flexDirection: 'column', gap: '7px', alignItems: 'center' }}>
          <MiniAvatar />
          <div className="template-mini__header" style={{ width: '58%' }} />
          <div className="template-mini__line template-mini__line--sm" />
          <MiniColumns left={<MiniLineStack />} right={<MiniDotColumn />} />
        </div>
      );
    case 'insignia':
      return (
        <>
          <div className="template-mini__sidebar" />
          <div className="template-mini__content has-sidebar">
            <div className="template-mini__header" style={{ width: '72%' }} />
            <MiniLineStack />
          </div>
        </>
      );
    case 'bulletin':
      return (
        <div style={{ display: 'flex', flex: 1, flexDirection: 'column', gap: '7px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '6px', borderRadius: '4px', background: 'linear-gradient(120deg, #2b3038, #41474f)' }}>
            <span style={{ width: '22px', height: '22px', borderRadius: '3px', background: 'var(--thumb-accent)' }} />
            <span style={{ flex: 1, height: '8px', borderRadius: '999px', background: 'rgba(255,255,255,0.5)' }} />
          </div>
          <MiniColumns left={<MiniLineStack />} right={<MiniCardColumn dense />} />
        </div>
      );
    case 'verso':
      return (
        <div style={{ display: 'flex', flex: 1, flexDirection: 'column', gap: '7px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '7px' }}>
            <div className="template-mini__header" style={{ width: '52%' }} />
            <MiniAvatar size={26} />
          </div>
          <div className="template-mini__line template-mini__line--md" />
          <MiniColumns left={<MiniLineStack />} right={<MiniDotColumn />} />
        </div>
      );
    case 'granite':
      return (
        <div style={{ display: 'flex', flex: 1, gap: '8px' }}>
          <span style={{ width: '6px', borderRadius: '3px', background: 'linear-gradient(180deg, var(--thumb-accent), var(--thumb-accent-alt))' }} />
          <div style={{ display: 'flex', flex: 1, flexDirection: 'column', gap: '7px' }}>
            <div className="template-mini__header" style={{ width: '58%' }} />
            <MiniLineStack />
            <div className="template-mini__divider" />
            <MiniLineStack compact />
          </div>
        </div>
      );
    case 'palladio':
      return (
        <div style={{ display: 'flex', flex: 1, flexDirection: 'column', gap: '7px', alignItems: 'center' }}>
          <div className="template-mini__header" style={{ width: '64%' }} />
          <div className="template-mini__divider" />
          <div className="template-mini__divider" />
          <MiniLineStack />
          <MiniColumns left={<MiniLineStack compact />} right={<MiniLineStack compact />} />
        </div>
      );
    case 'signal':
      return (
        <div style={{ display: 'flex', flex: 1, flexDirection: 'column', gap: '7px' }}>
          <div className="template-mini__banner" style={{ height: '24px' }} />
          <MiniColumns left={<MiniCardColumn />} right={<MiniCardColumn dense />} />
        </div>
      );
    case 'corvus':
      return (
        <div style={{ display: 'grid', gridTemplateColumns: '0.62fr 1.6fr', gap: '6px', flex: 1, padding: '5px', borderRadius: '4px', background: '#16181d' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', padding: '5px', borderRadius: '3px', background: '#1e2128' }}>
            <span style={{ width: '22px', height: '22px', borderRadius: '3px', background: '#3a3f49' }} />
            <span style={{ height: '5px', borderRadius: '999px', background: '#e2b658' }} />
            <span style={{ height: '5px', borderRadius: '999px', background: '#3a3f49' }} />
            <span style={{ height: '5px', borderRadius: '999px', background: '#3a3f49' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: '4px 2px' }}>
            <span style={{ width: '70%', height: '8px', borderRadius: '999px', background: '#4a505c' }} />
            <span style={{ width: '34%', height: '3px', background: '#e2b658' }} />
            <span style={{ height: '5px', borderRadius: '999px', background: '#31363f' }} />
            <span style={{ height: '5px', borderRadius: '999px', background: '#31363f' }} />
            <span style={{ width: '76%', height: '5px', borderRadius: '999px', background: '#31363f' }} />
          </div>
        </div>
      );
    case 'vellum':
      return (
        <div style={{ display: 'flex', flex: 1, flexDirection: 'column', gap: '0' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.08fr 0.92fr', gap: '6px', padding: '6px', background: '#f1f1f1' }}>
            <span style={{ height: '9px', borderRadius: '999px', background: '#c9c9c9' }} />
            <span style={{ height: '9px', borderRadius: '999px', background: '#d8d8d8' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1.08fr 0.92fr', flex: 1 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', padding: '6px 6px 0 0', borderRight: '1px solid #cfcfcf' }}>
              <span style={{ height: '1px', background: '#cfcfcf' }} />
              <span style={{ width: '60%', height: '5px', borderRadius: '999px', background: '#bdbdbd' }} />
              <span style={{ height: '1px', background: '#cfcfcf' }} />
              <span style={{ height: '4px', borderRadius: '999px', background: '#dcdcdc' }} />
              <span style={{ height: '4px', borderRadius: '999px', background: '#dcdcdc' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', padding: '6px 0 0 6px' }}>
              <span style={{ height: '1px', background: '#cfcfcf' }} />
              <span style={{ width: '58%', height: '5px', borderRadius: '999px', background: '#bdbdbd' }} />
              <span style={{ height: '1px', background: '#cfcfcf' }} />
              <span style={{ height: '4px', borderRadius: '999px', background: '#dcdcdc' }} />
            </div>
          </div>
        </div>
      );
    case 'toon':
      return (
        <div style={{ display: 'flex', flex: 1, flexDirection: 'column', gap: '5px', padding: '4px', borderRadius: '5px', background: '#d8f0f6' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '20px', height: '20px', borderRadius: '5px', border: '2px solid #2b2440', background: '#ffe08a' }} />
            <span style={{ flex: 1, height: '9px', borderRadius: '999px', background: '#2b2440' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '0.8fr 1.5fr', gap: '5px', flex: 1 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <ToonChip color="#c8f0d8" />
              <ToonChip color="#d7d2f7" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <ToonChip color="#f7c9e0" />
              <ToonChip color="#ffe08a" />
            </div>
          </div>
        </div>
      );
    case 'hexon':
      return (
        <>
          <div className="template-mini__sidebar" style={{ background: 'linear-gradient(180deg, #152238, #0e1728)' }} />
          <div className="template-mini__content has-sidebar">
            <div className="template-mini__header" style={{ width: '66%' }} />
            <MiniLineStack />
          </div>
        </>
      );
    case 'lagoon':
      return (
        <>
          <div className="template-mini__sidebar" style={{ background: '#2f6b6f' }} />
          <div className="template-mini__content has-sidebar">
            <div className="template-mini__header" style={{ width: '74%' }} />
            <MiniLineStack />
          </div>
        </>
      );
    case 'scribe':
      return (
        <div style={{ display: 'flex', flex: 1, flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
            <span style={{ width: '48%', height: '10px', borderRadius: '999px', background: '#2a2a2a' }} />
            <span style={{ display: 'flex', flexDirection: 'column', gap: '3px', width: '32%' }}>
              <span style={{ height: '3px', borderRadius: '999px', background: '#cfcfcf' }} />
              <span style={{ height: '3px', borderRadius: '999px', background: '#cfcfcf' }} />
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '0.68fr 1.62fr', gap: '10px', flex: 1 }}>
            <MiniLineStack compact />
            <MiniLineStack />
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

function ToonChip({ color }: { color: string }) {
  return <span style={{ flex: 1, borderRadius: '5px', border: '2px solid #2b2440', background: color }} />;
}

function MiniAvatar({ size = 30 }: { size?: number }) {
  return (
    <span
      style={{
        display: 'inline-block',
        width: `${size}px`,
        height: `${size}px`,
        flexShrink: 0,
        borderRadius: '50%',
        background: 'linear-gradient(160deg, var(--thumb-accent), var(--thumb-accent-alt))',
      }}
    />
  );
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
