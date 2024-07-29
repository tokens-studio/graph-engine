/* eslint-disable react-hooks/rules-of-hooks */
import { LitElement, html } from 'lit';

import { ContextConsumer } from '@lit/context';
import { ContextProvider } from '@lit/context';
import { createContext } from '@lit/context';
import { customElement, property } from 'lit/decorators.js';
import cx from 'classnames';

export type ContextDefaults = Record<string, string>;

export type Theme = {
	useStyledClass: (
		baseClass: string,
		keys: string[],
		defaults: ContextDefaults
	) => string;
	context: Record<string, unknown>;
};
export const useStyledClass =
	(context: Record<string, unknown>) =>
	(baseClass: string, keys: string[], defaults: ContextDefaults) => {
		//We expect the context to be a key values object
		//We need to extract values from the context based on the ordering of the keys

		const theme = keys.map(key => context[key] || defaults[key]).join('-');

		const klass = `${baseClass}--${theme}`;

		return cx(baseClass, klass);
	};

export const themeContext = createContext<Theme>('theme');

@customElement('theme-context')
export class ThemeContext extends LitElement {
	private _values = {};

	@property({ attribute: false })
	set values(vals: Record<string, unknown>) {
		const context = {
			...(this.parentCtx.value?.context || {}),
			...vals
		};
		const ctx = {
			context,
			useStyledClass: useStyledClass(context)
		};

		this.provider.setValue(ctx);
		this._values = vals;
	}

	get values() {
		return this._values;
	}

	parentCtx = new ContextConsumer(this, {
		context: themeContext,
		subscribe: true,
		callback: value => {
			const context = {
				...value.context,
				...this._values
			};

			const ctx = {
				context,
				useStyledClass: useStyledClass(context)
			};

			this.provider.setValue(ctx);
		}
	});
	provider = new ContextProvider(this, {
		context: themeContext,
		initialValue: { context: {}, useStyledClass: useStyledClass({}) }
	});

	render() {
		return html`<slot></slot>`;
	}
}
