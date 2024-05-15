import { LitElement, html, unsafeCSS } from 'lit';
import cssstyles from './base.css?inline';
import { customElement } from 'lit/decorators.js';
import { consume } from '@lit/context';
import { Theme, themeContext } from './context';
import { defaultValues, keyOrder, mode, theme } from './button.generated';



export interface ButtonProps {
  theme?: theme;
  mode?: mode;
  children?: string
}

@customElement('tok-button')
export default class Button extends LitElement {


  static styles = [unsafeCSS(cssstyles)];
  @consume({ context: themeContext, subscribe: true })

  public ctx?: Theme

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

};
