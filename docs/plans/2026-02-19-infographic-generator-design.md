# Infographic Generator — Design Document

**Date:** 2026-02-19
**Status:** Approved

## Overview

Open-source web app where users type a natural language prompt and receive a polished, downloadable PNG infographic. The LLM generates HTML/CSS code which is rendered to an image via headless browser.

**Repo:** Public GitHub project
**License:** MIT

## Architecture

```
User prompt → Next.js API route → LLM (user's API key) → HTML string → Puppeteer → PNG → Download
```

- **Frontend:** Next.js 14 (App Router), React, Tailwind CSS
- **Backend:** Single API route (`/api/generate`) handles LLM call + Puppeteer render
- **LLM:** User brings their own key. Supports OpenAI, Anthropic, and any OpenAI-compatible endpoint (Groq, Together, Ollama)
- **Rendering:** Puppeteer/Playwright headless Chrome screenshots the generated HTML to PNG
- **Deploy:** Vercel (serverless) or self-hosted Docker

## Data Flow

1. User enters prompt + selects size (portrait 1080x1920, landscape 1920x1080, square 1080x1080)
2. Frontend POSTs to `/api/generate` with prompt, provider, API key, and size
3. API route builds a system prompt instructing the LLM to generate a self-contained HTML page with inline CSS
4. LLM returns HTML string
5. Puppeteer launches headless Chrome, loads the HTML, screenshots at the specified viewport size
6. PNG buffer returned to frontend
7. User previews and downloads

## UI

Single page, three states:

1. **Input:** Prompt textarea, API key field (saved in localStorage), provider dropdown, size selector, Generate button
2. **Loading:** Skeleton preview with progress text
3. **Result:** Full PNG preview, Download button, Regenerate button

No auth, no accounts, no sidebar. Prompt → image.

## Project Structure

```
infographic-generator/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── api/generate/route.ts
├── lib/
│   ├── llm.ts
│   ├── renderer.ts
│   └── prompts.ts
├── components/
│   ├── PromptInput.tsx
│   ├── SizeSelector.tsx
│   ├── Preview.tsx
│   └── ApiKeyInput.tsx
├── public/
├── Dockerfile
├── package.json
└── README.md
```

## LLM Provider Support

- OpenAI (gpt-4o, gpt-4o-mini)
- Anthropic (claude-sonnet, claude-haiku)
- Any OpenAI-compatible endpoint via custom base URL

Provider selection is a dropdown. System prompt is provider-agnostic.

## Scope — v1

**In:**
- Single prompt → single PNG infographic
- 3 size presets
- Download as PNG
- BYOK (bring your own key)
- Docker + Vercel deploy

**Out:**
- Templates/presets
- Edit/tweak generated output
- Image upload
- User accounts / history
- Multiple export formats
- Rate limiting
