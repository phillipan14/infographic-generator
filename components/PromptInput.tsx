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
      <label className="block text-xs font-medium tracking-wide uppercase" style={{ color: "var(--muted)" }}>
        Describe your infographic
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && e.metaKey && !disabled) onSubmit();
        }}
        placeholder="A comparison of solar vs wind energy with key statistics, adoption rates, and environmental impact..."
        rows={5}
        className="input-base resize-none leading-relaxed"
      />
      <button
        onClick={onSubmit}
        disabled={disabled}
        className="w-full py-3 px-4 rounded-xl text-sm font-semibold tracking-wide transition-base"
        style={{
          background: disabled ? "var(--surface-raised)" : "var(--accent)",
          color: disabled ? "var(--muted)" : "#0b0b0f",
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.5 : 1,
          boxShadow: disabled ? "none" : "0 0 20px var(--accent-glow)",
        }}
        onMouseEnter={(e) => {
          if (!disabled) e.currentTarget.style.boxShadow = "0 0 30px rgba(245, 158, 11, 0.25)";
        }}
        onMouseLeave={(e) => {
          if (!disabled) e.currentTarget.style.boxShadow = "0 0 20px var(--accent-glow)";
        }}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="inline-block w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: "var(--accent-dim)", borderTopColor: "#0b0b0f" }} />
            Generating...
          </span>
        ) : (
          "Generate"
        )}
      </button>
      {!loading && (
        <p className="text-[11px] text-center tracking-wide" style={{ color: "var(--muted)", opacity: 0.5 }}>
          <kbd className="px-1.5 py-0.5 rounded text-[10px] font-mono" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>&#8984; Enter</kbd>
        </p>
      )}
    </div>
  );
}
