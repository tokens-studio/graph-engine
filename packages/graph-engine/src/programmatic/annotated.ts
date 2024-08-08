import { action, makeObservable, observable } from 'mobx';

export interface IAnnotated {
	annotations?: Record<string, any>;
}

export class Annotated {
	// Used to store arbitrary meta data. Most commonly used in the UI
	public annotations = {} as Record<string, any>;

	constructor(props: IAnnotated) {
		this.annotations = props.annotations || {};

		makeObservable(this, {
			annotations: observable.shallow,
			setAnnotation: action
		});
	}
	setAnnotation(key: string, value: unknown) {
		this.annotations[key] = value;
	}
}
