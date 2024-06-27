---
"@tokens-studio/graph-engine": minor
---

Added a new Random Selection node that randomly selects one item from an input array. This node is useful for creating variety in design systems, such as randomly selecting a color from a palette, choosing a layout option, or picking a sample content item.

The node has two inputs:
- items: An array of items to select from (can be of any type)
- seed: An optional string seed for consistent randomization (hidden by default)

It outputs a single randomly selected item from the input array. The output type is inferred from the input array's item type.

Key features:
- Type inference: The output type matches the type of items in the input array
- Optional seeding: Provides an optional seed for consistent randomization when needed
- Simple interface: The seed input is hidden by default for ease of use