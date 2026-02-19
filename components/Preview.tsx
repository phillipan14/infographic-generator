"use client";

interface Props {
  imageUrl: string | null;
  loading: boolean;
  error: string | null;
  width: number;
  height: number;
}

export default function Preview({ imageUrl, loading, error, width, height }: Props) {
  const aspectRatio = width / height;

  if (error) {
    return (
      <div className="flex items-center justify-center h-full min-h-[500px] rounded-xl bg-surface border border-danger/20">
        <div className="text-center px-8">
          <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-danger/10 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-danger">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </div>
          <p className="text-sm font-medium text-danger mb-1">Generation failed</p>
          <p className="text-xs text-muted max-w-xs">{error}</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[500px] rounded-xl bg-surface border border-border">
        <div className="text-center">
          <div className="w-10 h-10 mx-auto mb-4 border-2 border-border border-t-accent rounded-full animate-spin" />
          <p className="text-sm font-medium text-foreground mb-1">Crafting your infographic</p>
          <p className="text-xs text-muted">This may take 15-30 seconds</p>
        </div>
      </div>
    );
  }

  if (!imageUrl) {
    return (
      <div className="flex items-center justify-center h-full min-h-[500px] rounded-xl bg-surface border border-dashed border-border">
        <div className="text-center px-8">
          <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-background border border-border flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <line x1="3" y1="9" x2="21" y2="9" />
              <line x1="9" y1="3" x2="9" y2="21" />
            </svg>
          </div>
          <p className="text-sm font-medium text-muted/80 mb-1">Your canvas is ready</p>
          <p className="text-xs text-muted/40">Describe something and hit Generate</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="rounded-xl bg-surface border border-border p-3 flex justify-center">
        <img
          src={imageUrl}
          alt="Generated infographic"
          className="max-w-full max-h-[72vh] rounded-lg shadow-2xl"
          style={{ aspectRatio }}
        />
      </div>
      <a
        href={imageUrl}
        download="infographic.png"
        className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg text-sm font-medium bg-surface border border-border text-foreground hover:border-accent hover:text-accent transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        Download PNG
      </a>
    </div>
  );
}
