import { type CSSProperties } from 'react';
import { t } from '../../i18n';
import { useCVStore } from '../../store/cvStore';
import type { CVData } from '../../types/cv';
import { TEMPLATE_THEMES } from './templateCatalog';
import { ensureTemplateLayout, getSectionsForRegion } from './templateLayout';
import { getContactItems } from './templateUtils';
import { ContactPanel, PhotoFrame, SectionColumn, SummaryBlock, type TemplateLayoutEditor } from './templateComponents';

interface Props {
  data: CVData;
  layoutEditor?: TemplateLayoutEditor;
}

export default function Palladio({ data, layoutEditor }: Props) {
  const language = useCVStore((state) => state.language);
  const theme = TEMPLATE_THEMES['palladio'];
  const { personalInfo, sections } = data;
  const layoutState = ensureTemplateLayout('palladio', data.layoutOverride, sections);
  const displayName = personalInfo.fullName || t(language, 'fullName');
  const contactItems = getContactItems(personalInfo, language);
  const summary = personalInfo.summary.trim();
  const baseStyle: CSSProperties = {
    minHeight: '297mm',
    padding: '38px 50px 44px',
    background: theme.page,
    color: theme.text,
    fontFamily: theme.fontFamily,
    fontSize: '11.6px',
    lineHeight: 1.68,
  };
  const mainSections = getSectionsForRegion(sections, layoutState, 'main');
  const bottomLeftSections = getSectionsForRegion(sections, layoutState, 'bottomLeft');
  const bottomRightSections = getSectionsForRegion(sections, layoutState, 'bottomRight');
  const hasBottom = bottomLeftSections.length > 0 || bottomRightSections.length > 0 || Boolean(layoutEditor);

  return (
    <div style={baseStyle}>
      <header style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '13px', color: theme.accentAlt, fontSize: '8px', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase' }}>
          <span style={{ flex: 1, height: '1px', background: theme.line }} />
          Professional curriculum
          <span style={{ flex: 1, height: '1px', background: theme.line }} />
        </div>
        {personalInfo.photo && <div style={{ display: 'flex', justifyContent: 'center', margin: '23px auto 14px' }}><PhotoFrame photo={personalInfo.photo} size={74} radius="50%" border={`2px solid ${theme.accentAlt}`} /></div>}
        <h1 style={{ margin: '24px 0 0', color: theme.accentDark, fontFamily: "'Crimson Pro', Georgia, serif", fontSize: '40px', fontWeight: 500, lineHeight: 1.05, letterSpacing: '0.015em', overflowWrap: 'anywhere' }}>{displayName}</h1>
        <div style={{ width: '68px', height: '4px', margin: '15px auto 12px', borderTop: `1px solid ${theme.accentAlt}`, borderBottom: `1px solid ${theme.accentAlt}` }} />
        {contactItems.length > 0 && <div style={{ display: 'flex', justifyContent: 'center' }}><ContactPanel contactItems={contactItems} theme={theme} contactStyle="inline" /></div>}
        <div style={{ height: '1px', marginTop: '23px', background: `linear-gradient(90deg, transparent, ${theme.accentAlt}, transparent)` }} />
      </header>
      {summary && <div style={{ maxWidth: '620px', margin: '24px auto 29px', padding: '0 24px', color: theme.muted, fontFamily: "'Crimson Pro', Georgia, serif", fontSize: '15px', fontStyle: 'italic', lineHeight: 1.7, textAlign: 'center' }}><SummaryBlock summary={summary} theme={theme} /></div>}
      <main>
        <SectionColumn sections={mainSections} theme={theme} regionKey="main" layoutEditor={layoutEditor} gap="27px" />
        {hasBottom && <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '30px', marginTop: '31px', paddingTop: '23px', borderTop: `1px solid ${theme.line}` }}>
          <SectionColumn sections={bottomLeftSections} theme={theme} regionKey="bottomLeft" layoutEditor={layoutEditor} gap="24px" />
          <SectionColumn sections={bottomRightSections} theme={theme} regionKey="bottomRight" layoutEditor={layoutEditor} gap="24px" />
        </div>}
      </main>
      <footer style={{ marginTop: '34px', borderTop: `3px double ${theme.accentAlt}` }} />
    </div>
  );
}
