// src/components/templates/Studio.tsx
import { type CSSProperties } from 'react';
import { t } from '../../i18n';
import { useCVStore } from '../../store/cvStore';
import type { CVData } from '../../types/cv';
import { TEMPLATE_THEMES } from './templateCatalog';
import { ensureTemplateLayout, getSectionsForRegion } from './templateLayout';
import { getContactItems } from './templateUtils';
import { HeaderBlock, SectionPanels, SummaryBlock, type TemplateLayoutEditor } from './templateComponents';

interface Props {
  data: CVData;
  layoutEditor?: TemplateLayoutEditor;
}

export default function Studio({ data, layoutEditor }: Props) {
  const language = useCVStore((state) => state.language);
  const theme = TEMPLATE_THEMES['studio'];
  const { personalInfo, sections } = data;
  const layoutState = ensureTemplateLayout('studio', data.layoutOverride, sections);
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

  const mainSections = getSectionsForRegion(sections, layoutState, 'main');
  const sideSections = getSectionsForRegion(sections, layoutState, 'side');

  return (
    <div style={baseStyle}>
      <div style={{ padding: '30px 30px 32px' }}>
        <div style={{ padding: '26px 28px 24px', borderRadius: '28px', background: `linear-gradient(145deg, rgba(219,39,119,0.1), rgba(255,255,255,0.98) 45%, rgba(124,58,237,0.08))`, border: `1px solid ${theme.line}`, marginBottom: '22px' }}>
          <HeaderBlock
            displayName={displayName}
            subtitle={leadRole}
            summary=""
            contactItems={contactItems}
            theme={theme}
            language={language}
            contactStyle="pills"
            titleSize="31px"
            hideDivider
          />
          {summary && <div style={{ marginTop: '18px', maxWidth: '620px' }}><SummaryBlock summary={summary} theme={theme} /></div>}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.28fr) 230px', gap: '22px' }}>
          <SectionPanels
            sections={mainSections}
            theme={theme}
            regionKey="main"
            layoutEditor={layoutEditor}
            shellStyle={{ padding: '18px 18px 16px', borderRadius: '22px', background: '#ffffff', border: `1px solid ${theme.line}`, boxShadow: `0 16px 30px rgba(31,26,36,0.06)` }}
          />
          <SectionPanels
            sections={sideSections}
            theme={theme}
            regionKey="side"
            layoutEditor={layoutEditor}
            shellStyle={{ padding: '16px', borderRadius: '22px', background: theme.accentSoft, border: `1px solid ${theme.line}` }}
          />
        </div>
      </div>
    </div>
  );
}
