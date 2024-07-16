import { GROUP } from '@/ids.js';
import { nodes } from '@tokens-studio/graph-engine';
import { observable } from 'mobx';

export interface IPanelItem {
  type: string;
  icon?: string | JSX.Element;
  text: string;
  description?: string;
  docs?: string;
  data?: {
    identifier?: string;
    value?: unknown[];
    title?: string;
  };
}

export class PanelItem {
  @observable
  type: string;
  @observable
  icon?: string | JSX.Element;
  @observable
  text: string;
  @observable
  description?: string;
  @observable
  docs?: string;
  @observable
  data?: {
    identifier?: string;
    value?: unknown[];
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
  icon?: string | JSX.Element;
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

  icon?: string | JSX.Element;

  constructor(vals: IPanelGroup) {
    this.title = vals.title;
    this.key = vals.key;
    this.items = vals.items;
    this.icon = vals.icon;
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

function CapitalCase(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const nodesToIgnoreInPanel = [GROUP];

export const defaultPanelGroupsFactory = (): DropPanelStore => {
  const auto = Object.values<PanelGroup>(
    nodes.filter(node => !nodesToIgnoreInPanel.includes(node.type))
      .reduce(
        (acc, node) => {
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
                text: CapitalCase(
                  node.title || defaultGroup[defaultGroup.length - 1],
                ),
                description: node.description,
              }),
            );
          });
          return acc;
        },
        {} as Record<string, PanelGroup>,
      ),
  );

  return new DropPanelStore(auto);
};
