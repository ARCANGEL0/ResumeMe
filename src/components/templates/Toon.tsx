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
} from './templateUtils';
import ContactIcon from '../../ui/ContactIcon';
import { CustomSectionRegion, LinkedText, PhotoFrame, ResumeUrl, type TemplateLayoutEditor } from './templateComponents';

interface Props {
  data: CVData;
  layoutEditor?: TemplateLayoutEditor;
}

const INK = '#2b2440';
const BORDER = '2px solid #2b2440';
const SHADOW = '3px 3px 0 #2b2440';

const CARD_COLORS = ['#f7c9e0', '#c8f0d8', '#d7d2f7', '#ffe08a', '#ffcdb2', '#bfe7f5'];

export default function Toon({ data, layoutEditor }: Props) {
  const language = useCVStore((state) => state.language);
  const theme = TEMPLATE_THEMES['toon'];
  const { personalInfo, sections } = data;
  const layoutState = ensureTemplateLayout('toon', data.layoutOverride, sections);
  const displayName = personalInfo.fullName || t(language, 'fullName');
  const contactItems = getContactItems(personalInfo, language);
  const summary = personalInfo.summary.trim();
  const photo = personalInfo.photo;

  const baseStyle: CSSProperties = {
    fontFamily: theme.fontFamily,
    fontSize: '10.4px',
    lineHeight: '1.55',
    color: INK,
    background: theme.page,
    minHeight: '297mm',
    padding: '20px 22px 26px',
  };

  const sideSections = getSectionsForRegion(sections, layoutState, 'side');
  const mainSections = getSectionsForRegion(sections, layoutState, 'main');

  return (
    <div style={baseStyle}>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', gap: '18px', marginBottom: '18px' }}>
        {photo && (
          <span
            style={{
              position: 'relative',
              zIndex: 1,
              display: 'inline-block',
              flexShrink: 0,
              padding: '7px',
              border: BORDER,
              borderRadius: '12px',
              background: '#ffe08a',
              boxShadow: SHADOW,
            }}
          >
            <PhotoFrame photo={photo} size={168} radius="8px" />
          </span>
        )}
        <div style={{ flex: 1, minWidth: 0, paddingTop: '4px', overflowWrap: 'anywhere' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
            <h1 style={{ minWidth: 0, margin: 0, fontSize: '34px', fontWeight: 800, lineHeight: 1.04, letterSpacing: '-0.01em', color: INK, overflowWrap: 'anywhere' }}>
              {displayName}
            </h1>
            <Sparkle />
          </div>
          {personalInfo.location.trim() && (
            <span
              style={{
                display: 'inline-block',
                marginTop: '10px',
                padding: '3px 12px',
                border: BORDER,
                borderRadius: '6px',
                background: '#ffffff',
                fontWeight: 700,
                boxShadow: SHADOW,
              }}
            >
              {personalInfo.location.trim()}
            </span>
          )}
          {summary && (
            <div style={{ position: 'relative', zIndex: 2, minWidth: 0, maxWidth: '100%', marginTop: '14px' }}>
              <ToonCard color={CARD_COLORS[0]} title={t(language, 'profile')}>
                {summary}
              </ToonCard>
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 0.78fr) minmax(0, 1.55fr)', gap: '14px', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {contactItems.length > 0 && (
            <ToonCard color={CARD_COLORS[1]} title={t(language, 'contact')}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {contactItems.map((item) => (
                  <span key={item.key} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        width: '22px',
                        height: '22px',
                        flexShrink: 0,
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: BORDER,
                        borderRadius: '7px',
                        background: '#ffffff',
                        color: INK,
                        boxShadow: '2px 2px 0 #2b2440',
                      }}
                    >
                      <ContactIcon name={item.icon} style={{ width: '13px', height: '13px' }} />
                    </span>
                    <LinkedText href={item.href}>{item.value}</LinkedText>
                  </span>
                ))}
              </div>
            </ToonCard>
          )}

          <CustomSectionRegion
            sections={sideSections}
            regionKey="side"
            layoutEditor={layoutEditor}
            gap="14px"
            renderSection={(section, index) => (
              <ToonCard color={CARD_COLORS[(index + 2) % CARD_COLORS.length]} title={section.title}>
                <SectionBody language={language} section={section} />
              </ToonCard>
            )}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <CustomSectionRegion
            sections={mainSections}
            regionKey="main"
            layoutEditor={layoutEditor}
            gap="14px"
            renderSection={(section, index) => (
              <ToonCard color={CARD_COLORS[(index + 3) % CARD_COLORS.length]} title={section.title}>
                <SectionBody language={language} section={section} />
              </ToonCard>
            )}
          />
        </div>
      </div>
    </div>
  );
}

function ToonCard({ children, color, title }: { children: React.ReactNode; color?: string; title: string }) {
  return (
    <div style={{ minWidth: 0, maxWidth: '100%', boxSizing: 'border-box', border: BORDER, borderRadius: '12px', background: color, boxShadow: SHADOW, overflow: 'hidden', overflowWrap: 'anywhere' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          padding: '5px 12px',
          borderBottom: BORDER,
          background: 'rgba(255,255,255,0.55)',
          fontSize: '13px',
          fontWeight: 800,
        }}
      >
        <span>{title}</span>
        <span style={{ fontSize: '12px', letterSpacing: '0.12em' }}>+ +</span>
      </div>
      <div style={{ minWidth: 0, maxWidth: '100%', padding: '10px 12px 12px', overflowWrap: 'anywhere' }}>{children}</div>
    </div>
  );
}

function Sparkle() {
  return (
    <svg viewBox="0 0 24 24" style={{ width: '26px', height: '26px', flexShrink: 0 }} aria-hidden="true">
      <path d="M12 1.5 14 9l7.5 3-7.5 3-2 7.5-2-7.5L2.5 12 10 9z" fill="#7c5cf0" stroke="#2b2440" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}

function SectionBody({ language, section }: { language: string; section: CVSection }) {
  if (section.type === 'skills' || section.type === 'languages') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {section.entries.map((entry) => {
          const name = entry.fields.name || entry.fields.language || entry.fields.title;
          const level =
            section.type === 'languages' ? getLangLevel(entry.fields.proficiency || '', 'words', language) : '';
          return (
            <span key={entry.id} style={{ display: 'flex', gap: '6px' }}>
              <span style={{ fontWeight: 800 }}>+</span>
              <span>
                {name}
                {level ? ` (${level})` : ''}
              </span>
            </span>
          );
        })}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {section.entries.map((entry) => {
        const date = getEntryDate(entry, language);
        const subtitle = getEntrySubtitle(entry);
        const lines = getEntryDetailLines(entry);
        return (
          <div key={entry.id}>
            <div style={{ display: 'flex', gap: '6px', fontWeight: 800 }}>
              <span>+</span>
              <span>
                {getEntryTitle(entry)}
                {subtitle ? `, ${subtitle}` : ''}
              </span>
            </div>
            {date && <div style={{ marginLeft: '14px', fontWeight: 700, opacity: 0.72 }}>{date}</div>}
            {lines.map((line) => (
              <div key={line} style={{ marginLeft: '14px' }}>
                {line}
              </div>
            ))}
            {entry.fields.url && (
              <div style={{ marginLeft: '14px', fontWeight: 700 }}>
                <ResumeUrl value={entry.fields.url} sectionType={section.type} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
