import { t } from '../../i18n';
import { useCVStore } from '../../store/cvStore';
import type { CVData } from '../../types/cv';
import { TEMPLATE_THEMES } from './templateCatalog';
import { ensureTemplateLayout, getSectionsForRegion } from './templateLayout';
import { getContactItems } from './templateUtils';
import { ContactPanel, PhotoFrame, SectionColumn, SummaryBlock, type TemplateLayoutEditor } from './templateComponents';

export default function Editorial({ data, layoutEditor }: { data: CVData; layoutEditor?: TemplateLayoutEditor }) {
  const language = useCVStore((state) => state.language);
  const theme = { ...TEMPLATE_THEMES.editorial, entryStyle: 'plain' as const };
  const { personalInfo, sections } = data;
  const layout = ensureTemplateLayout('editorial', data.layoutOverride, sections);
  const leftSections = getSectionsForRegion(sections, layout, 'left');
  const middleSections = getSectionsForRegion(sections, layout, 'middle');
  const rightSections = getSectionsForRegion(sections, layout, 'right');
  const name = personalInfo.fullName || t(language, 'fullName');
  const role = sections.find((section) => section.type === 'experience')?.entries.map((entry) => entry.fields.position?.trim()).find(Boolean) ?? '';
  const summary = personalInfo.summary.trim();
  const contacts = getContactItems(personalInfo, language);

  return (
    <div style={{ minHeight: '297mm', padding: '27px 31px 38px', background: '#fff', color: '#383838', fontFamily: "'Arial', sans-serif", fontSize: 10, lineHeight: 1.6 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '225px minmax(0,1fr)', gap: 25, alignItems: 'start' }}>
        <aside>
          <header style={{ padding: '20px 17px 18px', border: '1px solid #999', borderRadius: 13, textAlign: 'center', background: '#f3f3f2' }}>
            {personalInfo.photo ? <PhotoFrame photo={personalInfo.photo} size={92} /> : <div style={{ width: 92, height: 92, margin: '0 auto', borderRadius: '50%', background: '#dedede' }} />}
            <h1 style={{ margin: '12px 0 0', color: '#333', fontSize: 22, lineHeight: 1.08, fontWeight: 500 }}>{name}</h1>
            {role && <div style={{ marginTop: 6, color: '#666', fontSize: 11 }}>{role}</div>}
          </header>
          <section style={{ marginTop: 17, padding: '17px 16px', border: '1px solid #aaa', borderRadius: 13 }}>
            <h2 style={labelStyle}>{t(language, 'contact')}</h2><ContactPanel contactItems={contacts} theme={theme} contactStyle="stack" />
            <div style={{ marginTop: 22 }}><SectionColumn sections={leftSections} theme={theme} regionKey="left" layoutEditor={layoutEditor} gap="22px" /></div>
          </section>
        </aside>
        <main style={{ minWidth: 0 }}>
          {summary && <section style={{ marginBottom: 22, padding: '4px 0 17px', borderBottom: '1px solid #aaa' }}>
            <h2 style={labelStyle}>{t(language, 'profile')}</h2>
            <SummaryBlock summary={summary} theme={theme} />
          </section>}
          <div style={{ marginBottom: 24, padding: '4px 0 3px' }}><SectionColumn sections={rightSections} theme={theme} regionKey="right" layoutEditor={layoutEditor} gap="22px" /></div>
          <div style={{ paddingLeft: 17, borderLeft: '2px solid #b8b8b8' }}><SectionColumn sections={middleSections} theme={theme} regionKey="middle" layoutEditor={layoutEditor} gap="26px" /></div>
        </main>
      </div>
    </div>
  );
}

const labelStyle = { margin: '0 0 9px', color: '#4e5152', fontSize: 10, fontWeight: 700, letterSpacing: '.14em', lineHeight: 1.3, textTransform: 'uppercase' as const };
