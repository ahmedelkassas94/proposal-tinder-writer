# Proposal & Tinder Writer – UI/UX Specification

This document describes every screen, component, and interaction for the **Proposal & Tinder Writer** web application. Use it to design the front-end.

---

## Table of Contents

1. [Overview](#overview)
2. [Design System](#design-system)
3. [Page 1: Home / Project Setup](#page-1-home--project-setup)
4. [Page 2: Editor](#page-2-editor)
5. [Component Details](#component-details)
6. [Interactions & States](#interactions--states)
7. [Responsive Behavior](#responsive-behavior)

---

## Overview

**Purpose:** A tool to help users draft structured proposals (grant applications, RFPs) or persuasive messages ("Tinder" mode) with AI assistance.

**Flow:**
1. User creates a project by providing a template, call text, and instructions.
2. AI extracts requirements and organizes them by section.
3. User edits each section in a three-column layout with AI chat support.
4. User exports the finished document as a Word file (.docx).

**Two modes:**
- **Proposal mode:** Formal grant/proposal writing style.
- **Tinder mode:** Persuasive, casual copywriting style.

---

## Design System

### Color Palette

| Token          | Hex       | Usage                                      |
|----------------|-----------|--------------------------------------------|
| `background`   | `#f5f7fb` | Page background                            |
| `foreground`   | `#0f172a` | Primary text                               |
| `accent`       | `#1b7985` | Primary buttons, active tabs, links        |
| `accentSoft`   | `#e1f1f4` | Hover backgrounds, soft highlights         |
| `accentAlt`    | `#f4b661` | Secondary accent (gold), indicators        |
| `surface`      | `#ffffff` | Cards, panels, modals                      |
| `surfaceMuted` | `#f1f5f9` | Muted backgrounds (sidebar, instructions)  |
| `borderSoft`   | `#e2e8f0` | Borders, dividers                          |

### Background Gradient

The page background has a subtle radial gradient:
- Top-left: warm gold tint (`rgba(244, 182, 97, 0.16)`)
- Bottom-right: teal tint (`rgba(27, 121, 133, 0.20)`)

### Typography

- **Font family:** System UI (`system-ui, -apple-system, sans-serif`)
- **Sizes:**
  - Page title: 16px, semibold
  - Section headers: 14px, semibold
  - Body/labels: 12–13px, medium
  - Small text: 11px
  - Tiny labels: 10px

### Border Radius

| Element        | Radius    |
|----------------|-----------|
| Buttons (pill) | `9999px` (fully rounded) |
| Cards/panels   | `16px` (rounded-2xl)     |
| Inputs         | `8px` (rounded-md)       |
| Tabs           | `9999px` (pill shape)    |

### Shadows

- Cards: `shadow-sm`
- Primary buttons: `shadow-md shadow-accent/30`
- Active tabs: `shadow-sm shadow-accent/40`

---

## Page 1: Home / Project Setup

**URL:** `/`

**Purpose:** Create a new project by entering a name, choosing a mode, and providing input documents.

### Layout

```
┌──────────────────────────────────────────────────────────────────────┐
│ HEADER (sticky)                                                      │
│ ┌──────────────────────────────────────────────────────────────────┐ │
│ │ Logo/Title: "Proposal & Tinder Writer"                           │ │
│ │ Subtitle: "Draft proposals with AI"                              │ │
│ └──────────────────────────────────────────────────────────────────┘ │
├──────────────────────────────────────────────────────────────────────┤
│ MAIN CONTENT (centered, max-width: 1024px, padding: 24px)           │
│                                                                      │
│ ┌──────────────────────────────────────────────────────────────────┐ │
│ │ FORM                                                             │ │
│ │                                                                  │ │
│ │ [1] Project name                                                 │ │
│ │     ┌────────────────────────────────────────────────────────┐   │ │
│ │     │ Text input                                             │   │ │
│ │     └────────────────────────────────────────────────────────┘   │ │
│ │                                                                  │ │
│ │ [2] Mode                                                         │ │
│ │     ┌─────────────┬─────────────┐                                │ │
│ │     │  Proposal   │   Tinder    │  (toggle/segmented control)    │ │
│ │     └─────────────┴─────────────┘                                │ │
│ │                                                                  │ │
│ │ [3] Three input columns (responsive: stack on mobile)            │ │
│ │     ┌──────────────┐ ┌──────────────┐ ┌──────────────┐           │ │
│ │     │ Application  │ │ Call text    │ │ Other        │           │ │
│ │     │ template     │ │              │ │ instructions │           │ │
│ │     │              │ │              │ │              │           │ │
│ │     │ [Upload]     │ │ [Upload]     │ │ [Upload]     │           │ │
│ │     │ ┌──────────┐ │ │ ┌──────────┐ │ │ ┌──────────┐ │           │ │
│ │     │ │ Textarea │ │ │ │ Textarea │ │ │ │ Textarea │ │           │ │
│ │     │ │          │ │ │ │          │ │ │ │          │ │           │ │
│ │     │ └──────────┘ │ │ └──────────┘ │ │ └──────────┘ │           │ │
│ │     └──────────────┘ └──────────────┘ └──────────────┘           │ │
│ │                                                                  │ │
│ │ [4] Error message (conditionally shown)                          │ │
│ │     ┌────────────────────────────────────────────────────────┐   │ │
│ │     │ Red background, red border, error text                 │   │ │
│ │     └────────────────────────────────────────────────────────┘   │ │
│ │                                                                  │ │
│ │ [5] Submit button                                                │ │
│ │     ┌─────────────────────┐                                      │ │
│ │     │   Create project    │  (primary button, pill shape)        │ │
│ │     └─────────────────────┘                                      │ │
│ │                                                                  │ │
│ └──────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────┘
```

### Elements

#### Header
- **Title:** "Proposal & Tinder Writer" — 16px, semibold, dark text
- **Subtitle:** "Draft proposals with AI" — 12px, muted text (`#666`)
- **Background:** white with subtle bottom border
- **Height:** ~60px

#### Form Fields

| # | Field | Type | Placeholder / Label | Notes |
|---|-------|------|---------------------|-------|
| 1 | Project name | Text input | "e.g. SpaceRider Horizon 2026" | Required |
| 2 | Mode | Segmented toggle | "Proposal" / "Tinder" | Default: Proposal |
| 3a | Application template | Textarea + file upload | "Paste the application template here..." | Required (text or file) |
| 3b | Call text | Textarea + file upload | "Paste the call text here..." | Optional |
| 3c | Other instructions | Textarea + file upload | "Paste additional instructions / notes..." | Optional |

#### Input Column Details

Each of the three input columns has:
- **Header row:** Label (left) + "Upload file" link (right, accent color)
- **File indicator:** Shows "Selected: filename.pdf" when a file is chosen
- **Textarea:** Min-height 160px, resizable vertically

#### Buttons

| Button | Type | Label | State variations |
|--------|------|-------|------------------|
| Upload file | Text link | "Upload file" | Normal, hover (underline) |
| Mode toggle | Segmented | "Proposal" / "Tinder" | Active (accent bg, white text), inactive (transparent, muted text) |
| Submit | Primary pill | "Create project" | Normal, hover (lift effect), loading ("Creating project..."), disabled |

#### Error State
- Red background (`bg-red-950/40`)
- Red border
- Red text
- Appears above submit button when validation or server error occurs

---

## Page 2: Editor

**URL:** `/project/[id]`

**Purpose:** Edit the project sections, get AI assistance, view instructions, and export.

### Layout (Three-Column)

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│ TOP BAR (full width)                                                             │
│ ┌──────────────────────────────────────────────────────────────────────────────┐ │
│ │ Left: Project name + Mode badge                                              │ │
│ │ Right: [Project context] [Hide instructions] [Export (.docx)]                │ │
│ └──────────────────────────────────────────────────────────────────────────────┘ │
├──────────────────────────────────────────────────────────────────────────────────┤
│ THREE COLUMNS                                                                    │
│ ┌────────────┬───────────────────────────────────────────────┬─────────────────┐ │
│ │ LEFT       │ MIDDLE                                        │ RIGHT           │ │
│ │ (224px)    │ (flexible)                                    │ (320px)         │ │
│ │            │                                               │                 │ │
│ │ SECTION    │ ┌───────────────────────────────────────────┐ │ INSTRUCTIONS    │ │
│ │ TABS       │ │ EDITOR                                    │ │ PANEL           │ │
│ │            │ │                                           │ │                 │ │
│ │ ┌────────┐ │ │ - Section title / info                    │ │ - Search bar    │ │
│ │ │General │ │ │ - Textarea for drafting                   │ │ - Requirement   │ │
│ │ │instruc.│ │ │ - Auto-save indicator                     │ │   lists         │ │
│ │ └────────┘ │ │                                           │ │ - Evaluation    │ │
│ │            │ └───────────────────────────────────────────┘ │   criteria      │ │
│ │ ┌────────┐ │                                               │ - Keywords      │ │
│ │ │Section1│ │ ┌───────────────────────────────────────────┐ │ - Snippets      │ │
│ │ └────────┘ │ │ AI CHAT (260px height)                    │ │                 │ │
│ │            │ │                                           │ │                 │ │
│ │ ┌────────┐ │ │ - Quick action buttons (row)              │ │                 │ │
│ │ │Section2│ │ │ - Message history (scrollable)            │ │                 │ │
│ │ └────────┘ │ │ - Input textarea + Send button            │ │                 │ │
│ │            │ │                                           │ │                 │ │
│ │ ┌────────┐ │ └───────────────────────────────────────────┘ │                 │ │
│ │ │Section3│ │                                               │                 │ │
│ │ └────────┘ │                                               │                 │ │
│ │ ...        │                                               │                 │ │
│ └────────────┴───────────────────────────────────────────────┴─────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────────┘
```

### Top Bar

| Element | Position | Description |
|---------|----------|-------------|
| Project name | Left | 14px, semibold |
| Mode badge | Left (below name) | 11px, muted text, "Mode: Proposal" or "Mode: Tinder" |
| "Project context" button | Right | Ghost button, opens modal |
| "Hide/Show instructions" button | Right | Ghost button, toggles right column |
| "Export (.docx)" button | Right | Primary button (pill, accent bg) |

### Left Column: Section Tabs

**Width:** 224px (w-56)
**Background:** `surfaceMuted/60`

**Contents:**
- **Header:** "SECTIONS" — 11px, uppercase, tracking-wide, muted
- **General tab:** Always first, special styling
  - Gold dot indicator (accent-alt)
  - Label: "General instructions"
- **Section tabs:** One per section extracted from template
  - Label: Section title or "Untitled section"
  - Sorted by order

**Tab states:**
| State | Background | Text | Shadow |
|-------|------------|------|--------|
| Active | `accent` (teal) | White | `shadow-sm shadow-accent/40` |
| Inactive | Transparent | `slate-600` | None |
| Hover (inactive) | `accentSoft` | `slate-600` | None |

**Tab shape:** Pill (fully rounded), full width, left-aligned text

### Middle Column: Editor + Chat

**Background:** Main content area with padding (12px gap)

#### Editor Panel (top)

**For "General instructions" tab:**
- Card with title "General instructions"
- Explanatory text: "Use this tab to set the project-wide writing style..."
- No textarea (general instructions are managed via chat)

**For section tabs:**
- Card with two areas:
  - **Header row:** "Section draft" label (left) + save status (right)
  - **Textarea:** Full height, scrollable, placeholder "Start drafting this section..."
- **Save status indicator:** Shows "Saving...", "Saved", or "Error saving"
- **Auto-save:** Content saves automatically after 800ms of inactivity

#### Chat Panel (bottom)

**Height:** 260px (fixed)

**For "General instructions" tab:**
- **Header:** "Global style & instructions chat"
- **Empty state:** "Describe the tone, writing style, and global instructions..."
- **Messages:** Chat bubbles, user on right (accent bg), assistant on left (muted bg)
- **Input:** Textarea + "Send" button

**For section tabs:**
- **Header:** "Section AI assistant"
- **Quick action buttons:** Row of pill buttons
  - "AI: Suggest outline"
  - "AI: Improve clarity"
  - "AI: Make it more persuasive"
  - "AI: Fit to evaluation criteria"
  - "AI: Reduce to word limit"
- **Empty state:** "Ask the assistant to help you refine this section..."
- **Messages:** Same styling as general chat
- **Input:** Textarea + "Send" button

**Button states:**
| State | Appearance |
|-------|------------|
| Normal | Muted border, muted text |
| Hover | Accent border, accent text |
| Loading | "Thinking..." text, disabled |

### Right Column: Instructions Panel

**Width:** 320px (w-80)
**Background:** `surfaceMuted/60`
**Visibility:** Toggled via "Hide/Show instructions" button in top bar

#### Header
- Title: "General instructions" or "Instructions: [Section Title]"
- 11px, uppercase, tracking-wide

#### Search Bar
- Rounded-full input
- Placeholder: "Search instructions..." or "Search within this section..."
- Filters all lists below in real-time

#### Content Lists

**For General tab:**
| Section | Content |
|---------|---------|
| Requirements | Bullet list from AI extraction |
| Evaluation criteria | Bullet list |
| Formatting constraints | Bullet list |
| Deadlines | Bullet list |
| Recommended keywords | Bullet list |
| Do not include | Bullet list |
| Other notes | Bullet list |
| Raw extracted snippets | Cards with source + text |

**For Section tabs:**
| Section | Content |
|---------|---------|
| Specific requirements | Bullet list |
| Evaluation criteria | Bullet list |
| Word limits | Bullet list |
| Formatting notes | Bullet list |
| Specific keywords | Bullet list |
| Other notes | Bullet list |

**List item styling:**
- Each item in a rounded card (`rounded-xl`)
- Light border, muted background
- Padding: 8px horizontal, 4px vertical

**Empty state:** "None." in italic, muted text

---

## Component Details

### Project Context Modal

**Trigger:** "Project context" button in top bar

**Overlay:** Dark semi-transparent (`bg-black/70`)

**Modal:**
- Max-width: 896px (max-w-4xl)
- Max-height: 80vh
- Background: dark surface (`slate-950`)
- Border: `slate-800`
- Header: "Project context" + "Close" button
- Content: Three scrollable sections
  - Template (pre-formatted text)
  - Call text (pre-formatted text)
  - Other instructions (pre-formatted text)

### Buttons Summary

| Name | Class | Shape | Colors |
|------|-------|-------|--------|
| Primary | `btn-primary` | Pill | Teal bg, white text, shadow |
| Ghost | `btn-ghost` | Pill | White bg, light border, muted text |
| Quick action | (custom) | Pill | Muted bg/border, accent on hover |
| Tab | `pill-tab` | Pill | See tab states above |

---

## Interactions & States

### Loading States

| Location | Indicator |
|----------|-----------|
| Project creation | Button text changes to "Creating project...", disabled |
| AI chat | Button text changes to "Thinking...", disabled |
| Section editor | Status text shows "Saving..." |

### Success States

| Location | Indicator |
|----------|-----------|
| Project creation | Redirects to editor page |
| Section editor | Status text shows "Saved" for 1.2 seconds |
| AI chat | New message appears in chat history |

### Error States

| Location | Indicator |
|----------|-----------|
| Project creation | Red error box with message |
| Section editor | Status text shows "Error saving" |
| AI chat | Error logged to console (could add UI feedback) |
| Export | Browser alert "Failed to export document." |

### Hover Effects

| Element | Effect |
|---------|--------|
| Primary button | Slight lift (`-translate-y-[1px]`), darker bg, larger shadow |
| Ghost button | Border becomes accent, text becomes accent |
| Tab (inactive) | Background becomes `accentSoft` |
| Upload link | Underline appears |

---

## Responsive Behavior

### Breakpoints

| Breakpoint | Width | Layout |
|------------|-------|--------|
| Mobile | < 768px | Single column, stacked |
| Tablet | 768px – 1024px | Two columns (tabs + content) |
| Desktop | > 1024px | Three columns (full layout) |

### Mobile Adaptations

- **Home page:** Input columns stack vertically
- **Editor page:**
  - Tabs become a horizontal scrollable row at top, or a hamburger menu
  - Instructions panel becomes a slide-out drawer or bottom sheet
  - Chat remains at bottom

### Desktop Minimum

The editor is designed for desktop use. Minimum recommended width: **1280px** for comfortable three-column layout.

---

## Assets Needed

1. **Logo/icon** (optional) — Could be a stylized document or pen icon
2. **Loading spinner** — For longer operations
3. **Empty state illustrations** (optional) — For sections with no content
4. **Icons:**
   - Export/download
   - Close (X)
   - Hide/show (eye)
   - Send (arrow)
   - File upload
   - Search (magnifying glass)

---

## Notes for Designer

1. **Keep it clean:** The UI should feel professional and focused. Avoid clutter.
2. **Information density:** Users need to see tabs, editor, and instructions simultaneously without scrolling.
3. **Accessibility:** Ensure sufficient color contrast, especially for muted text. All interactive elements should have visible focus states.
4. **Dark mode (future):** The current palette is light. A dark mode version could use the existing dark colors (`slate-900`, `slate-950`) as primary surfaces.
5. **Animations:** Subtle transitions on hover/focus. Avoid distracting animations.
6. **Chat UX:** Messages should clearly differentiate user (right, colored) from assistant (left, muted). Consider adding timestamps or copy buttons.

---

*End of specification.*
