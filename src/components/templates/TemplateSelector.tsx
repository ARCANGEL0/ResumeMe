import LanguageSelector from '../../ui/LanguageSelector';
import ResumeMark from '../../ui/ResumeMark';

import { getTemplateName, t } from '../../i18n';
import { useCallback, useEffect, useState } from 'react';
import { useCVStore } from '../../store/cvStore';
import { TEMPLATES, type TemplateLayoutState } from '../../types/cv';
import { exportToPDF } from '../../utils/pdfExportMobile';
import TemplateDocument from './TemplateDocument';
import { createDefaultTemplateLayout, ensureTemplateLayout, getTemplateLayoutPreset, moveLayoutSection } from './templateLayout';
import ZoomablePreview from '../preview/ZoomablePreview';
import TemplateIcon from './TemplateIcon';

export default function TemplateSelector() {
  const { language, personalInfo, sections, selectedTemplate, setTemplate, setTemplateLayout, setView, setShowEuropassBranding, showEuropassBranding, templateLayouts } =
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
              {selectedTemplate === 'europass' && <label style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '12px', padding: '10px 12px', border: '1px solid var(--clr-border)', borderRadius: '10px', color: 'var(--clr-text)', fontSize: '12px', cursor: 'pointer' }}>
                <input type="checkbox" checked={showEuropassBranding ?? true} onChange={(event) => setShowEuropassBranding(event.target.checked)} />
                <span>Show Europass logo and title</span>
              </label>}
              <div className="template-list">
                {TEMPLATES.map((template) => {
                  const isSelected = template.id === selectedTemplate;

                  return (
                    <button
                      key={template.id}
                      type="button"
                      onClick={() => setTemplate(template.id)}
                      className={`template-list-card ${isSelected ? 'is-selected' : ''}`}
                      aria-pressed={isSelected}
                    >
                      <TemplateIcon id={template.id} />
                      <span className="template-list-card__name">{getTemplateName(language, template.id)}</span>
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
  const { personalInfo, sections, selectedTemplate, showEuropassBranding } = useCVStore();
  const cvData = { personalInfo, sections, selectedTemplate, layoutOverride, showEuropassBranding };
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

