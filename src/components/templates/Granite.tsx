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

export default function Granite({ data, layoutEditor }: Props) {
  const language = useCVStore((state) => state.language);
  const theme = TEMPLATE_THEMES['granite'];
  const { personalInfo, sections } = data;
  const layoutState = ensureTemplateLayout('granite', data.layoutOverride, sections);
  const displayName = personalInfo.fullName || t(language, 'fullName');
  const contactItems = getContactItems(personalInfo, language);
  const summary = personalInfo.summary.trim();

  const baseStyle: CSSProperties = {
    fontFamily: theme.fontFamily,
    fontSize: '11.2px',
    lineHeight: '1.62',
    color: theme.text,
    background: theme.page,
    minHeight: '297mm',
  };

  const mainSections = getSectionsForRegion(sections, layoutState, 'main');
  const footerSections = getSectionsForRegion(sections, layoutState, 'footer');
  const hasFooter = footerSections.length > 0 || Boolean(layoutEditor);

  return (
    <div style={baseStyle}>
      <div style={{ display: 'grid', gridTemplateColumns: '12px minmax(0, 1fr)' }}>
        <div style={{ background: `linear-gradient(180deg, ${theme.accent}, ${theme.accentAlt})` }} />
        <div style={{ padding: '36px 42px 36px 32px' }}>
          <HeaderBlock
            photo={personalInfo.photo}
            photoSize={124}
            photoPlacement="right"
            displayName={displayName}
            summary={summary}
            contactItems={contactItems}
            theme={theme}
            language={language}
            titleSize="30px"
            contactStyle="inline"
            showSummaryLabel={false}
          />

          <div style={{ marginTop: '28px' }}>
            <SectionColumn sections={mainSections} theme={theme} regionKey="main" layoutEditor={layoutEditor} gap="24px" />
          </div>

          {hasFooter && (
            <div style={{ marginTop: '28px', paddingTop: '24px', borderTop: `2px solid ${theme.line}` }}>
              <SectionColumn
                sections={footerSections}
                theme={theme}
                regionKey="footer"
                layoutEditor={layoutEditor}
                gap="24px"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
