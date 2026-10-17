// src/components/templates/Executive.tsx
import { type CSSProperties } from 'react';
import { t } from '../../i18n';
import { useCVStore } from '../../store/cvStore';
import type { CVData } from '../../types/cv';
import { TEMPLATE_THEMES } from './templateCatalog';
import { ensureTemplateLayout, getSectionsForRegion } from './templateLayout';
import { getContactItems } from './templateUtils';
import { HeaderBlock, SectionColumn, SectionPanels, SummaryBlock, type TemplateLayoutEditor } from './templateComponents';

interface Props {
  data: CVData;
  layoutEditor?: TemplateLayoutEditor;
}

export default function Executive({ data, layoutEditor }: Props) {
  const language = useCVStore((state) => state.language);
  const theme = TEMPLATE_THEMES['executive'];
  const { personalInfo, sections } = data;
  const layoutState = ensureTemplateLayout('executive', data.layoutOverride, sections);
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

  const leftSections = getSectionsForRegion(sections, layoutState, 'left');
  const rightSections = getSectionsForRegion(sections, layoutState, 'right');

  return (
    <div style={baseStyle}>
      <header style={{ padding: '36px 42px 26px', background: theme.headerBg, color: theme.headerText, borderBottom: `5px solid ${theme.accent}` }}>
        <div style={{ marginBottom: '12px', color: theme.accent, fontSize: '9px', fontWeight: 700, letterSpacing: '0.24em', textTransform: 'uppercase' }}>Leadership Profile</div>
        <HeaderBlock
          photo={personalInfo.photo}
          photoPlacement="left"
          photoSize={86}
          photoRadius="4px"
          displayName={displayName}
          summary=""
          contactItems={contactItems}
          theme={theme}
          language={language}
          onDark
          contactStyle="inline"
          titleSize="34px"
          hideDivider
        />
      </header>
      {summary && (
        <div style={{ display: 'grid', gridTemplateColumns: '120px minmax(0, 1fr)', gap: '20px', padding: '20px 42px', background: theme.accentSoft, borderBottom: `1px solid ${theme.line}` }}>
          <div style={{ color: theme.accentDark, fontSize: '9px', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase' }}>{t(language, 'profile')}</div>
          <div style={{ color: theme.muted, lineHeight: 1.7 }}><SummaryBlock summary={summary} theme={theme} /></div>
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.48fr) 238px', gap: '26px', padding: '30px 42px 38px' }}>
        <main style={{ paddingRight: '14px' }}>
          <SectionColumn sections={leftSections} theme={theme} regionKey="left" layoutEditor={layoutEditor} gap="28px" />
        </main>
        <aside style={{ padding: '18px 18px 20px', borderTop: `3px solid ${theme.accent}`, borderBottom: `1px solid ${theme.line}`, background: '#fbf8f2' }}>
          <SectionPanels
            sections={rightSections}
            theme={theme}
            regionKey="right"
            layoutEditor={layoutEditor}
            shellStyle={{ padding: 0, borderRadius: 0, background: 'transparent', border: 'none' }}
          />
        </aside>
      </div>
    </div>
  );
}
