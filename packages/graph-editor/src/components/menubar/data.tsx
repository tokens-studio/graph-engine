import { action, observable } from 'mobx';
export type IMenuItem = {
  name: string;
  render: (rest: object) => React.ReactNode | JSX.Element;
};

export type ISubMenu = {
  title: string;
  name: string;
  items: (MenuItem | Seperator)[];
};
export type IMenu = {
  items: SubMenu[];
};

export class Seperator {}

export class MenuItem {
  @observable
  name: string;
  @observable
  render: (rest: object) => React.ReactNode;
  constructor(vals: IMenuItem) {
    this.name = vals.name;
    this.render = vals.render;
  }
}

export class SubMenu {
  @observable
  public items: (MenuItem | Seperator)[] = [];
  @observable
  public title: string;
  @observable
  public name: string;

  constructor(vals: ISubMenu) {
    this.title = vals.title;
    this.name = vals.name;
    this.items = vals.items;
  }

  @action
  setItems(items: (MenuItem | Seperator)[]) {
    this.items = items;
  }
}

export class Menu {
  @observable
  public items: SubMenu[];

  constructor(vals: IMenu) {
    this.items = vals.items || [];
  }

  setItems(items: SubMenu[]) {
    this.items = items;
  }
}
