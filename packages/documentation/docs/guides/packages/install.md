## Installation

With [NPM](https://www.npmjs.com/):

```sh
npm install @tokens-studio/graph-engine
```

## Example

```ts
import { Graph, NumberSchema, nodeLookup } from "@tokens-studio/graph-engine";

const graph = new Graph.deserialize(mySerializedGraph, nodeLookup);

const result = await graph.execute({
  inputs: {
    foo: {
      value: 1,
      // There are inputs that can be dynamic and need type information passed in
      type: NumberSchema,
    },
    index: {
      value: i,
    },
  },
});
```
