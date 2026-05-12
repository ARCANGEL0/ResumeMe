import { Suspense, useMemo, useRef, useState, useCallback, useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useCVStore } from '../../store/cvStore';
import { TEMPLATES, type TemplateId } from '../../types/cv';
import getTemplate from './getTemplate';

const VALID_TEMPLATE_IDS = new Set(TEMPLATES.map(t => t.id));

function isValidTemplateId(id: string): id is TemplateId {
  return VALID_TEMPLATE_IDS.has(id as TemplateId);
}

function getPinchDistance(touches: React.TouchList): number {
  const dx = touches[0].clientX - touches[1].clientX;
  const dy = touches[0].clientY - touches[1].clientY;
  return Math.sqrt(dx * dx + dy * dy);
}

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 3.0;

export default function PreviewPanel() {
  const { personalInfo, sections, selectedTemplate, templateLayouts } = useCVStore(
    useShallow((state) => ({
      personalInfo: state.personalInfo,
      sections: state.sections,
      selectedTemplate: state.selectedTemplate,
      templateLayouts: state.templateLayouts,
    }))
  );
  const safeTemplate = isValidTemplateId(selectedTemplate) ? selectedTemplate : 'minimal';
  const cvData = useMemo(
    () => ({
      personalInfo,
      sections,
      selectedTemplate: safeTemplate,
      layoutOverride: templateLayouts[safeTemplate],
    }),
    [personalInfo, sections, safeTemplate, templateLayouts]
  );
  const Component = getTemplate(safeTemplate);

  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);

  const stateRef = useRef({ zoom, panX, panY });
  stateRef.current = { zoom, panX, panY };

  const touchRef = useRef<{
    startTouches: { x: number; y: number }[];
    startPinchDist: number;
    lastPanX: number;
    lastPanY: number;
  }>({ startTouches: [], startPinchDist: 0, lastPanX: 0, lastPanY: 0 });

  const lastTouchEndRef = useRef(0);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const now = Date.now();
    if (e.touches.length === 1 && now - lastTouchEndRef.current < 300) {
      setZoom(1);
      setPanX(0);
      setPanY(0);
      lastTouchEndRef.current = 0;
      return;
    }
    if (e.touches.length === 2) {
      touchRef.current = {
        startTouches: [
          { x: e.touches[0].clientX, y: e.touches[0].clientY },
          { x: e.touches[1].clientX, y: e.touches[1].clientY },
        ],
        startPinchDist: getPinchDistance(e.touches),
        lastPanX: stateRef.current.panX,
        lastPanY: stateRef.current.panY,
      };
    } else if (e.touches.length === 1 && stateRef.current.zoom > 1) {
      touchRef.current = {
        startTouches: [{ x: e.touches[0].clientX, y: e.touches[0].clientY }],
        startPinchDist: 0,
        lastPanX: stateRef.current.panX,
        lastPanY: stateRef.current.panY,
      };
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (touchRef.current.startTouches.length === 0) return;

    if (e.touches.length === 2) {
      const currentDist = getPinchDistance(e.touches);
      if (touchRef.current.startPinchDist > 0) {
        const delta = currentDist / touchRef.current.startPinchDist;
        setZoom(prev => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, prev * delta)));
      }
      touchRef.current.startPinchDist = currentDist;
    } else if (e.touches.length === 1 && stateRef.current.zoom > 1) {
      const dx = e.touches[0].clientX - touchRef.current.startTouches[0].x;
      const dy = e.touches[0].clientY - touchRef.current.startTouches[0].y;
      setPanX(touchRef.current.lastPanX + dx);
      setPanY(touchRef.current.lastPanY + dy);
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    lastTouchEndRef.current = Date.now();
    touchRef.current = { startTouches: [], startPinchDist: 0, lastPanX: 0, lastPanY: 0 };
  }, []);

  const handleDoubleClick = useCallback(() => {
    setZoom(1);
    setPanX(0);
    setPanY(0);
  }, []);

  const zoomIn = useCallback(() => {
    setZoom(prev => Math.min(MAX_ZOOM, prev + 0.25));
  }, []);

  const zoomOut = useCallback(() => {
    setZoom(prev => Math.max(MIN_ZOOM, prev - 0.25));
  }, []);

  const [baseScale, setBaseScale] = useState(1);
  useEffect(() => {
    const computeScale = () => {
      if (window.innerWidth <= 1024) {
        setBaseScale(Math.min(1, (window.innerWidth - 40) / 793));
      } else {
        setBaseScale(1);
      }
    };
    computeScale();
    window.addEventListener('resize', computeScale);
    return () => window.removeEventListener('resize', computeScale);
  }, []);

  useEffect(() => {
    if (zoom === 1) {
      setPanX(0);
      setPanY(0);
    }
  }, [zoom]);

  return (
    <>
      <div className="preview-panel__inner">
        <div
          className="preview-paper-shell"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onDoubleClick={handleDoubleClick}
        >
          <div
            className="preview-paper"
            style={{
              transform: `scale(${baseScale * zoom}) translate(${panX}px, ${panY}px)`,
              transformOrigin: 'top center',
            }}
          >
            <div id="cv-preview">
              <Suspense fallback={<div className="preview-loading">Loading...</div>}>
                <Component data={cvData} />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
      <div className="preview-zoom-controls">
        <button onClick={zoomOut} aria-label="Zoom out">&minus;</button>
        <span>{Math.round(zoom * 100)}%</span>
        <button onClick={zoomIn} aria-label="Zoom in">+</button>
      </div>
    </>
  );
}
