import type { CSSProperties, ReactNode } from 'react';
import { t } from '../../i18n';
import { useCVStore } from '../../store/cvStore';
import type { CVData, CVEntry, CVSection } from '../../types/cv';
import { TEMPLATE_THEMES } from './templateCatalog';
import { ensureTemplateLayout, getSectionsForRegion } from './templateLayout';
import { getContactItems, getEntryDate, getEntryDetailLines, getEntrySubtitle, getEntryTitle, getResumeRole, toExternalHref } from './templateUtils';
import { CustomSectionRegion, LinkedText, SummaryBlock, type TemplateLayoutEditor } from './templateComponents';

export default function Summit({ data, layoutEditor }: { data: CVData; layoutEditor?: TemplateLayoutEditor }) {
  const language = useCVStore((state) => state.language);
  const theme = { ...TEMPLATE_THEMES.summit, entryStyle: 'plain' as const, accent: '#111111', accentSoft: '#f1f1f1', summaryStyle: 'plain' as const };
  const { personalInfo, sections } = data;
  const layout = ensureTemplateLayout('summit', data.layoutOverride, sections);
  const mainSections = getSectionsForRegion(sections, layout, 'main');
  const sideSections = getSectionsForRegion(sections, layout, 'side');
  const name = personalInfo.fullName || t(language, 'fullName');
  const role = getResumeRole(personalInfo);
  const contacts = getContactItems(personalInfo, language);
  const orderedContacts = [
    ...contacts.filter((item) => item.key === 'location'),
    ...contacts.filter((item) => item.key === 'phone'),
    ...contacts.filter((item) => item.key === 'email'),
    ...contacts.filter((item) => item.key !== 'location' && item.key !== 'phone' && item.key !== 'email'),
  ];
  const summary = personalInfo.summary.trim();
  const renderSection = (section: CVSection) => <ApexSection key={section.id} section={section} language={language} />;

  return (
    <div style={{ minHeight: '297mm', boxSizing: 'border-box', padding: '0 35px 40px', background: '#ffffff', color: '#252525', fontFamily: "Arial, 'Helvetica Neue', sans-serif", fontSize: 10.5, lineHeight: 1.55 }}>
      <header style={{ display: 'grid', gridTemplateColumns: '68px minmax(0,1fr)', minHeight: 102, margin: '0 -35px', padding: '0 35px 12px' }}>
        <div aria-label="Apex cube mark" style={{ display: 'grid', placeItems: 'center', alignSelf: 'start', width: 68, height: 74, color: '#111111' }}>
          <svg viewBox="0 0 64 64" role="img" aria-hidden="true" style={{ width: 52, height: 52 }}>
            <path d="M32 4 56 18 32 32 8 18 32 4ZM8 18v28l24 14 24-14V18M32 32v28" fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
          </svg>
        </div>
        <div style={{ minWidth: 0, padding: '22px 16px 0', background: 'linear-gradient(180deg, #f1f1f1 0 68px, #ffffff 68px 100%)' }}>
          <h1 style={{ margin: 0, color: '#080808', fontSize: 38, fontWeight: 750, lineHeight: 1.02, letterSpacing: '-.045em', overflowWrap: 'anywhere' }}>{name}</h1>
          {role && <div style={{ marginTop: 4, color: '#555555', fontSize: 15, fontWeight: 600, lineHeight: 1.25 }}>{role}</div>}
        </div>
      </header>

      {orderedContacts.length > 0 && (
        <ApexRow label={t(language, 'contact')}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', columnGap: 28, rowGap: 9 }}>
            {orderedContacts.map((item) => {
              const href = item.href || (item.key === 'email' ? `mailto:${item.value}` : item.key === 'phone' ? `tel:${item.value.replace(/[^+\d]/g, '')}` : undefined);
              return <LinkedText key={item.key} href={href} style={{ minWidth: 0, color: '#4f4f4f', fontSize: 10.5, textDecoration: href ? 'underline' : 'none', overflowWrap: 'anywhere' }}>{item.value}</LinkedText>;
            })}
          </div>
        </ApexRow>
      )}

      {summary && (
        <ApexRow label={language === 'en' ? 'About me' : t(language, 'profile')} style={{ marginTop: 23 }}>
          <SummaryBlock summary={summary} theme={theme} />
        </ApexRow>
      )}

      <main style={{ display: 'flex', flexDirection: 'column', gap: 22, marginTop: 22 }}>
        <CustomSectionRegion sections={mainSections} regionKey="main" layoutEditor={layoutEditor} gap="22px" renderSection={renderSection} />
        <CustomSectionRegion sections={sideSections} regionKey="side" layoutEditor={layoutEditor} gap="22px" renderSection={renderSection} />
      </main>
    </div>
  );
}

function ApexRow({ children, label, style = {} }: { children: ReactNode; label: string; style?: CSSProperties }) {
  return (
    <section style={{ display: 'grid', gridTemplateColumns: 'minmax(174px,.34fr) minmax(0,1fr)', gap: 24, alignItems: 'start', marginTop: 18, ...style }}>
      <h2 style={apexLabel}>{label}</h2>
      <div style={{ minWidth: 0, color: '#555555' }}>{children}</div>
    </section>
  );
}

function ApexSection({ section, language }: { section: CVSection; language: string }) {
  if (section.type === 'skills') {
    return <ApexRow label={section.title} style={{ marginTop: 0 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: '8px 22px' }}>
        {section.entries.map((entry) => <div key={entry.id} style={{ color: '#333333', overflowWrap: 'anywhere' }}><span style={{ marginRight: 7, color: '#111111' }}>•</span>{entry.fields.name || getEntryTitle(entry)}</div>)}
      </div>
    </ApexRow>;
  }

  if (section.type === 'languages') {
    return <ApexRow label={section.title} style={{ marginTop: 0 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: '8px 24px' }}>
        {section.entries.map((entry) => <div key={entry.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, color: '#333333' }}><span>{entry.fields.language || getEntryTitle(entry)}</span><span style={{ color: '#777777' }}>{entry.fields.proficiency}</span></div>)}
      </div>
    </ApexRow>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
      {section.entries.map((entry, index) => {
        const date = getEntryDate(entry, language);
        return (
          <article key={entry.id} style={{ display: 'grid', gridTemplateColumns: 'minmax(174px,.34fr) minmax(0,1fr)', gap: 24, alignItems: 'start' }}>
            <div style={{ minWidth: 0 }}>
              {index === 0 && <h2 style={{ ...apexLabel, marginBottom: date ? 11 : 0 }}>{section.title}</h2>}
              {date && <div style={{ color: '#777777', fontSize: 10.5, lineHeight: 1.45 }}>{date}</div>}
            </div>
            <div style={{ minWidth: 0, paddingTop: index === 0 && date ? 26 : 0 }}>
              <ApexEntry entry={entry} />
            </div>
          </article>
        );
      })}
      {section.entries.length === 0 && <ApexRow label={section.title} style={{ marginTop: 0 }}><div /></ApexRow>}
    </div>
  );
}

function ApexEntry({ entry }: { entry: CVEntry }) {
  const title = getEntryTitle(entry);
  const subtitle = getEntrySubtitle(entry);
  const details = getEntryDetailLines(entry);
  const url = entry.fields.url?.trim();
  const technologies = entry.fields.technologies?.trim();

  return (
    <div style={{ minWidth: 0, color: '#444444' }}>
      <div style={{ color: '#282828', fontSize: 11.5, lineHeight: 1.35 }}>
        <strong>{title}</strong>{subtitle && <><span>, </span><strong><em>{subtitle}</em></strong></>}
      </div>
      {entry.fields.location && <div style={{ marginTop: 2, color: '#686868' }}>{entry.fields.location}</div>}
      {details.map((detail, index) => <p key={`${entry.id}-${index}`} style={{ margin: '8px 0 0', color: '#555555', lineHeight: 1.45 }}>{detail}</p>)}
      {technologies && <div style={{ marginTop: 7, color: '#666666', fontSize: 9.5 }}>{technologies}</div>}
      {url && <div style={{ maxWidth: '100%', marginTop: 5, overflowWrap: 'anywhere' }}><LinkedText href={toExternalHref(url)} style={{ color: '#555555', textDecoration: 'underline', overflowWrap: 'anywhere' }}>{url}</LinkedText></div>}
    </div>
  );
}

const apexLabel: CSSProperties = { margin: 0, color: '#111111', fontSize: 12.5, fontWeight: 700, lineHeight: 1.35 };
