import { t } from '../../i18n';
import { useCVStore } from '../../store/cvStore';
import type { CVData } from '../../types/cv';
import { TEMPLATE_THEMES } from './templateCatalog';
import { ensureTemplateLayout, getSectionsForRegion } from './templateLayout';
import { getContactItems } from './templateUtils';
import { ContactPanel, PhotoFrame, SectionColumn, SummaryBlock, type TemplateLayoutEditor } from './templateComponents';

interface Props { data: CVData; layoutEditor?: TemplateLayoutEditor }

export default function Executive({ data, layoutEditor }: Props) {
  const language = useCVStore((state) => state.language);
  const theme = TEMPLATE_THEMES.executive;
  const { personalInfo, sections } = data;
  const layout = ensureTemplateLayout('executive', data.layoutOverride, sections);
  const displayName = personalInfo.fullName || t(language, 'fullName');
  const contactItems = getContactItems(personalInfo, language);
  const summary = personalInfo.summary.trim();
  const career = getSectionsForRegion(sections, layout, 'left');
  const qualifications = getSectionsForRegion(sections, layout, 'right');

  return (
    <div style={{ minHeight: '297mm', padding: '38px 48px 44px', background: '#fff', color: '#171717', fontFamily: 'Arial, sans-serif', fontSize: '10.7px', lineHeight: 1.68 }}>
      <header style={{ display: 'grid', gridTemplateColumns: personalInfo.photo ? '102px minmax(0, 1fr)' : '1fr', gap: '24px', alignItems: 'center', padding: '0 0 20px', borderTop: '2px solid #171717', borderBottom: '1px solid #aaa' }}>
        {personalInfo.photo && <PhotoFrame photo={personalInfo.photo} size={92} radius="0" border="1px solid #888" />}
        <div style={{ minWidth: 0, padding: '18px 0' }}>
          <h1 style={{ minWidth: 0, margin: 0, color: '#171717', fontFamily: 'Georgia, serif', fontSize: '38px', fontWeight: 400, lineHeight: 1.04, letterSpacing: '-0.035em', overflowWrap: 'anywhere' }}>{displayName}</h1>
          {contactItems.length > 0 && <div style={{ marginTop: '13px' }}><ContactPanel contactItems={contactItems} theme={theme} contactStyle="inline" /></div>}
        </div>
      </header>
      {summary && <section style={{ maxWidth: '710px', margin: '21px auto 29px', color: '#414141', fontFamily: 'Georgia, serif', fontSize: '12px', lineHeight: 1.78, textAlign: 'center' }}><SummaryBlock summary={summary} theme={theme} /></section>}
      <main style={{ paddingTop: summary ? 0 : '25px' }}><SectionColumn sections={career} theme={theme} regionKey="left" layoutEditor={layoutEditor} gap="28px" /></main>
      {qualifications.length > 0 && <footer style={{ marginTop: '31px', padding: '18px 20px 20px', borderTop: '2px solid #222', background: '#f5f5f5' }}><SectionColumn sections={qualifications} theme={theme} regionKey="right" layoutEditor={layoutEditor} gap="19px" /></footer>}
    </div>
  );
}

