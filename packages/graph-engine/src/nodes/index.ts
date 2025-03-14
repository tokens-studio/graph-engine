import { nodes as accessibility } from './accessibility/index.js';
import { nodes as array } from './array/index.js';
import { nodes as color } from './color/index.js';
import { nodes as css } from './css/index.js';
import { nodes as curve } from './curves/index.js';
import { nodes as generic } from './generic/index.js';
import { nodes as gradient } from './gradient/index.js';
import { nodes as logic } from './logic/index.js';
import { nodes as math } from './math/index.js';
import { nodes as preview } from './preview/index.js';
import { nodes as search } from './search/index.js';
import { nodes as series } from './series/index.js';
import { nodes as string } from './string/index.js';
import { nodes as typing } from './typing/index.js';
import { nodes as typography } from './typography/index.js';
import { nodes as vector2 } from './vector2/index.js';
import type { Node } from '../programmatic/node.js';

/**
 * All nodes in the system available as an array
 */
export const nodes: (typeof Node)[] = ([] as (typeof Node)[]).concat(
	accessibility,
	array,
	color,
	css,
	curve,
	generic,
	gradient,
	logic,
	math,
	preview,
	search,
	series,
	string,
	typing,
	typography,
	vector2
);

/**
 * Nodes as a lookup map using the node type as the key
 */
export const nodeLookup: Record<string, typeof Node> = nodes.reduce(
	(acc, node) => {
		acc[node.type] = node;
		return acc;
	},
	{}
);
