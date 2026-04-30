import ContactIcon from '../../ui/ContactIcon';
import { t } from '../../i18n';
import { useCVStore } from '../../store/cvStore';
import { type CVData } from '../../types/cv';
import { getContactItems } from './templateUtils';

interface TemplateProps {
  data: CVData;
}

export function MinimalTemplate({ data }: TemplateProps) {
  const { personalInfo, sections } = data;
  const language = useCVStore((state) => state.language);
  const contactItems = getContactItems(personalInfo);

  return (
    <div style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: '12px', lineHeight: '1.7', color: '#222', padding: '55px 65px', minHeight: '297mm', maxWidth: '210mm', background: '#fff' }}
    >
      {/* Name */}
      <h1 style={{ fontSize: '26px', fontWeight: '300', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '6px', color: '#000' }}
      >
        {personalInfo.fullName || t(language, 'fullName')}
      </h1>

      <div style={{ width: '30px', height: '1px', background: '#ddd', marginBottom: '8px' }}></div>

      {/* Contact line */}
      <div style={{ fontSize: '10.5px', color: '#999', marginBottom: '28px', letterSpacing: '0.5px', lineHeight: '1.8' }}>
        {contactItems.map((item, index) => (
          <span key={item.key} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ display: 'inline-flex', width: '12px', height: '12px', color: '#666' }}>
              <ContactIcon name={item.icon} style={{ width: '100%', height: '100%' }} />
            </span>
            <span>{item.value}</span>
            {index < contactItems.length - 1 ? '  ·  ' : ''}
          </span>
        ))}
      </div>

      {/* Summary */}
      {personalInfo.summary && (
        <div style={{ marginBottom: '28px' }}
        >
          <p style={{ color: '#555', fontSize: '11px', lineHeight: '1.8' }}>{personalInfo.summary}</p>
        </div>
      )}

      {/* Sections */}
      {sections.map((section) => (
        <div key={section.id} style={{ marginBottom: '22px' }}
        >
          <h2 style={{ fontSize: '11px', fontWeight: '400', letterSpacing: '3px', textTransform: 'uppercase', color: '#bbb', marginBottom: '12px' }}>
            {section.title}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {section.entries.map((entry) => (
              <div key={entry.id}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2px' }}
                >
                  <span style={{ fontWeight: '400', color: '#333', fontSize: '12px' }}>
                    {entry.fields.position || entry.fields.degree || entry.fields.name || entry.fields.institution || entry.fields.company || entry.fields.language || entry.fields.title || 'Entry'}
                  </span>
                  <span style={{ fontSize: '10px', color: '#bbb', fontWeight: '300' }}>
                    {entry.fields.startDate && entry.fields.endDate ? `${entry.fields.startDate} — ${entry.fields.endDate}` : entry.fields.date || ''}
                  </span>
                </div>
                <div style={{ fontSize: '10.5px', color: '#999', marginTop: '2px', lineHeight: '1.6' }}>
                  {entry.fields.company}
                  {entry.fields.institution}
                  {entry.fields.issuer && ` — ${entry.fields.issuer}`}
                  {entry.fields.proficiency}
                </div>
                {entry.fields.description && (
                  <p style={{ fontSize: '10.5px', color: '#666', marginTop: '5px', lineHeight: '1.6' }}>{entry.fields.description}</p>
                )}
                {entry.fields.technologies && (
                  <p style={{ fontSize: '10px', color: '#999', fontStyle: 'italic', marginTop: '3px' }}>{entry.fields.technologies}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
