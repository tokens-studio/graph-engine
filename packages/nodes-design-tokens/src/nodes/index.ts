import ExternalTokensNode from "./externalTokens.js";
import ExtractTokenNode from "./extractSingleToken.js";
import FlattenNode from "./flatten.js";
import GroupNode from "./group.js";
import InlineTokenNode from "./inlineTokens.js";
import InvertNode from "./invert.js";
import LeonardoColorNode from "./leonardoColor.js";
import LeonardoThemeNode from "./leonardoTheme.js";
import NameTokensNode from "./name.js";
import NearestColorNode from "./nearest.js";
import PreviewTypography from "./previewTypography.js";
import ResolveNode from "./resolve.js";
import SetToArrayNode from "./setToArray.js";
import UngroupNode from "./ungroup.js";
import advancedBlend from "./advancedBlend.js";
import arrayToSet from "./arrayToSet.js";
import create from "./create.js";

export const nodes = [
  arrayToSet,
  advancedBlend,
  ExtractTokenNode,
  create,
  InlineTokenNode,
  FlattenNode,
  ExternalTokensNode,
  GroupNode,
  InvertNode,
  ResolveNode,
  UngroupNode,
  NearestColorNode,
  NameTokensNode,
  PreviewTypography,
  LeonardoColorNode,
  LeonardoThemeNode,
  SetToArrayNode,
];
