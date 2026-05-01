// src/components/templates/Zenith.tsx
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

export default function Zenith({ data, layoutEditor }: Props) {
  const language = useCVStore((state) => state.language);
  const theme = TEMPLATE_THEMES['zenith'];
  const { personalInfo, sections } = data;
  const layoutState = ensureTemplateLayout('zenith', data.layoutOverride, sections);
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

  const leadSections = getSectionsForRegion(sections, layoutState, 'lead');
  const supportSections = getSectionsForRegion(sections, layoutState, 'support');

  return (
    <div style={baseStyle}>
      <div style={{ padding: '28px 34px 24px', borderBottom: `6px solid ${theme.accentAlt}` }}>
        <HeaderBlock
          displayName={displayName}
          subtitle={leadRole}
          summary=""
          contactItems={contactItems}
          theme={theme}
          language={language}
          contactStyle="inline"
          titleSize="31px"
          hideDivider
        />
        {summary && (
          <div style={{ marginTop: '18px', maxWidth: '580px', paddingLeft: '14px', borderLeft: `2px solid ${theme.accent}` }}>
            <SummaryBlock summary={summary} theme={theme} />
          </div>
        )}
      </div>
      <div style={{ padding: '28px 34px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.3fr) 236px', gap: '24px' }}>
          <SectionPanels
            sections={leadSections}
            theme={theme}
            regionKey="lead"
            layoutEditor={layoutEditor}
            shellStyle={{ padding: '18px 18px 16px', borderRadius: '20px', background: '#ffffff', border: `1px solid ${theme.line}` }}
          />
          <SectionPanels
            sections={supportSections}
            theme={theme}
            regionKey="support"
            layoutEditor={layoutEditor}
            shellStyle={{ padding: '16px 18px', borderRadius: '20px', background: theme.accentSoft, border: `1px solid ${theme.line}` }}
          />
        </div>
      </div>
    </div>
  );
}
