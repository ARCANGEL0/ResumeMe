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
  SectionEyebrow,
  SummaryBlock,
  type TemplateLayoutEditor,
} from './templateComponents';

interface Props {
  data: CVData;
  layoutEditor?: TemplateLayoutEditor;
}

export default function Insignia({ data, layoutEditor }: Props) {
  const language = useCVStore((state) => state.language);
  const theme = TEMPLATE_THEMES['insignia'];
  const { personalInfo, sections } = data;
  const layoutState = ensureTemplateLayout('insignia', data.layoutOverride, sections);
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
    display: 'grid',
    gridTemplateColumns: '224px minmax(0, 1fr)',
  };

  const sidebarSections = getSectionsForRegion(sections, layoutState, 'sidebar');
  const mainSections = getSectionsForRegion(sections, layoutState, 'main');

  return (
    <div style={baseStyle}>
      <aside style={{ padding: '30px 22px 30px', background: theme.sidebarBg, color: theme.sidebarText }}>
        {photo && (
          <div style={{ marginBottom: '20px', textAlign: 'center' }}>
            <PhotoFrame photo={photo} size={158} border="3px solid rgba(255,255,255,0.28)" />
          </div>
        )}

        <div style={{ paddingBottom: '18px', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
          <div style={{ marginBottom: '12px', fontSize: '11px', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.66)' }}>
            {t(language, 'contact')}
          </div>
          <ContactPanel contactItems={contactItems} theme={theme} contactStyle="stack" onDark />
        </div>

        {(sidebarSections.length > 0 || layoutEditor) && (
          <div style={{ marginTop: '24px' }}>
            <SectionColumn
              sections={sidebarSections}
              theme={theme}
              regionKey="sidebar"
              layoutEditor={layoutEditor}
              onDark
              gap="24px"
            />
          </div>
        )}
      </aside>

      <main style={{ padding: '34px 36px 36px' }}>
        <h1
          style={{
            margin: 0,
            fontSize: '32px',
            fontWeight: 700,
            lineHeight: 1.08,
            letterSpacing: theme.nameLetterSpacing,
            color: theme.accent,
          }}
        >
          {displayName}
        </h1>
        <div style={{ width: '54px', height: '4px', margin: '12px 0 22px', background: theme.accentAlt }} />

        {summary && (
          <div style={{ marginBottom: '24px' }}>
            <SectionEyebrow title={t(language, 'profile')} theme={theme} />
            <SummaryBlock summary={summary} theme={theme} />
          </div>
        )}

        <SectionColumn sections={mainSections} theme={theme} regionKey="main" layoutEditor={layoutEditor} gap="24px" />
      </main>
    </div>
  );
}
