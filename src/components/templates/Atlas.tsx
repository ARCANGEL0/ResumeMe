// src/components/templates/Atlas.tsx
import { type CSSProperties } from 'react';
import { t } from '../../i18n';
import { useCVStore } from '../../store/cvStore';
import type { CVData } from '../../types/cv';
import { TEMPLATE_THEMES } from './templateCatalog';
import { ensureTemplateLayout, getSectionsForRegion } from './templateLayout';
import { getContactItems } from './templateUtils';
import { ContactPanel, SectionColumn, SectionPanels, SummaryBlock, type TemplateLayoutEditor } from './templateComponents';

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
  const contactItems = getContactItems(personalInfo);
  const summary = personalInfo.summary.trim();
  const leadRole = '';

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
      <div style={{ padding: '28px 30px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.24fr) 218px', gap: '22px', marginBottom: '22px' }}>
          <div style={{ padding: '22px 24px 20px', background: '#ffffff', borderLeft: `8px solid ${theme.accent}` }}>
            <h1 style={{ margin: 0, fontSize: '31px', lineHeight: 1.08, color: theme.accentDark, fontWeight: 800 }}>{displayName}</h1>
            {leadRole && <div style={{ marginTop: '8px', color: theme.muted }}>{leadRole}</div>}
            <div style={{ marginTop: '16px' }}>
              <ContactPanel contactItems={contactItems} theme={theme} contactStyle="inline" />
            </div>
          </div>
          <div style={{ padding: '18px 18px 16px', background: `linear-gradient(180deg, ${theme.accentSoft}, #ffffff)`, border: `1px solid ${theme.line}` }}>
            {summary && <div style={{ marginTop: '16px' }}><SummaryBlock summary={summary} theme={theme} /></div>}
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.3fr) 218px', gap: '22px' }}>
          <SectionColumn sections={leftSections} theme={theme} regionKey="left" layoutEditor={layoutEditor} />
          <SectionPanels
            sections={rightSections}
            theme={theme}
            regionKey="right"
            layoutEditor={layoutEditor}
            shellStyle={{ padding: '16px 16px 14px', background: '#ffffff', border: `1px solid ${theme.line}` }}
          />
        </div>
      </div>
    </div>
  );
}
