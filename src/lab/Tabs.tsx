import React from 'react';

export type TabKey = 'emblem' | 'companion' | 'trail' | 'background';

const TAB_DEFS: { key: TabKey; label: string }[] = [
  { key: 'emblem', label: 'Emblem' },
  { key: 'companion', label: 'Companion' },
  { key: 'trail', label: 'Trail' },
  { key: 'background', label: 'Background' }
];

interface TabsProps {
  active: TabKey;
  onChange: (key: TabKey) => void;
}

export default function Tabs({ active, onChange }: TabsProps) {
  return (
    <div className="lab-tabs" role="tablist">
      {TAB_DEFS.map(t => (
        <button
          key={t.key}
          role="tab"
          aria-selected={active === t.key}
          className={`lab-tab ${active === t.key ? 'is-active' : ''}`}
          onClick={() => onChange(t.key)}
          type="button"
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

export { TAB_DEFS };
