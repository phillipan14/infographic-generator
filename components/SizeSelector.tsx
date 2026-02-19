"use client";

interface Props {
  width: number;
  height: number;
  onChange: (width: number, height: number) => void;
}

const SIZES = [
  { label: "Portrait", width: 1080, height: 1920, ratio: "9:16" },
  { label: "Landscape", width: 1920, height: 1080, ratio: "16:9" },
  { label: "Square", width: 1080, height: 1080, ratio: "1:1" },
];

export default function SizeSelector({ width, height, onChange }: Props) {
  return (
    <div>
      <label className="block text-[11px] font-medium tracking-widest uppercase text-muted mb-1.5">
        Canvas Size
      </label>
      <div className="grid grid-cols-3 gap-1.5">
        {SIZES.map((size) => {
          const active = width === size.width && height === size.height;
          return (
            <button
              key={size.label}
              onClick={() => onChange(size.width, size.height)}
              className={`flex flex-col items-center gap-0.5 py-2.5 px-2 rounded-lg text-xs font-medium border transition-all duration-200 ${
                active
                  ? "bg-accent/15 border-accent text-accent"
                  : "bg-background border-border text-muted hover:border-border-hover hover:text-foreground"
              }`}
            >
              <span className="font-semibold">{size.label}</span>
              <span className="text-[10px] opacity-60 font-mono">{size.ratio}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
