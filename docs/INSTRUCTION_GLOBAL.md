# INSTRUCTION_GLOBAL.md
# Global Rules for Frontend Slicing (Immutable)

## PURPOSE
This document defines the GLOBAL, IMMUTABLE rules for all frontend slicing tasks
in this repository.

These rules apply to:
- GitHub Copilot Chat
- Any AI-assisted coding
- Any manual slicing work

All future prompts MUST assume these rules are already active.
DO NOT restate, redefine, or override them unless explicitly versioned.

## PROJECT CONTEXT

- Project Type: Brownfield Frontend Slicing
- Tech Stack:
  - Next.js (App Router)
  - TypeScript
  - Tailwind CSS
- Repository Nature:
  - Frontend-only (UI slicing)
  - Backend exists separately (Laravel)
  - Backend is OUT OF SCOPE

This repository is intended to:
- Slice UI pages from Figma
- Prepare frontend structure for later backend integration
- Remain previewable locally via `npm run dev`


## CORE PRINCIPLES (NON-NEGOTIABLE)

1. FRONTEND ONLY
   - No backend logic
   - No API calls
   - No server-side business logic
   - No database assumptions

2. UI SLICING ONLY
   - Visual + structural implementation
   - Match Figma layout, spacing, hierarchy
   - Behavior is limited to UI-level interaction

3. BROWNFIELD SAFE
   - Existing code is legacy and MUST NOT be refactored
   - Do not "improve" unrelated code
   - Do not fix pre-existing issues

4. MINIMAL DIFF
   - Touch only files explicitly allowed by the prompt
   - Prefer small, isolated changes
   - Changes must be merge-ready

5. DESKTOP FIRST
   - Desktop-only UI
   - No responsive behavior unless explicitly required
   - No mobile / tablet optimization


## FILE & SCOPE RULES

### Allowed Actions
- Create new page files inside `src/app/**`
- Create small reusable UI components ONLY if required by Figma
- Use existing Tailwind tokens and design system

### Forbidden Actions
- Do NOT modify files outside declared scope
- Do NOT refactor unrelated components
- Do NOT add new dependencies
- Do NOT change build / env configuration
- Do NOT introduce state management libraries
- Do NOT introduce form libraries unless already present

If something is missing:
→ STOP
→ Mention it explicitly
→ Do NOT assume or invent solutions


## DATA RULES

- Use LOCAL MOCK DATA ONLY
- Hardcoded mock objects are acceptable
- IDs can be static and deterministic
- No async data fetching
- No environment variables required

All data is:
- Temporary
- UI-only
- Replaceable by backend later


## INTERACTION & BEHAVIOR RULES

- Navigation is allowed (Link / router.push)
- State is allowed ONLY for:
  - Stepper navigation
  - UI toggles
  - Visual selection
- Validation:
  - Minimal
  - Visual only
  - As required by Figma

NO:
- Real submission
- Real upload
- Real verification logic


## IMAGE & MAP RULES

- Images:
  - UI placeholders only
  - No upload logic
  - No validation unless visual

- Maps:
  - STATIC placeholders only
  - No Google Maps
  - No Mapbox
  - No Leaflet
  - No external SDKs

If a map is shown:
→ Use a styled placeholder (grid + pin)


## ERROR HANDLING

- If build fails due to unrelated reasons:
  → STOP
  → Do NOT attempt to fix

- TypeScript errors:
  - MUST be zero in touched files

- Warnings are acceptable if:
  - Not caused by current changes



## OUTPUT EXPECTATION

Every slicing task MUST end with:
- Clear list of files created / modified
- Confirmation of scope compliance
- Confirmation of:
  - No backend usage
  - No new dependencies
  - No out-of-scope changes

Output must be:
- Merge-ready
- Clean
- Predictable



## IMMUTABILITY NOTICE

This file is GLOBAL and IMMUTABLE.

- Do NOT rewrite it per task
- Do NOT partially apply it
- Do NOT contradict it in prompts

Future tasks should only define:
- Scope
- Target files
- Figma references
- UI goals

Everything else is governed by this document.
