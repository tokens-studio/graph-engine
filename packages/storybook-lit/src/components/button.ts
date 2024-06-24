import { LitElement, html, unsafeCSS } from 'lit';
import { Theme, themeContext } from './context';
import { consume } from '@lit/context';
import { customElement } from 'lit/decorators.js';
import { defaultValues, keyOrder, mode, theme } from './button.generated';
import cssstyles from './base.css?inline';

export interface ButtonProps {
	theme?: theme;
	mode?: mode;
	children?: string;
}

@customElement('tok-button')
export default class Button extends LitElement {
	static styles = [unsafeCSS(cssstyles)];
	@consume({ context: themeContext, subscribe: true })
	public ctx?: Theme;

	render() {
		return html`
			<button
				type="button"
				class=${this.ctx?.useStyledClass('button', keyOrder, defaultValues)}
			>
				<slot></slot>
			</button>
		`;
	}
}
