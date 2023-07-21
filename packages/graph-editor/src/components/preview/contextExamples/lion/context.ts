import { LitElement, html } from 'lit';
import { createComponent } from '@lit-labs/react';
import { createContext } from '@lit-labs/context';
import { customElement, property } from 'lit/decorators.js';
import { provide } from '@lit-labs/context';

import React from 'react';

export interface ITokensContext {
  useTokens: (key: string) => any;
}

export const tokensContext = createContext<ITokensContext>('tokens');

@customElement('token-context')
export class TokenContextProviderElement extends LitElement {
  @provide({ context: tokensContext })
  @property()
  context: any;

  render() {
    return html`
      <tokens-provider .value=${this.context}>
        <slot></slot>
      </tokens-provider>
    `;
  }
}

export const TokenContextProvider = createComponent({
  react: React,
  tagName: 'token-context',
  elementClass: TokenContextProviderElement,
});
