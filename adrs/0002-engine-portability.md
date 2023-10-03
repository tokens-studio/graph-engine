# Engine Portability

## Context and Problem Statement

The engine should be as small and portable as possible to push users to integrate the library in other projects and allow graph evaluation to occur inside of other tools and CLI. UI choices

This means that the engine should natively support treeshaking and the ability to inject external resources and 3rd party nodes into the graph at evaluation time

## Considered Options

- Standalone graph evaluator
- Streamlined core library

## Decision Outcome

Chosen option: "Streamlined core library", because Evaluation can still be done through the use of imports of the evaluating code, however users will likely want to automate other changes to the graph as part of the core library so this needs to be accounted for if nodes need to be replaced etc
