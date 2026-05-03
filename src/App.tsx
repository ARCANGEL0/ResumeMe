import LandingPage from "./components/landing/LandingPage";
import EditorPanel from "./components/editor/EditorPanel";
import PreviewPanel from "./components/preview/PreviewPanel";
import TemplateSelector from "./components/templates/TemplateSelector";
import LanguageSelector from "./ui/LanguageSelector";
import { t } from "./i18n";
import { useCVStore } from "./store/cvStore";
import { useState, useCallback } from "react";

export default function App() {
  const { currentView, language, setView } = useCVStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  if (currentView === "landing") {
    return (
      <div className="app-screen overflow-hidden">
        <LandingPage />
      </div>
    );
  }

  if (currentView === "templates") {
    return (
      <div className="app-screen overflow-hidden">
        <TemplateSelector />
      </div>
    );
  }

  return (
    <div className="editor-shell" style={{ position: "relative" }}>
      <button
        type="button"
        onClick={toggleSidebar}
        className="mobile-sidebar-toggle no-print"
        aria-label="Toggle editor"
        style={{
          position: "fixed",
          top:  "12px",
          left: "12px",
          zIndex: 9999,
          width: "40px",
          height: "40px",
          borderRadius: "10px",
          background: "var(--clr-surface2)",
          border: "1px solid var(--clr-border)",
          color: "var(--clr-text)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          fontSize: "18px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.3)",
        }}
      >
        {sidebarOpen ? "✕" : "☰"}
      </button>

      <header className="topbar no-print" style={{ paddingLeft: "56px" }}>
        <div className="topbar__brand">
          <ResumeMark className="topbar__icon" />
          <div>
            <div className="topbar__title">Resume.Me</div>
            <div className="topbar__subtitle topbar__subtitle--brand">
              <a href="https://arcangelo.net" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "inherit" }}>
                {t(language, "developedByArcangelo")}
              </a>
            </div>
          </div>
        </div>
      </header>

      <LanguageSelector
        className="language-fab no-print"
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          top: "auto",
          zIndex: 9998,
        }}
      />

      <div className="editor-workspace" style={{ position: "relative" }}>
        <div
          className={`editor-sidebar mobile-sidebar ${sidebarOpen ? "is-open" : ""}`}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "85%",
            maxWidth: "380px",
            height: "100vh",
            zIndex: 9990,
            transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
            transition: "transform 0.3s ease",
            background: "var(--clr-surface)",
            borderRight: "1px solid var(--clr-border)",
            overflowY: "auto",
            boxShadow: sidebarOpen ? "4px 0 24px rgba(0,0,0,0.4)" : "none",
          }}
        >
          <div style={{ paddingTop: "60px" }}>
            <EditorPanel />
          </div>
        </div>

        {sidebarOpen && (
          <div
            className="sidebar-backdrop no-print"
            onClick={() => setSidebarOpen(false)}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0,0,0,0.5)",
              zIndex: 9985,
            }}
          />
        )}

        <div className="preview-panel" style={{ flex: 1, minWidth: 0 }}>
          <PreviewPanel />
        </div>
      </div>

      <button
        type="button"
        onClick={() => setView("templates")}
        className="primary-action primary-action--nav editor-next-fab no-print"
      >
        {t(language, "next")}
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
