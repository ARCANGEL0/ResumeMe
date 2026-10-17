import { useCallback, type ReactNode, type ChangeEvent } from 'react';
import DateFieldInput from './DateFieldInput';

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
      onChange(event.target.value.slice(0, maxLength));
    },
    [maxLength, onChange]
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

  if (type === 'month' || type === 'date') {
    return (
      <div className={fieldClassName}>
        <label>{label}</label>
        <DateFieldInput kind={type} value={value} onChange={onChange} disabled={disabled} />
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
