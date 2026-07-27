import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ChangeEvent } from 'react';

export type DateFieldKind = 'month' | 'date';

interface DateFieldInputProps {
  disabled?: boolean;
  kind: DateFieldKind;
  onChange: (value: string) => void;
  value: string;
}

interface DateSpec {
  mask: string;
  nativeType: 'month' | 'date';
  segments: number[];
}

const SPECS: Record<DateFieldKind, DateSpec> = {
  month: { mask: 'MM / YYYY', nativeType: 'month', segments: [2, 4] },
  date: { mask: 'MM / DD / YYYY', nativeType: 'date', segments: [2, 2, 4] },
};

const SEPARATOR = ' / ';

function totalDigits(spec: DateSpec): number {
  return spec.segments.reduce((sum, length) => sum + length, 0);
}

function toDigits(value: string, kind: DateFieldKind): string {
  if (kind === 'month') {
    const match = value.match(/^(\d{4})-(\d{2})$/);
    return match ? `${match[2]}${match[1]}` : '';
  }

  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return match ? `${match[2]}${match[3]}${match[1]}` : '';
}

function daysInMonth(month: number, year: number): number {
  return new Date(year, month, 0).getDate();
}

function toStoredValue(digits: string, kind: DateFieldKind): string {
  const spec = SPECS[kind];
  if (digits.length < totalDigits(spec)) return '';

  const month = clamp(Number.parseInt(digits.slice(0, 2), 10), 1, 12);

  if (kind === 'month') {
    const year = digits.slice(2, 6);
    return `${year}-${pad(month)}`;
  }

  const year = digits.slice(4, 8);
  const day = clamp(Number.parseInt(digits.slice(2, 4), 10), 1, daysInMonth(month, Number.parseInt(year, 10)));
  return `${year}-${pad(month)}-${pad(day)}`;
}

function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.max(min, Math.min(max, value));
}

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

function format(digits: string, kind: DateFieldKind): string {
  const spec = SPECS[kind];
  const parts: string[] = [];
  let cursor = 0;

  for (const length of spec.segments) {
    if (cursor >= digits.length) break;
    parts.push(digits.slice(cursor, cursor + length));
    cursor += length;
  }

  return parts.join(SEPARATOR);
}

export default function DateFieldInput({ disabled = false, kind, onChange, value }: DateFieldInputProps) {
  const spec = SPECS[kind];
  const max = totalDigits(spec);
  const inputRef = useRef<HTMLInputElement>(null);
  const nativeRef = useRef<HTMLInputElement>(null);
  const emittedRef = useRef(value);
  const caretRef = useRef(false);
  const [digits, setDigits] = useState(() => toDigits(value, kind));

  useEffect(() => {
    if (value === emittedRef.current) return;
    emittedRef.current = value;
    setDigits(toDigits(value, kind));
  }, [value, kind]);

  useLayoutEffect(() => {
    if (!caretRef.current) return;
    caretRef.current = false;
    const input = inputRef.current;
    if (!input) return;
    const end = input.value.length;
    input.setSelectionRange(end, end);
  });

  const commit = useCallback(
    (nextDigits: string) => {
      setDigits(nextDigits);
      const stored = toStoredValue(nextDigits, kind);
      if (stored !== emittedRef.current) {
        emittedRef.current = stored;
        onChange(stored);
      }
    },
    [kind, onChange],
  );

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      caretRef.current = true;
      commit(event.target.value.replace(/\D/g, '').slice(0, max));
    },
    [commit, max],
  );

  const handleNativeChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const nextDigits = toDigits(event.target.value, kind);
      if (!nextDigits) return;
      commit(nextDigits);
    },
    [commit, kind],
  );

  const handleBlur = useCallback(() => {
    if (digits.length < max) return;
    const stored = toStoredValue(digits, kind);
    const normalized = toDigits(stored, kind);
    if (normalized && normalized !== digits) {
      setDigits(normalized);
    }
  }, [digits, kind, max]);

  const openPicker = useCallback(() => {
    const native = nativeRef.current;
    if (!native || disabled) return;
    try {
      native.showPicker();
    } catch {
      native.focus();
      native.click();
    }
  }, [disabled]);

  return (
    <div className="date-field">
      <input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        value={format(digits, kind)}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={spec.mask}
        disabled={disabled}
      />

      <button
        type="button"
        className="date-field__picker"
        onClick={openPicker}
        disabled={disabled}
        tabIndex={-1}
        aria-hidden="true"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M3 10h18M8 3v4M16 3v4" />
        </svg>
      </button>

      <input
        ref={nativeRef}
        className="date-field__native"
        type={spec.nativeType}
        value={toStoredValue(digits, kind)}
        onChange={handleNativeChange}
        disabled={disabled}
        tabIndex={-1}
        aria-hidden="true"
      />
    </div>
  );
}
