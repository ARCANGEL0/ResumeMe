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
  toExternalHref,
} from './templateUtils';
import ContactIcon from '../../ui/ContactIcon';
import { CustomSectionRegion, LinkedText, type TemplateLayoutEditor } from './templateComponents';

interface Props {
  data: CVData;
  layoutEditor?: TemplateLayoutEditor;
}

const INK = '#111111';
const SOFT = '#6d6d6d';

export default function Scribe({ data, layoutEditor }: Props) {
  const language = useCVStore((state) => state.language);
  const theme = TEMPLATE_THEMES['scribe'];
  const { personalInfo, sections } = data;
  const layoutState = ensureTemplateLayout('scribe', data.layoutOverride, sections);
  const displayName = personalInfo.fullName || t(language, 'fullName');
  const contactItems = getContactItems(personalInfo, language);
  const summary = personalInfo.summary.trim();

  const baseStyle: CSSProperties = {
    fontFamily: theme.fontFamily,
    fontSize: '10.4px',
    lineHeight: '1.62',
    color: INK,
    background: theme.page,
    minHeight: '297mm',
    padding: '40px 44px 44px',
  };

  const asideSections = getSectionsForRegion(sections, layoutState, 'aside');
  const mainSections = getSectionsForRegion(sections, layoutState, 'main');

  return (
    <div style={baseStyle}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '30px' }}>
        <h1 style={{ margin: 0, fontSize: '104px', fontWeight: 700, lineHeight: 0.92, letterSpacing: '-0.035em', color: INK }}>{displayName}</h1>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '9.4px', color: SOFT }}>
          {contactItems.map((item) => (
            <span key={item.key} style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
              <ContactIcon name={item.icon} style={{ width: '12px', height: '12px', flexShrink: 0 }} />
              <LinkedText href={item.href}>{item.value}</LinkedText>
            </span>
          ))}
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 0.68fr) minmax(0, 1.62fr)',
          gap: '34px',
          marginTop: '34px',
          alignItems: 'start',
        }}
      >
        <div>
          {summary && (
            <div style={{ marginBottom: '30px' }}>
              <LowerHeading title={t(language, 'profile')} />
              <p style={{ margin: 0, color: SOFT }}>{summary}</p>
            </div>
          )}
          <CustomSectionRegion
            sections={asideSections}
            regionKey="aside"
            layoutEditor={layoutEditor}
            gap="30px"
            renderSection={(section) => (
              <div>
                <LowerHeading title={section.title} />
                <SectionBody language={language} section={section} />
              </div>
            )}
          />
        </div>

        <div>
          <CustomSectionRegion
            sections={mainSections}
            regionKey="main"
            layoutEditor={layoutEditor}
            gap="30px"
            renderSection={(section) => (
              <div>
                <LowerHeading title={section.title} />
                <SectionBody language={language} section={section} />
              </div>
            )}
          />
        </div>
      </div>
    </div>
  );
}

function LowerHeading({ title }: { title: string }) {
  return (
    <div style={{ marginBottom: '14px', fontSize: '20px', fontWeight: 700, lineHeight: 1.1, textTransform: 'lowercase' }}>
      {title}
    </div>
  );
}

function SectionBody({ language, section }: { language: string; section: CVSection }) {
  if (section.type === 'skills' || section.type === 'languages') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', color: SOFT }}>
        {section.entries.map((entry) => {
          const name = entry.fields.name || entry.fields.language || entry.fields.title;
          const level =
            section.type === 'languages' ? getLangLevel(entry.fields.proficiency || '', 'words', language) : '';
          return (
            <span key={entry.id}>
              {name}
              {level ? ` — ${level}` : ''}
            </span>
          );
        })}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {section.entries.map((entry) => {
        const lines = getEntryDetailLines(entry);
        const subtitle = getEntrySubtitle(entry);
        const date = getEntryDate(entry, language);
        return (
          <div key={entry.id}>
            <div style={{ fontWeight: 700 }}>{getEntryTitle(entry)}</div>
            {(subtitle || date) && (
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '14px', color: SOFT }}>
                <span>{subtitle}</span>
                <span style={{ whiteSpace: 'nowrap' }}>{date}</span>
              </div>
            )}
            {lines.length > 0 && (
              <ul style={{ margin: '6px 0 0', paddingLeft: '15px', color: SOFT }}>
                {lines.map((line) => (
                  <li key={line} style={{ marginBottom: '3px' }}>
                    {line}
                  </li>
                ))}
              </ul>
            )}
            {entry.fields.url && (
              <div style={{ marginTop: '4px', color: SOFT }}>
                <LinkedText href={toExternalHref(entry.fields.url)}>
                  {entry.fields.url}
                </LinkedText>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
