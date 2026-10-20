import { t } from '../../i18n';
import { useCVStore } from '../../store/cvStore';
import type { CVData } from '../../types/cv';
import ContactIcon from '../../ui/ContactIcon';
import { TEMPLATE_THEMES } from './templateCatalog';
import { ensureTemplateLayout, getSectionsForRegion } from './templateLayout';
import { getContactItems, getResumeRole } from './templateUtils';
import { LinkedText, PhotoFrame, SectionColumn, SummaryBlock, type TemplateLayoutEditor } from './templateComponents';

export default function North({ data, layoutEditor }: { data: CVData; layoutEditor?: TemplateLayoutEditor }) {
  const language = useCVStore((state) => state.language);
  const theme = { ...TEMPLATE_THEMES.north, fontFamily: "Arial, 'Helvetica Neue', sans-serif", accent: '#303030', accentSoft: '#efefef', entryStyle: 'plain' as const, skillStyle: 'parallelogram' as const, languageStyle: 'parallelogram' as const };
  const { personalInfo, sections } = data;
  const layout = ensureTemplateLayout('north', data.layoutOverride, sections);
  const mainSections = getSectionsForRegion(sections, layout, 'main');
  const sideSections = getSectionsForRegion(sections, layout, 'sidebar');
  const name = personalInfo.fullName || t(language, 'fullName');
  const role = getResumeRole(personalInfo);
  const contacts = getContactItems(personalInfo, language);
  const core = contacts.filter((item) => item.type === 'core');
  const socials = contacts.filter((item) => item.type === 'social');
  const summary = personalInfo.summary.trim();

  const contactRow = (item: typeof contacts[number]) => (
    <div key={item.key} style={{ display: 'grid', gridTemplateColumns: '22px minmax(0,1fr)', gap: 9, alignItems: 'start', margin: '0 0 8px', color: '#444', fontSize: 9.5, lineHeight: 1.5 }}>
      <span style={{ display: 'grid', placeItems: 'center', width: 20, height: 20, background: '#303030', color: '#fff' }}><ContactIcon name={item.icon} style={{ width: 12, height: 12 }} /></span>
      <LinkedText href={item.href} style={{ overflowWrap: 'anywhere' }}>{item.value}</LinkedText>
    </div>
  );

  return (
    <div style={{ minHeight: '297mm', padding: '31px 36px 42px', background: '#fff', color: '#353535', fontFamily: "Arial, 'Helvetica Neue', sans-serif", fontSize: 10, lineHeight: 1.55 }}>
      <header style={{ display: 'grid', gridTemplateColumns: personalInfo.photo ? 'minmax(0,1fr) 106px' : 'minmax(0,1fr)', gap: 22, alignItems: 'center', padding: '7px 0 21px', borderBottom: '2px solid #383838' }}>
        <div>
          <h1 style={{ margin: 0, color: '#363636', fontSize: 31, fontWeight: 400, lineHeight: 1.05, letterSpacing: '.12em', textTransform: 'uppercase', overflowWrap: 'anywhere' }}>{name}</h1>
          {role && <div style={{ marginTop: 7, color: '#444', fontSize: 11, fontWeight: 600, letterSpacing: '.2em', textTransform: 'uppercase' }}>{role}</div>}
        </div>
        {personalInfo.photo && <div style={{ justifySelf: 'end' }}><PhotoFrame photo={personalInfo.photo} size={102} radius="50%" border="1px solid #595959" /></div>}
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '160px minmax(0,1fr)', gap: 27, marginTop: 22 }}>
        <aside style={{ paddingRight: 17, borderRight: '1px solid #444' }}>
          <h2 style={sideHeading}>{t(language, 'contact')}</h2>
          {core.map(contactRow)}
          {socials.length > 0 && <section style={{ marginTop: 25 }}><h2 style={sideHeading}>Links</h2>{socials.map(contactRow)}</section>}
          <section style={{ marginTop: 25 }}><SectionColumn sections={sideSections} theme={theme} regionKey="sidebar" layoutEditor={layoutEditor} gap="23px" /></section>
        </aside>
        <main style={{ minWidth: 0 }}>
          {summary && <section style={{ marginBottom: 22, paddingBottom: 16, borderBottom: '1px solid #555' }}><h2 style={mainHeading}>About Me</h2><SummaryBlock summary={summary} theme={theme} /></section>}
          <SectionColumn sections={mainSections} theme={theme} regionKey="main" layoutEditor={layoutEditor} gap="23px" />
        </main>
      </div>
      <div style={{ marginTop: 24, borderTop: '1px solid #444' }} />
    </div>
  );
}

const sideHeading = { margin: '0 0 11px', color: '#343434', fontSize: 10, fontWeight: 800, letterSpacing: '.16em', textTransform: 'uppercase' as const };
const mainHeading = { margin: '0 0 10px', color: '#333', fontSize: 13, fontWeight: 800, letterSpacing: '.04em', textTransform: 'uppercase' as const };
