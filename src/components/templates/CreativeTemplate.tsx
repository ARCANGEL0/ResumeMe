import ContactIcon from '../../ui/ContactIcon';
import { t } from '../../i18n';
import { useCVStore } from '../../store/cvStore';
import { type CVData } from '../../types/cv';
import { getContactItems } from './templateUtils';

interface TemplateProps {
  data: CVData;
}

export function CreativeTemplate({ data }: TemplateProps) {
  const { personalInfo, sections } = data;
  const language = useCVStore((state) => state.language);
  const contactItems = getContactItems(personalInfo);

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", fontSize: '12px', lineHeight: '1.6', color: '#1a1a2e', display: 'flex', minHeight: '297mm', position: 'relative', overflow: 'hidden', background: '#fff' }}>
      {/* Decorative sidebar stripe */}
      <div style={{ position: 'absolute', left: 0, top: 0, width: '10px', height: '100%', background: 'linear-gradient(180deg, #ec4899, #8b5cf6, #3b82f6)' }}></div>

      <div style={{ padding: '45px 45px 45px 60px', flex: 1 }}>
        {/* Header with big name */}
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: '800', background: 'linear-gradient(135deg, #ec4899, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '6px', letterSpacing: '-0.5px' }}>
            {personalInfo.fullName || t(language, 'fullName')}
          </h1>
          <div style={{ width: '50px', height: '3px', background: 'linear-gradient(90deg, #ec4899, #8b5cf6)', borderRadius: '2px', marginBottom: '10px' }}></div>
          <div style={{ fontSize: '10.5px', color: '#888', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {contactItems.map((item, index) => (
              <span
                key={item.key}
                style={{
                  background: index % 3 === 0 ? '#f3e8ff' : index % 3 === 1 ? '#fce7f3' : '#dbeafe',
                  padding: '3px 10px',
                  borderRadius: '12px',
                  color: index % 3 === 0 ? '#7c3aed' : index % 3 === 1 ? '#ec4899' : '#3b82f6',
                  fontWeight: '500',
                }}
              >
                <span style={{ display: 'inline-flex', width: '12px', height: '12px', marginRight: '6px' }}>
                  <ContactIcon name={item.icon} style={{ width: '100%', height: '100%' }} />
                </span>
                {item.value}
              </span>
            ))}
          </div>
        </div>

        {/* Summary */}
        {personalInfo.summary && (
          <div style={{ marginBottom: '24px', background: 'linear-gradient(135deg, #faf5ff, #fce7f3)', padding: '16px 20px', borderRadius: '12px', borderLeft: '4px solid #8b5cf6' }}>
            <p style={{ color: '#555', fontSize: '11px', lineHeight: '1.7' }}>{personalInfo.summary}</p>
          </div>
        )}

        {/* Sections */}
        {sections.map((section) => (
          <div key={section.id} style={{ marginBottom: '20px' }}>
            <h2 style={{ fontSize: '13px', fontWeight: '700', color: '#ec4899', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ec4899', display: 'inline-block' }}></span>
              {section.title}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {section.entries.map((entry) => (
                <div key={entry.id} style={{ padding: '14px 16px', background: '#fafafa', borderRadius: '10px', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '3px', height: '100%', background: 'linear-gradient(180deg, #ec4899, #8b5cf6)', borderRadius: '2px' }}></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '3px' }}>
                    <span style={{ fontWeight: '600', color: '#1a1a2e', fontSize: '12px' }}>
                      {entry.fields.position || entry.fields.degree || entry.fields.name || entry.fields.institution || entry.fields.company || entry.fields.language || entry.fields.title || 'Entry'}
                    </span>
                    <span style={{ fontSize: '10.5px', color: '#999', fontWeight: '500' }}>
                      {entry.fields.startDate && entry.fields.endDate ? `${entry.fields.startDate} — ${entry.fields.endDate}` : entry.fields.date || ''}
                    </span>
                  </div>
                  <div style={{ fontSize: '11px', color: '#8b5cf6', fontWeight: '600', marginBottom: '3px' }}>
                    {entry.fields.company}
                    {entry.fields.institution}
                    {entry.fields.issuer}
                    {entry.fields.proficiency}
                  </div>
                  {entry.fields.field && (
                    <div style={{ fontSize: '10px', color: '#666', marginBottom: '2px' }}>Field: {entry.fields.field}</div>
                  )}
                  {entry.fields.description && (
                    <p style={{ fontSize: '11px', color: '#555', marginTop: '5px', lineHeight: '1.6' }}>{entry.fields.description}</p>
                  )}
                  {entry.fields.technologies && (
                    <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                      {entry.fields.technologies.split(',').map((tech, i) => (
                        <span key={i} style={{ fontSize: '9px', background: 'linear-gradient(135deg, #f3e8ff, #fce7f3)', color: '#7c3aed', padding: '3px 10px', borderRadius: '12px', fontWeight: '500' }}>
                          {tech.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                  {entry.fields.url && (
                    <span style={{ fontSize: '10px', color: '#7c3aed', marginTop: '5px', display: 'block', fontWeight: '500' }}>{entry.fields.url}</span>
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
