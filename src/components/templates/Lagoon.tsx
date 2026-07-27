import { type CSSProperties } from 'react';
import { t } from '../../i18n';
import { useCVStore } from '../../store/cvStore';
import type { CVData, CVSection } from '../../types/cv';
import { TEMPLATE_THEMES } from './templateCatalog';
import { ensureTemplateLayout, getSectionsForRegion } from './templateLayout';
import {
  getContactItems,
  getEntryDate,
  getEntryDetailLines,
  getEntrySubtitle,
  getEntryTitle,
  getLangLevel,
  getLangScore,
  getSkillLevelScore,
  toExternalHref,
} from './templateUtils';
import ContactIcon from '../../ui/ContactIcon';
import { CustomSectionRegion, LinkedText, type TemplateLayoutEditor } from './templateComponents';

interface Props {
  data: CVData;
  layoutEditor?: TemplateLayoutEditor;
}

const SLATE = '#3a3d42';
const SLATE_DEEP = '#1c1e21';
const AMBER = '#e8a33d';
const AMBER_DEEP = '#c07f21';
const INK = '#2f3438';
const MUTED = '#5a6167';

export default function Lagoon({ data, layoutEditor }: Props) {
  const language = useCVStore((state) => state.language);
  const theme = TEMPLATE_THEMES['lagoon'];
  const { personalInfo, sections } = data;
  const layoutState = ensureTemplateLayout('lagoon', data.layoutOverride, sections);
  const displayName = personalInfo.fullName || t(language, 'fullName');
  const contactItems = getContactItems(personalInfo, language);
  const summary = personalInfo.summary.trim();
  const photo = personalInfo.photo;
  const initials = displayName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

  const baseStyle: CSSProperties = {
    fontFamily: theme.fontFamily,
    fontSize: '10.6px',
    lineHeight: '1.62',
    color: '#33393d',
    background: '#ffffff',
    minHeight: '297mm',
    display: 'grid',
    gridTemplateColumns: '232px minmax(0, 1fr)',
  };

  const sidebarSections = getSectionsForRegion(sections, layoutState, 'sidebar');
  const mainSections = getSectionsForRegion(sections, layoutState, 'main');

  return (
    <div style={baseStyle}>
      <aside
        style={{
          display: 'flex',
          flexDirection: 'column',
          background: `linear-gradient(170deg, #4a4e55 0%, ${SLATE} 45%, ${SLATE_DEEP} 100%)`,
        }}
      >
        <div style={{ position: 'relative' }}>
          <div
            style={{
              height: '236px',
              background: photo ? `#dfe3e5 center/cover url(${photo})` : '#dfe3e5',
              clipPath: 'polygon(0 0, 100% 0, 100% 80%, 0 100%)',
            }}
          />
          {!photo && (
            <span
              style={{
                position: 'absolute',
                inset: '0 0 34px 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: SLATE_DEEP,
                fontSize: '48px',
                fontWeight: 800,
                letterSpacing: '0.06em',
              }}
            >
              {initials}
            </span>
          )}
          <span
            style={{
              position: 'absolute',
              right: 0,
              bottom: '18px',
              width: '78px',
              height: '5px',
              background: AMBER,
            }}
          />
        </div>

        <div style={{ padding: '16px 22px 30px', color: '#eef4f4' }}>
          {contactItems.length > 0 && (
            <div style={{ marginBottom: '26px' }}>
              <LagoonHeading title={t(language, 'contact')} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
                {contactItems.map((item) => (
                  <span key={item.key} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        width: '23px',
                        height: '23px',
                        flexShrink: 0,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '5px',
                        border: '1px solid rgba(232,163,61,0.55)',
                        background: 'rgba(232,163,61,0.14)',
                        color: AMBER,
                      }}
                    >
                      <ContactIcon name={item.icon} style={{ width: '13px', height: '13px' }} />
                    </span>
                    <LinkedText href={item.href}>{item.value}</LinkedText>
                  </span>
                ))}
              </div>
            </div>
          )}

          <CustomSectionRegion
            sections={sidebarSections}
            regionKey="sidebar"
            layoutEditor={layoutEditor}
            gap="26px"
            renderSection={(section) => (
              <div>
                <LagoonHeading title={section.title} />
                <SectionBody language={language} onDark section={section} />
              </div>
            )}
          />
        </div>
      </aside>

      <main style={{ display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            position: 'relative',
            padding: '36px 36px 26px 32px',
            background: `linear-gradient(105deg, ${AMBER} 0 6px, #ffffff 6px)`,
          }}
        >
          <h1 style={{ margin: 0, fontSize: '38px', fontWeight: 800, lineHeight: 1.04, color: INK }}>
            {displayName}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginTop: '14px' }}>
            <span style={{ width: '54px', height: '4px', background: AMBER }} />
            <span style={{ width: '14px', height: '4px', background: AMBER_DEEP }} />
            <span style={{ width: '6px', height: '4px', background: SLATE }} />
          </div>

          {summary && (
            <p style={{ margin: '18px 0 0', color: MUTED, textAlign: 'justify', maxWidth: '94%' }}>{summary}</p>
          )}
        </div>

        <div style={{ flex: 1, padding: '4px 36px 40px 32px' }}>
          <CustomSectionRegion
            sections={mainSections}
            regionKey="main"
            layoutEditor={layoutEditor}
            gap="28px"
            renderSection={(section) => (
              <div>
                <MainHeading title={section.title} />
                <SectionBody language={language} section={section} />
              </div>
            )}
          />
        </div>
      </main>
    </div>
  );
}

function LagoonHeading({ title }: { title: string }) {
  return (
    <div style={{ marginBottom: '12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ width: '11px', height: '11px', flexShrink: 0, transform: 'rotate(45deg)', background: AMBER }} />
        <span style={{ color: '#ffffff', fontSize: '13.5px', fontWeight: 800, letterSpacing: '0.03em' }}>{title}</span>
      </div>
      <span style={{ display: 'block', height: '1px', marginTop: '7px', background: 'rgba(255,255,255,0.28)' }} />
    </div>
  );
}

function MainHeading({ title }: { title: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
      <span style={{ color: INK, fontSize: '16px', fontWeight: 800, letterSpacing: '0.01em' }}>{title}</span>
      <span style={{ flex: 1, height: '2px', background: `linear-gradient(90deg, ${AMBER}, rgba(232,163,61,0.12))` }} />
    </div>
  );
}

function LevelBar({ onDark, ratio }: { onDark: boolean; ratio: number }) {
  return (
    <span
      style={{
        display: 'block',
        height: '5px',
        marginTop: '5px',
        borderRadius: '999px',
        background: onDark ? 'rgba(255,255,255,0.2)' : '#e4e8ea',
      }}
    >
      <span
        style={{
          display: 'block',
          width: `${Math.max(6, Math.round(ratio * 100))}%`,
          height: '100%',
          borderRadius: '999px',
          background: onDark ? AMBER : `linear-gradient(90deg, ${SLATE}, ${AMBER})`,
        }}
      />
    </span>
  );
}

function SectionBody({
  language,
  onDark = false,
  section,
}: {
  language: string;
  onDark?: boolean;
  section: CVSection;
}) {
  const muted = onDark ? 'rgba(255,255,255,0.82)' : MUTED;
  const strong = onDark ? '#ffffff' : INK;

  if (section.type === 'skills') {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: onDark ? '1fr' : '1fr 1fr', gap: '10px 22px' }}>
        {section.entries.map((entry) => (
          <div key={entry.id}>
            <span style={{ color: strong, fontWeight: 600 }}>{entry.fields.name || entry.fields.title}</span>
            <LevelBar onDark={onDark} ratio={getSkillLevelScore(entry.fields.level || '') / 5} />
          </div>
        ))}
      </div>
    );
  }

  if (section.type === 'languages') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {section.entries.map((entry) => (
          <div key={entry.id}>
            <span style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '10px' }}>
              <span style={{ color: strong, fontWeight: 600 }}>{entry.fields.language || entry.fields.name}</span>
              <span style={{ color: muted, fontSize: '9.5px' }}>
                {getLangLevel(entry.fields.proficiency || '', 'words', language)}
              </span>
            </span>
            <LevelBar onDark={onDark} ratio={getLangScore(entry.fields.proficiency || '') / 6} />
          </div>
        ))}
      </div>
    );
  }

  if (onDark) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '13px' }}>
        {section.entries.map((entry) => (
          <div key={entry.id}>
            <div style={{ color: strong, fontWeight: 700 }}>{getEntryTitle(entry)}</div>
            {getEntrySubtitle(entry) && (
              <div style={{ color: muted, fontStyle: 'italic' }}>{getEntrySubtitle(entry)}</div>
            )}
            {getEntryDate(entry, language) && (
              <div style={{ marginTop: '2px', color: AMBER, fontSize: '9.5px', letterSpacing: '0.04em' }}>
                {getEntryDate(entry, language)}
              </div>
            )}
            {getEntryDetailLines(entry).map((line) => (
              <div key={line} style={{ marginTop: '3px', color: muted }}>
                {line}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {section.entries.map((entry, index) => {
        const lines = getEntryDetailLines(entry);
        const date = getEntryDate(entry, language);
        const subtitle = getEntrySubtitle(entry);
        const isLast = index === section.entries.length - 1;
        return (
          <div key={entry.id} style={{ display: 'flex', gap: '15px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
              <span
                style={{
                  display: 'inline-flex',
                  width: '13px',
                  height: '13px',
                  marginTop: '3px',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  border: `2px solid ${SLATE}`,
                  background: '#ffffff',
                }}
              >
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: AMBER }} />
              </span>
              {!isLast && (
                <span
                  style={{
                    flex: 1,
                    width: '2px',
                    marginTop: '3px',
                    background: `linear-gradient(180deg, ${SLATE}, rgba(47,107,111,0.18))`,
                  }}
                />
              )}
            </div>
            <div style={{ minWidth: 0, paddingBottom: isLast ? 0 : '19px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '9px', flexWrap: 'wrap' }}>
                {date && (
                  <span
                    style={{
                      padding: '1px 9px',
                      borderRadius: '999px',
                      background: '#f4ecdd',
                      color: AMBER_DEEP,
                      fontSize: '9px',
                      fontWeight: 700,
                      letterSpacing: '0.04em',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {date}
                  </span>
                )}
                {subtitle && <span style={{ color: SLATE, fontWeight: 600 }}>{subtitle}</span>}
              </div>
              <div style={{ margin: '5px 0 5px', color: INK, fontSize: '13px', fontWeight: 700 }}>
                {getEntryTitle(entry)}
              </div>
              {lines.length > 0 && (
                <ul style={{ margin: 0, paddingLeft: '15px', color: MUTED, textAlign: 'justify' }}>
                  {lines.map((line) => (
                    <li key={line} style={{ marginBottom: '2px' }}>
                      {line}
                    </li>
                  ))}
                </ul>
              )}
              {entry.fields.url && (
                <div style={{ marginTop: '4px', color: SLATE }}>
                  <LinkedText href={toExternalHref(entry.fields.url)}>{entry.fields.url}</LinkedText>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
