import { t } from '../../i18n';
import { useCVStore } from '../../store/cvStore';
import type { CVData } from '../../types/cv';
import { TEMPLATE_THEMES } from './templateCatalog';
import { ensureTemplateLayout, getSectionsForRegion } from './templateLayout';
import { getContactItems } from './templateUtils';
import { ContactPanel, SectionColumn, SummaryBlock, type TemplateLayoutEditor } from './templateComponents';

export default function Summit({ data, layoutEditor }: { data: CVData; layoutEditor?: TemplateLayoutEditor }) {
  const language = useCVStore((state) => state.language);
  const theme = { ...TEMPLATE_THEMES.summit, entryStyle: 'plain' as const, accent: '#161616', accentSoft: '#ededed' };
  const { personalInfo, sections } = data;
  const layout = ensureTemplateLayout('summit', data.layoutOverride, sections);
  const mainSections = getSectionsForRegion(sections, layout, 'main');
  const sideSections = getSectionsForRegion(sections, layout, 'side');
  const name = personalInfo.fullName || t(language, 'fullName');
  const role = sections.find((section) => section.type === 'experience')?.entries
    .map((entry) => entry.fields.position?.trim()).find(Boolean) ?? '';
  const contacts = getContactItems(personalInfo, language);

  return (
    <div style={{ minHeight: '297mm', display: 'grid', gridTemplateColumns: '184px minmax(0,1fr)', background: '#fff', color: '#202020', fontFamily: "'Arial', 'Helvetica Neue', sans-serif", fontSize: '10.5px', lineHeight: 1.55 }}>
      <aside style={{ minHeight: '297mm', padding: '24px 17px 32px', background: '#f0f0f0', borderRight: '1px solid #d0d0d0' }}>
        <div aria-label="Cube mark" style={{ width: 38, height: 38, marginBottom: 23, color: '#161616' }}>
          <svg viewBox="0 0 40 40" role="img" aria-hidden="true" style={{ width: '100%', height: '100%' }}>
            <path d="M20 3 36 12v16L20 37 4 28V12L20 3Z" fill="none" stroke="currentColor" strokeWidth="2.6" />
            <path d="m4.7 12.5 15.3 9 15.3-9M20 21.5V37M12.3 7.4l15.4 9v9.3" fill="none" stroke="currentColor" strokeWidth="2.2" />
          </svg>
        </div>
        <div style={{ marginBottom: 20, fontSize: 8, fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase', color: '#555' }}>{t(language, 'contact')}</div>
        <ContactPanel contactItems={contacts} theme={theme} contactStyle="stack" />
        <div style={{ marginTop: 28, paddingTop: 18, borderTop: '1px solid #c7c7c7' }}>
          <SectionColumn sections={sideSections} theme={theme} regionKey="side" layoutEditor={layoutEditor} gap="21px" />
        </div>
      </aside>
      <main style={{ minWidth: 0, padding: '29px 30px 38px' }}>
        <header style={{ padding: '0 0 18px', borderBottom: '1px solid #bcbcbc' }}>
          <div style={{ color: '#666', fontSize: 9, fontWeight: 700, letterSpacing: '.19em', textTransform: 'uppercase' }}>Technology professional</div>
          <h1 style={{ margin: '8px 0 3px', color: '#111', fontSize: 33, fontWeight: 750, lineHeight: 1.02, letterSpacing: '-.035em', overflowWrap: 'anywhere' }}>{name}</h1>
          {role && <div style={{ color: '#444', fontSize: 13, fontWeight: 600 }}>{role}</div>}
        </header>
        {personalInfo.summary.trim() && <section style={{ margin: '17px 0 21px', padding: '11px 13px', background: '#e8e8e8' }}>
          <div style={{ marginBottom: 5, color: '#343434', fontSize: 9, fontWeight: 700, letterSpacing: '.15em', textTransform: 'uppercase' }}>{t(language, 'profile')}</div>
          <SummaryBlock summary={personalInfo.summary.trim()} theme={theme} />
        </section>}
        <SectionColumn sections={mainSections} theme={theme} regionKey="main" layoutEditor={layoutEditor} gap="20px" />
      </main>
    </div>
  );
}
