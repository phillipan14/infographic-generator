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
