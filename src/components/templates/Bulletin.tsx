import { t } from '../../i18n';
import { useCVStore } from '../../store/cvStore';
import type { CVData, CVSection } from '../../types/cv';
import ContactIcon from '../../ui/ContactIcon';
import { TEMPLATE_THEMES } from './templateCatalog';
import { ensureTemplateLayout, getSectionsForRegion } from './templateLayout';
import { getContactItems, getSkillLevelScore } from './templateUtils';
import { CustomSectionRegion, LinkedText, SectionBlockBody, type TemplateLayoutEditor } from './templateComponents';

export default function Bulletin({ data, layoutEditor }: { data: CVData; layoutEditor?: TemplateLayoutEditor }) {
  const language = useCVStore((state) => state.language);
  const theme = { ...TEMPLATE_THEMES.bulletin, fontFamily: "'Arial', 'Helvetica Neue', sans-serif", text: '#171717', muted: '#383838', line: '#1b1b1b', accent: '#090909', accentSoft: '#f0f0f0', entryStyle: 'plain' as const, sectionHeading: 'underline' as const, skillStyle: 'list' as const };
  const { personalInfo, sections } = data;
  const layout = ensureTemplateLayout('bulletin', data.layoutOverride, sections);
  const career = getSectionsForRegion(sections, layout, 'main');
  const skills = getSectionsForRegion(sections, layout, 'side');
  const lower = getSectionsForRegion(sections, layout, 'bottom');
  const name = personalInfo.fullName || t(language, 'fullName');
  const role = sections.find((section) => section.type === 'experience')?.entries.map((entry) => entry.fields.position?.trim()).find(Boolean) ?? '';
  const contacts = getContactItems(personalInfo, language);
  const contactRow = (item: typeof contacts[number]) => <div key={item.key} style={{ display: 'flex', alignItems: 'center', gap: 9, marginTop: 5, fontSize: 11.5, lineHeight: 1.35 }}><ContactIcon name={item.icon} style={{ width: 17, height: 17, flexShrink: 0 }} /><LinkedText href={item.href}>{item.value}</LinkedText></div>;

  return (
    <div style={{ minHeight: '297mm', padding: '35px 43px 42px', background: '#fff', color: '#171717', fontFamily: "Arial, 'Helvetica Neue', sans-serif", fontSize: 10.5, lineHeight: 1.65 }}>
      <header style={{ position: 'relative', minHeight: 171, margin: '-35px -43px 18px', padding: '42px 43px 21px', overflow: 'hidden', background: '#fff' }}>
        <svg aria-hidden="true" viewBox="0 0 360 180" style={{ position: 'absolute', top: 0, right: 0, width: 360, height: 180 }}>
          <path d="M108 0h110l-58 79H59Z" fill="#bcbcbc" />
          <path d="M216 0h144l-99 180H116Z" fill="#0b0707" />
        </svg>
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '72%' }}>
          <h1 style={{ margin: 0, color: '#090909', fontSize: 32, fontWeight: 800, lineHeight: 1.12, letterSpacing: '-.035em', textTransform: 'uppercase', overflowWrap: 'anywhere' }}>{name}</h1>
          {role && <div style={{ marginTop: 4, color: '#111', fontSize: 16, lineHeight: 1.35 }}>{role}</div>}
          <div style={{ marginTop: 7 }}>{contacts.map(contactRow)}</div>
        </div>
      </header>

      {personalInfo.summary.trim() && <section style={{ margin: '0 0 24px', paddingBottom: 18, borderBottom: '4px solid #151515' }}>
        <h2 style={fullHeading}>{t(language, 'profile')}</h2>
        <p style={{ margin: 0, fontSize: 12, lineHeight: 1.7 }}>{personalInfo.summary.trim()}</p>
      </section>}

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.22fr) minmax(225px,.78fr)', gap: 34, alignItems: 'start' }}>
        <CustomSectionRegion sections={career} regionKey="main" layoutEditor={layoutEditor} gap="22px" renderSection={(section) => <DispatchSection section={section} theme={theme} />} />
        <CustomSectionRegion sections={skills} regionKey="side" layoutEditor={layoutEditor} gap="19px" renderSection={(section) => section.type === 'skills' ? <SkillMeterSection section={section} /> : <DispatchSection section={section} theme={theme} />} />
      </div>

      {lower.length > 0 && <div style={{ marginTop: 28, paddingTop: 20, borderTop: '1px solid #d1d1d1' }}>
        <CustomSectionRegion sections={lower} regionKey="bottom" layoutEditor={layoutEditor} gap="19px" renderSection={(section) => <DispatchSection section={section} theme={theme} />} />
      </div>}
    </div>
  );
}

function DispatchSection({ section, theme }: { section: CVSection; theme: typeof TEMPLATE_THEMES.bulletin }) {
  return <section>
    <h2 style={sectionHeading}>{section.title}</h2>
    <SectionBlockBody section={section} theme={{ ...theme, skillStyle: 'list' }} />
  </section>;
}

function SkillMeterSection({ section }: { section: CVSection }) {
  return <section>
    <h2 style={sectionHeading}>{section.title}</h2>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {section.entries.map((entry) => {
        const score = getSkillLevelScore(entry.fields.level || '');
        return <div key={entry.id}>
          <div style={{ marginBottom: 3, color: '#242424', fontSize: 11.5 }}>{entry.fields.name || entry.fields.title}</div>
          {score > 0 && <div role="meter" aria-label={`${entry.fields.name || entry.fields.title} proficiency`} aria-valuemin={0} aria-valuemax={5} aria-valuenow={score} style={{ display: 'flex', gap: 2 }}>
            {Array.from({ length: 15 }).map((_, index) => <span key={index} style={{ width: 6, height: 6, flex: '0 0 6px', background: index < Math.round(score * 3) ? '#100b0b' : '#d9d9d9' }} />)}
          </div>}
        </div>;
      })}
    </div>
  </section>;
}

const fullHeading = { margin: '0 0 8px', paddingBottom: 4, borderBottom: '4px solid #171717', color: '#151515', fontSize: 17, fontWeight: 800, lineHeight: 1.25, textTransform: 'uppercase' as const };
const sectionHeading = { ...fullHeading, marginBottom: 11, fontSize: 16 };
