// src/components/templates/Ivory.tsx
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

export default function Ivory({ data, layoutEditor }: Props) {
  const language = useCVStore((state) => state.language);
  const theme = TEMPLATE_THEMES['ivory'];
  const { personalInfo, sections } = data;
  const layoutState = ensureTemplateLayout('ivory', data.layoutOverride, sections);
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
    <div style={{ ...baseStyle, padding: '22px' }}>
      <div style={{ minHeight: 'calc(297mm - 44px)', border: `1px solid ${theme.line}`, padding: '28px 34px 30px', boxShadow: `inset 0 0 0 5px ${theme.accentSoft}` }}>
        <div style={{ textAlign: 'center', paddingBottom: '18px', borderBottom: `1px solid ${theme.line}` }}>
          <HeaderBlock
            displayName={displayName}
            subtitle={leadRole}
            summary=""
            contactItems={contactItems}
            theme={theme}
            language={language}
            align="center"
            contactStyle="inline"
            titleSize="30px"
            hideDivider
          />
        </div>
        {summary && (
          <div style={{ margin: '18px auto 24px', maxWidth: '86%' }}>
            <SummaryBlock summary={summary} theme={theme} />
          </div>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: hasSideRegion ? 'minmax(0, 1.28fr) minmax(210px, 0.78fr)' : '1fr', gap: '30px' }}>
          <SectionColumn sections={mainSections} theme={theme} regionKey="main" layoutEditor={layoutEditor} />
          {hasSideRegion && <SectionColumn sections={sideSections} theme={theme} regionKey="side" layoutEditor={layoutEditor} />}
        </div>
      </div>
    </div>
  );
}
