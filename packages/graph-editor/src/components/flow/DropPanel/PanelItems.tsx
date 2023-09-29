import {
  ArrowDownIcon,
  BlendingModeIcon,
  ButtonIcon,
  ColorWheelIcon,
  EyeNoneIcon,
  Half2Icon,
  ImageIcon,
  PlusIcon,
} from '@radix-ui/react-icons';
import icons from '../icons';
import { NodeTypes } from '@tokens-studio/graph-engine';
import React from 'react';
import { BoxIcon } from '@iconicicons/react';
import preset from '#/data/preset.ts';
import tinyCore from '#/data/tiny/core.ts';
import tinyCoreDark from '#/data/tiny/dark.ts';
import tinyCoreLight from '#/data/tiny/light.ts';

import { flatten } from '#/utils/index.ts';

//@ts-ignore
const presetFlattened = flatten(preset);
//@ts-ignore
const tinyCoreFlattened = flatten(tinyCore);
//@ts-ignore
const tinyCoreLightFlattened = flatten(tinyCoreLight);
//@ts-ignore
const tinyCoreDarkFlattened = flatten(tinyCoreDark);

export interface PanelItem {
  type: NodeTypes;
  icon: string | JSX.Element;
  text: string;
  data?: {
    identifier?: string;
    tokens?: any[];
    title?: string;
  };
}

type PanelItemsKeys =
  | 'generic'
  | 'tokens'
  | 'math'
  | 'array'
  | 'sets'
  | 'logic'
  | 'color'
  | 'accessibility'
  | 'series'
  | 'string';

export type PanelItems = Record<PanelItemsKeys, PanelItem[]>;

export const items = {
  generic: [
    {
      type: NodeTypes.INPUT,
      icon: icons[NodeTypes.INPUT],
      text: 'Input',
    },
    {
      type: NodeTypes.ENUMERATED_INPUT,
      icon: <ButtonIcon />,
      text: 'Enumerated Constant',
    },
    {
      type: NodeTypes.CSS_MAP,
      icon: './x',
      text: 'CSS Map',
    },
    {
      type: NodeTypes.CSS_BOX,
      icon: <BoxIcon />,
      text: 'CSS Box',
    },
    {
      type: NodeTypes.OUTPUT,
      icon: <ButtonIcon />,
      text: 'Output',
    },
    {
      type: NodeTypes.SLIDER,
      icon: '--.',
      text: 'Slider',
    },
    {
      type: NodeTypes.CONSTANT,
      icon: <ButtonIcon />,
      text: 'Constant',
    },
    {
      type: NodeTypes.OBJECTIFY,
      icon: '{ }',
      text: 'Objectify',
    },
    {
      type: NodeTypes.SPREAD,
      icon: '...',
      text: 'Spread',
    },
    {
      type: NodeTypes.PASS_UNIT,
      icon: 'px',
      text: 'Pass Unit',
    },
    {
      type: NodeTypes.PARSE_UNIT,
      icon: '{}px',
      text: 'Parse Unit',
    },
    {
      type: NodeTypes.JSON,
      icon: '{/}',
      text: 'JSON',
    },
  ],
  inline: [
    {
      type: NodeTypes.INLINE_SET,
      data: {
        tokens: tinyCoreFlattened,
        title: 'Tiny Core',
      },
      icon: <PlusIcon />,
      text: 'Tiny Core',
    },
    {
      type: NodeTypes.INLINE_SET,
      data: {
        tokens: tinyCoreLightFlattened,
        title: 'Tiny Light',
      },
      icon: <PlusIcon />,
      text: 'Tiny Light',
    },
    {
      type: NodeTypes.INLINE_SET,
      data: {
        tokens: tinyCoreDarkFlattened,
        title: 'Tiny Dark',
      },
      icon: <PlusIcon />,
      text: 'Tiny Dark',
    },
    {
      type: NodeTypes.INLINE_SET,
      data: {
        tokens: presetFlattened,
        title: 'Preset tokens',
      },
      icon: <PlusIcon />,
      text: 'Preset Tokens',
    },
  ],
  tokens: [
    // these will be dinamically loaded
  ],
  math: [
    {
      type: NodeTypes.ADD,
      icon: '+',
      text: 'Add',
    },
    {
      type: NodeTypes.SUBTRACT,
      icon: '-',
      text: 'Subtract',
    },
    {
      type: NodeTypes.MULTIPLY,
      icon: 'x',
      text: 'Multiply',
    },
    {
      type: NodeTypes.DIV,
      icon: '/',
      text: 'Divide',
    },
    {
      type: NodeTypes.MOD,
      icon: '%',
      text: 'Modulo',
    },
    {
      type: NodeTypes.SIN,
      icon: 'sin',
      text: 'Sin',
    },
    {
      type: NodeTypes.COS,
      icon: 'cos',
      text: 'Cos',
    },
    {
      type: NodeTypes.TAN,
      icon: 'tan',
      text: 'Tan',
    },
    {
      type: NodeTypes.ABS,
      icon: '||',
      text: 'Absolute',
    },
    {
      type: NodeTypes.LERP,
      icon: 'lerp',
      text: 'Lerp',
    },
    {
      type: NodeTypes.CLAMP,
      icon: '{x}',
      text: 'Clamp',
    },
    {
      type: NodeTypes.ROUND,
      icon: '~',
      text: 'Round',
    },
    {
      type: NodeTypes.RANDOM,
      icon: '?',
      text: 'Random',
    },
    {
      type: NodeTypes.POW,
      icon: 'a^b',
      text: 'Power',
    },
    {
      type: NodeTypes.FLUID_VALUE,
      icon: '|-|',
      text: 'Fluid',
    },
  ],
  array: [
    {
      type: NodeTypes.DOT_PROP,
      icon: '[x,y]',
      text: 'Access Array',
    },
    {
      type: NodeTypes.ARRIFY,
      icon: '[]',
      text: 'Arrify',
    },
    {
      type: NodeTypes.COUNT,
      icon: '1,2',
      text: 'Count',
    },
    {
      type: NodeTypes.ARRAY_INDEX,
      icon: '[.]',
      text: 'Index Array',
    },
    {
      type: NodeTypes.REVERSE,
      icon: '[↔]',
      text: 'Reverse Array',
    },
    {
      type: NodeTypes.SLICE,
      icon: '[a,b]',
      text: 'Slice Array',
    },
    {
      type: NodeTypes.SORT,
      icon: <ArrowDownIcon />,
      text: 'Sort Array',
    },
    {
      type: NodeTypes.JOIN,
      icon: '[,]',
      text: 'Join Array',
    },
    {
      type: NodeTypes.CONCAT,
      icon: '[][]',
      text: 'Concat Array',
    },
  ],
  sets: [
    {
      type: NodeTypes.INLINE_SET,
      data: {
        tokens: [],
      },
      text: 'Empty',
      icon: <PlusIcon />,
    },
    {
      type: NodeTypes.FLATTEN,
      icon: '> <',
      text: 'Flatten',
    },
    {
      type: NodeTypes.ALIAS,
      icon: '{..}',
      text: 'Resolve Alias',
    },
    {
      type: NodeTypes.REMAP,
      icon: 'x->y',
      text: 'Remap',
    },
    {
      type: NodeTypes.INVERT_SET,
      icon: '-+',
      text: 'Invert',
    },
    {
      type: NodeTypes.SELECT_TOKEN,
      icon: '?',
      text: 'Select Token',
    },
  ],
  logic: [
    {
      type: NodeTypes.IF,
      icon: '?',
      text: 'If',
    },
    {
      type: NodeTypes.SWITCH,
      icon: '</>',
      text: 'Switch',
    },
    {
      type: NodeTypes.NOT,
      icon: '!x',
      text: 'Not',
    },
    {
      type: NodeTypes.AND,
      icon: 'a&b',
      text: 'And',
    },
    {
      type: NodeTypes.OR,
      icon: 'a|b',
      text: 'Or',
    },
    {
      type: NodeTypes.COMPARE,
      icon: 'a=b',
      text: 'Compare',
    },
  ],
  color: [
    {
      type: NodeTypes.CONTRASTING,
      icon: <Half2Icon />,
      text: 'Contrasting Color',
    },
    {
      type: NodeTypes.SCALE,
      icon: '...',
      text: 'Generate Scale',
    },
    {
      type: NodeTypes.CREATE_COLOR,
      icon: <ColorWheelIcon />,
      text: 'Create Color',
    },
    {
      type: NodeTypes.CONVERT_COLOR,
      icon: <ColorWheelIcon />,
      text: 'Convert Color',
    },
    {
      type: NodeTypes.BLEND,
      icon: <BlendingModeIcon />,
      text: 'Blend',
    },
    {
      type: NodeTypes.ADVANCED_BLEND,
      icon: <BlendingModeIcon />,
      text: 'Advanced Blend',
    },
    {
      type: NodeTypes.EXTRACT,
      icon: <ImageIcon />,
      text: 'Extract',
    },
    {
      type: NodeTypes.WHEEL,
      icon: <ColorWheelIcon />,
      text: 'Generate Color Wheel',
    },
    {
      type: NodeTypes.POLINE,
      icon: <ColorWheelIcon />,
      text: 'Generate Color Palette (Poline)',
    },
    {
      type: NodeTypes.COLOR_DISTANCE,
      icon: 'x>y',
      text: 'Distance',
    },
  ],
  accessibility: [
    {
      type: NodeTypes.CONTRAST,
      icon: <Half2Icon />,
      text: 'Contast',
    },
    {
      type: NodeTypes.COLOR_BLINDNESS,
      icon: <EyeNoneIcon />,
      text: 'Color Blindness',
    },
    {
      type: NodeTypes.BASE_FONT_SIZE,
      icon: 'Aa',
      text: 'Base Font Size',
    },
  ],
  series: [
    {
      type: NodeTypes.ARITHMETIC_SERIES,
      icon: 'x+y',
      text: 'Arithmetic Series',
    },
    {
      type: NodeTypes.GEOMETRIC_SERIES,
      icon: 'x*y',
      text: 'Geometric Series',
    },
    {
      type: NodeTypes.HARMONIC_SERIES,
      icon: 'x^y',
      text: 'Harmonic Series',
    },
  ],
  string: [
    {
      type: NodeTypes.JOIN_STRING,
      icon: 'a+a',
      text: 'Join String',
    },
    {
      type: NodeTypes.UPPERCASE,
      icon: 'uU',
      text: 'Uppercase',
    },
    {
      type: NodeTypes.LOWER,
      icon: 'Uu',
      text: 'Lowercase',
    },
    {
      type: NodeTypes.REGEX,
      icon: '^$',
      text: 'Regex',
    },
  ],
};
