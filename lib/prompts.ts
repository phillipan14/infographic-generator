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
