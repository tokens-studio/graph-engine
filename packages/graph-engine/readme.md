# Graph Execution Engine

![NPM version badge](https://img.shields.io/npm/v/@tokens-studio/graph-engine) ![License badge](https://img.shields.io/github/license/tokens-studio/types)

> This project is currently in ALPHA

This is the graph execution engine used for resolvers and generators within Tokens Studio. It relies on an internal system of nodes and edges to execute graph definitions.

![](./assets/resolver-eg.png)

## Installation

With [NPM](https://www.npmjs.com/):

```sh
npm install @tokens-studio/graph-engine
```

## Example

```ts
import {
  execute,
  nodes,
  MinimizedFlowGraph,
} from "@tokens-studio/graph-engine";

const output = await execute({
  graph: myGraph,
  inputValues: {
    foo: "bar",
  },
  nodes,
});
```

## Documentation

See our documentation site [here](https://tokens-studio.github.io/graph-engine/)
