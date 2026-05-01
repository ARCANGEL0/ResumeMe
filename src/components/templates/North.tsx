// src/components/templates/North.tsx
import { type CSSProperties } from 'react';
import { t } from '../../i18n';
import { useCVStore } from '../../store/cvStore';
import type { CVData } from '../../types/cv';
import { TEMPLATE_THEMES } from './templateCatalog';
import { ensureTemplateLayout, getSectionsForRegion } from './templateLayout';
import { getContactItems } from './templateUtils';
import {
  ContactPanel, HeaderBlock, SectionColumn, SectionEyebrow,
  SectionPanels, SummaryBlock, type TemplateLayoutEditor,
} from './templateComponents';

interface Props {
  data: CVData;
  layoutEditor?: TemplateLayoutEditor;
}

export default function North({ data, layoutEditor }: Props) {
  const language = useCVStore((state) => state.language);
  const theme = TEMPLATE_THEMES['north'];
  const { personalInfo, sections } = data;
  const layoutState = ensureTemplateLayout('north', data.layoutOverride, sections);
  const displayName = personalInfo.fullName || t(language, 'fullName');
  const contactItems = getContactItems(personalInfo);
  const summary = personalInfo.summary.trim();
  const leadRole = '';

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
    <div style={baseStyle}>
      <div style={{ padding: '34px 34px 36px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(220px, 0.82fr) minmax(0, 1.45fr)', gap: '28px' }}>
          <aside style={{ padding: '24px', border: `1px solid ${theme.line}`, background: `linear-gradient(180deg, ${theme.accentSoft}, #ffffff 58%)` }}>
            <div style={{ color: theme.accent, fontSize: '10px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase' }}>
              {t(language, 'contact')}
            </div>
            <div style={{ marginTop: '16px' }}>
              <ContactPanel contactItems={contactItems} theme={theme} contactStyle="stack" />
            </div>
            {summary && (
              <div style={{ marginTop: '22px' }}>
                <SectionEyebrow title={t(language, 'profile')} theme={theme} />
                <SummaryBlock summary={summary} theme={theme} />
              </div>
            )}
            {(sidebarSections.length > 0 || layoutEditor) && (
              <div style={{ marginTop: '26px' }}>
                <SectionPanels
                  sections={sidebarSections}
                  theme={theme}
                  regionKey="sidebar"
                  layoutEditor={layoutEditor}
                  shellStyle={{ padding: '16px 18px', background: '#ffffff', border: `1px solid ${theme.line}` }}
                />
              </div>
            )}
          </aside>
          <main style={{ paddingTop: '8px' }}>
            <HeaderBlock
              displayName={displayName}
              subtitle={leadRole}
              summary=""
              contactItems={[]}
              theme={theme}
              language={language}
              titleSize="33px"
              showDivider
              hideContact
            />
            <div style={{ marginTop: '28px' }}>
              <SectionColumn sections={mainSections} theme={theme} regionKey="main" layoutEditor={layoutEditor} />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
