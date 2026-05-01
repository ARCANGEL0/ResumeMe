// src/components/templates/Executive.tsx
import { type CSSProperties } from 'react';
import { t } from '../../i18n';
import { useCVStore } from '../../store/cvStore';
import type { CVData } from '../../types/cv';
import { TEMPLATE_THEMES } from './templateCatalog';
import { ensureTemplateLayout, getSectionsForRegion } from './templateLayout';
import { getContactItems } from './templateUtils';
import { HeaderBlock, SectionColumn, SectionPanels, SummaryBlock, type TemplateLayoutEditor } from './templateComponents';

interface Props {
  data: CVData;
  layoutEditor?: TemplateLayoutEditor;
}

export default function Executive({ data, layoutEditor }: Props) {
  const language = useCVStore((state) => state.language);
  const theme = TEMPLATE_THEMES['executive'];
  const { personalInfo, sections } = data;
  const layoutState = ensureTemplateLayout('executive', data.layoutOverride, sections);
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
      <div style={{ padding: '30px 34px 34px' }}>
        <div style={{ marginBottom: '24px', padding: '22px 24px 18px', borderBottom: `2px solid ${theme.accent}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '24px', alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
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
            </div>
            {summary && (
              <div style={{ maxWidth: '250px', paddingLeft: '18px', borderLeft: `1px solid ${theme.line}` }}>
                <SummaryBlock summary={summary} theme={theme} />
              </div>
            )}
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.26fr) 236px', gap: '24px' }}>
          <SectionColumn sections={leftSections} theme={theme} regionKey="left" layoutEditor={layoutEditor} />
          <SectionPanels
            sections={rightSections}
            theme={theme}
            regionKey="right"
            layoutEditor={layoutEditor}
            shellStyle={{ padding: '16px 16px 14px', borderRadius: '14px', background: theme.accentSoft, border: `1px solid ${theme.line}` }}
          />
        </div>
      </div>
    </div>
  );
}
