// src/components/templates/Summit.tsx
import { type CSSProperties } from 'react';
import { t } from '../../i18n';
import { useCVStore } from '../../store/cvStore';
import type { CVData } from '../../types/cv';
import { TEMPLATE_THEMES } from './templateCatalog';
import { ensureTemplateLayout, getSectionsForRegion } from './templateLayout';
import { getContactItems } from './templateUtils';
import { ContactPanel, SectionEyebrow, SectionPanels, SummaryBlock, type TemplateLayoutEditor } from './templateComponents';

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

  const sideSections = getSectionsForRegion(sections, layoutState, 'side');
  const mainSections = getSectionsForRegion(sections, layoutState, 'main');
  const hasSideRegion = sideSections.length > 0 || Boolean(layoutEditor);

  return (
    <div style={baseStyle}>
      <div style={{ padding: '26px 30px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.08fr) minmax(220px, 0.92fr)', gap: '20px', marginBottom: '24px' }}>
          <div style={{ padding: '22px 24px', borderRadius: '24px', background: '#ffffff', border: `1px solid ${theme.line}` }}>
            <h1 style={{ margin: 0, fontSize: '30px', lineHeight: 1.08, color: theme.accentDark }}>{displayName}</h1>
            {leadRole && <div style={{ marginTop: '8px', color: theme.muted }}>{leadRole}</div>}
            <div style={{ marginTop: '18px' }}>
              <ContactPanel contactItems={contactItems} theme={theme} contactStyle="pills" />
            </div>
          </div>
          {summary && (
            <div style={{ padding: '20px 20px 18px', borderRadius: '24px', background: `linear-gradient(180deg, ${theme.accentSoft}, rgba(255,255,255,0.96))`, border: `1px solid ${theme.line}` }}>
              <SectionEyebrow title={t(language, 'professionalSummary')} theme={theme} />
              <SummaryBlock summary={summary} theme={theme} />
            </div>
          )}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: hasSideRegion ? 'minmax(0, 1.34fr) minmax(220px, 0.82fr)' : '1fr', gap: '22px' }}>
          <SectionPanels
            sections={mainSections}
            theme={theme}
            regionKey="main"
            layoutEditor={layoutEditor}
            shellStyle={{ padding: '18px 18px 16px', borderRadius: '20px', background: '#ffffff', border: `1px solid ${theme.line}` }}
          />
          {hasSideRegion && (
            <SectionPanels
              sections={sideSections}
              theme={theme}
              regionKey="side"
              layoutEditor={layoutEditor}
              shellStyle={{ padding: '16px 18px', borderRadius: '20px', background: theme.accentSoft, border: `1px solid ${theme.line}` }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
