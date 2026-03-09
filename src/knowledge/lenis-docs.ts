/**
 * Lenis knowledge base — All official documentation embedded.
 * Source: https://github.com/darkroomengineering/lenis
 */

// ─────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────

export interface LenisSetting {
  name: string;
  type: string;
  default: string;
  description: string;
}

export interface LenisProperty {
  name: string;
  type: string;
  description: string;
}

export interface LenisMethod {
  name: string;
  signature: string;
  description: string;
  params?: Array<{ name: string; type: string; description: string }>;
}

export interface LenisEvent {
  name: string;
  data: string;
  description: string;
}

export interface Limitation {
  title: string;
  description: string;
  keywords: string[];
  workaround?: string;
}

export interface TroubleshootEntry {
  title: string;
  keywords: string[];
  steps: string[];
  code?: string;
}

export interface PerformanceTip {
  title: string;
  description: string;
  code?: string;
}

export interface ScrollPattern {
  title: string;
  description: string;
  html?: string;
  css?: string;
  js: string;
  jsGsap?: string;
  notes?: string;
}

export interface SetupPattern {
  lang: string;
  base: string;
  gsap?: string;
  customRaf?: string;
}

// ─────────────────────────────────────────────────
// Settings
// ─────────────────────────────────────────────────

export const LENIS_SETTINGS: LenisSetting[] = [
  {
    name: "wrapper",
    type: "HTMLElement | Window",
    default: "window",
    description: "The element that wraps the scrollable content. Defaults to window for whole-page scroll.",
  },
  {
    name: "content",
    type: "HTMLElement",
    default: "document.documentElement",
    description: "The scrollable content element.",
  },
  {
    name: "eventsTarget",
    type: "HTMLElement | Window",
    default: "wrapper",
    description: "The element that listens for wheel and touch events.",
  },
  {
    name: "smoothWheel",
    type: "boolean",
    default: "true",
    description: "Enables smooth scrolling for wheel events.",
  },
  {
    name: "lerp",
    type: "number",
    default: "0.1",
    description: "Linear interpolation intensity (0-1). Lower values = smoother/slower scroll. Higher values = snappier.",
  },
  {
    name: "duration",
    type: "number",
    default: "1.2",
    description: "Duration of the scroll animation in seconds. Only used when lerp is not set.",
  },
  {
    name: "easing",
    type: "function",
    default: "(t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))",
    description: "Easing function for scroll animation. Only used when duration is set. See easings.net for reference.",
  },
  {
    name: "orientation",
    type: "string",
    default: "vertical",
    description: "Scroll direction: 'vertical' or 'horizontal'.",
  },
  {
    name: "gestureOrientation",
    type: "string",
    default: "vertical",
    description: "Gesture direction: 'vertical', 'horizontal', or 'both'.",
  },
  {
    name: "syncTouch",
    type: "boolean",
    default: "false",
    description: "Enables lerp-based smooth scroll for touch devices. May behave unexpectedly on iOS < 16.",
  },
  {
    name: "syncTouchLerp",
    type: "number",
    default: "0.075",
    description: "Lerp value for touch devices when syncTouch is enabled.",
  },
  {
    name: "touchInertiaExponent",
    type: "number",
    default: "1.7",
    description: "Exponent used to calculate touch inertia deceleration.",
  },
  {
    name: "wheelMultiplier",
    type: "number",
    default: "1",
    description: "Multiplier for wheel scroll delta. Increase to make wheel scroll faster.",
  },
  {
    name: "touchMultiplier",
    type: "number",
    default: "1",
    description: "Multiplier for touch scroll delta. Increase to make touch scroll faster.",
  },
  {
    name: "infinite",
    type: "boolean",
    default: "false",
    description: "Enables infinite scrolling. Not compatible with syncTouch: true.",
  },
  {
    name: "autoResize",
    type: "boolean",
    default: "true",
    description: "Automatically resize using ResizeObserver. Set false to manually call .resize().",
  },
  {
    name: "prevent",
    type: "function",
    default: "undefined",
    description: "Function that returns true for elements where Lenis should be prevented. E.g. (node) => node.classList.contains('modal').",
  },
  {
    name: "virtualScroll",
    type: "function",
    default: "undefined",
    description: "Function to modify or prevent virtual scroll events. Return false to prevent, or modify deltaX/deltaY.",
  },
  {
    name: "overscroll",
    type: "boolean",
    default: "true",
    description: "Enables overscroll behavior. See MDN overscroll-behavior for details.",
  },
  {
    name: "autoRaf",
    type: "boolean",
    default: "false",
    description: "Automatically calls requestAnimationFrame. Set true for simple setups. Set false when using GSAP ticker or custom RAF loop.",
  },
  {
    name: "anchors",
    type: "boolean | ScrollToOptions",
    default: "false",
    description: "Enables smooth scrolling to anchor links. Set true or pass ScrollToOptions for offset/onComplete.",
  },
  {
    name: "autoToggle",
    type: "boolean",
    default: "false",
    description: "Automatically toggle scrolling based on CSS transition-behavior support.",
  },
  {
    name: "allowNestedScroll",
    type: "boolean",
    default: "false",
    description: "Automatically detect nested scrollable elements and let them scroll natively. May cause performance issues.",
  },
  {
    name: "naiveDimensions",
    type: "boolean",
    default: "false",
    description: "Use naive dimension calculations. Set true for simpler dimension handling.",
  },
  {
    name: "stopInertiaOnNavigate",
    type: "boolean",
    default: "false",
    description: "Stop scroll inertia on page navigation.",
  },
];

// ─────────────────────────────────────────────────
// Properties
// ─────────────────────────────────────────────────

export const LENIS_PROPERTIES: LenisProperty[] = [
  { name: "animatedScroll", type: "number", description: "Current scroll value with lerp applied (the animated position)." },
  { name: "dimensions", type: "object", description: "Contains scroll dimensions info (width, height, scrollWidth, scrollHeight)." },
  { name: "direction", type: "number", description: "Current scroll direction: 1 (down/right) or -1 (up/left)." },
  { name: "options", type: "object", description: "Current Lenis options/settings." },
  { name: "targetScroll", type: "number", description: "Target scroll position (where scroll is heading)." },
  { name: "time", type: "number", description: "Current animation time." },
  { name: "actualScroll", type: "number", description: "Actual native scroll position (without lerp)." },
  { name: "lastVelocity", type: "number", description: "Previous frame's scroll velocity." },
  { name: "velocity", type: "number", description: "Current scroll velocity." },
  { name: "isHorizontal", type: "boolean", description: "Whether scroll orientation is horizontal." },
  { name: "isScrolling", type: "boolean | string", description: "Whether scrolling is active. Can be 'smooth', 'native', or false." },
  { name: "isStopped", type: "boolean", description: "Whether Lenis is currently stopped." },
  { name: "limit", type: "number", description: "Maximum scroll value." },
  { name: "progress", type: "number", description: "Scroll progress from 0 to 1." },
  { name: "rootElement", type: "HTMLElement", description: "Root element Lenis adds className to." },
  { name: "scroll", type: "number", description: "Current scroll value." },
  { name: "className", type: "string", description: "Class name added to rootElement." },
];

// ─────────────────────────────────────────────────
// Methods
// ─────────────────────────────────────────────────

export const LENIS_METHODS: LenisMethod[] = [
  {
    name: "raf",
    signature: "raf(time: number): void",
    description: "Must be called in a requestAnimationFrame loop or GSAP ticker. Not needed when autoRaf is true.",
    params: [{ name: "time", type: "number", description: "Current time from requestAnimationFrame or performance.now()" }],
  },
  {
    name: "scrollTo",
    signature: "scrollTo(target: number | string | HTMLElement, options?: ScrollToOptions): void",
    description: "Scroll to a target position, element, or CSS selector. Supports smooth animation with configurable options.",
    params: [
      { name: "target", type: "number | string | HTMLElement", description: "Target: pixels (number), CSS selector/keyword (string: top, left, start, bottom, right, end), or DOM element" },
      { name: "options.offset", type: "number", description: "Equivalent to scroll-padding-top" },
      { name: "options.lerp", type: "number", description: "Animation lerp intensity" },
      { name: "options.duration", type: "number", description: "Animation duration in seconds" },
      { name: "options.easing", type: "function", description: "Animation easing function" },
      { name: "options.immediate", type: "boolean", description: "Ignore duration, easing and lerp — jump instantly" },
      { name: "options.lock", type: "boolean", description: "Prevent user scrolling until target is reached" },
      { name: "options.force", type: "boolean", description: "Reach target even if instance is stopped" },
      { name: "options.onComplete", type: "function", description: "Called when the target is reached" },
      { name: "options.userData", type: "object", description: "Object forwarded through scroll events" },
    ],
  },
  {
    name: "on",
    signature: "on(event: string, callback: Function): void",
    description: "Subscribe to Lenis events ('scroll' or 'virtual-scroll').",
    params: [
      { name: "event", type: "string", description: "Event name: 'scroll' or 'virtual-scroll'" },
      { name: "callback", type: "Function", description: "Event handler function" },
    ],
  },
  {
    name: "stop",
    signature: "stop(): void",
    description: "Stop Lenis from scrolling. The user will not be able to scroll until start() is called.",
  },
  {
    name: "start",
    signature: "start(): void",
    description: "Resume scrolling after calling stop().",
  },
  {
    name: "resize",
    signature: "resize(): void",
    description: "Manually recalculate dimensions. Only needed when autoResize is set to false.",
  },
  {
    name: "destroy",
    signature: "destroy(): void",
    description: "Destroy the Lenis instance, remove all event listeners and clean up.",
  },
];

// ─────────────────────────────────────────────────
// Events
// ─────────────────────────────────────────────────

export const LENIS_EVENTS: LenisEvent[] = [
  {
    name: "scroll",
    data: "Lenis instance",
    description: "Fired on every scroll update. Receives the Lenis instance as parameter with current scroll data (scroll, velocity, direction, progress, etc.).",
  },
  {
    name: "virtual-scroll",
    data: "{ deltaX: number, deltaY: number, event: Event }",
    description: "Fired on virtual scroll events (before Lenis processes them). Useful for modifying scroll behavior or preventing scroll on specific interactions.",
  },
];

// ─────────────────────────────────────────────────
// CSS Requirements
// ─────────────────────────────────────────────────

export const CSS_REQUIREMENTS = `Import the stylesheet:
\`\`\`typescript
import 'lenis/dist/lenis.css'
\`\`\`

Or link via CDN:
\`\`\`html
<link rel="stylesheet" href="https://unpkg.com/lenis@1.3.18/dist/lenis.css">
\`\`\`

Or add manually — the core CSS ensures \`html.lenis\` and \`html.lenis-smooth\` classes
set \`scroll-behavior: auto\` to prevent conflicts with native smooth scrolling.`;

// ─────────────────────────────────────────────────
// Setup Patterns
// ─────────────────────────────────────────────────

export const SETUP_PATTERNS: Record<string, SetupPattern> = {
  vanilla: {
    lang: "typescript",
    base: `import Lenis from 'lenis'
import 'lenis/dist/lenis.css'

// Initialize Lenis with autoRaf for simpler setups
const lenis = new Lenis({
  autoRaf: true,
})

// Listen for scroll events
lenis.on('scroll', (e) => {
  console.log(e)
})`,
    gsap: `import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Synchronize Lenis with GSAP ScrollTrigger
lenis.on('scroll', ScrollTrigger.update)

// Use GSAP's ticker to drive the animation loop
gsap.ticker.add((time) => {
  lenis.raf(time * 1000) // Convert seconds to milliseconds
})

// IMPORTANT: disable lag smoothing to prevent delays
gsap.ticker.lagSmoothing(0)`,
    customRaf: `import Lenis from 'lenis'
import 'lenis/dist/lenis.css'

// Initialize Lenis WITHOUT autoRaf (manual control of the loop)
const lenis = new Lenis()

// Custom animation loop
function raf(time: number) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}
requestAnimationFrame(raf)

lenis.on('scroll', (e) => {
  console.log(e)
})`,
  },
  react: {
    lang: "tsx",
    base: `// App.tsx or main layout
import { ReactLenis } from 'lenis/react'
import 'lenis/dist/lenis.css'

function App() {
  return (
    <ReactLenis root options={{ autoRaf: true }}>
      {/* Your components here */}
      <main>
        <section style={{ height: '100vh' }}>Section 1</section>
        <section style={{ height: '100vh' }}>Section 2</section>
        <section style={{ height: '100vh' }}>Section 3</section>
      </main>
    </ReactLenis>
  )
}

export default App`,
    gsap: `// hooks/useGsapLenis.ts
import { useEffect } from 'react'
import { useLenis } from 'lenis/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useGsapLenis() {
  // Connect Lenis to ScrollTrigger
  useLenis(ScrollTrigger.update)

  useEffect(() => {
    // IMPORTANT: disable lag smoothing
    gsap.ticker.lagSmoothing(0)

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [])
}`,
    customRaf: `// App.tsx with custom animation loop
import { ReactLenis } from 'lenis/react'
import 'lenis/dist/lenis.css'

function App() {
  return (
    <ReactLenis
      root
      options={{
        autoRaf: false, // Disabled for manual control
      }}
    >
      <main>
        <section style={{ height: '100vh' }}>Section 1</section>
        <section style={{ height: '100vh' }}>Section 2</section>
      </main>
    </ReactLenis>
  )
}

export default App`,
  },
  vue: {
    lang: "vue",
    base: `<!-- App.vue -->
<script setup>
import { VueLenis } from 'lenis/vue'
import 'lenis/dist/lenis.css'
</script>

<template>
  <VueLenis root :options="{ autoRaf: true }">
    <main>
      <section style="height: 100vh">Section 1</section>
      <section style="height: 100vh">Section 2</section>
      <section style="height: 100vh">Section 3</section>
    </main>
  </VueLenis>
</template>`,
    gsap: `<!-- Composable for GSAP integration -->
<script setup>
import { onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

onMounted(() => {
  // Lenis integration requires accessing the VueLenis instance
  gsap.ticker.lagSmoothing(0)
})

onUnmounted(() => {
  ScrollTrigger.getAll().forEach(t => t.kill())
})
</script>`,
  },
  nextjs: {
    lang: "tsx",
    base: `// app/layout.tsx (App Router)
import { ReactLenis } from 'lenis/react'
import 'lenis/dist/lenis.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ReactLenis root options={{ autoRaf: true }}>
          {children}
        </ReactLenis>
      </body>
    </html>
  )
}`,
    gsap: `// hooks/useGsapLenis.ts (client component)
'use client'

import { useEffect } from 'react'
import { useLenis } from 'lenis/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useGsapLenis() {
  useLenis(ScrollTrigger.update)

  useEffect(() => {
    gsap.ticker.lagSmoothing(0)
    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [])
}

// Usage in a component:
// 'use client'
// import { useGsapLenis } from '@/hooks/useGsapLenis'
// function AnimatedSection() {
//   useGsapLenis()
//   return <section>...</section>
// }`,
  },
};

// ─────────────────────────────────────────────────
// Known Limitations
// ─────────────────────────────────────────────────

export const KNOWN_LIMITATIONS: Limitation[] = [
  {
    title: "Safari 60fps Cap",
    description: "Safari (WebKit) is capped at 60fps due to a WebKit limitation. On low power mode, it drops to 30fps. This is a browser-level restriction, not a Lenis bug.",
    keywords: ["safari", "60fps", "30fps", "fps", "framerate", "webkit", "low power"],
    workaround: `// Adjust lerp for Safari to compensate for lower fps
const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
const lenis = new Lenis({
  autoRaf: true,
  lerp: isSafari ? 0.15 : 0.1,
});`,
  },
  {
    title: "No Scroll Over Iframes",
    description: "Smooth scrolling stops working over iframes because they don't forward wheel events to the parent page.",
    keywords: ["iframe", "embed", "youtube", "video", "map"],
    workaround: `// Add pointer-events: none to iframes during scroll
lenis.on('scroll', () => {
  document.querySelectorAll('iframe').forEach((iframe) => {
    iframe.style.pointerEvents = 'none';
  });
});

// Restore when scrolling stops
// You can use a debounce for this`,
  },
  {
    title: "No CSS scroll-snap Support",
    description: "Lenis does not support native CSS scroll-snap. You must use the lenis/snap package instead.",
    keywords: ["snap", "scroll-snap", "css snap"],
    workaround: `// Use the lenis/snap package
import Lenis from 'lenis'
import Snap from 'lenis/snap'

const lenis = new Lenis({ autoRaf: true })
const snap = new Snap(lenis, {
  // Configure snap points
})`,
  },
  {
    title: "position: fixed Lag on Pre-M1 Macs",
    description: "Elements with position: fixed may lag on macOS Safari in pre-M1 (Intel) Macs. This is a known Safari rendering issue.",
    keywords: ["fixed", "position", "lag", "mac", "intel", "sticky"],
  },
  {
    title: "syncTouch Issues on iOS < 16",
    description: "Touch events may behave unexpectedly when syncTouch is enabled on iOS versions earlier than 16.",
    keywords: ["synctouch", "touch", "ios", "mobile", "iphone"],
    workaround: `// Detect iOS version and disable syncTouch if needed
const iosVersion = parseFloat(
  (navigator.userAgent.match(/OS (\\d+)_(\\d+)/) || [])[1] + '.' +
  (navigator.userAgent.match(/OS (\\d+)_(\\d+)/) || [])[2]
);

const lenis = new Lenis({
  autoRaf: true,
  syncTouch: iosVersion >= 16,
});`,
  },
  {
    title: "Nested Scroll Containers",
    description: "Nested scroll containers (modals, dropdowns, carousels) require proper configuration. Use allowNestedScroll: true or data-lenis-prevent attributes.",
    keywords: ["nested", "modal", "dropdown", "carousel", "overflow", "scroll inside", "inner scroll"],
    workaround: `// Option 1: allow nested scroll automatically (may impact performance)
const lenis = new Lenis({
  autoRaf: true,
  allowNestedScroll: true,
})

// Option 2: use HTML attributes (better performance)
// <div data-lenis-prevent>scrollable content</div>
// <div data-lenis-prevent-wheel>only prevents wheel</div>
// <div data-lenis-prevent-touch>only prevents touch</div>`,
  },
];

// ─────────────────────────────────────────────────
// Troubleshooting Guide
// ─────────────────────────────────────────────────

export const TROUBLESHOOTING_GUIDE: TroubleshootEntry[] = [
  {
    title: "Scroll Not Working",
    keywords: ["not working", "doesn't work", "no scroll", "broken", "stopped"],
    steps: [
      "Verify Lenis is on the latest version (check npm)",
      "Include the recommended CSS: `import 'lenis/dist/lenis.css'`",
      "Test your page scrolls WITHOUT Lenis first",
      "Ensure `autoRaf: true` is set OR you're calling `lenis.raf(time)` manually",
      "Check if `lenis.isStopped` is true — you may have called `stop()` without `start()`",
      "Look at browser console for JavaScript errors",
    ],
    code: `// Check if Lenis is active
console.log('isStopped:', lenis.isStopped)
console.log('isScrolling:', lenis.isScrolling)
console.log('limit:', lenis.limit)  // If 0, the page has no scrollable content`,
  },
  {
    title: "Janky / Choppy Scroll",
    keywords: ["janky", "choppy", "stuttering", "jerky", "laggy", "not smooth", "rough"],
    steps: [
      "If using GSAP, ensure `gsap.ticker.lagSmoothing(0)` is called",
      "Lower the `lerp` value (e.g., 0.05) for smoother motion",
      "Avoid heavy DOM operations during scroll",
      "Use `will-change: transform` on animated elements",
      "Check if `allowNestedScroll` is true — it checks DOM on every scroll event",
      "Profile with browser DevTools Performance tab",
    ],
    code: `// Optimized configuration for smoothness
const lenis = new Lenis({
  autoRaf: true,
  lerp: 0.05,  // Smoother (default is 0.1)
  wheelMultiplier: 0.8,  // Reduce wheel speed
})`,
  },
  {
    title: "GSAP ScrollTrigger Not Syncing",
    keywords: ["scrolltrigger", "gsap", "not syncing", "trigger", "pin", "animation not playing"],
    steps: [
      "Ensure ScrollTrigger.update is connected: `lenis.on('scroll', ScrollTrigger.update)`",
      "Add Lenis raf to GSAP ticker: `gsap.ticker.add((time) => { lenis.raf(time * 1000) })`",
      "Call `gsap.ticker.lagSmoothing(0)`",
      "Do NOT use `autoRaf: true` when using GSAP ticker",
      "Make sure `gsap.registerPlugin(ScrollTrigger)` is called",
      "Try calling `ScrollTrigger.refresh()` after Lenis initializes",
    ],
    code: `// Correct setup:
// Do NOT use autoRaf with GSAP
const lenis = new Lenis()

lenis.on('scroll', ScrollTrigger.update)

gsap.ticker.add((time) => {
  lenis.raf(time * 1000)
})

gsap.ticker.lagSmoothing(0)

// After setup, refresh ScrollTrigger
ScrollTrigger.refresh()`,
  },
  {
    title: "Anchor Links Not Working",
    keywords: ["anchor", "hash", "#", "link", "jump", "href"],
    steps: [
      "Set `anchors: true` in Lenis options",
      "You can pass ScrollToOptions for offset and onComplete callbacks",
      "Lenis prevents default anchor behavior during smooth scroll by design",
    ],
    code: `const lenis = new Lenis({
  autoRaf: true,
  anchors: true,  // Enable navigation via anchor links
})

// With custom options
const lenis2 = new Lenis({
  autoRaf: true,
  anchors: {
    offset: 100,  // Top offset in pixels
    onComplete: () => {
      console.log('Navigated to anchor')
    },
  },
})`,
  },
  {
    title: "React/Next.js Integration Issues",
    keywords: ["react", "nextjs", "next.js", "useeffect", "hydration", "ssr"],
    steps: [
      "Use the official `lenis/react` package with `ReactLenis` component",
      "Wrap your layout with `<ReactLenis root>`",
      "Use the `useLenis` hook to access the Lenis instance",
      "In Next.js App Router, ensure Lenis is in a client component or layout",
      "For GSAP integration, create a custom hook with `useLenis` and `useEffect`",
    ],
    code: `// Next.js App Router — app/layout.tsx
import { ReactLenis } from 'lenis/react'
import 'lenis/dist/lenis.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ReactLenis root options={{ autoRaf: true }}>
          {children}
        </ReactLenis>
      </body>
    </html>
  )
}`,
  },
];

// ─────────────────────────────────────────────────
// Nested Scroll Guide
// ─────────────────────────────────────────────────

export const NESTED_SCROLL_GUIDE = `### Option 1: allowNestedScroll (simple but may affect performance)

\`\`\`typescript
const lenis = new Lenis({
  autoRaf: true,
  allowNestedScroll: true,
})
\`\`\`

This automatically detects nested scrollable elements. However, it checks the DOM tree on every scroll event, which can cause performance issues.

### Option 2: HTML attributes (recommended for performance)

\`\`\`html
<!-- Prevenir Lenis em um elemento específico -->
<div data-lenis-prevent>scrollable content</div>

<!-- Prevenir apenas wheel events -->
<div data-lenis-prevent-wheel>scrollable via wheel</div>

<!-- Prevenir apenas touch events -->
<div data-lenis-prevent-touch>scrollable via touch</div>

<!-- Prevenir direções específicas -->
<div data-lenis-prevent-vertical>only vertical prevented</div>
<div data-lenis-prevent-horizontal>only horizontal prevented</div>
\`\`\`

### Option 3: JavaScript prevent function

\`\`\`typescript
const lenis = new Lenis({
  autoRaf: true,
  prevent: (node) => {
    return node.id === 'modal' || node.classList.contains('dropdown-menu')
  },
})
\`\`\``;

// ─────────────────────────────────────────────────
// Anchor Links Guide
// ─────────────────────────────────────────────────

export const ANCHOR_LINKS_GUIDE = `By default, Lenis prevents anchor links from working while scrolling. Enable them:

\`\`\`typescript
// Basic
new Lenis({ autoRaf: true, anchors: true })

// With options
new Lenis({
  autoRaf: true,
  anchors: {
    offset: 100,
    onComplete: () => console.log('arrived at anchor'),
  },
})
\`\`\`

Or scroll programmatically:

\`\`\`typescript
lenis.scrollTo('#section-id', {
  offset: -80,  // Compensate for fixed header
  duration: 1.5,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
})
\`\`\``;

// ─────────────────────────────────────────────────
// Scroll Patterns
// ─────────────────────────────────────────────────

export const SCROLL_PATTERNS: Record<string, ScrollPattern> = {
  parallax: {
    title: "Parallax Effect",
    description: "Create depth with elements moving at different speeds on scroll.",
    html: `<section class="parallax-section">
  <div class="parallax-bg" data-speed="0.5">
    <img src="background.jpg" alt="Background" />
  </div>
  <div class="parallax-content" data-speed="1">
    <h1>Parallax Title</h1>
  </div>
  <div class="parallax-foreground" data-speed="1.5">
    <p>Foreground content</p>
  </div>
</section>`,
    css: `.parallax-section {
  position: relative;
  height: 100vh;
  overflow: hidden;
}

.parallax-bg,
.parallax-content,
.parallax-foreground {
  position: absolute;
  width: 100%;
  will-change: transform;
}

.parallax-bg img {
  width: 100%;
  height: 120%;
  object-fit: cover;
}`,
    js: `import Lenis from 'lenis'
import 'lenis/dist/lenis.css'

const lenis = new Lenis({ autoRaf: true })

// Simple parallax based on scroll position
lenis.on('scroll', ({ scroll }) => {
  document.querySelectorAll('[data-speed]').forEach((el) => {
    const speed = parseFloat(el.dataset.speed || '1')
    const offset = scroll * (1 - speed)
    el.style.transform = \`translateY(\${offset}px)\`
  })
})`,
    jsGsap: `import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import 'lenis/dist/lenis.css'

gsap.registerPlugin(ScrollTrigger)

const lenis = new Lenis()

lenis.on('scroll', ScrollTrigger.update)
gsap.ticker.add((time) => { lenis.raf(time * 1000) })
gsap.ticker.lagSmoothing(0)

// Parallax with GSAP ScrollTrigger
document.querySelectorAll('[data-speed]').forEach((el) => {
  const speed = parseFloat(el.dataset.speed || '1')

  gsap.to(el, {
    y: () => (1 - speed) * ScrollTrigger.maxScroll(window),
    ease: 'none',
    scrollTrigger: {
      trigger: el.closest('section'),
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
      invalidateOnRefresh: true,
    },
  })
})`,
    notes: "- Use `will-change: transform` for performance\n- Avoid parallax on too many elements simultaneously\n- On mobile, consider reducing or disabling the effect",
  },
  "infinite-scroll": {
    title: "Infinite Scroll",
    description: "Seamless looping content that repeats infinitely.",
    html: `<div class="infinite-wrapper">
  <div class="infinite-content">
    <!-- Content that repeats -->
    <div class="item">Item 1</div>
    <div class="item">Item 2</div>
    <div class="item">Item 3</div>
  </div>
</div>`,
    css: `.infinite-wrapper {
  overflow: hidden;
}

.item {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
}`,
    js: `import Lenis from 'lenis'
import 'lenis/dist/lenis.css'

const lenis = new Lenis({
  autoRaf: true,
  infinite: true,  // Enable infinite scrolling
})

lenis.on('scroll', ({ scroll, limit, progress }) => {
  console.log(\`Progress: \${(progress * 100).toFixed(1)}%\`)
})`,
    jsGsap: `import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import 'lenis/dist/lenis.css'

gsap.registerPlugin(ScrollTrigger)

const lenis = new Lenis({ infinite: true })

lenis.on('scroll', ScrollTrigger.update)
gsap.ticker.add((time) => { lenis.raf(time * 1000) })
gsap.ticker.lagSmoothing(0)`,
    notes: "- `infinite: true` is not compatible with `syncTouch: true`\n- Progress goes from 0 to 1 and back to 0 continuously\n- Ideal for portfolios and creative showcases",
  },
  snap: {
    title: "Snap Scroll",
    description: "Section-by-section snapping with smooth transitions.",
    html: `<div class="snap-container">
  <section class="snap-section" id="section-1">Section 1</section>
  <section class="snap-section" id="section-2">Section 2</section>
  <section class="snap-section" id="section-3">Section 3</section>
</div>`,
    css: `.snap-section {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
}`,
    js: `import Lenis from 'lenis'
import Snap from 'lenis/snap'
import 'lenis/dist/lenis.css'

const lenis = new Lenis({ autoRaf: true })

// Create snap for each section
const snap = new Snap(lenis, {
  // Snap options
})`,
    notes: "- Do NOT use CSS `scroll-snap` — use the `lenis/snap` package\n- Install separately: `npm i lenis/snap`\n- Compatible with GSAP ScrollTrigger",
  },
  horizontal: {
    title: "Horizontal Scroll",
    description: "Transform vertical wheel input into horizontal scroll movement.",
    html: `<div class="horizontal-wrapper">
  <div class="horizontal-container">
    <section class="panel">Panel 1</section>
    <section class="panel">Panel 2</section>
    <section class="panel">Panel 3</section>
    <section class="panel">Panel 4</section>
  </div>
</div>`,
    css: `.horizontal-wrapper {
  overflow: hidden;
}

.horizontal-container {
  display: flex;
  width: fit-content;
}

.panel {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  flex-shrink: 0;
}`,
    js: `import Lenis from 'lenis'
import 'lenis/dist/lenis.css'

// Option 1: Pure Lenis horizontal scroll
const lenis = new Lenis({
  autoRaf: true,
  orientation: 'horizontal',
  gestureOrientation: 'both', // Accept both horizontal and vertical gestures
  wrapper: document.querySelector('.horizontal-wrapper'),
  content: document.querySelector('.horizontal-container'),
})`,
    jsGsap: `import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import 'lenis/dist/lenis.css'

gsap.registerPlugin(ScrollTrigger)

const lenis = new Lenis()

lenis.on('scroll', ScrollTrigger.update)
gsap.ticker.add((time) => { lenis.raf(time * 1000) })
gsap.ticker.lagSmoothing(0)

// Option 2: Vertical scroll that moves horizontally with GSAP
const container = document.querySelector('.horizontal-container')
const panels = gsap.utils.toArray('.panel')

gsap.to(panels, {
  xPercent: -100 * (panels.length - 1),
  ease: 'none',
  scrollTrigger: {
    trigger: '.horizontal-wrapper',
    pin: true,
    scrub: 1,
    snap: 1 / (panels.length - 1),
    end: () => '+=' + container.offsetWidth,
  },
})`,
    notes: "- The GSAP approach (vertical scroll → horizontal movement) is more accessible\n- Pure Lenis horizontal requires explicit `wrapper` and `content`\n- Use `gestureOrientation: 'both'` to accept gestures in both directions",
  },
  "webgl-sync": {
    title: "WebGL Scroll Sync",
    description: "Synchronize Lenis scroll position with WebGL/Three.js camera or scene position.",
    js: `import Lenis from 'lenis'
import 'lenis/dist/lenis.css'

const lenis = new Lenis({ autoRaf: true })

// Shared variables with the WebGL render loop
let scrollProgress = 0
let scrollVelocity = 0

lenis.on('scroll', ({ progress, velocity }) => {
  scrollProgress = progress
  scrollVelocity = velocity
})

// In the Three.js / WebGL render loop:
function render() {
  // Use scrollProgress to move the camera
  camera.position.y = scrollProgress * totalSceneHeight

  // Use scrollVelocity for motion blur, distortion, etc.
  material.uniforms.uVelocity.value = scrollVelocity

  renderer.render(scene, camera)
  requestAnimationFrame(render)
}
requestAnimationFrame(render)`,
    jsGsap: `import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import 'lenis/dist/lenis.css'

gsap.registerPlugin(ScrollTrigger)

const lenis = new Lenis()

lenis.on('scroll', ScrollTrigger.update)
gsap.ticker.add((time) => { lenis.raf(time * 1000) })
gsap.ticker.lagSmoothing(0)

// Synchronize WebGL camera with scroll via ScrollTrigger
ScrollTrigger.create({
  trigger: document.body,
  start: 'top top',
  end: 'bottom bottom',
  scrub: true,
  onUpdate: (self) => {
    // self.progress goes from 0 to 1
    camera.position.y = self.progress * totalSceneHeight

    // Velocity for visual effects
    material.uniforms.uVelocity.value = self.getVelocity() / 1000
  },
})`,
    notes: "- Lenis provides `progress` (0-1) and `velocity` — perfect for syncing with WebGL\n- Use velocity for motion blur, mesh distortion, etc.\n- For performance, keep the WebGL render loop separate from the scroll handler",
  },
  "scroll-triggered": {
    title: "Scroll-Triggered Animations",
    description: "Trigger CSS animations or GSAP tweens when elements enter the viewport.",
    html: `<section class="reveal-section">
  <h2 class="reveal-element">Animated Title</h2>
  <p class="reveal-element">This fades in on scroll</p>
  <div class="reveal-element stagger-children">
    <div class="card">Card 1</div>
    <div class="card">Card 2</div>
    <div class="card">Card 3</div>
  </div>
</section>`,
    css: `.reveal-element {
  opacity: 0;
  transform: translateY(60px);
  transition: opacity 0.8s ease, transform 0.8s ease;
  will-change: opacity, transform;
}

.reveal-element.is-visible {
  opacity: 1;
  transform: translateY(0);
}`,
    js: `import Lenis from 'lenis'
import 'lenis/dist/lenis.css'

const lenis = new Lenis({ autoRaf: true })

// IntersectionObserver para reveal on scroll
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target) // Animate only once
      }
    })
  },
  { threshold: 0.1 }
)

document.querySelectorAll('.reveal-element').forEach((el) => {
  observer.observe(el)
})`,
    jsGsap: `import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import 'lenis/dist/lenis.css'

gsap.registerPlugin(ScrollTrigger)

const lenis = new Lenis()

lenis.on('scroll', ScrollTrigger.update)
gsap.ticker.add((time) => { lenis.raf(time * 1000) })
gsap.ticker.lagSmoothing(0)

// Individual reveal with GSAP
gsap.utils.toArray('.reveal-element').forEach((el) => {
  gsap.from(el, {
    y: 60,
    opacity: 0,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: el,
      start: 'top 80%',
      toggleActions: 'play none none none',
    },
  })
})

// Stagger para children
gsap.from('.stagger-children .card', {
  y: 40,
  opacity: 0,
  duration: 0.8,
  stagger: 0.15,
  ease: 'power2.out',
  scrollTrigger: {
    trigger: '.stagger-children',
    start: 'top 75%',
  },
})`,
    notes: "- Without GSAP: use IntersectionObserver + CSS transitions (lighter)\n- With GSAP: use ScrollTrigger for precise timing control\n- Use `will-change: transform, opacity` for GPU performance",
  },
};

// ─────────────────────────────────────────────────
// Performance Tips
// ─────────────────────────────────────────────────

export const PERFORMANCE_TIPS: Record<string, PerformanceTip[]> = {
  core: [
    {
      title: "Use autoRaf: true for simple setups",
      description: "Unless you need a custom animation loop or GSAP integration, `autoRaf: true` is the simplest and most efficient option.",
      code: `const lenis = new Lenis({ autoRaf: true })`,
    },
    {
      title: "Tune your lerp value",
      description: "The default `lerp: 0.1` is a good balance. Lower values (0.05) are smoother but slower. Higher values (0.15) are snappier. Find the sweet spot for your project.",
      code: `const lenis = new Lenis({
  autoRaf: true,
  lerp: 0.08, // Slightly smoother than default
})`,
    },
    {
      title: "Avoid heavy scroll event handlers",
      description: "The `scroll` event fires on every frame. Keep handlers lightweight. Avoid DOM queries or layout thrashing inside scroll handlers.",
      code: `// ❌ Bad: DOM query on every frame
lenis.on('scroll', () => {
  document.querySelectorAll('.items').forEach(el => {
    el.style.opacity = '...'
  })
})

// ✅ Good: cache elements
const items = document.querySelectorAll('.items')
lenis.on('scroll', ({ progress }) => {
  items.forEach(el => {
    (el as HTMLElement).style.opacity = String(progress)
  })
})`,
    },
    {
      title: "Use will-change sparingly",
      description: "Add `will-change: transform` only to elements that will be animated. Too many will-change declarations consume GPU memory.",
    },
  ],
  gsap: [
    {
      title: "Always disable lag smoothing",
      description: "GSAP's lag smoothing can conflict with Lenis. Always call `gsap.ticker.lagSmoothing(0)` when using both together.",
      code: `gsap.ticker.lagSmoothing(0)`,
    },
    {
      title: "Don't mix autoRaf with GSAP ticker",
      description: "When using GSAP's ticker to drive Lenis, set `autoRaf: false` (or omit it, since false is the default). Having two RAF loops causes double updates.",
      code: `// ✅ Correct: GSAP controls the loop
const lenis = new Lenis() // autoRaf is false by default
gsap.ticker.add((time) => { lenis.raf(time * 1000) })

// ❌ Wrong: two animation loops
const lenis = new Lenis({ autoRaf: true })
gsap.ticker.add((time) => { lenis.raf(time * 1000) }) // Duplicated!`,
    },
    {
      title: "Use scrub for scroll-linked animations",
      description: "For animations linked to scroll position, use `scrub: true` in ScrollTrigger instead of timeline-based animations.",
      code: `gsap.to('.element', {
  y: -100,
  scrollTrigger: {
    trigger: '.element',
    scrub: true,  // Linked to scroll, no separate timeline
    start: 'top bottom',
    end: 'bottom top',
  },
})`,
    },
  ],
  heavyContent: [
    {
      title: "Lazy load images with scroll awareness",
      description: "Use IntersectionObserver to load images as they approach the viewport. Combine with Lenis scroll events for preloading.",
      code: `const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement
        img.src = img.dataset.src || ''
        observer.unobserve(img)
      }
    })
  },
  { rootMargin: '200px' }  // Preload 200px before appearing
)

document.querySelectorAll('img[data-src]').forEach(img => observer.observe(img))`,
    },
    {
      title: "Avoid animating many elements simultaneously",
      description: "Limit the number of elements being transformed on each scroll frame. Group elements and animate containers instead of individual items.",
    },
    {
      title: "Use CSS containment",
      description: "Add `contain: layout style paint` to sections that don't affect the rest of the page. This helps the browser optimize rendering.",
      code: `.section {
  contain: layout style paint;
}`,
    },
  ],
  mobile: [
    {
      title: "Consider disabling smooth scroll on mobile",
      description: "Native touch scrolling is often smoother than virtual smooth scroll. Consider disabling Lenis on mobile or using lighter settings.",
      code: `const isMobile = /Android|webOS|iPhone|iPad|iPod/i.test(navigator.userAgent)

const lenis = new Lenis({
  autoRaf: true,
  smoothWheel: !isMobile,  // Disable smooth wheel on mobile
  // Or use syncTouch to control touch scroll
  syncTouch: false,
})`,
    },
    {
      title: "Use syncTouch carefully",
      description: "syncTouch adds lerp-based smoothing to touch events. It can feel great but may cause issues on older iOS versions (< 16).",
      code: `const lenis = new Lenis({
  autoRaf: true,
  syncTouch: true,
  syncTouchLerp: 0.075,  // Adjust for desired feel
  touchInertiaExponent: 1.7,
})`,
    },
    {
      title: "Reduce animations on low-end devices",
      description: "Use `matchMedia` or the `prefers-reduced-motion` media query to disable or simplify animations.",
      code: `const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

const lenis = new Lenis({
  autoRaf: true,
  lerp: prefersReducedMotion ? 1 : 0.1,  // Instant scroll if reduced-motion
})`,
    },
  ],
};
