# Infographic Generator Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a prompt-based infographic generator that turns natural language into downloadable PNG posters.

**Architecture:** Next.js 14 App Router with a single API route. User prompt → LLM generates HTML/CSS → Puppeteer renders to PNG → user downloads. Multi-provider LLM support (OpenAI, Anthropic, OpenAI-compatible).

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, Puppeteer, OpenAI SDK, Anthropic SDK

---

### Task 1: Scaffold Next.js Project

**Files:**
- Create: `package.json`, `tsconfig.json`, `tailwind.config.ts`, `next.config.mjs`, `app/layout.tsx`, `app/page.tsx`, `.gitignore`

**Step 1: Initialize Next.js project**

Run:
```bash
cd /Users/phillipan/infographic-generator
npx create-next-app@latest . --typescript --tailwind --eslint --app --src=no --import-alias="@/*" --use-npm
```

Select defaults when prompted. This scaffolds into the existing directory.

**Step 2: Install dependencies**

Run:
```bash
cd /Users/phillipan/infographic-generator
npm install openai @anthropic-ai/sdk puppeteer
npm install -D @types/node
```

**Step 3: Verify dev server starts**

Run:
```bash
cd /Users/phillipan/infographic-generator && npm run dev
```
Expected: Server starts on localhost:3000 without errors. Kill with Ctrl+C.

**Step 4: Commit**

```bash
cd /Users/phillipan/infographic-generator
git add -A
git commit -m "feat: scaffold Next.js project with dependencies"
```

---

### Task 2: System Prompt for HTML Generation

**Files:**
- Create: `lib/prompts.ts`
- Test: `lib/__tests__/prompts.test.ts`

**Step 1: Write the failing test**

Create `lib/__tests__/prompts.test.ts`:

```typescript
import { buildSystemPrompt, buildUserPrompt } from "../prompts";

describe("buildSystemPrompt", () => {
  it("returns a string containing HTML generation instructions", () => {
    const prompt = buildSystemPrompt(1080, 1920);
    expect(prompt).toContain("HTML");
    expect(prompt).toContain("1080");
    expect(prompt).toContain("1920");
    expect(prompt).toContain("inline");
  });

  it("adapts to landscape dimensions", () => {
    const prompt = buildSystemPrompt(1920, 1080);
    expect(prompt).toContain("1920");
    expect(prompt).toContain("1080");
  });
});

describe("buildUserPrompt", () => {
  it("wraps user input with generation instruction", () => {
    const result = buildUserPrompt("compare solar vs wind energy");
    expect(result).toContain("compare solar vs wind energy");
  });
});
```

**Step 2: Install test runner and run test to verify it fails**

Run:
```bash
cd /Users/phillipan/infographic-generator
npm install -D jest @types/jest ts-jest
npx ts-jest config:init
npx jest lib/__tests__/prompts.test.ts --verbose
```
Expected: FAIL — module not found.

**Step 3: Write implementation**

Create `lib/prompts.ts`:

```typescript
export function buildSystemPrompt(width: number, height: number): string {
  return `You are an expert infographic designer. Generate a SINGLE self-contained HTML page that creates a beautiful, professional infographic poster.

REQUIREMENTS:
- Output ONLY the HTML code, nothing else. No markdown, no explanation.
- The design must be exactly ${width}px wide and ${height}px tall.
- Use ONLY inline CSS styles. No external stylesheets or scripts.
- Use modern CSS: flexbox, grid, gradients, shadows, border-radius.
- All text must be embedded directly in the HTML.
- Use a cohesive color palette (2-4 colors max).
- Include visual hierarchy: clear title, sections, data points.
- Use Unicode symbols and CSS shapes for icons (no external images).
- Ensure high contrast and readability.
- Fill the entire ${width}x${height} canvas — no white space around edges.
- Use Google Fonts via @import in a <style> tag if needed.

STRUCTURE:
\`\`\`html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    /* @import for fonts if needed */
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { width: ${width}px; height: ${height}px; overflow: hidden; }
  </style>
</head>
<body>
  <!-- Your infographic content here -->
</body>
</html>
\`\`\`

Design principles:
- Bold typography with clear hierarchy (title 48-72px, headings 28-36px, body 16-20px)
- Generous padding and spacing
- Visual separators between sections
- Color blocks and accent bars for visual interest
- Data should be presented with large numbers and supporting context`;
}

export function buildUserPrompt(userInput: string): string {
  return `Create an infographic poster about the following:\n\n${userInput}\n\nRemember: Output ONLY the complete HTML code. No explanation, no markdown fences.`;
}
```

**Step 4: Run tests to verify they pass**

Run:
```bash
cd /Users/phillipan/infographic-generator && npx jest lib/__tests__/prompts.test.ts --verbose
```
Expected: All tests PASS.

**Step 5: Commit**

```bash
cd /Users/phillipan/infographic-generator
git add lib/prompts.ts lib/__tests__/prompts.test.ts jest.config.ts
git commit -m "feat: add system prompt for HTML infographic generation"
```

---

### Task 3: LLM Client (Multi-Provider)

**Files:**
- Create: `lib/llm.ts`
- Test: `lib/__tests__/llm.test.ts`

**Step 1: Write the failing test**

Create `lib/__tests__/llm.test.ts`:

```typescript
import { generateHTML, LLMProvider } from "../llm";

// Mock both SDKs
jest.mock("openai", () => {
  return jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn().mockResolvedValue({
          choices: [{ message: { content: "<html><body>test</body></html>" } }],
        }),
      },
    },
  }));
});

jest.mock("@anthropic-ai/sdk", () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      messages: {
        create: jest.fn().mockResolvedValue({
          content: [{ type: "text", text: "<html><body>test</body></html>" }],
        }),
      },
    })),
  };
});

describe("generateHTML", () => {
  it("calls OpenAI and returns HTML", async () => {
    const result = await generateHTML({
      provider: "openai",
      apiKey: "test-key",
      model: "gpt-4o",
      systemPrompt: "You are a designer",
      userPrompt: "Make a poster",
    });
    expect(result).toContain("<html>");
  });

  it("calls Anthropic and returns HTML", async () => {
    const result = await generateHTML({
      provider: "anthropic",
      apiKey: "test-key",
      model: "claude-sonnet-4-6",
      systemPrompt: "You are a designer",
      userPrompt: "Make a poster",
    });
    expect(result).toContain("<html>");
  });

  it("supports custom OpenAI-compatible endpoints", async () => {
    const result = await generateHTML({
      provider: "openai-compatible",
      apiKey: "test-key",
      model: "llama-3",
      baseUrl: "http://localhost:11434/v1",
      systemPrompt: "You are a designer",
      userPrompt: "Make a poster",
    });
    expect(result).toContain("<html>");
  });
});
```

**Step 2: Run test to verify it fails**

Run:
```bash
cd /Users/phillipan/infographic-generator && npx jest lib/__tests__/llm.test.ts --verbose
```
Expected: FAIL — module not found.

**Step 3: Write implementation**

Create `lib/llm.ts`:

```typescript
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";

export type LLMProvider = "openai" | "anthropic" | "openai-compatible";

interface GenerateHTMLParams {
  provider: LLMProvider;
  apiKey: string;
  model: string;
  systemPrompt: string;
  userPrompt: string;
  baseUrl?: string;
}

export async function generateHTML(params: GenerateHTMLParams): Promise<string> {
  const { provider, apiKey, model, systemPrompt, userPrompt, baseUrl } = params;

  if (provider === "anthropic") {
    return generateWithAnthropic(apiKey, model, systemPrompt, userPrompt);
  }

  // Both "openai" and "openai-compatible" use the OpenAI SDK
  return generateWithOpenAI(apiKey, model, systemPrompt, userPrompt, baseUrl);
}

async function generateWithOpenAI(
  apiKey: string,
  model: string,
  systemPrompt: string,
  userPrompt: string,
  baseUrl?: string
): Promise<string> {
  const client = new OpenAI({
    apiKey,
    ...(baseUrl && { baseURL: baseUrl }),
  });

  const response = await client.chat.completions.create({
    model,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    max_tokens: 8192,
    temperature: 0.7,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error("No content in LLM response");
  return extractHTML(content);
}

async function generateWithAnthropic(
  apiKey: string,
  model: string,
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  const client = new Anthropic({ apiKey });

  const response = await client.messages.create({
    model,
    max_tokens: 8192,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });

  const textBlock = response.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text content in Anthropic response");
  }
  return extractHTML(textBlock.text);
}

function extractHTML(raw: string): string {
  // If the LLM wrapped output in markdown code fences, strip them
  const fenceMatch = raw.match(/```(?:html)?\s*\n?([\s\S]*?)\n?```/);
  if (fenceMatch) return fenceMatch[1].trim();
  return raw.trim();
}
```

**Step 4: Run tests to verify they pass**

Run:
```bash
cd /Users/phillipan/infographic-generator && npx jest lib/__tests__/llm.test.ts --verbose
```
Expected: All tests PASS.

**Step 5: Commit**

```bash
cd /Users/phillipan/infographic-generator
git add lib/llm.ts lib/__tests__/llm.test.ts
git commit -m "feat: add multi-provider LLM client (OpenAI, Anthropic, compatible)"
```

---

### Task 4: Puppeteer Renderer

**Files:**
- Create: `lib/renderer.ts`
- Test: `lib/__tests__/renderer.test.ts`

**Step 1: Write the failing test**

Create `lib/__tests__/renderer.test.ts`:

```typescript
import { renderHTMLToPNG } from "../renderer";

describe("renderHTMLToPNG", () => {
  it("returns a PNG buffer from valid HTML", async () => {
    const html = `<!DOCTYPE html>
<html><head><style>body{width:400px;height:400px;background:blue;}</style></head>
<body><h1 style="color:white;padding:20px;">Test</h1></body></html>`;

    const buffer = await renderHTMLToPNG(html, 400, 400);
    expect(buffer).toBeInstanceOf(Buffer);
    expect(buffer.length).toBeGreaterThan(0);
    // PNG magic bytes
    expect(buffer[0]).toBe(0x89);
    expect(buffer[1]).toBe(0x50); // P
    expect(buffer[2]).toBe(0x4e); // N
    expect(buffer[3]).toBe(0x47); // G
  }, 30000);
});
```

**Step 2: Run test to verify it fails**

Run:
```bash
cd /Users/phillipan/infographic-generator && npx jest lib/__tests__/renderer.test.ts --verbose --testTimeout=30000
```
Expected: FAIL — module not found.

**Step 3: Write implementation**

Create `lib/renderer.ts`:

```typescript
import puppeteer from "puppeteer";

export async function renderHTMLToPNG(
  html: string,
  width: number,
  height: number
): Promise<Buffer> {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
    ],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width, height, deviceScaleFactor: 2 });
    await page.setContent(html, { waitUntil: "networkidle0" });

    // Wait for fonts to load
    await page.evaluate(() => document.fonts.ready);

    const screenshot = await page.screenshot({
      type: "png",
      clip: { x: 0, y: 0, width, height },
    });

    return Buffer.from(screenshot);
  } finally {
    await browser.close();
  }
}
```

**Step 4: Run tests to verify they pass**

Run:
```bash
cd /Users/phillipan/infographic-generator && npx jest lib/__tests__/renderer.test.ts --verbose --testTimeout=30000
```
Expected: PASS (may take a few seconds for Puppeteer to launch).

**Step 5: Commit**

```bash
cd /Users/phillipan/infographic-generator
git add lib/renderer.ts lib/__tests__/renderer.test.ts
git commit -m "feat: add Puppeteer HTML-to-PNG renderer"
```

---

### Task 5: API Route

**Files:**
- Create: `app/api/generate/route.ts`

**Step 1: Write the API route**

Create `app/api/generate/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { buildSystemPrompt, buildUserPrompt } from "@/lib/prompts";
import { generateHTML, LLMProvider } from "@/lib/llm";
import { renderHTMLToPNG } from "@/lib/renderer";

interface GenerateRequest {
  prompt: string;
  provider: LLMProvider;
  apiKey: string;
  model: string;
  baseUrl?: string;
  width: number;
  height: number;
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json();
    const { prompt, provider, apiKey, model, baseUrl, width, height } = body;

    if (!prompt || !provider || !apiKey || !model || !width || !height) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Step 1: Generate HTML from LLM
    const systemPrompt = buildSystemPrompt(width, height);
    const userPrompt = buildUserPrompt(prompt);

    const html = await generateHTML({
      provider,
      apiKey,
      model,
      systemPrompt,
      userPrompt,
      baseUrl,
    });

    // Step 2: Render HTML to PNG
    const pngBuffer = await renderHTMLToPNG(html, width, height);

    // Return PNG as binary
    return new NextResponse(pngBuffer, {
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": 'attachment; filename="infographic.png"',
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
```

**Step 2: Verify it compiles**

Run:
```bash
cd /Users/phillipan/infographic-generator && npx next build 2>&1 | tail -5
```
Expected: Build succeeds (or at least `app/api/generate/route.ts` compiles without type errors). Note: Full build may warn about page.tsx — that's fine, we'll replace it next.

**Step 3: Commit**

```bash
cd /Users/phillipan/infographic-generator
git add app/api/generate/route.ts
git commit -m "feat: add /api/generate route wiring LLM + renderer"
```

---

### Task 6: UI Components

**Files:**
- Create: `components/ApiKeyInput.tsx`
- Create: `components/SizeSelector.tsx`
- Create: `components/PromptInput.tsx`
- Create: `components/Preview.tsx`

**Step 1: Create ApiKeyInput component**

Create `components/ApiKeyInput.tsx`:

```tsx
"use client";

import { useState, useEffect } from "react";
import { LLMProvider } from "@/lib/llm";

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
```

**Step 2: Create SizeSelector component**

Create `components/SizeSelector.tsx`:

```tsx
"use client";

interface Props {
  width: number;
  height: number;
  onChange: (width: number, height: number) => void;
}

const SIZES = [
  { label: "Portrait", width: 1080, height: 1920, icon: "▯" },
  { label: "Landscape", width: 1920, height: 1080, icon: "▭" },
  { label: "Square", width: 1080, height: 1080, icon: "□" },
];

export default function SizeSelector({ width, height, onChange }: Props) {
  return (
    <div>
      <label className="block text-sm font-medium text-zinc-400 mb-2">
        Size
      </label>
      <div className="flex gap-2">
        {SIZES.map((size) => (
          <button
            key={size.label}
            onClick={() => onChange(size.width, size.height)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg border text-sm transition-colors ${
              width === size.width && height === size.height
                ? "bg-blue-600 border-blue-500 text-white"
                : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500"
            }`}
          >
            <span className="text-lg">{size.icon}</span>
            {size.label}
          </button>
        ))}
      </div>
    </div>
  );
}
```

**Step 3: Create PromptInput component**

Create `components/PromptInput.tsx`:

```tsx
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
        <p className="text-xs text-zinc-600 text-center">⌘ + Enter to generate</p>
      )}
    </div>
  );
}
```

**Step 4: Create Preview component**

Create `components/Preview.tsx`:

```tsx
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
      <div className="flex items-center justify-center h-full min-h-[400px] bg-zinc-900 rounded-xl border border-red-900/50">
        <div className="text-center px-8">
          <p className="text-red-400 text-sm font-medium mb-1">Generation failed</p>
          <p className="text-red-400/70 text-xs">{error}</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px] bg-zinc-900 rounded-xl border border-zinc-800">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-2 border-zinc-600 border-t-blue-500 rounded-full animate-spin mb-3" />
          <p className="text-zinc-500 text-sm">Generating your infographic...</p>
          <p className="text-zinc-600 text-xs mt-1">This may take 10-30 seconds</p>
        </div>
      </div>
    );
  }

  if (!imageUrl) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px] bg-zinc-900 rounded-xl border border-zinc-800">
        <div className="text-center px-8">
          <p className="text-zinc-600 text-sm">Your infographic will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4 flex justify-center">
        <img
          src={imageUrl}
          alt="Generated infographic"
          className="max-w-full max-h-[70vh] rounded-lg shadow-2xl"
          style={{ aspectRatio }}
        />
      </div>
      <a
        href={imageUrl}
        download="infographic.png"
        className="block w-full text-center bg-green-600 hover:bg-green-500 text-white font-medium py-3 px-4 rounded-lg transition-colors text-sm"
      >
        Download PNG
      </a>
    </div>
  );
}
```

**Step 5: Commit**

```bash
cd /Users/phillipan/infographic-generator
git add components/
git commit -m "feat: add UI components (ApiKeyInput, SizeSelector, PromptInput, Preview)"
```

---

### Task 7: Main Page (Wire Everything Together)

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/layout.tsx`

**Step 1: Replace the main page**

Replace `app/page.tsx` with:

```tsx
"use client";

import { useState } from "react";
import ApiKeyInput from "@/components/ApiKeyInput";
import SizeSelector from "@/components/SizeSelector";
import PromptInput from "@/components/PromptInput";
import Preview from "@/components/Preview";
import { LLMProvider } from "@/lib/llm";

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
```

**Step 2: Update layout.tsx metadata**

In `app/layout.tsx`, update the metadata to:

```typescript
export const metadata: Metadata = {
  title: "Infographic Generator",
  description: "Generate beautiful infographics from text prompts using AI",
};
```

**Step 3: Verify the app runs**

Run:
```bash
cd /Users/phillipan/infographic-generator && npm run dev
```
Expected: App loads at localhost:3000 showing the two-column layout with controls on left and empty preview on right. Kill with Ctrl+C.

**Step 4: Commit**

```bash
cd /Users/phillipan/infographic-generator
git add app/page.tsx app/layout.tsx
git commit -m "feat: wire up main page with all components"
```

---

### Task 8: Dockerfile for Self-Hosting

**Files:**
- Create: `Dockerfile`
- Create: `.dockerignore`

**Step 1: Create Dockerfile**

Create `Dockerfile`:

```dockerfile
FROM node:20-slim

# Install Chromium dependencies
RUN apt-get update && apt-get install -y \
    chromium \
    fonts-liberation \
    fonts-noto-color-emoji \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

**Step 2: Create .dockerignore**

Create `.dockerignore`:

```
node_modules
.next
.git
docs
```

**Step 3: Commit**

```bash
cd /Users/phillipan/infographic-generator
git add Dockerfile .dockerignore
git commit -m "feat: add Dockerfile for self-hosting with Chromium"
```

---

### Task 9: README

**Files:**
- Create: `README.md`

**Step 1: Write README**

Create `README.md`:

```markdown
# Infographic Generator

Generate beautiful infographics from text prompts using AI.

Type a description → AI generates the design → download as PNG.

## How it works

1. You describe what you want (e.g., "a comparison of React vs Vue")
2. An LLM (your API key) generates a self-contained HTML/CSS page
3. A headless browser renders it to a high-resolution PNG
4. You download the result

## Quick start

```bash
git clone https://github.com/phillipan14/infographic-generator.git
cd infographic-generator
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), enter your API key, and start generating.

## Supported LLM providers

- **OpenAI** — gpt-4o, gpt-4o-mini
- **Anthropic** — claude-sonnet, claude-haiku
- **Any OpenAI-compatible API** — Groq, Together, Ollama, etc.

## Docker

```bash
docker build -t infographic-generator .
docker run -p 3000:3000 infographic-generator
```

## Privacy

Your API key is stored in your browser's localStorage and sent directly to the LLM provider. It is never stored on any server.

## License

MIT
```

**Step 2: Commit**

```bash
cd /Users/phillipan/infographic-generator
git add README.md
git commit -m "docs: add README with setup and usage instructions"
```

---

### Task 10: End-to-End Smoke Test

**Step 1: Start dev server**

Run:
```bash
cd /Users/phillipan/infographic-generator && npm run dev
```

**Step 2: Test via curl**

In a separate terminal, test the API with a real API key (or verify the error handling with a fake one):

```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt":"simple test","provider":"openai","apiKey":"fake","model":"gpt-4o","width":400,"height":400}' \
  -o /dev/null -w "%{http_code}"
```
Expected: 500 (invalid API key). This confirms the route is reachable and returns proper error codes.

**Step 3: Manual browser test**

Open localhost:3000, enter a real API key, type a prompt, click Generate. Verify:
- Loading spinner appears
- Image renders and displays
- Download button works

**Step 4: Final commit**

```bash
cd /Users/phillipan/infographic-generator
git add -A
git commit -m "chore: final cleanup for v1"
```
