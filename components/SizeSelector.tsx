"use client";

interface Props {
  width: number;
  height: number;
  onChange: (width: number, height: number) => void;
}

const SIZES = [
  {
    label: "Portrait",
    width: 1080,
    height: 1920,
    ratio: "9:16",
    icon: (
      <svg width="14" height="22" viewBox="0 0 14 22" fill="none">
        <rect x="0.5" y="0.5" width="13" height="21" rx="2" stroke="currentColor" strokeWidth="1" />
      </svg>
    ),
  },
  {
    label: "Landscape",
    width: 1920,
    height: 1080,
    ratio: "16:9",
    icon: (
      <svg width="22" height="14" viewBox="0 0 22 14" fill="none">
        <rect x="0.5" y="0.5" width="21" height="13" rx="2" stroke="currentColor" strokeWidth="1" />
      </svg>
    ),
  },
  {
    label: "Square",
    width: 1080,
    height: 1080,
    ratio: "1:1",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="0.5" y="0.5" width="17" height="17" rx="2" stroke="currentColor" strokeWidth="1" />
      </svg>
    ),
  },
];

export default function SizeSelector({ width, height, onChange }: Props) {
  return (
    <div>
      <label className="block text-xs font-medium tracking-wide uppercase mb-2" style={{ color: "var(--muted)" }}>
        Canvas Size
      </label>
      <div className="grid grid-cols-3 gap-2">
        {SIZES.map((size) => {
          const isActive = width === size.width && height === size.height;
          return (
            <button
              key={size.label}
              onClick={() => onChange(size.width, size.height)}
              className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl transition-base"
              style={{
                background: isActive ? "var(--accent-glow)" : "var(--surface)",
                border: `1px solid ${isActive ? "var(--accent)" : "var(--border)"}`,
                color: isActive ? "var(--accent)" : "var(--muted)",
              }}
            >
              <div className="opacity-80">{size.icon}</div>
              <span className="text-xs font-medium">{size.label}</span>
              <span className="text-[10px] opacity-50 font-mono">{size.ratio}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
