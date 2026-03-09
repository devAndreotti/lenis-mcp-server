# 🎯 Lenis MCP Server

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18-green.svg)](https://nodejs.org)

MCP server that provides **Lenis smooth scroll expertise** to AI assistants. Knowledge-based — no external API calls, all documentation is embedded.

## How It Works

This is a **knowledge-based MCP server**. All Lenis documentation (settings, methods, events, patterns, troubleshooting) is embedded directly in the server. When an AI assistant calls a tool, it receives structured, accurate information without any network requests.

## Tools

| Tool | Description |
|------|-------------|
| `lenis_generate_setup` | Generate setup code for vanilla JS, React, Vue, Next.js (+ GSAP, snap) |
| `lenis_get_api_reference` | Query settings, methods, events, properties with search |
| `lenis_debug_scroll_issue` | Diagnose scroll issues against known limitations |
| `lenis_create_scroll_pattern` | Production-ready patterns: parallax, snap, horizontal, WebGL sync |
| `lenis_optimize_performance` | Performance recommendations for your setup |

## Installation

### Via npx (recommended)

Add to your MCP config (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "lenis-mcp": {
      "command": "npx",
      "args": ["-y", "lenis-mcp-server"]
    }
  }
}
```

### From source

```bash
git clone https://github.com/devAndreotti/lenis-mcp-server.git
cd lenis-mcp-server
npm install
npm run build
```

Then add to your MCP config:

```json
{
  "mcpServers": {
    "lenis-mcp": {
      "command": "node",
      "args": ["path/to/lenis-mcp-server/dist/index.js"]
    }
  }
}
```

## Example Prompts

- "Set up Lenis with GSAP ScrollTrigger in my React app"
- "What are all the Lenis settings and their defaults?"
- "My scroll is janky on Safari, help me fix it"
- "Create a parallax effect with Lenis and GSAP"
- "Optimize my Lenis setup for mobile devices"

## Built With

- TypeScript + [MCP SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [Zod](https://zod.dev/) for input validation
- stdio transport (local server)

## Contributing

1. Fork this repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -m 'feat: add my feature'`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a Pull Request

## License

MIT © [Ricardo](https://github.com/ricardonava)
