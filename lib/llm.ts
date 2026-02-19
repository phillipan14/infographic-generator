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

export async function generateHTML(
  params: GenerateHTMLParams
): Promise<string> {
  const { provider, apiKey, model, systemPrompt, userPrompt, baseUrl } =
    params;

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
