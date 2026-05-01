// src/components/templates/Dossier.tsx
import { type CSSProperties } from 'react';
import { t } from '../../i18n';
import { useCVStore } from '../../store/cvStore';
import type { CVData } from '../../types/cv';
import { TEMPLATE_THEMES } from './templateCatalog';
import { ensureTemplateLayout, getSectionsForRegion } from './templateLayout';
import { getContactItems } from './templateUtils';
import { ContactPanel, SectionColumn, SummaryBlock, type TemplateLayoutEditor } from './templateComponents';

interface Props {
  data: CVData;
  layoutEditor?: TemplateLayoutEditor;
}

export default function Dossier({ data, layoutEditor }: Props) {
  const language = useCVStore((state) => state.language);
  const theme = TEMPLATE_THEMES['dossier'];
  const { personalInfo, sections } = data;
  const layoutState = ensureTemplateLayout('dossier', data.layoutOverride, sections);
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

  const mainSections = getSectionsForRegion(sections, layoutState, 'main');
  const sideSections = getSectionsForRegion(sections, layoutState, 'side');
  const hasSideRegion = sideSections.length > 0 || Boolean(layoutEditor);

  return (
    <div style={baseStyle}>
      <div style={{ padding: '28px 30px 28px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.12fr) minmax(240px, 0.88fr)', gap: '18px', marginBottom: '18px', padding: '18px 20px', border: `1px solid ${theme.line}`, background: '#ffffff' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '29px', lineHeight: 1.12, color: '#111111', fontWeight: 800 }}>{displayName}</h1>
            {leadRole && <div style={{ marginTop: '6px', color: theme.accent }}>{leadRole}</div>}
          </div>
          <div>
            <ContactPanel contactItems={contactItems} theme={theme} contactStyle="stack" />
          </div>
        </div>
        {summary && (
          <div style={{ marginBottom: '22px', padding: '14px 16px', borderLeft: `3px solid ${theme.accent}`, background: theme.accentSoft }}>
            <SummaryBlock summary={summary} theme={theme} />
          </div>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: hasSideRegion ? 'minmax(0, 1.46fr) minmax(210px, 0.78fr)' : '1fr', gap: '24px' }}>
          <SectionColumn sections={mainSections} theme={theme} regionKey="main" layoutEditor={layoutEditor} />
          {hasSideRegion && <SectionColumn sections={sideSections} theme={theme} regionKey="side" layoutEditor={layoutEditor} />}
        </div>
      </div>
    </div>
  );
}
