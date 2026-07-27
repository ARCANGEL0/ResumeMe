import { type CSSProperties, type ReactNode } from 'react';
import { t } from '../../i18n';
import { useCVStore } from '../../store/cvStore';
import type { CVData } from '../../types/cv';
import { TEMPLATE_THEMES } from './templateCatalog';
import { ensureTemplateLayout, getSectionsForRegion } from './templateLayout';
import { getContactItems } from './templateUtils';
import { CustomSectionRegion, LinkedText, SectionBlockBody, type TemplateLayoutEditor } from './templateComponents';
import RetroIcon, { XP_ICONS, getContactIconSrc, getSectionIconSrc } from '../../ui/RetroIcon';

interface Props {
  data: CVData;
  layoutEditor?: TemplateLayoutEditor;
}

const XP = {
  titleBar: 'linear-gradient(180deg, #0a60d8 0%, #3f93f2 6%, #1c74e8 14%, #0b5bd3 42%, #0a55c9 88%, #2f81ea 100%)',
  taskPane: 'linear-gradient(180deg, #6d9fe0 0%, #9dc0ec 12%, #c3d8f2 34%, #d9e6f8 100%)',
  paneHead: 'linear-gradient(180deg, #f6f9ff 0%, #d3e2f8 100%)',
  paneBody: 'linear-gradient(180deg, #ffffff 0%, #eef4fd 100%)',
  taskBar: 'linear-gradient(180deg, #3168d5 0%, #4993ec 8%, #2e69cf 18%, #2358cf 90%, #1941a5 100%)',
  tray: 'linear-gradient(180deg, #1697ec 0%, #0f6fc0 100%)',
};

export default function Windows({ data, layoutEditor }: Props) {
  const language = useCVStore((state) => state.language);
  const theme = TEMPLATE_THEMES['windows'];
  const { personalInfo, sections } = data;
  const layoutState = ensureTemplateLayout('windows', data.layoutOverride, sections);
  const displayName = personalInfo.fullName || t(language, 'fullName');
  const contactItems = getContactItems(personalInfo, language);
  const summary = personalInfo.summary.trim();
  const photo = personalInfo.photo;

  const baseStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    fontFamily: theme.fontFamily,
    fontSize: '11px',
    lineHeight: '1.5',
    color: theme.text,
    background: '#ffffff',
    minHeight: '297mm',
  };

  const sidebarSections = getSectionsForRegion(sections, layoutState, 'sidebar');
  const mainSections = getSectionsForRegion(sections, layoutState, 'main');

  return (
    <div style={baseStyle}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px',
          height: '30px',
          padding: '0 5px 0 8px',
          background: XP.titleBar,
          color: '#ffffff',
        }}
      >
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '7px',
            fontWeight: 700,
            fontSize: '12px',
            textShadow: '1px 1px 1px rgba(0,0,0,0.5)',
          }}
        >
          <RetroIcon src={XP_ICONS.documents} size={17} />
          {`${displayName} - Curriculum Vitae`}
        </span>
        <span style={{ display: 'inline-flex', gap: '3px' }}>
          <TitleButton glyph="—" tint="linear-gradient(180deg, #6cb2fa 0%, #2f7fe4 48%, #0f5bc4 100%)" />
          <TitleButton glyph="❐" tint="linear-gradient(180deg, #6cb2fa 0%, #2f7fe4 48%, #0f5bc4 100%)" />
          <TitleButton glyph="✕" tint="linear-gradient(180deg, #f9a68b 0%, #e4553a 48%, #c22d12 100%)" />
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '218px minmax(0, 1fr)', flex: 1 }}>
        <aside style={{ padding: '14px 11px', background: XP.taskPane }}>
          {photo && (
            <div
              style={{
                marginBottom: '11px',
                padding: '8px',
                borderRadius: '6px',
                background: XP.paneBody,
                boxShadow: '0 1px 3px rgba(10,36,106,0.18)',
              }}
            >
              <img
                src={photo}
                alt=""
                style={{ width: '100%', display: 'block', border: '1px solid #7f9db9', borderRadius: '3px' }}
              />
            </div>
          )}

          <XpPane icon={XP_ICONS.address} title={t(language, 'contact')}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
              {contactItems.map((item) => (
                <span key={item.key} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <RetroIcon src={getContactIconSrc('xp', item.icon)} size={16} />
                  <LinkedText href={item.href} style={{ color: '#0a3d91' }}>
                    {item.value}
                  </LinkedText>
                </span>
              ))}
            </div>
          </XpPane>

          <div style={{ marginTop: '11px' }}>
            <CustomSectionRegion
              sections={sidebarSections}
              regionKey="sidebar"
              layoutEditor={layoutEditor}
              gap="11px"
              renderSection={(section) => (
                <XpPane icon={getSectionIconSrc('xp', section.type)} title={section.title}>
                  <SectionBlockBody section={section} theme={theme} />
                </XpPane>
              )}
            />
          </div>
        </aside>

        <main style={{ padding: '22px 26px 26px', background: '#ffffff' }}>
          <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 700, lineHeight: 1.08, color: '#0a3d91' }}>
            {displayName}
          </h1>
          <div
            style={{
              height: '2px',
              margin: '10px 0 16px',
              background: 'linear-gradient(90deg, #1c74e8, #9dc0ec 55%, transparent)',
            }}
          />
          {summary && <p style={{ margin: '0 0 20px', color: theme.muted }}>{summary}</p>}

          <CustomSectionRegion
            sections={mainSections}
            regionKey="main"
            layoutEditor={layoutEditor}
            gap="20px"
            renderSection={(section) => (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <RetroIcon src={getSectionIconSrc('xp', section.type)} size={20} />
                  <span style={{ color: '#0a3d91', fontSize: '13px', fontWeight: 700 }}>{section.title}</span>
                  <span style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, #9dc0ec, transparent)' }} />
                </div>
                <SectionBlockBody section={section} theme={theme} />
              </div>
            )}
          />
        </main>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '31px',
          padding: '0 0 0 8px',
          background: XP.taskBar,
          borderTop: '1px solid #4a8ce8',
          color: '#ffffff',
        }}
      >
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '7px',
            height: '23px',
            padding: '0 12px',
            borderRadius: '3px',
            background: 'rgba(255,255,255,0.16)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.28)',
            fontSize: '11px',
            fontWeight: 600,
          }}
        >
          <RetroIcon src={XP_ICONS.documents} size={15} />
          {`${displayName} - CV`}
        </span>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            height: '100%',
            padding: '0 16px',
            background: XP.tray,
          }}
        >
          <RetroIcon src={XP_ICONS.computer} size={15} />
          <RetroIcon src={XP_ICONS.internet} size={15} />
        </span>
      </div>
    </div>
  );
}

function XpPane({ children, icon, title }: { children: ReactNode; icon: string; title: string }) {
  return (
    <div
      style={{
        borderRadius: '6px',
        background: XP.paneBody,
        boxShadow: '0 1px 3px rgba(10,36,106,0.18)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '7px',
          padding: '5px 11px',
          background: XP.paneHead,
          color: '#215dc6',
          fontSize: '11.5px',
          fontWeight: 700,
        }}
      >
        <RetroIcon src={icon} size={16} />
        {title}
      </div>
      <div style={{ padding: '10px 12px 12px' }}>{children}</div>
    </div>
  );
}

function TitleButton({ glyph, tint }: { glyph: string; tint: string }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        width: '21px',
        height: '20px',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '3px',
        border: '1px solid rgba(255,255,255,0.75)',
        background: tint,
        color: '#ffffff',
        fontSize: '9px',
        fontWeight: 700,
        lineHeight: 1,
      }}
    >
      {glyph}
    </span>
  );
}
