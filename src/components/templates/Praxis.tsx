import { type CSSProperties } from 'react';
import { t } from '../../i18n';
import { useCVStore } from '../../store/cvStore';
import type { CVData } from '../../types/cv';
import { TEMPLATE_THEMES } from './templateCatalog';
import { ensureTemplateLayout, getSectionsForRegion } from './templateLayout';
import { getContactItems } from './templateUtils';
import {
  ContactPanel,
  SectionColumn,
  SummaryBlock,
  type TemplateLayoutEditor,
} from './templateComponents';

interface Props {
  data: CVData;
  layoutEditor?: TemplateLayoutEditor;
}

export default function Praxis({ data, layoutEditor }: Props) {
  const language = useCVStore((state) => state.language);
  const theme = TEMPLATE_THEMES['praxis'];
  const { personalInfo, sections } = data;
  const layoutState = ensureTemplateLayout('praxis', data.layoutOverride, sections);
  const displayName = personalInfo.fullName || t(language, 'fullName');
  const contactItems = getContactItems(personalInfo, language);
  const summary = personalInfo.summary.trim();

  const baseStyle: CSSProperties = {
    fontFamily: theme.fontFamily,
    fontSize: '10.8px',
    lineHeight: '1.6',
    color: theme.text,
    background: theme.page,
    minHeight: '297mm',
  };

  const mainSections = getSectionsForRegion(sections, layoutState, 'main');
  const sideSections = getSectionsForRegion(sections, layoutState, 'side');

  return (
    <div style={{ ...baseStyle, background: '#fbfaf6' }}>
      <div style={{ height: '7px', background: `linear-gradient(90deg, ${theme.accentDark} 0 77%, ${theme.accentAlt} 77% 100%)` }} />
      <header style={{ padding: '36px 42px 26px', background: '#f4f1e9' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '22px' }}>
          <h1 style={{ minWidth: 0, margin: 0, color: theme.accentDark, fontSize: '34px', fontWeight: 700, lineHeight: 1.04, letterSpacing: '-0.025em', textTransform: 'uppercase', overflowWrap: 'anywhere' }}>{displayName}</h1>
          <span style={{ width: '54px', height: '54px', flexShrink: 0, display: 'grid', placeItems: 'center', border: `1px solid ${theme.accentAlt}` }}>
            <svg viewBox="0 0 32 32" width="29" height="29" aria-hidden="true">
              <path d="M5 8h22M5 16h22M5 24h22" fill="none" stroke={theme.accent} strokeWidth="1.4" />
              <path d="M11 5v22M21 5v22" fill="none" stroke={theme.accentAlt} strokeWidth="1" />
            </svg>
          </span>
        </div>
        <div style={{ marginTop: '15px', paddingTop: '11px', borderTop: `1px solid ${theme.line}` }}>
          <ContactPanel contactItems={contactItems} theme={theme} contactStyle="inline" />
        </div>
        {summary && (
          <div style={{ display: 'grid', gridTemplateColumns: '124px minmax(0, 1fr)', gap: '20px', marginTop: '20px', padding: '14px 16px', background: '#ffffff', borderLeft: `3px solid ${theme.accentAlt}` }}>
            <div style={{ color: theme.accent, fontSize: '9px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{t(language, 'professionalSummary')}</div>
            <div style={{ color: theme.muted, lineHeight: 1.7 }}><SummaryBlock summary={summary} theme={theme} /></div>
          </div>
        )}
      </header>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.45fr) 224px', gap: '30px', padding: '28px 42px 40px' }}>
        <main>
          <SectionColumn sections={mainSections} theme={theme} regionKey="main" layoutEditor={layoutEditor} gap="27px" />
        </main>
        <aside style={{ padding: '18px 17px', borderTop: `3px double ${theme.accent}`, borderBottom: `1px solid ${theme.line}`, background: '#f5f1e8' }}>
          <SectionColumn sections={sideSections} theme={theme} regionKey="side" layoutEditor={layoutEditor} gap="24px" />
        </aside>
      </div>
    </div>
  );
}
