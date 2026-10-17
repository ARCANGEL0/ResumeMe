// src/components/templates/Atlas.tsx
import { type CSSProperties } from 'react';
import { t } from '../../i18n';
import { useCVStore } from '../../store/cvStore';
import type { CVData } from '../../types/cv';
import { TEMPLATE_THEMES } from './templateCatalog';
import { ensureTemplateLayout, getSectionsForRegion } from './templateLayout';
import { getContactItems } from './templateUtils';
import {
  ContactPanel,
  PhotoFrame,
  SectionColumn,
  SectionPanels,
  SummaryBlock,
  type TemplateLayoutEditor,
} from './templateComponents';

interface Props {
  data: CVData;
  layoutEditor?: TemplateLayoutEditor;
}

export default function Atlas({ data, layoutEditor }: Props) {
  const language = useCVStore((state) => state.language);
  const theme = TEMPLATE_THEMES['atlas'];
  const { personalInfo, sections } = data;
  const layoutState = ensureTemplateLayout('atlas', data.layoutOverride, sections);
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
      <header style={{ padding: '34px 38px 24px', background: '#f3f7f4', borderBottom: `1px solid ${theme.line}` }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.1fr) minmax(200px, 0.9fr)', gap: '25px', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', minWidth: 0 }}>
            {personalInfo.photo && <PhotoFrame photo={personalInfo.photo} size={86} radius="4px" border={`2px solid ${theme.accent}`} />}
            <div style={{ minWidth: 0 }}>
              <div style={{ marginBottom: '10px', color: theme.accent, fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' }}>Atlas / Professional Record</div>
              <h1 style={{ margin: 0, color: theme.accentDark, fontSize: '36px', fontWeight: 750, lineHeight: 1.02, letterSpacing: '-0.04em', overflowWrap: 'anywhere' }}>{displayName}</h1>
            </div>
          </div>
          <div style={{ paddingLeft: '20px', borderLeft: `1px solid ${theme.line}` }}>
            <ContactPanel contactItems={contactItems} theme={theme} contactStyle="stack" />
          </div>
        </div>
        {summary && <div style={{ marginTop: '23px', padding: '13px 17px', borderLeft: `3px solid ${theme.accentAlt}`, background: '#ffffff', color: theme.muted }}><SummaryBlock summary={summary} theme={theme} /></div>}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '4px', marginTop: '20px' }}>
          {Array.from({ length: 12 }).map((_, index) => <span key={index} style={{ height: '3px', background: index % 3 === 0 ? theme.accent : theme.line }} />)}
        </div>
      </header>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.45fr) 235px', gap: '28px', padding: '30px 38px 38px' }}>
        <main style={{ paddingLeft: '20px', borderLeft: `2px solid ${theme.line}` }}>
          <SectionColumn sections={leftSections} theme={theme} regionKey="left" layoutEditor={layoutEditor} gap="27px" />
        </main>
        <aside style={{ padding: '18px 17px', background: theme.accentSoft, borderTop: `4px solid ${theme.accent}` }}>
          <SectionPanels
            sections={rightSections}
            theme={theme}
            regionKey="right"
            layoutEditor={layoutEditor}
            shellStyle={{ padding: 0, background: 'transparent', border: 'none' }}
          />
        </aside>
      </div>
    </div>
  );
}
