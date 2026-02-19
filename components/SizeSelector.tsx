"use client";

interface Props {
  width: number;
  height: number;
  onChange: (width: number, height: number) => void;
}

const SIZES = [
  { label: "Portrait", width: 1080, height: 1920, icon: "▯" },
  { label: "Landscape", width: 1920, height: 1080, icon: "▭" },
  { label: "Square", width: 1080, height: 1080, icon: "□" },
];

export default function SizeSelector({ width, height, onChange }: Props) {
  return (
    <div>
      <label className="block text-sm font-medium text-zinc-400 mb-2">
        Size
      </label>
      <div className="flex gap-2">
        {SIZES.map((size) => (
          <button
            key={size.label}
            onClick={() => onChange(size.width, size.height)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg border text-sm transition-colors ${
              width === size.width && height === size.height
                ? "bg-blue-600 border-blue-500 text-white"
                : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500"
            }`}
          >
            <span className="text-lg">{size.icon}</span>
            {size.label}
          </button>
        ))}
      </div>
    </div>
  );
}
