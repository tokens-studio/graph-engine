# Where Are Node Docs Stored

## Context and Problem Statement

Node documentation should likely be atomic and stored directly on the node to prevent desync as we have multiple packages that we build.

## Considered Options

- Store documentation on the node definition in the graph engine
- Store basic descriptions on the node and externalize the rest to the documentation site

## Decision Outcome

Chosen option: "Store documentation on the node definition in the graph engine", because When people start publishing their own nodes outside of our system we need to be able to import them directly inside. Additionally the atomicity of the package having its own definition is important
