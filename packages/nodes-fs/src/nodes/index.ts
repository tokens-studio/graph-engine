import { GetDirectoryNode } from './getDirectoryListing.js';
import { GetFileNode } from './getFile.js';
import { GetJSONNode } from './getJson.js';
import { GetTextNode } from './getText.js';

/**
 * All nodes in the system available as an array
 */
export const nodes = [].concat(
	GetFileNode,
	GetJSONNode,
	GetTextNode,
	GetDirectoryNode
);
