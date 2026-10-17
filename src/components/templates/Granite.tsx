import { t } from '../../i18n';
import { useCVStore } from '../../store/cvStore';
import type { CVData } from '../../types/cv';
import { TEMPLATE_THEMES } from './templateCatalog';
import { ensureTemplateLayout, getSectionsForRegion } from './templateLayout';
import { getContactItems } from './templateUtils';
import { ContactPanel, PhotoFrame, SectionColumn, SummaryBlock, type TemplateLayoutEditor } from './templateComponents';

interface Props { data: CVData; layoutEditor?: TemplateLayoutEditor }

export default function Granite({ data, layoutEditor }: Props) {
  const language = useCVStore((state) => state.language);
  const theme = TEMPLATE_THEMES.granite;
  const { personalInfo, sections } = data;
  const layout = ensureTemplateLayout('granite', data.layoutOverride, sections);
  const displayName = personalInfo.fullName || t(language, 'fullName');
  const contactItems = getContactItems(personalInfo, language);
  const summary = personalInfo.summary.trim();
  const career = getSectionsForRegion(sections, layout, 'main');
  const supporting = getSectionsForRegion(sections, layout, 'footer');

  return (
    <div style={{ minHeight: '297mm', background: '#fff', color: '#1b1d1e', fontFamily: 'Arial, sans-serif', fontSize: '10.7px', lineHeight: 1.65 }}>
      <header style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 86px', gap: '22px', alignItems: 'center', padding: '29px 44px 20px', background: '#1d2629', color: '#fff', borderBottom: '6px solid #777f80' }}>
        <div style={{ minWidth: 0 }}>
          <h1 style={{ margin: 0, color: '#fff', fontSize: '36px', fontWeight: 650, lineHeight: 1.02, letterSpacing: '-0.045em', overflowWrap: 'anywhere' }}>{displayName}</h1>
          {contactItems.length > 0 && <div style={{ marginTop: '14px' }}><ContactPanel contactItems={contactItems} theme={theme} onDark contactStyle="inline" /></div>}
        </div>
        {personalInfo.photo && <div style={{ justifySelf: 'end' }}><PhotoFrame photo={personalInfo.photo} size={76} radius="0" border="1px solid #c2c8c9" /></div>}
      </header>
      {summary && <section style={{ padding: '16px 44px', background: '#f0f1f1', color: '#3e4446' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '90px minmax(0, 1fr)', gap: '20px' }}><div style={{ color: '#616b6d', fontSize: '8px', fontWeight: 700, letterSpacing: '0.13em', textTransform: 'uppercase' }}>{t(language, 'profile')}</div><SummaryBlock summary={summary} theme={theme} /></div>
      </section>}
      <main style={{ padding: '28px 44px 0' }}><SectionColumn sections={career} theme={theme} regionKey="main" layoutEditor={layoutEditor} gap="27px" /></main>
      {supporting.length > 0 && <footer style={{ margin: '28px 44px 40px', padding: '17px 19px 19px', border: '1px solid #c8cdce', background: '#fafafa' }}><SectionColumn sections={supporting} theme={theme} regionKey="footer" layoutEditor={layoutEditor} gap="19px" /></footer>}
    </div>
  );
}

