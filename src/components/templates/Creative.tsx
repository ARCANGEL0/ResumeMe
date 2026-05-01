// src/components/templates/Creative.tsx
import { t } from '../../i18n';
import { useCVStore } from '../../store/cvStore';
import type { CVData } from '../../types/cv';
import ContactIcon from '../../ui/ContactIcon';
import { TEMPLATE_THEMES } from './templateCatalog';
import { getContactItems, getEntryDate, getLangScore } from './templateUtils';
import type { TemplateLayoutEditor } from './templateComponents';

interface Props {
  data: CVData;
  layoutEditor?: TemplateLayoutEditor;
}

export default function Creative({ data }: Props) {
  const language = useCVStore((state) => state.language);
  const theme = TEMPLATE_THEMES['creative'];
  const { personalInfo, sections } = data;
  const displayName = personalInfo.fullName || t(language, 'fullName');
  const contactItems = getContactItems(personalInfo);
  const summary = personalInfo.summary.trim();

  const skillSections = sections.filter((s) => s.type === 'skills');
  const langSections = sections.filter((s) => s.type === 'languages');
  const mainSections = sections.filter((s) => s.type !== 'skills' && s.type !== 'languages');
  const allBands = [...mainSections, ...skillSections, ...langSections];

  return (
    <div style={{ fontFamily: theme.fontFamily, fontSize: '11.2px', lineHeight: '1.65', color: theme.text, background: '#ffffff', minHeight: '297mm' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #2d1b69 100%)', padding: '32px 40px 28px' }}>
        <h1 style={{ margin: 0, fontSize: '40px', fontWeight: 900, color: '#ffffff', lineHeight: 1, letterSpacing: '-0.02em' }}>
          {displayName}
        </h1>
        <div style={{ width: '56px', height: '4px', background: 'linear-gradient(90deg, #ec4899, #8b5cf6)', borderRadius: '2px', margin: '12px 0 14px' }} />
        {contactItems.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: summary ? '14px' : 0 }}>
            {contactItems.map((item) => (
              <span
                key={item.key}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.1)', padding: '4px 10px', borderRadius: '999px', fontSize: '10px', color: 'rgba(255,255,255,0.9)' }}
              >
                <ContactIcon name={item.icon} style={{ width: '11px', height: '11px' }} />
                {item.value}
              </span>
            ))}
          </div>
        )}
        {summary && (
          <p style={{ margin: 0, fontSize: '11px', color: 'rgba(255,255,255,0.72)', lineHeight: '1.6', maxWidth: '72%' }}>
            {summary}
          </p>
        )}
      </div>

      {/* Banded content — one row per section */}
      <div>
        {allBands.map((section, index) => (
          <div
            key={section.id}
            style={{ display: 'flex', borderBottom: index < allBands.length - 1 ? '1px solid #f0edf8' : 'none' }}
          >
            {/* Section label column */}
            <div
              style={{
                width: '130px',
                flexShrink: 0,
                padding: '16px 14px',
                background: index % 2 === 0 ? 'rgba(236,72,153,0.04)' : 'rgba(139,92,246,0.04)',
                borderRight: '2px solid rgba(236,72,153,0.18)',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'flex-end',
              }}
            >
              <span style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#ec4899', textAlign: 'right', lineHeight: 1.4 }}>
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
                      style={{ display: 'inline-block', padding: '4px 10px', borderRadius: '999px', background: 'rgba(139,92,246,0.08)', color: '#5b21b6', fontSize: '10px', fontWeight: 600 }}
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
                        <span style={{ display: 'inline-flex', gap: '3px' }}>
                          {Array.from({ length: 6 }).map((_, i) => (
                            <span key={i} style={{ width: '8px', height: '8px', borderRadius: '999px', background: i < score ? '#8b5cf6' : '#e8dcfb' }} />
                          ))}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {section.entries.map((entry, i) => (
                    <div
                      key={entry.id}
                      style={{ paddingBottom: i < section.entries.length - 1 ? '10px' : 0, borderBottom: i < section.entries.length - 1 ? '1px dashed #f0edf8' : 'none' }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2px' }}>
                        <span style={{ fontWeight: 700, fontSize: '11.5px', color: '#1a1a2e' }}>
                          {entry.fields.position || entry.fields.degree || entry.fields.name || entry.fields.title || 'Entry'}
                        </span>
                        <span style={{ fontSize: '9.5px', color: '#aaa', fontWeight: 500, whiteSpace: 'nowrap' }}>
                          {getEntryDate(entry, language)}
                        </span>
                      </div>
                      {(entry.fields.company || entry.fields.institution || entry.fields.issuer) && (
                        <div style={{ fontSize: '10px', color: '#8b5cf6', fontWeight: 600, marginBottom: '3px' }}>
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
                            <span key={ti} style={{ fontSize: '9px', background: '#f3e8ff', color: '#7c3aed', padding: '2px 7px', borderRadius: '8px', fontWeight: 500 }}>
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
        ))}
      </div>
    </div>
  );
}
