import { ColorScale } from './color/scale/specific.js';
import { ColorSwatch } from './color/swatch/specific.js';
import { DimensionScale } from './token/dimension/specific.js';
import { Palette } from './token/palette/specific.js';
import { TokenTable } from './token/table/specific.js';
import { Typography } from './token/typography/specific.js';

import ColorScaleNode from './color/scale/node.js';
import ColorSwatchNode from './color/swatch/node.js';
import DimensionScaleNode from './token/dimension/node.js';
import PaletteNode from './token/palette/node.js';
import TokenTableNode from './token/table/node.js';
import TypographyNode from './token/typography/node.js';

import type { Node } from '@tokens-studio/graph-engine';

export const specifics = {
	'studio.tokens.previews.color.scale': ColorScale,
	'studio.tokens.previews.color.swatch': ColorSwatch,
	'studio.tokens.previews.tokens.dimension': DimensionScale,
	'studio.tokens.previews.tokens.palette': Palette,
	'studio.tokens.previews.tokens.table': TokenTable,
	'studio.tokens.previews.tokens.typography': Typography
};

/**
 * All nodes in the system available as an array
 */
export const nodes: (typeof Node)[] = ([] as (typeof Node)[]).concat(
	ColorScaleNode,
	ColorSwatchNode,
	DimensionScaleNode,
	PaletteNode,
	TokenTableNode,
	TypographyNode
);
