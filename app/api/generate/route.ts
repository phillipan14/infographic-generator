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

    // Return PNG as binary (convert Buffer to Uint8Array for NextResponse compatibility)
    return new NextResponse(new Uint8Array(pngBuffer), {
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": 'attachment; filename="infographic.png"',
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
