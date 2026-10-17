import { t } from '../../i18n';
import { useCVStore } from '../../store/cvStore';
import type { CVData } from '../../types/cv';
import { TEMPLATE_THEMES } from './templateCatalog';
import { ensureTemplateLayout, getSectionsForRegion } from './templateLayout';
import { getContactItems } from './templateUtils';
import { ContactPanel, PhotoFrame, SectionColumn, SummaryBlock, type TemplateLayoutEditor } from './templateComponents';

interface Props { data: CVData; layoutEditor?: TemplateLayoutEditor }

export default function Linen({ data, layoutEditor }: Props) {
  const language = useCVStore((state) => state.language);
  const theme = TEMPLATE_THEMES.linen;
  const { personalInfo, sections } = data;
  const layout = ensureTemplateLayout('linen', data.layoutOverride, sections);
  const displayName = personalInfo.fullName || t(language, 'fullName');
  const contactItems = getContactItems(personalInfo, language);
  const summary = personalInfo.summary.trim();
  const career = getSectionsForRegion(sections, layout, 'main');
  const supporting = getSectionsForRegion(sections, layout, 'sidebar');

  return (
    <div style={{ minHeight: '297mm', background: '#fff', color: '#26231f', fontFamily: 'Georgia, serif', fontSize: '10.8px', lineHeight: 1.72 }}>
      <header style={{ padding: '35px 46px 22px', borderBottom: '1px solid #b9b3aa' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 92px', gap: '20px', alignItems: 'center' }}>
          <h1 style={{ minWidth: 0, margin: 0, color: '#26231f', fontSize: '37px', fontWeight: 400, lineHeight: 1.03, letterSpacing: '-0.035em', overflowWrap: 'anywhere' }}>{displayName}</h1>
          {personalInfo.photo && <div style={{ justifySelf: 'end' }}><PhotoFrame photo={personalInfo.photo} size={74} radius="0" border="1px solid #aaa" /></div>}
        </div>
        {contactItems.length > 0 && <div style={{ marginTop: '13px', fontFamily: 'Arial, sans-serif' }}><ContactPanel contactItems={contactItems} theme={theme} contactStyle="inline" /></div>}
      </header>
      {summary && <section style={{ display: 'grid', gridTemplateColumns: '88px minmax(0, 1fr)', gap: '22px', margin: '20px 46px 25px', padding: '0 0 17px', borderBottom: '1px solid #d8d3ca', color: '#514c45' }}>
        <div style={{ fontFamily: 'Arial, sans-serif', color: '#70695f', fontSize: '8px', fontWeight: 700, letterSpacing: '0.13em', textTransform: 'uppercase' }}>{t(language, 'profile')}</div><SummaryBlock summary={summary} theme={theme} />
      </section>}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 220px', gap: '32px', padding: '0 46px 42px' }}>
        <main style={{ minWidth: 0 }}><SectionColumn sections={career} theme={theme} regionKey="main" layoutEditor={layoutEditor} gap="28px" /></main>
        <aside style={{ minWidth: 0, padding: '17px 16px', background: '#f6f4f0', borderTop: '2px solid #8b8172', fontFamily: 'Arial, sans-serif' }}><SectionColumn sections={supporting} theme={theme} regionKey="sidebar" layoutEditor={layoutEditor} gap="22px" /></aside>
      </div>
    </div>
  );
}

