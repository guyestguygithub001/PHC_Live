# MOTION_AND_INTERACTION.md — Fluidity & Psychological Safety

> **The Goal:** A static app feels dead and intimidating. A fluid app with micro-animations feels alive, responsive, and premium. We use interaction design not just for aesthetics, but to provide **Psychological Safety** to users who are terrified of "breaking the computer."

---

## 1. Micro-Animations (The "Alive" Interface)

Every action the user takes must provide immediate, smooth visual feedback.

### 1.1 Hover & Active States
* **Buttons:** When a nurse presses a button on the tablet, it subtly scales down (`transform: scale(0.97)`) and changes color over `150ms`. This mimics the physical feedback of pressing a real button.
* **Table Rows:** Hovering over a patient in the Triage queue highlights the row with a soft blue tint (`background-color: var(--color-primary-50)`), telling the user exactly where they are.

### 1.2 View Transitions
* When moving from the "Triage Queue" to the "Patient Vitals" screen, the app does not flash white and reload. 
* We use CSS transitions (`opacity`, `transform: translateX`) to slide the new screen in smoothly over `300ms ease-in-out`. This preserves the user's spatial awareness.

---

## 2. Optimistic UI (Zero Latency)

We never want the user staring at a loading spinner wondering if the app is broken, especially since they are working with a local server over Wi-Fi.

### 2.1 Instant Updates
* When the Pharmacist clicks "Dispense Drug", the UI instantly removes the patient from the queue and shows a green "Success" checkmark.
* *Under the hood:* The app assumes the WatermelonDB save will succeed (Optimistic UI). It queues the save in the background. The user experiences 0ms latency.
* *Error Handling:* If the save actually fails (e.g., local database corruption), a red toast notification drops down allowing them to explicitly retry.

---

## 3. Psychological Safety Nets

Users afraid of new technology are usually terrified of making a permanent mistake. We must build explicit safety nets to remove this fear.

### 3.1 The "Undo" Toast (Anti-Deletion)
We do not use standard "Are you sure you want to delete this?" popups. They are annoying and people blindly click "Yes".
* **The Pattern:** If a user clicks "Archive Patient", the patient instantly disappears from the list, and a toast appears at the bottom: *"Patient Archived. [UNDO]"* for 5 seconds.
* **The Result:** The user gets instant gratification, but has a 5-second window to realize their mistake and fix it with one tap.

### 3.2 Draft Auto-Saves
* **The Scenario:** A CHO is halfway through writing a long consultation note when the tablet dies or they accidentally hit the "Back" button.
* **The Net:** Every keystroke is saved to the local Zustand state/WatermelonDB as a `draft`. When they return to that patient, the text is exactly where they left it, accompanied by a small *"Draft restored"* badge.

### 3.3 Skeuomorphic Loading
* Instead of circular loading spinners, we use **Skeleton Screens**. 
* When fetching historical data from the local server, the UI displays a pulsating grey silhouette of the folder. This sets the expectation for what the data will look like before it even arrives, reducing cognitive load.

---
*Last Updated: 2026-08-11 | Chunk 5*
