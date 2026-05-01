import type { ReactNode } from 'react';

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
}: FieldEditorProps) {
  const fieldClassName = ['editor-field', className].filter(Boolean).join(' ');

  if (type === 'textarea') {
    return (
      <div className={fieldClassName}>
        <label>{label}</label>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={5}
          disabled={disabled}
        />
      </div>
    );
  }

  if (type === 'month') {
    // use date picker internally but show MM/YYYY
    // value stored as YYYY-MM-DD, displayed as MM/YYYY
    const dateVal = value?.length === 7 ? `${value}-01` : value; // YYYY-MM -> YYYY-MM-01
    return (
      <div className={fieldClassName}>
        <label>{label}</label>
        <input
          type="date"
          value={dateVal}
          onChange={(e) => {
            const d = e.target.value; // YYYY-MM-DD
            if(d) onChange(d.substring(0,7)); // store as YYYY-MM only
          }}
          placeholder={placeholder}
          disabled={disabled}
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
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
        />
      </div>
    );
  }

  if (options?.length) {
    return (
      <div className={fieldClassName}>
        <label>{label}</label>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
        >
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
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
      />
    </div>
  );
}