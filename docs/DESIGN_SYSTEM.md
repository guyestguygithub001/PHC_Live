# DESIGN_SYSTEM.md — The UI/UX Visual Language

> **The UX Paradox:** The average PHC worker is intimidated by new technology and "perplexed" by complex software. However, the solution is *not* to build a system that looks old or rudimentary. The solution is to build a system with a **Premium, Modern Aesthetic** wrapped around **Familiar Structural Patterns** (Skeuomorphism).

---

## 1. Visual Philosophy

1. **Familiarity (The Skeleton):** The layout mimics the physical artifacts the staff already use. The patient history looks like a physical folder. The registration screen looks like a logbook. We do not reinvent how they view data; we just upgrade the medium.
2. **Premium Fluidity (The Skin):** The UI uses modern web design aesthetics—soft shadows, glassmorphism, dynamic micro-animations, and vibrant but clinical colors. It must "WOW" the user and feel highly responsive. 
3. **Core Styling Engine: Tailwind CSS v3**
While we initially considered Vanilla CSS, we are shifting to **Tailwind CSS v3 (Stable)** to rapidly construct the UI and enforce a strict design system without writing thousands of lines of custom CSS.
* **Utility-First Speed:** Allows for rapid iteration of the massive oversized touch targets and flexbox layouts.
* **Custom Configuration:** We will extend the `tailwind.config.js` to include our exact clinical color palette (avoiding generic Tailwind blues/greens).
* **Glassmorphism Utility:** We will create a custom Tailwind utility class (e.g., `.bg-glass`) combining `bg-opacity`, `backdrop-blur`, and `border-white/20` to instantly apply our premium aesthetic across the app.

---

## 2. Color Palette & Psychology

The colors are chosen to evoke clinical cleanliness, trust, and clear urgency without causing visual fatigue during a 12-hour shift.

### Primary Colors (Trust & Action)
* `--color-primary-500: #0ea5e9;` (Vibrant Ocean Blue - for primary actions, buttons, and active states)
* `--color-primary-600: #0284c7;` (Deep Ocean - for hover states)
* `--color-surface: #ffffff;` (Pure White - for cards and folders)
* `--color-background: #f8fafc;` (Soft Slate - for the app background, reducing eye strain)

### Semantic Colors (Urgency & Status)
* `--color-danger: #ef4444;` (Soft Red - for hypertensive vitals, errors, critical alerts)
* `--color-success: #22c55e;` (Clinical Green - for completed labs, saved drafts)
* `--color-warning: #f59e0b;` (Amber - for pending labs, low inventory)

### Dark Mode (For Night Shifts)
* Night shifts in rural PHCs are often lit by flashlights or dim solar bulbs. A blazing white screen destroys night vision.
* `--color-bg-dark: #0f172a;` (Deep Space Blue)
* `--color-surface-dark: #1e293b;` (Slate Dark)

---

## 3. Typography

Browser default fonts feel cheap and "old". We will use premium, highly legible Google Fonts tailored for dense data.
* **Primary Font:** `Inter` or `Outfit` (Clean, geometric, highly readable on cheap tablet screens).
* **Monospace Font (For Vitals/Data):** `JetBrains Mono` or `Roboto Mono` (Ensures that numbers like `120/80` line up perfectly in tables).

### Hierarchy Tokens
* `--font-size-h1: 2.5rem;` (Patient Names)
* `--font-size-h2: 1.75rem;` (Section Headers)
* `--font-size-body: 1rem;` (Standard text, large enough to tap easily)
* `--font-weight-medium: 500;`
* `--font-weight-bold: 700;`

---

## 4. UI Components & Glassmorphism

To achieve the "Premium" feel, we will use modern UI components rather than flat, boring boxes.

### 4.1 The "Glass" Sidebar
The main navigation menu uses a Glassmorphism effect to feel deeply integrated into the app.
* `--glass-bg: rgba(255, 255, 255, 0.7);`
* `--glass-blur: backdrop-filter: blur(12px);`
* `--glass-border: 1px solid rgba(255, 255, 255, 0.2);`

### 4.2 Skeuomorphic Patient Folders
When viewing a patient's history, the UI looks like stacked cards in a folder.
* **Shadows:** Soft, diffused shadows (`box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05)`) lift the active document off the screen.
* **Radii:** Rounded corners (`border-radius: 12px`) make the interface feel friendly and safe, reducing technology intimidation.

### 4.3 Oversized Tap Targets
Because nurses will be using touchscreen tablets while moving fast (sometimes with gloves):
* Minimum tap target size for any button: `48px x 48px`.
* Generous padding inside input fields (`padding: 1rem`) so they don't have to perfectly aim their finger to type.

---
*Last Updated: 2026-08-11 | Chunk 5*
