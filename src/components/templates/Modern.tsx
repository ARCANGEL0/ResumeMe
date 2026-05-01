// src/components/templates/Modern.tsx
import { type CSSProperties } from 'react';
import { t } from '../../i18n';
import { useCVStore } from '../../store/cvStore';
import type { CVData } from '../../types/cv';
import { TEMPLATE_THEMES } from './templateCatalog';
import { ensureTemplateLayout, getSectionsForRegion } from './templateLayout';
import { getContactItems } from './templateUtils';
import { HeaderBlock, SectionColumn, type TemplateLayoutEditor } from './templateComponents';

interface Props {
  data: CVData;
  layoutEditor?: TemplateLayoutEditor;
}

export default function Modern({ data, layoutEditor }: Props) {
  const language = useCVStore((state) => state.language);
  const theme = TEMPLATE_THEMES['modern'];
  const { personalInfo, sections } = data;
  const layoutState = ensureTemplateLayout('modern', data.layoutOverride, sections);
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
    <div style={{ ...baseStyle, display: 'grid', gridTemplateColumns: '230px minmax(0, 1fr)' }}>
      <aside style={{ padding: '34px 22px 30px', background: theme.sidebarBg, color: theme.text, borderRight: `1px solid ${theme.line}` }}>
        <HeaderBlock
          displayName={displayName}
          subtitle={leadRole}
          summary={summary}
          contactItems={contactItems}
          theme={theme}
          language={language}
          compact
          contactStyle="stack"
          titleSize="24px"
        />
        {(sidebarSections.length > 0 || layoutEditor) && (
          <div style={{ marginTop: '24px' }}>
            <SectionColumn sections={sidebarSections} theme={theme} regionKey="sidebar" layoutEditor={layoutEditor} />
          </div>
        )}
      </aside>
      <main style={{ padding: '34px 38px 36px' }}>
        <div style={{ marginBottom: '22px', paddingBottom: '16px', borderBottom: `1px solid ${theme.line}` }} />
        <SectionColumn sections={mainSections} theme={theme} regionKey="main" layoutEditor={layoutEditor} />
      </main>
    </div>
  );
}
