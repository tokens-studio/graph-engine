import { ExternalTokenSetField } from './externalTokenSet.js';
import { TOKEN } from '../../schemas/index.js';
import { TokenArrayField } from './tokenSet.js';
import { TokenField } from './token.js';
import { VariadicTokenSet } from './variadicTokenSet.js';
import { variadicMatcher } from '@tokens-studio/graph-editor';
import type { Input, Port } from '@tokens-studio/graph-engine';

export const controls = [
	{
		matcher: (port: Port) => {
			const inputPort = port as Input;
			return (
				inputPort.node.nodeType() === 'studio.tokens.design.externalSet' &&
				inputPort.name === 'uri'
			);
		},
		component: ExternalTokenSetField
	},
	{
		matcher: (port: Port) => {
			const inputPort = port as Input;
			return (
				inputPort.type.type === 'array' &&
				inputPort.type.items?.$id === TOKEN &&
				!inputPort.variadic
			);
		},
		component: TokenArrayField
	},
	{
		matcher: (port: Port) => port.type.$id === TOKEN,
		component: TokenField
	},
	{
		matcher: variadicMatcher(TOKEN),
		component: VariadicTokenSet
	}
];
