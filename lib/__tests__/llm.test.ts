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
