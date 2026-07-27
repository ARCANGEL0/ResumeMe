import { type CSSProperties } from 'react';
import { t } from '../../i18n';
import { useCVStore } from '../../store/cvStore';
import type { CVData } from '../../types/cv';
import { TEMPLATE_THEMES } from './templateCatalog';
import { ensureTemplateLayout, getSectionsForRegion } from './templateLayout';
import { getContactItems } from './templateUtils';
import { ContactPanel, PhotoFrame, SectionColumn, SectionHeading, type TemplateLayoutEditor } from './templateComponents';

interface Props {
  data: CVData;
  layoutEditor?: TemplateLayoutEditor;
}

export default function Cobalt({ data, layoutEditor }: Props) {
  const language = useCVStore((state) => state.language);
  const theme = TEMPLATE_THEMES['cobalt'];
  const { personalInfo, sections } = data;
  const layoutState = ensureTemplateLayout('cobalt', data.layoutOverride, sections);
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
    display: 'flex',
    flexDirection: 'column',
  };

  const asideSections = getSectionsForRegion(sections, layoutState, 'aside');
  const mainSections = getSectionsForRegion(sections, layoutState, 'main');

  return (
    <div style={baseStyle}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          padding: '34px 40px 30px',
          background: theme.headerBg,
          color: theme.headerText,
        }}
      >
        {photo && <PhotoFrame photo={photo} size={140} radius="8px" border="3px solid rgba(255,255,255,0.35)" />}
        <div style={{ minWidth: 0 }}>
        <h1
          style={{
            margin: 0,
            fontSize: '38px',
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: theme.nameLetterSpacing,
            textTransform: 'uppercase',
          }}
        >
          {displayName}
        </h1>
        {summary && (
          <p style={{ margin: '16px 0 0', color: 'rgba(255,255,255,0.82)' }}>{summary}</p>
        )}
        </div>
      </div>

      <div style={{ height: '5px', background: theme.accentAlt }} />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 0.78fr) minmax(0, 1.72fr)',
          gap: '34px',
          flex: 1,
          padding: '30px 40px 36px',
          background: theme.accentSoft,
        }}
      >
        <aside>
          <SectionHeading title={t(language, 'contact')} theme={theme} />
          <ContactPanel contactItems={contactItems} theme={theme} contactStyle="stack" />

          {(asideSections.length > 0 || layoutEditor) && (
            <div style={{ marginTop: '28px' }}>
              <SectionColumn
                sections={asideSections}
                theme={theme}
                regionKey="aside"
                layoutEditor={layoutEditor}
                gap="28px"
              />
            </div>
          )}
        </aside>

        <main>
          <SectionColumn sections={mainSections} theme={theme} regionKey="main" layoutEditor={layoutEditor} gap="26px" />
        </main>
      </div>
    </div>
  );
}
