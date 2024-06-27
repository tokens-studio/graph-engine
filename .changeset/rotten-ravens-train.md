---
"@tokens-studio/graph-engine": minor
---

Added a new NameToColor node that generates consistent colors from text input. This node is useful for creating avatar colors, project tags, or any scenario where you need a consistent color based on a name or text.

The node takes three inputs:
- name: A string input (the text to generate a color from)
- saturation: A number from 0 to 100 for the HSL color saturation
- lightness: A number from 0 to 100 for the HSL color lightness
