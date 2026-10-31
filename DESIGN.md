# DevForge Design System & Anti-Vibecoding Specification
**Version**: 1.0.0  
**Status**: Living Architecture Contract & Agent Invariant  
**Applies To**: `devforge-platform` UI/UX, components, motion profiles, and AI generation behavior.

---

## 1. The Anti-Vibecoding Manifesto

"Vibecoding" refers to the generic, hyperactive, superficial AI-templated aesthetic that plagues modern AI-generated frontend code. It relies on cliché visual tropes that simulate complexity or "futurism" without thoughtful typographic hierarchy, functional intent, or design restraint.

### 🚫 The 7 Deadly Sins of Vibecoding (Strictly Prohibited)

| Vibecoded Anti-Pattern | Why It Fails | DevForge Enforcement Rule |
| :--- | :--- | :--- |
| **1. Soon / Beta Badges Everywhere** | Clutters the interface with cheap status chips glued to links, buttons, and titles. Destroys minimalism. | **NEVER** slap floating status badges or chips on navigation items. If a feature is in development, handle it through a refined editorial destination view or clean notification. |
| **2. Faux-Futuristic Index Numbering (`01`, `02`, `03`)** | Pretentious decoration that adds visual noise and competes with actual content. | **DO NOT** prefix list items, nav items, or cards with `01`, `02`, `03` unless it is a numbered sequence (e.g. numbered tutorial steps). |
| **3. Chevrons (`>`) and Icons Glued to Text Buttons** | Redundant indicators (`>`, `↗`, `+`, `×`) inside capsule buttons that clutter the layout. | Pure typography. Allow state to be conveyed by clean label transitions (`Menu` $\leftrightarrow$ `Close`) and subtle opacity changes. Zero capsule outlines, zero icons on standard triggers. |
| **4. Font Mismatches & Monospace Abuse** | Switching to loud, screaming monospace or neon cyberpunk fonts for random UI headers, categories, or footers. | Use the primary font (`Montserrat` / `var(--font-sans)`) for UI headings, titles, and ecosystem labels. Monospace (`var(--font-mono)`) is reserved **strictly** for terminal outputs, memory addresses, git hashes, and code symbols. |
| **5. Cluttered Fake Complexity** | Packing cards or drawers with dummy technical metadata (`PYTHON 3.12 ↗`, `TEST ASSERTIONS`) before the feature exists. | Practice quiet editorial confidence. Use a clean, spacious layout (e.g., the Rector serif "Coming *soon.*" view) rather than fabricating fake feature rows. |
| **6. Hyperactive & Colliding Animations** | Linear, twitchy, hurried transitions ($<0.3\text{s}$) or stacking competing animations (e.g. drawer sliding while child keyframes fire and layout metrics distort). | Orchestrated, multi-layer motion with physical deceleration (`power4.out`, `power3.out`). Never run conflicting transforms simultaneously. Always separate entrance choreography from interactive hover states. |
| **7. Neon Slop & Unrestrained Gradients** | Generic purple/magenta glowing boxes, rainbow gradients on every text element, and neon glow halos. | Strict, disciplined warm obsidian palette (`#090706`), deep espresso undertones (`#180e08`–`#5c2912`), warm molten amber (`#f59e0b`), and soft chalk white (`#f5f4f0`). |

---

## 2. Core DevForge Design Principles

### Principle I: Editorial Restraint & Quiet Confidence
DevForge is engineered for serious systems builders, compiler designers, and distributed infrastructure engineers. It communicates authority through whitespace, precise alignment, and typography—never through decorative gimmicks.
- If an element does not provide functional utility or intentional semantic grounding, delete it.
- Never compensate for empty space by adding meaningless borders, capsules, or status pills.

### Principle II: Typographic Hierarchy
The project uses three distinct typographic roles:
1. **Editorial Display (`Rector` / Display Serif)**:
   - Reserved for monumental headlines and editorial moments (`Coming soon.`, `The Architecture of Real-World Systems`).
   - Characterized by high contrast, elegant italics, and natural tracking.
2. **Primary Interface Sans (`Montserrat` / `var(--font-sans)`)**:
   - The primary voice of DevForge.
   - Used for navigation labels, section headings, titles, ecosystem links, and body copy.
   - Clean, geometric, legible across all viewport scales.
3. **Engine Monospace (`JetBrains Mono` / `Geist Mono` / `var(--font-mono)`)**:
   - **Exclusive domain**: Code snippets, system architecture invariants, memory layouts, terminal outputs, and performance microbenchmarks.
   - Never used as a decorative substitute for standard UI headers.

### Principle III: Color Tokens & Light Discipline

```css
:root {
  /* Canvas & Obsidian Surfaces */
  --df-bg-canvas: #090706;
  --df-bg-surface: #0d0907;
  --df-bg-panel: rgba(13, 9, 7, 0.96);

  /* Cascading Prelayer Warmth (Staggered Drawer) */
  --df-prelayer-1: #180e08;
  --df-prelayer-2: #2a150b;
  --df-prelayer-3: #5c2912;
  --df-prelayer-4: #7e3a19;

  /* Typography & Foreground */
  --df-text-primary: #ffffff;
  --df-text-secondary: rgba(255, 255, 255, 0.7);
  --df-text-muted: rgba(255, 255, 255, 0.4);

  /* Molten Amber Accent (High-Signal Focal Point) */
  --df-accent-amber: #f59e0b;
  --df-accent-amber-glow: rgba(245, 158, 11, 0.18);
  --df-accent-dark: #090706;

  /* Architectural Hairlines */
  --df-border-subtle: rgba(255, 255, 255, 0.08);
  --df-border-divider: rgba(255, 255, 255, 0.14);
}
```

- **Rule of One Accent**: Only one dominant accent color is permitted per active interaction zone (e.g., the liquid amber hover band on the active row).
- **Hairline Dividers**: Lines between list items must be subtle hairlines (`rgba(255, 255, 255, 0.14)`), never heavy borders.

---

## 3. Motion Architecture & Collision Prevention

To prevent animation collision and the twitchy feel of vibecoded templates, all complex interactive components adhere to a strict motion protocol:

```
[Trigger Click: Menu]
      │
      ├── Phase 1 (0.00s - 0.65s): Multi-layer prelayers cascade (staggered by 0.08s, ease: power4.out)
      │
      ├── Phase 2 (0.24s - 1.04s): Main panel slides in (duration: 0.8s, ease: power4.out)
      │
      ├── Phase 3 (0.39s - 1.10s): FlowingMenu rows glide upward (y: 30 → 0, opacity: 0 → 1, stagger: 0.08s)
      │
      └── Phase 4 (Completion): Lock pointer events, call measure() to capture settled layout coordinates
            │
            └── Interactive Hover State: Liquid band glides with physical spring easing & marquee scroll
```

### Motion Invariants
1. **Never calculate element bounds (`getBoundingClientRect()`) during an active GSAP slide**:
   - Layout measurements taken while a panel is translating with `xPercent` yield distorted or shifting positions.
   - Measurements must be taken on mount (if visible), when the drawer reaches resting state (`onComplete`), or dynamically inside `pointerenter` via relative math (`itemRect.top - listRect.top`).
2. **StrictMode RAF Safety**:
   - Animation engines that utilize `requestAnimationFrame` must reset their tracking handle (`loop.raf = 0`) upon cancellation. Leaving a stale positive integer permanently deadlocks the render loop.
3. **Pacing and Timing**:
   - Standard drawer entrances must take `0.65s` to `0.85s` using exponential deceleration curves (`power4.out`). Rapid transitions ($<0.35\text{s}$) destroy the sense of weight and physical prestige.

---

## 4. Component Standards

### A. Navigation Bar & Menu Trigger
- **No Pill Capsule**: The menu trigger button (`Menu` / `Close`) must never be wrapped in a pill, capsule border, or glowing box.
- **No Icon Clutter**: Do not attach `+`, `×`, `☰`, or chevron icons to the menu toggle.
- **Alignment**: Vertically centered and horizontally aligned with the floating navbar container (`px-6 sm:px-12 lg:px-20 py-6`).
- **Typography**: Clean Montserrat medium font (`13.5px`, `font-medium`, `tracking-[0.02em]`).

### B. Navigation Drawer
- **Menu Hierarchy**: Exactly 3 core destinations in the main drawer:
  1. `Courses` $\rightarrow$ Triggers the minimalist editorial curriculum view.
  2. `The Forge` $\rightarrow$ Deep-links to `#meet-devforge` (Philosophy and Foundation).
  3. `Architecture` $\rightarrow$ Clean toast notice for the upcoming system topology explorer.
- **Flowing Hover Effect**:
  - Background band: Molten Amber (`#f59e0b`).
  - Marquee text: Jet Black (`#090706`), bold Montserrat.
  - Image thumbnail: Monochrome pill (`imageShape="pill"`).
  - Dividers: Subtle white hairlines between items.
- **Social / Ecosystem Footer**:
  - Title: `DevForge Ecosystem` in primary Montserrat sans (`uppercase`, `tracking-widest`, `text-xs`).
  - Links: `GitHub`, `Philosophy`, `Terms` with clean hover dimming across peers.

### C. Curriculum & In-Progress Subviews
- **No Cluttered Catalogs**: Do not render fake module tables with dummy languages, progress bars, or tags before the real curricula are ready.
- **Minimalist Aesthetic**:
  - Small uppercase mono kicker: `Curriculum` in muted amber.
  - Monumental editorial title: `Coming soon.` (Rector display).
  - Clear, focused narrative on distributed consensus, compiler architecture, and kernel internals.
  - Return affordance: Subtle `← Back to Menu` button.

---

## 5. Agent Verification Checklist

Before committing any UI change or proposing frontend code, verify against this checklist:

- [ ] Does any element have a decorative `Soon`, `Beta`, or status badge attached? *(If yes, remove it)*.
- [ ] Are list items or menu rows prefixed with artificial numbers (`01`, `02`)? *(If yes, remove them)*.
- [ ] Are buttons or links wrapped in gratuitous pill capsules with plus/chevron icons? *(If yes, strip to pure typography)*.
- [ ] Are non-code headers using monospace or loud neon styling? *(If yes, align with `var(--font-sans)`)*.
- [ ] Is an animation running under `0.35s` or colliding with another simultaneous transform? *(If yes, orchestrate with staggered easing)*.
- [ ] Are layout measurements safely decoupled from moving parent containers? *(If yes, verify relative coordinates)*.
- [ ] Does the color scheme adhere to the obsidian/espresso/amber foundation without random purple/magenta gradients? *(If yes, approve)*.
