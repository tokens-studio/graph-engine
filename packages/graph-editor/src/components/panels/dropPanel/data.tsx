import { Plus, Star } from 'iconoir-react';
import { NodeTypes } from '@tokens-studio/graph-engine';
import React from 'react';
import preset from '@/data/preset.js';
import tinyCore from '@/data/tiny/core.js';
import tinyCoreDark from '@/data/tiny/dark.js';
import tinyCoreLight from '@/data/tiny/light.js';
import { nodes } from '@tokens-studio/graph-engine';
import { observable } from 'mobx';
import { flatten } from '@/utils/index.js';

//@ts-ignore
const presetFlattened = flatten(preset);
//@ts-ignore
const tinyCoreFlattened = flatten(tinyCore);
//@ts-ignore
const tinyCoreLightFlattened = flatten(tinyCoreLight);
//@ts-ignore
const tinyCoreDarkFlattened = flatten(tinyCoreDark);

const INLINE_SET = 'studio.tokens.design.inline';

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
 *          type: 'studio.tokens.generic.input',
 *          icon: icons['studio.tokens.generic.input'],
 *          text: 'Input',
 *      }],
 * }];
 */

const knownDocs = {
  "studio.tokens.generic.input":
    'https://docs.graph.tokens.studio/nodes/generic-nodes/input',
};

const knownIcons = {
  "studio.tokens.generic.input": <Star />,
  "studio.tokens.generic.output": <Star />,
  "studio.tokens.css.function": 'x()',
};
function CapitalCase(string) {
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
            title: CapitalCase(group),
            key: group,
            items: [],
          });
        }
        acc[group].items.push(
          new PanelItem({
            type: node.type,
            icon: knownIcons[node.type] || '??',
            text: CapitalCase(
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
          type: INLINE_SET,
          data: {
            value: tinyCoreFlattened,
            title: 'Tiny Core',
          },
          icon: <Plus />,
          text: 'Tiny Core',
        }),
        new PanelItem({
          type: INLINE_SET,
          data: {
            value: tinyCoreLightFlattened,
            title: 'Tiny Light',
          },
          icon: <Plus />,
          text: 'Tiny Light',
        }),
        new PanelItem({
          type: INLINE_SET,
          data: {
            value: tinyCoreDarkFlattened,
            title: 'Tiny Dark',
          },
          icon: <Plus />,
          text: 'Tiny Dark',
        }),
        new PanelItem({
          type: INLINE_SET,
          data: {
            value: presetFlattened,
            title: 'Preset tokens',
          },
          icon: <Plus />,
          text: 'Preset Tokens',
        }),
      ],
    }),
  ] as PanelGroup[]);

  return new DropPanelStore(added);
};