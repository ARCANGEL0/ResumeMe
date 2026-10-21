import { t, getSocialPlatformLabel } from '../../i18n';
import { useCVStore } from '../../store/cvStore';
import type { CVData, CVEntry, CVSection } from '../../types/cv';
import { TEMPLATE_THEMES } from './templateCatalog';
import { ensureTemplateLayout, getSectionsForRegion } from './templateLayout';
import {
  getContactItems,
  getEntryDate,
  getEntryDetailLines,
  getEntrySubtitle,
  getEntryTitle,
  normalizeLanguageProficiency,
  toExternalHref,
} from './templateUtils';
import { CustomSectionRegion, LinkedText, ResumeUrl, type TemplateLayoutEditor } from './templateComponents';

export default function Europass({ data, layoutEditor }: { data: CVData; layoutEditor?: TemplateLayoutEditor }) {
  const language = useCVStore((state) => state.language);
  const { personalInfo, sections } = data;
  const theme = TEMPLATE_THEMES.europass;
  const layout = ensureTemplateLayout('europass', data.layoutOverride, sections);
  const mainSections = getSectionsForRegion(sections, layout, 'main');
  const contactItems = getContactItems(personalInfo, language);
  const name = personalInfo.fullName || t(language, 'fullName');
  const showBranding = data.showEuropassBranding ?? true;
  const birthDate = formatEuropassDate(personalInfo.dateOfBirth || '');
  const details: Array<{ key: string; label: string; value: string; href?: string }> = [
    { key: 'dateOfBirth', label: t(language, 'dateOfBirth'), value: birthDate },
    { key: 'nationality', label: 'Nationality', value: personalInfo.nationality || '' },
    { key: 'gender', label: 'Gender', value: personalInfo.gender || '' },
    { key: 'phone', label: `${t(language, 'phone')} number`, value: personalInfo.phone },
    { key: 'email', label: `${t(language, 'email')} address`, value: personalInfo.email },
    { key: 'location', label: t(language, 'location'), value: personalInfo.location },
    ...contactItems.filter((item) => item.type === 'social').map((item) => {
      const social = personalInfo.socials.find((entry) => entry.id === item.key);
      return {
        key: item.key,
        label: social ? getSocialPlatformLabel(language, social.platform) : 'Link',
        value: social?.value || item.value,
        href: item.href,
      };
    }),
  ].filter((item) => item.value.trim());

  return (
    <div style={{ minHeight: '297mm', boxSizing: 'border-box', padding: '0 18px 38px', background: '#ffffff', color: theme.text, fontFamily: theme.fontFamily, fontSize: '11px', lineHeight: 1.5 }}>
      <header style={{ margin: '0 -18px 14px', padding: '22px 18px 18px', background: '#ffffff' }}>
        {showBranding && <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '11px' }}><EuropassBrand /></div>}
        <h1 style={{ margin: '0', color: '#000000', fontSize: '24px', fontWeight: 750, lineHeight: 1.15, overflowWrap: 'anywhere' }}>{name}</h1>
        <div style={{ height: '3px', margin: '12px 0 15px', background: '#000000' }} />
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', rowGap: '9px', color: '#000000', fontSize: '11px', lineHeight: 1.4 }}>
          {details.map((detail, index) => <span key={detail.key} style={{ display: 'inline-flex', alignItems: 'baseline', gap: '3px', maxWidth: '100%', paddingRight: '10px', marginRight: '10px', borderRight: index < details.length - 1 ? '1px solid #000000' : 'none' }}>
            <strong style={{ whiteSpace: 'nowrap' }}>{detail.label}:</strong>
            <LinkedText href={detail.href ? toExternalHref(detail.href) : undefined} style={{ overflowWrap: 'anywhere' }}>{detail.value}</LinkedText>
          </span>)}
        </div>
      </header>

      {personalInfo.summary.trim() && <section style={{ marginBottom: '22px' }}>
        <EuropassSectionHeading title={t(language, 'profile')} />
        <p style={{ margin: '0 0 0 20px', color: '#000000', lineHeight: 1.55 }}>{personalInfo.summary.trim()}</p>
      </section>}

      <CustomSectionRegion
        sections={mainSections}
        regionKey="main"
        layoutEditor={layoutEditor}
        gap="22px"
        renderSection={(section) => (
          <section>
            <EuropassSectionHeading title={section.title} />
            <EuropassSectionBody section={section} language={language} />
          </section>
        )}
      />
    </div>
  );
}

function EuropassBrand() {
  return (
    <div aria-label="Europass" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', color: '#6d2e83' }}>
      <EuFlag />
      <span style={{ fontSize: '27px', fontWeight: 700, letterSpacing: '-.045em', lineHeight: 1 }}>europass</span>
    </div>
  );
}

function EuFlag() {
  const stars = Array.from({ length: 12 }, (_, index) => {
    const angle = ((index * 30) - 90) * Math.PI / 180;
    const x = 30 + Math.cos(angle) * 10;
    const y = 20 + Math.sin(angle) * 10;
    return <path key={index} transform={`translate(${x} ${y})`} d="M0-2.3.55-.72H2.2L.82.25l.53 1.58L0 .86l-1.35.97L-.82.25-2.2-.72h1.65L0-2.3Z" />;
  });

  return (
    <svg role="img" aria-label="European Union flag" viewBox="0 0 60 40" width="60" height="40" style={{ display: 'block', flex: '0 0 auto' }}>
      <rect width="60" height="40" fill="#003399" />
      <g fill="#ffcc00">{stars}</g>
    </svg>
  );
}

function EuropassSectionHeading({ title }: { title: string }) {
  return (
    <div style={{ position: 'relative', margin: '0 0 13px 20px', paddingBottom: '4px', borderBottom: '3px solid #000000' }}>
      <span aria-hidden="true" style={{ position: 'absolute', top: '7px', left: '-21px', width: '8px', height: '8px', borderRadius: '50%', background: '#000000' }} />
      <h2 style={{ margin: 0, color: '#000000', fontSize: '14px', fontWeight: 800, lineHeight: 1.25, textTransform: 'uppercase' }}>{title}</h2>
    </div>
  );
}

function EuropassSectionBody({ section, language }: { section: CVSection; language: string }) {
  if (section.type === 'skills') {
    const skills = section.entries.map((entry) => entry.fields.name || entry.fields.title).filter(Boolean);
    return <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 0', marginLeft: '20px', fontSize: '12px' }}>
      {skills.map((skill, index) => <span key={`${skill}-${index}`} style={{ paddingRight: '10px', marginRight: '10px', borderRight: index < skills.length - 1 ? '1px solid #000000' : 'none' }}>{skill}</span>)}
    </div>;
  }

  if (section.type === 'languages') {
    return <EuropassLanguageTable section={section} />;
  }

  return <div style={{ display: 'flex', flexDirection: 'column', gap: '17px', marginLeft: '20px' }}>
    {section.entries.map((entry) => <EuropassEntry key={entry.id} entry={entry} language={language} sectionType={section.type} />)}
  </div>;
}

function EuropassEntry({ entry, language, sectionType }: { entry: CVEntry; language: string; sectionType: CVSection['type'] }) {
  const date = getEntryDate(entry, language);
  const location = entry.fields.location || entry.fields.city || '';
  const title = getEntryTitle(entry);
  const subtitle = getEntrySubtitle(entry);
  const details = getEntryDetailLines(entry);
  const technologies = entry.fields.technologies?.trim();

  return (
    <article style={{ breakInside: 'avoid' }}>
      {(date || location) && <div style={{ marginBottom: '1px', color: '#000000', fontSize: '11px' }}>{[date, location].filter(Boolean).join('   ')}</div>}
      <div style={{ paddingBottom: '3px', borderBottom: '3px solid #000000', color: '#000000', fontSize: '14px', lineHeight: 1.3 }}>
        <strong style={{ color: '#000000', fontWeight: 800, textTransform: 'uppercase' }}>{title}</strong>
        {subtitle && <span> {subtitle}</span>}
      </div>
      {details.length > 0 && <ul style={{ margin: '12px 0 0 18px', padding: 0, color: '#000000', fontSize: '12px', lineHeight: 1.48 }}>
        {details.map((detail, index) => <li key={`${index}-${detail}`}>{detail}</li>)}
      </ul>}
      {technologies && <div style={{ marginTop: '7px', color: '#000000', fontSize: '11px' }}><strong>Technologies:</strong> {technologies}</div>}
      {entry.fields.url && <div style={{ marginTop: '7px', fontSize: '11px' }}><ResumeUrl value={entry.fields.url} sectionType={sectionType} style={{ color: '#000000' }} /></div>}
    </article>
  );
}

function EuropassLanguageTable({ section }: { section: CVSection }) {
  const entries = section.entries.map((entry) => ({ entry, language: entry.fields.language || entry.fields.name || entry.fields.title, level: normalizeLanguageProficiency(entry.fields.proficiency || '') || entry.fields.proficiency || '' })).filter((item) => item.language);
  if (!entries.length) return null;

  return <div style={{ marginLeft: '20px' }}>
    <div style={{ marginBottom: '7px', fontSize: '12px' }}>Other language(s):</div>
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
      <thead><tr style={{ background: '#ffffff', textAlign: 'left' }}>
        <th style={{ padding: '7px 9px', borderBottom: '1px solid #000000' }}>Language</th>
        <th style={{ padding: '7px 9px', borderBottom: '1px solid #000000' }}>CEFR level</th>
      </tr></thead>
      <tbody>{entries.map(({ entry, language, level }) => <tr key={entry.id} style={{ background: '#ffffff' }}>
        <th scope="row" style={{ padding: '7px 9px', textAlign: 'left', textTransform: 'uppercase', borderBottom: '1px solid #000000' }}>{language}</th>
        <td style={{ padding: '7px 9px', borderBottom: '1px solid #000000' }}>{level}</td>
      </tr>)}</tbody>
    </table>
    <div style={{ marginTop: '7px', color: '#000000', fontSize: '10px', fontStyle: 'italic' }}>Levels: A1 and A2 Basic user; B1 and B2 Independent user; C1 and C2 Proficient user</div>
  </div>;
}

function formatEuropassDate(value: string) {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return match ? `${match[3]}/${match[2]}/${match[1]}` : value;
}
