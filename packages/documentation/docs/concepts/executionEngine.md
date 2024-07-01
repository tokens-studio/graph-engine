---
title: Execution Engine
sidebar_position: 0
---

# Execution Engine

## What is a graph execution engine?

Graph execution engines are software components responsible for executing [graph](./graph.md)-based computations. Typically these graphs have [nodes](./nodes.md) which are black boxed processors which have inputs and outputs which are represented as the edges between nodes.

There are a number of types of execution parallelization that are offered.

1.  Sequential execution
    - This is the simplest form of graph engine. The graph is executed on a single machine. Nodes are executed one after each other through the use of a scheduler and analysis of the node dependency graph.
2.  Parallel execution
    - Execution is still executed on a single machine , but nodes are executed concurrently. This leads to improved performance by using multiple cores and multithreading.
3.  Distributed parallel execution
    - In this case the graph is executed across multiple machines, typically with a supervisor coordinating how the different nodes pass data between each other.

## Types of graph based engines

The following is a non exhaustive list of the different classes of graph execution engine. Each of them come with their own pros and cons which depend on the problem class and the additional context such as maintainablity, portability ,etc

**Note** Any code shown here is purely for illustrative purposes

There are a few different uses cases for graph engines.

1. One shot

   Inputs are provided to the system and the graph is executed once. This can be synchronous or asynchronous. To note here is that once all executions have occurred and the final output has been fully computed, the graph execution is considered to be completed. This is usually easier for most use cases and allows for optimizations through the use of memoization in the cases that a graph needs to be executed multiple times sequentially.

   Note that a batch might have a single output "sink" node or multiple. Regardless of the amount, there is an obvious expected state that implies that the execution is complete.

   These types of graphs are ideal for representing a workflow where data is transformed and then returned. In code this would likely be used like the following.

```ts
const output = await graph.run(inputs);
// or perhaps multiple sequential runs each operating on their own data

const batchedInput = [x, y, z];

const executions = batchedInput.map((x) => graph.run(x));

//The results of each of my executions
const outputs = await Promise.all(executions);
```

2. Real time / streaming
   In this case, the graph represents a network where packets can be dispatched and then passed to the next node. There is no clear halting state for the graph, and it is considered to be started and will stay running unless specifically requested to stop. Messages can be constantly sent into the graph.

```ts
const invocation = graph.start();

//Subscribe to a node

invocation.subscribe(aNodeId, (event) => {
  //Some kind of callback for a specific node

  if (event.error) {
    //Forcefully stop the graph if we encounter an error packet emitted from the node
    invocation.stop();
  }
});

//Send a message to a specific node in the graph

invocation.emit(someNodeId, somePacket);

//We now assume that the graph has taken the message and started sending network packets between the nodes and that it will call our subscribed function
```
