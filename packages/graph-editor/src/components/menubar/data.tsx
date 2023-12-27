import { observable } from 'mobx';
export type IItem = {
  name: string;
  render: () => React.ReactNode | JSX.Element;
};

export type ISubMenu = {
  title: string;
  name: string;
  items: (Item | Seperator)[];
};
export type IMenu = {
  items: SubMenu[];
};

export class Seperator {}

export class Item {
  @observable
  name: string;
  @observable
  render: () => React.ReactNode;
  constructor(vals: IItem) {
    this.name = vals.name;
    this.render = vals.render;
  }
}

export class SubMenu {
  @observable
  public items: (Item | Seperator)[] = [];
  @observable
  public title: string;
  @observable
  public name: string;

  constructor(vals: ISubMenu) {
    this.title = vals.title;
    this.name = vals.name;
    this.items = vals.items;
  }
}

export class Menu {
  @observable
  public items: SubMenu[];

  constructor(vals: IMenu) {
    this.items = vals.items || [];
  }
}
