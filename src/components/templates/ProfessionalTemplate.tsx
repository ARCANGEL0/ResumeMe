import ContactIcon from '../../ui/ContactIcon';
import { t } from '../../i18n';
import { useCVStore } from '../../store/cvStore';
import { type CVData } from '../../types/cv';
import { getContactItems } from './templateUtils';

interface TemplateProps {
  data: CVData;
}

export function ProfessionalTemplate({ data }: TemplateProps) {
  const { personalInfo, sections } = data;
  const language = useCVStore((state) => state.language);
  const contactItems = getContactItems(personalInfo);

  return (
    <div style={{ fontFamily: "'Segoe UI', Arial, sans-serif", fontSize: '12px', lineHeight: '1.6', color: '#1a1a2e', minHeight: '297mm', maxWidth: '210mm', background: '#fff' }}>
      {/* Header bar */}
      <div style={{ background: 'linear-gradient(135deg, #1e3a5f, #2d5a8a)', color: 'white', padding: '28px 45px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', letterSpacing: '1px', marginBottom: '8px' }}>
          {personalInfo.fullName || t(language, 'fullName')}
        </h1>
        <div style={{ fontSize: '10.5px', display: 'flex', gap: '14px', flexWrap: 'wrap', opacity: 0.9 }}>
          {contactItems.map((item) => (
            <span key={item.key} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ display: 'inline-flex', width: '12px', height: '12px' }}>
                <ContactIcon name={item.icon} style={{ width: '100%', height: '100%' }} />
              </span>
              <span>{item.value}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '28px 45px' }}>
        {/* Summary */}
        {personalInfo.summary && (
          <div style={{ marginBottom: '22px' }}>
            <p style={{ color: '#444', fontSize: '11px', lineHeight: '1.7' }}>{personalInfo.summary}</p>
          </div>
        )}

        {/* Sections */}
        {sections.map((section) => (
          <div key={section.id} style={{ marginBottom: '20px' }}>
            <h2 style={{ fontSize: '13px', fontWeight: '700', color: '#1e3a5f', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px', background: 'linear-gradient(90deg, #f0f4f8, transparent)', padding: '5px 10px', borderRadius: '4px' }}>
              {section.title}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {section.entries.map((entry) => (
                <div key={entry.id} style={{ paddingLeft: '10px', borderLeft: '3px solid #1e3a5f' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '3px' }}>
                    <span style={{ fontWeight: '600', color: '#1a1a2e', fontSize: '12px' }}>
                      {entry.fields.position || entry.fields.degree || entry.fields.name || entry.fields.institution || entry.fields.company || entry.fields.language || entry.fields.title || 'Entry'}
                    </span>
                    <span style={{ fontSize: '10.5px', color: '#666', fontWeight: '500' }}>
                      {entry.fields.startDate && entry.fields.endDate ? `${entry.fields.startDate} — ${entry.fields.endDate}` : entry.fields.date || ''}
                    </span>
                  </div>
                  <div style={{ fontSize: '11px', color: '#1e3a5f', fontWeight: '600', marginBottom: '3px' }}>
                    {entry.fields.company}
                    {entry.fields.institution}
                    {entry.fields.issuer && ` — ${entry.fields.issuer}`}
                    {entry.fields.proficiency}
                  </div>
                  {entry.fields.description && (
                    <ul style={{ margin: '5px 0 0 18px', padding: 0, fontSize: '11px', color: '#444', lineHeight: '1.6' }}>
                      {entry.fields.description.split('\n').map((line, i) => (
                        <li key={i} style={{ marginBottom: '3px' }}>{line.trim()}</li>
                      ))}
                    </ul>
                  )}
                  {entry.fields.technologies && (
                    <div style={{ marginTop: '6px', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {entry.fields.technologies.split(',').map((tech, i) => (
                        <span key={i} style={{ fontSize: '9px', background: '#f0f4f8', color: '#1e3a5f', padding: '2px 8px', borderRadius: '4px', fontWeight: '500' }}>
                          {tech.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
