import LanguageSelector from '../../ui/LanguageSelector';
import { t } from '../../i18n';
import { useEffect, useRef } from 'react';
import { useCVStore } from '../../store/cvStore';

const PHASE_OFFSET = Math.PI * 0.66;
const WAVE_STEP = 6;

const WAVE_CONFIG = [
  { amplitude: 60, frequency: 0.012, speed: 0.015, baseline: 0.68, colorIdx: 0 },
  { amplitude: 40, frequency: 0.018, speed: 0.022, baseline: 0.72, colorIdx: 1 },
  { amplitude: 25, frequency: 0.025, speed: 0.03, baseline: 0.76, colorIdx: 2 },
];

interface WaveState {
  frameId: number;
  tick: number;
  width: number;
  height: number;
  colors: string[];
}

function drawWave(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  amplitude: number,
  frequency: number,
  phase: number,
  baseline: number,
  fillStyle: string,
) {
  context.beginPath();
  context.moveTo(0, height);

  const hb = height * baseline;
  context.lineTo(0, hb + Math.sin(phase) * amplitude);

  for (let x = WAVE_STEP * 2; x <= width; x += WAVE_STEP * 2) {
    const midX = x - WAVE_STEP;
    const midY = hb + Math.sin(midX * frequency + phase) * amplitude;
    const endY = hb + Math.sin(x * frequency + phase) * amplitude;
    context.quadraticCurveTo(midX, midY, x, endY);
  }

  context.lineTo(width, height);
  context.closePath();
  context.fillStyle = fillStyle;
  context.fill();
}

function renderFrame(
  context: CanvasRenderingContext2D,
  state: WaveState,
) {
  context.clearRect(0, 0, state.width, state.height);

  WAVE_CONFIG.forEach((wave, index) => {
    const phase = state.tick * wave.speed + index * PHASE_OFFSET;
    drawWave(context, state.width, state.height, wave.amplitude, wave.frequency, phase, wave.baseline, state.colors[wave.colorIdx]);
  });
}

function resizeCanvas(
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
  state: WaveState,
) {
  state.width = window.innerWidth;
  state.height = window.innerHeight;
  const dpr = window.devicePixelRatio || 1;

  canvas.width = Math.floor(state.width * dpr);
  canvas.height = Math.floor(state.height * dpr);
  canvas.style.width = `${state.width}px`;
  canvas.style.height = `${state.height}px`;

  context.setTransform(dpr, 0, 0, dpr, 0, 0);
}

export default function LandingPage() {
  const { language, setView } = useCVStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const styles = getComputedStyle(document.documentElement);
    const colors = WAVE_CONFIG.map(w => styles.getPropertyValue(['--wave-1', '--wave-2', '--wave-3'][w.colorIdx]).trim());
    const state: WaveState = { frameId: 0, tick: 0, width: window.innerWidth, height: window.innerHeight, colors };

    const animate = () => {
      state.tick += 1;
      renderFrame(context, state);
      state.frameId = window.requestAnimationFrame(animate);
    };

    const handleResize = () => {
      resizeCanvas(canvas, context, state);
      renderFrame(context, state);
    };

    resizeCanvas(canvas, context, state);
    renderFrame(context, state);

    if (!mediaQuery.matches) {
      state.frameId = window.requestAnimationFrame(animate);
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (state.frameId) {
          window.cancelAnimationFrame(state.frameId);
          state.frameId = 0;
        }
      } else {
        if (!mediaQuery.matches && !state.frameId) {
          state.frameId = window.requestAnimationFrame(animate);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('resize', handleResize);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('resize', handleResize);
      if (state.frameId) {
        window.cancelAnimationFrame(state.frameId);
      }
    };
  }, []);

  return (
    <div className="landing-page">
      <canvas id="wave-canvas" ref={canvasRef} className="landing-wave-canvas" />
      <LanguageSelector className="landing-language no-print" />

      <div className="landing-hero">
        <h1 className="landing-title">
          <span className="landing-title__emoji" aria-hidden="true">📄</span>
          <span>Resume.Me</span>
        </h1>

        <p className="landing-subtitle">
          {t(language, 'landingSubtitle')}
        </p>

        <div className="landing-pills">
          {[t(language, 'fiveTemplates'), t(language, 'pdfExport'), t(language, 'livePreview')].map((pill) => (
            <span key={pill} className="landing-pill">
              {pill}
            </span>
          ))}
        </div>

        <div className="landing-cta-group">
          <button
            type="button"
            onClick={() => setView('editor')}
            className="primary-action primary-action--hero"
          >
            <span>⚡</span>
            <span>{t(language, 'createCv')}</span>
            <span>{'->'}</span>
          </button>
        </div>
      </div>

      <div className="landing-credit">
        <a href="https://arcangelo.net" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
          {t(language, 'developedByArcangelo')}
        </a>
      </div>
    </div>
  );
}
