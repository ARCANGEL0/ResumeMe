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

export default function Corvus({ data, layoutEditor }: Props) {
  const language = useCVStore((state) => state.language);
  const theme = TEMPLATE_THEMES['corvus'];
  const { personalInfo, sections } = data;
  const layoutState = ensureTemplateLayout('corvus', data.layoutOverride, sections);
  const displayName = personalInfo.fullName || t(language, 'fullName');
  const contactItems = getContactItems(personalInfo, language);
  const summary = personalInfo.summary.trim();
  const photo = personalInfo.photo;

  const baseStyle: CSSProperties = {
    fontFamily: theme.fontFamily,
    fontSize: '10.8px',
    lineHeight: '1.62',
    color: theme.text,
    background: theme.page,
    minHeight: '297mm',
    display: 'grid',
    gridTemplateColumns: '212px minmax(0, 1fr)',
  };

  const mainSections = getSectionsForRegion(sections, layoutState, 'main');
  const asideSections = getSectionsForRegion(sections, layoutState, 'aside');

  return (
    <div style={baseStyle}>
      <aside style={{ padding: '32px 22px 34px', background: theme.sidebarBg, borderRight: `1px solid ${theme.line}` }}>
        {photo && (
          <div style={{ marginBottom: '22px' }}>
            <PhotoFrame photo={photo} size={168} radius="6px" border={`1px solid ${theme.accentDark}`} />
          </div>
        )}

        <SectionHeading title={t(language, 'contact')} theme={theme} onDark />
        <ContactPanel contactItems={contactItems} theme={theme} contactStyle="stack" onDark />

        {(asideSections.length > 0 || layoutEditor) && (
          <div style={{ marginTop: '28px' }}>
            <SectionColumn
              sections={asideSections}
              theme={theme}
              regionKey="aside"
              layoutEditor={layoutEditor}
              onDark
              gap="26px"
            />
          </div>
        )}
      </aside>

      <main style={{ padding: '34px 36px 36px' }}>
        <h1
          style={{
            margin: 0,
            fontSize: '30px',
            fontWeight: 300,
            lineHeight: 1.12,
            letterSpacing: theme.nameLetterSpacing,
            textTransform: 'uppercase',
            color: '#ffffff',
          }}
        >
          {displayName}
        </h1>
        <div
          style={{
            width: '72px',
            height: '2px',
            margin: '14px 0 24px',
            background: `linear-gradient(90deg, ${theme.accent}, transparent)`,
          }}
        />

        {summary && (
          <div style={{ marginBottom: '28px' }}>
            <SummaryBlock summary={summary} theme={theme} />
          </div>
        )}

        <SectionColumn sections={mainSections} theme={theme} regionKey="main" layoutEditor={layoutEditor} gap="26px" />
      </main>
    </div>
  );
}
