import { WrappedNodeDefinition } from '#/components/flow/wrapper/nodeV2.tsx';
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
import CosNode from './math/cosNode.tsx';
import CountNode from './math/countNode.tsx';
import CreateColorNode from './color/createColorNode.tsx';
import DivisionNode from './math/divNode.tsx';
import EnumeratedInputNode from './input/enumeratedInputNode.tsx';
import HarmonicNode from './series/harmonicNode.tsx';
import IfNode from './logic/ifNode.tsx';
import InputNode from './generic/inputNode.tsx';
import InvertNode from './sets/invertNode.tsx';
import JoinNode from './array/join.tsx';
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
import cssMapNode from './output/cssMapNode.tsx';
import extract from './color/extract.tsx';
import geometricNode from './series/geometricNode.tsx';
import modNode from './math/modNode.tsx';
import randomNode from './math/randomNode.tsx';
import roundNode from './math/roundNode.tsx';
import sliderNode from './input/sliderNode.tsx';
import spreadNode from './input/spreadNode.tsx';

const processTypes = (types: WrappedNodeDefinition[]) => {
  const nodeTypes = types.reduce((acc, type) => {
    acc[type.type] = type.component;
    return acc;
  }, {});

  const stateInitializer = types.reduce((acc, type) => {
    acc[type.type] = type.state;
    return acc;
  }, {});

  return {
    nodeTypes,
    stateInitializer,
  };
};

export const { nodeTypes, stateInitializer } = processTypes([
  ConstantNode,
  AddNode,
  geometricNode,
  ColorBlindness,
  AbsNode,
  spreadNode,
  arrayIndex,
  MultiplyNode,
  DivisionNode,
  SubtractNode,
  sliderNode,
  JoinNode,
  TokenSetNode,
  roundNode,
  UpperNode,
  LowerCaseNode,
  randomNode,
  OrNode,
  AndNode,
  NotNode,
  advancedBlend,
  SinNode,
  CosNode,
  ReverseArrayNode,
  TanNode,
  ClampNode,
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
  SquashNode,
  blendNode,
  modNode,
  CreateColorNode,
  ScaleNode,
  EnumeratedInputNode,
  CountNode,
  RemapNode,
  HarmonicNode,
  ArithmeticNode,
  PassUnitNode,
  SliceNode,
  cssMapNode,
  InputNode,
  OutputNode,
]);
