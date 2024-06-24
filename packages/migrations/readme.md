# Graph Engine migration

![NPM version badge](https://img.shields.io/npm/v/@tokens-studio/graph-engine-migration) ![License badge](https://img.shields.io/github/license/tokens-studio/migration)

This project exposes controls for updating old graphs to the latest version that the graph-engine supports.

Use as follows

```ts
import type { SerializedGraph } from '@tokens-studio/graph-engine';
import { updateGraph } from '@tokens-studio/graph-engine-migration';

const myGraph: SerializedGraph = {
	/**... */
};

const updatedGraph = await updateGraph(myGraph);
```
