import { useCallback, useEffect, useRef, useState } from 'react';

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 3.0;

type Point = {
  x: number;
  y: number;
};

type TouchGestureState =
  | { mode: 'idle' }
  | {
      mode: 'pan';
      startTouch: Point;
      startPanX: number;
      startPanY: number;
    }
  | {
      mode: 'pinch';
      startCenter: Point;
      startDistance: number;
      startZoom: number;
      startPanX: number;
      startPanY: number;
    };

interface ZoomablePreviewProps {
  children: React.ReactNode;
  className?: string;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getDistance(a: Point, b: Point) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function getTouchPoint(touch: Touch) {
  return { x: touch.clientX, y: touch.clientY };
}

function getTouchCenter(first: Touch, second: Touch) {
  return {
    x: (first.clientX + second.clientX) / 2,
    y: (first.clientY + second.clientY) / 2,
  };
}

function getBaseScaleForViewport(width: number) {
  if (width <= 480) {
    return 0.4;
  }

  if (width <= 768) {
    return 0.44;
  }

  if (width <= 1024) {
    return 0.48;
  }

  return 1;
}

export default function ZoomablePreview({ children, className }: ZoomablePreviewProps) {
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [baseScale, setBaseScale] = useState(1);
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const [isDesktopPanning, setIsDesktopPanning] = useState(false);

  const viewportRef = useRef<HTMLDivElement | null>(null);
  const paperRef = useRef<HTMLDivElement | null>(null);
  const stateRef = useRef({ zoom: 1, panX: 0, panY: 0, baseScale: 1 });
  const touchGestureRef = useRef<TouchGestureState>({ mode: 'idle' });
  const mousePanRef = useRef<{
    active: boolean;
    startPointer: Point;
    startPanX: number;
    startPanY: number;
  }>({
    active: false,
    startPointer: { x: 0, y: 0 },
    startPanX: 0,
    startPanY: 0,
  });

  stateRef.current = { zoom, panX, panY, baseScale };

  const resetView = useCallback(() => {
    setZoom(1);
    setPanX(0);
    setPanY(0);
    touchGestureRef.current = { mode: 'idle' };
    mousePanRef.current.active = false;
    setIsDesktopPanning(false);
  }, []);

  const getViewportPoint = useCallback((clientX: number, clientY: number): Point => {
    const bounds = viewportRef.current?.getBoundingClientRect();
    if (!bounds) {
      return { x: clientX, y: clientY };
    }

    return {
      x: clientX - bounds.left,
      y: clientY - bounds.top,
    };
  }, []);

  const applyZoomAtPoint = useCallback(
    (nextZoom: number, anchor: Point) => {
      const current = stateRef.current;
      const boundedZoom = clamp(nextZoom, MIN_ZOOM, MAX_ZOOM);
      const currentScale = current.baseScale * current.zoom;
      const nextScale = current.baseScale * boundedZoom;

      if (currentScale === 0 || nextScale === 0) {
        return;
      }

      const contentX = (anchor.x - current.panX) / currentScale;
      const contentY = (anchor.y - current.panY) / currentScale;

      setZoom(boundedZoom);
      setPanX(anchor.x - contentX * nextScale);
      setPanY(anchor.y - contentY * nextScale);
    },
    [],
  );

  const handleTouchStart = useCallback(
    (event: React.TouchEvent<HTMLDivElement>) => {
      if (!isMobileViewport) {
        return;
      }

      const target = event.target as HTMLElement | null;
      if (target?.closest('.preview-zoom-controls')) {
        return;
      }

      if (event.touches.length >= 2) {
        if (event.cancelable) {
          event.preventDefault();
        }

        const center = getViewportPoint(
          (event.touches[0].clientX + event.touches[1].clientX) / 2,
          (event.touches[0].clientY + event.touches[1].clientY) / 2,
        );

        touchGestureRef.current = {
          mode: 'pinch',
          startCenter: center,
          startDistance: getDistance(getTouchPoint(event.touches[0]), getTouchPoint(event.touches[1])),
          startZoom: stateRef.current.zoom,
          startPanX: stateRef.current.panX,
          startPanY: stateRef.current.panY,
        };
        return;
      }

      if (event.touches.length === 1) {
        if (event.cancelable) {
          event.preventDefault();
        }

        touchGestureRef.current = {
          mode: 'pan',
          startTouch: getViewportPoint(event.touches[0].clientX, event.touches[0].clientY),
          startPanX: stateRef.current.panX,
          startPanY: stateRef.current.panY,
        };
      }
    },
    [getViewportPoint, isMobileViewport],
  );

  const handleTouchMove = useCallback(
    (event: React.TouchEvent<HTMLDivElement>) => {
      if (!isMobileViewport) {
        return;
      }

      if (event.touches.length >= 2) {
        if (event.cancelable) {
          event.preventDefault();
        }

        const currentCenter = getViewportPoint(
          (event.touches[0].clientX + event.touches[1].clientX) / 2,
          (event.touches[0].clientY + event.touches[1].clientY) / 2,
        );

        const gesture =
          touchGestureRef.current.mode === 'pinch'
            ? touchGestureRef.current
            : {
                mode: 'pinch' as const,
                startCenter: currentCenter,
                startDistance: getDistance(getTouchPoint(event.touches[0]), getTouchPoint(event.touches[1])),
                startZoom: stateRef.current.zoom,
                startPanX: stateRef.current.panX,
                startPanY: stateRef.current.panY,
              };

        touchGestureRef.current = gesture;

        const currentDistance = getDistance(getTouchPoint(event.touches[0]), getTouchPoint(event.touches[1]));
        const nextZoom = clamp((gesture.startZoom * currentDistance) / Math.max(gesture.startDistance, 1), MIN_ZOOM, MAX_ZOOM);
        const startScale = stateRef.current.baseScale * gesture.startZoom;
        const nextScale = stateRef.current.baseScale * nextZoom;
        const contentX = (gesture.startCenter.x - gesture.startPanX) / startScale;
        const contentY = (gesture.startCenter.y - gesture.startPanY) / startScale;

        setZoom(nextZoom);
        setPanX(currentCenter.x - contentX * nextScale);
        setPanY(currentCenter.y - contentY * nextScale);
        return;
      }

      if (event.touches.length === 1) {
        if (event.cancelable) {
          event.preventDefault();
        }

        const gesture =
          touchGestureRef.current.mode === 'pan'
            ? touchGestureRef.current
            : {
                mode: 'pan' as const,
                startTouch: getViewportPoint(event.touches[0].clientX, event.touches[0].clientY),
                startPanX: stateRef.current.panX,
                startPanY: stateRef.current.panY,
              };

        touchGestureRef.current = gesture;

        const currentPoint = getViewportPoint(event.touches[0].clientX, event.touches[0].clientY);
        setPanX(gesture.startPanX + currentPoint.x - gesture.startTouch.x);
        setPanY(gesture.startPanY + currentPoint.y - gesture.startTouch.y);
      }
    },
    [getViewportPoint, isMobileViewport],
  );

  const handleTouchEnd = useCallback(
    (event: React.TouchEvent<HTMLDivElement>) => {
      if (!isMobileViewport) {
        return;
      }

      if (event.touches.length >= 2) {
        const center = getViewportPoint(
          (event.touches[0].clientX + event.touches[1].clientX) / 2,
          (event.touches[0].clientY + event.touches[1].clientY) / 2,
        );

        touchGestureRef.current = {
          mode: 'pinch',
          startCenter: center,
          startDistance: getDistance(getTouchPoint(event.touches[0]), getTouchPoint(event.touches[1])),
          startZoom: stateRef.current.zoom,
          startPanX: stateRef.current.panX,
          startPanY: stateRef.current.panY,
        };
        return;
      }

      if (event.touches.length === 1) {
        touchGestureRef.current = {
          mode: 'pan',
          startTouch: getViewportPoint(event.touches[0].clientX, event.touches[0].clientY),
          startPanX: stateRef.current.panX,
          startPanY: stateRef.current.panY,
        };
        return;
      }

      touchGestureRef.current = { mode: 'idle' };
    },
    [getViewportPoint, isMobileViewport],
  );

  const handleWheel = useCallback(
    (event: React.WheelEvent<HTMLDivElement>) => {
      if (isMobileViewport) {
        return;
      }

      const target = event.target as HTMLElement | null;
      if (target?.closest('.preview-zoom-controls')) {
        return;
      }

      event.preventDefault();

      const factor = Math.exp(-event.deltaY * 0.0015);
      const anchor = getViewportPoint(event.clientX, event.clientY);
      applyZoomAtPoint(stateRef.current.zoom * factor, anchor);
    },
    [applyZoomAtPoint, getViewportPoint, isMobileViewport],
  );

  const handleDesktopPanStart = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (isMobileViewport || event.button !== 0) {
        return;
      }

      const target = event.target as HTMLElement | null;
      if (target?.closest('.preview-zoom-controls')) {
        return;
      }

      if (paperRef.current?.contains(target)) {
        return;
      }

      mousePanRef.current = {
        active: true,
        startPointer: getViewportPoint(event.clientX, event.clientY),
        startPanX: stateRef.current.panX,
        startPanY: stateRef.current.panY,
      };
      setIsDesktopPanning(true);
      event.preventDefault();
    },
    [getViewportPoint, isMobileViewport],
  );

  const handleDoubleClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (isMobileViewport) {
        return;
      }

      const target = event.target as HTMLElement | null;
      if (target?.closest('.preview-zoom-controls')) {
        return;
      }

      resetView();
    },
    [isMobileViewport, resetView],
  );

  const zoomIn = useCallback(() => {
    const bounds = viewportRef.current?.getBoundingClientRect();
    const anchor = bounds
      ? { x: bounds.width / 2, y: bounds.height / 2 }
      : { x: 0, y: 0 };

    applyZoomAtPoint(stateRef.current.zoom + 0.2, anchor);
  }, [applyZoomAtPoint]);

  const zoomOut = useCallback(() => {
    const bounds = viewportRef.current?.getBoundingClientRect();
    const anchor = bounds
      ? { x: bounds.width / 2, y: bounds.height / 2 }
      : { x: 0, y: 0 };

    applyZoomAtPoint(stateRef.current.zoom - 0.2, anchor);
  }, [applyZoomAtPoint]);

  useEffect(() => {
    const updateViewportMode = () => {
      const mobile = window.innerWidth <= 1024;
      setIsMobileViewport(mobile);
      setBaseScale(getBaseScaleForViewport(window.innerWidth));
    };

    updateViewportMode();
    window.addEventListener('resize', updateViewportMode);
    return () => window.removeEventListener('resize', updateViewportMode);
  }, []);

  useEffect(() => {
    const handleWindowMouseMove = (event: MouseEvent) => {
      if (!mousePanRef.current.active) {
        return;
      }

      const currentPoint = getViewportPoint(event.clientX, event.clientY);
      setPanX(mousePanRef.current.startPanX + currentPoint.x - mousePanRef.current.startPointer.x);
      setPanY(mousePanRef.current.startPanY + currentPoint.y - mousePanRef.current.startPointer.y);
    };

    const handleWindowMouseUp = () => {
      if (!mousePanRef.current.active) {
        return;
      }

      mousePanRef.current.active = false;
      setIsDesktopPanning(false);
    };

    window.addEventListener('mousemove', handleWindowMouseMove);
    window.addEventListener('mouseup', handleWindowMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove);
      window.removeEventListener('mouseup', handleWindowMouseUp);
    };
  }, [getViewportPoint]);

  return (
    <div className="preview-stage">
      <div
        ref={viewportRef}
        className={`preview-viewport ${isDesktopPanning ? 'is-panning' : ''}`}
        onMouseDown={handleDesktopPanStart}
        onWheel={handleWheel}
        onDoubleClick={handleDoubleClick}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        style={{ touchAction: isMobileViewport ? 'none' : 'auto' }}
      >
        <div className="preview-paper-shell">
          <div
            ref={paperRef}
            className={className ?? 'preview-paper'}
            style={{
              transform: `translate(${panX}px, ${panY}px) scale(${baseScale * zoom})`,
              transformOrigin: 'top left',
              userSelect: 'none',
            }}
          >
            {children}
          </div>
        </div>
      </div>

      <div className="preview-zoom-controls" onWheel={(event) => event.stopPropagation()}>
        <button type="button" onClick={zoomOut} aria-label="Zoom out">
          -
        </button>
        <button type="button" onClick={resetView} aria-label="Reset zoom">
          {Math.round(zoom * 100)}%
        </button>
        <button type="button" onClick={zoomIn} aria-label="Zoom in">
          +
        </button>
      </div>
    </div>
  );
}
