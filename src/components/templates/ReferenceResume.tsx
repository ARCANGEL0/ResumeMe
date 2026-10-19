import { Fragment, type CSSProperties, type SVGProps } from 'react';
import { t } from '../../i18n';
import { useCVStore } from '../../store/cvStore';
import type { CVData, CVSection, TemplateId } from '../../types/cv';
import { TEMPLATE_THEMES, type TemplateTheme } from './templateCatalog';
import { ensureTemplateLayout, getSectionsForRegion } from './templateLayout';
import { getContactItems, getEntryDate, getEntryDetailLines, getEntrySubtitle, getEntryTitle } from './templateUtils';
import {
  ContactPanel,
  CustomSectionRegion,
  LinkedText,
  PhotoFrame,
  SectionBlockBody,
  SectionColumn,
  SummaryBlock,
  type TemplateLayoutEditor,
} from './templateComponents';
import ContactIcon from '../../ui/ContactIcon';

interface Props {
  data: CVData;
  layoutEditor?: TemplateLayoutEditor;
  template: TemplateId;
}

const PALETTES: Partial<Record<TemplateId, Partial<TemplateTheme>>> = {
  meridian: { fontFamily: "Arial, 'Helvetica Neue', sans-serif", page: '#ffffff', text: '#111111', muted: '#555555', line: '#bdbdbd', accent: '#111111', accentAlt: '#777777', accentSoft: '#eeeeee', accentDark: '#111111', headerBg: '#ffffff', headerText: '#111111', sectionHeading: 'label', entryStyle: 'plain', skillStyle: 'list', languageStyle: 'words' },
  scribe: { fontFamily: "Arial, 'Helvetica Neue', sans-serif", page: '#ffffff', text: '#1d1d1d', muted: '#555555', line: '#bdbdbd', accent: '#242424', accentAlt: '#777777', accentSoft: '#eeeeee', accentDark: '#111111', sectionHeading: 'underline', entryStyle: 'plain', skillStyle: 'list', languageStyle: 'words' },
  dossier: { fontFamily: "'Arial Narrow', Arial, sans-serif", page: '#fff', text: '#171717', muted: '#575757', line: '#c7c7c7', accent: '#141414', accentAlt: '#777', accentSoft: '#e7e5e2', accentDark: '#252a30', sectionHeading: 'label', entryStyle: 'plain', skillStyle: 'list', languageStyle: 'words' },
  modern: { fontFamily: "Arial, 'Helvetica Neue', sans-serif", page: '#fff', text: '#191a1b', muted: '#5d6062', line: '#d2d3d3', accent: '#292c2d', accentAlt: '#85898a', accentSoft: '#f0f0ef', accentDark: '#292c2d', sidebarBg: '#f0f0ef', sidebarText: '#202223', sectionHeading: 'rule', entryStyle: 'plain', skillStyle: 'list', languageStyle: 'words' },
  slate: { fontFamily: "Arial, 'Helvetica Neue', sans-serif", page: '#fff', text: '#1c1c1c', muted: '#5b5b5b', line: '#d3d3d3', accent: '#171717', accentAlt: '#6f6f6f', accentSoft: '#ececec', accentDark: '#242424', sectionHeading: 'bar', entryStyle: 'plain', skillStyle: 'list', languageStyle: 'words' },
  ivory: { fontFamily: "Arial, 'Helvetica Neue', sans-serif", page: '#fff', text: '#20201e', muted: '#65635f', line: '#d7d4ce', accent: '#34332e', accentAlt: '#8d8980', accentSoft: '#f1efea', accentDark: '#363631', sidebarBg: '#f4f2ed', sidebarText: '#252521', sectionHeading: 'caps', entryStyle: 'timeline', skillStyle: 'bars', languageStyle: 'dots' },
  summit: { fontFamily: "Arial, 'Helvetica Neue', sans-serif", page: '#fff', text: '#1a1a1a', muted: '#555', line: '#d1d1d1', accent: '#171717', accentAlt: '#858585', accentSoft: '#ededed', accentDark: '#262626', sidebarBg: '#f0f0f0', sidebarText: '#242424', sectionHeading: 'rule', entryStyle: 'timeline', skillStyle: 'list', languageStyle: 'words' },
  north: { fontFamily: "'Arial', sans-serif", page: '#fff', text: '#20201f', muted: '#66645f', line: '#d4d2ce', accent: '#34332f', accentAlt: '#88857e', accentSoft: '#f0efec', accentDark: '#373632', sidebarBg: '#f2f1ee', sidebarText: '#272725', sectionHeading: 'caps', entryStyle: 'timeline', skillStyle: 'list', languageStyle: 'words' },
  studio: { fontFamily: "'Courier New', monospace", page: '#fbfbf8', text: '#303721', muted: '#68704e', line: '#c5c9b6', accent: '#3b452b', accentAlt: '#78845b', accentSoft: '#eff1e7', accentDark: '#303721', sidebarBg: '#f1f2eb', sidebarText: '#303721', sectionHeading: 'label', entryStyle: 'plain', skillStyle: 'list', languageStyle: 'words' },
  editorial: { fontFamily: "'Arial', sans-serif", page: '#fff', text: '#171717', muted: '#616161', line: '#d0d0d0', accent: '#242424', accentAlt: '#777', accentSoft: '#f3f3f3', accentDark: '#2d2d2d', sidebarBg: '#f3f3f3', sidebarText: '#202020', sectionHeading: 'caps', entryStyle: 'plain', skillStyle: 'list', languageStyle: 'words' },
  vertex: { fontFamily: "Arial, 'Helvetica Neue', sans-serif", page: '#fff', text: '#171717', muted: '#555', line: '#c8c8c8', accent: '#171717', accentAlt: '#777', accentSoft: '#eeeeee', accentDark: '#272727', sidebarBg: '#e9e9e9', sidebarText: '#242424', sectionHeading: 'bar', entryStyle: 'plain', skillStyle: 'solid-bar', languageStyle: 'words' },
  quartz: { fontFamily: "Arial, 'Helvetica Neue', sans-serif", page: '#fff', text: '#222', muted: '#6a6a6a', line: '#d3d3d3', accent: '#3f4445', accentAlt: '#8b9192', accentSoft: '#f0f1f1', accentDark: '#353a3b', sidebarBg: '#f2f3f3', sidebarText: '#252829', sectionHeading: 'rule', entryStyle: 'timeline', skillStyle: 'list', languageStyle: 'words' },
  cobalt: { fontFamily: "'Helvetica Neue', Arial, sans-serif", page: '#fff', text: '#171717', muted: '#5a5a5a', line: '#d0d0d0', accent: '#222', accentAlt: '#777', accentSoft: '#f1f1f1', accentDark: '#292929', sidebarBg: '#f3f3f3', sidebarText: '#242424', sectionHeading: 'caps', entryStyle: 'plain', skillStyle: 'rounded-segments', languageStyle: 'words' },
  corvus: { fontFamily: "Arial, 'Helvetica Neue', sans-serif", page: '#fff', text: '#1c1c1c', muted: '#666', line: '#c9c9c9', accent: '#242424', accentAlt: '#929292', accentSoft: '#ececec', accentDark: '#242424', sidebarBg: '#d6d6d6', sidebarText: '#292929', headerBg: '#ededed', headerText: '#292929', sectionHeading: 'bar', entryStyle: 'plain', skillStyle: 'list', languageStyle: 'words' },
  insignia: { fontFamily: "'Arial', sans-serif", page: '#ffffff', text: '#202020', muted: '#646464', line: '#d3d3d3', accent: '#222', accentAlt: '#8b8b8b', accentSoft: '#ffffff', accentDark: '#292929', sidebarBg: '#ffffff', sidebarText: '#242424', sectionHeading: 'rule', entryStyle: 'plain', skillStyle: 'list', languageStyle: 'words' },
  bulletin: { fontFamily: "Arial, 'Helvetica Neue', sans-serif", page: '#fff', text: '#202020', muted: '#5c5c5c', line: '#c9c9c9', accent: '#262626', accentAlt: '#888', accentSoft: '#ededed', accentDark: '#292929', sidebarBg: '#f1f1f1', sidebarText: '#242424', sectionHeading: 'caps', entryStyle: 'timeline', skillStyle: 'list', languageStyle: 'words' },
  verso: { fontFamily: "'Arial', sans-serif", page: '#fff', text: '#171717', muted: '#626262', line: '#cdcdcd', accent: '#171717', accentAlt: '#888', accentSoft: '#efefef', accentDark: '#292929', sidebarBg: '#f1f1f1', sidebarText: '#222', sectionHeading: 'rule', entryStyle: 'plain', skillStyle: 'micro-bars', languageStyle: 'words' },
  hexon: { fontFamily: "'Segoe UI', Arial, sans-serif", page: '#ffffff', text: '#262626', muted: '#656565', line: '#d8d8d8', accent: '#3b3b3b', accentAlt: '#888888', accentSoft: '#f1f1f1', accentDark: '#343434', sidebarBg: '#f6f6f6', sidebarText: '#292929', headerBg: '#3b3b3b', headerText: '#ffffff', sectionHeading: 'caps', entryStyle: 'plain', skillStyle: 'compact-dots', languageStyle: 'words' },
  signal: { fontFamily: "'Arial', sans-serif", page: '#f5f7f8', text: '#182227', muted: '#53636b', line: '#c5d0d4', accent: '#276879', accentAlt: '#81aeba', accentSoft: '#e8f0f2', accentDark: '#24353b', sidebarBg: '#edf2f3', sidebarText: '#24343a', headerBg: '#24353b', headerText: '#fff', sectionHeading: 'label', entryStyle: 'plain', skillStyle: 'compact-dots', languageStyle: 'words' },
  professional: { fontFamily: "Arial, 'Helvetica Neue', sans-serif", page: '#fff', text: '#242424', muted: '#5c5c5c', line: '#cfcfcf', accent: '#242424', accentAlt: '#777', accentSoft: '#ededed', accentDark: '#242424', sectionHeading: 'rule', entryStyle: 'timeline', skillStyle: 'list', languageStyle: 'words' },
};

export default function ReferenceResume({ data, layoutEditor, template }: Props) {
  const language = useCVStore((state) => state.language);
  const { personalInfo, sections } = data;
  const layout = ensureTemplateLayout(template, data.layoutOverride, sections);
  const theme = { ...TEMPLATE_THEMES[template], ...PALETTES[template] };
  const name = personalInfo.fullName || t(language, 'fullName');
  const role = getPrimaryRole(sections);
  const summary = personalInfo.summary.trim();
  const contacts = getContactItems(personalInfo, language);
  const region = (key: string) => getSectionsForRegion(sections, layout, key);
  const column = (key: string, extra: Partial<CSSProperties> = {}, gap = '22px', onDark = false) => (
    <div style={extra}>
      <SectionColumn
        sections={region(key)}
        theme={theme}
        regionKey={key}
        layoutEditor={layoutEditor}
        gap={gap}
        onDark={onDark}
      />
    </div>
  );
  const contact = (style: 'stack' | 'inline' | 'pills' = 'stack', onDark = false, align: 'left' | 'center' = 'left') => (
    <ContactPanel contactItems={contacts} theme={theme} contactStyle={style} onDark={onDark} align={align} />
  );
  const profile = (onDark = false) => summary && <SummaryBlock summary={summary} theme={theme} onDark={onDark} />;
  const photo = (size: number, radius = '0', border = 'none') => personalInfo.photo ? <PhotoFrame photo={personalInfo.photo} size={size} radius={radius} border={border} /> : null;
  const graySections = (key: string, gap = '18px') => (
    <CustomSectionRegion
      sections={region(key)}
      regionKey={key}
      layoutEditor={layoutEditor}
      gap={gap}
      renderSection={(section) => (
        <section>
          <h2 style={grayBar}>{section.title}</h2>
          <SectionBlockBody section={section} theme={theme} />
        </section>
      )}
    />
  );
  const page: CSSProperties = {
    minHeight: '297mm',
    boxSizing: 'border-box',
    padding: '34px 40px 42px',
    background: theme.page,
    color: theme.text,
    fontFamily: theme.fontFamily,
    fontSize: '10.5px',
    lineHeight: 1.55,
    overflowWrap: 'anywhere',
  };
  const initials = name.trim().split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase();

  if (template === 'meridian') {
    const headerColumns = [role ? '132px' : null, 'minmax(0,1fr)', personalInfo.photo ? '74px' : null].filter(Boolean).join(' ');
    const roleFontSize = role ? Math.min(8, Math.max(5, 118 / (role.length * 0.62))) : 8;
    return <div style={{ ...page, padding: '26px 29px 36px', background: '#ffffff' }}>
      <header style={{ position: 'relative', display: 'grid', gridTemplateColumns: headerColumns, minHeight: '100px', alignItems: 'stretch', border: '1px solid #252525', background: '#fff' }}>
        {role && <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-start', padding: 0, background: '#fff' }}><span aria-label={role} title={role} style={{ alignSelf: 'flex-end', width: '112px', padding: '7px 6px', boxSizing: 'border-box', color: '#fff', background: '#171717', textAlign: 'center', fontSize: `${roleFontSize}px`, lineHeight: 1.15, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', overflowWrap: 'anywhere' }}>{role}</span></div>}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '10px 21px', background: 'linear-gradient(180deg,#f1f1f1 0 16%,#fff 16% 100%)' }}><h1 style={{ margin: 0, color: '#111111', fontSize: '31px', lineHeight: 1.04, letterSpacing: '-.035em' }}>{name}</h1></div>
        {personalInfo.photo && <div style={{ display: 'grid', placeItems: 'center', padding: '7px', filter: 'grayscale(100%)' }}>{photo(58, '0', '1px solid #333')}</div>}
      </header>
      {contacts.length > 0 && <div style={{ marginTop: '9px', padding: '0 2px 9px', borderBottom: '1px solid #292929' }}>{contact('inline')}</div>}
      {summary && <section style={{ display: 'grid', gridTemplateColumns: '92px minmax(0,1fr)', gap: '16px', marginTop: '17px', paddingBottom: '14px', borderBottom: '1px solid #d0d0d0' }}><h2 style={{ ...railLabel, marginTop: '2px' }}>{t(language, 'profile')}</h2><div>{profile()}</div></section>}
      <main style={{ marginTop: '22px' }}>{column('main', {}, '20px')}</main>
      {region('meta').length > 0 && <aside style={{ marginTop: '24px', paddingTop: '15px', borderTop: '1px solid #aaa' }}>{column('meta', {}, '17px')}</aside>}
    </div>;
  }

  if (template === 'scribe') {
    const nameParts = name.trim().split(/\s+/).filter(Boolean);
    const givenName = nameParts.shift() ?? name;
    const familyName = nameParts.join(' ');
    return <div style={{ ...page, padding: '34px 38px 42px', background: '#ffffff' }}>
      <header style={{ display: 'grid', gridTemplateColumns: 'minmax(0,.55fr) minmax(0,1fr)', gap: '14px', alignItems: 'start', paddingBottom: '15px', borderBottom: '1px solid #26292a' }}>
        <div><h1 style={{ margin: 0, color: '#1d2022', fontSize: '49px', lineHeight: .94, letterSpacing: '.025em', fontWeight: 400, textTransform: 'uppercase' }}><span style={{ display: 'block', marginBottom: '3px', fontSize: '18px', letterSpacing: '.23em' }}>{givenName}</span>{familyName || givenName}</h1>{role && <div style={{ marginTop: '14px', fontSize: '14px', letterSpacing: '.16em', textTransform: 'uppercase' }}>{role}</div>}</div>
        <div style={{ paddingTop: '8px' }}>{contact('inline')}</div>
      </header>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.55fr) minmax(190px,.78fr)', gap: '26px', paddingTop: '22px' }}>
        <main style={{ minWidth: 0 }}>
          {summary && <section style={{ marginBottom: '24px' }}><h2 style={{ ...railLabel, paddingBottom: '7px', borderBottom: '1px solid #b8bcbf' }}>{t(language, 'profile')}</h2>{profile()}</section>}
          {column('main', {}, '23px')}
        </main>
        <aside style={{ minWidth: 0, borderLeft: '1px solid #b8bcbf', paddingLeft: '19px' }}>
          {personalInfo.photo && <div style={{ marginBottom: '21px' }}>{photo(176, '0', 'none')}</div>}
          {column('aside', {}, '23px')}
        </aside>
      </div>
    </div>;
  }

  if (template === 'dossier') {
    return <div style={{ ...page, padding: '30px', background: '#fff' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(225px,.78fr) minmax(0,1.5fr)', gap: '0 22px' }}>
        <header style={{ minHeight: '182px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '22px 20px', background: '#dedbd7' }}><div><h1 style={{ margin: 0, color: 'inherit', fontSize: '30px', lineHeight: 1.05, textTransform: 'uppercase' }}>{name}</h1>{role && <div style={{ marginTop: '10px', fontSize: '13px', letterSpacing: '.04em' }}>{role}</div>}</div><div>{contact('stack')}</div></header>
        <section style={{ minHeight: '182px', padding: '24px 26px', borderLeft: '1px solid #222' }}><h2 style={{ ...railLabel, fontSize: '12px' }}>{t(language, 'profile')}</h2>{profile()}</section>
        <aside style={{ padding: '24px 20px 0' }}>{column('side', {}, '23px')}</aside>
        <main style={{ padding: '23px 26px 0', borderLeft: '1px solid #222' }}>{column('main', {}, '22px')}</main>
      </div>
    </div>;
  }

  if (template === 'modern') {
    return <div style={{ ...page, padding: '30px 36px 40px', background: '#fff' }}>
      <header style={{ display: 'grid', gridTemplateColumns: personalInfo.photo ? 'minmax(0,1fr) 92px' : '1fr', gap: '24px', alignItems: 'center', padding: '7px 0 22px', borderBottom: '1px solid #777' }}><div><h1 style={{ margin: 0, color: 'inherit', fontSize: '34px', fontWeight: 700, letterSpacing: '-.04em' }}>{name}</h1>{role && <p style={{ margin: '5px 0 0', color: '#555', fontSize: '14px' }}>{role}</p>}</div>{photo(84, '50%', '1px solid #999')}</header>
      <div style={{ display: 'grid', gridTemplateColumns: '190px minmax(0,1fr)', gap: '28px', marginTop: '22px' }}><aside style={{ paddingRight: '20px', borderRight: '1px solid #d0d0d0' }}>{contact('stack')}<div style={{ marginTop: '26px' }}>{column('sidebar', {}, '22px')}</div></aside><main style={{ minWidth: 0 }}>{summary && <section style={{ marginBottom: '27px' }}><h2 style={railLabel}>{t(language, 'profile')}</h2>{profile()}</section>}{column('main', {}, '25px')}</main></div>
    </div>;
  }

  if (template === 'professional') {
    return <div style={{ ...page, padding: '0 35px 38px', background: '#fff', fontSize: '11px', lineHeight: 1.5 }}>
      <header style={{ position: 'relative', padding: '34px 0 19px 20px', borderBottom: '1px solid #bdbdbd' }}>
        <span style={{ position: 'absolute', inset: '31px auto 18px 0', width: '5px', background: '#262626' }} />
        <h1 style={{ margin: 0, color: 'inherit', fontSize: '34px', fontWeight: 600, lineHeight: 1.08, letterSpacing: '.055em', textTransform: 'uppercase' }}>{name}</h1>
        {role && <div style={{ marginTop: '6px', fontSize: '15px', letterSpacing: '.13em', textTransform: 'uppercase' }}>{role}</div>}
      </header>
      {contacts.length > 0 && <div style={{ margin: '0 0 21px', padding: '8px 10px', background: '#e9e9e9' }}>{contact('inline')}</div>}
      {summary && <section style={{ marginBottom: '20px' }}><h2 style={grayBar}>{t(language, 'profile')}</h2>{profile()}</section>}
      <main>{graySections('main', '17px')}</main>
    </div>;
  }

  if (template === 'slate') {
    return <div style={{ ...page, padding: '34px 40px 46px', background: '#fff' }}>
      <header style={{ padding: '10px 0 22px', borderBottom: '2px solid #222' }}><h1 style={{ margin: 0, color: 'inherit', fontSize: '36px', fontWeight: 500, letterSpacing: '-.03em' }}>{name}</h1>{role && <div style={{ marginTop: '4px', fontSize: '17px', letterSpacing: '.04em' }}>{role}</div>}{contacts.length > 0 && <div style={{ marginTop: '14px', padding: '8px 12px', background: '#ececec' }}>{contact('inline')}</div>}</header>
      {summary && <section style={{ marginTop: '21px' }}><h2 style={grayBar}>{t(language, 'profile')}</h2>{profile()}</section>}
      <main style={{ marginTop: '19px' }}>{graySections('main', '19px')}</main>
      {(region('sidebar').length > 0 || layoutEditor) && <footer style={{ marginTop: '24px', paddingTop: '18px', borderTop: '1px solid #aaa' }}>{column('sidebar', {}, '20px')}</footer>}
    </div>;
  }

  if (template === 'ivory') {
    return <div style={{ ...page, padding: '30px 36px 40px', background: '#fff' }}>
      <header style={{ display: 'grid', gridTemplateColumns: personalInfo.photo ? '102px minmax(0,1fr)' : '1fr', gap: '20px', alignItems: 'center', paddingBottom: '18px', borderBottom: '1px solid #393939' }}>
        {photo(94, '10px', '1px solid #aaa')}
        <div><h1 style={{ margin: 0, color: '#171717', fontSize: '30px', lineHeight: 1.05, fontWeight: 500, letterSpacing: '.14em', textTransform: 'uppercase' }}>{name}</h1>{role && <div style={{ marginTop: '6px', color: '#555', fontSize: '11px', letterSpacing: '.18em', textTransform: 'uppercase' }}>{role}</div>}</div>
      </header>
      <div style={{ display: 'grid', gridTemplateColumns: '220px minmax(0,1fr)', gap: '27px', marginTop: '20px' }}>
        <aside style={{ paddingRight: '17px', borderRight: '1px solid #444' }}>
          <h2 style={railLabel}>{t(language, 'contact')}</h2>{contact('stack')}
          <div style={{ marginTop: '24px' }}>{column('side', {}, '23px')}</div>
        </aside>
        <main style={{ minWidth: 0 }}>
          {summary && <section style={{ marginBottom: '25px' }}><h2 style={{ ...railLabel, letterSpacing: '.17em' }}>{t(language, 'profile')}</h2>{profile()}</section>}
          {column('main', {}, '24px')}
        </main>
      </div>
    </div>;
  }

  if (template === 'summit') {
    return <div style={{ ...page, padding: '28px 32px 38px', background: '#fff' }}>
      <header style={{ display: 'grid', gridTemplateColumns: '174px minmax(0,1fr)', gap: '22px', alignItems: 'center', paddingBottom: '20px', borderBottom: '2px solid #222' }}><aside style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>{photo(110, '50%', '2px solid #777')}{contact('stack')}</aside><div><div style={{ color: '#666', fontSize: '9px', letterSpacing: '.15em', textTransform: 'uppercase' }}>{t(language, 'profile')}</div><h1 style={{ margin: '8px 0 0', color: 'inherit', fontSize: '37px', lineHeight: 1 }}>{name}</h1>{role && <div style={{ marginTop: '7px', fontSize: '14px', color: '#555' }}>{role}</div>}{summary && <div style={{ marginTop: '17px' }}>{profile()}</div>}</div></header>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 205px', gap: '28px', marginTop: '24px' }}><main>{column('main', {}, '22px')}</main><aside style={{ borderLeft: '1px solid #c5c5c5', paddingLeft: '19px' }}>{column('side', {}, '23px')}</aside></div>
    </div>;
  }

  if (template === 'north') {
    return <div style={{ ...page, padding: '29px 34px 42px', background: '#fff' }}>
      <header style={{ display: 'grid', gridTemplateColumns: personalInfo.photo ? '6px minmax(0,1.2fr) minmax(165px,.72fr) 96px' : '6px minmax(0,1.2fr) minmax(165px,.72fr)', gap: '18px', alignItems: 'start', padding: '15px 0 20px', borderBottom: '1px solid #777' }}>
        <span style={{ height: '100%', minHeight: '142px', background: '#171717' }} />
        <div><h1 style={{ margin: 0, color: 'inherit', fontFamily: 'Arial, sans-serif', fontSize: '35px', fontWeight: 700, lineHeight: 1.05, letterSpacing: '.02em', textTransform: 'uppercase' }}>{name}</h1>{role && <div style={{ marginTop: '5px', fontSize: '14px', letterSpacing: '.12em', textTransform: 'uppercase' }}>{role}</div>}{summary && <div style={{ marginTop: '13px', fontSize: '10.5px', lineHeight: 1.55 }}>{profile()}</div>}</div>
        <div style={{ paddingTop: '4px' }}>{contact('stack')}</div>{photo(88, '0', 'none')}
      </header>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.48fr) minmax(180px,.76fr)', gap: '25px', marginTop: '20px' }}>
        <main style={{ minWidth: 0, paddingLeft: '8px' }}>{column('main', {}, '23px')}</main>
        <aside style={{ padding: '17px 17px 20px', background: '#f1f0ed', borderTop: '3px solid #252525' }}>{column('sidebar', {}, '21px')}</aside>
      </div>
    </div>;
  }

  if (template === 'studio') {
    return <div style={{ ...page, padding: '25px 34px 32px', background: '#fbfbf8', color: '#303721', fontFamily: "'Courier New', monospace", fontSize: '9.2px', lineHeight: 1.4 }}>
      <header style={{ paddingBottom: '19px', borderBottom: '1px solid #aeb49c' }}><div style={{ color: '#78845b' }}>{'"identity": {'}</div><h1 style={{ margin: '8px 0 4px 18px', color: 'inherit', fontSize: '31px', lineHeight: 1.05, overflowWrap: 'anywhere' }}><span style={{ color: '#778451' }}>{'"name":'}</span> {JSON.stringify(name)},</h1>{role && <div style={{ marginLeft: '18px' }}><span style={{ color: '#778451' }}>{'"role":'}</span> {JSON.stringify(role)},</div>}{contacts.length > 0 && <div style={{ margin: '10px 0 0 18px' }}>{contacts.map((item, index) => <div key={item.key}><span style={{ color: '#778451' }}>{`"${item.key}":`}</span> {JSON.stringify(item.value)}{index < contacts.length - 1 ? ',' : ''}</div>)}</div>}<div style={{ color: '#78845b' }}>{'}'},</div></header>
      {summary && <section style={{ margin: '14px 0 16px' }}><div style={jsonKey}>{'"profile": {'}</div><p style={{ margin: '4px 0 4px 18px', whiteSpace: 'pre-wrap' }}>{JSON.stringify(summary)}</p><div style={jsonKey}>{'},'}</div></section>}
      <div style={{ paddingLeft: '12px', borderLeft: '1px solid #c5c9b6' }}>
        <CustomSectionRegion sections={region('main')} regionKey="main" layoutEditor={layoutEditor} gap="12px" renderSection={(section) => <JsonSection section={section} />} />
        <CustomSectionRegion sections={region('side')} regionKey="side" layoutEditor={layoutEditor} gap="12px" renderSection={(section) => <JsonSection section={section} />} />
      </div>
      <div style={{ marginTop: '22px', textAlign: 'right', fontSize: '23px', fontWeight: 700, color: '#414a30' }}>{'};'}</div>
    </div>;
  }

  if (template === 'editorial') {
    return <div style={{ ...page, padding: '27px 31px 38px', background: '#fff' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '225px minmax(0,1fr)', gap: '25px', alignItems: 'start' }}>
        <aside>
          <header style={{ padding: '20px 17px 18px', border: '1px solid #999', borderRadius: '13px', textAlign: 'center', background: '#f3f3f2' }}>
            {photo(92, '50%', 'none')}
            <h1 style={{ margin: '12px 0 0', color: 'inherit', fontSize: '22px', lineHeight: 1.08, fontWeight: 500 }}>{name}</h1>
            {role && <div style={{ marginTop: '6px', color: '#666', fontSize: '11px' }}>{role}</div>}
          </header>
          <section style={{ marginTop: '17px', padding: '17px 16px', border: '1px solid #aaa', borderRadius: '13px' }}>
            <h2 style={railLabel}>{t(language, 'contact')}</h2>{contact('stack')}
            {summary && <div style={{ marginTop: '21px' }}><h2 style={railLabel}>{t(language, 'profile')}</h2>{profile()}</div>}
            <div style={{ marginTop: '22px' }}>{column('left', {}, '22px')}</div>
          </section>
        </aside>
        <main style={{ minWidth: 0 }}>
          <div style={{ marginBottom: '24px', padding: '4px 0 3px', borderBottom: '1px solid #aaa' }}>{column('right', {}, '22px')}</div>
          <div style={{ paddingLeft: '17px', borderLeft: '2px solid #b8b8b8' }}>{column('middle', {}, '26px')}</div>
        </main>
      </div>
    </div>;
  }

  if (template === 'vertex') {
    return <div style={{ ...page, padding: '27px 30px 38px', background: '#fff' }}>
      <header style={{ display: 'grid', gridTemplateColumns: personalInfo.photo ? 'minmax(0,1fr) 92px' : '1fr', alignItems: 'center', padding: '10px 17px', background: '#dedede', borderLeft: '12px solid #242424' }}><div><h1 style={{ margin: 0, color: 'inherit', fontSize: '32px', lineHeight: 1 }}>{name}</h1>{role && <div style={{ marginTop: '6px', letterSpacing: '.07em' }}>{role}</div>}</div>{photo(78, '0', '1px solid #777')}</header>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(210px,.8fr) minmax(0,1.5fr)', gap: '0 25px', marginTop: '20px' }}><aside style={{ padding: '4px 18px 20px 12px', background: '#ededed' }}>{contact('stack')}{summary && <section style={{ marginTop: '23px' }}><h2 style={railLabel}>{t(language, 'profile')}</h2>{profile()}</section>}<div style={{ marginTop: '24px' }}>{column('supportLeft', {}, '22px')}</div></aside><main style={{ padding: '4px 0 0' }}>{column('main', {}, '23px')}<div style={{ marginTop: '22px', paddingTop: '18px', borderTop: '1px solid #aaa' }}>{column('supportRight', {}, '20px')}</div></main></div>
    </div>;
  }

  if (template === 'quartz') {
    return <div style={{ ...page, padding: '28px 32px 40px', background: '#fff' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(190px, 30%) minmax(0,1fr)', gap: '27px' }}>
        <aside style={{ minWidth: 0, paddingRight: '17px', borderRight: '1px solid #777' }}>
          {personalInfo.photo && <div style={{ margin: '1px 0 21px' }}>{photo(90, '50%', 'none')}</div>}
          <section><h2 style={railLabel}>{t(language, 'contact')}</h2>{contact('stack')}</section>
          <div style={{ marginTop: '25px' }}>{column('side', {}, '23px')}</div>
        </aside>
        <main style={{ minWidth: 0, paddingTop: '2px' }}>
          <header style={{ padding: '0 0 15px', borderBottom: '1px solid #777' }}>
            <h1 style={{ margin: 0, color: 'inherit', fontSize: '30px', lineHeight: 1.05, fontWeight: 500, letterSpacing: '.015em', textTransform: 'uppercase' }}>{name}</h1>
            {role && <div style={{ marginTop: '5px', color: '#666', fontSize: '11px', letterSpacing: '.16em', textTransform: 'uppercase' }}>{role}</div>}
          </header>
          {summary && <section style={{ margin: '18px 0 22px' }}><h2 style={{ ...railLabel, paddingBottom: '7px', borderBottom: '1px solid #aaa' }}>{t(language, 'profile')}</h2><div style={{ lineHeight: 1.65 }}>{profile()}</div></section>}
          <div style={{ paddingLeft: '15px', borderLeft: '1px solid #b0b0b0' }}>{column('main', {}, '25px')}</div>
        </main>
      </div>
    </div>;
  }

  if (template === 'cobalt') {
    return <div style={{ ...page, padding: '28px 34px 42px', background: '#fff' }}>
      <header style={{ display: 'grid', gridTemplateColumns: personalInfo.photo ? '88px minmax(0,1fr) minmax(150px,.65fr)' : 'minmax(0,1fr) minmax(150px,.65fr)', gap: '19px', alignItems: 'center', padding: '4px 0 19px', borderBottom: '1px solid #333' }}>
        {photo(82, '50%', 'none')}
        <div><h1 style={{ margin: 0, color: 'inherit', fontSize: '34px', fontWeight: 500, letterSpacing: '.07em', textTransform: 'uppercase' }}>{name}</h1>{role && <div style={{ marginTop: '5px', fontSize: '11px', letterSpacing: '.2em', textTransform: 'uppercase' }}>{role}</div>}</div>
        <div>{contact('stack')}</div>
      </header>
      <div style={{ display: 'grid', gridTemplateColumns: '183px minmax(0,1fr)', gap: '26px', marginTop: '21px' }}>
        <aside style={{ padding: '8px 17px 0 0', borderRight: '1px solid #999' }}>{column('aside', {}, '24px')}</aside>
        <main style={{ minWidth: 0 }}>{summary && <section style={{ marginBottom: '25px' }}><h2 style={railLabel}>{t(language, 'profile')}</h2>{profile()}</section>}{column('main', {}, '24px')}</main>
      </div>
    </div>;
  }

  if (template === 'corvus') {
    return <div style={{ ...page, display: 'grid', gridTemplateColumns: '232px minmax(0,1fr)', gap: 0, padding: 0, background: '#fff' }}>
      <aside style={{ minHeight: '297mm', padding: '24px 18px 34px', background: '#d6d6d6', color: '#292929' }}>
        {personalInfo.photo && <div style={{ display: 'grid', placeItems: 'center', width: '124px', height: '124px', margin: '0 auto 23px', background: '#c3c3c3' }}>{photo(124, '0', 'none')}</div>}
        <h2 style={{ ...railLabel, color: '#292929' }}>{t(language, 'contact')}</h2>{contact('stack')}
        <div style={{ marginTop: '27px' }}>{column('aside', {}, '23px')}</div>
      </aside>
      <main style={{ minWidth: 0, padding: '28px 28px 40px' }}>
        <header style={{ position: 'relative', margin: '-28px -28px 23px', padding: '36px 28px 31px', background: '#d6d6d6', clipPath: 'polygon(0 0,100% 0,100% 82%,70% 100%,0 87%)' }}>
          <h1 style={{ margin: 0, color: 'inherit', fontSize: '34px', fontWeight: 700, lineHeight: 1.08 }}>{name}</h1>{role && <div style={{ marginTop: '7px', color: '#555', fontSize: '14px' }}>{role}</div>}
        </header>
        {summary && <section style={{ marginBottom: '25px' }}><h2 style={railLabel}>{t(language, 'profile')}</h2>{profile()}</section>}
        {column('main', {}, '24px')}
      </main>
    </div>;
  }

  if (template === 'insignia') {
    return <div style={{ ...page, minHeight: '297mm', padding: '21px', background: '#ffffff' }}>
      <div style={{ minHeight: '250mm', padding: '24px 28px 32px', background: '#fff', border: '1px solid #d4d4d4', boxShadow: 'none' }}>
        <header style={{ display: 'grid', gridTemplateColumns: personalInfo.photo ? '68px minmax(0,1fr) minmax(180px,.8fr)' : 'minmax(0,1fr) minmax(180px,.8fr)', gap: '18px', alignItems: 'center', paddingBottom: '18px', borderBottom: '1px solid #bbb' }}>
          {personalInfo.photo && photo(62, '0', 'none')}
          <div><h1 style={{ margin: 0, color: 'inherit', fontSize: '27px', fontWeight: 600, letterSpacing: '.055em', textTransform: 'uppercase' }}>{name}</h1>{role && <div style={{ marginTop: '5px', color: '#555', fontSize: '10px', letterSpacing: '.16em', textTransform: 'uppercase' }}>{role}</div>}</div>
          <div style={{ paddingLeft: '17px', borderLeft: '1px solid #ccc' }}>{contact('stack')}</div>
        </header>
        <div style={{ display: 'grid', gridTemplateColumns: '174px minmax(0,1fr)', gap: '24px', marginTop: '20px' }}>
          <aside style={{ paddingRight: '18px', borderRight: '1px solid #ccc' }}>{column('sidebar', {}, '24px')}</aside>
          <main style={{ minWidth: 0 }}>
            {summary && <section style={{ marginBottom: '25px' }}><h2 style={{ ...railLabel, paddingBottom: '8px', borderBottom: '1px solid #aaa' }}>{t(language, 'profile')}</h2>{profile()}</section>}
            {column('main', {}, '25px')}
          </main>
        </div>
      </div>
    </div>;
  }

  if (template === 'bulletin') {
    return <div style={{ ...page, padding: '30px 34px 39px', background: '#fff' }}>
      <header style={{ display: 'grid', gridTemplateColumns: personalInfo.photo ? 'minmax(0,1fr) 74px' : '1fr', gap: '18px', alignItems: 'center', padding: '4px 0 18px', borderBottom: '2px solid #333' }}><div><h1 style={{ margin: 0, color: 'inherit', fontSize: '30px', letterSpacing: '.03em' }}>{name}</h1>{role && <div style={{ marginTop: '4px', fontSize: '11px', letterSpacing: '.12em', textTransform: 'uppercase' }}>{role}</div>}</div>{photo(68, '0', '1px solid #777')}</header>
      <div style={{ display: 'grid', gridTemplateColumns: '164px minmax(0,1fr)', gap: '24px', marginTop: '21px' }}><aside style={{ paddingRight: '16px', borderRight: '1px solid #999' }}><h2 style={railLabel}>{t(language, 'contact')}</h2>{contact('stack')}{summary && <section style={{ marginTop: '23px' }}><h2 style={railLabel}>{t(language, 'profile')}</h2>{profile()}</section>}<div style={{ marginTop: '23px' }}>{column('side', {}, '22px')}</div></aside><main style={{ position: 'relative', paddingLeft: '17px', borderLeft: '1px solid #aaa' }}>{column('main', {}, '24px')}</main></div>
    </div>;
  }

  if (template === 'verso') {
    return <div style={{ ...page, padding: '32px 37px 40px', background: '#fff' }}>
      <header style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 70px', gap: '20px', alignItems: 'center', paddingBottom: '19px', borderBottom: '2px solid #393939' }}><div><h1 style={{ margin: 0, color: 'inherit', fontSize: '32px', fontWeight: 300, letterSpacing: '.13em', textTransform: 'uppercase' }}>{name}</h1>{role && <div style={{ marginTop: '6px', fontSize: '10px', letterSpacing: '.2em', textTransform: 'uppercase' }}>{role}</div>}</div><div style={{ display: 'grid', placeItems: 'center', width: '66px', height: '66px', border: '1px solid #333', borderRadius: '50%', fontSize: '13px', letterSpacing: '.1em' }}>{initials}</div></header>
      <div style={{ display: 'grid', gridTemplateColumns: '160px minmax(0,1fr)', gap: '28px', marginTop: '24px' }}><aside style={{ paddingRight: '18px', borderRight: '1px solid #333' }}><h2 style={railLabel}>{t(language, 'contact')}</h2>{contact('stack')}{column('side', { marginTop: '27px' }, '25px')}</aside><main style={{ minWidth: 0 }}>{summary && <section style={{ marginBottom: '26px' }}><h2 style={railLabel}>{t(language, 'profile')}</h2>{profile()}</section>}{column('main', {}, '25px')}</main></div>
    </div>;
  }

  if (template === 'hexon') {
    const hexonColumn = (key: string, gap = '21px') => (
      <CustomSectionRegion
        sections={region(key)}
        regionKey={key}
        layoutEditor={layoutEditor}
        gap={gap}
        renderSection={(section) => (
          <section>
            <HexonSectionHeading title={section.title} type={section.type} />
            <SectionBlockBody section={section} theme={theme} />
          </section>
        )}
      />
    );

    return <div style={{ ...page, padding: 0, background: '#ffffff', border: '1px solid #d8d8d8' }}>
      <header style={{ position: 'relative', overflow: 'hidden', padding: '13px 27px 12px 34px', color: '#282828', background: '#ffffff' }}>
        <span style={{ position: 'absolute', inset: '0 auto 0 0', width: '6px', background: '#555555' }} />
        <div style={{ position: 'absolute', top: 0, right: 0, width: '32%', height: '100%', background: '#f2f2f2', clipPath: 'polygon(28% 0,100% 0,100% 100%,0 100%)' }} />
        <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: personalInfo.photo ? 'minmax(0,1fr) 70px' : 'minmax(0,1fr)', gap: '18px', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: 0, color: 'inherit', fontSize: '27px', lineHeight: 1.05, fontWeight: 700, letterSpacing: '.025em', textTransform: 'uppercase', overflowWrap: 'anywhere' }}>{name}</h1>
            {role && <div style={{ marginTop: '4px', color: '#666666', fontSize: '11px', fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase' }}>{role}</div>}
          </div>
          {personalInfo.photo && <div style={{ justifySelf: 'end', padding: '4px', border: '1px solid #8c8c8c', background: '#ffffff', boxShadow: '3px 3px 0 #e2e2e2' }}>{photo(58, '0', 'none')}</div>}
        </div>
      </header>
      {contacts.length > 0 && <div style={{ position: 'relative', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', columnGap: '20px', rowGap: '10px', padding: '11px 27px', background: '#f7f7f7' }}>
        <span style={{ position: 'absolute', inset: '0 auto 0 0', width: '6px', background: '#555555' }} />
        {contacts.map((item) => <span key={item.key} style={{ display: 'inline-flex', minWidth: 0, alignItems: 'center', gap: '6px', color: '#333333', fontSize: '8px', lineHeight: 1.35 }}>
          <span style={{ display: 'inline-flex', flex: '0 0 14px', width: '14px', height: '14px', alignItems: 'center', justifyContent: 'center', color: '#454545' }}><ContactIcon name={item.icon} style={{ display: 'block', width: '13px', height: '13px' }} /></span>
          <LinkedText href={item.href} style={{ minWidth: 0, overflowWrap: 'anywhere' }}>{item.value}</LinkedText>
        </span>)}
      </div>}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.55fr) minmax(185px,.82fr)', gap: '24px', padding: '22px 25px 32px' }}>
        <main style={{ minWidth: 0 }}>
          {summary && <section style={{ marginBottom: '23px', padding: '14px 16px', background: '#ffffff', borderLeft: '3px solid #666666', boxShadow: '0 2px 8px rgba(0,0,0,.035)' }}>
            <HexonSectionHeading title={t(language, 'profile')} type="profile" />
            {profile()}
          </section>}
          {hexonColumn('main', '23px')}
        </main>
        <aside style={{ minWidth: 0, padding: '16px 15px', background: '#f6f6f6', borderTop: '3px solid #666666', borderBottom: '1px solid #d8d8d8' }}>
          {hexonColumn('sidebar', '23px')}
        </aside>
      </div>
    </div>;
  }

  if (template === 'signal') {
    return <div style={{ ...page, padding: '0', background: '#f5f7f8' }}>
      <header style={{ display: 'grid', gridTemplateColumns: personalInfo.photo ? 'minmax(0,1fr) 105px' : '1fr', gap: '22px', alignItems: 'center', padding: '29px 36px 20px', color: '#fff', background: '#24353b', borderBottom: '5px solid #5d8792' }}><div><div style={{ fontSize: '9px', letterSpacing: '.2em', color: '#a9c3ca' }}>{t(language, 'profile').toUpperCase()}</div><h1 style={{ margin: '7px 0 0', color: 'inherit', fontSize: '32px', lineHeight: 1.02 }}>{name}</h1>{role && <div style={{ marginTop: '5px', color: '#d5e0e3' }}>{role}</div>}</div>{photo(90, '3px', '1px solid #b7c8cc')}</header>
      <div style={{ padding: '14px 36px 0' }}>{contact('inline')}</div>
      {summary && <section style={{ margin: '17px 36px 22px', padding: '14px 16px', background: '#e8f0f2', borderLeft: '3px solid #276879' }}><h2 style={railLabel}>{t(language, 'profile')}</h2>{profile()}</section>}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.55fr) minmax(190px,.75fr)', gap: '27px', padding: '0 36px 38px' }}><main>{column('main', {}, '22px')}</main><aside style={{ padding: '15px 17px', background: '#edf2f3', borderTop: '3px solid #506d76' }}>{column('side', {}, '21px')}</aside></div>
    </div>;
  }

  return <div style={{ ...page, display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 190px', gap: '28px' }}><main><h1 style={{ marginTop: 0, color: 'inherit' }}>{name}</h1>{role && <div>{role}</div>}{profile()}{column('main')}</main><aside>{contact()}{column('side')}</aside></div>;
}

function getPrimaryRole(sections: CVSection[]) {
  const experience = sections.find((section) => section.type === 'experience');
  return experience?.entries.map((entry) => entry.fields.position?.trim()).find(Boolean) ?? '';
}

function HexonSectionHeading({ title, type }: { title: string; type: CVSection['type'] | 'profile' | 'contact' }) {
  return (
    <h2 style={{ display: 'flex', alignItems: 'center', gap: '9px', margin: '0 0 12px', color: '#303030', fontSize: '11px', fontWeight: 800, letterSpacing: '.11em', lineHeight: 1.2, textTransform: 'uppercase' }}>
      <span style={{ display: 'inline-flex', flex: '0 0 18px', width: '18px', height: '18px', alignItems: 'center', justifyContent: 'center', color: '#454545' }}>
        <HexonSectionGlyph type={type} />
      </span>
      <span>{title}</span>
      <span style={{ flex: 1, height: '1px', marginLeft: '2px', background: 'linear-gradient(90deg,#c4c4c4,transparent)' }} />
      <span style={{ display: 'inline-block', flex: '0 0 5px', width: '5px', height: '5px', background: '#8a8a8a', transform: 'rotate(45deg)' }} />
    </h2>
  );
}

function HexonSectionGlyph({ type }: { type: CVSection['type'] | 'profile' | 'contact' }) {
  const common: SVGProps<SVGSVGElement> = { viewBox: '0 0 24 24', width: '15', height: '15', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round', display: 'block', 'aria-hidden': true };

  switch (type) {
    case 'contact':
      return <svg {...common}><rect x="3.5" y="5" width="17" height="14" rx="2" /><path d="m5 7 7 5 7-5" /></svg>;
    case 'profile':
      return <svg {...common}><circle cx="12" cy="8" r="3" /><path d="M5.5 20c.6-3.4 2.8-5.2 6.5-5.2s5.9 1.8 6.5 5.2" /></svg>;
    case 'experience':
      return <svg {...common}><rect x="3.5" y="7" width="17" height="12" rx="1.5" /><path d="M8 7V5.5A1.5 1.5 0 0 1 9.5 4h5A1.5 1.5 0 0 1 16 5.5V7m-12 4h16m-10 0v2h4v-2" /></svg>;
    case 'education':
      return <svg {...common}><path d="m2.5 9 9.5-5 9.5 5-9.5 5-9.5-5Z" /><path d="M6 11v5c3.7 2.7 8.3 2.7 12 0v-5m3.5-2v6" /></svg>;
    case 'skills':
      return <svg {...common}><path d="m12 3 2 4 4.5.7-3.2 3.1.8 4.5-4.1-2.1-4.1 2.1.8-4.5-3.2-3.1L10 7l2-4Z" /><path d="M5 19h14" /></svg>;
    case 'languages':
      return <svg {...common}><circle cx="12" cy="12" r="8.5" /><path d="M3.8 12h16.4M12 3.5a13.5 13.5 0 0 1 0 17m0-17a13.5 13.5 0 0 0 0 17" /></svg>;
    case 'projects':
      return <svg {...common}><path d="m8.5 7-5 5 5 5m7-10 5 5-5 5m-2.5-12-2 14" /></svg>;
    case 'certifications':
      return <svg {...common}><circle cx="12" cy="9" r="5.5" /><path d="m8.5 13.2-1 7 4.5-2.5 4.5 2.5-1-7" /><path d="m10 9 1.3 1.3L14.5 7" /></svg>;
    default:
      return <svg {...common}><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" /><path d="m4 7.5 8 4.7 8-4.7M12 12.2V21" /></svg>;
  }
}

function JsonSection({ section }: { section: CVSection }) {
  const detailKeys = new Set(['position', 'degree', 'name', 'title', 'language', 'institution', 'company', 'issuer', 'startDate', 'endDate', 'date', 'isCurrent', 'showStartOnly', 'showEndOnly', 'description']);
  return <section style={{ color: '#414a30' }}>
    <div style={jsonKey}>{JSON.stringify(section.title)}: [</div>
    {section.entries.map((entry) => {
      const extra = Object.entries(entry.fields).filter(([key, value]) => !detailKeys.has(key) && value?.trim());
      const details = getEntryDetailLines(entry);
      const subtitle = getEntrySubtitle(entry);
      const date = getEntryDate(entry);
      return <div key={entry.id} style={{ margin: '4px 0 6px 18px', overflowWrap: 'anywhere' }}>
        <div style={{ color: '#42483a' }}>
          <span style={{ color: '#73804e' }}>{'{'}</span> <span style={{ color: '#73804e' }}>{'"title":'}</span> {JSON.stringify(getEntryTitle(entry))}
          {subtitle && <>, <span style={{ color: '#73804e' }}>{'"organization":'}</span> {JSON.stringify(subtitle)}</>}
          {date && <>, <span style={{ color: '#73804e' }}>{'"period":'}</span> {JSON.stringify(date)}</>}
          {extra.map(([key, value]) => <Fragment key={key}>, <span style={{ color: '#73804e' }}>{JSON.stringify(key)}:</span> {JSON.stringify(value)}</Fragment>)}
          {details.length === 0 && <span> {'}'}</span>}
        </div>
        {details.map((detail, detailIndex) => <div key={`${entry.id}-${detailIndex}`} style={{ marginLeft: '16px', color: '#68704e' }}>{`// ${detail}`}</div>)}
        {details.length > 0 && <div style={{ marginLeft: '16px', color: '#73804e' }}>{'},'}</div>}
      </div>;
    })}
    <div style={jsonKey}>],</div>
  </section>;
}

const railLabel: CSSProperties = { margin: '0 0 9px', color: '#4e5152', fontSize: '10px', fontWeight: 700, letterSpacing: '.14em', lineHeight: 1.3, textTransform: 'uppercase' };
const grayBar: CSSProperties = { margin: '0 0 10px', padding: '5px 9px', background: '#e9e9e9', color: '#222', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase' };
const jsonKey: CSSProperties = { color: '#73804e', whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' };
