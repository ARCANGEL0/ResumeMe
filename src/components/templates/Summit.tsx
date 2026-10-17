// src/components/templates/Summit.tsx
import { type CSSProperties } from 'react';
import { t } from '../../i18n';
import { useCVStore } from '../../store/cvStore';
import type { CVData } from '../../types/cv';
import { TEMPLATE_THEMES } from './templateCatalog';
import { ensureTemplateLayout, getSectionsForRegion } from './templateLayout';
import { getContactItems } from './templateUtils';
import {
  HeaderBlock,
  SectionColumn,
  SectionPanels,
  type TemplateLayoutEditor,
} from './templateComponents';

interface Props {
  data: CVData;
  layoutEditor?: TemplateLayoutEditor;
}

export default function Summit({ data, layoutEditor }: Props) {
  const language = useCVStore((state) => state.language);
  const theme = TEMPLATE_THEMES['summit'];
  const { personalInfo, sections } = data;
  const layoutState = ensureTemplateLayout('summit', data.layoutOverride, sections);
  const displayName = personalInfo.fullName || t(language, 'fullName');
  const contactItems = getContactItems(personalInfo, language);
  const summary = personalInfo.summary.trim();
  const baseStyle: CSSProperties = {
    fontFamily: theme.fontFamily,
    fontSize: '11.2px',
    lineHeight: '1.65',
    color: theme.text,
    background: theme.page,
    minHeight: '297mm',
  };

  const sideSections = getSectionsForRegion(sections, layoutState, 'side');
  const mainSections = getSectionsForRegion(sections, layoutState, 'main');
  const hasSideRegion = sideSections.length > 0 || Boolean(layoutEditor);

  return (
    <div style={baseStyle}>
      <header style={{ position: 'relative', overflow: 'hidden', padding: '34px 38px 36px', color: '#ffffff', background: theme.accentDark }}>
        <div style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: summary ? 'minmax(0, 1.12fr) minmax(205px, 0.88fr)' : '1fr', gap: '30px', alignItems: 'center' }}>
          <div>
            <div style={{ marginBottom: '11px', color: theme.accentAlt, fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' }}>Summit / Career Overview</div>
            <HeaderBlock
              photo={personalInfo.photo}
              photoPlacement="left"
              photoSize={82}
              displayName={displayName}
              summary=""
              contactItems={contactItems}
              theme={theme}
              language={language}
              onDark
              contactStyle="inline"
              titleSize="32px"
              hideDivider
            />
          </div>
          {summary && <div style={{ padding: '8px 0 8px 20px', borderLeft: `2px solid ${theme.accentAlt}`, color: 'rgba(255,255,255,0.78)', lineHeight: 1.72 }}>{summary}</div>}
        </div>
        <svg viewBox="0 0 420 100" preserveAspectRatio="none" aria-hidden="true" style={{ position: 'absolute', right: 0, bottom: 0, width: '52%', height: '95px', opacity: 0.2 }}>
          <path d="M0 100 106 28l54 36 89-58 66 61 45-29 60 40v22z" fill={theme.accentAlt} />
          <path d="m105 29 25 17-25-5-24 14zM249 7l33 30-33-12-22 17z" fill="#ffffff" />
        </svg>
      </header>
      <div style={{ display: 'grid', gridTemplateColumns: hasSideRegion ? 'minmax(0, 1.38fr) minmax(220px, 0.82fr)' : '1fr', gap: '28px', padding: '30px 38px 38px' }}>
        <main style={{ paddingRight: '8px' }}>
          <SectionColumn sections={mainSections} theme={theme} regionKey="main" layoutEditor={layoutEditor} gap="28px" />
        </main>
        {hasSideRegion && (
          <aside style={{ padding: '20px 18px', borderTop: `4px solid ${theme.accent}`, background: theme.accentSoft }}>
            <SectionPanels
              sections={sideSections}
              theme={theme}
              regionKey="side"
              layoutEditor={layoutEditor}
              shellStyle={{ padding: 0, borderRadius: 0, background: 'transparent', border: 'none' }}
            />
          </aside>
        )}
      </div>
    </div>
  );
}
