# Efficient Caching

## Context and Problem Statement

Efficient graph execution when varying inputs. Caching needs to be enabled to not recalculate values in case that a node has an expensive calculation.

## Considered Options

- Pure functions

## Decision Outcome

Chosen option: "Pure functions", because By making nodes explicitly pure without side effects, the engine can cache calculations by performing deep equality checks on the values
