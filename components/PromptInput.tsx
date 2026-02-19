"use client";

interface Props {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  loading: boolean;
  disabled: boolean;
}

const EXAMPLE_PROMPTS = [
  "Solar vs wind energy comparison with stats",
  "SaaS startup metrics dashboard",
  "Coffee brewing methods guide",
  "Top 10 programming languages in 2026",
  "Morning routine of successful founders",
];

export default function PromptInput({
  value, onChange, onSubmit, loading, disabled,
}: Props) {
  return (
    <div className="space-y-3">
      <label className="block text-[11px] font-medium tracking-widest uppercase text-muted">
        Describe your infographic
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && e.metaKey && !disabled) onSubmit();
        }}
        placeholder="A comparison of solar vs wind energy with key statistics, adoption rates, and environmental impact..."
        rows={4}
        className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-colors resize-none leading-relaxed"
      />

      {/* Example prompt chips */}
      {!value && (
        <div className="flex flex-wrap gap-1.5">
          {EXAMPLE_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              onClick={() => onChange(prompt)}
              className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-surface border border-border text-muted hover:text-foreground hover:border-border-hover transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      <button
        onClick={onSubmit}
        disabled={disabled}
        className={`w-full py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
          disabled
            ? "bg-surface text-muted/40 cursor-not-allowed"
            : "bg-accent hover:bg-accent-hover text-background shadow-[0_0_20px_rgba(245,158,11,0.15)] hover:shadow-[0_0_30px_rgba(245,158,11,0.25)]"
        }`}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
            Generating...
          </span>
        ) : "Generate"}
      </button>
      {!loading && (
        <p className="text-center">
          <kbd className="text-[10px] font-mono text-muted/40 px-1.5 py-0.5 rounded bg-surface border border-border">&#8984; Enter</kbd>
        </p>
      )}
    </div>
  );
}
