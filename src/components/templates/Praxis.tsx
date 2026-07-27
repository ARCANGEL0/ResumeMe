import { type CSSProperties } from 'react';
import { t } from '../../i18n';
import { useCVStore } from '../../store/cvStore';
import type { CVData } from '../../types/cv';
import { TEMPLATE_THEMES } from './templateCatalog';
import { ensureTemplateLayout, getSectionsForRegion } from './templateLayout';
import { getContactItems } from './templateUtils';
import {
  ContactPanel,
  SectionColumn,
  SectionHeading,
  SummaryBlock,
  type TemplateLayoutEditor,
} from './templateComponents';

interface Props {
  data: CVData;
  layoutEditor?: TemplateLayoutEditor;
}

export default function Praxis({ data, layoutEditor }: Props) {
  const language = useCVStore((state) => state.language);
  const theme = TEMPLATE_THEMES['praxis'];
  const { personalInfo, sections } = data;
  const layoutState = ensureTemplateLayout('praxis', data.layoutOverride, sections);
  const displayName = personalInfo.fullName || t(language, 'fullName');
  const contactItems = getContactItems(personalInfo, language);
  const summary = personalInfo.summary.trim();

  const baseStyle: CSSProperties = {
    fontFamily: theme.fontFamily,
    fontSize: '10.8px',
    lineHeight: '1.6',
    color: theme.text,
    background: theme.page,
    minHeight: '297mm',
  };

  const mainSections = getSectionsForRegion(sections, layoutState, 'main');
  const sideSections = getSectionsForRegion(sections, layoutState, 'side');

  return (
    <div style={baseStyle}>
      <div style={{ borderTop: `6px solid ${theme.accentAlt}` }} />

      <div style={{ padding: '26px 38px 22px' }}>
        <h1
          style={{
            margin: 0,
            fontSize: '29px',
            fontWeight: 700,
            lineHeight: 1.08,
            letterSpacing: theme.nameLetterSpacing,
            textTransform: 'uppercase',
            color: theme.accentDark,
          }}
        >
          {displayName}
        </h1>
        <div style={{ marginTop: '12px' }}>
          <ContactPanel contactItems={contactItems} theme={theme} contactStyle="inline" />
        </div>
      </div>

      <div style={{ margin: '0 38px', borderTop: `2px solid ${theme.accentDark}` }} />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.42fr) minmax(0, 0.92fr)',
          gap: '30px',
          padding: '24px 38px 34px',
        }}
      >
        <main>
          {summary && (
            <div style={{ marginBottom: '24px' }}>
              <SectionHeading title={t(language, 'professionalSummary')} theme={theme} />
              <SummaryBlock summary={summary} theme={theme} />
            </div>
          )}
          <SectionColumn sections={mainSections} theme={theme} regionKey="main" layoutEditor={layoutEditor} gap="24px" />
        </main>

        <aside style={{ paddingLeft: '26px', borderLeft: `1px solid ${theme.line}` }}>
          <SectionColumn sections={sideSections} theme={theme} regionKey="side" layoutEditor={layoutEditor} gap="24px" />
        </aside>
      </div>
    </div>
  );
}
