import { GetDirectoryNode } from './getDirectoryListing.js';
import { GetFileNode } from './getFile.js';
import { GetJSONNode } from './getJson.js';
import { GetTextNode } from './getText.js';
import type { Node } from '@tokens-studio/graph-engine';

/**
 * All nodes in the system available as an array
 */
export const nodes: (typeof Node)[] = ([] as (typeof Node)[]).concat(
	GetFileNode,
	GetJSONNode,
	GetTextNode,
	GetDirectoryNode
);
