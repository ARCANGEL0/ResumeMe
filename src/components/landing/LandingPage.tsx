import LanguageSelector from '../../ui/LanguageSelector';
import { t } from '../../i18n';
import { useEffect, useRef } from 'react';
import { useCVStore } from '../../store/cvStore';

const PHASE_OFFSET = Math.PI * 0.66;

const WAVE_CONFIG = [
  { amplitude: 60, frequency: 0.012, speed: 0.015, colorVar: '--wave-1', baseline: 0.68 },
  { amplitude: 40, frequency: 0.018, speed: 0.022, colorVar: '--wave-2', baseline: 0.72 },
  { amplitude: 25, frequency: 0.025, speed: 0.03, colorVar: '--wave-3', baseline: 0.76 },
];

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
    let frameId = 0;
    let tick = 0;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const resizeCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = window.devicePixelRatio || 1;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const drawWave = (
      amplitude: number,
      frequency: number,
      phase: number,
      baseline: number,
      fillStyle: string,
    ) => {
      context.beginPath();
      context.moveTo(0, height);

      const startY = height * baseline + Math.sin(phase) * amplitude;
      context.lineTo(0, startY);

      for (let x = 0; x <= width; x += 2) {
        const y = height * baseline + Math.sin(x * frequency + phase) * amplitude;
        context.lineTo(x, y);
      }

      context.lineTo(width, height);
      context.closePath();
      context.fillStyle = fillStyle;
      context.fill();
    };

    const renderFrame = () => {
      context.clearRect(0, 0, width, height);

      WAVE_CONFIG.forEach((wave, index) => {
        const fillStyle = styles.getPropertyValue(wave.colorVar).trim();
        const phase = tick * wave.speed + index * PHASE_OFFSET;
        drawWave(wave.amplitude, wave.frequency, phase, wave.baseline, fillStyle);
      });
    };

    const animate = () => {
      tick += 1;
      renderFrame();
      frameId = window.requestAnimationFrame(animate);
    };

    resizeCanvas();
    renderFrame();

    if (!mediaQuery.matches) {
      frameId = window.requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, []);

  return (
    <div className="landing-page">
      <canvas id="wave-canvas" ref={canvasRef} className="landing-wave-canvas" />
      <LanguageSelector className="landing-language no-print" />

      <div className="landing-hero">
        <h1 className="landing-title fade-up" style={{ animationDelay: '0s' }}>
          <span className="landing-title__emoji" aria-hidden="true">📄</span>
          <span>Resume.Me</span>
        </h1>

        <p className="landing-subtitle fade-up" style={{ animationDelay: '0.1s' }}>
          {t(language, 'landingSubtitle')}
        </p>

        <div className="landing-pills fade-up" style={{ animationDelay: '0.2s' }}>
          {[t(language, 'fiveTemplates'), t(language, 'pdfExport'), t(language, 'livePreview')].map((pill) => (
            <span key={pill} className="landing-pill">
              {pill}
            </span>
          ))}
        </div>

        <div className="landing-cta-group fade-up" style={{ animationDelay: '0.35s' }}>
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

      <div className="landing-credit fade-up" style={{ animationDelay: '0.5s' }}>
        <a href="https://arcangelo.net" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
          {t(language, 'developedByArcangelo')}
        </a>
      </div>
    </div>
  );
}
