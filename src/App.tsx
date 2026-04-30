import LandingPage from './components/landing/LandingPage';
import EditorPanel from './components/editor/EditorPanel';
import PreviewPanel from './components/preview/PreviewPanel';
import TemplateSelector from './components/templates/TemplateSelector';
import LanguageSelector from './ui/LanguageSelector';
import { t } from './i18n';
import { useCVStore } from './store/cvStore';

export default function App() {
  const { currentView, language, setView } = useCVStore();

 
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
    <div className="editor-shell">
      <header className="topbar no-print">
        <div className="topbar__brand">
          <ResumeMark className="topbar__icon" />
          <div>
            <div className="topbar__title">Resume.Me</div>
            <div className="topbar__subtitle topbar__subtitle--brand">{t(language, 'developedByArcangelo')}</div>
          </div>
        </div>
      </header>

      <LanguageSelector className="language-fab no-print" />

      <div className="editor-workspace">
        <div className="editor-sidebar">
          <EditorPanel />
        </div>
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
