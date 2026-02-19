"use client";

import { useState } from "react";
import ApiKeyInput from "@/components/ApiKeyInput";
import SizeSelector from "@/components/SizeSelector";
import PromptInput from "@/components/PromptInput";
import Preview from "@/components/Preview";

type LLMProvider = "openai" | "anthropic" | "openai-compatible";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [provider, setProvider] = useState<LLMProvider>("openai");
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState("gpt-4o");
  const [baseUrl, setBaseUrl] = useState("");
  const [width, setWidth] = useState(1080);
  const [height, setHeight] = useState(1920);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canGenerate = prompt.trim() && apiKey.trim() && model.trim() && !loading;

  async function handleGenerate() {
    setLoading(true);
    setError(null);
    setImageUrl(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          provider,
          apiKey,
          model,
          baseUrl: baseUrl || undefined,
          width,
          height,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || `Request failed (${response.status})`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setImageUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      {/* Header */}
      <header
        className="sticky top-0 z-50"
        style={{
          background: "rgba(11, 11, 15, 0.8)",
          backdropFilter: "blur(16px) saturate(180%)",
          borderBottom: "1px solid var(--border-subtle)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "var(--accent)", color: "#0b0b0f" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <line x1="3" y1="9" x2="21" y2="9" />
                <line x1="9" y1="3" x2="9" y2="21" />
              </svg>
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight" style={{ fontFamily: "'Syne', sans-serif", color: "var(--foreground)" }}>
                Infographic Generator
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[11px] font-medium tracking-wider uppercase" style={{ color: "var(--muted)" }}>
              BYOK
            </span>
            <a
              href="https://github.com/phillipan14/infographic-generator"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-medium transition-base"
              style={{ color: "var(--muted)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--foreground)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </a>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left panel: Controls */}
          <div className="lg:col-span-4 space-y-5">
            <div className="glass-panel p-5 space-y-5">
              <ApiKeyInput
                provider={provider}
                onProviderChange={setProvider}
                apiKey={apiKey}
                onApiKeyChange={setApiKey}
                model={model}
                onModelChange={setModel}
                baseUrl={baseUrl}
                onBaseUrlChange={setBaseUrl}
              />
              <div style={{ height: "1px", background: "var(--border)" }} />
              <SizeSelector
                width={width}
                height={height}
                onChange={(w, h) => {
                  setWidth(w);
                  setHeight(h);
                }}
              />
            </div>
            <PromptInput
              value={prompt}
              onChange={setPrompt}
              onSubmit={handleGenerate}
              loading={loading}
              disabled={!canGenerate}
            />
          </div>

          {/* Right panel: Preview */}
          <div className="lg:col-span-8">
            <Preview
              imageUrl={imageUrl}
              loading={loading}
              error={error}
              width={width}
              height={height}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-6">
        <div
          className="flex items-center justify-between text-[11px] tracking-wide"
          style={{ color: "var(--muted)", opacity: 0.4 }}
        >
          <p>Open source. Your API key never leaves your browser.</p>
          <p>MIT License</p>
        </div>
      </footer>
    </div>
  );
}
