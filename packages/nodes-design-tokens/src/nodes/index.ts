import CreateBorderNode from './createBorder.js';
import CreateBorderTokenNode from './createBorderToken.js';
import CreateBoxShadowNode from './createBoxShadow.js';
import CreateBoxShadowTokenNode from './createBoxShadowToken.js';
import CreateTypographyNode from './createTypography.js';
import CreateTypographyTokenNode from './createTypographyToken.js';
import DestructNode from './destructToken.js';
import ExternalTokensNode from './externalTokens.js';
import ExtractTokenNode from './extractSingleToken.js';
import FlattenNode from './flatten.js';
import GroupNode from './group.js';
import InlineTokenNode from './inlineTokens.js';
import InvertNode from './invert.js';
import LeonardoColorNode from './leonardoColor.js';
import LeonardoThemeNode from './leonardoTheme.js';
import NameTokensNode from './name.js';
import NearestColorNode from './nearest.js';
import PreviewTypography from './previewTypography.js';
import ResolveNode from './resolve.js';
import SetToArrayNode from './setToArray.js';
import UngroupNode from './ungroup.js';
import arrayToSet from './arrayToSet.js';
import create from './create.js';
import type { Node } from '@tokens-studio/graph-engine';

/**
 * All nodes in the system available as an array
 */
export const nodes: (typeof Node)[] = ([] as (typeof Node)[]).concat(
	arrayToSet,
	ExtractTokenNode,

	CreateTypographyNode,
	CreateBorderNode,
	CreateBoxShadowNode,

	CreateBoxShadowTokenNode,
	CreateBorderTokenNode,
	CreateTypographyTokenNode,
	create,
	DestructNode,
	InlineTokenNode,
	FlattenNode,
	ExternalTokensNode,
	GroupNode,
	UngroupNode,
	InvertNode,
	ResolveNode,
	NearestColorNode,
	NameTokensNode,
	PreviewTypography,
	LeonardoColorNode,
	LeonardoThemeNode,
	SetToArrayNode
);
