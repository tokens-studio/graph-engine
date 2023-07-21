// import { ScopedElementsMixin } from '@open-wc/scoped-elements';
import { LitElement, html } from 'lit';
import { consume } from '@lit-labs/context';
import { customElement, property } from 'lit/decorators.js';
import { tokensContext } from './context.ts';

@customElement('wc-button')
export class Button extends LitElement {
  @consume({ context: tokensContext, subscribe: true })
  tokens: any;

  @property()
  scope = 'Button';

  protected render(): unknown {
    const tokens = this.tokens[this.scope] || {};
    const flattened = Object.entries(tokens)
      .map(([key, value]) => `${key}: ${value};`)
      .join(' ');
    return html`<lion-button style="${flattened}">
      <slot></slot>
    </lion-button>`;
  }
}
