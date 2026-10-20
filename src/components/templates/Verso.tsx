import { t } from '../../i18n';
import { useCVStore } from '../../store/cvStore';
import type { CVData } from '../../types/cv';
import { TEMPLATE_THEMES } from './templateCatalog';
import { ensureTemplateLayout, getSectionsForRegion } from './templateLayout';
import { getContactItems, getResumeRole } from './templateUtils';
import { ContactPanel, PhotoFrame, SectionColumn, SummaryBlock, type TemplateLayoutEditor } from './templateComponents';

export default function Verso({ data, layoutEditor }: { data: CVData; layoutEditor?: TemplateLayoutEditor }) {
  const language = useCVStore((state) => state.language);
  const { personalInfo, sections } = data;
  const theme = {
    ...TEMPLATE_THEMES.verso,
    fontFamily: "'Segoe UI', Arial, sans-serif",
    page: '#ffffff',
    text: '#172b36',
    muted: '#536773',
    line: '#d3dfe4',
    accent: '#087f8c',
    accentAlt: '#35b5b2',
    accentSoft: '#eaf3f5',
    accentDark: '#102b37',
    sidebarBg: '#f1f6f8',
    sidebarText: '#172b36',
    sectionHeading: 'bar' as const,
    entryStyle: 'plain' as const,
    skillStyle: 'micro-bars' as const,
    languageStyle: 'words' as const,
  };
  const layout = ensureTemplateLayout('verso', data.layoutOverride, sections);
  const mainSections = getSectionsForRegion(sections, layout, 'main');
  const sideSections = getSectionsForRegion(sections, layout, 'side');
  const contacts = getContactItems(personalInfo, language);
  const role = getResumeRole(personalInfo);
  const summary = personalInfo.summary.trim();
  const name = personalInfo.fullName || t(language, 'fullName');

  return (
    <div style={{ minHeight: '297mm', boxSizing: 'border-box', padding: '0 34px 38px', background: '#fff', color: theme.text, fontFamily: theme.fontFamily, fontSize: '10.5px', lineHeight: 1.55 }}>
      <header style={{ position: 'relative', display: 'grid', gridTemplateColumns: personalInfo.photo ? 'minmax(0,1fr) 76px' : 'minmax(0,1fr)', gap: 24, alignItems: 'center', margin: '0 -34px 0', padding: '20px 34px 15px', color: '#f5f8fa', background: '#142832', borderBottom: '5px solid #29a8a5' }}>
        <div style={{ position: 'absolute', inset: '0 0 auto auto', width: 190, height: 75, opacity: .16, pointerEvents: 'none' }}>
          <svg viewBox="0 0 190 75" width="100%" height="100%" aria-hidden="true">
            <path d="M70 0h120l-43 75H27L70 0Zm-38 0H0v75h27L70 0" fill="none" stroke="#62d2cf" strokeWidth="1" />
            <path d="M85 0 42 75m69-75L68 75m69-75-43 75m69-75-43 75" stroke="#62d2cf" strokeWidth=".7" />
          </svg>
        </div>
        <div style={{ position: 'relative', minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <svg viewBox="0 0 28 28" width="24" height="24" fill="none" stroke="#55c7c1" strokeWidth="1.5" aria-hidden="true">
              <path d="m14 2 10 6v12l-10 6L4 20V8l10-6Z" />
              <path d="M9 14h10M14 9v10M6 8l8 5 8-5" />
            </svg>
            <span style={{ color: '#70c9c6', fontSize: 8, fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase' }}>{t(language, 'profile')}</span>
          </div>
          <h1 style={{ margin: 0, color: '#f8fbfc', fontSize: 31, fontWeight: 650, letterSpacing: '-.035em', lineHeight: 1.05, overflowWrap: 'anywhere' }}>{name}</h1>
          {role && <div style={{ marginTop: 6, color: '#c0d1d7', fontSize: 12, fontWeight: 500, letterSpacing: '.045em' }}>{role}</div>}
        </div>
        {personalInfo.photo && <div style={{ position: 'relative', justifySelf: 'end' }}><PhotoFrame photo={personalInfo.photo} size={70} radius="4px" border="1px solid #55c7c1" /></div>}
      </header>

      {contacts.length > 0 && <div style={{ padding: '11px 2px 10px', borderBottom: '1px solid #d3dfe4' }}>
        <ContactPanel contactItems={contacts} theme={theme} contactStyle="inline" />
      </div>}

      {summary && <section style={{ display: 'grid', gridTemplateColumns: '124px minmax(0,1fr)', gap: 18, alignItems: 'start', margin: '19px 0 22px', padding: '13px 16px', background: '#f1f6f8', borderLeft: '3px solid #087f8c' }}>
        <h2 style={{ margin: '2px 0 0', color: '#087f8c', fontSize: 9, fontWeight: 700, letterSpacing: '.17em', textTransform: 'uppercase' }}>{t(language, 'profile')}</h2>
        <SummaryBlock summary={summary} theme={theme} />
      </section>}

      <div style={{ display: 'grid', gridTemplateColumns: '205px minmax(0,1fr)', gap: 27, marginTop: summary ? 0 : 21 }}>
        <aside style={{ minWidth: 0, padding: '18px 17px 22px', background: '#f1f6f8', borderTop: '2px solid #087f8c' }}>
          <SectionColumn sections={sideSections} theme={theme} regionKey="side" layoutEditor={layoutEditor} gap="21px" />
        </aside>
        <main style={{ minWidth: 0, padding: '3px 0 0 18px', borderLeft: '1px solid #d3dfe4' }}>
          <SectionColumn sections={mainSections} theme={theme} regionKey="main" layoutEditor={layoutEditor} gap="24px" />
        </main>
      </div>
    </div>
  );
}
