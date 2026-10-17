import { type CSSProperties } from 'react';
import { t } from '../../i18n';
import { useCVStore } from '../../store/cvStore';
import type { CVData } from '../../types/cv';
import { TEMPLATE_THEMES } from './templateCatalog';
import { ensureTemplateLayout, getSectionsForRegion } from './templateLayout';
import { getContactItems } from './templateUtils';
import { ContactPanel, PhotoFrame, SectionPanels, SummaryBlock, type TemplateLayoutEditor } from './templateComponents';

interface Props {
  data: CVData;
  layoutEditor?: TemplateLayoutEditor;
}

export default function Signal({ data, layoutEditor }: Props) {
  const language = useCVStore((state) => state.language);
  const theme = TEMPLATE_THEMES['signal'];
  const { personalInfo, sections } = data;
  const layoutState = ensureTemplateLayout('signal', data.layoutOverride, sections);
  const displayName = personalInfo.fullName || t(language, 'fullName');
  const contactItems = getContactItems(personalInfo, language);
  const summary = personalInfo.summary.trim();
  const mainSections = getSectionsForRegion(sections, layoutState, 'main');
  const sideSections = getSectionsForRegion(sections, layoutState, 'side');
  const baseStyle: CSSProperties = {
    minHeight: '297mm',
    background: theme.page,
    color: theme.text,
    fontFamily: theme.fontFamily,
    fontSize: '11.2px',
    lineHeight: 1.62,
  };
  const panelStyle: CSSProperties = {
    padding: '17px 18px',
    borderRadius: '3px',
    border: `1px solid ${theme.line}`,
    borderTop: `3px solid ${theme.accent}`,
    background: '#ffffff',
  };

  return (
    <div style={baseStyle}>
      <div style={{ height: '11px', background: theme.accentDark }}><div style={{ width: '31%', height: '100%', background: theme.accentAlt }} /></div>
      <header style={{ padding: '34px 40px 25px', background: `linear-gradient(120deg, ${theme.accentSoft}, ${theme.page} 62%)`, borderBottom: `1px solid ${theme.line}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ width: '42px', height: '4px', marginBottom: '14px', background: theme.accentAlt }} />
            <h1 style={{ margin: 0, color: theme.accentDark, fontSize: '36px', fontWeight: 720, lineHeight: 1.04, letterSpacing: '-0.04em', overflowWrap: 'anywhere' }}>{displayName}</h1>
          </div>
          {personalInfo.photo && <PhotoFrame photo={personalInfo.photo} size={86} radius="4px" border={`3px solid ${theme.page}`} />}
        </div>
        {contactItems.length > 0 && <div style={{ marginTop: '19px', padding: '11px 14px', borderLeft: `3px solid ${theme.accent}`, background: '#ffffff' }}><ContactPanel contactItems={contactItems} theme={theme} contactStyle="inline" /></div>}
        {summary && <div style={{ display: 'grid', gridTemplateColumns: '5px minmax(0, 1fr)', gap: '14px', marginTop: '19px', maxWidth: '660px' }}>
          <div style={{ borderRadius: '4px', background: `linear-gradient(180deg, ${theme.accent}, ${theme.accentAlt})` }} />
          <div style={{ color: theme.muted, lineHeight: 1.75 }}><SummaryBlock summary={summary} theme={theme} /></div>
        </div>}
      </header>
      <main style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 0.86fr) minmax(0, 1.54fr)', alignItems: 'start', gap: '20px', padding: '25px 40px 38px' }}>
        <aside style={{ paddingTop: '3px' }}><SectionPanels sections={sideSections} theme={theme} regionKey="side" layoutEditor={layoutEditor} shellStyle={panelStyle} /></aside>
        <div><SectionPanels sections={mainSections} theme={theme} regionKey="main" layoutEditor={layoutEditor} shellStyle={panelStyle} /></div>
      </main>
    </div>
  );
}
