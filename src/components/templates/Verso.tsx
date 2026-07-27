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

export default function Verso({ data, layoutEditor }: Props) {
  const language = useCVStore((state) => state.language);
  const theme = TEMPLATE_THEMES['verso'];
  const { personalInfo, sections } = data;
  const layoutState = ensureTemplateLayout('verso', data.layoutOverride, sections);
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
      <div style={{ padding: '34px 40px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '30px' }}>
          <div style={{ minWidth: 0, flex: 1 }}>
            <h1
              style={{
                margin: 0,
                fontSize: '34px',
                fontWeight: 700,
                lineHeight: 1.06,
                letterSpacing: theme.nameLetterSpacing,
                color: theme.accentDark,
              }}
            >
              {displayName}
            </h1>
            <div style={{ width: '58px', height: '3px', margin: '14px 0 0', background: theme.accentAlt }} />
            {summary && (
              <div style={{ marginTop: '18px' }}>
                <SummaryBlock summary={summary} theme={theme} />
              </div>
            )}
          </div>
          {photo && <PhotoFrame photo={photo} size={150} border={`3px solid ${theme.accentAlt}`} />}
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.55fr) minmax(0, 0.88fr)',
          gap: '32px',
          padding: '10px 40px 36px',
        }}
      >
        <SectionColumn sections={mainSections} theme={theme} regionKey="main" layoutEditor={layoutEditor} gap="24px" />
        <aside style={{ paddingLeft: '28px', borderLeft: `1px solid ${theme.line}` }}>
          {contactItems.length > 0 && (
            <div style={{ marginBottom: '26px' }}>
              <SectionHeading title={t(language, 'contact')} theme={theme} />
              <ContactPanel contactItems={contactItems} theme={theme} contactStyle="stack" />
            </div>
          )}
          <SectionColumn sections={sideSections} theme={theme} regionKey="side" layoutEditor={layoutEditor} gap="24px" />
        </aside>
      </div>
    </div>
  );
}
