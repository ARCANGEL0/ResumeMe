import ContactIcon from '../../ui/ContactIcon';
import { t } from '../../i18n';
import { useCVStore } from '../../store/cvStore';
import { type CVData } from '../../types/cv';
import { getContactItems } from './templateUtils';

interface TemplateProps {
  data: CVData;
}

export function ModernTemplate({ data }: TemplateProps) {
  const { personalInfo, sections } = data;
  const language = useCVStore((state) => state.language);
  const contactItems = getContactItems(personalInfo);

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", fontSize: '12px', lineHeight: '1.6', color: '#1a1a2e', display: 'flex', minHeight: '297mm', background: '#fff' }}
    >
      {/* Sidebar with gradient */}
      <div style={{ width: '34%', background: 'linear-gradient(180deg, #7c3aed 0%, #6d28d9 50%, #5b21b6 100%)', color: 'white', padding: '35px 22px', position: 'relative' }}
      >
        {/* Decorative circle */}
        <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }}
        ></div>

        {/* Name */}
        <h1 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '2px', position: 'relative', zIndex: 1 }}
        >
          {personalInfo.fullName || t(language, 'fullName')}
        </h1>
        <div style={{ width: '40px', height: '3px', background: 'rgba(255,255,255,0.5)', borderRadius: '2px', marginBottom: '24px' }}></div>

        {/* Contact */}
        <div style={{ marginTop: '20px', fontSize: '10.5px' }}
        >
          <h3 style={{ fontSize: '12px', fontWeight: '700', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.9 }}>
            {t(language, 'contact')}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {contactItems.map((item) => (
              <div key={item.key} style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.92 }}>
                <span style={{ display: 'inline-flex', width: '24px', height: '24px', alignItems: 'center', justifyContent: 'center', borderRadius: '999px', background: 'rgba(255,255,255,0.12)' }}>
                  <ContactIcon name={item.icon} style={{ width: '12px', height: '12px' }} />
                </span>
                <span>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Skills */}
        {sections
          .filter((s) => s.type === 'skills')
          .map((section) => (
            <div key={section.id} style={{ marginTop: '28px' }}
            >
              <h3 style={{ fontSize: '12px', fontWeight: '700', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.9 }}>
                {section.title}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {section.entries.map((entry) => (
                  <div key={entry.id}
                  >
                    <span style={{ fontWeight: '600', fontSize: '10.5px' }}>{entry.fields.name}</span>
                    {entry.fields.level && (
                      <div style={{ display: 'flex', gap: '3px', marginTop: '3px' }}>
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div
                            key={i}
                            style={{
                              width: '22px',
                              height: '4px',
                              borderRadius: '2px',
                              backgroundColor: i <= (parseInt(entry.fields.level || '0') || 3) ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.2)',
                              transition: 'all 0.3s',
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

        {/* Languages */}
        {sections
          .filter((s) => s.type === 'languages')
          .map((section) => (
            <div key={section.id} style={{ marginTop: '28px' }}
            >
              <h3 style={{ fontSize: '12px', fontWeight: '700', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.9 }}>
                {section.title}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {section.entries.map((entry) => (
                  <div key={entry.id} style={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <span style={{ fontWeight: '600', fontSize: '10.5px' }}>{entry.fields.language}</span>
                    {entry.fields.proficiency && (
                      <span style={{ fontSize: '10px', opacity: 0.8 }}>{entry.fields.proficiency}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>

      {/* Main content */}
      <div style={{ width: '66%', padding: '35px 28px', background: '#fff' }}
      >
        {/* Summary */}
        {personalInfo.summary && (
          <div style={{ marginBottom: '24px' }}
          >
            <h2 style={{ fontSize: '14px', fontWeight: '800', color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#7c3aed', display: 'inline-block' }}></span>
              {t(language, 'profile')}
            </h2>
            <p style={{ color: '#4a4a6a', lineHeight: '1.7', fontSize: '11px' }}>{personalInfo.summary}</p>
          </div>
        )}

        {/* Main sections */}
        {sections
          .filter((s) => !['skills', 'languages'].includes(s.type))
          .map((section) => (
            <div key={section.id} style={{ marginBottom: '24px' }}
            >
              <h2 style={{ fontSize: '14px', fontWeight: '800', color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#7c3aed', display: 'inline-block' }}></span>
                {section.title}
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {section.entries.map((entry) => (
                  <div key={entry.id} style={{ paddingLeft: '12px', borderLeft: '2px solid #e2d9f3', position: 'relative' }}
                  >
                    <div style={{ position: 'absolute', left: '-5px', top: '6px', width: '8px', height: '8px', borderRadius: '50%', background: '#7c3aed' }}></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2px' }}
                    >
                      <span style={{ fontWeight: '700', fontSize: '12px', color: '#1a1a2e' }}>
                        {entry.fields.position || entry.fields.degree || entry.fields.name || entry.fields.title || entry.fields.institution || entry.fields.company || 'Entry'}
                      </span>
                      <span style={{ fontSize: '10px', color: '#888', fontWeight: '500' }}>
                        {entry.fields.startDate && entry.fields.endDate ? `${entry.fields.startDate} — ${entry.fields.endDate}` : entry.fields.date || ''}
                      </span>
                    </div>
                    <div style={{ fontSize: '11px', color: '#7c3aed', fontWeight: '600', marginBottom: '4px' }}
                    >
                      {entry.fields.company}
                      {entry.fields.institution}
                      {entry.fields.issuer}
                    </div>
                    {entry.fields.field && (
                      <div style={{ fontSize: '10px', color: '#666', marginBottom: '2px' }}>Field: {entry.fields.field}</div>
                    )}
                    {entry.fields.description && (
                      <p style={{ color: '#4a4a6a', fontSize: '11px', lineHeight: '1.6', marginTop: '4px' }}>{entry.fields.description}</p>
                    )}
                    {entry.fields.technologies && (
                      <div style={{ marginTop: '6px', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {entry.fields.technologies.split(',').map((tech, i) => (
                          <span key={i} style={{ fontSize: '9px', background: '#f3e8ff', color: '#7c3aed', padding: '2px 8px', borderRadius: '10px', fontWeight: '500' }}>
                            {tech.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                    {entry.fields.url && (
                      <span style={{ fontSize: '10px', color: '#7c3aed', marginTop: '4px', display: 'block' }}>{entry.fields.url}</span>
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
