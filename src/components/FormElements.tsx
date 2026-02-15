import type { InputHTMLAttributes, SelectHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Input({ label, error, className = '', id, ...props }: InputProps) {
  const inputId = id || label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="space-y-1.5">
      <label htmlFor={inputId} className="block text-sm font-medium text-finos-muted">
        {label}
      </label>
      <input
        id={inputId}
        className={`w-full bg-finos-bg border border-finos-border rounded-xl px-4 py-2.5 text-finos-text placeholder:text-finos-muted/50 focus:outline-none focus:ring-2 focus:ring-finos-accent/50 focus:border-finos-accent transition-all ${
          error ? 'border-finos-danger' : ''
        } ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-finos-danger">{error}</p>}
    </div>
  );
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
  error?: string;
}

export function Select({ label, options, error, className = '', id, ...props }: SelectProps) {
  const selectId = id || label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="space-y-1.5">
      <label htmlFor={selectId} className="block text-sm font-medium text-finos-muted">
        {label}
      </label>
      <select
        id={selectId}
        className={`w-full bg-finos-bg border border-finos-border rounded-xl px-4 py-2.5 text-finos-text focus:outline-none focus:ring-2 focus:ring-finos-accent/50 focus:border-finos-accent transition-all ${
          error ? 'border-finos-danger' : ''
        } ${className}`}
        {...props}
      >
        <option value="">Sélectionner...</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-finos-danger">{error}</p>}
    </div>
  );
}
