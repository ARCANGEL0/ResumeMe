// src/components/templates/Slate.tsx
import { type CSSProperties } from 'react';
import { t } from '../../i18n';
import { useCVStore } from '../../store/cvStore';
import type { CVData } from '../../types/cv';
import { TEMPLATE_THEMES } from './templateCatalog';
import { ensureTemplateLayout, getSectionsForRegion } from './templateLayout';
import { getContactItems } from './templateUtils';
import { ContactPanel, HeaderBlock, SectionColumn, SectionEyebrow, type TemplateLayoutEditor } from './templateComponents';

interface Props {
  data: CVData;
  layoutEditor?: TemplateLayoutEditor;
}

export default function Slate({ data, layoutEditor }: Props) {
  const language = useCVStore((state) => state.language);
  const theme = TEMPLATE_THEMES['slate'];
  const { personalInfo, sections } = data;
  const layoutState = ensureTemplateLayout('slate', data.layoutOverride, sections);
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
    <div style={{ ...baseStyle, display: 'grid', gridTemplateColumns: 'minmax(0, 1.44fr) 224px' }}>
      <main style={{ padding: '34px 36px 36px' }}>
        <HeaderBlock
          displayName={displayName}
          subtitle={leadRole}
          summary={summary}
          contactItems={[]}
          theme={theme}
          language={language}
          titleSize="30px"
          hideContact
        />
        <div style={{ marginTop: '26px' }}>
          <SectionColumn sections={mainSections} theme={theme} regionKey="main" layoutEditor={layoutEditor} />
        </div>
      </main>
      <aside style={{ padding: '30px 18px 28px', background: theme.sidebarBg, color: theme.sidebarText }}>
        <SectionEyebrow title={t(language, 'contact')} theme={theme} />
        <ContactPanel contactItems={contactItems} theme={theme} onDark contactStyle="stack" />
        <div style={{ marginTop: '22px' }}>
          <SectionColumn sections={sidebarSections} theme={theme} onDark regionKey="sidebar" layoutEditor={layoutEditor} />
        </div>
      </aside>
    </div>
  );
}
