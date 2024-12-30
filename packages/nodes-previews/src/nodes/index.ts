import ColorScale from './colorScale.js';
import type { Node } from '@tokens-studio/graph-engine';

/**
 * All nodes in the system available as an array
 */
export const nodes: (typeof Node)[] = ([] as (typeof Node)[]).concat(
	ColorScale
);
