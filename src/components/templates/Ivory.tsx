import { t } from '../../i18n';
import { useCVStore } from '../../store/cvStore';
import type { CVData, CVSection } from '../../types/cv';
import { TEMPLATE_THEMES } from './templateCatalog';
import { ensureTemplateLayout, getSectionsForRegion } from './templateLayout';
import { getContactItems } from './templateUtils';
import { ContactPanel, CustomSectionRegion, PhotoFrame, SectionBlockBody, SummaryBlock, type TemplateLayoutEditor } from './templateComponents';

export default function Ivory({ data, layoutEditor }: { data: CVData; layoutEditor?: TemplateLayoutEditor }) {
  const language = useCVStore((state) => state.language);
  const theme = { ...TEMPLATE_THEMES.ivory, fontFamily: "'Courier New', Courier, monospace", page: '#fff', text: '#363636', muted: '#6f6f6f', line: '#999', accent: '#858585', accentSoft: '#f5f5f5', entryStyle: 'plain' as const, skillStyle: 'list' as const, languageStyle: 'words' as const };
  const { personalInfo, sections } = data;
  const layout = ensureTemplateLayout('ivory', data.layoutOverride, sections);
  const orderedSections = [...getSectionsForRegion(sections, layout, 'main'), ...getSectionsForRegion(sections, layout, 'side')];
  const name = personalInfo.fullName || t(language, 'fullName');
  const summary = personalInfo.summary.trim();
  const contacts = getContactItems(personalInfo, language);

  const sectionRow = (section: CVSection) => (
    <div style={{ display: 'grid', gridTemplateColumns: '155px minmax(0,1fr)', gap: 20, alignItems: 'start' }}>
      <h2 style={{ margin: 0, paddingTop: 2, color: '#858585', fontFamily: 'Georgia, serif', fontVariant: 'small-caps', fontSize: 15, letterSpacing: '.045em' }}>{section.title}</h2>
      <div style={{ minWidth: 0, paddingTop: 13, borderTop: '1px solid #888' }}><SectionBlockBody section={section} theme={theme} /></div>
    </div>
  );

  return (
    <div style={{ minHeight: '297mm', padding: '28px 37px 42px', background: '#fff', color: '#454545', fontFamily: "'Courier New', Courier, monospace", fontSize: 10.7, lineHeight: 1.72 }}>
      <header style={{ display: 'grid', gridTemplateColumns: '92px minmax(0,1fr)', gap: 20, alignItems: 'center', paddingBottom: 18 }}>
        <div style={{ display: 'grid', placeItems: 'center', width: 84, height: 84, borderRadius: '50%', background: '#f1f1f1', overflow: 'hidden' }}>
          {personalInfo.photo ? <PhotoFrame photo={personalInfo.photo} size={84} /> : <svg viewBox="0 0 84 84" aria-hidden="true" style={{ width: 84, height: 84 }}><circle cx="42" cy="27" r="15" fill="#d7d7d7" /><path d="M12 72c2-17 14-26 30-26s28 9 30 26" fill="#d7d7d7" /></svg>}
        </div>
        <h1 style={{ margin: 0, color: '#383838', fontFamily: 'Georgia, serif', fontVariant: 'small-caps', fontSize: 30, fontWeight: 500, letterSpacing: '.025em' }}>{name}</h1>
      </header>
      {contacts.length > 0 && <div style={{ margin: '0 0 27px 98px', paddingBottom: 13, textAlign: 'center', borderBottom: '1px solid #d1d1d1', fontSize: 10.5 }}><ContactPanel contactItems={contacts} theme={theme} contactStyle="inline" align="center" /></div>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 21 }}>
        {summary && <section style={{ display: 'grid', gridTemplateColumns: '155px minmax(0,1fr)', gap: 20, alignItems: 'start' }}>
          <h2 style={{ margin: 0, paddingTop: 2, color: '#858585', fontFamily: 'Georgia, serif', fontVariant: 'small-caps', fontSize: 15, letterSpacing: '.045em' }}>Objective</h2>
          <div style={{ paddingTop: 13, borderTop: '1px solid #888' }}><SummaryBlock summary={summary} theme={theme} /></div>
        </section>}
        <CustomSectionRegion sections={orderedSections} regionKey="main" layoutEditor={layoutEditor} gap="21px" renderSection={sectionRow} />
      </div>
    </div>
  );
}
