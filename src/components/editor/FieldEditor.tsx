import { useCallback, type ReactNode, type ChangeEvent } from 'react';
import DOMPurify from 'dompurify';

interface FieldOption {
  label: string;
  value: string;
}

interface FieldEditorProps {
  label: ReactNode;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'textarea' | 'date' | 'month';
  className?: string;
  options?: FieldOption[];
  disabled?: boolean;
  maxLength?: number;
}

const MAX_FIELD_LENGTH = 2000;

function sanitizeInput(input: string): string {
  const clean = DOMPurify.sanitize(input, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
  return clean.slice(0, MAX_FIELD_LENGTH);
}

export default function FieldEditor({
  label,
  value,
  onChange,
  placeholder = '',
  type = 'text',
  className = '',
  options,
  disabled = false,
  maxLength = MAX_FIELD_LENGTH,
}: FieldEditorProps) {
  const fieldClassName = ['editor-field', className].filter(Boolean).join(' ');

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const sanitized = sanitizeInput(event.target.value);
      onChange(sanitized);
    },
    [onChange]
  );

  const handleMonthChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const dateValue = event.target.value;
      if (dateValue) {
        onChange(dateValue.substring(0, 7));
      }
    },
    [onChange]
  );

  if (type === 'textarea') {
    return (
      <div className={fieldClassName}>
        <label>{label}</label>
        <textarea
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          rows={5}
          disabled={disabled}
          maxLength={maxLength}
        />
      </div>
    );
  }

  if (type === 'month') {
    const dateVal = value?.length === 7 ? `${value}-01` : value;
    return (
      <div className={fieldClassName}>
        <label>{label}</label>
        <input
          type="date"
          value={dateVal}
          onChange={handleMonthChange}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
        />
      </div>
    );
  }

  if (type === 'date') {
    return (
      <div className={fieldClassName}>
        <label>{label}</label>
        <input
          type="date"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
        />
      </div>
    );
  }

  if (options?.length) {
    return (
      <div className={fieldClassName}>
        <label>{label}</label>
        <select value={value} onChange={handleChange} disabled={disabled}>
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div className={fieldClassName}>
      <label>{label}</label>
      <input
        type={type}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={maxLength}
      />
    </div>
  );
}
