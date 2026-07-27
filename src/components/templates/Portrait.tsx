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
  SummaryBlock,
  type TemplateLayoutEditor,
} from './templateComponents';

interface Props {
  data: CVData;
  layoutEditor?: TemplateLayoutEditor;
}

export default function Portrait({ data, layoutEditor }: Props) {
  const language = useCVStore((state) => state.language);
  const theme = TEMPLATE_THEMES['portrait'];
  const { personalInfo, sections } = data;
  const layoutState = ensureTemplateLayout('portrait', data.layoutOverride, sections);
  const displayName = personalInfo.fullName || t(language, 'fullName');
  const contactItems = getContactItems(personalInfo, language);
  const summary = personalInfo.summary.trim();
  const photo = personalInfo.photo;

  const baseStyle: CSSProperties = {
    fontFamily: theme.fontFamily,
    fontSize: '11.2px',
    lineHeight: '1.62',
    color: theme.text,
    background: theme.page,
    minHeight: '297mm',
  };

  const mainSections = getSectionsForRegion(sections, layoutState, 'main');
  const sideSections = getSectionsForRegion(sections, layoutState, 'side');

  return (
    <div style={baseStyle}>
      <div style={{ padding: '36px 46px 26px', textAlign: 'center', background: theme.accentSoft }}>
        {photo && (
          <div style={{ marginBottom: '16px' }}>
            <PhotoFrame photo={photo} size={148} border={`3px solid ${theme.accent}`} />
          </div>
        )}
        <h1
          style={{
            margin: 0,
            fontSize: '30px',
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: theme.nameLetterSpacing,
            textTransform: 'uppercase',
            color: theme.accentDark,
          }}
        >
          {displayName}
        </h1>
        <div style={{ width: '64px', height: '3px', margin: '14px auto 16px', background: theme.accent }} />
        <ContactPanel contactItems={contactItems} theme={theme} contactStyle="inline" align="center" />
      </div>

      <div style={{ padding: '26px 46px 36px' }}>
        {summary && (
          <div style={{ marginBottom: '26px' }}>
            <SummaryBlock summary={summary} theme={theme} />
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.6fr) minmax(0, 0.85fr)', gap: '30px' }}>
          <SectionColumn sections={mainSections} theme={theme} regionKey="main" layoutEditor={layoutEditor} gap="24px" />
          <SectionColumn sections={sideSections} theme={theme} regionKey="side" layoutEditor={layoutEditor} gap="24px" />
        </div>
      </div>
    </div>
  );
}
