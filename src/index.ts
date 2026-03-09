#!/usr/bin/env node
/**
 * Lenis MCP Server
 *
 * Knowledge-based MCP server providing Lenis smooth scroll expertise
 * to AI assistants. No external API calls — all documentation is
 * embedded within the server itself.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import {
  LENIS_SETTINGS,
  LENIS_PROPERTIES,
  LENIS_METHODS,
  LENIS_EVENTS,
  SETUP_PATTERNS,
  KNOWN_LIMITATIONS,
  TROUBLESHOOTING_GUIDE,
  SCROLL_PATTERNS,
  PERFORMANCE_TIPS,
  CSS_REQUIREMENTS,
  NESTED_SCROLL_GUIDE,
  ANCHOR_LINKS_GUIDE,
} from "./knowledge/lenis-docs.js";

// ─────────────────────────────────────────────────
// MCP Server
// ─────────────────────────────────────────────────

const server = new McpServer({
  name: "lenis-mcp-server",
  version: "1.0.0",
});

// ─────────────────────────────────────────────────
// Enums and Schemas
// ─────────────────────────────────────────────────

enum Framework {
  VANILLA = "vanilla",
  REACT = "react",
  VUE = "vue",
  NEXTJS = "nextjs",
}

enum ApiCategory {
  SETTINGS = "settings",
  PROPERTIES = "properties",
  METHODS = "methods",
  EVENTS = "events",
  ALL = "all",
}

enum PatternType {
  PARALLAX = "parallax",
  INFINITE_SCROLL = "infinite-scroll",
  SNAP = "snap",
  HORIZONTAL = "horizontal",
  WEBGL_SYNC = "webgl-sync",
  SCROLL_TRIGGERED = "scroll-triggered",
}

// ─────────────────────────────────────────────────
// Tool 1: lenis_generate_setup
// ─────────────────────────────────────────────────

const GenerateSetupSchema = z
  .object({
    framework: z
      .nativeEnum(Framework)
      .default(Framework.VANILLA)
      .describe("Target framework: vanilla, react, vue, or nextjs"),
    with_gsap: z
      .boolean()
      .default(false)
      .describe("Include GSAP ScrollTrigger integration"),
    with_snap: z
      .boolean()
      .default(false)
      .describe("Include lenis/snap package for scroll snapping"),
    custom_raf: z
      .boolean()
      .default(false)
      .describe("Use custom requestAnimationFrame loop instead of autoRaf"),
    settings: z
      .record(z.string(), z.unknown())
      .optional()
      .describe(
        "Custom Lenis settings to include (e.g., { lerp: 0.05, duration: 1.5 })"
      ),
  })
  .strict();

type GenerateSetupInput = z.infer<typeof GenerateSetupSchema>;

server.registerTool(
  "lenis_generate_setup",
  {
    title: "Generate Lenis Setup",
    description: `Generates complete Lenis smooth scroll setup code for a given framework.

Supports vanilla JS, React, Vue, and Next.js with optional GSAP ScrollTrigger integration,
snap scrolling, and custom RAF loop configuration.

Args:
  - framework ('vanilla' | 'react' | 'vue' | 'nextjs'): Target framework (default: 'vanilla')
  - with_gsap (boolean): Include GSAP ScrollTrigger integration (default: false)
  - with_snap (boolean): Include lenis/snap package (default: false)
  - custom_raf (boolean): Use custom requestAnimationFrame loop (default: false)
  - settings (object): Custom Lenis settings to include

Returns:
  Complete setup code with installation commands, imports, initialization, CSS, and comments.

Examples:
  - "Set up Lenis with GSAP in React" → framework: 'react', with_gsap: true
  - "Basic smooth scroll for vanilla JS" → framework: 'vanilla'
  - "Next.js app with snap scrolling" → framework: 'nextjs', with_snap: true`,
    inputSchema: GenerateSetupSchema,
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
  },
  async (params: GenerateSetupInput) => {
    const sections: string[] = [];

    // Title
    sections.push(
      `# Lenis Setup — ${params.framework.toUpperCase()}${params.with_gsap ? " + GSAP ScrollTrigger" : ""}${params.with_snap ? " + Snap" : ""}\n`
    );

    // Installation
    const packages = ["lenis"];
    if (params.with_gsap) packages.push("gsap");
    if (params.with_snap) packages.push("lenis/snap");
    if (params.framework === "react") packages.push("lenis/react");
    if (params.framework === "vue") packages.push("lenis/vue");

    sections.push(`## Installation\n\`\`\`bash\nnpm i ${packages.join(" ")}\n\`\`\`\n`);

    // CSS
    sections.push(`## Required CSS\n${CSS_REQUIREMENTS}\n`);

    // Setup code
    const pattern = SETUP_PATTERNS[params.framework];
    if (pattern) {
      let code = pattern.base;

      if (params.with_gsap && pattern.gsap) {
        code += "\n\n" + pattern.gsap;
      }

      if (params.custom_raf && pattern.customRaf) {
        code = pattern.customRaf + (params.with_gsap && pattern.gsap ? "\n\n" + pattern.gsap : "");
      }

      // Apply custom settings
      if (params.settings && Object.keys(params.settings).length > 0) {
        const settingsStr = JSON.stringify(params.settings, null, 2);
        sections.push(`## Custom Settings Applied\n\`\`\`json\n${settingsStr}\n\`\`\`\n`);

        // Replace the default settings object in the code
        const settingsEntries = Object.entries(params.settings)
          .map(([k, v]) => `  ${k}: ${JSON.stringify(v)},`)
          .join("\n");
        code = code.replace(
          /autoRaf: true,?/,
          `autoRaf: true,\n${settingsEntries}`
        );
      }

      sections.push(`## Setup Code\n\`\`\`${pattern.lang}\n${code}\n\`\`\`\n`);
    }

    // Snap setup
    if (params.with_snap) {
      sections.push(`## Snap Scroll Setup

> **Note**: Lenis does not support native CSS \`scroll-snap\`. Use the \`lenis/snap\` package instead.

\`\`\`typescript
import Lenis from 'lenis'
import Snap from 'lenis/snap'

const lenis = new Lenis({ autoRaf: true })

// Create a Snap instance and associate it with Lenis
const snap = new Snap(lenis, {
  // Define snap points
  // Can be HTMLElement[], number[], or string[] (CSS selectors)
})
\`\`\`
`);
    }

    // Important tips
    sections.push(`## Important Notes

- Always include the recommended CSS (import \`lenis/dist/lenis.css\` or add manually)
- Use \`autoRaf: true\` unless you need a custom animation loop
- If using GSAP ScrollTrigger, disable \`lagSmoothing\` with \`gsap.ticker.lagSmoothing(0)\`
- Lenis is capped to 60fps on Safari and 30fps on low power mode
- Smooth scroll stops working over iframes (they don't forward wheel events)
`);

    return {
      content: [{ type: "text" as const, text: sections.join("\n") }],
    };
  }
);

// ─────────────────────────────────────────────────
// Tool 2: lenis_get_api_reference
// ─────────────────────────────────────────────────

const ApiReferenceSchema = z
  .object({
    category: z
      .nativeEnum(ApiCategory)
      .default(ApiCategory.ALL)
      .describe(
        "API category to query: settings, properties, methods, events, or all"
      ),
    search: z
      .string()
      .optional()
      .describe(
        "Search term to filter results (e.g., 'lerp', 'scrollTo', 'wheel')"
      ),
  })
  .strict();

type ApiReferenceInput = z.infer<typeof ApiReferenceSchema>;

server.registerTool(
  "lenis_get_api_reference",
  {
    title: "Lenis API Reference",
    description: `Queries the complete Lenis API documentation — settings, methods, events, and properties.

Supports filtering by category and search term for targeted lookups.

Args:
  - category ('settings' | 'properties' | 'methods' | 'events' | 'all'): Filter by API category (default: 'all')
  - search (string): Optional search term to filter results

Returns:
  Formatted API documentation with types, defaults, and descriptions.

Examples:
  - "What is the lerp setting?" → category: 'settings', search: 'lerp'
  - "List all methods" → category: 'methods'
  - "How do events work?" → category: 'events'`,
    inputSchema: ApiReferenceSchema,
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
  },
  async (params: ApiReferenceInput) => {
    const sections: string[] = [];
    const search = params.search?.toLowerCase();

    const filterFn = (name: string, description: string) =>
      !search ||
      name.toLowerCase().includes(search) ||
      description.toLowerCase().includes(search);

    if (
      params.category === ApiCategory.SETTINGS ||
      params.category === ApiCategory.ALL
    ) {
      const filtered = LENIS_SETTINGS.filter((s) =>
        filterFn(s.name, s.description)
      );
      if (filtered.length > 0) {
        sections.push("# Settings\n");
        for (const s of filtered) {
          sections.push(
            `### \`${s.name}\`\n- **Type**: \`${s.type}\`\n- **Default**: \`${s.default}\`\n- **Description**: ${s.description}\n`
          );
        }
      }
    }

    if (
      params.category === ApiCategory.PROPERTIES ||
      params.category === ApiCategory.ALL
    ) {
      const filtered = LENIS_PROPERTIES.filter((p) =>
        filterFn(p.name, p.description)
      );
      if (filtered.length > 0) {
        sections.push("# Properties\n");
        for (const p of filtered) {
          sections.push(
            `### \`${p.name}\`\n- **Type**: \`${p.type}\`\n- **Description**: ${p.description}\n`
          );
        }
      }
    }

    if (
      params.category === ApiCategory.METHODS ||
      params.category === ApiCategory.ALL
    ) {
      const filtered = LENIS_METHODS.filter((m) =>
        filterFn(m.name, m.description)
      );
      if (filtered.length > 0) {
        sections.push("# Methods\n");
        for (const m of filtered) {
          sections.push(
            `### \`${m.name}\`\n- **Signature**: \`${m.signature}\`\n- **Description**: ${m.description}\n${m.params ? `- **Parameters**:\n${m.params.map((p) => `  - \`${p.name}\` (${p.type}): ${p.description}`).join("\n")}\n` : ""}`
          );
        }
      }
    }

    if (
      params.category === ApiCategory.EVENTS ||
      params.category === ApiCategory.ALL
    ) {
      const filtered = LENIS_EVENTS.filter((e) =>
        filterFn(e.name, e.description)
      );
      if (filtered.length > 0) {
        sections.push("# Events\n");
        for (const e of filtered) {
          sections.push(
            `### \`${e.name}\`\n- **Callback data**: \`${e.data}\`\n- **Description**: ${e.description}\n`
          );
        }
      }
    }

    if (sections.length === 0) {
      sections.push(
        `No results found${search ? ` for "${search}"` : ""} in category "${params.category}".`
      );
    }

    return {
      content: [{ type: "text" as const, text: sections.join("\n") }],
    };
  }
);

// ─────────────────────────────────────────────────
// Tool 3: lenis_debug_scroll_issue
// ─────────────────────────────────────────────────

const DebugSchema = z
  .object({
    symptom: z
      .string()
      .min(5, "Describe the issue in at least 5 characters")
      .describe(
        "Description of the scroll issue (e.g., 'scroll not working', 'janky on Safari', 'nested scroll broken')"
      ),
    framework: z
      .nativeEnum(Framework)
      .optional()
      .describe("Framework being used, if known"),
    using_gsap: z
      .boolean()
      .default(false)
      .describe("Whether GSAP ScrollTrigger is being used"),
  })
  .strict();

type DebugInput = z.infer<typeof DebugSchema>;

server.registerTool(
  "lenis_debug_scroll_issue",
  {
    title: "Debug Lenis Scroll Issue",
    description: `Diagnoses Lenis smooth scroll issues based on symptom descriptions.

Matches symptoms against known limitations, common pitfalls, and troubleshooting patterns
from the official Lenis documentation.

Args:
  - symptom (string): Description of the scroll issue
  - framework (string): Framework being used, if known
  - using_gsap (boolean): Whether GSAP ScrollTrigger is being used (default: false)

Returns:
  Diagnosis with probable causes, step-by-step fixes, and relevant code snippets.

Examples:
  - "Scroll feels janky on Safari" → symptom about Safari fps cap
  - "Nested modal scroll not working" → nested scroll configuration
  - "ScrollTrigger not syncing" → GSAP integration issue`,
    inputSchema: DebugSchema,
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
  },
  async (params: DebugInput) => {
    const symptomLower = params.symptom.toLowerCase();
    const sections: string[] = [];

    sections.push(`# 🔧 Lenis Debug Report\n`);
    sections.push(`**Symptom**: ${params.symptom}\n`);

    // Check against known limitations
    const matchedLimitations = KNOWN_LIMITATIONS.filter(
      (l) =>
        l.keywords.some((kw) => symptomLower.includes(kw))
    );

    if (matchedLimitations.length > 0) {
      sections.push(`## ⚠️ Known Limitations Detected\n`);
      for (const l of matchedLimitations) {
        sections.push(`### ${l.title}\n${l.description}\n`);
        if (l.workaround) {
          sections.push(`**Workaround**:\n\`\`\`typescript\n${l.workaround}\n\`\`\`\n`);
        }
      }
    }

    // General troubleshooting guide
    const matchedTroubleshoot = TROUBLESHOOTING_GUIDE.filter(
      (t) => t.keywords.some((kw) => symptomLower.includes(kw))
    );

    if (matchedTroubleshoot.length > 0) {
      sections.push(`## 🛠️ Troubleshooting Steps\n`);
      for (const t of matchedTroubleshoot) {
        sections.push(`### ${t.title}\n`);
        for (const step of t.steps) {
          sections.push(`- ${step}`);
        }
        if (t.code) {
          sections.push(`\n\`\`\`typescript\n${t.code}\n\`\`\`\n`);
        }
        sections.push("");
      }
    }

    // GSAP-specific issues
    if (params.using_gsap) {
      sections.push(`## 🎬 GSAP Integration Checklist

1. Ensure Lenis scroll event is connected to ScrollTrigger:
\`\`\`typescript
lenis.on('scroll', ScrollTrigger.update);
\`\`\`

2. Add Lenis raf to GSAP ticker:
\`\`\`typescript
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
\`\`\`

3. **Critical**: Disable lag smoothing:
\`\`\`typescript
gsap.ticker.lagSmoothing(0);
\`\`\`

4. Do NOT use \`autoRaf: true\` when using GSAP ticker — let GSAP control the loop.
`);
    }

    // Nested scroll
    if (
      symptomLower.includes("nested") ||
      symptomLower.includes("modal") ||
      symptomLower.includes("dropdown") ||
      symptomLower.includes("overflow")
    ) {
      sections.push(`## 📦 Nested Scroll Fix\n\n${NESTED_SCROLL_GUIDE}\n`);
    }

    // Anchor links
    if (
      symptomLower.includes("anchor") ||
      symptomLower.includes("hash") ||
      symptomLower.includes("#")
    ) {
      sections.push(`## 🔗 Anchor Links Fix\n\n${ANCHOR_LINKS_GUIDE}\n`);
    }

    // If nothing was found, give generic tips
    if (matchedLimitations.length === 0 && matchedTroubleshoot.length === 0) {
      sections.push(`## 📋 General Troubleshooting Checklist

1. Make sure you're using the latest version of Lenis
2. Include the recommended CSS (\`import 'lenis/dist/lenis.css'\`)
3. Verify your element/page is scrollable without Lenis
4. Use \`autoRaf: true\` or manually call \`lenis.raf(time)\` in your animation loop
5. If using GSAP ScrollTrigger, follow the integration guide above
6. Check browser console for errors
7. Test on different browsers — Safari has known fps limitations
`);
    }

    return {
      content: [{ type: "text" as const, text: sections.join("\n") }],
    };
  }
);

// ─────────────────────────────────────────────────
// Tool 4: lenis_create_scroll_pattern
// ─────────────────────────────────────────────────

const ScrollPatternSchema = z
  .object({
    pattern: z
      .nativeEnum(PatternType)
      .describe(
        "Scroll pattern to generate: parallax, infinite-scroll, snap, horizontal, webgl-sync, or scroll-triggered"
      ),
    framework: z
      .nativeEnum(Framework)
      .default(Framework.VANILLA)
      .describe("Target framework"),
    with_gsap: z
      .boolean()
      .default(true)
      .describe("Include GSAP for animations (recommended for most patterns)"),
  })
  .strict();

type ScrollPatternInput = z.infer<typeof ScrollPatternSchema>;

server.registerTool(
  "lenis_create_scroll_pattern",
  {
    title: "Create Lenis Scroll Pattern",
    description: `Generates production-ready code for common Lenis scroll patterns.

Available patterns: parallax, infinite-scroll, snap, horizontal scroll, WebGL sync, and scroll-triggered animations.

Args:
  - pattern ('parallax' | 'infinite-scroll' | 'snap' | 'horizontal' | 'webgl-sync' | 'scroll-triggered'): Pattern to generate
  - framework ('vanilla' | 'react' | 'vue' | 'nextjs'): Target framework (default: 'vanilla')
  - with_gsap (boolean): Include GSAP for animations (default: true)

Returns:
  Complete code with HTML structure, CSS, JavaScript setup, and explanatory comments.

Examples:
  - "Parallax effect with GSAP" → pattern: 'parallax', with_gsap: true
  - "Horizontal scroll section" → pattern: 'horizontal'
  - "Snap scrolling between sections" → pattern: 'snap'`,
    inputSchema: ScrollPatternSchema,
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
  },
  async (params: ScrollPatternInput) => {
    const patternData = SCROLL_PATTERNS[params.pattern];

    if (!patternData) {
      return {
        content: [
          {
            type: "text" as const,
            text: `Pattern "${params.pattern}" not found. Available: ${Object.keys(SCROLL_PATTERNS).join(", ")}`,
          },
        ],
      };
    }

    const sections: string[] = [];

    sections.push(
      `# ${patternData.title} — Lenis${params.with_gsap ? " + GSAP" : ""}\n`
    );
    sections.push(`${patternData.description}\n`);

    // Installation
    const packages = ["lenis"];
    if (params.with_gsap) packages.push("gsap");
    if (params.pattern === "snap") packages.push("lenis/snap");

    sections.push(`## Installation\n\`\`\`bash\nnpm i ${packages.join(" ")}\n\`\`\`\n`);

    // HTML
    if (patternData.html) {
      sections.push(`## HTML Structure\n\`\`\`html\n${patternData.html}\n\`\`\`\n`);
    }

    // CSS
    if (patternData.css) {
      sections.push(`## CSS\n\`\`\`css\n${patternData.css}\n\`\`\`\n`);
    }

    // JavaScript
    const code = params.with_gsap && patternData.jsGsap
      ? patternData.jsGsap
      : patternData.js;

    sections.push(`## JavaScript\n\`\`\`typescript\n${code}\n\`\`\`\n`);

    // Notes
    if (patternData.notes) {
      sections.push(`## Notes\n${patternData.notes}\n`);
    }

    return {
      content: [{ type: "text" as const, text: sections.join("\n") }],
    };
  }
);

// ─────────────────────────────────────────────────
// Tool 5: lenis_optimize_performance
// ─────────────────────────────────────────────────

const OptimizeSchema = z
  .object({
    setup_description: z
      .string()
      .min(10, "Describe your setup in at least 10 characters")
      .describe(
        "Description of current Lenis setup (e.g., 'React app with 50 GSAP animations and parallax')"
      ),
    target_fps: z
      .number()
      .int()
      .min(30)
      .max(144)
      .default(60)
      .describe("Target frames per second"),
    mobile_optimized: z
      .boolean()
      .default(true)
      .describe("Whether to include mobile-specific optimizations"),
  })
  .strict();

type OptimizeInput = z.infer<typeof OptimizeSchema>;

server.registerTool(
  "lenis_optimize_performance",
  {
    title: "Optimize Lenis Performance",
    description: `Provides performance optimization recommendations for Lenis smooth scroll setups.

Analyzes the described setup and returns targeted tips for reducing jank, improving fps,
and optimizing for mobile devices.

Args:
  - setup_description (string): Description of current Lenis setup
  - target_fps (number): Target frames per second (default: 60)
  - mobile_optimized (boolean): Include mobile-specific tips (default: true)

Returns:
  Prioritized list of optimization recommendations with code examples.

Examples:
  - "React app with 50 GSAP animations and parallax" → heavy animation tips
  - "Simple landing page with smooth scroll" → lightweight optimizations
  - "E-commerce site with lazy loaded images" → scroll-aware loading tips`,
    inputSchema: OptimizeSchema,
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
  },
  async (params: OptimizeInput) => {
    const descLower = params.setup_description.toLowerCase();
    const sections: string[] = [];

    sections.push(`# ⚡ Lenis Performance Optimization Report\n`);
    sections.push(`**Setup**: ${params.setup_description}`);
    sections.push(`**Target FPS**: ${params.target_fps}\n`);

    // Core tips always included
    sections.push(`## Core Optimizations\n`);
    for (const tip of PERFORMANCE_TIPS.core) {
      sections.push(`### ${tip.title}\n${tip.description}\n`);
      if (tip.code) {
        sections.push(`\`\`\`typescript\n${tip.code}\n\`\`\`\n`);
      }
    }

    // GSAP tips
    if (descLower.includes("gsap") || descLower.includes("animation") || descLower.includes("scrolltrigger")) {
      sections.push(`## GSAP-Specific Optimizations\n`);
      for (const tip of PERFORMANCE_TIPS.gsap) {
        sections.push(`### ${tip.title}\n${tip.description}\n`);
        if (tip.code) {
          sections.push(`\`\`\`typescript\n${tip.code}\n\`\`\`\n`);
        }
      }
    }

    // Heavy content tips
    if (
      descLower.includes("image") ||
      descLower.includes("video") ||
      descLower.includes("lazy") ||
      descLower.includes("heavy") ||
      descLower.includes("50") ||
      descLower.includes("many")
    ) {
      sections.push(`## Heavy Content Optimizations\n`);
      for (const tip of PERFORMANCE_TIPS.heavyContent) {
        sections.push(`### ${tip.title}\n${tip.description}\n`);
        if (tip.code) {
          sections.push(`\`\`\`typescript\n${tip.code}\n\`\`\`\n`);
        }
      }
    }

    // Mobile tips
    if (params.mobile_optimized) {
      sections.push(`## Mobile Optimizations\n`);
      for (const tip of PERFORMANCE_TIPS.mobile) {
        sections.push(`### ${tip.title}\n${tip.description}\n`);
        if (tip.code) {
          sections.push(`\`\`\`typescript\n${tip.code}\n\`\`\`\n`);
        }
      }
    }

    // Safari-specific
    if (descLower.includes("safari") || descLower.includes("apple") || descLower.includes("ios")) {
      sections.push(`## Safari / iOS Specific

- Safari is capped at 60fps (WebKit limitation)
- Low power mode reduces to 30fps
- \`position: fixed\` may lag on pre-M1 Macs
- \`syncTouch\` may behave unexpectedly on iOS < 16
- Consider disabling smooth scroll on Safari if performance is critical:

\`\`\`typescript
const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
const lenis = new Lenis({
  autoRaf: true,
  lerp: isSafari ? 0.15 : 0.1, // Mais rápido no Safari para compensar fps
});
\`\`\`
`);
    }

    return {
      content: [{ type: "text" as const, text: sections.join("\n") }],
    };
  }
);

// ─────────────────────────────────────────────────
// Initialization via stdio
// ─────────────────────────────────────────────────

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Lenis MCP Server running via stdio");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
