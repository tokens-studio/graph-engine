---
"@tokens-studio/graph-editor": major
---

Removes the External Loader from the editor as this will likely be scoped per Frame

You should instead attach your external loader directly to the graph you created when creating a frame

```ts
const graph = new Graph();

graph.externaloLoader = myExternalLoader;

const Frame = new Frame({ graph , ...etc})

```
