import type { CSSProperties } from 'react';
import { t } from '../../i18n';
import { useCVStore } from '../../store/cvStore';
import type { CVData, CVEntry, CVSection } from '../../types/cv';
import { TEMPLATE_THEMES, type TemplateTheme } from './templateCatalog';
import { ensureTemplateLayout, getSectionsForRegion } from './templateLayout';
import { getContactItems, getEntryDate, getEntryDetailLines, getEntrySubtitle, getEntryTitle } from './templateUtils';
import { ContactPanel, CustomSectionRegion, SectionBlockBody, SectionColumn, SectionHeading, type TemplateLayoutEditor } from './templateComponents';

interface Props {
  data: CVData;
  layoutEditor?: TemplateLayoutEditor;
}

const THEME: TemplateTheme = {
  ...TEMPLATE_THEMES.minimal,
  fontFamily: "Arial, 'Helvetica Neue', sans-serif",
  page: '#ffffff',
  text: '#242729',
  muted: '#60666a',
  line: '#d4d6d6',
  accent: '#d9b536',
  accentAlt: '#6b7377',
  accentSoft: '#f5f0df',
  accentDark: '#293a43',
  sidebarBg: '#ffffff',
  sidebarText: '#242729',
  headerBg: '#ffffff',
  headerText: '#242729',
  headerAlign: 'left',
  sectionHeading: 'underline',
  contactStyle: 'inline',
  entryStyle: 'plain',
  skillStyle: 'dots',
  languageStyle: 'words',
  summaryStyle: 'plain',
  sidebarSections: [],
  uppercaseName: true,
  nameLetterSpacing: '0.11em',
};

const sectionTitleStyle: CSSProperties = {
  margin: 0,
  paddingBottom: '7px',
  borderBottom: `1px solid ${THEME.line}`,
  color: THEME.accentDark,
  fontSize: '13px',
  fontWeight: 750,
  letterSpacing: '0.16em',
  lineHeight: 1.2,
  textTransform: 'uppercase',
};

function CalendarMark() {
  return (
    <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
      <rect x="3.5" y="5" width="17" height="16" rx="1.5" stroke="#82888b" strokeWidth="1.8" />
      <path d="M7.5 3.5v4M16.5 3.5v4M4 9.5h16" stroke="#82888b" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M8 13h2m4 0h2M8 16h2m4 0h2" stroke="#a0a5a7" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function ExperienceEntry({ entry, language }: { entry: CVEntry; language: string }) {
  const date = getEntryDate(entry, language);
  const dateParts = date.split(/\s+-\s+/).filter(Boolean);
  const employer = getEntrySubtitle(entry);
  const details = getEntryDetailLines(entry);

  return (
    <article style={{ display: 'grid', gridTemplateColumns: '132px minmax(0,1fr)', gap: '20px', breakInside: 'avoid' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', paddingTop: '1px' }}>
        <CalendarMark />
        <div style={{ minWidth: 0, color: THEME.muted, fontSize: '9.5px', lineHeight: 1.55 }}>
          {dateParts.map((part, index) => <div key={`${part}-${index}`}>{part}</div>)}
        </div>
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ color: THEME.text, fontSize: '11.5px', fontWeight: 750, lineHeight: 1.4 }}>{getEntryTitle(entry)}</div>
        {employer && <div style={{ marginTop: '2px', color: THEME.accentDark, fontSize: '10px', fontWeight: 700 }}>{employer}</div>}
        {details.length > 0 && (
          <ul style={{ margin: '8px 0 0', paddingLeft: '16px', color: THEME.text, fontSize: '10px', lineHeight: 1.6 }}>
            {details.map((line, index) => <li key={`${index}-${line}`} style={{ paddingLeft: '2px', marginBottom: '2px' }}>{line}</li>)}
          </ul>
        )}
      </div>
    </article>
  );
}

function ExperienceSection({ section, language }: { section: CVSection; language: string }) {
  return (
    <section>
      <h2 style={sectionTitleStyle}>{section.title}</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '15px' }}>
        {section.entries.map((entry) => <ExperienceEntry key={entry.id} entry={entry} language={language} />)}
      </div>
    </section>
  );
}

function renderCareerSection(section: CVSection, language: string) {
  if (section.type === 'experience') {
    return <ExperienceSection section={section} language={language} />;
  }

  return (
    <section>
      <SectionHeading title={section.title} theme={THEME} />
      <SectionBlockBody section={section} theme={THEME} />
    </section>
  );
}

export default function Minimal({ data, layoutEditor }: Props) {
  const language = useCVStore((state) => state.language);
  const { personalInfo, sections } = data;
  const layout = ensureTemplateLayout('minimal', data.layoutOverride, sections);
  const displayName = personalInfo.fullName || t(language, 'fullName');
  const role = sections
    .find((section) => section.type === 'experience')
    ?.entries.find((entry) => entry.fields.position?.trim())?.fields.position?.trim() ?? '';
  const contactItems = getContactItems(personalInfo, language);
  const lowerLeftSections = getSectionsForRegion(sections, layout, 'lowerLeft');
  const lowerMiddleSections = getSectionsForRegion(sections, layout, 'lowerMiddle');
  const lowerRightSections = getSectionsForRegion(sections, layout, 'lowerRight');
  const careerSections = getSectionsForRegion(sections, layout, 'main');
  const showLowerGrid = lowerLeftSections.length + lowerMiddleSections.length + lowerRightSections.length > 0 || Boolean(layoutEditor);
  const pageStyle: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '16px minmax(0,1fr)',
    minHeight: '297mm',
    boxSizing: 'border-box',
    background: THEME.page,
    color: THEME.text,
    fontFamily: THEME.fontFamily,
    fontSize: '10px',
    lineHeight: 1.55,
    overflowWrap: 'anywhere',
  };

  return (
    <div style={pageStyle}>
      <div aria-hidden="true" style={{ background: THEME.accentDark }} />
      <div style={{ minWidth: 0, padding: '27px 34px 32px' }}>
        <header style={{ display: 'grid', gridTemplateColumns: personalInfo.photo ? '116px minmax(0,1fr)' : 'minmax(0,1fr)', alignItems: 'center', gap: '26px' }}>
          {personalInfo.photo && (
            <div style={{ height: '136px', paddingBottom: '5px', background: THEME.accent, boxSizing: 'border-box' }}>
              <img src={personalInfo.photo} alt="" style={{ display: 'block', width: '100%', height: '131px', objectFit: 'cover' }} />
            </div>
          )}
          <div style={{ minWidth: 0 }}>
            <h1 style={{ margin: 0, color: THEME.accent, fontSize: '31px', fontWeight: 750, letterSpacing: THEME.nameLetterSpacing, lineHeight: 1.1, overflowWrap: 'anywhere', textTransform: 'uppercase' }}>{displayName}</h1>
            {role && <div style={{ marginTop: '7px', color: THEME.muted, fontSize: '12px', fontWeight: 600, letterSpacing: '0.22em', lineHeight: 1.4, textTransform: 'uppercase' }}>{role}</div>}
          </div>
        </header>

        {contactItems.length > 0 && (
          <div style={{ marginTop: '19px', padding: '11px 0 13px', borderBottom: `5px solid ${THEME.accentDark}` }}>
            <ContactPanel contactItems={contactItems} theme={THEME} contactStyle="inline" />
          </div>
        )}

        {personalInfo.summary.trim() && (
          <section style={{ marginTop: '25px', marginBottom: '23px', paddingBottom: '18px', borderBottom: `1px solid ${THEME.line}` }}>
            <h2 style={sectionTitleStyle}>{t(language, 'profile')}</h2>
            <p style={{ margin: '12px 0 0', color: THEME.text, fontSize: '10.5px', lineHeight: 1.72 }}>{personalInfo.summary.trim()}</p>
          </section>
        )}

        <CustomSectionRegion
          sections={careerSections}
          regionKey="main"
          layoutEditor={layoutEditor}
          gap="24px"
          renderSection={(section) => renderCareerSection(section, language)}
        />

        {showLowerGrid && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', marginTop: '25px', paddingTop: '18px', borderTop: `1px solid ${THEME.line}` }}>
            <SectionColumn sections={lowerLeftSections} theme={THEME} regionKey="lowerLeft" layoutEditor={layoutEditor} gap="20px" />
            <div style={{ minWidth: 0, padding: '0 17px', borderLeft: `1px solid ${THEME.line}` }}>
              <SectionColumn sections={lowerMiddleSections} theme={THEME} regionKey="lowerMiddle" layoutEditor={layoutEditor} gap="20px" />
            </div>
            <div style={{ minWidth: 0, paddingLeft: '17px', borderLeft: `1px solid ${THEME.line}` }}>
              <SectionColumn sections={lowerRightSections} theme={THEME} regionKey="lowerRight" layoutEditor={layoutEditor} gap="20px" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
