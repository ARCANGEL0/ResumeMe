import { useMemo, type CSSProperties } from 'react';
import { t } from '../../i18n';
import { useCVStore } from '../../store/cvStore';
import type { CVData, CVEntry, CVSection } from '../../types/cv';
import { ensureTemplateLayout, getSectionsForRegion } from './templateLayout';
import { getContactItems, getEntryDate, getEntryDetailLines, getEntrySubtitle, getEntryTitle, getSkillLevelScore } from './templateUtils';

interface Props {
  data: CVData;
}

export default function Sarif({ data }: Props) {
  const language = useCVStore((state) => state.language);
  const { personalInfo, sections } = data;
  const layoutState = ensureTemplateLayout('sarif', data.layoutOverride, sections);
  const displayName = personalInfo.fullName || t(language, 'fullName');
  const contactItems = getContactItems(personalInfo);
  const summary = personalInfo.summary.trim();
  const mainSections = getSectionsForRegion(sections, layoutState, 'main');

  const pageStyle = useMemo<CSSProperties>(
    () => ({
      fontFamily: "'Electrolize', 'Segoe UI', sans-serif",
      fontSize: '12px',
      lineHeight: '1.65',
      color: '#e0e0e0',
      background: '#0d0d0d',
      minHeight: '297mm',
      position: 'relative',
      overflow: 'hidden',
    }),
    [],
  );

  return (
    <div style={pageStyle}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.03,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l25.98 15v30L30 60 4.02 45V15z' fill='none' stroke='%23c9a227' stroke-width='1'/%3E%3C/svg%3E")`,
          backgroundSize: '40px 40px',
          pointerEvents: 'none',
        }}
      />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '720px', margin: '0 auto', padding: '40px 48px 48px' }}>
        <header style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h1
            style={{
              margin: '0 0 16px 0',
              fontFamily: "'Oxanium', 'Cinzel', serif",
              fontSize: '36px',
              fontWeight: 700,
              color: '#d4af37',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              lineHeight: 1.1,
              textShadow: '0 0 40px rgba(212,175,55,0.2)',
            }}
          >
            {displayName}
          </h1>

          <div
            style={{
              width: '60%',
              height: '2px',
              margin: '0 auto 20px',
              background: 'linear-gradient(90deg, transparent, #c9a227, #9b59b6, #c9a227, transparent)',
              borderRadius: '1px',
            }}
          />

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px' }}>
            {contactItems.map((item) => (
              <span
                key={item.key}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '5px 12px',
                  borderRadius: '999px',
                  background: 'rgba(201,162,39,0.08)',
                  border: '1px solid rgba(201,162,39,0.25)',
                  color: '#c9a227',
                  fontSize: '10px',
                  fontWeight: 500,
                  letterSpacing: '0.04em',
                }}
              >
                {item.value}
              </span>
            ))}
          </div>
        </header>

        {summary && (
          <section style={{ marginBottom: '28px' }}>
            <SarifSectionHeading title={t(language, 'profile')} />
            <p style={{ margin: 0, color: '#b0b0b0', lineHeight: 1.7, fontSize: '12px' }}>{summary}</p>
          </section>
        )}

        {mainSections.map((section) => (
          <section key={section.id} style={{ marginBottom: '28px' }}>
            <SarifSectionHeading title={section.title} />
            {section.type === 'skills' ? (
              <SarifSkillsSection section={section} />
            ) : section.type === 'languages' ? (
              <SarifLanguagesSection section={section} />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {section.entries.map((entry) => (
                  <SarifEntryCard key={entry.id} entry={entry} />
                ))}
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}

function SarifSectionHeading({ title }: { title: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
      <span style={{ color: '#c9a227', fontSize: '8px' }}>◆</span>
      <span style={{ color: '#c9a227', fontSize: '10px', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase' }}>
        {title}
      </span>
      <span style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, rgba(201,162,39,0.4), transparent)' }} />
    </div>
  );
}

function SarifEntryCard({ entry }: { entry: CVEntry }) {
  const language = useCVStore((s) => s.language);
  const lines = getEntryDetailLines(entry);
  const subtitle = getEntrySubtitle(entry);
  const date = getEntryDate(entry, language);
  const title = getEntryTitle(entry);

  return (
    <div
      style={{
        position: 'relative',
        padding: '16px 18px',
        background: 'rgba(26,26,26,0.6)',
        borderRadius: '6px',
        borderLeft: '3px solid #c9a227',
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
        <span style={{ color: '#e0e0e0', fontWeight: 700, fontSize: '13px' }}>{title}</span>
        {date && <span style={{ color: '#c9a227', fontSize: '10px', fontWeight: 500, whiteSpace: 'nowrap' }}>{date}</span>}
      </div>
      {subtitle && <div style={{ marginTop: '3px', color: '#888', fontSize: '11px' }}>{subtitle}</div>}
      {lines.length > 0 && (
        <ul style={{ margin: '10px 0 0 0', padding: 0, listStyle: 'none' }}>
          {lines.map((line) => (
            <li
              key={line}
              style={{ color: '#a0a0a0', fontSize: '11px', lineHeight: 1.6, marginBottom: '4px', paddingLeft: '14px', position: 'relative' }}
            >
              <span style={{ position: 'absolute', left: 0, color: '#c9a227', fontSize: '9px' }}>▸</span>
              {line}
            </li>
          ))}
        </ul>
      )}
      {entry.fields.technologies && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px' }}>
          {entry.fields.technologies.split(',').map((tech) => (
            <span
              key={tech}
              style={{
                padding: '3px 8px', borderRadius: '4px', background: 'rgba(201,162,39,0.1)',
                border: '1px solid rgba(201,162,39,0.2)', color: '#c9a227', fontSize: '9.5px', fontWeight: 500,
              }}
            >
              {tech.trim()}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function SarifSkillsSection({ section }: { section: CVSection }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px' }}>
      {section.entries.map((entry) => {
        const score = getSkillLevelScore(entry.fields.level || '');
        const name = entry.fields.name || entry.fields.title;
        return (
          <div
            key={entry.id}
            style={{
              position: 'relative', padding: '10px 12px',
              border: '1px solid rgba(201,162,39,0.2)', borderRadius: '4px',
              background: 'rgba(0,0,0,0.3)', overflow: 'hidden',
            }}
          >
            <span style={{ position: 'absolute', top: 0, left: 0, width: '8px', height: '8px', borderTop: '2px solid #c9a227', borderLeft: '2px solid #c9a227' }} />
            <span style={{ position: 'absolute', top: 0, right: 0, width: '8px', height: '8px', borderTop: '2px solid #c9a227', borderRight: '2px solid #c9a227' }} />
            <span style={{ position: 'absolute', bottom: 0, left: 0, width: '8px', height: '8px', borderBottom: '2px solid #c9a227', borderLeft: '2px solid #c9a227' }} />
            <span style={{ position: 'absolute', bottom: 0, right: 0, width: '8px', height: '8px', borderBottom: '2px solid #c9a227', borderRight: '2px solid #c9a227' }} />
            <div style={{ fontFamily: "'Oxanium', sans-serif", fontSize: '11px', fontWeight: 600, color: '#e0e0e0', letterSpacing: '0.06em', marginBottom: '6px', textTransform: 'uppercase' }}>
              {name}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ width: `${(score / 5) * 100}%`, height: '100%', background: 'linear-gradient(90deg, #c9a227, #d4af37)', borderRadius: '2px' }} />
              </div>
              <span style={{ fontFamily: "'Oxanium', sans-serif", fontSize: '9px', fontWeight: 700, color: '#c9a227', letterSpacing: '0.08em', minWidth: '20px', textAlign: 'right' }}>
                {score}/5
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SarifLanguagesSection({ section }: { section: CVSection }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
      {section.entries.map((entry) => {
        const name = entry.fields.language || entry.fields.name || entry.fields.title;
        const cefr = entry.fields.proficiency || '';
        return (
          <div
            key={entry.id}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '6px 12px', borderRadius: '999px',
              background: 'rgba(201,162,39,0.08)', border: '1px solid rgba(201,162,39,0.2)',
            }}
          >
            <span style={{ color: '#e0e0e0', fontSize: '11px', fontWeight: 500 }}>{name}</span>
            <span style={{ padding: '2px 6px', borderRadius: '4px', background: 'rgba(201,162,39,0.15)', color: '#c9a227', fontSize: '9px', fontWeight: 700, letterSpacing: '0.08em' }}>
              {cefr}
            </span>
          </div>
        );
      })}
    </div>
  );
}
