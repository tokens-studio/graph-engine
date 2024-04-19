# Resolution

## Batch execution

The execution of the graph engine starts with a topological sort. This orders the nodes in terms of their dependencies and guarantees that we execute the nodes in the correct order.

Once the correct order has been ascertained, we start from the input node and then sequentially execute nodes as they are needed.

> Note. We assume we start from the input node. Topological sorts just guarantee that no node that depends on another node will be executed without its dependency being executed first. It is possible that a node is executed before the input node.

See [Phases](./phases.md) to see the phases that a node goes through during execution.
