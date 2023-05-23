# Graph Execution Engine

> This project is currently in ALPHA

This is the graph execution engine used for resolvers and generators within Tokens Studio

## Example

```ts
import {execute,nodes,MinimizedFlowGraph} from '@tokens-studio/graph-engine';

const output = await execute({
    graph: myGraph,
    inputValues: {
        foo:'bar'
    },
    nodes
})

