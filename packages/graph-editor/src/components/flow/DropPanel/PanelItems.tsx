import {
  ArrowDownIcon,
  BlendingModeIcon,
  ButtonIcon,
  ColorWheelIcon,
  EyeNoneIcon,
  Half2Icon,
  FontSizeIcon,
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

export interface PanelItem<T extends NodeTypes = NodeTypes> {
  type: NodeTypes;
  icon: string | JSX.Element;
  text: string;
  description?: string;
  docs?: string;
  data?: {
    identifier?: string;
    tokens?: any[];
    title?: string;
  };
}

export interface PanelGroup {
  title: string;
  key: string;
  items: PanelItem[];
}

export type PanelItems = Record<string, PanelItem[]>;

/**
 * Prepolated panel items. Do not modify this directly, rather extend it with your own items
 * @example
 * ```tsx
 *
 * const myPanelItems = [
 *  ...defaultPanelItems,
 * {
 *      title: 'My Custom Group',
 *      key: 'myCustomGroup',
 *      items: [
 *      {
 *          type: NodeTypes.INPUT,
 *          icon: icons[NodeTypes.INPUT],
 *          text: 'Input',
 *      }],
 * }];
 */
export const defaultPanelItems: PanelGroup[] = [
  {
    title: 'Generic',
    key: 'generic',
    items: [
      {
        type: NodeTypes.INPUT,
        icon: icons[NodeTypes.INPUT],
        text: 'Input',
        description:
          'Allows you to provide initial values for the whole graph. An input node can be used only once at the start of the graph. You can use this node to set brand decisions or any initial values.',
        docs: 'https://docs.graph.tokens.studio/nodes/generic-nodes/input',
      },
      {
        type: NodeTypes.OUTPUT,
        icon: <ButtonIcon />,
        text: 'Output',
        description: 'Output node allows you to output a value from the graph. An output node can be used only once at the end of the graph. You can use this node to output a value from the graph.',
      },
      {
        type: NodeTypes.CONSTANT,
        icon: <ButtonIcon />,
        text: 'Constant',
        description: 'Constant node allows you to provide a constant value. You can use this node to set a constant value for a specific property.',
      },
      {
        type: NodeTypes.ENUMERATED_INPUT,
        icon: <ButtonIcon />,
        text: 'Enumerated Constant',
        description:
          'Represents a node that holds a set of predefined values (enumerated values) and maintains a current value among them.',
      },
      {
        type: NodeTypes.CSS_MAP,
        icon: './x',
        text: 'CSS Map',
        description:
          'Exposes all the css properties. You can link the input of any other node to the any property that is there in the css map node.',
        docs: 'https://docs.graph.tokens.studio/nodes/generic-nodes/css-map',
      },
      {
        type: NodeTypes.CSS_BOX,
        icon: <BoxIcon />,
        text: 'CSS Box',
        description: 'CSS Box node allows you to generate a CSS box from 4 values.',
      },
      {
        type: NodeTypes.OBJECTIFY,
        icon: '{ }',
        text: 'Objectify',
        description: 'Objectify node allows you to convert multiple inputs to an object.',
      },
      {
        type: NodeTypes.SPREAD,
        icon: '...',
        text: 'Spread',
        description: 'Spread node allows you to spread an object, giving you access to its properties. This node is useful when you want to access a property of an object.',
      },
      {
        type: NodeTypes.PASS_UNIT,
        icon: 'px',
        text: 'Pass Unit',
        description: 'Pass unit node allows you to add units to a number.',
      },
      {
        type: NodeTypes.PARSE_UNIT,
        icon: '{}px',
        text: 'Parse Unit',
        description: 'Parse unit node allows you to seperate units from a number.',
      },
      {
        type: NodeTypes.JSON,
        icon: '{/}',
        text: 'JSON',
      },
    ],
  },
  {
    title: 'Math',
    key: 'math',
    items: [
      {
        type: NodeTypes.ADD,
        icon: '+',
        text: 'Add',
        description: 'Add node allows you to add two or more numbers.',
      },
      {
        type: NodeTypes.SUBTRACT,
        icon: '-',
        text: 'Subtract',
        description: 'Subtract node allows you to subtract two or more numbers.',
      },
      {
        type: NodeTypes.MULTIPLY,
        icon: 'x',
        text: 'Multiply',
        description: 'Multiply node allows you to multiply two or more numbers.',
      },
      {
        type: NodeTypes.DIV,
        icon: '/',
        text: 'Divide',
        description: 'Divide node allows you to divide two or more numbers.',
      },
      {
        type: NodeTypes.MOD,
        icon: '%',
        text: 'Modulo',
        description: 'Modulo node allows you to get the remainder of a division.',
      },
      {
        type: NodeTypes.SIN,
        icon: 'sin',
        text: 'Sin',
        description: 'Sin node allows you to get the sin of a number.',
      },
      {
        type: NodeTypes.COS,
        icon: 'cos',
        text: 'Cos',
        description: 'Cos node allows you to get the sin of a number.',
      },
      {
        type: NodeTypes.TAN,
        icon: 'tan',
        text: 'Tan',
        description: 'Tan node allows you to get the sin of a number.',
      },
      {
        type: NodeTypes.ABS,
        icon: '||',
        text: 'Absolute',
        description: 'Absolute node allows you to get the absolute value of a number. Turning a negative number to positive.',
      },
      {
        type: NodeTypes.LERP,
        icon: 'lerp',
        text: 'Lerp',
        description: 'Lerp (linear interpolation) calculates a value between two numbers, A and B, based on a fraction t. For t = 0 returns A, for t = 1 returns B. It\'s widely used in graphics and animations for smooth transitions.',
      },
      {
        type: NodeTypes.CLAMP,
        icon: '{x}',
        text: 'Clamp',
        description: 'Clamp node allows you to restricts a value within a specified minimum and maximum range.',
      },
      {
        type: NodeTypes.ROUND,
        icon: '~',
        text: 'Round',
        description: 'Round node allows you to adjusts a floating-point number to the nearest integer or to a specified precision.',
      },
      {
        type: NodeTypes.RANDOM,
        icon: '?',
        text: 'Random',
        description: 'Random node allows you to generate a random number between 0 and 1.',
      },
      {
        type: NodeTypes.POW,
        icon: 'a^b',
        text: 'Power',
        description: 'Power node allows you to Raises a base number to the power of an exponent.',
      },
      {
        type: NodeTypes.FLUID_VALUE,
        icon: '|-|',
        text: 'Fluid',
        description: 'Fluid node allows you to dynamically calculates a dimension based on the current viewport width, transitioning smoothly between a minimum and maximum dimension as the viewport width changes within a defined range (from min viewport to max viewport)',
      },
    ],
  },
  {
    title: 'Array',
    key: 'array',
    items: [
      {
        type: NodeTypes.DOT_PROP,
        icon: '[x,y]',
        text: 'Access Array',
        description: "",
      },
      {
        type: NodeTypes.ARRIFY,
        icon: '[]',
        text: 'Arrify',
        description: 'Arrify node converts a multiple items into an array. Useful for ensuring data consistency.',
      },
      {
        type: NodeTypes.COUNT,
        icon: '1,2',
        text: 'Count',
        description: 'Count node gives you the total number of items in an array.',
      },
      {
        type: NodeTypes.ARRAY_INDEX,
        icon: '[.]',
        text: 'Index Array',
        description: 'Index Array node allows to retrieve a specific item from an array by providing its index.',
      },
      {
        type: NodeTypes.REVERSE,
        icon: '[↔]',
        text: 'Reverse Array',
        description: 'Reverse Array node inverts the order of items in an array. For example, turning [A, B, C] into [C, B, A].',
      },
      {
        type: NodeTypes.SLICE,
        icon: '[a,b]',
        text: 'Slice Array',
        description : 'Slice Array node extracts a portion of an array based on start and end indices. Example: Slicing [A, B, C, D] from index 1 to 3 returns [B, C].',
      },
      {
        type: NodeTypes.SORT,
        icon: <ArrowDownIcon />,
        text: 'Sort Array',
        description: 'Sort Array node organizes the items in an array in a specific order, ascending or descendingm, based on a property.',
      },
      {
        type: NodeTypes.JOIN,
        icon: '[,]',
        text: 'Join Array',
        description: 'Join Array node allows you to join the array values into a string, with a separator between each value. For example, joining [A, B, C] with a comma separator returns A, B, C.',
      },
      {
        type: NodeTypes.CONCAT,
        icon: '[][]',
        text: 'Concat Array',
        description: 'Concat Array node allows you to join multiple arrays into a single array.',
      },
    ],
  },
  {
    title: 'Sets',
    key: 'sets',
    items: [
      {
        type: NodeTypes.INLINE_SET,
        data: {
          tokens: [],
        },
        text: 'Inline Set',
        icon: <PlusIcon />,
        description: 'Inline Set node allows you to create a token set container. You can use this node to expand a set of tokens.',
      },
      {
        type: NodeTypes.FLATTEN,
        icon: '> <',
        text: 'Flatten',
        description: 'Flatten node allows you to flatten a set of sets into a single set. For example, turning [[A, B], [C, D]] into [A, B, C, D].',
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
        description: 'Remap node allows you to remap a value to tokens. For example, turning a value of #ff0000 into a token with identifier "red".',
      },
      {
        type: NodeTypes.INVERT_SET,
        icon: '-+',
        text: 'Invert',
        description: 'Invert node allows you to invert a set. For example, turning a set of [A, B, C] into [C, B, A].',
      },
      {
        type: NodeTypes.EXTRACT_TOKENS,
        icon: '?',
        text: 'Select Token',
        description: 'Select Token node allows you to select a token from a set of tokens by providing its identifier.',
      },
      {
        type: NodeTypes.GROUP,
        icon: '{a:}',
        text: 'Group Token',
        description: 'Group Token node allows you to prepend a prefix to a token identifier. For example, turning a token with identifier "color" into "button.color".',
      },
    ],
  },
  {
    title: 'Logic',
    key: 'logic',

    items: [
      {
        type: NodeTypes.IF,
        icon: '?',
        text: 'If',
        description: 'If node allows you to check if a condition is true or false. If the condition is true, the node will return the first value, otherwise it will return the second value.',
      },
      {
        type: NodeTypes.SWITCH,
        icon: '</>',
        text: 'Switch',
        description: 'The Switch node evaluates an input against multiple cases and directs the flow to the corresponding match.',
      },
      {
        type: NodeTypes.NOT,
        icon: '!x',
        text: 'Not',
        description: 'Not node allows you to invert a boolean value. For example, turning true into false.',
      },
      {
        type: NodeTypes.AND,
        icon: 'a&b',
        text: 'And',
        description: 'And node allows you to check if two or more conditions are true. If all conditions are true, the node will return true, otherwise it will return false.',
      },
      {
        type: NodeTypes.OR,
        icon: 'a|b',
        text: 'Or',
        description: 'Or node allows you to check if at least one of the conditions is true. If at least one condition is true, the node will return true, otherwise it will return false.',
      },
      {
        type: NodeTypes.COMPARE,
        icon: 'a=b',
        text: 'Compare',
        description: 'Compare node allows you to compare two values. You have multiple options to compare the values, such as equal, not equal, greater than, less than, etc.',
      },
    ],
  },
  {
    title: 'Color',
    key: 'color',
    items: [
      {
        type: NodeTypes.CONTRASTING,
        icon: <Half2Icon />,
        text: 'Contrasting Color',
      },
      {
        type: NodeTypes.SCALE,
        icon: '...',
        text: 'Generate Scale',
        description: 'Generate Scale node allows you to generate a scale of colors based on a base color and given steps. You can use this node to generate a scale of colors for a specific color property.',
      },
      {
        type: NodeTypes.CREATE_COLOR,
        icon: <ColorWheelIcon />,
        text: 'Create Color',
        description: 'Create Color node allows you to create a color from a set of values. You can use RGB, HSL, ... for the creation of the color.',
      },
      {
        type: NodeTypes.CONVERT_COLOR,
        icon: <ColorWheelIcon />,
        text: 'Convert Color',
        description: 'Convert Color node allows you to convert a color from one color format to another. For example, converting a color from RGB to HSL.',
      },
      {
        type: NodeTypes.BLEND,
        icon: <BlendingModeIcon />,
        text: 'Blend',
        description: 'Blend node allows you to blend a color by using lighten, darken, alpha or mix.',
      },
      {
        type: NodeTypes.ADVANCED_BLEND,
        icon: <BlendingModeIcon />,
        text: 'Advanced Blend',
        description: 'Advanced Blend node allows you to use different blend types like multiply, screen, overlay, etc.',
      },
      {
        type: NodeTypes.EXTRACT,
        icon: <ImageIcon />,
        text: 'Extract',
        description: 'Extract node allows you to extract a color from an image. You can use this node to extract colors from an image and use it in your design system.',
      },
      {
        type: NodeTypes.WHEEL,
        icon: <ColorWheelIcon />,
        text: 'Generate Color Wheel',
        description: 'Generate Color Wheel node allows you to create a color scale based on a base color and rotation in hue. You can use this node to generate a color scale for a specific color property.',
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
        description: 'Distance node allows you to calculate the distance between two colors.',
      },
    ],
  },
  {
    title: 'Accessibility',
    key: 'accessibility',
    items: [
      {
        type: NodeTypes.BASE_FONT_SIZE,
        icon: <FontSizeIcon />,
        text: 'Base Font',
        description: 'Base Font node allows you to calculate the base font size with DIN 1450.',
      },
      {
        type: NodeTypes.CONTRAST,
        icon: <Half2Icon />,
        text: 'Contrast',
        description: 'Contrast node allows you to calculate the contrast ratio between two colors.',
      },
      {
        type: NodeTypes.COLOR_BLINDNESS,
        icon: <EyeNoneIcon />,
        text: 'Color Blindness',
      },
    ],
  },
  {
    title: 'Series',
    key: 'series',
    items: [
      {
        type: NodeTypes.ARITHMETIC_SERIES,
        icon: 'x+y',
        text: 'Arithmetic Series',
        description: 'An "Arithmetic Series" is a sequence of numbers in which the difference between consecutive terms is constant. For instance, in the series 2, 4, 6, 8, the difference is consistently 2.',
      },
      {
        type: NodeTypes.GEOMETRIC_SERIES,
        icon: 'x*y',
        text: 'Geometric Series',
        description: 'A "Geometric Series" is a sequence where each term is found by multiplying the previous one by a fixed, non-zero number. For example, in the series 3, 6, 12, 24, each term is doubled from the previous one.',
      },
      {
        type: NodeTypes.HARMONIC_SERIES,
        icon: 'x^y',
        text: 'Harmonic Series',
        description: 'A "Harmonic Series" is a sequence of numbers whose reciprocals form an arithmetic progression. For example, in the series 1, 1/2, 1/3, 1/4, 1/5, the reciprocals form an arithmetic progression with common difference 1/6.',
      },
    ],
  },
  {
    title: 'String',
    key: 'string',
    items: [
      {
        type: NodeTypes.JOIN_STRING,
        icon: 'a+a',
        text: 'Join String',
        description: 'The "Join String" node combines multiple strings into a single one, with a specified separator or delimiter between them. For example, joining "apple", "banana", and "cherry" with a comma produces "apple,banana,cherry".'
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
        description: 'The "Regex" node allows you to use regular expressions to match patterns in strings. For example, matching a string that starts with "a" and ends with "z".',
      },
    ],
  },
  {
    title: 'Basic Tokens',
    key: 'basic',
    items: [
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
  },
];
