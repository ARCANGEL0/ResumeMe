import { type CSSProperties } from 'react';
import { t } from '../../i18n';
import { useCVStore } from '../../store/cvStore';
import type { CVData } from '../../types/cv';
import ContactIcon from '../../ui/ContactIcon';
import { TEMPLATE_THEMES } from './templateCatalog';
import { ensureTemplateLayout, getSectionsForRegion } from './templateLayout';
import { getContactItems } from './templateUtils';
import { PhotoFrame, SectionColumn, SummaryBlock, type TemplateLayoutEditor } from './templateComponents';

interface Props { data: CVData; layoutEditor?: TemplateLayoutEditor }

export default function Harbor({ data, layoutEditor }: Props) {
  const language = useCVStore((state) => state.language);
  const theme = TEMPLATE_THEMES.harbor;
  const { personalInfo, sections } = data;
  const layout = ensureTemplateLayout('harbor', data.layoutOverride, sections);
  const displayName = personalInfo.fullName || t(language, 'fullName');
  const contactItems = getContactItems(personalInfo, language);
  const summary = personalInfo.summary.trim();
  const career = getSectionsForRegion(sections, layout, 'main');
  const details = getSectionsForRegion(sections, layout, 'sidebar');
  const page: CSSProperties = { minHeight: '297mm', padding: '36px 45px 42px', background: '#fff', color: '#161616', fontFamily: 'Arial, sans-serif', fontSize: '10.9px', lineHeight: 1.66 };

  return (
    <div style={page}>
      <header style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto', alignItems: 'center', gap: '23px', padding: '0 0 20px', borderBottom: '4px solid #171717' }}>
        <h1 style={{ minWidth: 0, margin: 0, color: '#161616', fontSize: '39px', fontWeight: 600, lineHeight: 1.01, letterSpacing: '-0.055em', overflowWrap: 'anywhere' }}>{displayName}</h1>
        {personalInfo.photo && <PhotoFrame photo={personalInfo.photo} size={72} radius="0" border="1px solid #aaa" />}
      </header>
      {contactItems.length > 0 && <section style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', borderBottom: '1px solid #bdbdbd' }}>
        {contactItems.map((item, index) => <div key={item.key} style={{ display: 'flex', alignItems: 'start', gap: '7px', minWidth: 0, padding: '10px 12px', borderRight: index < contactItems.length - 1 ? '1px solid #d2d2d2' : 'none', overflowWrap: 'anywhere' }}><ContactIcon name={item.icon} style={{ width: '12px', height: '12px', flexShrink: 0, marginTop: '2px', color: '#666' }} /><span>{item.value}</span></div>)}
      </section>}
      {summary && <section style={{ display: 'grid', gridTemplateColumns: '120px minmax(0, 1fr)', gap: '22px', margin: '22px 0 28px', padding: '16px 0', borderTop: '1px solid #d0d0d0', borderBottom: '1px solid #d0d0d0' }}>
        <div style={{ color: '#777', fontSize: '8px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase' }}>{t(language, 'profile')}</div><div style={{ maxWidth: '670px', color: '#454545' }}><SummaryBlock summary={summary} theme={theme} /></div>
      </section>}
      <main style={{ paddingTop: summary ? 0 : '27px' }}><SectionColumn sections={career} theme={theme} regionKey="main" layoutEditor={layoutEditor} gap="28px" /></main>
      {details.length > 0 && <footer style={{ marginTop: '35px', padding: '17px 19px 19px', background: '#eeeeee' }}><SectionColumn sections={details} theme={theme} regionKey="sidebar" layoutEditor={layoutEditor} gap="20px" /></footer>}
    </div>
  );
}

