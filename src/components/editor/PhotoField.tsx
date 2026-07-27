import { useCallback, useRef, useState, type ChangeEvent } from 'react';

interface PhotoFieldProps {
  label: string;
  onChange: (value: string) => void;
  removeLabel: string;
  uploadLabel: string;
  value: string;
}

const MAX_EDGE = 512;
const MAX_SOURCE_BYTES = 8 * 1024 * 1024;
const ACCEPTED = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('photo decode failed'));
    image.src = src;
  });
}

async function toStoredPhoto(file: File): Promise<string> {
  const dataUrl = await readAsDataUrl(file);
  const image = await loadImage(dataUrl);
  const scale = Math.min(1, MAX_EDGE / Math.max(image.width, image.height));
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  if (!context) return dataUrl;

  context.drawImage(image, 0, 0, width, height);
  return canvas.toDataURL('image/jpeg', 0.85);
}

export default function PhotoField({ label, onChange, removeLabel, uploadLabel, value }: PhotoFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const handleFile = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      event.target.value = '';
      if (!file) return;
      if (!ACCEPTED.includes(file.type) || file.size > MAX_SOURCE_BYTES) return;

      setBusy(true);
      try {
        onChange(await toStoredPhoto(file));
      } catch {
        setBusy(false);
        return;
      }
      setBusy(false);
    },
    [onChange],
  );

  return (
    <div className="editor-field photo-field">
      <label>{label}</label>
      <div className="photo-field__row">
        <span className="photo-field__preview">
          {value ? (
            <img src={value} alt="" />
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <circle cx="12" cy="8.5" r="3.6" />
              <path d="M4.5 20a7.5 7.5 0 0 1 15 0" strokeLinecap="round" />
            </svg>
          )}
        </span>

        <div className="photo-field__actions">
          <button type="button" className="photo-field__button" onClick={() => inputRef.current?.click()} disabled={busy}>
            {uploadLabel}
          </button>
          {value && (
            <button type="button" className="photo-field__button photo-field__button--ghost" onClick={() => onChange('')}>
              {removeLabel}
            </button>
          )}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        onChange={handleFile}
        className="photo-field__input"
        tabIndex={-1}
      />
    </div>
  );
}
