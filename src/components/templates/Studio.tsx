import { type ReactNode } from 'react';
import { t } from '../../i18n';
import { useCVStore } from '../../store/cvStore';
import type { CVData, CVSection } from '../../types/cv';
import { ensureTemplateLayout, getSectionsForRegion } from './templateLayout';
import { getContactItems, getEntryDate, getEntrySubtitle, getEntryTitle, getResumeRole } from './templateUtils';
import { CustomSectionRegion, type TemplateLayoutEditor } from './templateComponents';

export default function Studio({ data, layoutEditor }: { data: CVData; layoutEditor?: TemplateLayoutEditor }) {
  const language = useCVStore((state) => state.language);
  const { personalInfo, sections } = data;
  const layout = ensureTemplateLayout('studio', data.layoutOverride, sections);
  const primary = getSectionsForRegion(sections, layout, 'main');
  const additional = getSectionsForRegion(sections, layout, 'side');
  const contacts = getContactItems(personalInfo, language);
  const name = personalInfo.fullName || t(language, 'fullName');
  const role = getResumeRole(personalInfo);

  return (
    <div style={{ minHeight: '297mm', padding: '32px 42px 42px', background: '#fff', color: '#252b33', fontFamily: "'IBM Plex Mono', 'SFMono-Regular', Consolas, 'Liberation Mono', monospace", fontSize: 11.5, lineHeight: 1.65 }}>
      <header style={{ padding: '19px 22px 18px', border: '1px solid #d8dee7', borderLeft: '4px solid #2457a6', background: '#fbfcfe' }}>
        <div style={{ color: '#68758a' }}><span style={{ color: '#7b3fa1' }}>const</span> <span style={{ color: '#1758a6' }}>resume</span> <span style={{ color: '#6a737d' }}>= {'{'}</span></div>
        <div style={{ margin: '7px 0 0 22px' }}><CodeKey>name</CodeKey>: <CodeString>{name}</CodeString>,</div>
        {role && <div style={{ marginLeft: 22 }}><CodeKey>title</CodeKey>: <CodeString>{role}</CodeString>,</div>}
        {contacts.length > 0 && <div style={{ marginLeft: 22 }}><CodeKey>contact</CodeKey>: [ {contacts.map((item, index) => <span key={item.key}><CodeString>{item.value}</CodeString>{index < contacts.length - 1 ? <span style={{ color: '#68758a' }}>, </span> : null}</span>)} ],</div>}
        <div style={{ color: '#6a737d' }}>{'};'}</div>
      </header>

      {personalInfo.summary.trim() && <section style={{ margin: '24px 0 25px', padding: '0 0 19px', borderBottom: '1px solid #cfd6df' }}>
        <div style={{ marginBottom: 7 }}><CodeKey>{t(language, 'profile').toLowerCase()}</CodeKey><span style={{ color: '#6a737d' }}> = </span><span style={{ color: '#6a737d' }}>`</span></div>
        <p style={{ margin: '0 0 0 22px', color: '#315d45', fontFamily: 'inherit', whiteSpace: 'pre-wrap' }}>{personalInfo.summary.trim()}</p>
        <div style={{ color: '#6a737d' }}>`,</div>
      </section>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <CustomSectionRegion sections={primary} regionKey="main" layoutEditor={layoutEditor} gap="15px" renderSection={(section) => <JsonSection section={section} />} />
        <CustomSectionRegion sections={additional} regionKey="side" layoutEditor={layoutEditor} gap="15px" renderSection={(section) => <JsonSection section={section} />} />
      </div>
      <div style={{ marginTop: 25, paddingTop: 12, borderTop: '1px solid #d8dee7', color: '#6a737d' }}>export default resume;</div>
    </div>
  );
}

function JsonSection({ section }: { section: CVSection }) {
  return (
    <section style={{ padding: '0 0 14px 12px', borderLeft: '2px solid #e2e7ef' }}>
      <div><CodeKey>{section.title.toLowerCase().replace(/\s+/g, '_')}</CodeKey>: [</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7, margin: '5px 0 0 18px' }}>
        {section.entries.map((entry, index) => {
          const fields = Object.entries(entry.fields).filter(([, value]) => value.trim());
          const date = getEntryDate(entry);
          const subtitle = getEntrySubtitle(entry);
          const title = getEntryTitle(entry);
          const remaining = fields.filter(([key]) => !['position', 'degree', 'name', 'title', 'company', 'institution', 'startDate', 'endDate', 'date', 'isCurrent', 'showStartOnly', 'showEndOnly'].includes(key));
          return (
            <div key={entry.id} style={{ color: '#252b33' }}>
              <div><span style={{ color: '#6a737d' }}>{'{'}</span> <CodeKey>title</CodeKey>: <CodeString>{title}</CodeString>,</div>
              {subtitle && <div style={{ marginLeft: 18 }}><CodeKey>organization</CodeKey>: <CodeString>{subtitle}</CodeString>,</div>}
              {date && <div style={{ marginLeft: 18 }}><CodeKey>period</CodeKey>: <CodeString>{date}</CodeString>,</div>}
              {remaining.map(([key, value]) => <div key={key} style={{ marginLeft: 18 }}><CodeKey>{key}</CodeKey>: <CodeString>{value}</CodeString>,</div>)}
              <div><span style={{ color: '#6a737d' }}>{'}'}{index < section.entries.length - 1 ? ',' : ''}</span></div>
            </div>
          );
        })}
      </div>
      <div>],</div>
    </section>
  );
}

function CodeKey({ children }: { children: ReactNode }) {
  return <span style={{ color: '#1758a6' }}>{JSON.stringify(children)}</span>;
}

function CodeString({ children }: { children: ReactNode }) {
  return <span style={{ color: '#267348' }}>{JSON.stringify(children)}</span>;
}
