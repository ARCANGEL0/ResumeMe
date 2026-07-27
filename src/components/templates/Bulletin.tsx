import { type CSSProperties } from 'react';
import { t } from '../../i18n';
import { useCVStore } from '../../store/cvStore';
import type { CVData } from '../../types/cv';
import { TEMPLATE_THEMES } from './templateCatalog';
import { ensureTemplateLayout, getSectionsForRegion } from './templateLayout';
import { getContactItems } from './templateUtils';
import {
  ContactPanel,
  PhotoFrame,
  SectionColumn,
  SectionHeading,
  SummaryBlock,
  type TemplateLayoutEditor,
} from './templateComponents';

interface Props {
  data: CVData;
  layoutEditor?: TemplateLayoutEditor;
}

export default function Bulletin({ data, layoutEditor }: Props) {
  const language = useCVStore((state) => state.language);
  const theme = TEMPLATE_THEMES['bulletin'];
  const { personalInfo, sections } = data;
  const layoutState = ensureTemplateLayout('bulletin', data.layoutOverride, sections);
  const displayName = personalInfo.fullName || t(language, 'fullName');
  const contactItems = getContactItems(personalInfo, language);
  const summary = personalInfo.summary.trim();
  const photo = personalInfo.photo;

  const baseStyle: CSSProperties = {
    fontFamily: theme.fontFamily,
    fontSize: '11.2px',
    lineHeight: '1.6',
    color: theme.text,
    background: theme.page,
    minHeight: '297mm',
  };

  const mainSections = getSectionsForRegion(sections, layoutState, 'main');
  const sideSections = getSectionsForRegion(sections, layoutState, 'side');

  return (
    <div style={baseStyle}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          padding: '28px 38px',
          background: theme.headerBg,
          color: theme.headerText,
        }}
      >
        {photo && <PhotoFrame photo={photo} size={136} radius="6px" border={`3px solid ${theme.accent}`} />}
        <div style={{ minWidth: 0 }}>
          <h1
            style={{
              margin: 0,
              fontSize: '31px',
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: theme.nameLetterSpacing,
              textTransform: 'uppercase',
            }}
          >
            {displayName}
          </h1>
          <div style={{ width: '48px', height: '4px', margin: '12px 0 14px', background: theme.accent }} />
          <ContactPanel contactItems={contactItems} theme={theme} contactStyle="inline" onDark />
        </div>
      </div>

      <div style={{ padding: '26px 38px 34px' }}>
        {summary && (
          <div style={{ marginBottom: '24px' }}>
            <SectionHeading title={t(language, 'professionalSummary')} theme={theme} />
            <SummaryBlock summary={summary} theme={theme} />
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.55fr) minmax(0, 0.9fr)', gap: '30px' }}>
          <SectionColumn sections={mainSections} theme={theme} regionKey="main" layoutEditor={layoutEditor} gap="24px" />
          <SectionColumn sections={sideSections} theme={theme} regionKey="side" layoutEditor={layoutEditor} gap="24px" />
        </div>
      </div>
    </div>
  );
}
