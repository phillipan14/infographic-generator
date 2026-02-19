# Infographic Generator

Generate beautiful infographics from text prompts using AI.

Type a description, AI generates the design, download as PNG.

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

- **OpenAI** -- gpt-4o, gpt-4o-mini
- **Anthropic** -- claude-sonnet, claude-haiku
- **Any OpenAI-compatible API** -- Groq, Together, Ollama, etc.

## Docker

```bash
docker build -t infographic-generator .
docker run -p 3000:3000 infographic-generator
```

## Privacy

Your API key is stored in your browser's localStorage and sent directly to the LLM provider. It is never stored on any server.

## License

MIT
