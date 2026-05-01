// src/components/templates/Minimal.tsx
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

export default function Minimal({ data, layoutEditor }: Props) {
  const language = useCVStore((state) => state.language);
  const theme = TEMPLATE_THEMES['minimal'];
  const { personalInfo, sections } = data;
  const layoutState = ensureTemplateLayout('minimal', data.layoutOverride, sections);
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
  const hasSidebarRegion = sidebarSections.length > 0 || Boolean(layoutEditor);

  return (
    <div style={baseStyle}>
      <div style={{ height: '10px', background: `linear-gradient(90deg, ${theme.accent}, ${theme.line}, ${theme.accent})` }} />
      <div style={{ padding: '34px 42px 42px' }}>
        <div style={{ paddingBottom: '24px', borderBottom: `1px solid ${theme.line}` }}>
          <HeaderBlock
            displayName={displayName}
            subtitle={leadRole}
            summary={summary}
            contactItems={contactItems}
            theme={theme}
            language={language}
            titleSize="29px"
            showSummaryLabel={false}
          />
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: hasSidebarRegion ? 'minmax(0, 1.55fr) minmax(190px, 0.84fr)' : '1fr',
            gap: '32px',
            marginTop: '28px',
          }}
        >
          <SectionColumn sections={mainSections} theme={theme} regionKey="main" layoutEditor={layoutEditor} />
          {hasSidebarRegion && (
            <div style={{ paddingLeft: '10px', borderLeft: `1px solid ${theme.line}` }}>
              <SectionColumn sections={sidebarSections} theme={theme} regionKey="sidebar" layoutEditor={layoutEditor} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
