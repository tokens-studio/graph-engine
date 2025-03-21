# Engines

## Context and Problem Statement

We previously only supported dataflow style graphs, however this is limiting as there are problem types that are not ideal for dataflow, such as conditionals or loops. We need to support different graph types.

As part of this we want to support additional engine types like (behaviour/event/blueprint)[https://dev.epicgames.com/documentation/en-us/unreal-engine/blueprints-visual-scripting-in-unreal-engine?application_version=5.4] graphs where we can control the current pointer to execution and have more control over the flow of the graph.

## Considered Options

- Seperate packages for different graph types
- Reuse generic graph package and implement specific engines

## Decision Outcome

While it is possible to have seperate packages for different graph types, we decided to go with the second option as it allows us to reuse the same graph package and implement specific engines for different graph types. There is a common core to all graphs and we can use the same base classes and abstractions to implement different engines.

What this entails is using generics and OOP principles to create a base engine class that can be extended to implement different engines. We would then also make generic editor systems that can be extended to support different graph types. This will be done using a `Frame` object which represents all the information specific to a certain graph type

## Links

