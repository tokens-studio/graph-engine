---
title: Node
sidebar_position: 2
---

# Node

## What is a node?

A node is a the core of the graph and acts a black box to perform some operation on inputs and produce outputs. Nodes should be pure functions and not mutate any data passed into them.

To support this, a node has a concept of `inputs` and `outputs`. These are ports that can values set on them to pass information to other nodes.

## Typing 

Most graph execution engines typically provide either no type safety, or a very simple type system. Simple type systems  lead to an excess of nodes to convert types as well as limitations in maintainability when adding onto an existing system.

Passing a value directly like `5` or `'string'` is likely not scalable and forces a system to have to use duck typing to try interpret what data was passed to it. What happens if a node expects a specific value like `blue` or `red` but is passed through `green`? To address this, we use a typing system to indicated what type of value is passed between the inputs and outputs. This is done through the use of [JSON Schemas](https://json-schema.org/). 

These type definitions can help other nodes know they need to send data in a specific format to a node port in order to be understood correctly.

Additionally by storing metadata on these schemas we can use this information in the UI to help enrich the interface by say providing a drop down for the specific values a user can provide.

```
{
  "$id": "https://example.com/person.schema.json",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Person",
  "type": "object",
  "properties": {
    "firstName": {
      "type": "string",
      "description": "The person's first name."
    },
    "lastName": {
      "type": "string",
      "description": "The person's last name."
    },
    "age": {
      "description": "Age in years which must be equal to or greater than zero.",
      "type": "integer",
      "minimum": 0
    }
  }
}
```

In the above example we could support a complex object and indicate that sending a person who has an age < 0 would be bad data.

## Metadata

Information about the input and output types is not all that node might need to indicate. What if you could only ever have a single node in a graph or needed to store the position of a node when showing it in the UI? 

For this we provide a `annotations` metadata property. This allows us to store arbitrary metadata through the use of named properties. In the below example we use an annotation provided by the engine 

```ts
{
    "engine.deletable": false
}
```

This can be used to indicate that a node is not allowed to be deleted from the graph. 
