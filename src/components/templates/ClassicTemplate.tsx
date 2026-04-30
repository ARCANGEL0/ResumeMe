import ContactIcon from '../../ui/ContactIcon';
import { t } from '../../i18n';
import { useCVStore } from '../../store/cvStore';
import { type CVData } from '../../types/cv';
import { getContactItems } from './templateUtils';

interface TemplateProps {
  data: CVData;
}

export function ClassicTemplate({ data }: TemplateProps) {
  const { personalInfo, sections } = data;
  const language = useCVStore((state) => state.language);
  const contactItems = getContactItems(personalInfo);

  return (
    <div style={{ fontFamily: "'Georgia', 'Times New Roman', serif", fontSize: '12px', lineHeight: '1.7', color: '#1a1a1a', padding: '45px 55px', minHeight: '297mm', maxWidth: '210mm', background: '#fff' }}
    >
      {/* Header with elegant border */}
      <div style={{ textAlign: 'center', borderBottom: '3px double #1a1a1a', paddingBottom: '20px', marginBottom: '24px' }}
      >
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '10px', color: '#1a1a1a' }}
        >
          {personalInfo.fullName || t(language, 'fullName')}
        </h1>
        <div style={{ width: '60px', height: '2px', background: '#1a1a1a', margin: '0 auto 10px' }}></div>
        <div style={{ fontSize: '10.5px', color: '#555', display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
          {contactItems.map((item, index) => (
            <span key={item.key} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ display: 'inline-flex', width: '12px', height: '12px', color: '#222' }}>
                <ContactIcon name={item.icon} style={{ width: '100%', height: '100%' }} />
              </span>
              <span>{item.value}</span>
              {index < contactItems.length - 1 ? '  |  ' : ''}
            </span>
          ))}
        </div>
      </div>

      {/* Summary */}
      {personalInfo.summary && (
        <div style={{ marginBottom: '24px', textAlign: 'center' }}
        >
          <p style={{ color: '#444', fontStyle: 'italic', fontSize: '11px', lineHeight: '1.7' }}>{personalInfo.summary}</p>
          <div style={{ width: '40px', height: '1px', background: '#ccc', margin: '16px auto 0' }}></div>
        </div>
      )}

      {/* Sections */}
      {sections.map((section) => (
        <div key={section.id} style={{ marginBottom: '24px' }}
        >
          <h2 style={{ fontSize: '14px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '10px', color: '#1a1a1a', display: 'flex', alignItems: 'center', gap: '10px' }}
          >
            <span style={{ flex: 1, height: '1px', background: '#ddd' }}></span>
            <span>{section.title}</span>
            <span style={{ flex: 1, height: '1px', background: '#ddd' }}></span>
          </h2>
          {section.entries.map((entry) => (
            <div key={entry.id} style={{ marginBottom: '14px', paddingLeft: '12px', borderLeft: '2px solid #ddd' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '3px' }}
              >
                <span style={{ fontWeight: 'bold', fontSize: '12.5px' }}>
                  {entry.fields.position || entry.fields.degree || entry.fields.name || entry.fields.institution || entry.fields.company || entry.fields.language || entry.fields.title || 'Entry'}
                </span>
                <span style={{ fontSize: '10.5px', color: '#666', fontStyle: 'italic' }}>
                  {entry.fields.startDate && entry.fields.endDate ? `${entry.fields.startDate} — ${entry.fields.endDate}` : entry.fields.date || ''}
                </span>
              </div>
              <div style={{ fontSize: '11px', color: '#555', marginBottom: '3px', fontWeight: '500' }}>
                {entry.fields.company}
                {entry.fields.institution}
                {entry.fields.issuer && `Issued by ${entry.fields.issuer}`}
                {entry.fields.proficiency}
              </div>
              {entry.fields.description && (
                <p style={{ fontSize: '11px', color: '#444', lineHeight: '1.6' }}>{entry.fields.description}</p>
              )}
              {entry.fields.technologies && (
                <p style={{ fontSize: '10.5px', color: '#666', marginTop: '3px', fontStyle: 'italic' }}>{entry.fields.technologies}</p>
              )}
              {entry.fields.url && (
                <p style={{ fontSize: '10.5px', color: '#666', marginTop: '3px' }}>{entry.fields.url}</p>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
