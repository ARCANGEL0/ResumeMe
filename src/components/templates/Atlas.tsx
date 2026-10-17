import { type CSSProperties } from 'react';
import { t } from '../../i18n';
import { useCVStore } from '../../store/cvStore';
import type { CVData } from '../../types/cv';
import { TEMPLATE_THEMES } from './templateCatalog';
import { ensureTemplateLayout, getSectionsForRegion } from './templateLayout';
import { getContactItems } from './templateUtils';
import { ContactPanel, PhotoFrame, SectionPanels, SummaryBlock, type TemplateLayoutEditor } from './templateComponents';

interface Props { data: CVData; layoutEditor?: TemplateLayoutEditor }

export default function Atlas({ data, layoutEditor }: Props) {
  const language = useCVStore((state) => state.language);
  const theme = TEMPLATE_THEMES.atlas;
  const { personalInfo, sections } = data;
  const layout = ensureTemplateLayout('atlas', data.layoutOverride, sections);
  const displayName = personalInfo.fullName || t(language, 'fullName');
  const contactItems = getContactItems(personalInfo, language);
  const summary = personalInfo.summary.trim();
  const career = getSectionsForRegion(sections, layout, 'left');
  const details = getSectionsForRegion(sections, layout, 'right');
  const panel: CSSProperties = { padding: '16px 17px 18px', border: '1px solid #c7c7c7', background: '#fff' };
  const page: CSSProperties = { minHeight: '297mm', padding: '34px 38px 40px', background: '#f5f5f5', color: '#171717', fontFamily: "'Arial', sans-serif", fontSize: '10.6px', lineHeight: 1.62 };

  return (
    <div style={page}>
      <header style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '9px', marginBottom: '9px' }}>
        <div style={{ minWidth: 0, padding: '20px 22px', border: '1px solid #222', background: '#fff' }}>
          <h1 style={{ margin: 0, color: '#171717', fontSize: '31px', fontWeight: 650, lineHeight: 1.02, letterSpacing: '-0.045em', overflowWrap: 'anywhere' }}>{displayName}</h1>
          {contactItems.length > 0 && <div style={{ marginTop: '14px' }}><ContactPanel contactItems={contactItems} theme={theme} contactStyle="inline" /></div>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '17px', minWidth: 0, padding: '20px 22px', border: '1px solid #222', background: '#e8e8e8' }}>
          {personalInfo.photo && <PhotoFrame photo={personalInfo.photo} size={59} radius="0" border="1px solid #aaa" />}
          {summary && <div style={{ minWidth: 0, color: '#4d4d4d' }}><div style={{ marginBottom: '6px', color: '#777', fontSize: '8px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase' }}>{t(language, 'profile')}</div><SummaryBlock summary={summary} theme={theme} /></div>}
        </div>
      </header>
      <main style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.55fr) minmax(220px, 0.75fr)', gap: '9px' }}>
        <section style={{ minWidth: 0, padding: '18px 20px', border: '1px solid #222', background: '#fff' }}>
          <SectionPanels sections={career} theme={theme} regionKey="left" layoutEditor={layoutEditor} gap="19px" shellStyle={panel} />
        </section>
        <aside style={{ minWidth: 0, padding: '18px 17px', border: '1px solid #222', background: '#e8e8e8' }}>
          <SectionPanels sections={details} theme={theme} regionKey="right" layoutEditor={layoutEditor} gap="12px" shellStyle={{ ...panel, padding: '12px 12px 13px' }} />
        </aside>
      </main>
    </div>
  );
}
