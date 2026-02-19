"use client";

interface Props {
  imageUrl: string | null;
  loading: boolean;
  error: string | null;
  width: number;
  height: number;
}

export default function Preview({
  imageUrl,
  loading,
  error,
  width,
  height,
}: Props) {
  const aspectRatio = width / height;

  if (error) {
    return (
      <div
        className="flex items-center justify-center h-full min-h-[500px] rounded-2xl"
        style={{
          background: "var(--surface)",
          border: "1px solid rgba(239, 68, 68, 0.2)",
        }}
      >
        <div className="text-center px-8">
          <div
            className="w-10 h-10 mx-auto mb-3 rounded-full flex items-center justify-center"
            style={{ background: "rgba(239, 68, 68, 0.1)" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </div>
          <p className="text-sm font-medium mb-1" style={{ color: "var(--danger)" }}>Generation failed</p>
          <p className="text-xs max-w-xs mx-auto leading-relaxed" style={{ color: "var(--muted)" }}>{error}</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div
        className="flex items-center justify-center h-full min-h-[500px] rounded-2xl"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
        }}
      >
        <div className="text-center">
          <div className="relative w-12 h-12 mx-auto mb-4">
            <div
              className="absolute inset-0 rounded-full animate-spin"
              style={{
                border: "2px solid var(--border)",
                borderTopColor: "var(--accent)",
              }}
            />
            <div
              className="absolute inset-2 rounded-full pulse-glow"
              style={{ background: "var(--accent-glow)" }}
            />
          </div>
          <p className="text-sm font-medium mb-1" style={{ color: "var(--foreground)" }}>
            Crafting your infographic
          </p>
          <p className="text-xs" style={{ color: "var(--muted)" }}>
            AI is designing the layout...
          </p>
        </div>
      </div>
    );
  }

  if (!imageUrl) {
    return (
      <div
        className="flex items-center justify-center h-full min-h-[500px] rounded-2xl dot-grid"
        style={{
          background: "var(--surface)",
          border: "1px dashed var(--border)",
        }}
      >
        <div className="text-center px-8">
          <div
            className="w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center"
            style={{ background: "var(--surface-raised)", border: "1px solid var(--border)" }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <line x1="3" y1="9" x2="21" y2="9" />
              <line x1="9" y1="3" x2="9" y2="21" />
            </svg>
          </div>
          <p className="text-sm font-medium mb-1" style={{ color: "var(--muted)" }}>
            Your canvas is ready
          </p>
          <p className="text-xs" style={{ color: "var(--muted)", opacity: 0.5 }}>
            Describe something and hit Generate
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div
        className="rounded-2xl p-3 flex justify-center dot-grid"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
        }}
      >
        <img
          src={imageUrl}
          alt="Generated infographic"
          className="max-w-full max-h-[72vh] rounded-xl"
          style={{
            aspectRatio,
            boxShadow: "0 25px 60px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(245, 158, 11, 0.05)",
          }}
        />
      </div>
      <a
        href={imageUrl}
        download="infographic.png"
        className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl text-sm font-semibold tracking-wide transition-base"
        style={{
          background: "var(--surface-raised)",
          border: "1px solid var(--border)",
          color: "var(--foreground)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "var(--accent)";
          e.currentTarget.style.color = "var(--accent)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "var(--border)";
          e.currentTarget.style.color = "var(--foreground)";
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        Download PNG
      </a>
    </div>
  );
}
