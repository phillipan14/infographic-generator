"use client";

interface Props {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  loading: boolean;
  disabled: boolean;
}

export default function PromptInput({
  value,
  onChange,
  onSubmit,
  loading,
  disabled,
}: Props) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-zinc-400">
        Describe your infographic
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && e.metaKey && !disabled) onSubmit();
        }}
        placeholder="e.g. A comparison of solar vs wind energy with key statistics, pros and cons, and global adoption rates..."
        rows={4}
        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white text-sm placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
      />
      <button
        onClick={onSubmit}
        disabled={disabled}
        className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-700 disabled:text-zinc-500 text-white font-medium py-3 px-4 rounded-lg transition-colors text-sm"
      >
        {loading ? "Generating..." : "Generate Infographic"}
      </button>
      {!loading && (
        <p className="text-xs text-zinc-600 text-center">Cmd + Enter to generate</p>
      )}
    </div>
  );
}
