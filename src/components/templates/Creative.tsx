import { type CSSProperties } from 'react';
import { t } from '../../i18n';
import { useCVStore } from '../../store/cvStore';
import type { CVData } from '../../types/cv';
import { TEMPLATE_THEMES } from './templateCatalog';
import { ensureTemplateLayout, getSectionsForRegion } from './templateLayout';
import { getContactItems } from './templateUtils';
import { ContactPanel, PhotoFrame, SectionColumn, SummaryBlock, type TemplateLayoutEditor } from './templateComponents';

interface Props { data: CVData; layoutEditor?: TemplateLayoutEditor }

export default function Creative({ data, layoutEditor }: Props) {
  const language = useCVStore((state) => state.language);
  const theme = TEMPLATE_THEMES.creative;
  const { personalInfo, sections } = data;
  const layout = ensureTemplateLayout('creative', data.layoutOverride, sections);
  const displayName = personalInfo.fullName || t(language, 'fullName');
  const contactItems = getContactItems(personalInfo, language);
  const summary = personalInfo.summary.trim();
  const main = getSectionsForRegion(sections, layout, 'main');
  const sidebar = getSectionsForRegion(sections, layout, 'sidebar');
  const page: CSSProperties = {
    display: 'grid', gridTemplateColumns: '31% minmax(0, 1fr)', minHeight: '297mm',
    background: theme.page, color: theme.text, fontFamily: theme.fontFamily,
    fontSize: '11.2px', lineHeight: 1.65,
  };

  return (
    <div style={page}>
      <aside style={{ minWidth: 0, padding: '36px 24px 40px', background: theme.sidebarBg, color: theme.sidebarText }}>
        {personalInfo.photo && <div style={{ marginBottom: '24px' }}><PhotoFrame photo={personalInfo.photo} size={72} radius="0" border="1px solid rgba(255,255,255,0.55)" /></div>}
        <div style={{ marginBottom: '9px', color: 'rgba(255,255,255,0.64)', fontSize: '8px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' }}>Curriculum vitae</div>
        <h1 style={{ margin: 0, color: theme.sidebarText, fontFamily: "'Georgia', serif", fontSize: '29px', fontWeight: 500, lineHeight: 1.06, letterSpacing: '-0.025em', overflowWrap: 'anywhere' }}>{displayName}</h1>
        {contactItems.length > 0 && <div style={{ marginTop: '22px', paddingTop: '17px', borderTop: '1px solid rgba(255,255,255,0.22)' }}><ContactPanel contactItems={contactItems} theme={theme} contactStyle="stack" onDark /></div>}
        {summary && <section style={{ marginTop: '24px', paddingTop: '19px', borderTop: '1px solid rgba(255,255,255,0.22)' }}>
          <div style={{ marginBottom: '9px', color: 'rgba(255,255,255,0.68)', fontSize: '8px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase' }}>{t(language, 'profile')}</div>
          <SummaryBlock summary={summary} theme={theme} onDark />
        </section>}
        <div style={{ marginTop: '25px' }}>
          <SectionColumn sections={sidebar} theme={theme} regionKey="sidebar" layoutEditor={layoutEditor} onDark gap="21px" />
        </div>
      </aside>
      <main style={{ minWidth: 0, padding: '42px 38px 42px' }}>
        <div style={{ height: '3px', marginBottom: '26px', background: theme.accentDark }} />
        <SectionColumn sections={main} theme={theme} regionKey="main" layoutEditor={layoutEditor} gap="27px" />
      </main>
    </div>
  );
}
