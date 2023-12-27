import { ButtonIcon, PlusIcon } from '@radix-ui/react-icons';
import { NodeTypes } from '@tokens-studio/graph-engine';
import React from 'react';
import preset from '@/data/preset.ts';
import tinyCore from '@/data/tiny/core.ts';
import tinyCoreDark from '@/data/tiny/dark.ts';
import tinyCoreLight from '@/data/tiny/light.ts';
import { nodes } from '@tokens-studio/graph-engine';
import { observable } from 'mobx';
import { flatten } from '@/utils/index.ts';

//@ts-ignore
const presetFlattened = flatten(preset);
//@ts-ignore
const tinyCoreFlattened = flatten(tinyCore);
//@ts-ignore
const tinyCoreLightFlattened = flatten(tinyCoreLight);
//@ts-ignore
const tinyCoreDarkFlattened = flatten(tinyCoreDark);

export interface IPanelItem {
  type: string;
  icon: string | JSX.Element;
  text: string;
  description?: string;
  docs?: string;
  data?: {
    identifier?: string;
    value?: any[];
    title?: string;
  };
}

export class PanelItem {
  @observable
  type: string;
  @observable
  icon: string | JSX.Element;
  @observable
  text: string;
  @observable
  description?: string;
  @observable
  docs?: string;
  @observable
  data?: {
    identifier?: string;
    value?: any[];
    title?: string;
  };
  constructor(vals: IPanelItem) {
    this.type = vals.type;
    this.icon = vals.icon;
    this.text = vals.text;
    this.description = vals.description;
    this.docs = vals.docs;
    this.data = vals.data;
  }
}

export interface IPanelGroup {
  title: string;
  key: string;
  items: PanelItem[];
}
export class PanelGroup {
  @observable
  title: string;
  @observable
  key: string;
  @observable
  items: PanelItem[];
  @observable
  expanded: boolean = false;

  constructor(vals: IPanelGroup) {
    this.title = vals.title;
    this.key = vals.key;
    this.items = vals.items;
  }
}

export class DropPanelStore {
  @observable
  groups: PanelGroup[] = [];

  constructor(vals: PanelGroup[]) {
    this.groups = vals;
  }
}

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

const knownDocs = {
  [NodeTypes.INPUT]:
    'https://docs.graph.tokens.studio/nodes/generic-nodes/input',
};

const knownIcons = {
  [NodeTypes.INPUT]: <ButtonIcon />,
  [NodeTypes.OUTPUT]: <ButtonIcon />,
  [NodeTypes.CSS_FUNCTIONS]: 'x()',
};

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const defaultPanelGroupsFactory = (): DropPanelStore => {
  const auto = Object.values<PanelGroup>(
    nodes.reduce((acc, node) => {
      const defaultGroup = node.type.split('.');
      const groups = node.groups || [defaultGroup[defaultGroup.length - 2]];

      groups.forEach((group) => {
        //If the group does not exist, create it
        if (!acc[group]) {
          acc[group] = new PanelGroup({
            title: capitalizeFirstLetter(group),
            key: group,
            items: [],
          });
        }
        acc[group].items.push(
          new PanelItem({
            type: node.type,
            icon: knownIcons[node.type] || '??',
            text: capitalizeFirstLetter(
              node.title || defaultGroup[defaultGroup.length - 1],
            ),
            description: node.description,
            docs: knownDocs[node.type],
          }),
        );
      });
      return acc;
    }, {} as Record<string, PanelGroup>),
  );

  const added = auto.concat([
    new PanelGroup({
      title: 'Basic Tokens',
      key: 'basic',
      items: [
        new PanelItem({
          type: NodeTypes.INLINE_SET,
          data: {
            value: tinyCoreFlattened,
            title: 'Tiny Core',
          },
          icon: <PlusIcon />,
          text: 'Tiny Core',
        }),
        new PanelItem({
          type: NodeTypes.INLINE_SET,
          data: {
            value: tinyCoreLightFlattened,
            title: 'Tiny Light',
          },
          icon: <PlusIcon />,
          text: 'Tiny Light',
        }),
        new PanelItem({
          type: NodeTypes.INLINE_SET,
          data: {
            value: tinyCoreDarkFlattened,
            title: 'Tiny Dark',
          },
          icon: <PlusIcon />,
          text: 'Tiny Dark',
        }),
        new PanelItem({
          type: NodeTypes.INLINE_SET,
          data: {
            value: presetFlattened,
            title: 'Preset tokens',
          },
          icon: <PlusIcon />,
          text: 'Preset Tokens',
        }),
      ],
    }),
  ] as PanelGroup[]);

  return new DropPanelStore(added);
};

//   [
//     {
//       title: 'Generic',
//       key: 'generic',
//       items: [
//         {
//           type: NodeTypes.INPUT,
//           icon: icons[NodeTypes.INPUT],
//           text: 'Input',
//           docs: ,
//         },
//         {
//           type: NodeTypes.OUTPUT,
//           icon: <ButtonIcon />,
//           text: 'Output',
//         },
//         {
//           type: NodeTypes.CONSTANT,
//           icon: <ButtonIcon />,
//           text: 'Constant',
//         },
//         {
//           type: NodeTypes.ENUMERATED_INPUT,
//           icon: <ButtonIcon />,
//           text: 'Enumerated Constant',
//         },

//         {
//           type: NodeTypes.CSS_FUNCTIONS,
//           icon: ,
//           text: 'CSS Function',
//         },
//         {
//           type: NodeTypes.OBJECTIFY,
//           icon: '{ }',
//           text: 'Objectify',
//         },
//         {
//           type: NodeTypes.SPREAD,
//           icon: '...',
//           text: 'Spread',
//         },
//         {
//           type: NodeTypes.PASS_UNIT,
//           icon: 'px',
//           text: 'Pass Unit',
//         },
//         {
//           type: NodeTypes.PARSE_UNIT,
//           icon: '{}px',
//           text: 'Parse Unit',
//         },
//         {
//           type: NodeTypes.JSON,
//           icon: '{/}',
//           text: 'JSON',
//         },
//       ],
//     },
//     {
//       title: 'CSS',
//       key: 'css',
//       items: [
//         {
//           type: NodeTypes.CSS_MAP,
//           icon: './x',
//           text: 'CSS Map',
//           docs: 'https://docs.graph.tokens.studio/nodes/generic-nodes/css-map',
//         },
//         {
//           type: NodeTypes.CSS_BOX,
//           icon: <BoxIcon />,
//           text: 'CSS Box',
//         },
//         {
//           type: NodeTypes.CSS_FUNCTIONS,
//           icon: 'x()',
//           text: 'CSS Function',
//         },
//       ],
//     },
//     {
//       title: 'Math',
//       key: 'math',
//       items: [
//         {
//           type: NodeTypes.ADD,
//           icon: '+',
//           text: 'Add',
//         },
//         {
//           type: NodeTypes.SUBTRACT,
//           icon: '-',
//           text: 'Subtract',
//         },
//         {
//           type: NodeTypes.MULTIPLY,
//           icon: 'x',
//           text: 'Multiply',
//         },
//         {
//           type: NodeTypes.DIV,
//           icon: '/',
//           text: 'Divide',
//         },
//         {
//           type: NodeTypes.MOD,
//           icon: '%',
//           text: 'Modulo',
//         },
//         {
//           type: NodeTypes.SIN,
//           icon: 'sin',
//           text: 'Sin',
//         },
//         {
//           type: NodeTypes.COS,
//           icon: 'cos',
//           text: 'Cos',
//         },
//         {
//           type: NodeTypes.TAN,
//           icon: 'tan',
//           text: 'Tan',
//         },
//         {
//           type: NodeTypes.ABS,
//           icon: '||',
//           text: 'Absolute',
//         },
//         {
//           type: NodeTypes.LERP,
//           icon: 'lerp',
//           text: 'Lerp',
//         },
//         {
//           type: NodeTypes.CLAMP,
//           icon: '{x}',
//           text: 'Clamp',
//         },
//         {
//           type: NodeTypes.ROUND,
//           icon: '~',
//           text: 'Round',
//         },
//         {
//           type: NodeTypes.RANDOM,
//           icon: '?',
//           text: 'Random',
//         },
//         {
//           type: NodeTypes.POW,
//           icon: 'a^b',
//           text: 'Power',
//         },
//         {
//           type: NodeTypes.FLUID_VALUE,
//           icon: '|-|',
//           text: 'Fluid',
//         },
//       ],
//     },
//     {
//       title: 'Array',
//       key: 'array',
//       items: [
//         {
//           type: NodeTypes.DOT_PROP,
//           icon: '[x,y]',
//           text: 'Access Array',
//         },
//         {
//           type: NodeTypes.ARRIFY,
//           icon: '[]',
//           text: 'Arrify',
//         },
//         {
//           type: NodeTypes.COUNT,
//           icon: '1,2',
//           text: 'Count',
//         },
//         {
//           type: NodeTypes.ARRAY_INDEX,
//           icon: '[.]',
//           text: 'Index Array',
//         },
//         {
//           type: NodeTypes.REVERSE,
//           icon: '[↔]',
//           text: 'Reverse Array',
//         },
//         {
//           type: NodeTypes.SLICE,
//           icon: '[a,b]',
//           text: 'Slice Array',
//         },
//         {
//           type: NodeTypes.SORT,
//           icon: <ArrowDownIcon />,
//           text: 'Sort Array',
//         },
//         {
//           type: NodeTypes.JOIN,
//           icon: '[,]',
//           text: 'Join Array',
//         },
//         {
//           type: NodeTypes.CONCAT,
//           icon: '[][]',
//           text: 'Concat Array',
//         },
//         {
//           type: NodeTypes.ARRAY_PASS_UNIT,
//           icon: '[]px',
//           text: 'Array Pass Unit',
//         },
//         {
//           type: NodeTypes.NAME,
//           icon: '[][]',
//           text: 'Incremental name array',
//         },
//       ],
//     },
//     {
//       title: 'Sets',
//       key: 'sets',
//       items: [
//         {
//           type: NodeTypes.INLINE_SET,
//           data: {
//             tokens: [],
//           },
//           text: 'Inline Set',
//           icon: <PlusIcon />,
//         },
//         {
//           type: NodeTypes.FLATTEN,
//           icon: '> <',
//           text: 'Flatten',
//         },
//         {
//           type: NodeTypes.ALIAS,
//           icon: '{..}',
//           text: 'Resolve Alias',
//         },
//         {
//           type: NodeTypes.REMAP,
//           icon: 'x->y',
//           text: 'Remap',
//         },
//         {
//           type: NodeTypes.INVERT_SET,
//           icon: '-+',
//           text: 'Invert',
//         },
//         {
//           type: NodeTypes.EXTRACT_SINGLE_TOKEN,
//           icon: '?1',
//           text: 'Extract Single Token',
//         },
//         {
//           type: NodeTypes.EXTRACT_TOKENS,
//           icon: '?n',
//           text: 'Extract Tokens',
//         },
//         {
//           type: NodeTypes.GROUP,
//           icon: '{a:}',
//           text: 'Group Token',
//         },
//         {
//           type: NodeTypes.UNGROUP,
//           icon: '{a:}',
//           text: 'Ungroup Token',
//         },
//       ],
//     },
//     {
//       title: 'Logic',
//       key: 'logic',

//       items: [
//         {
//           type: NodeTypes.IF,
//           icon: '?',
//           text: 'If',
//         },
//         {
//           type: NodeTypes.SWITCH,
//           icon: '</>',
//           text: 'Switch',
//         },
//         {
//           type: NodeTypes.NOT,
//           icon: '!x',
//           text: 'Not',
//         },
//         {
//           type: NodeTypes.AND,
//           icon: 'a&b',
//           text: 'And',
//         },
//         {
//           type: NodeTypes.OR,
//           icon: 'a|b',
//           text: 'Or',
//         },
//         {
//           type: NodeTypes.COMPARE,
//           icon: 'a=b',
//           text: 'Compare',
//         },
//       ],
//     },
//     {
//       title: 'Color',
//       key: 'color',
//       items: [
//         {
//           type: NodeTypes.CONTRASTING,
//           icon: <Half2Icon />,
//           text: 'Contrasting Color',
//         },
//         {
//           type: NodeTypes.CONTRASTING_FROM_SET,
//           icon: <Half2Icon />,
//           text: 'Contrasting From Set',
//         },
//         {
//           type: NodeTypes.SCALE,
//           icon: '...',
//           text: 'Generate Scale',
//         },
//         {
//           type: NodeTypes.CREATE_COLOR,
//           icon: <ColorWheelIcon />,
//           text: 'Create Color',
//         },
//         {
//           type: NodeTypes.CONVERT_COLOR,
//           icon: <ColorWheelIcon />,
//           text: 'Convert Color',
//         },
//         {
//           type: NodeTypes.BLEND,
//           icon: <BlendingModeIcon />,
//           text: 'Blend',
//         },
//         {
//           type: NodeTypes.ADVANCED_BLEND,
//           icon: <BlendingModeIcon />,
//           text: 'Advanced Blend',
//         },
//         {
//           type: NodeTypes.EXTRACT,
//           icon: <ImageIcon />,
//           text: 'Extract',
//         },
//         {
//           type: NodeTypes.WHEEL,
//           icon: <ColorWheelIcon />,
//           text: 'Generate Color Wheel',
//         },
//         {
//           type: NodeTypes.POLINE,
//           icon: <ColorWheelIcon />,
//           text: 'Poline Color Scale',
//         },
//         {
//           type: NodeTypes.COLOR_DISTANCE,
//           icon: 'x>y',
//           text: 'Distance',
//         },
//         {
//           type: NodeTypes.COLOR_NAME,
//           icon: 'red',
//           text: 'Name',
//         },
//         {
//           type: NodeTypes.NEAREST_TOKENS,
//           icon: 'x>y',
//           text: 'Nearest Tokens',
//         },
//         {
//           type: NodeTypes.SET_COLOR_LUMINANCE,
//           icon: '+/-l',
//           text: 'Set Color Value',
//         },
//       ],
//     },
//     {
//       title: 'Accessibility',
//       key: 'accessibility',
//       items: [
//         {
//           type: NodeTypes.BASE_FONT_SIZE,
//           icon: <FontSizeIcon />,
//           text: 'Base Font',
//         },
//         {
//           type: NodeTypes.CONTRAST,
//           icon: <Half2Icon />,
//           text: 'Contrast',
//         },
//         {
//           type: NodeTypes.COLOR_BLINDNESS,
//           icon: <EyeNoneIcon />,
//           text: 'Color Blindness',
//         },
//       ],
//     },
//     {
//       title: 'Series',
//       key: 'series',
//       items: [
//         {
//           type: NodeTypes.ARITHMETIC_SERIES,
//           icon: 'x+y',
//           text: 'Arithmetic Series',
//         },
//         {
//           type: NodeTypes.GEOMETRIC_SERIES,
//           icon: 'x*y',
//           text: 'Geometric Series',
//         },
//         {
//           type: NodeTypes.HARMONIC_SERIES,
//           icon: 'x^y',
//           text: 'Harmonic Series',
//         },
//       ],
//     },
//     {
//       title: 'String',
//       key: 'string',
//       items: [
//         {
//           type: NodeTypes.JOIN_STRING,
//           icon: 'a+a',
//           text: 'Join String',
//         },
//         {
//           type: NodeTypes.SPLIT_STRING,
//           icon: 'a|a',
//           text: 'Split String',
//         },
//         {
//           type: NodeTypes.UPPERCASE,
//           icon: 'uU',
//           text: 'Uppercase',
//         },
//         {
//           type: NodeTypes.LOWER,
//           icon: 'Uu',
//           text: 'Lowercase',
//         },
//         {
//           type: NodeTypes.REGEX,
//           icon: '^$',
//           text: 'Regex',
//         },
//         {
//           type: NodeTypes.STRINGIFY,
//           icon: '"a"',
//           text: 'Stringify',
//         },
//       ],
//     },
//
// ]
