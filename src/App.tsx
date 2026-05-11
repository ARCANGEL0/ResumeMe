import { useState, useCallback } from 'react';
import LandingPage from './components/landing/LandingPage';
import EditorPanel from './components/editor/EditorPanel';
import PreviewPanel from './components/preview/PreviewPanel';
import TemplateSelector from './components/templates/TemplateSelector';
import LanguageSelector from './ui/LanguageSelector';
import { t } from './i18n';
import { useCVStore } from './store/cvStore';
import { ARCANGELO_URL } from './config';

export default function App() {
  const { currentView, language, setView } = useCVStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  const editorShellStyle = { position: 'relative' as const };
  const editorSidebarPaddingStyle = { height: '100%', boxSizing: 'border-box' as const, overflow: 'hidden' };

  if (currentView === 'landing') {
    return (
      <div className="app-screen overflow-hidden">
        <LandingPage />
      </div>
    );
  }

  if (currentView === 'templates') {
    return (
      <div className="app-screen overflow-hidden">
        <TemplateSelector />
      </div>
    );
  }

  return (
    <div className="editor-shell" style={editorShellStyle}>
      {/* hamburger - only on mobile */}
      <button
        type="button"
        onClick={toggleSidebar}
        className="mobile-sidebar-toggle no-print"
        aria-label="Toggle editor"
      >
        {sidebarOpen ? '✕' : '☰'}
      </button>

      <header className="topbar no-print">
        <div className="topbar__brand">
          <ResumeMark className="topbar__icon" />
          <div>
            <div className="topbar__title">Resume.Me</div>
            <div className="topbar__subtitle topbar__subtitle--brand">
              <a
                href={ARCANGELO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="brand-link"
              >
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

      <div className="editor-workspace">
        <div
          className={`editor-sidebar mobile-sidebar ${sidebarOpen ? 'is-open' : ''}`}
        >
          <div style={editorSidebarPaddingStyle}>
            <EditorPanel />
          </div>
        </div>

        {sidebarOpen && (
          <div
            className="sidebar-backdrop no-print"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <div className="preview-panel">
          <PreviewPanel />
        </div>
      </div>

      <button
        type="button"
        onClick={() => setView('templates')}
        className="primary-action primary-action--nav editor-next-fab no-print"
      >
        {t(language, 'next')}
      </button>
    </div>
  );
}

function ResumeMark({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
    >
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
