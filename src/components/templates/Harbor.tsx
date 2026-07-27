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

export default function Harbor({ data, layoutEditor }: Props) {
  const language = useCVStore((state) => state.language);
  const theme = TEMPLATE_THEMES['harbor'];
  const { personalInfo, sections } = data;
  const layoutState = ensureTemplateLayout('harbor', data.layoutOverride, sections);
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

  const sidebarSections = getSectionsForRegion(sections, layoutState, 'sidebar');
  const mainSections = getSectionsForRegion(sections, layoutState, 'main');

  return (
    <div style={{ ...baseStyle, display: 'grid', gridTemplateColumns: '215px minmax(0, 1fr)' }}>
      <aside style={{ padding: '32px 22px 30px', background: theme.sidebarBg, color: theme.sidebarText }}>
        {personalInfo.photo && (
          <div style={{ marginBottom: '22px', textAlign: 'center' }}>
            <PhotoFrame photo={personalInfo.photo} size={130} border="3px solid rgba(255,255,255,0.32)" />
          </div>
        )}
        <div style={{ paddingBottom: '18px', borderBottom: '1px solid rgba(255,255,255,0.18)' }}>
          <div style={{ fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)' }}>
            {t(language, 'contact')}
          </div>
          <div style={{ marginTop: '14px' }}>
            <ContactPanel contactItems={contactItems} theme={theme} contactStyle="stack" onDark />
          </div>
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

      <main style={{ padding: '34px 38px 36px' }}>
        <h1
          style={{
            margin: 0,
            fontSize: '31px',
            fontWeight: 700,
            lineHeight: 1.1,
            color: theme.accentDark,
            letterSpacing: theme.nameLetterSpacing,
          }}
        >
          {displayName}
        </h1>
        <div
          style={{
            width: '58px',
            height: '3px',
            margin: '12px 0 20px',
            background: `linear-gradient(90deg, ${theme.accent}, ${theme.accentAlt})`,
          }}
        />

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
