// src/components/templates/Slate.tsx
import { type CSSProperties } from 'react';
import { t } from '../../i18n';
import { useCVStore } from '../../store/cvStore';
import type { CVData } from '../../types/cv';
import { TEMPLATE_THEMES } from './templateCatalog';
import { ensureTemplateLayout, getSectionsForRegion } from './templateLayout';
import { getContactItems } from './templateUtils';
import { ContactPanel, PhotoFrame, SectionColumn, SummaryBlock, type TemplateLayoutEditor } from './templateComponents';

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
    <div style={{ ...baseStyle, display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 228px' }}>
      <main style={{ padding: '42px 36px 40px 42px' }}>
        <header style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', paddingBottom: '22px', borderBottom: `2px solid ${theme.accent}` }}>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ marginBottom: '12px', color: theme.accent, fontSize: '9px', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase' }}>Slate / Career Record</div>
            <h1 style={{ margin: 0, color: theme.accentDark, fontSize: '38px', fontWeight: 700, lineHeight: 1.02, letterSpacing: '-0.04em', overflowWrap: 'anywhere' }}>{displayName}</h1>
          </div>
          {personalInfo.photo && <PhotoFrame photo={personalInfo.photo} size={72} radius="3px" border={`2px solid ${theme.line}`} />}
        </header>
        {summary && (
          <div style={{ margin: '22px 0 28px', padding: '15px 18px', borderLeft: `3px solid ${theme.accentAlt}`, background: theme.accentSoft, color: theme.muted, lineHeight: 1.72 }}>
            <SummaryBlock summary={summary} theme={theme} />
          </div>
        )}
        <SectionColumn sections={mainSections} theme={theme} regionKey="main" layoutEditor={layoutEditor} gap="27px" />
      </main>
      <aside style={{ padding: '34px 20px 32px', background: theme.sidebarBg, color: theme.sidebarText, borderLeft: `4px solid ${theme.accent}` }}>
        <div style={{ marginBottom: '11px', color: theme.accentAlt, fontSize: '9px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase' }}>{t(language, 'contact')}</div>
        <ContactPanel contactItems={contactItems} theme={theme} onDark contactStyle="stack" />
        <div style={{ width: '36px', height: '1px', margin: '24px 0', background: 'rgba(255,255,255,0.3)' }} />
        <SectionColumn sections={sidebarSections} theme={theme} onDark regionKey="sidebar" layoutEditor={layoutEditor} gap="24px" />
      </aside>
    </div>
  );
}
