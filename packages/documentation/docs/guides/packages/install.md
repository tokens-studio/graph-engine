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

## Examples

Provide token sets as part of your input

```ts
import {
  execute,
  nodes,
  MinimizedFlowGraph,
} from "@tokens-studio/graph-engine";

//Note that the references are not resolved automatically. The graph is responsible for resolving if it wants to.
const tokens = {
  dimension: {
    scale: {
      value: "2",
      type: "dimension",
    },
    xs: {
      value: "4",
      type: "dimension",
    },
    sm: {
      value: "{dimension.xs} * {dimension.scale}",
      type: "dimension",
    },
    md: {
      value: "{dimension.sm} * {dimension.scale}",
      type: "dimension",
    },
    lg: {
      value: "{dimension.md} * {dimension.scale}",
      type: "dimension",
    },
    xl: {
      value: "{dimension.lg} * {dimension.scale}",
      type: "dimension",
    },
  },
};

const output = await execute({
  graph: myGraph,
  inputValues: {
    myTokens: {
      name: "My tokens",
      tokens,
    },
  },
  nodes,
});
```