---
"@tokens-studio/graph-editor": patch
---

Fixed: Infinite Zooming and Negative Zoom Crashes

Fixed an issue where rapidly scrolling the mouse wheel could cause the graph editor to freeze or crash. The graph canvas now has proper zoom limits (10% to 1000%) to ensure stable performance and prevent application freezes when working with complex graphs.