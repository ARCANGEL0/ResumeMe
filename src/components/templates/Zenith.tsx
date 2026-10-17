import { t } from '../../i18n';
import { useCVStore } from '../../store/cvStore';
import type { CVData, CVSection } from '../../types/cv';
import { TEMPLATE_THEMES } from './templateCatalog';
import { ensureTemplateLayout, getSectionsForRegion } from './templateLayout';
import { getContactItems, getEntryDate, getEntryDetailLines, getEntrySubtitle, getEntryTitle } from './templateUtils';
import { ContactPanel, CustomSectionRegion, PhotoFrame, SectionBlockBody, SummaryBlock, type TemplateLayoutEditor } from './templateComponents';

export default function Zenith({ data, layoutEditor }: { data: CVData; layoutEditor?: TemplateLayoutEditor }) {
  const language = useCVStore((state) => state.language);
  const theme = { ...TEMPLATE_THEMES.zenith, entryStyle: 'plain' as const, skillStyle: 'list' as const, languageStyle: 'words' as const };
  const { personalInfo, sections } = data;
  const layout = ensureTemplateLayout('zenith', data.layoutOverride, sections);
  const career = getSectionsForRegion(sections, layout, 'lead');
  const essentials = getSectionsForRegion(sections, layout, 'support');
  const name = personalInfo.fullName || t(language, 'fullName');
  const contacts = getContactItems(personalInfo, language);
  const summary = personalInfo.summary.trim();

  const renderSection = (section: CVSection) => (
    <WaypointSection key={section.id} section={section} theme={theme} />
  );

  return (
    <div style={{ minHeight: '297mm', background: '#fff', color: '#1a1a1a', fontFamily: 'Arial, sans-serif', fontSize: '10.7px', lineHeight: 1.65 }}>
      <header style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 130px', gap: 24, alignItems: 'center', padding: '28px 42px 19px', borderTop: '4px solid #171717' }}>
        <div style={{ minWidth: 0 }}>
          <h1 style={{ margin: 0, color: '#171717', fontSize: 37, fontWeight: 650, lineHeight: 1.02, letterSpacing: '-.05em', overflowWrap: 'anywhere' }}>{name}</h1>
          {contacts.length > 0 && <div style={{ marginTop: 13 }}><ContactPanel contactItems={contacts} theme={theme} contactStyle="inline" /></div>}
        </div>
        {personalInfo.photo && <div style={{ justifySelf: 'end' }}><PhotoFrame photo={personalInfo.photo} size={92} radius="50%" border="2px solid #ddd" /></div>}
      </header>
      {summary && <section style={{ margin: '0 42px 25px', padding: '15px 19px', background: '#f5f5f5', color: '#444' }}>
        <div style={{ marginBottom: 6, color: '#777', fontSize: 8, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase' }}>{t(language, 'profile')}</div><SummaryBlock summary={summary} theme={theme} />
      </section>}
      <main style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 210px', gap: 31, padding: '8px 42px 42px' }}>
        <section style={{ minWidth: 0, paddingRight: 18 }}>
          <CustomSectionRegion sections={career} regionKey="lead" layoutEditor={layoutEditor} gap="25px" renderSection={renderSection} />
        </section>
        <aside style={{ minWidth: 0, padding: '13px 13px 16px', background: '#f5f5f5' }}>
          <CustomSectionRegion sections={essentials} regionKey="support" layoutEditor={layoutEditor} gap="22px" renderSection={renderSection} />
        </aside>
      </main>
    </div>
  );
}

function WaypointSection({ section, theme }: { section: CVSection; theme: typeof TEMPLATE_THEMES.zenith }) {
  const headingStyle = { margin: '0 0 11px', color: '#25282b', fontSize: 11, fontWeight: 800, letterSpacing: '.12em', lineHeight: 1.3, textTransform: 'uppercase' as const, paddingBottom: 7, borderBottom: '1px solid #c8c8c8' };
  if (section.type === 'skills' || section.type === 'languages') {
    return <section><h2 style={headingStyle}>{section.title}</h2><SectionBlockBody section={section} theme={theme} /></section>;
  }

  return (
    <section>
      <h2 style={headingStyle}>{section.title}</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {section.entries.map((entry, entryIndex) => {
          const date = getEntryDate(entry);
          const details = getEntryDetailLines(entry);
          const subtitle = getEntrySubtitle(entry);
          return (
            <article key={entry.id} style={{ display: 'grid', gridTemplateColumns: 'minmax(55px, 72px) minmax(0,1fr)', gap: 10, alignItems: 'start', minWidth: 0 }}>
              <div style={{ padding: '5px 6px', background: '#f0f0f0', color: '#4a4a4a', fontSize: 8.5, fontWeight: 700, lineHeight: 1.3, textAlign: 'center', overflowWrap: 'anywhere' }}>{date || `ENTRY ${String(entryIndex + 1).padStart(2, '0')}`}</div>
              <div style={{ minWidth: 0, overflowWrap: 'anywhere' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'baseline', minWidth: 0 }}><strong style={{ minWidth: 0, color: '#202020', fontSize: 11, overflowWrap: 'anywhere' }}>{getEntryTitle(entry)}</strong></div>
                {subtitle && <div style={{ marginTop: 2, color: '#333', fontWeight: 600 }}>{subtitle}</div>}
                {details.length > 0 && <ul style={{ margin: '6px 0 0 15px', padding: 0, color: '#555' }}>{details.map((detail) => <li key={detail} style={{ marginBottom: 3 }}>{detail}</li>)}</ul>}
                {entry.fields.url && <a href={entry.fields.url} target="_blank" rel="noreferrer" style={{ display: 'block', maxWidth: '100%', minWidth: 0, marginTop: 5, color: '#444', textDecoration: 'underline', overflowWrap: 'anywhere', wordBreak: 'break-word' }}>{entry.fields.url}</a>}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
