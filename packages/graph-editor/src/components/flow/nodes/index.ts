import { WrappedNodeDefinition } from '../../../components/flow/wrapper/nodeV2.tsx';
import AbsNode from './math/absNode.tsx';
import AddNode from './math/addNode.tsx';
import AndNode from './logic/andNode.tsx';
import ArithmeticNode from './series/arithmeticNode.tsx';
import ArrifyNode from './array/arrify.tsx';
import ClampNode from './math/clampNode.tsx';
import ColorBlindness from './accessibility/ColorBlindNessNode.tsx';
import CompareNode from './logic/compare.tsx';
import ConstantNode from './input/constantNode.tsx';
import ContrastNode from './accessibility/contrastNode.tsx';
import ContrastingNode from './color/contrastingNode.tsx';
import CosNode from './math/cosNode.tsx';
import CountNode from './math/countNode.tsx';
import CreateColorNode from './color/createColorNode.tsx';
import SetColorValueNode from './color/setColorValueNode.tsx';
import DivisionNode from './math/divNode.tsx';
import EnumeratedInputNode from './input/enumeratedInputNode.tsx';
import HarmonicNode from './series/harmonicNode.tsx';
import IfNode from './logic/ifNode.tsx';
import InputNode from './generic/inputNode.tsx';
import InvertNode from './sets/invertNode.tsx';
import TokenGroup from './sets/tokenGroup.tsx';
import objectify from './input/objectify.tsx';
import dotProp from './array/dotProp.tsx';
import JoinNode from './array/join.tsx';
import JoinString from './string/join.tsx';
import LerpNode from './math/lerpNode.tsx';
import LowerCaseNode from './string/lowerCaseNode.tsx';
import MultiplyNode from './math/multiplyNode.tsx';
import NotNode from './logic/notNode.tsx';
import OrNode from './logic/orNode.tsx';
import OutputNode from './generic/outputNode.tsx';
import PassUnitNode from './generic/passUnitNode.tsx';
import RegexNode from './string/regexNode.tsx';
import RemapNode from './sets/remapNode.tsx';
import ResolveAliasesNode from './sets/resolveAliases.tsx';
import ReverseArrayNode from './array/reverse.tsx';
import SortArrayNode from './array/sort.tsx';
import ScaleNode from './color/scaleNode.tsx';
import SinNode from './math/sinNode.tsx';
import SliceNode from './array/slice.tsx';
import SquashNode from './sets/squashNode.tsx';
import SubtractNode from './math/subtractNode.tsx';
import SwitchNode from './logic/switchNode.tsx';
import TanNode from './math/tanNode.tsx';
import TokenSetNode from './sets/tokensNode.tsx';
import UpperNode from './string/upperCaseNode.tsx';
import advancedBlend from './color/advancedBlend.tsx';
import arrayIndex from './array/arrayIndex.tsx';
import blendNode from './color/blendNode.tsx';
import stringifyNode from './string/stringify.tsx';
import cssMapNode from './output/cssMapNode.tsx';
import extract from './color/extract.tsx';
import geometricNode from './series/geometricNode.tsx';
import modNode from './math/modNode.tsx';
import randomNode from './math/randomNode.tsx';
import powerNode from './math/powNode.tsx';
import roundNode from './math/roundNode.tsx';
import sliderNode from './input/sliderNode.tsx';
import spreadNode from './input/spreadNode.tsx';
import convertNode from './color/convertNode.tsx';
import wheelNode from './color/wheelNode.tsx';
import parseUnit from './generic/parseUnit.tsx';
import portalNode from './generic/portalNode.tsx';
import jsonNode from './generic/jsonNode.tsx';
import cssBox from './css/boxNode.tsx';
import concat from './array/concat.tsx';
import ExternalSetNode from './sets/ExternalSetNode.tsx';
import PolineNode from './color/polineNode.tsx';
import baseFontSizeNode from './accessibility/baseFontSizeNode.tsx';
import colorDistanceNode from './color/colorDistanceNode.tsx';
import fluidNode from './math/fluidNode.tsx';
import ExtractTokensNodes from './sets/extractTokensNode.tsx';
import ExtractSingleTokenNodes from './sets/extractSingleTokenNode.tsx';
import GroupToken from './sets/tokenGroup.tsx';
import UngroupToken from './sets/tokenUngroup.tsx';
import SplitStringNode from './string/split.tsx';
import ContrastingFromSetNode from './color/contrastingFromSetNode.tsx';
import colorNameNode from './color/colorNameNode.tsx';
import NearestTokensNode from './color/nearestNode.tsx';
import ArrayPassUnit from './array/passUnit.tsx';
import NameArrayNode from './array/name.tsx';

export type NodeTypeLookup = Record<string, React.ReactNode | React.FC>;
export type StateInitializer = Record<string, Record<string, any>>;

/**
 * Use this to extend your own custom nodes. This can then be passed to the editor to populate it with your own types
 * @example
 * ```tsx
 * const { nodeTypes, stateInitializer } = processTypes(defaultNodeTypes, defaultStateInitializer, [
 *  MyCustomNode,
 * MyOtherCustomNode,
 * ]);
 * ```
 */
export const processTypes = (
  existingNodeTypes: NodeTypeLookup,
  existingStateInitializer: StateInitializer,
  types: WrappedNodeDefinition[],
) => {
  const nodeTypes = types.reduce((acc, type) => {
    acc[type.type] = type.component;
    return acc;
  }, existingNodeTypes);

  const stateInitializer: Record<string, Record<string, any>> = types.reduce(
    (acc, type) => {
      acc[type.type] = type.state;
      return acc;
    },
    existingStateInitializer,
  );

  return {
    nodeTypes,
    stateInitializer,
  };
};

/**
 * Default processed nodes for the editor.
 */
export const {
  nodeTypes: defaultNodeTypes,
  stateInitializer: defaultStateInitializer,
} = processTypes({}, {}, [
  ConstantNode,
  AddNode,
  convertNode,
  geometricNode,
  ColorBlindness,
  AbsNode,
  portalNode,
  spreadNode,
  dotProp,
  objectify,
  ExtractSingleTokenNodes,
  ExtractTokensNodes,
  arrayIndex,
  MultiplyNode,
  DivisionNode,
  SubtractNode,
  sliderNode,
  JoinNode,
  JoinString,
  TokenSetNode,
  roundNode,
  UpperNode,
  parseUnit,
  LowerCaseNode,
  randomNode,
  OrNode,
  AndNode,
  NotNode,
  advancedBlend,
  SinNode,
  CosNode,
  ReverseArrayNode,
  SortArrayNode,
  TanNode,
  jsonNode,
  ClampNode,
  TokenGroup,
  LerpNode,
  IfNode,
  RegexNode,
  InvertNode,
  extract,
  SwitchNode,
  CompareNode,
  ResolveAliasesNode,
  ArrifyNode,
  ContrastNode,
  ContrastingNode,
  SquashNode,
  blendNode,
  modNode,
  CreateColorNode,
  SetColorValueNode,
  ScaleNode,
  EnumeratedInputNode,
  CountNode,
  RemapNode,
  powerNode,
  HarmonicNode,
  ArithmeticNode,
  PassUnitNode,
  SliceNode,
  cssMapNode,
  InputNode,
  OutputNode,
  wheelNode,
  cssBox,
  concat,
  ExternalSetNode,
  PolineNode,
  baseFontSizeNode,
  colorDistanceNode,
  fluidNode,
  GroupToken,
  UngroupToken,
  SplitStringNode,
  ContrastingFromSetNode,
  colorNameNode,
  NearestTokensNode,
  stringifyNode,
  ArrayPassUnit,
  NameArrayNode,
]);
