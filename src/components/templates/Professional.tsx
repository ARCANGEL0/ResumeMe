// src/components/templates/Professional.tsx
import { type CSSProperties } from 'react';
import { t } from '../../i18n';
import { useCVStore } from '../../store/cvStore';
import type { CVData } from '../../types/cv';
import { TEMPLATE_THEMES } from './templateCatalog';
import { ensureTemplateLayout, getSectionsForRegion } from './templateLayout';
import { getContactItems } from './templateUtils';
import { HeaderBlock, SectionColumn, SectionPanels, SummaryBlock, type TemplateLayoutEditor } from './templateComponents';

interface Props {
  data: CVData;
  layoutEditor?: TemplateLayoutEditor;
}

export default function Professional({ data, layoutEditor }: Props) {
  const language = useCVStore((state) => state.language);
  const theme = TEMPLATE_THEMES['professional'];
  const { personalInfo, sections } = data;
  const layoutState = ensureTemplateLayout('professional', data.layoutOverride, sections);
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

  const supportingSections = getSectionsForRegion(sections, layoutState, 'supporting');
  const mainSections = getSectionsForRegion(sections, layoutState, 'main');
  const hasSupportingRegion = supportingSections.length > 0 || Boolean(layoutEditor);

  return (
    <div style={baseStyle}>
      <div style={{ padding: '28px 38px 30px', background: theme.headerBg, color: theme.headerText }}>
        <div style={{ display: 'grid', gridTemplateColumns: summary ? 'minmax(0, 1.3fr) minmax(220px, 0.9fr)' : '1fr', gap: '24px', alignItems: 'end' }}>
          <HeaderBlock
            displayName={displayName}
            subtitle={leadRole}
            summary=""
            contactItems={contactItems}
            theme={theme}
            language={language}
            onDark
            contactStyle="inline"
            titleSize="29px"
          />
          {summary && (
            <div style={{ padding: '16px 18px', borderRadius: '18px', background: 'rgba(255,255,255,0.1)' }}>
              <SummaryBlock summary={summary} theme={theme} onDark />
            </div>
          )}
        </div>
      </div>
      <div style={{ padding: '28px 38px 34px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: hasSupportingRegion ? 'minmax(0, 1.38fr) minmax(220px, 0.82fr)' : '1fr', gap: '28px' }}>
          <SectionColumn sections={mainSections} theme={theme} regionKey="main" layoutEditor={layoutEditor} />
          {hasSupportingRegion && (
            <SectionPanels
              sections={supportingSections}
              theme={theme}
              regionKey="supporting"
              layoutEditor={layoutEditor}
              shellStyle={{ padding: '16px 18px', borderRadius: '18px', background: theme.accentSoft, border: `1px solid ${theme.line}` }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
