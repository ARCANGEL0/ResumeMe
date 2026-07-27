import { type CSSProperties, type ReactNode } from 'react';
import { t } from '../../i18n';
import { useCVStore } from '../../store/cvStore';
import type { CVData } from '../../types/cv';
import { TEMPLATE_THEMES } from './templateCatalog';
import { ensureTemplateLayout, getSectionsForRegion } from './templateLayout';
import { getContactItems } from './templateUtils';
import { CustomSectionRegion, LinkedText, SectionBlockBody, type TemplateLayoutEditor } from './templateComponents';
import RetroIcon, { W95_ICONS, getContactIconSrc, getSectionIconSrc } from '../../ui/RetroIcon';

interface Props {
  data: CVData;
  layoutEditor?: TemplateLayoutEditor;
}

const FACE = '#c0c0c0';
const NAVY = '#000080';
const RAISED = 'inset -1px -1px 0 #000000, inset 1px 1px 0 #ffffff, inset -2px -2px 0 #808080, inset 2px 2px 0 #dfdfdf';
const SUNKEN = 'inset -1px -1px 0 #ffffff, inset 1px 1px 0 #808080, inset -2px -2px 0 #dfdfdf, inset 2px 2px 0 #000000';

export default function Retro95({ data, layoutEditor }: Props) {
  const language = useCVStore((state) => state.language);
  const theme = TEMPLATE_THEMES['retro95'];
  const { personalInfo, sections } = data;
  const layoutState = ensureTemplateLayout('retro95', data.layoutOverride, sections);
  const displayName = personalInfo.fullName || t(language, 'fullName');
  const contactItems = getContactItems(personalInfo, language);
  const summary = personalInfo.summary.trim();
  const photo = personalInfo.photo;

  const baseStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    fontFamily: theme.fontFamily,
    fontSize: '11px',
    lineHeight: '1.45',
    color: '#000000',
    background: '#008080',
    minHeight: '297mm',
  };

  const sidebarSections = getSectionsForRegion(sections, layoutState, 'sidebar');
  const mainSections = getSectionsForRegion(sections, layoutState, 'main');

  return (
    <div style={baseStyle}>
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '3px', background: FACE, boxShadow: RAISED }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px',
            padding: '3px 3px 3px 5px',
            background: `linear-gradient(90deg, ${NAVY} 0%, #1084d0 100%)`,
            color: '#ffffff',
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '11.5px' }}>
            <RetroIcon src={W95_ICONS.notepad} size={16} />
            {`${displayName} - Resume`}
          </span>
          <span style={{ display: 'inline-flex', gap: '2px' }}>
            {['_', '□', '✕'].map((glyph) => (
              <span
                key={glyph}
                style={{
                  display: 'inline-flex',
                  width: '17px',
                  height: '15px',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: FACE,
                  color: '#000000',
                  fontSize: '9px',
                  fontWeight: 700,
                  lineHeight: 1,
                  boxShadow: 'inset -1px -1px 0 #000000, inset 1px 1px 0 #ffffff',
                }}
              >
                {glyph}
              </span>
            ))}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '3px', padding: '3px 2px', fontSize: '11px' }}>
          {['File', 'Edit', 'View', 'Insert', 'Help'].map((item) => (
            <span key={item} style={{ padding: '1px 7px' }}>
              <u>{item.slice(0, 1)}</u>
              {item.slice(1)}
            </span>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '3px', padding: '2px 3px 4px', borderBottom: '1px solid #808080' }}>
          {[W95_ICONS.notepad, W95_ICONS.briefcase, W95_ICONS.certificate, W95_ICONS.paint, W95_ICONS.globe].map((icon, index) => (
            <span key={index} style={{ display: 'inline-flex', padding: '2px', background: FACE, boxShadow: RAISED }}>
              <RetroIcon src={icon} size={18} />
            </span>
          ))}
          <span style={{ width: '2px', height: '20px', margin: '0 3px', background: '#808080', boxShadow: '1px 0 0 #ffffff' }} />
          <span style={{ flex: 1, padding: '2px 6px', background: '#ffffff', boxShadow: SUNKEN, fontSize: '10px', color: '#404040' }}>
            {`C:\\Documents\\${displayName.replace(/\s+/g, '')}.doc`}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '206px minmax(0, 1fr)', gap: '6px', flex: 1, padding: '6px 4px 4px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {photo && (
              <div style={{ padding: '4px', background: FACE, boxShadow: RAISED }}>
                <div style={{ padding: '3px', background: '#ffffff', boxShadow: SUNKEN }}>
                  <img src={photo} alt="" style={{ width: '100%', display: 'block' }} />
                </div>
              </div>
            )}

            <W95Group icon={W95_ICONS.address} title={t(language, 'contact')}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {contactItems.map((item) => (
                  <span key={item.key} style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                    <RetroIcon src={getContactIconSrc('w95', item.icon)} size={16} />
                    <LinkedText href={item.href} style={{ color: NAVY }}>
                      {item.value}
                    </LinkedText>
                  </span>
                ))}
              </div>
            </W95Group>

            <CustomSectionRegion
              sections={sidebarSections}
              regionKey="sidebar"
              layoutEditor={layoutEditor}
              gap="6px"
              renderSection={(section) => (
                <W95Group icon={getSectionIconSrc('w95', section.type)} title={section.title}>
                  <SectionBlockBody section={section} theme={theme} />
                </W95Group>
              )}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ padding: '14px 16px', background: '#ffffff', boxShadow: SUNKEN }}>
              <h1 style={{ margin: 0, fontSize: '26px', fontWeight: 700, lineHeight: 1.1, color: NAVY }}>
                {displayName}
              </h1>
              <div style={{ height: '2px', margin: '10px 0', background: '#808080', boxShadow: '0 1px 0 #ffffff' }} />
              {summary && <p style={{ margin: 0, color: '#303030' }}>{summary}</p>}
            </div>

            <CustomSectionRegion
              sections={mainSections}
              regionKey="main"
              layoutEditor={layoutEditor}
              gap="6px"
              renderSection={(section) => (
                <W95Group icon={getSectionIconSrc('w95', section.type)} title={section.title} light>
                  <SectionBlockBody section={section} theme={theme} />
                </W95Group>
              )}
            />
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
            padding: '3px 5px',
            background: FACE,
            boxShadow: 'inset 0 1px 0 #ffffff, inset 0 2px 0 #dfdfdf',
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '2px 8px', boxShadow: SUNKEN, color: '#303030' }}>
            <RetroIcon src={W95_ICONS.computer} size={14} />
            {`${contactItems.length} item(s)`}
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '2px 10px', boxShadow: SUNKEN }}>
            <RetroIcon src={W95_ICONS.computer} size={14} />
          </span>
        </div>
      </div>
    </div>
  );
}

function W95Group({
  children,
  icon,
  light = false,
  title,
}: {
  children: ReactNode;
  icon: string;
  light?: boolean;
  title: string;
}) {
  return (
    <div style={{ padding: '4px', background: FACE, boxShadow: RAISED }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '2px 5px',
          background: `linear-gradient(90deg, ${NAVY}, #1084d0)`,
          color: '#ffffff',
          fontSize: '11px',
          fontWeight: 700,
        }}
      >
        <RetroIcon src={icon} size={15} />
        {title}
      </div>
      <div style={{ padding: '9px 10px 10px', background: light ? '#ffffff' : FACE, boxShadow: light ? SUNKEN : 'none' }}>
        {children}
      </div>
    </div>
  );
}
