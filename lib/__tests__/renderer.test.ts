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
