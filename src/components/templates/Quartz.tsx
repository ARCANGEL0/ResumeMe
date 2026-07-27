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

export default function Quartz({ data, layoutEditor }: Props) {
  const language = useCVStore((state) => state.language);
  const theme = TEMPLATE_THEMES['quartz'];
  const { personalInfo, sections } = data;
  const layoutState = ensureTemplateLayout('quartz', data.layoutOverride, sections);
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

  const panelStyle: CSSProperties = {
    padding: '18px 20px',
    background: '#ffffff',
    border: `1px solid ${theme.line}`,
    borderRadius: '10px',
  };

  const mainSections = getSectionsForRegion(sections, layoutState, 'main');
  const sideSections = getSectionsForRegion(sections, layoutState, 'side');

  return (
    <div style={baseStyle}>
      <div style={{ padding: '28px 30px 32px' }}>
        <div style={{ ...panelStyle, padding: '26px 28px', borderTop: `4px solid ${theme.accent}` }}>
          <HeaderBlock
          photo={personalInfo.photo} photoSize={104}
            displayName={displayName}
            summary={summary}
            contactItems={contactItems}
            theme={theme}
            language={language}
            titleSize="30px"
            contactStyle="pills"
            hideDivider
          />
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.55fr) minmax(0, 0.85fr)',
            gap: '18px',
            marginTop: '18px',
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
    </div>
  );
}
