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
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Infographic Generator</h1>
          <p className="text-zinc-500 text-sm">
            Describe what you want and get a polished infographic in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Controls */}
          <div className="space-y-6">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 space-y-5">
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

          {/* Right: Preview */}
          <div>
            <Preview
              imageUrl={imageUrl}
              loading={loading}
              error={error}
              width={width}
              height={height}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-zinc-700 text-xs">
          <p>
            Open source on GitHub. Your API key is stored locally and never sent
            to our servers.
          </p>
        </div>
      </div>
    </div>
  );
}
