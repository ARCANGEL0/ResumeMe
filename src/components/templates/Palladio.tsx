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

export default function Palladio({ data, layoutEditor }: Props) {
  const language = useCVStore((state) => state.language);
  const theme = TEMPLATE_THEMES['palladio'];
  const { personalInfo, sections } = data;
  const layoutState = ensureTemplateLayout('palladio', data.layoutOverride, sections);
  const displayName = personalInfo.fullName || t(language, 'fullName');
  const contactItems = getContactItems(personalInfo, language);
  const summary = personalInfo.summary.trim();

  const baseStyle: CSSProperties = {
    fontFamily: theme.fontFamily,
    fontSize: '11.6px',
    lineHeight: '1.66',
    color: theme.text,
    background: theme.page,
    minHeight: '297mm',
  };

  const mainSections = getSectionsForRegion(sections, layoutState, 'main');
  const bottomLeftSections = getSectionsForRegion(sections, layoutState, 'bottomLeft');
  const bottomRightSections = getSectionsForRegion(sections, layoutState, 'bottomRight');
  const hasBottom = bottomLeftSections.length > 0 || bottomRightSections.length > 0 || Boolean(layoutEditor);

  return (
    <div style={baseStyle}>
      <div style={{ padding: '38px 52px 40px' }}>
        <div style={{ paddingBottom: '18px', borderBottom: `3px double ${theme.accentAlt}` }}>
          <HeaderBlock
          photo={personalInfo.photo} photoSize={112}
            displayName={displayName}
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
          <div style={{ margin: '22px 0 28px', padding: '0 26px' }}>
            <SummaryBlock summary={summary} theme={theme} />
          </div>
        )}

        <SectionColumn sections={mainSections} theme={theme} regionKey="main" layoutEditor={layoutEditor} gap="26px" />

        {hasBottom && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
              gap: '30px',
              marginTop: '30px',
              paddingTop: '24px',
              borderTop: `1px solid ${theme.line}`,
            }}
          >
            <SectionColumn
              sections={bottomLeftSections}
              theme={theme}
              regionKey="bottomLeft"
              layoutEditor={layoutEditor}
              gap="24px"
            />
            <SectionColumn
              sections={bottomRightSections}
              theme={theme}
              regionKey="bottomRight"
              layoutEditor={layoutEditor}
              gap="24px"
            />
          </div>
        )}
      </div>
    </div>
  );
}
