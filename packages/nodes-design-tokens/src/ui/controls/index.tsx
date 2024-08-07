import { TOKEN, TOKEN_SET } from '../../schemas/index.js';
import { TokenArrayField } from './tokenArray.js';
import { TokenField } from './token.js';
import { TokenSetField } from './tokenSet.js';
import { VariadicTokenSet } from './variadicTokenSet.js';
import { variadicMatcher } from '@tokens-studio/graph-editor';
import type { DataFlowPort, Input } from '@tokens-studio/graph-engine';

export const controls = [
	{
		matcher: (port: DataFlowPort) => {
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
		matcher: (port: Port) => port.type.$id === TOKEN_SET,
		component: TokenSetField
	},

	{
		matcher: (port: DataFlowPort) => port.type.$id === TOKEN,
		component: TokenField
	},
	{
		matcher: variadicMatcher(TOKEN),
		component: VariadicTokenSet
	}
];
