// src/components/templates/Zenith.tsx
import { type CSSProperties } from 'react';
import { t } from '../../i18n';
import { useCVStore } from '../../store/cvStore';
import type { CVData } from '../../types/cv';
import { TEMPLATE_THEMES } from './templateCatalog';
import { ensureTemplateLayout, getSectionsForRegion } from './templateLayout';
import { getContactItems } from './templateUtils';
import { HeaderBlock, SectionColumn, SectionPanels, type TemplateLayoutEditor } from './templateComponents';

interface Props {
  data: CVData;
  layoutEditor?: TemplateLayoutEditor;
}

export default function Zenith({ data, layoutEditor }: Props) {
  const language = useCVStore((state) => state.language);
  const theme = TEMPLATE_THEMES['zenith'];
  const { personalInfo, sections } = data;
  const layoutState = ensureTemplateLayout('zenith', data.layoutOverride, sections);
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

  const leadSections = getSectionsForRegion(sections, layoutState, 'lead');
  const supportSections = getSectionsForRegion(sections, layoutState, 'support');

  return (
    <div style={baseStyle}>
      <header style={{ position: 'relative', overflow: 'hidden', padding: '38px 42px 32px', background: theme.headerBg, color: theme.headerText }}>
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '650px' }}>
          <div style={{ marginBottom: '12px', color: theme.accentAlt, fontSize: '9px', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase' }}>Zenith / Career Trajectory</div>
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
            titleSize="36px"
            hideDivider
          />
        </div>
        <span style={{ position: 'absolute', right: '38px', top: '38px', width: '112px', height: '112px', border: `1px solid ${theme.accentAlt}`, borderRadius: '50%', opacity: 0.48 }} />
        <span style={{ position: 'absolute', right: '66px', top: '66px', width: '56px', height: '56px', border: `1px solid ${theme.accentAlt}`, borderRadius: '50%', opacity: 0.5 }} />
      </header>
      {summary && (
        <div style={{ display: 'grid', gridTemplateColumns: '44px minmax(0, 1fr)', gap: '10px', alignItems: 'start', margin: '24px 42px 0', paddingBottom: '20px', borderBottom: `1px solid ${theme.line}` }}>
          <span style={{ color: theme.accentAlt, fontSize: '34px', lineHeight: 1, fontFamily: 'Georgia, serif' }}>“</span>
          <div style={{ maxWidth: '640px', paddingTop: '5px', color: theme.muted, lineHeight: 1.75 }}>{summary}</div>
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.36fr) 232px', gap: '28px', padding: '30px 42px 40px' }}>
        <main style={{ paddingLeft: '18px', borderLeft: `2px solid ${theme.line}` }}>
          <SectionColumn sections={leadSections} theme={theme} regionKey="lead" layoutEditor={layoutEditor} gap="28px" />
        </main>
        <aside style={{ padding: '18px 17px', borderTop: `4px solid ${theme.accentAlt}`, background: theme.accentSoft }}>
          <SectionPanels
            sections={supportSections}
            theme={theme}
            regionKey="support"
            layoutEditor={layoutEditor}
            shellStyle={{ padding: 0, borderRadius: 0, background: 'transparent', border: 'none' }}
          />
        </aside>
      </div>
    </div>
  );
}
