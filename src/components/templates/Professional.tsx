// src/components/templates/Professional.tsx
import { type CSSProperties } from 'react';
import { t } from '../../i18n';
import { useCVStore } from '../../store/cvStore';
import type { CVData } from '../../types/cv';
import { TEMPLATE_THEMES } from './templateCatalog';
import { ensureTemplateLayout, getSectionsForRegion } from './templateLayout';
import { getContactItems } from './templateUtils';
import { ContactPanel, PhotoFrame, SectionColumn, SectionPanels, type TemplateLayoutEditor } from './templateComponents';

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

  const supportingSections = getSectionsForRegion(sections, layoutState, 'supporting');
  const mainSections = getSectionsForRegion(sections, layoutState, 'main');
  const hasSupportingRegion = supportingSections.length > 0 || Boolean(layoutEditor);

  return (
    <div style={baseStyle}>
      <div style={{ height: '8px', background: theme.accent }} />
      <header style={{ padding: '36px 42px 26px', borderBottom: `2px solid ${theme.accentDark}` }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '26px' }}>
          <div style={{ minWidth: 0, flex: 1 }}>
            <h1 style={{ margin: 0, color: theme.accentDark, fontSize: '38px', fontWeight: 700, lineHeight: 1.04, letterSpacing: '-0.035em', overflowWrap: 'anywhere' }}>{displayName}</h1>
          </div>
          {personalInfo.photo && <PhotoFrame photo={personalInfo.photo} size={78} radius="3px" border={`2px solid ${theme.line}`} />}
        </div>
        <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: `1px solid ${theme.line}` }}>
          <ContactPanel contactItems={contactItems} theme={theme} contactStyle="inline" />
        </div>
        {summary && <div style={{ marginTop: '20px', maxWidth: '650px', color: theme.muted, lineHeight: 1.7 }}>{summary}</div>}
      </header>
      <div style={{ display: 'grid', gridTemplateColumns: hasSupportingRegion ? 'minmax(0, 1.42fr) minmax(220px, 0.82fr)' : '1fr', gap: '28px', padding: '30px 42px 38px' }}>
        <main style={{ paddingRight: '12px' }}>
          <div style={{ width: '36px', height: '3px', marginBottom: '18px', background: theme.accent }} />
          <SectionColumn sections={mainSections} theme={theme} regionKey="main" layoutEditor={layoutEditor} gap="26px" />
        </main>
        {hasSupportingRegion && (
          <aside style={{ padding: '20px 18px', borderTop: `4px solid ${theme.accent}`, background: theme.accentSoft }}>
            <SectionPanels
              sections={supportingSections}
              theme={theme}
              regionKey="supporting"
              layoutEditor={layoutEditor}
              shellStyle={{ padding: 0, background: 'transparent', border: 'none' }}
            />
          </aside>
        )}
      </div>
    </div>
  );
}
