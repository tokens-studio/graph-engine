import { ImperativeEditorRef } from '@tokens-studio/graph-editor';
import { action, makeAutoObservable, makeObservable, observable } from 'mobx';
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
		makeObservable(this, {
			theme: observable.ref,
			showExamplePicker: observable.ref,
			showNodesPanel: observable.ref
		});
		this.rootStore = rootStore;
	}
}

export class RefState {
	editor: ImperativeEditorRef | null = null;
	rootStore: GlobalState;
	constructor(rootStore: GlobalState) {
		this.rootStore = rootStore;

		makeObservable(this, {
			editor: observable.ref,
			setEditor: action
		});
	}
	setEditor(editor: ImperativeEditorRef) {
		this.editor = editor;
	}
}

class JourneyState {
	showJourney: boolean;
	rootStore: GlobalState;
	constructor(rootStore: GlobalState) {
		this.showJourney = true;
		this.rootStore = rootStore;
		makeObservable(this, {
			showJourney: observable.ref
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
