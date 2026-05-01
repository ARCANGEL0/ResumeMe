// src/components/templates/Classic.tsx
import { type CSSProperties } from 'react';
import { t } from '../../i18n';
import { useCVStore } from '../../store/cvStore';
import type { CVData } from '../../types/cv';
import { TEMPLATE_THEMES } from './templateCatalog';
import { ensureTemplateLayout, getSectionsForRegion } from './templateLayout';
import { getContactItems } from './templateUtils';
import { HeaderBlock, SectionColumn, SummaryBlock, type TemplateLayoutEditor } from './templateComponents';

interface Props {
  data: CVData;
  layoutEditor?: TemplateLayoutEditor;
}

export default function Classic({ data, layoutEditor }: Props) {
  const language = useCVStore((state) => state.language);
  const theme = TEMPLATE_THEMES['classic'];
  const { personalInfo, sections } = data;
  const layoutState = ensureTemplateLayout('classic', data.layoutOverride, sections);
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

  const leftBottomSections = getSectionsForRegion(sections, layoutState, 'bottomLeft');
  const rightBottomSections = getSectionsForRegion(sections, layoutState, 'bottomRight');
  const mainSections = getSectionsForRegion(sections, layoutState, 'main');

  return (
    <div style={baseStyle}>
      <div style={{ padding: '34px 48px 38px' }}>
        <div style={{ textAlign: 'center', paddingBottom: '20px', borderBottom: `1px solid ${theme.line}` }}>
          <HeaderBlock
            displayName={displayName}
            subtitle={leadRole}
            summary=""
            contactItems={contactItems}
            theme={theme}
            language={language}
            align="center"
            contactStyle="inline"
            titleSize="31px"
            hideDivider
          />
        </div>
        {summary && (
          <div style={{ marginTop: '20px', marginBottom: '28px' }}>
            <SummaryBlock summary={summary} theme={theme} />
          </div>
        )}
        <SectionColumn sections={mainSections} theme={theme} regionKey="main" layoutEditor={layoutEditor} />
        {(leftBottomSections.length > 0 || rightBottomSections.length > 0 || layoutEditor) && (
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '28px', marginTop: '28px', paddingTop: '24px', borderTop: `1px solid ${theme.line}` }}>
            <SectionColumn sections={leftBottomSections} theme={theme} regionKey="bottomLeft" layoutEditor={layoutEditor} />
            <SectionColumn sections={rightBottomSections} theme={theme} regionKey="bottomRight" layoutEditor={layoutEditor} />
          </div>
        )}
      </div>
    </div>
  );
}
