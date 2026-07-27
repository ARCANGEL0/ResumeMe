import { type CSSProperties } from 'react';
import { t } from '../../i18n';
import { useCVStore } from '../../store/cvStore';
import type { CVData } from '../../types/cv';
import { TEMPLATE_THEMES } from './templateCatalog';
import { ensureTemplateLayout, getSectionsForRegion } from './templateLayout';
import { getContactItems } from './templateUtils';
import {
  HeaderBlock,
  SectionColumn,
  SectionEyebrow,
  SummaryBlock,
  type TemplateLayoutEditor,
} from './templateComponents';

interface Props {
  data: CVData;
  layoutEditor?: TemplateLayoutEditor;
}

export default function Beacon({ data, layoutEditor }: Props) {
  const language = useCVStore((state) => state.language);
  const theme = TEMPLATE_THEMES['beacon'];
  const { personalInfo, sections } = data;
  const layoutState = ensureTemplateLayout('beacon', data.layoutOverride, sections);
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

  return (
    <div style={baseStyle}>
      <div style={{ padding: '40px 52px 42px' }}>
        <HeaderBlock
          displayName={displayName}
          summary=""
          contactItems={contactItems}
          theme={theme}
          language={language}
          titleSize="27px"
          contactStyle="inline"
          hideDivider
        />

        <div style={{ marginTop: '18px', paddingTop: '18px', borderTop: `1px solid ${theme.line}` }}>
          {summary && (
            <div style={{ marginBottom: '24px' }}>
              <SectionEyebrow title={t(language, 'profile')} theme={theme} />
              <SummaryBlock summary={summary} theme={theme} />
            </div>
          )}

          <SectionColumn sections={mainSections} theme={theme} regionKey="main" layoutEditor={layoutEditor} gap="26px" />
        </div>
      </div>
    </div>
  );
}
