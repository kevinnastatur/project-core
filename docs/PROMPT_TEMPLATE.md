# PROMPT_TEMPLATE.md
# Frontend Slicing – Execution Prompt Template

CONTEXT:
- Follow ALL rules in:
  - /docs/INSTRUCTION_GLOBAL.md
  - /docs/SLICING_RULES.md
- This is a BROWNFIELD frontend slicing task
- UI-only implementation
- No backend / API integration

TASK:
Create frontend UI slicing for the following feature:

FEATURE NAME:
[Describe the feature briefly]

USER ROLE:
(Customer / Principal / Admin)

ENTRY POINT:
[Where this flow starts from, e.g. button, card, menu]

TARGET ROUTE(S):
- /dashboard/...

ALLOWED FILES TO MODIFY:
- [List exact file paths]

ALLOWED NEW FILES (IF NEEDED):
- [List allowed folders/files or state "None"]

UI GOAL:
- Implement UI exactly as shown in the attached Figma
- Follow layout, spacing, hierarchy, wording, and status states strictly
- Desktop-only layout

BEHAVIOR RULES:
- Use local mock data only
- Navigation is allowed (Link / router.push)
- State is allowed only for UI behavior (stepper, toggle, selection)
- No async logic
- No real submission

SPECIAL NOTES (IF ANY):
- [Example: status-based variants, conditional sections, read-only page]

HARD CONSTRAINTS (REPEAT):
- Do NOT refactor existing code
- Do NOT touch files outside scope
- Do NOT add dependencies
- Do NOT fix legacy issues
- If build fails for unrelated reasons → STOP

OUTPUT EXPECTATION:
- Merge-ready TSX
- Minimal diff
- No TypeScript errors in touched files
- End with a summary of:
  - Files created / modified
  - Scope compliance confirmation
