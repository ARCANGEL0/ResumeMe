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

export default function Linen({ data, layoutEditor }: Props) {
  const language = useCVStore((state) => state.language);
  const theme = TEMPLATE_THEMES['linen'];
  const { personalInfo, sections } = data;
  const layoutState = ensureTemplateLayout('linen', data.layoutOverride, sections);
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
    display: 'flex',
    flexDirection: 'column',
  };

  const sidebarSections = getSectionsForRegion(sections, layoutState, 'sidebar');
  const mainSections = getSectionsForRegion(sections, layoutState, 'main');

  return (
    <div style={baseStyle}>
      <div style={{ display: 'grid', gridTemplateColumns: '215px minmax(0, 1fr)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', padding: '30px 0 14px', background: theme.sidebarBg }}>
          {photo && <PhotoFrame photo={photo} size={142} border={`3px solid ${theme.headerBg ? '#ffffff' : theme.line}`} />}
        </div>
        <div style={{ padding: '30px 34px 26px', background: theme.headerBg, color: theme.headerText }}>
          <h1 style={{ margin: 0, fontSize: '32px', fontWeight: 600, lineHeight: 1.1, letterSpacing: theme.nameLetterSpacing }}>
            {displayName}
          </h1>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '215px minmax(0, 1fr)', flex: 1 }}>
        <aside style={{ padding: '28px 22px 30px', background: theme.sidebarBg }}>
          <SectionHeading title={t(language, 'contactDetails')} theme={theme} />
          <ContactPanel contactItems={contactItems} theme={theme} contactStyle="stack" />

          {(sidebarSections.length > 0 || layoutEditor) && (
            <div style={{ marginTop: '26px' }}>
              <SectionColumn
                sections={sidebarSections}
                theme={theme}
                regionKey="sidebar"
                layoutEditor={layoutEditor}
                gap="26px"
              />
            </div>
          )}
        </aside>

        <main style={{ padding: '28px 34px 34px' }}>
          {summary && (
            <div style={{ marginBottom: '26px' }}>
              <SectionHeading title={t(language, 'profile')} theme={theme} />
              <SummaryBlock summary={summary} theme={theme} />
            </div>
          )}
          <SectionColumn sections={mainSections} theme={theme} regionKey="main" layoutEditor={layoutEditor} gap="26px" />
        </main>
      </div>
    </div>
  );
}
