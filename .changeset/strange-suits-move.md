---
"@tokens-studio/graph-engine": minor
---

Added new Vector2 operation nodes:
- `add`: Vector addition
- `subtract`: Vector subtraction
- `scale`: Scalar multiplication
- `dot`: Dot product calculation
- `length`: Vector magnitude calculation
- `normalize`: Unit vector conversion

Each node includes comprehensive tests covering basic operations, edge cases, and numerical precision. All operations preserve input vector immutability and handle special cases like zero vectors appropriately.