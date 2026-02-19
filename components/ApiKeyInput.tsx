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

export default function ApiKeyInput({
  provider, onProviderChange, apiKey, onApiKeyChange,
  model, onModelChange, baseUrl, onBaseUrlChange,
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
    if (models && models.length > 0) onModelChange(models[0]);
  }, [provider]);

  const inputClass = "w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-colors";
  const labelClass = "block text-[11px] font-medium tracking-widest uppercase text-muted mb-1.5";

  return (
    <div className="space-y-3">
      {/* Provider pills */}
      <div>
        <label className={labelClass}>Provider</label>
        <div className="flex gap-1 p-1 bg-background rounded-lg">
          {(["openai", "anthropic", "openai-compatible"] as LLMProvider[]).map((p) => (
            <button
              key={p}
              onClick={() => onProviderChange(p)}
              className={`flex-1 py-1.5 px-2 rounded-md text-xs font-semibold transition-all duration-200 ${
                provider === p
                  ? "bg-accent text-background shadow-sm"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {p === "openai" ? "OpenAI" : p === "anthropic" ? "Anthropic" : "Custom"}
            </button>
          ))}
        </div>
      </div>

      {/* Model */}
      <div>
        <label className={labelClass}>Model</label>
        {PROVIDER_MODELS[provider]?.length > 0 ? (
          <select
            value={model}
            onChange={(e) => onModelChange(e.target.value)}
            className={inputClass}
          >
            {PROVIDER_MODELS[provider].map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        ) : (
          <input
            type="text" value={model}
            onChange={(e) => onModelChange(e.target.value)}
            placeholder="e.g. llama-3.1-70b"
            className={inputClass}
          />
        )}
      </div>

      {/* API Key */}
      <div>
        <label className={labelClass}>API Key</label>
        <div className="relative">
          <input
            type={showKey ? "text" : "password"}
            value={apiKey}
            onChange={(e) => onApiKeyChange(e.target.value)}
            placeholder="sk-..."
            className={`${inputClass} pr-14`}
          />
          <button
            type="button"
            onClick={() => setShowKey(!showKey)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold tracking-widest text-muted hover:text-foreground transition-colors"
          >
            {showKey ? "HIDE" : "SHOW"}
          </button>
        </div>
      </div>

      {/* Base URL */}
      {provider === "openai-compatible" && (
        <div>
          <label className={labelClass}>Base URL</label>
          <input
            type="text" value={baseUrl}
            onChange={(e) => onBaseUrlChange(e.target.value)}
            placeholder="http://localhost:11434/v1"
            className={inputClass}
          />
        </div>
      )}
    </div>
  );
}
