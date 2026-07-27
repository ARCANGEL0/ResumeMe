import { type CSSProperties } from 'react';
import { t } from '../../i18n';
import { useCVStore } from '../../store/cvStore';
import type { CVData } from '../../types/cv';
import { TEMPLATE_THEMES } from './templateCatalog';
import { ensureTemplateLayout, getSectionsForRegion } from './templateLayout';
import { getContactItems } from './templateUtils';
import { HeaderBlock, SectionPanels, type TemplateLayoutEditor } from './templateComponents';

interface Props {
  data: CVData;
  layoutEditor?: TemplateLayoutEditor;
}

export default function Signal({ data, layoutEditor }: Props) {
  const language = useCVStore((state) => state.language);
  const theme = TEMPLATE_THEMES['signal'];
  const { personalInfo, sections } = data;
  const layoutState = ensureTemplateLayout('signal', data.layoutOverride, sections);
  const displayName = personalInfo.fullName || t(language, 'fullName');
  const contactItems = getContactItems(personalInfo, language);
  const summary = personalInfo.summary.trim();

  const baseStyle: CSSProperties = {
    fontFamily: theme.fontFamily,
    fontSize: '11.2px',
    lineHeight: '1.6',
    color: theme.text,
    background: theme.page,
    minHeight: '297mm',
  };

  const panelStyle: CSSProperties = {
    padding: '16px 18px',
    borderRadius: '12px',
    border: `1px solid ${theme.line}`,
    background: '#ffffff',
  };

  const mainSections = getSectionsForRegion(sections, layoutState, 'main');
  const sideSections = getSectionsForRegion(sections, layoutState, 'side');

  return (
    <div style={baseStyle}>
      <div
        style={{
          padding: '30px 36px 26px',
          background: `linear-gradient(135deg, ${theme.accentSoft} 0%, #ffffff 70%)`,
          borderBottom: `3px solid ${theme.accent}`,
        }}
      >
        <HeaderBlock
          photo={personalInfo.photo}
          photoSize={132}
          photoPlacement="left"
          displayName={displayName}
          summary={summary}
          contactItems={contactItems}
          theme={theme}
          language={language}
          titleSize="33px"
          contactStyle="pills"
          hideDivider
          showSummaryLabel={false}
        />
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 0.92fr)',
          gap: '16px',
          padding: '22px 36px 32px',
        }}
      >
        <SectionPanels
          sections={mainSections}
          theme={theme}
          regionKey="main"
          layoutEditor={layoutEditor}
          shellStyle={panelStyle}
        />
        <SectionPanels
          sections={sideSections}
          theme={theme}
          regionKey="side"
          layoutEditor={layoutEditor}
          shellStyle={panelStyle}
        />
      </div>
    </div>
  );
}
