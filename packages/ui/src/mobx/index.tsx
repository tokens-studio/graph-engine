import { IObservableValue, makeAutoObservable, observable } from 'mobx';
import { configure } from 'mobx';

configure({
  enforceActions: 'never',
  // computedRequiresReaction: true,
  // reactionRequiresObservable: true,
  // observableRequiresReaction: true,
  // disableErrorBoundaries: true
});

class UIState {
  theme: IObservableValue<string>;
  showExamplePicker: IObservableValue<boolean>;
  showNodesPanel: IObservableValue<boolean>;
  rootStore: GlobalState;
  constructor(rootStore: GlobalState) {
    this.theme = observable.box('dark');
    this.showExamplePicker = observable.box(false);
    this.showNodesPanel = observable.box(true);
    this.rootStore = rootStore;
  }
}

export class GlobalState {
  ui: UIState;
  constructor() {
    this.ui = new UIState(this);

    makeAutoObservable(this);
  }
}

export const globalState = new GlobalState();

export default globalState;
