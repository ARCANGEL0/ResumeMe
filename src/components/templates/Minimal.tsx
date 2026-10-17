// src/components/templates/Minimal.tsx
import { type CSSProperties } from 'react';
import { t } from '../../i18n';
import { useCVStore } from '../../store/cvStore';
import type { CVData } from '../../types/cv';
import { TEMPLATE_THEMES } from './templateCatalog';
import { ensureTemplateLayout, getSectionsForRegion } from './templateLayout';
import { getContactItems } from './templateUtils';
import { ContactPanel, PhotoFrame, SectionColumn, type TemplateLayoutEditor } from './templateComponents';

interface Props {
  data: CVData;
  layoutEditor?: TemplateLayoutEditor;
}

export default function Minimal({ data, layoutEditor }: Props) {
  const language = useCVStore((state) => state.language);
  const theme = TEMPLATE_THEMES['minimal'];
  const { personalInfo, sections } = data;
  const layoutState = ensureTemplateLayout('minimal', data.layoutOverride, sections);
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
    <div style={{ ...baseStyle, padding: '46px 50px 44px' }}>
      <header style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 190px', gap: '28px', paddingBottom: '22px', borderBottom: `1px solid ${theme.line}` }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ marginBottom: '15px', color: theme.accent, fontSize: '9px', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase' }}>Resume / Professional Profile</div>
          <h1 style={{ margin: 0, color: theme.text, fontSize: '37px', lineHeight: 1.02, fontWeight: 500, letterSpacing: '-0.055em', overflowWrap: 'anywhere' }}>{displayName}</h1>
          <span style={{ display: 'block', width: '38px', height: '2px', marginTop: '17px', background: theme.accent }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', paddingTop: '25px' }}>
          {personalInfo.photo && <PhotoFrame photo={personalInfo.photo} size={50} radius="2px" />}
          <ContactPanel contactItems={contactItems} theme={theme} contactStyle="stack" />
        </div>
      </header>
      {summary && (
        <div style={{ maxWidth: '570px', margin: '24px 0 30px', color: theme.muted, fontSize: '12px', lineHeight: '1.75' }}>
          {summary}
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 195px', gap: '35px', marginTop: summary ? 0 : '30px' }}>
        <main>
          <SectionColumn sections={mainSections} theme={theme} regionKey="main" layoutEditor={layoutEditor} gap="28px" />
        </main>
        <aside style={{ paddingLeft: '19px', borderLeft: `1px solid ${theme.line}` }}>
          <SectionColumn sections={sidebarSections} theme={theme} regionKey="sidebar" layoutEditor={layoutEditor} gap="24px" />
        </aside>
      </div>
    </div>
  );
}
