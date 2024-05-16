import create from "./create.js";
import InlineTokenNode from "./inlineTokens.js";
import FlattenNode from "./flatten.js";
import ExternalTokensNode from "./externalTokens.js";
import GroupNode from "./group.js";
import InvertNode from "./invert.js";
import ResolveNode from "./resolve.js";
import UngroupNode from "./ungroup.js";
import NameTokensNode from "./name.js";
import NearestColorNode from "./nearest.js";
import ExtractTokenNode from "./extractSingleToken.js";
import PreviewTypography from "./previewTypography.js";

export const nodes = [
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
    PreviewTypography
];
