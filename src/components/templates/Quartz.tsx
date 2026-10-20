import { t } from '../../i18n';
import { useCVStore } from '../../store/cvStore';
import type { CVData } from '../../types/cv';
import { TEMPLATE_THEMES } from './templateCatalog';
import { ensureTemplateLayout, getSectionsForRegion } from './templateLayout';
import { getContactItems, getResumeRole } from './templateUtils';
import { ContactPanel, PhotoFrame, SectionColumn, SummaryBlock, type TemplateLayoutEditor } from './templateComponents';

export default function Quartz({ data, layoutEditor }: { data: CVData; layoutEditor?: TemplateLayoutEditor }) {
  const language = useCVStore((state) => state.language);
  const { personalInfo, sections } = data;
  const theme = {
    ...TEMPLATE_THEMES.quartz,
    fontFamily: "'Segoe UI', Arial, sans-serif",
    page: '#ffffff',
    text: '#172a35',
    muted: '#536671',
    line: '#d5e0e5',
    accent: '#087e8b',
    accentAlt: '#37b6b0',
    accentSoft: '#eaf3f5',
    accentDark: '#102a36',
    sidebarBg: '#f2f6f8',
    sidebarText: '#172a35',
    sectionHeading: 'bar' as const,
    entryStyle: 'plain' as const,
    skillStyle: 'bars' as const,
    languageStyle: 'words' as const,
  };
  const layout = ensureTemplateLayout('quartz', data.layoutOverride, sections);
  const mainSections = getSectionsForRegion(sections, layout, 'main');
  const sideSections = getSectionsForRegion(sections, layout, 'side');
  const contacts = getContactItems(personalInfo, language);
  const name = personalInfo.fullName || t(language, 'fullName');
  const role = getResumeRole(personalInfo);
  const summary = personalInfo.summary.trim();

  return (
    <div style={{ minHeight: '297mm', boxSizing: 'border-box', padding: '0 35px 40px', background: '#fff', color: theme.text, fontFamily: theme.fontFamily, fontSize: '10.5px', lineHeight: 1.55 }}>
      <div style={{ height: 5, margin: '0 -35px', background: 'linear-gradient(90deg,#087e8b 0 72%,#36b5b0 72% 100%)' }} />
      <header style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) auto', gap: 22, alignItems: 'center', padding: '26px 0 20px', borderBottom: '1px solid #cbd8de' }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7, color: '#087e8b', fontSize: 8, fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase' }}>
            <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
              <path d="m10 1.8 7.5 4.3v7.8L10 18.2l-7.5-4.3V6.1L10 1.8Z" />
              <path d="m6.5 7 3.5 2 3.5-2M10 9v4" />
            </svg>
            <span>{t(language, 'profile')}</span>
          </div>
          <h1 style={{ margin: 0, color: '#172a35', fontSize: 32, fontWeight: 700, letterSpacing: '-.04em', lineHeight: 1.05, overflowWrap: 'anywhere' }}>{name}</h1>
          {role && <div style={{ marginTop: 6, color: '#536671', fontSize: 12, fontWeight: 550, letterSpacing: '.04em' }}>{role}</div>}
        </div>
        {personalInfo.photo && <div style={{ position: 'relative', padding: 4, border: '1px solid #a8c7cc', background: '#edf5f6' }}>
          <span style={{ position: 'absolute', top: -4, right: -4, width: 13, height: 13, borderTop: '2px solid #087e8b', borderRight: '2px solid #087e8b' }} />
          <PhotoFrame photo={personalInfo.photo} size={70} radius="1px" border="none" />
        </div>}
      </header>

      {contacts.length > 0 && <div style={{ padding: '10px 0 9px', borderBottom: '1px solid #d5e0e5' }}>
        <ContactPanel contactItems={contacts} theme={theme} contactStyle="inline" />
      </div>}

      {summary && <section style={{ display: 'grid', gridTemplateColumns: '112px minmax(0,1fr)', gap: 16, alignItems: 'start', margin: '19px 0 22px', padding: '13px 16px', background: '#f2f6f8', borderLeft: '3px solid #087e8b' }}>
        <h2 style={{ margin: '2px 0 0', color: '#087e8b', fontSize: 9, fontWeight: 700, letterSpacing: '.16em', textTransform: 'uppercase' }}>{t(language, 'profile')}</h2>
        <SummaryBlock summary={summary} theme={theme} />
      </section>}

      <div style={{ display: 'grid', gridTemplateColumns: '218px minmax(0,1fr)', gap: 27, marginTop: summary ? 0 : 20 }}>
        <aside style={{ minWidth: 0, padding: '18px 17px 22px', background: '#f2f6f8', borderTop: '2px solid #087e8b' }}>
          <SectionColumn sections={sideSections} theme={theme} regionKey="side" layoutEditor={layoutEditor} gap="21px" />
        </aside>
        <main style={{ minWidth: 0, padding: '3px 0 0 19px', borderLeft: '1px solid #d5e0e5' }}>
          <SectionColumn sections={mainSections} theme={theme} regionKey="main" layoutEditor={layoutEditor} gap="24px" />
        </main>
      </div>
    </div>
  );
}
