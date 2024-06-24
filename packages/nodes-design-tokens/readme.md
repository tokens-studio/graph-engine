# Graph Execution Engine

![NPM version badge](https://img.shields.io/npm/v/@tokens-studio/graph-engine) ![License badge](https://img.shields.io/github/license/tokens-studio/graph-engine)

> This project is currently in ALPHA

This is the graph execution engine used for resolvers and generators within Tokens Studio. It relies on an internal system of nodes and edges to execute graph definitions.

![](./assets/resolver-eg.png)

## Installation

With [NPM](https://www.npmjs.com/):

```sh
npm install @tokens-studio/graph-engine
```

## Example

```ts
import {
	execute,
	nodes,
	MinimizedFlowGraph
} from '@tokens-studio/graph-engine';

const output = await execute({
	graph: myGraph,
	inputValues: {
		foo: 'bar'
	},
	nodes
});
```

## Examples

Provide token sets as part of your input

```ts
import {
	execute,
	nodes,
	MinimizedFlowGraph
} from '@tokens-studio/graph-engine';

//Note that the references are not resolved automatically. The graph is responsible for resolving if it wants to.
const tokens = {
	dimension: {
		scale: {
			value: '2',
			type: 'dimension'
		},
		xs: {
			value: '4',
			type: 'dimension'
		},
		sm: {
			value: '{dimension.xs} * {dimension.scale}',
			type: 'dimension'
		},
		md: {
			value: '{dimension.sm} * {dimension.scale}',
			type: 'dimension'
		},
		lg: {
			value: '{dimension.md} * {dimension.scale}',
			type: 'dimension'
		},
		xl: {
			value: '{dimension.lg} * {dimension.scale}',
			type: 'dimension'
		}
	}
};

const output = await execute({
	graph: myGraph,
	inputValues: {
		myTokens: {
			name: 'My tokens',
			tokens
		}
	},
	nodes
});
```

## Documentation

See our documentation site [here](https://tokens-studio.github.io/graph-engine/)
