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

  // Persist API key to localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`infogen-apikey-${provider}`);
    if (saved) onApiKeyChange(saved);
  }, [provider]);

  useEffect(() => {
    if (apiKey) localStorage.setItem(`infogen-apikey-${provider}`, apiKey);
  }, [apiKey, provider]);

  // Set default model when provider changes
  useEffect(() => {
    const models = PROVIDER_MODELS[provider];
    if (models && models.length > 0) {
      onModelChange(models[0]);
    }
  }, [provider]);

  return (
    <div className="space-y-3">
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="block text-sm font-medium text-zinc-400 mb-1">
            Provider
          </label>
          <select
            value={provider}
            onChange={(e) => onProviderChange(e.target.value as LLMProvider)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="openai">OpenAI</option>
            <option value="anthropic">Anthropic</option>
            <option value="openai-compatible">OpenAI-Compatible</option>
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-zinc-400 mb-1">
            Model
          </label>
          {PROVIDER_MODELS[provider]?.length > 0 ? (
            <select
              value={model}
              onChange={(e) => onModelChange(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {PROVIDER_MODELS[provider].map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={model}
              onChange={(e) => onModelChange(e.target.value)}
              placeholder="e.g. llama-3.1-70b"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-400 mb-1">
          API Key
        </label>
        <div className="relative">
          <input
            type={showKey ? "text" : "password"}
            value={apiKey}
            onChange={(e) => onApiKeyChange(e.target.value)}
            placeholder="sk-..."
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 pr-16 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={() => setShowKey(!showKey)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-zinc-500 hover:text-zinc-300"
          >
            {showKey ? "Hide" : "Show"}
          </button>
        </div>
      </div>

      {provider === "openai-compatible" && (
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-1">
            Base URL
          </label>
          <input
            type="text"
            value={baseUrl}
            onChange={(e) => onBaseUrlChange(e.target.value)}
            placeholder="http://localhost:11434/v1"
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}
    </div>
  );
}
