import { type CSSProperties } from 'react';
import { t } from '../../i18n';
import { useCVStore } from '../../store/cvStore';
import type { CVData } from '../../types/cv';
import { TEMPLATE_THEMES } from './templateCatalog';
import { ensureTemplateLayout, getSectionsForRegion } from './templateLayout';
import { getContactItems } from './templateUtils';
import { HeaderBlock, SectionColumn, type TemplateLayoutEditor } from './templateComponents';

interface Props {
  data: CVData;
  layoutEditor?: TemplateLayoutEditor;
}

export default function Vertex({ data, layoutEditor }: Props) {
  const language = useCVStore((state) => state.language);
  const theme = TEMPLATE_THEMES['vertex'];
  const { personalInfo, sections } = data;
  const layoutState = ensureTemplateLayout('vertex', data.layoutOverride, sections);
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

  const mainSections = getSectionsForRegion(sections, layoutState, 'main');
  const supportLeftSections = getSectionsForRegion(sections, layoutState, 'supportLeft');
  const supportRightSections = getSectionsForRegion(sections, layoutState, 'supportRight');
  const hasSupport = supportLeftSections.length > 0 || supportRightSections.length > 0 || Boolean(layoutEditor);

  return (
    <div style={baseStyle}>
      <div style={{ position: 'relative', overflow: 'hidden', background: theme.headerBg, padding: '32px 40px 28px' }}>
        <span
          style={{
            position: 'absolute',
            top: '-40px',
            right: '-30px',
            width: '180px',
            height: '180px',
            background: theme.accentAlt,
            opacity: 0.18,
            transform: 'rotate(28deg)',
          }}
        />
        <span
          style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            width: '100%',
            height: '4px',
            background: `linear-gradient(90deg, ${theme.accentAlt}, ${theme.accent})`,
          }}
        />
        <div style={{ position: 'relative' }}>
          <HeaderBlock
          photo={personalInfo.photo} photoSize={96}
            displayName={displayName}
            summary={summary}
            contactItems={contactItems}
            theme={theme}
            language={language}
            titleSize="32px"
            contactStyle="pills"
            onDark
            showSummaryLabel={false}
          />
        </div>
      </div>

      <div style={{ padding: '28px 40px 36px' }}>
        <SectionColumn sections={mainSections} theme={theme} regionKey="main" layoutEditor={layoutEditor} gap="22px" />

        {hasSupport && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
              gap: '26px',
              marginTop: '26px',
              paddingTop: '22px',
              borderTop: `2px solid ${theme.line}`,
            }}
          >
            <SectionColumn
              sections={supportLeftSections}
              theme={theme}
              regionKey="supportLeft"
              layoutEditor={layoutEditor}
            />
            <SectionColumn
              sections={supportRightSections}
              theme={theme}
              regionKey="supportRight"
              layoutEditor={layoutEditor}
            />
          </div>
        )}
      </div>
    </div>
  );
}
