// src/components/ui/FilterCheckbox.tsx
import React from 'react';

export default function FilterCheckbox({
  label,
  value,
  checked,
  onChange,
}: {
  label: string;
  value: string;
  checked: boolean;
  onChange: (v: string, c: boolean) => void;
}) {
  return (
    <label
      style={{
        display: 'inline-flex',
        gap: 8,
        alignItems: 'center',
        marginRight: 12,
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(value, e.target.checked)}
      />
      <span>{label}</span>
    </label>
  );
}
