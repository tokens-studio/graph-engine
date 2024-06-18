# Edge Drawing

## Context and Problem Statement

Drawing edges currently is messy through a naive use of bezier curves causing significant overlap

## Considered Options

- Orthogonal connectors
- react-flow-smart-edge
- Libavoid

## Decision Outcome

Chosen option: "Orthogonal connectors", because Seems to be the fastest and less obtrusive of all edge drawing systems without. It still doesn't avoid drawing ontop of existing edges or nodes but it simplifies the existing connections nicer than step

## Links

- Orthogonal Connectors https://medium.com/swlh/routing-orthogonal-diagram-connectors-in-javascript-191dc2c5ff70
- https://github.com/tisoap/react-flow-smart-edge
- https://eclipse.dev/elk/reference/algorithms/org-eclipse-elk-alg-libavoid.html
