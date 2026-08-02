# 🌐 Skill: RTL & Hebrew Multilingual Localization

## Purpose
Ensures flawless Right-To-Left (RTL) layout rendering, Hebrew string handling, and bidirectional UI design.

## Implementation Guidelines
1. **Document Direction:** Ensure pages support `dir="rtl"` attribute and load assistant fonts (e.g. `Assistant` font).
2. **Logical Properties in Tailwind:**
   - Use `ms-*` (margin-start) and `me-*` (margin-end) instead of `ml-*` and `mr-*`.
   - Use `ps-*` (padding-start) and `pe-*` (padding-end) instead of `pl-*` and `pr-*`.
   - Use `start-0` / `end-0` instead of `left-0` / `right-0`.
3. **Flex & Grid Layouts:** Verify flex row directions reverse cleanly in RTL mode (`flex-row-reverse` or flex alignment).
4. **Bidi Text:** Ensure numbers, currency symbols (₪ / $), dates, and mixed English/Hebrew titles align without visual distortion.
