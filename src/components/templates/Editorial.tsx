// src/components/templates/Editorial.tsx
import { type CSSProperties } from 'react';
import { t } from '../../i18n';
import { useCVStore } from '../../store/cvStore';
import type { CVData } from '../../types/cv';
import { TEMPLATE_THEMES } from './templateCatalog';
import { ensureTemplateLayout, getSectionsForRegion } from './templateLayout';
import { getContactItems } from './templateUtils';
import { ContactPanel, SectionColumn, SummaryBlock, type TemplateLayoutEditor } from './templateComponents';

interface Props {
  data: CVData;
  layoutEditor?: TemplateLayoutEditor;
}

export default function Editorial({ data, layoutEditor }: Props) {
  const language = useCVStore((state) => state.language);
  const theme = TEMPLATE_THEMES['editorial'];
  const { personalInfo, sections } = data;
  const layoutState = ensureTemplateLayout('editorial', data.layoutOverride, sections);
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
  const middleSections = getSectionsForRegion(sections, layoutState, 'middle');
  const rightSections = getSectionsForRegion(sections, layoutState, 'right');

  return (
    <div style={baseStyle}>
      <div style={{ padding: '28px 34px 30px' }}>
        <div style={{ textAlign: 'center', paddingBottom: '18px', borderBottom: `1px solid ${theme.line}` }}>
          <h1 style={{ margin: 0, fontSize: '31px', letterSpacing: '0.08em', textTransform: 'uppercase', color: theme.text }}>{displayName}</h1>
          {leadRole && <div style={{ marginTop: '8px', color: theme.accent }}>{leadRole}</div>}
          <div style={{ marginTop: '14px', display: 'flex', justifyContent: 'center' }}>
            <ContactPanel contactItems={contactItems} theme={theme} contactStyle="inline" align="center" />
          </div>
        </div>
        {summary && (
          <div style={{ margin: '20px auto 24px', maxWidth: '82%' }}>
            <SummaryBlock summary={summary} theme={theme} />
          </div>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: '0.88fr 1.2fr 0.88fr', gap: '24px' }}>
          <div style={{ paddingRight: '20px', borderRight: `1px solid ${theme.line}` }}>
            <SectionColumn sections={leftSections} theme={theme} regionKey="left" layoutEditor={layoutEditor} />
          </div>
          <div>
            <SectionColumn sections={middleSections} theme={theme} regionKey="middle" layoutEditor={layoutEditor} />
          </div>
          <div style={{ paddingLeft: '20px', borderLeft: `1px solid ${theme.line}` }}>
            <SectionColumn sections={rightSections} theme={theme} regionKey="right" layoutEditor={layoutEditor} />
          </div>
        </div>
      </div>
    </div>
  );
}
