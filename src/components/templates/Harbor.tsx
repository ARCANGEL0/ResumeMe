import { type CSSProperties } from 'react';
import { t } from '../../i18n';
import { useCVStore } from '../../store/cvStore';
import type { CVData } from '../../types/cv';
import { TEMPLATE_THEMES } from './templateCatalog';
import { ensureTemplateLayout, getSectionsForRegion } from './templateLayout';
import { getContactItems } from './templateUtils';
import {
  ContactPanel,
  PhotoFrame,
  SectionColumn,
  SectionEyebrow,
  SummaryBlock,
  type TemplateLayoutEditor,
} from './templateComponents';

interface Props {
  data: CVData;
  layoutEditor?: TemplateLayoutEditor;
}

export default function Harbor({ data, layoutEditor }: Props) {
  const language = useCVStore((state) => state.language);
  const theme = TEMPLATE_THEMES['harbor'];
  const { personalInfo, sections } = data;
  const layoutState = ensureTemplateLayout('harbor', data.layoutOverride, sections);
  const displayName = personalInfo.fullName || t(language, 'fullName');
  const contactItems = getContactItems(personalInfo, language);
  const summary = personalInfo.summary.trim();

  const baseStyle: CSSProperties = {
    fontFamily: theme.fontFamily,
    fontSize: '11.2px',
    lineHeight: '1.65',
    color: theme.text,
    background: theme.page,
    minHeight: '297mm',
  };

  const sidebarSections = getSectionsForRegion(sections, layoutState, 'sidebar');
  const mainSections = getSectionsForRegion(sections, layoutState, 'main');

  return (
    <div style={baseStyle}>
      <header style={{ position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px', padding: '36px 40px 34px', background: theme.sidebarBg, color: theme.sidebarText }}>
        <div style={{ position: 'relative', zIndex: 1, minWidth: 0, flex: 1 }}>
          <div style={{ marginBottom: '10px', color: theme.accentAlt, fontSize: '9px', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase' }}>Harbor / Career Profile</div>
          <h1 style={{ margin: 0, color: '#ffffff', fontSize: '36px', fontWeight: 700, lineHeight: 1.04, letterSpacing: '-0.035em', overflowWrap: 'anywhere' }}>{displayName}</h1>
          <div style={{ width: '44px', height: '3px', margin: '13px 0 14px', background: theme.accentAlt }} />
          <ContactPanel contactItems={contactItems} theme={theme} contactStyle="inline" onDark />
        </div>
        {personalInfo.photo && <PhotoFrame photo={personalInfo.photo} size={84} radius="50%" border={`2px solid ${theme.accentAlt}`} />}
        <span style={{ position: 'absolute', right: '-35px', bottom: '-64px', width: '176px', height: '112px', borderTop: `1px solid ${theme.accentAlt}`, borderRadius: '50%', transform: 'rotate(-14deg)', opacity: 0.55 }} />
      </header>
      {summary && (
        <div style={{ margin: '22px 40px 0', padding: '15px 18px', borderLeft: `4px solid ${theme.accentAlt}`, background: theme.accentSoft }}>
          <SectionEyebrow title={t(language, 'profile')} theme={theme} />
          <SummaryBlock summary={summary} theme={theme} />
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 226px', gap: '30px', padding: '28px 40px 40px' }}>
        <main style={{ paddingRight: '12px' }}>
          <SectionColumn sections={mainSections} theme={theme} regionKey="main" layoutEditor={layoutEditor} gap="27px" />
        </main>
        <aside style={{ padding: '19px 17px', color: theme.sidebarText, background: theme.sidebarBg, borderTop: `4px solid ${theme.accentAlt}` }}>
          <SectionColumn sections={sidebarSections} theme={theme} regionKey="sidebar" layoutEditor={layoutEditor} onDark gap="23px" />
        </aside>
      </div>
    </div>
  );
}
