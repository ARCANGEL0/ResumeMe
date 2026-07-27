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

const NAVY = '#152238';
const NAVY_DEEP = '#0e1728';
const PAPER = '#eceef1';
const HEX = 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)';

export default function Hexon({ data, layoutEditor }: Props) {
  const language = useCVStore((state) => state.language);
  const theme = TEMPLATE_THEMES['hexon'];
  const { personalInfo, sections } = data;
  const layoutState = ensureTemplateLayout('hexon', data.layoutOverride, sections);
  const displayName = personalInfo.fullName || t(language, 'fullName');
  const contactItems = getContactItems(personalInfo, language);
  const summary = personalInfo.summary.trim();
  const photo = personalInfo.photo;

  const baseStyle: CSSProperties = {
    fontFamily: theme.fontFamily,
    fontSize: '10.4px',
    lineHeight: '1.58',
    color: '#2b3242',
    background: PAPER,
    minHeight: '297mm',
    display: 'grid',
    gridTemplateColumns: '218px minmax(0, 1fr)',
  };

  const sidebarSections = getSectionsForRegion(sections, layoutState, 'sidebar');
  const mainSections = getSectionsForRegion(sections, layoutState, 'main');

  return (
    <div style={baseStyle}>
      <aside style={{ padding: '26px 20px 30px', background: `linear-gradient(180deg, ${NAVY} 0%, ${NAVY_DEEP} 100%)`, color: '#d9dfe8' }}>
        <div style={{ textAlign: 'center' }}>
          {photo ? (
            <span
              style={{
                display: 'inline-flex',
                width: '164px',
                height: '182px',
                alignItems: 'center',
                justifyContent: 'center',
                clipPath: HEX,
                background: `linear-gradient(180deg, ${theme.accentAlt}, #ffffff)`,
              }}
            >
              <span style={{ display: 'block', width: '154px', height: '171px', clipPath: HEX, background: '#ffffff' }}>
                <img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </span>
            </span>
          ) : (
            <span style={{ display: 'inline-block', width: '96px', height: '106px', clipPath: HEX, background: 'rgba(255,255,255,0.12)' }} />
          )}
          <h1 style={{ margin: '18px 0 0', fontSize: '23px', fontWeight: 300, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#ffffff' }}>
            {displayName}
          </h1>
          <span style={{ display: 'block', width: '46px', height: '2px', margin: '12px auto 0', background: theme.accentAlt }} />
        </div>

        {summary && (
          <div style={{ marginTop: '22px' }}>
            <HexHeading title={t(language, 'profile')} onDark />
            <p style={{ margin: 0, color: 'rgba(255,255,255,0.66)', textAlign: 'justify' }}>{summary}</p>
          </div>
        )}

        {contactItems.length > 0 && (
          <div style={{ marginTop: '22px' }}>
            <HexHeading title={t(language, 'contact')} onDark />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
              {contactItems.map((item) => (
                <span key={item.key} style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                  <span
                    style={{
                      display: 'inline-flex',
                      width: '22px',
                      height: '24px',
                      flexShrink: 0,
                      alignItems: 'center',
                      justifyContent: 'center',
                      clipPath: HEX,
                      background: 'rgba(255,255,255,0.14)',
                    }}
                  >
                    <ContactIcon name={item.icon} style={{ width: '12px', height: '12px' }} />
                  </span>
                  <LinkedText href={item.href}>{item.value}</LinkedText>
                </span>
              ))}
            </div>
          </div>
        )}

        <div style={{ marginTop: '22px' }}>
          <CustomSectionRegion
            sections={sidebarSections}
            regionKey="sidebar"
            layoutEditor={layoutEditor}
            gap="22px"
            renderSection={(section) => (
              <div>
                <HexHeading title={section.title} onDark />
                <SectionBody language={language} onDark section={section} />
              </div>
            )}
          />
        </div>
      </aside>

      <main style={{ padding: '28px 30px 32px' }}>
        <CustomSectionRegion
          sections={mainSections}
          regionKey="main"
          layoutEditor={layoutEditor}
          gap="24px"
          renderSection={(section) => (
            <div>
              <HexHeading title={section.title} />
              <SectionBody language={language} section={section} />
            </div>
          )}
        />
      </main>
    </div>
  );
}

function HexHeading({ onDark = false, title }: { onDark?: boolean; title: string }) {
  const color = onDark ? '#ffffff' : NAVY;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '12px' }}>
      <span
        style={{
          display: 'inline-block',
          width: '15px',
          height: '17px',
          flexShrink: 0,
          clipPath: HEX,
          background: onDark ? 'rgba(255,255,255,0.85)' : NAVY,
        }}
      />
      <span style={{ color, fontSize: '11.5px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
        {title}
      </span>
      <span style={{ flex: 1, height: '1px', background: onDark ? 'rgba(255,255,255,0.3)' : '#c3c9d2' }} />
    </div>
  );
}

function Meter({ onDark, score, total }: { onDark: boolean; score: number; total: number }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        width: '58px',
        height: '7px',
        flexShrink: 0,
        border: `1px solid ${onDark ? 'rgba(255,255,255,0.5)' : '#9aa3b0'}`,
        background: 'transparent',
      }}
    >
      <span style={{ width: `${(score / total) * 100}%`, background: onDark ? '#ffffff' : NAVY }} />
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
  const muted = onDark ? 'rgba(255,255,255,0.66)' : '#5c6472';
  const strong = onDark ? '#ffffff' : NAVY;

  if (section.type === 'skills') {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: onDark ? '1fr' : '1fr 1fr', gap: '7px 24px' }}>
        {section.entries.map((entry) => (
          <span key={entry.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
            <span style={{ fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase', color: strong }}>
              {entry.fields.name || entry.fields.title}
            </span>
            <Meter onDark={onDark} score={getSkillLevelScore(entry.fields.level || '')} total={5} />
          </span>
        ))}
      </div>
    );
  }

  if (section.type === 'languages') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
        {section.entries.map((entry) => (
          <span key={entry.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
            <span style={{ fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase', color: strong }}>
              {entry.fields.language || entry.fields.name}
            </span>
            <Meter onDark={onDark} score={getLangScore(entry.fields.proficiency || '')} total={6} />
          </span>
        ))}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: onDark ? '13px' : '17px' }}>
      {section.entries.map((entry) => {
        const date = getEntryDate(entry, language);
        const subtitle = getEntrySubtitle(entry);
        const lines = getEntryDetailLines(entry);
        return (
          <div key={entry.id} style={{ display: 'flex', gap: '11px' }}>
            <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, paddingTop: '3px' }}>
              <span style={{ width: '11px', height: '12px', clipPath: HEX, background: onDark ? 'rgba(255,255,255,0.85)' : NAVY }} />
              <span style={{ flex: 1, width: '1px', marginTop: '4px', background: onDark ? 'rgba(255,255,255,0.22)' : '#c8ced7' }} />
            </span>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '12px' }}>
                <span style={{ color: strong, fontWeight: 700, fontSize: '11.4px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  {getEntryTitle(entry)}
                </span>
                {date && (
                  <span
                    style={{
                      flexShrink: 0,
                      padding: '1px 7px',
                      background: onDark ? 'rgba(255,255,255,0.14)' : '#dde1e7',
                      color: onDark ? 'rgba(255,255,255,0.82)' : NAVY,
                      fontSize: '9px',
                      letterSpacing: '0.05em',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {date}
                  </span>
                )}
              </div>
              {subtitle && (
                <div style={{ marginTop: '2px', color: onDark ? 'rgba(255,255,255,0.8)' : '#3d6ea8', fontStyle: 'italic' }}>
                  {subtitle}
                </div>
              )}
              {lines.length > 0 && (
                <ul style={{ margin: '6px 0 0 14px', padding: 0, color: muted, textAlign: 'justify' }}>
                  {lines.map((line) => (
                    <li key={line} style={{ marginBottom: '2px' }}>
                      {line}
                    </li>
                  ))}
                </ul>
              )}
              {entry.fields.url && (
                <div style={{ marginTop: '4px', color: muted }}>
                  <LinkedText href={toExternalHref(entry.fields.url)}>
                    {entry.fields.url}
                  </LinkedText>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
