// src/components/templates/North.tsx
import { type CSSProperties } from 'react';
import { t } from '../../i18n';
import { useCVStore } from '../../store/cvStore';
import type { CVData } from '../../types/cv';
import { TEMPLATE_THEMES } from './templateCatalog';
import { ensureTemplateLayout, getSectionsForRegion } from './templateLayout';
import { getContactItems } from './templateUtils';
import {
  ContactPanel, PhotoFrame, SectionColumn, SectionPanels, type TemplateLayoutEditor,
} from './templateComponents';

interface Props {
  data: CVData;
  layoutEditor?: TemplateLayoutEditor;
}

export default function North({ data, layoutEditor }: Props) {
  const language = useCVStore((state) => state.language);
  const theme = TEMPLATE_THEMES['north'];
  const { personalInfo, sections } = data;
  const layoutState = ensureTemplateLayout('north', data.layoutOverride, sections);
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

  const sidebarSections = getSectionsForRegion(sections, layoutState, 'sidebar');
  const mainSections = getSectionsForRegion(sections, layoutState, 'main');

  return (
    <div style={baseStyle}>
      <header style={{ padding: '38px 44px 30px', borderTop: `7px solid ${theme.accent}`, background: `linear-gradient(180deg, ${theme.accentSoft} 0%, #ffffff 75%)` }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px' }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ marginBottom: '11px', color: theme.accent, fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' }}>North / Professional CV</div>
            <h1 style={{ margin: 0, color: theme.accentDark, fontSize: '38px', fontWeight: 600, lineHeight: 1.04, letterSpacing: '-0.04em', overflowWrap: 'anywhere' }}>{displayName}</h1>
          </div>
          {personalInfo.photo && <PhotoFrame photo={personalInfo.photo} size={76} radius="50%" border={`2px solid ${theme.accentAlt}`} />}
        </div>
        <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: `1px solid ${theme.line}` }}>
          <ContactPanel contactItems={contactItems} theme={theme} contactStyle="inline" />
        </div>
        {summary && <div style={{ maxWidth: '610px', marginTop: '21px', color: theme.muted, fontSize: '11.5px', lineHeight: 1.8 }}>{summary}</div>}
      </header>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.42fr) minmax(205px, 0.78fr)', gap: '34px', padding: '30px 44px 42px' }}>
        <main>
          <SectionColumn sections={mainSections} theme={theme} regionKey="main" layoutEditor={layoutEditor} gap="29px" />
        </main>
        <aside style={{ padding: '19px 17px', background: theme.accentSoft, borderTop: `2px solid ${theme.accentAlt}` }}>
          <SectionPanels
            sections={sidebarSections}
            theme={theme}
            regionKey="sidebar"
            layoutEditor={layoutEditor}
            shellStyle={{ padding: 0, background: 'transparent', border: 'none' }}
          />
        </aside>
      </div>
    </div>
  );
}
