# Agent Design Invariants & Anti-Vibecoding Directive (design.md)
**Document Purpose**: Universal AI Agent Operating Contract for Frontend Design & Implementation  
**Audience**: Antigravity & all pair-programming coding agents  
**Status**: Permanent Invariant — Overrides default AI code-generation tendencies

---

## 1. Prime Directive: Eradicating the "Vibecoded" Look

When tasked with generating or modifying user interfaces, standard LLM outputs default to **"vibecoding"**—a recognizable, cookie-cutter aesthetic characterized by neon glow borders, arbitrary status chips, faux-futuristic numbering, and hurried animations.

### 🚫 The 8 Hard Prohibitions for You

Whenever you are writing JSX, CSS, Tailwind classes, or animations, you must treat these as absolute prohibitions:

1. **NO "Soon", "Beta", or Status Badges Glued Everywhere**:
   - *Negative Behavior*: Tacking little pill tags (`Soon`, `Beta`, `New`, `Live`) onto every second menu link, card, or button.
   - *Required Behavior*: Eliminate status clutter. If a destination or tool is upcoming, let the text stand cleanly on its own or route the user to an authoritative, minimalist editorial screen (`Coming soon.`).

2. **NO Arbitrary Index Numbers (`01`, `02`, `03`)**:
   - *Negative Behavior*: Prefixing navigation options or feature cards with `01`, `02`, `03` in a neon or orange color to look "technical" or "cyberpunk".
   - *Required Behavior*: Content hierarchy comes from typography scale, weight, and position—never artificial numeric decorations. Use numbered indices **only** when presenting an inherently ordered sequence (e.g., numbered tutorial phases).

3. **NO Icons Glued to Simple Text Triggers (`+`, `×`, `>`)**:
   - *Negative Behavior*: Putting a plus (`+`) or chevron (`>`) inside every menu button or list item.
   - *Required Behavior*: Pure, confident typography. State is communicated via clean text changes (`Menu` $\leftrightarrow$ `Close`) and subtle opacity or color shifts.

4. **NO Arbitrary Pill / Capsule Enclosures**:
   - *Negative Behavior*: Wrapping every standalone button or toggle in an isolated pill capsule with border outlines.
   - *Required Behavior*: Align elements seamlessly with the baseline and padding of the surrounding layout. Do not enclose buttons in capsules unless they are part of a deliberate segmented control or glass dock.

5. **NO Font Inconsistencies & Decorative Monospace**:
   - *Negative Behavior*: Randomly switching UI section headers, drawer categories, or footer labels to screaming monospace or stylized display fonts.
   - *Required Behavior*: Keep all UI labels, navigation links, section titles, and body copy in the primary interface font (`Montserrat` / `var(--font-sans)`). Reserve monospace **strictly** for actual machine output: code tokens, memory hex addresses, terminal logs, and system hashes.

6. **NO Dividing Lines Beneath Every Option**:
   - *Negative Behavior*: Drawing horizontal lines under every menu item or option, turning a sleek list into a cluttered lined table.
   - *Required Behavior*: Use generous vertical rhythm and negative space for separation. Avoid lines beneath menu options unless building a formal data-dense table.

7. **NO Hurried, Twitchy, or Colliding Animations**:
   - *Negative Behavior*: Running fast, abrupt linear animations ($<0.3\text{s}$) or triggering child animations while parent containers are sliding.
   - *Required Behavior*: Multi-stage cinematic pacing ($0.65\text{s}$–$0.85\text{s}$) with natural exponential deceleration (`power4.out`, `power3.out`). Never animate child coordinate layouts while a parent is actively in motion.

8. **NO Neon Slop & Unrestrained Gradients**:
   - *Negative Behavior*: Generic purple, violet, and magenta glowing drop-shadows and rainbow text fills.
   - *Required Behavior*: Deep, disciplined, warm dark canvases (`#090706`), subtle espresso undertones (`#180e08`–`#5c2912`), warm molten amber (`#f59e0b`), and soft chalk white (`#f5f4f0`).

---

## 2. Core Aesthetic Foundations

### A. Typographic Integrity & Hierarchy
Never mix more than three typographic voices:
1. **Monumental Display (Serif / High-Contrast Display)**:
   - For landmark hero headlines and editorial moments (`Coming soon.`, `The Architecture of Real-World Systems`).
   - Use natural tracking and subtle italics for high-signal words.
2. **Primary Interface Sans (`var(--font-sans)`)**:
   - The workhorse of the interface: navigation, headings, row labels, buttons, and descriptive paragraphs.
   - Geometric, crisp, and high-legibility.
3. **Engine Monospace (`var(--font-mono)`)**:
   - Strictly reserved for code, architectural invariants, git hashes, terminal readouts, and benchmarks.

### B. Spatial Discipline & Negative Space
- **Embrace Whitespace**: High-end software feels spacious and quiet. Low-end templates fill every pixel with boxes, chips, and dividers.
- **Single Focal Accent**: Only allow **one** dominant accent color per viewport or interaction zone (e.g., the high-contrast white liquid band on the hovered menu item). Surrounding elements should be quiet and understated.

### C. Color Architecture
```css
/* Deep Obsidian & Warm Espresso Canvas */
--bg-canvas: #090706;
--bg-surface: #0d0907;
--bg-panel: rgba(13, 9, 7, 0.96);

/* Cascading Staggered Layers */
--prelayer-1: #180e08;
--prelayer-2: #2a150b;
--prelayer-3: #5c2912;
--prelayer-4: #7e3a19;

/* Text & Contrast */
--text-primary: #ffffff;
--text-secondary: rgba(255, 255, 255, 0.7);
--text-muted: rgba(255, 255, 255, 0.4);

/* Accents */
--accent-amber: #f59e0b;
--accent-amber-glow: rgba(245, 158, 11, 0.18);
--accent-contrast-bg: #ffffff;
--accent-contrast-text: #120F17;

/* Architectural Lines */
--border-subtle: rgba(255, 255, 255, 0.08);
--border-hairline: rgba(255, 255, 255, 0.14);
```

---

## 3. Motion Architecture & Technical Safety

When implementing interactive components (e.g. `FlowingMenu`, `StaggeredMenu`), you must follow these technical invariants to avoid freezing and animation collisions:

### 1. The 4-Stage Motion Pipeline
```
[Trigger Click: Menu]
      │
      ├── Stage 1 (0.00s - 0.65s): Multi-layer prelayers cascade (staggered by 0.08s, ease: power4.out)
      │
      ├── Stage 2 (0.24s - 1.04s): Main panel slides in (duration: 0.8s, ease: power4.out)
      │
      ├── Stage 3 (0.39s - 1.10s): FlowingMenu rows glide upward (y: 30 → 0, opacity: 0 → 1, stagger: 0.08s)
      │
      └── Stage 4 (Resting State): Unlock pointer events, execute measure() to snapshot settled coordinates
            │
            └── Interactive Hover: Liquid band sweeps with physical spring physics & marquee scroll
```

### 2. RAF & React StrictMode Safety
- **Always reset handles**: Whenever cancelling an animation frame (`cancelAnimationFrame(loop.raf)`), **always** set `loop.raf = 0`.
- Failing to reset `loop.raf = 0` causes the animation engine to permanently deadlock in React StrictMode and Next.js hot-reloads.

### 3. Decouple Layout Math from Moving Containers
- Never run `getBoundingClientRect()` while a parent container is actively translating with GSAP (`xPercent` / `yPercent`).
- Compute coordinates either:
  a) Upon reaching resting state (`onComplete`).
  b) Relative to the parent list (`itemRect.top - listRect.top`), not window coordinates.
  c) On `pointerenter` of the row directly as an instant fallback.

---

## 4. Agent Self-Verification Checklist

Before presenting any code, UI revision, or component to the user, run your proposed output through this mental filter:

- [ ] **Badge Check**: Did I add a `Soon`, `Beta`, or status chip? If yes, **delete it**.
- [ ] **Numbering Check**: Did I add `01`, `02`, `03` prefixes to menu items or cards? If yes, **delete them**.
- [ ] **Icon / Capsule Check**: Did I put `+`, `×`, or `>` icons on plain buttons, or enclose the trigger in an unnecessary capsule? If yes, **strip to pure typography**.
- [ ] **Divider Check**: Are there horizontal lines beneath every menu option? If yes, **remove them (`dividers={false}`)**.
- [ ] **Font Check**: Are all headings, categories, and footers in the primary interface font (`Montserrat` / `var(--font-sans)`)?
- [ ] **Animation Pacing**: Does the entrance transition feel luxurious ($0.65\text{s}$–$0.85\text{s}$) with proper deceleration curves?
- [ ] **Collision Check**: Are multiple animations firing at the exact same instant on the same node? If yes, **stagger and orchestrate them**.
- [ ] **Color Check**: Is the palette restrained to warm obsidian, espresso, amber, and crisp white without neon purple/magenta slop?
