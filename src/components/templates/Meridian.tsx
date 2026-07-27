import { type CSSProperties } from 'react';
import { t } from '../../i18n';
import { useCVStore } from '../../store/cvStore';
import type { CVData } from '../../types/cv';
import { TEMPLATE_THEMES } from './templateCatalog';
import { ensureTemplateLayout, getSectionsForRegion } from './templateLayout';
import { getContactItems } from './templateUtils';
import {
  ContactPanel,
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

export default function Meridian({ data, layoutEditor }: Props) {
  const language = useCVStore((state) => state.language);
  const theme = TEMPLATE_THEMES['meridian'];
  const { personalInfo, sections } = data;
  const layoutState = ensureTemplateLayout('meridian', data.layoutOverride, sections);
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

  const metaSections = getSectionsForRegion(sections, layoutState, 'meta');
  const mainSections = getSectionsForRegion(sections, layoutState, 'main');

  return (
    <div style={baseStyle}>
      <div style={{ padding: '36px 42px 38px' }}>
        <HeaderBlock
          photo={personalInfo.photo} photoSize={104}
          displayName={displayName}
          summary=""
          contactItems={[]}
          theme={theme}
          language={language}
          titleSize="30px"
          hideContact
          hideDivider
        />

        <div style={{ marginTop: '16px', borderTop: `2px solid ${theme.accent}` }} />
        <div style={{ marginTop: '3px', borderTop: `1px solid ${theme.line}` }} />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(160px, 0.62fr) minmax(0, 1.7fr)',
            gap: '30px',
            marginTop: '24px',
          }}
        >
          <aside style={{ borderRight: `1px solid ${theme.line}`, paddingRight: '24px' }}>
            <SectionEyebrow title={t(language, 'contact')} theme={theme} />
            <ContactPanel contactItems={contactItems} theme={theme} contactStyle="stack" />

            {(metaSections.length > 0 || layoutEditor) && (
              <div style={{ marginTop: '26px' }}>
                <SectionColumn
                  sections={metaSections}
                  theme={theme}
                  regionKey="meta"
                  layoutEditor={layoutEditor}
                  gap="24px"
                />
              </div>
            )}
          </aside>

          <main>
            {summary && (
              <div style={{ marginBottom: '24px' }}>
                <SectionEyebrow title={t(language, 'profile')} theme={theme} />
                <SummaryBlock summary={summary} theme={theme} />
              </div>
            )}
            <SectionColumn sections={mainSections} theme={theme} regionKey="main" layoutEditor={layoutEditor} gap="24px" />
          </main>
        </div>
      </div>
    </div>
  );
}
