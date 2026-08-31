# Hebrew BiDi & RTL Rules

## Rules
1. Wrap mixed English-Hebrew strings with Unicode RLM (`\u200F`) to keep punctuation anchored to the left in RTL sentences.
2. Prices must format as `₪XX.XX` (Shekel symbol first).
3. Dates format as `DD/MM/YYYY` (Day first, month second).
