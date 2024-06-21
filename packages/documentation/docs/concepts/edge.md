---
title: Edge
sidebar_position: 3
---

# Edge

## What is a edge?

An edge is a representation of a relationship between two or more [nodes](./nodes.md). The graph engine supports [multigraphs](https://en.wikipedia.org/wiki/Multigraph) which means that a node is permitted to have multiple edges between nodes. We use edges with their own identity, ie each edge has its own id associated to uniquely identity multiple edges.

The edge data structure looks like the following

```ts
{

    "id": "00581271-8d68-462c-bf03-0a32bfd9af62",
    "source": "c316391a-63fd-4f3d-82b8-06b760375563",
    "sourceHandle": "node",
    "target": "8c081ba3-5914-4c16-9196-b9dccf355e66",
    /**
     *  A specific port
     */
    "targetHandle": "input",
    /**
     * Arbitrary metadata
     */
    "annotations": {}
}


```

## Metadata

Seen above, and similar to how we handle metadata for the graph, node and ports, we also store arbitrary metadata on edges should they be needed.
