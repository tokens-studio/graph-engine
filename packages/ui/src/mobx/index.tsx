import { IObservableValue, makeAutoObservable, observable } from 'mobx';
import { ImperativeEditorRef } from '@tokens-studio/graph-editor';
import { makePersistable } from 'mobx-persist-store';

class UIState {
	theme: string;
	showExamplePicker: boolean;
	showNodesPanel: boolean;
	rootStore: GlobalState;
	constructor(rootStore: GlobalState) {
		this.theme = 'dark';
		this.showExamplePicker = false;
		this.showNodesPanel = true;
		makeAutoObservable(this, {
			theme: true,
			showExamplePicker: true,
			showNodesPanel: true
		});
		this.rootStore = rootStore;
	}
}

class RefState {
	editor: IObservableValue<ImperativeEditorRef | null>;
	rootStore: GlobalState;
	constructor(rootStore: GlobalState) {
		this.editor = observable.box(null);
		this.rootStore = rootStore;
	}
}

class JourneyState {
	showJourney: boolean;
	rootStore: GlobalState;
	constructor(rootStore: GlobalState) {
		this.showJourney = true;
		this.rootStore = rootStore;
		makeAutoObservable(this, {
			showJourney: true
		});
		if (typeof window !== 'undefined') {
			makePersistable(this, {
				name: 'state-journey',
				properties: ['showJourney'],
				storage: window.localStorage
			});
		}
	}
}

export class GlobalState {
	refs: RefState;
	ui: UIState;
	journey: JourneyState;
	constructor() {
		this.ui = new UIState(this);
		this.refs = new RefState(this);
		this.journey = new JourneyState(this);

		makeAutoObservable(this);
	}
}

export const globalState = new GlobalState();

export default globalState;
