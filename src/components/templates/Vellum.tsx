import { type CSSProperties, type ReactNode } from 'react';
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
import { CustomSectionRegion, LinkedText, ResumeUrl, type TemplateLayoutEditor } from './templateComponents';

interface Props {
  data: CVData;
  layoutEditor?: TemplateLayoutEditor;
}

const INK = '#3f3f3f';
const SOFT = '#7d7d7d';
const RULE = '#cfcfcf';

export default function Vellum({ data, layoutEditor }: Props) {
  const language = useCVStore((state) => state.language);
  const theme = TEMPLATE_THEMES['vellum'];
  const { personalInfo, sections } = data;
  const layoutState = ensureTemplateLayout('vellum', data.layoutOverride, sections);
  const displayName = personalInfo.fullName || t(language, 'fullName');
  const contactItems = getContactItems(personalInfo, language);
  const summary = personalInfo.summary.trim();

  const baseStyle: CSSProperties = {
    fontFamily: theme.fontFamily,
    fontSize: '10.6px',
    lineHeight: '1.66',
    color: INK,
    background: theme.page,
    minHeight: '297mm',
  };

  const leftSections = getSectionsForRegion(sections, layoutState, 'left');
  const rightSections = getSectionsForRegion(sections, layoutState, 'right');

  return (
    <div style={baseStyle}>
      <div style={{ padding: '30px 34px 24px', background: '#f1f1f1' }}>
        <h1
          style={{
            margin: 0,
            fontSize: '30px',
            fontWeight: 300,
            lineHeight: 1.16,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: '#4a4a4a',
          }}
        >
          {displayName}
        </h1>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '7px 18px', marginTop: '14px' }}>
          {contactItems.map((item) => (
            <span key={item.key} style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', color: SOFT, fontSize: '9.6px' }}>
              <ContactIcon name={item.icon} style={{ width: '13px', height: '13px', flexShrink: 0 }} />
              <LinkedText href={item.href}>{item.value}</LinkedText>
            </span>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.08fr) minmax(0, 0.92fr)', alignItems: 'start' }}>
        <div style={{ borderRight: `1px solid ${RULE}` }}>
          {summary && (
            <Band>
              <BandHeading title={t(language, 'profile')} />
              <div style={{ padding: '16px 34px 22px', color: SOFT, textAlign: 'justify' }}>{summary}</div>
            </Band>
          )}
          <CustomSectionRegion
            sections={leftSections}
            regionKey="left"
            layoutEditor={layoutEditor}
            renderSection={(section) => (
              <Band>
                <BandHeading title={section.title} />
                <div style={{ padding: '16px 34px 22px' }}>
                  <SectionBody language={language} section={section} />
                </div>
              </Band>
            )}
          />
        </div>

        <div>
          <CustomSectionRegion
            sections={rightSections}
            regionKey="right"
            layoutEditor={layoutEditor}
            renderSection={(section) => (
              <Band>
                <BandHeading title={section.title} />
                <div style={{ padding: '16px 34px 22px' }}>
                  <SectionBody language={language} section={section} />
                </div>
              </Band>
            )}
          />
        </div>
      </div>
    </div>
  );
}

function Band({ children }: { children: ReactNode }) {
  return <div style={{ borderTop: `1px solid ${RULE}` }}>{children}</div>;
}

function BandHeading({ title }: { title: string }) {
  return (
    <div
      style={{
        padding: '13px 34px',
        borderBottom: `1px solid ${RULE}`,
        fontSize: '12.5px',
        fontWeight: 600,
        letterSpacing: '0.32em',
        textTransform: 'uppercase',
        color: '#4a4a4a',
      }}
    >
      {title}
    </div>
  );
}

function SectionBody({ language, section }: { language: string; section: CVSection }) {
  if (section.type === 'skills' || section.type === 'languages') {
    return (
      <ul style={{ margin: 0, paddingLeft: '16px', color: SOFT }}>
        {section.entries.map((entry) => {
          const name = entry.fields.name || entry.fields.language || entry.fields.title;
          const level =
            section.type === 'languages'
              ? getLangLevel(entry.fields.proficiency || '', 'words', language)
              : '';
          return (
            <li key={entry.id} style={{ marginBottom: '4px' }}>
              {name}
              {level ? ` (${level})` : ''}
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {section.entries.map((entry) => {
        const date = getEntryDate(entry, language);
        const subtitle = getEntrySubtitle(entry);
        const lines = getEntryDetailLines(entry);
        return (
          <div key={entry.id} style={{ display: 'flex', gap: '10px' }}>
            <span style={{ marginTop: '5px', width: '5px', height: '5px', flexShrink: 0, background: '#4a4a4a' }} />
            <div style={{ minWidth: 0 }}>
              {date && (
                <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  {date}
                </div>
              )}
              {subtitle && <div style={{ color: SOFT }}>{subtitle}</div>}
              <div style={{ fontWeight: 700, color: '#333333' }}>{getEntryTitle(entry)}</div>
              {lines.length > 0 && (
                <ul style={{ margin: '5px 0 0', paddingLeft: '16px', color: SOFT, textAlign: 'justify' }}>
                  {lines.map((line) => (
                    <li key={line} style={{ marginBottom: '3px' }}>
                      {line}
                    </li>
                  ))}
                </ul>
              )}
              {entry.fields.url && (
                <div style={{ marginTop: '5px', color: SOFT }}>
                  <ResumeUrl value={entry.fields.url} sectionType={section.type} />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
