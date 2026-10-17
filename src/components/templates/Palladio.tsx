import { t } from '../../i18n';
import { useCVStore } from '../../store/cvStore';
import type { CVData } from '../../types/cv';
import { TEMPLATE_THEMES } from './templateCatalog';
import { ensureTemplateLayout, getSectionsForRegion } from './templateLayout';
import { getContactItems } from './templateUtils';
import { ContactPanel, PhotoFrame, SectionColumn, SummaryBlock, type TemplateLayoutEditor } from './templateComponents';

interface Props { data: CVData; layoutEditor?: TemplateLayoutEditor }

export default function Palladio({ data, layoutEditor }: Props) {
  const language = useCVStore((state) => state.language);
  const theme = TEMPLATE_THEMES.palladio;
  const { personalInfo, sections } = data;
  const layout = ensureTemplateLayout('palladio', data.layoutOverride, sections);
  const displayName = personalInfo.fullName || t(language, 'fullName');
  const contactItems = getContactItems(personalInfo, language);
  const summary = personalInfo.summary.trim();
  const career = getSectionsForRegion(sections, layout, 'main');
  const leftRecords = getSectionsForRegion(sections, layout, 'bottomLeft');
  const rightRecords = getSectionsForRegion(sections, layout, 'bottomRight');

  return (
    <div style={{ minHeight: '297mm', padding: '38px 47px 44px', background: '#fff', color: '#20201f', fontFamily: 'Arial, sans-serif', fontSize: '10.6px', lineHeight: 1.68 }}>
      <header style={{ display: 'grid', gridTemplateColumns: '116px minmax(0, 1fr)', gap: '24px', alignItems: 'center', padding: '0 0 20px', borderBottom: '1px solid #999' }}>
        {personalInfo.photo && <PhotoFrame photo={personalInfo.photo} size={102} radius="0" border="1px solid #777" />}
        <div style={{ minWidth: 0 }}>
          <h1 style={{ margin: 0, color: '#171717', fontFamily: 'Georgia, serif', fontSize: '37px', fontWeight: 400, lineHeight: 1.05, letterSpacing: '-0.035em', overflowWrap: 'anywhere' }}>{displayName}</h1>
          {contactItems.length > 0 && <div style={{ marginTop: '12px' }}><ContactPanel contactItems={contactItems} theme={theme} contactStyle="inline" /></div>}
        </div>
      </header>
      {summary && <section style={{ maxWidth: '720px', margin: '19px 0 26px', padding: '0 0 16px', borderBottom: '1px solid #ccc', color: '#494744', fontFamily: 'Georgia, serif', fontSize: '12px', lineHeight: 1.8 }}><SummaryBlock summary={summary} theme={theme} /></section>}
      <main style={{ paddingTop: summary ? 0 : '25px' }}><SectionColumn sections={career} theme={theme} regionKey="main" layoutEditor={layoutEditor} gap="27px" /></main>
      {(leftRecords.length > 0 || rightRecords.length > 0 || layoutEditor) && <footer style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '34px', marginTop: '30px', paddingTop: '20px', borderTop: '2px solid #222' }}>
        <SectionColumn sections={leftRecords} theme={theme} regionKey="bottomLeft" layoutEditor={layoutEditor} gap="19px" />
        <SectionColumn sections={rightRecords} theme={theme} regionKey="bottomRight" layoutEditor={layoutEditor} gap="19px" />
      </footer>}
    </div>
  );
}

