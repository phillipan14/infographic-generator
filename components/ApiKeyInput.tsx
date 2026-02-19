"use client";

import { useState, useEffect } from "react";

export type LLMProvider = "openai" | "anthropic" | "openai-compatible";

interface Props {
  provider: LLMProvider;
  onProviderChange: (provider: LLMProvider) => void;
  apiKey: string;
  onApiKeyChange: (key: string) => void;
  model: string;
  onModelChange: (model: string) => void;
  baseUrl: string;
  onBaseUrlChange: (url: string) => void;
}

const PROVIDER_MODELS: Record<string, string[]> = {
  openai: ["gpt-4o", "gpt-4o-mini"],
  anthropic: ["claude-sonnet-4-6", "claude-haiku-4-5-20251001"],
  "openai-compatible": [],
};

const PROVIDER_LABELS: Record<string, { name: string; badge: string }> = {
  openai: { name: "OpenAI", badge: "GPT" },
  anthropic: { name: "Anthropic", badge: "Claude" },
  "openai-compatible": { name: "Custom", badge: "API" },
};

export default function ApiKeyInput({
  provider,
  onProviderChange,
  apiKey,
  onApiKeyChange,
  model,
  onModelChange,
  baseUrl,
  onBaseUrlChange,
}: Props) {
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(`infogen-apikey-${provider}`);
    if (saved) onApiKeyChange(saved);
  }, [provider]);

  useEffect(() => {
    if (apiKey) localStorage.setItem(`infogen-apikey-${provider}`, apiKey);
  }, [apiKey, provider]);

  useEffect(() => {
    const models = PROVIDER_MODELS[provider];
    if (models && models.length > 0) {
      onModelChange(models[0]);
    }
  }, [provider]);

  return (
    <div className="space-y-4">
      {/* Provider selector as pill tabs */}
      <div>
        <label className="block text-xs font-medium tracking-wide uppercase mb-2" style={{ color: "var(--muted)" }}>
          Provider
        </label>
        <div className="flex gap-1.5 p-1 rounded-xl" style={{ background: "var(--surface)" }}>
          {(["openai", "anthropic", "openai-compatible"] as LLMProvider[]).map((p) => (
            <button
              key={p}
              onClick={() => onProviderChange(p)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium transition-base"
              style={{
                background: provider === p ? "var(--accent)" : "transparent",
                color: provider === p ? "#0b0b0f" : "var(--muted)",
              }}
            >
              <span className="font-semibold">{PROVIDER_LABELS[p].name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Model selector */}
      <div>
        <label className="block text-xs font-medium tracking-wide uppercase mb-2" style={{ color: "var(--muted)" }}>
          Model
        </label>
        {PROVIDER_MODELS[provider]?.length > 0 ? (
          <select
            value={model}
            onChange={(e) => onModelChange(e.target.value)}
            className="input-base"
          >
            {PROVIDER_MODELS[provider].map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        ) : (
          <input
            type="text"
            value={model}
            onChange={(e) => onModelChange(e.target.value)}
            placeholder="e.g. llama-3.1-70b"
            className="input-base"
          />
        )}
      </div>

      {/* API Key */}
      <div>
        <label className="block text-xs font-medium tracking-wide uppercase mb-2" style={{ color: "var(--muted)" }}>
          API Key
        </label>
        <div className="relative">
          <input
            type={showKey ? "text" : "password"}
            value={apiKey}
            onChange={(e) => onApiKeyChange(e.target.value)}
            placeholder="sk-..."
            className="input-base"
            style={{ paddingRight: "52px" }}
          />
          <button
            type="button"
            onClick={() => setShowKey(!showKey)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-medium tracking-wide transition-base"
            style={{ color: "var(--muted)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--foreground)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}
          >
            {showKey ? "HIDE" : "SHOW"}
          </button>
        </div>
      </div>

      {/* Base URL for custom providers */}
      {provider === "openai-compatible" && (
        <div>
          <label className="block text-xs font-medium tracking-wide uppercase mb-2" style={{ color: "var(--muted)" }}>
            Base URL
          </label>
          <input
            type="text"
            value={baseUrl}
            onChange={(e) => onBaseUrlChange(e.target.value)}
            placeholder="http://localhost:11434/v1"
            className="input-base"
          />
        </div>
      )}
    </div>
  );
}
