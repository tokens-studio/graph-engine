import { ColorScale } from './color/scale/specific.js';
import { ColorSwatch } from './color/swatch/specific.js';

import ColorScaleNode from './color/scale/node.js';
import ColorSwatchNode from './color/swatch/node.js';
import type { Node } from '@tokens-studio/graph-engine';

export const specifics = {
	'studio.tokens.previews.color.scale': ColorScale,
	'studio.tokens.previews.color.swatch': ColorSwatch
};

/**
 * All nodes in the system available as an array
 */
export const nodes: (typeof Node)[] = ([] as (typeof Node)[]).concat(
	ColorScaleNode,
	ColorSwatchNode
);
