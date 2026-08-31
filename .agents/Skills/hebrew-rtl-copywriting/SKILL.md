---
name: hebrew-rtl-copywriting
description: >-
  Hebrew RTL text alignment, Unicode RLM formatting, Outfit/Inter typography, and localized UI copywriting standards. Use when user asks for "ivrit", "hebrew copywriting", "RTL layout", "tikun ivrit", or writing Israeli movie UI text. Enforces right-to-left alignment, ILS currency formatting, and BiDi rules. Do NOT use for non-Hebrew localization.
license: MIT
---

# Hebrew RTL Copywriting & Localization Engine

Comprehensive standards for Right-To-Left (RTL) layout mirroring, Hebrew micro-copy, Unicode RLM formatting, and currency symbols (`₪`) for CinePulse.

## Instructions

### Step 1: HTML Block Wrapping & Unicode RLM
Wrap all Hebrew agent text in `<div dir="rtl" style="text-align: right; direction: rtl;">` and prepend `\u200F` (Unicode RLM) to every paragraph and list item.

### Step 2: Logical Spacing Properties
Use Tailwind logical properties for layout mirroring:
- `ms-` (margin-inline-start) and `me-` (margin-inline-end)
- `ps-` (padding-inline-start) and `pe-` (padding-inline-end)
- `text-start` and `text-end`

### Step 3: Currency & Numbers
Always position the Shekel symbol before numbers (`₪45`) with unbroken spaces.

## Examples

### Example 1: Format Hebrew UI CTA
```tsx
<button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary text-black font-black text-sm" dir="rtl">
  <span>הזמן כרטיסים עכשיו • ₪45</span>
</button>
```

## Bundled Resources

### Scripts
- `scripts/rtl_rlm_wrapper.py` -- Prepends RLM marks and wraps text in RTL HTML blocks. Run: `python scripts/rtl_rlm_wrapper.py --help`

### References
- `references/rtl-bidi-rules.md` -- Complete BiDi rules and Hebrew font pairings.
