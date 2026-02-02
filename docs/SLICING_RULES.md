# SLICING_RULES.md
# Dunlop Warranty UI – Frontend Slicing Rules
# Version: v1.0
# Status: Mandatory

This document defines STRICT slicing rules for all frontend UI work.
These rules MUST be followed for every new page, flow, or component slicing.


1. DEFINITION

“Slicing” means:
- Translating approved Figma designs into frontend UI
- Without backend logic
- Without business logic implementation
- Without API integration
- Without altering system architecture

This project is a BROWNFIELD Next.js application.
All slicing work MUST respect existing structure.

2. GENERAL PRINCIPLES (NON-NEGOTIABLE)
 
- UI ONLY (presentation layer)
- Read-only or mock-interactive behavior
- No assumptions about backend behavior
- No feature completion claims
- Minimal, incremental, merge-ready changes

If a requirement is unclear → STOP and ASK.

 
3. TECHNICAL SCOPE RULES

Allowed:
- React + Next.js App Router
- TypeScript (.tsx)
- Existing Tailwind setup
- Existing UI patterns in repo
- Local mock data (inline constants)

Forbidden:
- API calls (fetch, axios, server actions)
- Backend integration
- State management libraries (Redux, Zustand, etc.)
- New UI libraries (unless already used in repo)
- New dependencies
- Refactoring unrelated code
- Fixing legacy or environment issues

 
4. FILE & FOLDER RULES

- Only touch files explicitly allowed by the execution prompt
- Never modify files outside defined scope
- Never refactor previous slicing output
- Never reorganize folders

Routes MUST follow App Router conventions:
- page.tsx → route entry
- layout.tsx → layout only (no business logic)

 
5. UI IMPLEMENTATION RULES

- Follow Figma EXACTLY:
  - Layout
  - Hierarchy
  - Spacing
  - Labels
  - Button wording
  - Status colors

- Desktop-only
- No responsive behavior unless explicitly requested
- Use Tailwind tokens already present
- Avoid hardcoded colors unless unavoidable

 
6. FORM & INTERACTION RULES

- Forms are UI-only
- Validation is visual only
- No real submission logic
- Sequential steps must be enforced visually
- Disabled states must match Figma

 
7. IMAGE & MAP RULES

Images:
- UI preview only
- Placeholder behavior only
- No upload logic
- No validation logic unless visible in design

Maps:
- NO Google Maps
- NO Mapbox
- NO Leaflet
- Use STATIC placeholder UI only
  (grid / pin / container matching Figma)

 
8. DATA RULES

- All data must be local mock data
- Deterministic values only
- No Date.now(), Math.random(), or browser-only logic
- Data shape must reflect realistic backend output

 
9. STATUS & STATE HANDLING

- Status-driven UI is allowed
- State is derived from mock data only
- No side effects
- No async logic

 
10. OUTPUT EXPECTATION

Each slicing task MUST end with:
- Summary of files created/modified
- Confirmation of scope compliance
- Explicit statement of what was NOT implemented

Example:
- “No API integration”
- “UI-only behavior”
- “Mock data only”

 
11. FAILURE CONDITIONS

STOP immediately if:
- Build fails for unrelated reasons
- Required file is missing but not allowed to create
- Scope is unclear or contradictory
- Requested change violates these rules

 
12. ENFORCEMENT

These rules override:
- Personal preference
- Assumptions
- Speed optimization
- Feature completeness

If a conflict exists:
Instruction > Slicing Rules > Execution Prompt > Figma

 
END OF SLICING_RULES.md