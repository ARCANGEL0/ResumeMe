// src/components/templates/Creative.tsx
import { t } from '../../i18n';
import { useCVStore } from '../../store/cvStore';
import type { CVData } from '../../types/cv';
import ContactIcon from '../../ui/ContactIcon';
import { TEMPLATE_THEMES } from './templateCatalog';
import { getContactItems, getEntryDate, getLangScore } from './templateUtils';
import { CustomSectionRegion, LinkedText, PhotoFrame, type TemplateLayoutEditor } from './templateComponents';
import { ensureTemplateLayout, getSectionsForRegion } from './templateLayout';

interface Props {
  data: CVData;
  layoutEditor?: TemplateLayoutEditor;
}

export default function Creative({ data, layoutEditor }: Props) {
  const language = useCVStore((state) => state.language);
  const theme = TEMPLATE_THEMES['creative'];
  const { personalInfo, sections } = data;
  const displayName = personalInfo.fullName || t(language, 'fullName');
  const contactItems = getContactItems(personalInfo, language);
  const summary = personalInfo.summary.trim();

  const layoutState = ensureTemplateLayout('creative', data.layoutOverride, sections);
  const allBands = getSectionsForRegion(sections, layoutState, 'main');

  return (
    <div style={{ fontFamily: theme.fontFamily, fontSize: '11.2px', lineHeight: '1.65', color: theme.text, background: '#ffffff', minHeight: '297mm' }}>
      {/* Header */}
      <div style={{ position: 'relative', background: `linear-gradient(118deg, ${theme.accentDark} 0%, #203c43 72%, #315e61 100%)`, padding: '36px 42px 32px', display: 'flex', alignItems: 'center', gap: '26px', overflow: 'hidden' }}>
        {personalInfo.photo && (
          <PhotoFrame photo={personalInfo.photo} size={112} radius="8px" border="2px solid rgba(255,255,255,0.45)" />
        )}
        <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ marginBottom: '10px', color: theme.accentAlt, fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' }}>Creative Profile</div>
        <h1 style={{ margin: 0, fontSize: '38px', fontWeight: 750, color: '#ffffff', lineHeight: 1.04, letterSpacing: '-0.035em', overflowWrap: 'anywhere' }}>
          {displayName}
        </h1>
        <div style={{ width: '48px', height: '3px', background: `linear-gradient(90deg, ${theme.accent}, ${theme.accentAlt})`, margin: '13px 0 15px' }} />
        {contactItems.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: summary ? '14px' : 0 }}>
            {contactItems.map((item) => (
              <span
                key={item.key}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.09)', border: '1px solid rgba(255,255,255,0.18)', padding: '5px 9px', borderRadius: '4px', fontSize: '9.5px', color: 'rgba(255,255,255,0.92)' }}
              >
                <ContactIcon name={item.icon} style={{ width: '13px', height: '13px' }} />
                <LinkedText href={item.href}>{item.value}</LinkedText>
              </span>
            ))}
          </div>
        )}
        {summary && (
          <p style={{ margin: 0, fontSize: '11px', color: 'rgba(255,255,255,0.78)', lineHeight: '1.65', maxWidth: '760px', overflowWrap: 'anywhere' }}>
            {summary}
          </p>
        )}
        </div>
      </div>

      {/* Banded content — one row per section */}
      <CustomSectionRegion
        sections={allBands}
        regionKey="main"
        layoutEditor={layoutEditor}
        renderSection={(section, index) => (
          <div
            style={{ display: 'flex', borderBottom: index < allBands.length - 1 ? '1px solid #f0edf8' : 'none' }}
          >
            {/* Section label column */}
            <div
              style={{
                width: '130px',
                flexShrink: 0,
                padding: '16px 14px',
                background: index % 2 === 0 ? theme.accentSoft : '#f5f7f5',
                borderRight: `2px solid ${theme.accent}`,
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'flex-end',
              }}
            >
              <span style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: theme.accentDark, textAlign: 'right', lineHeight: 1.4, overflowWrap: 'anywhere' }}>
                {section.title}
              </span>
            </div>

            {/* Section content column */}
            <div style={{ flex: 1, padding: '14px 28px 14px 20px' }}>
              {section.type === 'skills' ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {section.entries.map((entry) => (
                    <span
                      key={entry.id}
                      style={{ display: 'inline-block', padding: '4px 9px', borderRadius: '3px', background: theme.accentSoft, color: theme.accentDark, fontSize: '10px', fontWeight: 600 }}
                    >
                      {entry.fields.name || entry.fields.title}
                    </span>
                  ))}
                </div>
              ) : section.type === 'languages' ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '18px' }}>
                  {section.entries.map((entry) => {
                    const score = getLangScore(entry.fields.proficiency || '');
                    return (
                      <div key={entry.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '10.5px', fontWeight: 600, color: '#1a1a2e' }}>
                          {entry.fields.language || entry.fields.name}
                        </span>
                        {score > 0 && <span style={{ display: 'inline-flex', gap: '3px' }}>
                          {Array.from({ length: 6 }).map((_, i) => (
                            <span key={i} style={{ width: '7px', height: '7px', borderRadius: '999px', background: i < score ? theme.accentAlt : theme.line }} />
                          ))}
                        </span>}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {section.entries.map((entry, i) => (
                    <div
                      key={entry.id}
                      style={{ paddingBottom: i < section.entries.length - 1 ? '11px' : 0, borderBottom: i < section.entries.length - 1 ? `1px solid ${theme.line}` : 'none' }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '12px', marginBottom: '2px' }}>
                        <span style={{ minWidth: 0, fontWeight: 700, fontSize: '11.5px', color: theme.accentDark, overflowWrap: 'anywhere' }}>
                          {entry.fields.position || entry.fields.degree || entry.fields.name || entry.fields.title || 'Entry'}
                        </span>
                        <span style={{ flexShrink: 0, fontSize: '9.5px', color: theme.muted, fontWeight: 500, whiteSpace: 'nowrap' }}>
                          {getEntryDate(entry, language)}
                        </span>
                      </div>
                      {(entry.fields.company || entry.fields.institution || entry.fields.issuer) && (
                        <div style={{ fontSize: '10px', color: theme.accent, fontWeight: 600, marginBottom: '3px' }}>
                          {entry.fields.company || entry.fields.institution || entry.fields.issuer}
                        </div>
                      )}
                      {entry.fields.description && (
                        <p style={{ margin: 0, fontSize: '10.5px', color: '#555', lineHeight: '1.55' }}>
                          {entry.fields.description}
                        </p>
                      )}
                      {entry.fields.technologies && (
                        <div style={{ marginTop: '5px', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                          {entry.fields.technologies.split(',').map((tech, ti) => (
                            <span key={ti} style={{ fontSize: '9px', background: theme.accentSoft, color: theme.accentDark, padding: '2px 7px', borderRadius: '3px', fontWeight: 500 }}>
                              {tech.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      />
    </div>
  );
}
