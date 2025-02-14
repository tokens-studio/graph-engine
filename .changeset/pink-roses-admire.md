---
"@tokens-studio/graph-engine": minor
---

Added new array operation nodes:
- `unique`: Removes duplicate elements from an array
- `intersection`: Returns common elements between two arrays
- `union`: Combines arrays and removes duplicates
- `difference`: Returns elements in first array not in second array
- `shuffle`: Randomly reorders array elements using Fisher-Yates algorithm

Each node includes comprehensive tests and supports both primitive and object arrays while preserving object references.